package com.getjobs.application.controller;

import com.getjobs.worker.manager.PlaywrightManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * 爬取控制控制器
 * 提供手动控制爬取操作的HTTP API
 */
@Slf4j
@RestController
@RequestMapping("/api/crawl")
@RequiredArgsConstructor
public class CrawlController {

    private final PlaywrightManager playwrightManager;

    /**
     * 启动爬取任务
     * POST /api/crawl/start
     *
     * 请求体参数：
     * - keyword: 搜索关键词（可选，默认使用配置的关键词）
     * - city: 城市（可选，默认使用配置的城市）
     * - platforms: 平台列表，逗号分隔（可选，默认所有平台）
     *   支持：boss,liepin,51job,zhilian
     */
    @PostMapping("/start")
    public ResponseEntity<Map<String, Object>> startCrawling(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String keyword = (String) request.get("keyword");
            String city = (String) request.get("city");
            String platforms = (String) request.get("platforms");

            log.info("收到爬取启动请求 - 关键词: {}, 城市: {}, 平台: {}", keyword, city, platforms);

            // 验证参数
            if (keyword == null || keyword.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "关键词不能为空");
                return ResponseEntity.badRequest().body(response);
            }

            if (city == null || city.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "城市不能为空");
                return ResponseEntity.badRequest().body(response);
            }

            // 异步启动爬取任务
            CompletableFuture.runAsync(() -> {
                try {
                    playwrightManager.startCrawling(keyword, city, platforms);
                    log.info("爬取任务启动成功 - 关键词: {}, 城市: {}", keyword, city);
                } catch (Exception e) {
                    log.error("爬取任务执行失败", e);
                }
            });

            response.put("success", true);
            response.put("message", "爬取任务已启动");
            response.put("data", Map.of(
                    "keyword", keyword,
                    "city", city,
                    "platforms", platforms != null ? platforms : "all"
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("启动爬取任务失败", e);
            response.put("success", false);
            response.put("message", "启动爬取任务失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 停止所有爬取任务
     * POST /api/crawl/stop
     */
    @PostMapping("/stop")
    public ResponseEntity<Map<String, Object>> stopCrawling() {
        Map<String, Object> response = new HashMap<>();

        try {
            playwrightManager.stopCrawling();
            response.put("success", true);
            response.put("message", "爬取任务已停止");
            log.info("通过API停止爬取任务成功");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("停止爬取任务失败", e);
            response.put("success", false);
            response.put("message", "停止爬取任务失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * 获取爬取状态
     * GET /api/crawl/status
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getCrawlingStatus() {
        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, Object> status = playwrightManager.getCrawlingStatus();
            response.put("success", true);
            response.put("data", status);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("获取爬取状态失败", e);
            response.put("success", false);
            response.put("message", "获取爬取状态失败: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}