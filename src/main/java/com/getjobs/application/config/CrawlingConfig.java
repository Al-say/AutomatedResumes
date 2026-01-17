package com.getjobs.application.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 爬取配置类
 * 从application.yaml中读取爬取相关配置
 */
@Data
@Component
@ConfigurationProperties(prefix = "crawling")
public class CrawlingConfig {

    /**
     * 是否自动启动爬取
     * true: 应用启动时自动开始爬取
     * false: 仅通过API手动控制
     */
    private boolean autoStart = false;

    /**
     * 默认搜索关键词
     */
    private String defaultKeyword = "Java开发工程师";

    /**
     * 默认搜索城市
     */
    private String defaultCity = "北京";

    /**
     * 默认平台列表（逗号分隔）
     */
    private String defaultPlatforms = "boss,liepin,51job,zhilian";
}