package com.getjobs.application.runner;

import com.getjobs.application.config.CrawlingConfig;
import com.getjobs.worker.manager.PlaywrightManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * 应用启动器
 * 在Spring Boot应用启动完成后执行，用于处理自动启动逻辑
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CrawlingApplicationRunner implements ApplicationRunner {

    private final CrawlingConfig crawlingConfig;
    private final PlaywrightManager playwrightManager;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        log.info("应用启动完成，开始检查爬取配置...");

        // 检查命令行参数
        boolean forceAutoStart = args.containsOption("auto-crawl");
        boolean forceManual = args.containsOption("manual-only");

        if (forceManual) {
            log.info("检测到命令行参数 --manual-only，跳过自动启动爬取");
            return;
        }

        // 检查是否通过命令行强制启动
        if (forceAutoStart) {
            log.info("检测到命令行参数 --auto-crawl，强制启动自动爬取");
            startAutoCrawling();
            return;
        }

        // 检查配置文件
        if (crawlingConfig.isAutoStart()) {
            log.info("配置文件中 auto-start=true，启动自动爬取");
            startAutoCrawling();
        } else {
            log.info("配置文件中 auto-start=false，仅支持手动API控制爬取");
        }
    }

    /**
     * 启动自动爬取
     */
    private void startAutoCrawling() {
        try {
            String keyword = crawlingConfig.getDefaultKeyword();
            String city = crawlingConfig.getDefaultCity();
            String platforms = crawlingConfig.getDefaultPlatforms();

            log.info("开始自动爬取 - 关键词: {}, 城市: {}, 平台: {}", keyword, city, platforms);

            // 异步启动爬取，避免阻塞应用启动
            new Thread(() -> {
                try {
                    Thread.sleep(5000); // 等待5秒让应用完全启动
                    playwrightManager.startCrawling(keyword, city, platforms);
                } catch (Exception e) {
                    log.error("自动爬取启动失败", e);
                }
            }, "AutoCrawlingThread").start();

        } catch (Exception e) {
            log.error("启动自动爬取时发生异常", e);
        }
    }
}