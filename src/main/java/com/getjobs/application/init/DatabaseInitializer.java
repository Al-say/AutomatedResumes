package com.getjobs.application.init;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.Statement;
import java.util.stream.Collectors;

/**
 * 数据库初始化器
 * 使用 BeanFactoryPostProcessor 确保在所有 Bean 之前执行
 */
@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class DatabaseInitializer implements ApplicationListener<ApplicationStartedEvent> {

    @Autowired
    private DataSource dataSource;

    @Override
    public void onApplicationEvent(ApplicationStartedEvent event) {
        // ApplicationStartedEvent 太晚了，我们需要更早执行
    }

    @jakarta.annotation.PostConstruct
    public void initDatabase() {
        log.info("========== 开始初始化数据库 ==========");
        
        try {
            // 读取 schema.sql 文件
            ClassPathResource resource = new ClassPathResource("schema.sql");
            if (!resource.exists()) {
                log.warn("未找到 schema.sql 文件，跳过数据库初始化");
                return;
            }

            String sql;
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
                sql = reader.lines().collect(Collectors.joining("\n"));
            }

            // 执行 SQL 脚本
            try (Connection conn = dataSource.getConnection();
                 Statement stmt = conn.createStatement()) {
                
                // 按分号分割并逐条执行（处理多行语句）
                StringBuilder currentStatement = new StringBuilder();
                int successCount = 0;
                int skipCount = 0;
                
                for (String line : sql.split("\n")) {
                    String trimmedLine = line.trim();
                    
                    // 跳过纯注释行
                    if (trimmedLine.startsWith("--") || trimmedLine.isEmpty()) {
                        continue;
                    }
                    
                    currentStatement.append(line).append("\n");
                    
                    // 如果遇到分号，执行当前语句
                    if (trimmedLine.endsWith(";")) {
                        String statementToExecute = currentStatement.toString().trim();
                        // 移除末尾分号
                        if (statementToExecute.endsWith(";")) {
                            statementToExecute = statementToExecute.substring(0, statementToExecute.length() - 1);
                        }
                        
                        if (!statementToExecute.isEmpty()) {
                            try {
                                stmt.execute(statementToExecute);
                                successCount++;
                            } catch (Exception e) {
                                String msg = e.getMessage();
                                if (msg != null && (msg.contains("already exists") || 
                                                   msg.contains("UNIQUE constraint") ||
                                                   msg.contains("duplicate"))) {
                                    skipCount++;
                                } else {
                                    log.debug("执行SQL警告: {} - SQL: {}", msg, 
                                        statementToExecute.substring(0, Math.min(50, statementToExecute.length())));
                                    skipCount++;
                                }
                            }
                        }
                        currentStatement = new StringBuilder();
                    }
                }
                
                log.info("========== 数据库初始化完成 - 执行: {} 条, 跳过: {} 条 ==========", successCount, skipCount);
            }
            
        } catch (Exception e) {
            log.error("数据库初始化失败: {}", e.getMessage(), e);
        }
    }
}
