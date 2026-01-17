package com.getjobs.application.init;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;
 

/**
 * 应用启动时：
 * 1) 创建 zhilian_option 表（若不存在）
 * 2) 从 city.json 解析城市码并插入（若不存在）
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ZhilianOptionInitializer implements CommandLineRunner {

    private final DataSource dataSource;

    @Override
    public void run(String... args) throws Exception {
        ensureTableExists();
        // 已改为从数据库获取城市选项，移除基于 city.json 的种子插入逻辑
    }

    private void ensureTableExists() {
        String ddl = "CREATE TABLE IF NOT EXISTS zhilian_option (" +
                " id INTEGER PRIMARY KEY AUTOINCREMENT," +
                " type VARCHAR(50)," +
                " name VARCHAR(100)," +
                " code VARCHAR(100)," +
                " sort_order INTEGER," +
                " created_at DATETIME," +
                " updated_at DATETIME" +
                ")";
        try (Connection conn = dataSource.getConnection(); Statement stmt = conn.createStatement()) {
            stmt.execute(ddl);
            log.info("确保 zhilian_option 表已存在");
        } catch (Exception e) {
            log.warn("创建 zhilian_option 表失败: {}", e.getMessage());
        }
    }
}