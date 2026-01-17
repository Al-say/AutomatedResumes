package com.getjobs.application.service;

import com.getjobs.application.entity.AiEntity;
import com.getjobs.application.mapper.AiMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

/**
 * AI 服务（Spring 管理）
 * 从数据库配置获取 BASE_URL、API_KEY、MODEL 并发起 AI 请求。
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class AiService {
    private final ConfigService configService;
    private final AiMapper aiMapper;

    /**
     * 隐藏API密钥，只显示前6位和后4位
     * @param apiKey 原始API密钥
     * @return 隐藏后的密钥字符串
     */
    private String maskApiKey(String apiKey) {
        if (apiKey == null || apiKey.length() < 8) {
            return "INVALID_KEY";
        }
        return apiKey.substring(0, 6) + "********" + apiKey.substring(apiKey.length() - 4);
    }

    /**
     * 发送 AI 请求（非流式）并返回回复内容。
     * @param content 用户消息内容
     * @return AI 回复文本
     */
    public String sendRequest(String content) {
        // 优先从环境变量读取智谱AI配置，如果没有则从数据库读取
        String baseUrl = System.getenv("ZHIPU_BASE_URL");
        String apiKey = System.getenv("ZHIPU_API_KEY");
        String model = System.getenv("ZHIPU_MODEL");

        // 如果智谱环境变量不存在，尝试DeepSeek配置
        if (baseUrl == null || apiKey == null) {
            baseUrl = System.getenv("DEEPSEEK_BASE_URL");
            apiKey = System.getenv("DEEPSEEK_API_KEY");
            model = System.getenv("DEEPSEEK_MODEL");
        }

        // 如果环境变量不存在，则回退到数据库配置
        if (baseUrl == null || apiKey == null) {
            var cfg = configService.getAiConfigs();
            baseUrl = baseUrl != null ? baseUrl : cfg.get("BASE_URL");
            apiKey = apiKey != null ? apiKey : cfg.get("API_KEY");
            model = model != null ? model : cfg.get("MODEL");
        }

        // 如果仍然没有配置，使用智谱默认值
        if (baseUrl == null) baseUrl = "https://open.bigmodel.cn/api/paas/v4";
        if (model == null) model = "glm-4";

        // 校验必需参数
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new RuntimeException("AI API Key 未配置，请设置 ZHIPU_API_KEY 或 DEEPSEEK_API_KEY 环境变量或数据库配置");
        }

        log.info("使用AI配置 - BaseURL: {}, Model: {}, Key: {}...",
                baseUrl, model, maskApiKey(apiKey));

        // 根据模型类型选择兼容的端点（部分“推理/Reasoning”模型需要使用 Responses API）
        String endpoint = isResponsesModel(model)
                ? buildResponsesEndpoint(baseUrl)
                : buildChatCompletionsEndpoint(baseUrl);

        int timeoutInSeconds = 60;

        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(timeoutInSeconds))
                .build();

        // 构建 JSON 请求体
        JSONObject requestData = new JSONObject();
        requestData.put("model", model);
        requestData.put("temperature", 0.5);
        if (endpoint.endsWith("/responses")) {
            // Responses API 采用 input 字段
            requestData.put("input", content);
            // 如需显式控制推理强度，可按需开启：
            // JSONObject reasoning = new JSONObject();
            // reasoning.put("effort", "medium");
            // requestData.put("reasoning", reasoning);
        } else {
            // Chat Completions API 使用 messages
            JSONArray messages = new JSONArray();
            JSONObject message = new JSONObject();
            message.put("role", "user");
            message.put("content", content);
            messages.put(message);
            requestData.put("messages", messages);
        }

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                // 某些服务（例如 Azure OpenAI）需要 api-key 头，额外加一层兼容
                .header("api-key", apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(requestData.toString()))
                .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                JSONObject responseObject = new JSONObject(response.body());

                String requestId = responseObject.optString("id");
                long created = responseObject.optLong("created", 0);
                String usedModel = responseObject.optString("model");

                String responseContent;
                if (endpoint.endsWith("/responses")) {
                    // Responses API：优先读取 output_text
                    responseContent = responseObject.optString("output_text", null);
                    if (responseContent == null || responseContent.isEmpty()) {
                        // 兜底：尝试从通用 choices/message 结构读取（部分代理/兼容层会返回该结构）
                        try {
                            JSONObject messageObject = responseObject.getJSONArray("choices")
                                    .getJSONObject(0)
                                    .getJSONObject("message");
                            responseContent = messageObject.getString("content");
                        } catch (Exception ignore) {
                            responseContent = response.body(); // 最后兜底：返回原始文本，避免空值
                        }
                    }
                } else {
                    // Chat Completions API
                    JSONObject messageObject = responseObject.getJSONArray("choices")
                            .getJSONObject(0)
                            .getJSONObject("message");
                    responseContent = messageObject.getString("content");
                }

                JSONObject usageObject = responseObject.optJSONObject("usage");
                int promptTokens = usageObject != null ? usageObject.optInt("prompt_tokens", -1) : -1;
                int completionTokens = usageObject != null ? usageObject.optInt("completion_tokens", -1) : -1;
                int totalTokens = usageObject != null ? usageObject.optInt("total_tokens", -1) : -1;

                LocalDateTime createdTime = created > 0
                        ? Instant.ofEpochSecond(created).atZone(ZoneId.systemDefault()).toLocalDateTime()
                        : LocalDateTime.now();
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

                log.info("AI响应: id={}, time={}, model={}, promptTokens={}, completionTokens={}, totalTokens={}",
                        requestId, createdTime.format(formatter), usedModel, promptTokens, completionTokens, totalTokens);

                return responseContent;
            } else {
                // 更详细的错误日志，便于定位 400 问题
                log.error("AI请求失败: status={}, endpoint={}, body={}", response.statusCode(), endpoint, response.body());
                // 针对 Responses-only 模型误用 Chat Completions 的常见错误做一次自动重试
                if (!endpoint.endsWith("/responses") && containsReasoningParamError(response.body())) {
                    String fallbackEndpoint = buildResponsesEndpoint(baseUrl);
                    log.warn("检测到 reasoning 相关参数错误，自动切换到 Responses API 重试: {}", fallbackEndpoint);
                    return sendRequestViaResponses(content, apiKey, model, fallbackEndpoint);
                }
                throw new RuntimeException("AI请求失败，状态码: " + response.statusCode() + ", 详情: " + response.body());
            }
        } catch (Exception e) {
            log.error("调用AI服务异常", e);
            throw e instanceof RuntimeException ? (RuntimeException) e : new RuntimeException(e);
        }
    }

    private String normalizeBaseUrl(String baseUrl) {
        if (baseUrl == null) return "";
        String trimmed = baseUrl.trim();
        return trimmed.endsWith("/") ? trimmed.substring(0, trimmed.length() - 1) : trimmed;
    }

    /**
     * 根据配置构造 chat/completions 端点，避免重复拼接 /v1
     */
    private String buildChatCompletionsEndpoint(String baseUrl) {
        String normalized = normalizeBaseUrl(baseUrl);
        // 如果 baseUrl 已经包含 /v1（常见配置为 https://api.openai.com/v1），则只拼接 /chat/completions
        if (normalized.endsWith("/v1") || normalized.contains("/v1/")) {
            return normalized + "/chat/completions";
        }
        return normalized + "/v1/chat/completions";
    }

    /**
     * 构造 Responses API 端点
     */
    private String buildResponsesEndpoint(String baseUrl) {
        String normalized = normalizeBaseUrl(baseUrl);
        if (normalized.endsWith("/v1") || normalized.contains("/v1/")) {
            return normalized + "/responses";
        }
        return normalized + "/v1/responses";
    }

    /**
     * 粗略识别需要使用 Responses API 的模型（o-系列、4.1、reasoner 等）
     */
    private boolean isResponsesModel(String model) {
        if (model == null) return false;
        String m = model.toLowerCase();
        return m.contains("o1") || m.contains("o3") || m.contains("o4")
                || m.contains("4.1") || m.contains("reasoner")
                || m.contains("4o-mini") || m.contains("gpt-4o-mini");
    }

    /**
     * 检查错误响应中是否包含 reasoning 相关参数错误（如 reasoning.summary unsupported_value）
     */
    private boolean containsReasoningParamError(String body) {
        if (body == null) return false;
        String s = body.toLowerCase();
        return (s.contains("reasoning") && s.contains("unsupported_value"))
                || s.contains("reasoning.summary");
    }

    /**
     * 使用 Responses API 发送一次请求（用于自动降级/重试）
     */
    private String sendRequestViaResponses(String content, String apiKey, String model, String endpoint) {
        int timeoutInSeconds = 60;
        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(timeoutInSeconds))
                .build();

        JSONObject requestData = new JSONObject();
        requestData.put("model", model);
        requestData.put("temperature", 0.5);
        requestData.put("input", content);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .header("api-key", apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(requestData.toString()))
                .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                JSONObject resp = new JSONObject(response.body());
                String outputText = resp.optString("output_text", null);
                if (outputText != null && !outputText.isEmpty()) {
                    return outputText;
                }
                // 兜底解析：部分兼容层可能返回 choices/message 结构
                try {
                    JSONObject messageObject = resp.getJSONArray("choices")
                            .getJSONObject(0)
                            .getJSONObject("message");
                    return messageObject.getString("content");
                } catch (Exception ignore) {
                }
                // 无法解析则直接返回原始体，避免空值中断流程
                return response.body();
            }
            log.error("Responses API 调用失败: status={}, endpoint={}, body={}", response.statusCode(), endpoint, response.body());
            throw new RuntimeException("AI请求失败，状态码: " + response.statusCode() + ", 详情: " + response.body());
        } catch (Exception e) {
            log.error("Responses API 调用异常", e);
            throw e instanceof RuntimeException ? (RuntimeException) e : new RuntimeException(e);
        }
    }

    // ================= 合并的 AI 配置管理方法 =================

    /**
     * 获取AI配置（获取最新一条，如果不存在则创建默认配置）
     */
    @Transactional(readOnly = true)
    public AiEntity getAiConfig() {
        var list = aiMapper.selectList(null);
        AiEntity aiEntity = (list == null || list.isEmpty()) ? null : list.get(list.size() - 1);
        if (aiEntity == null) {
            aiEntity = createDefaultConfig();
        }
        return aiEntity;
    }

    /**
     * 获取所有AI配置
     */
    @Transactional(readOnly = true)
    public java.util.List<AiEntity> getAllAiConfigs() {
        return aiMapper.selectList(null);
    }

    /**
     * 根据ID获取AI配置
     */
    @Transactional(readOnly = true)
    public AiEntity getAiConfigById(Long id) {
        return aiMapper.selectById(id);
    }

    /**
     * 保存或更新AI配置（introduce/prompt）
     */
    @Transactional
    public AiEntity saveOrUpdateAiConfig(String introduce, String prompt) {
        var list = aiMapper.selectList(null);
        AiEntity aiEntity = (list == null || list.isEmpty()) ? null : list.get(list.size() - 1);

        if (aiEntity == null) {
            aiEntity = new AiEntity();
            aiEntity.setIntroduce(introduce);
            aiEntity.setPrompt(prompt);
            aiEntity.setCreatedAt(java.time.LocalDateTime.now());
            aiEntity.setUpdatedAt(java.time.LocalDateTime.now());
            aiMapper.insert(aiEntity);
            log.info("创建新的AI配置，ID: {}", aiEntity.getId());
        } else {
            aiEntity.setIntroduce(introduce);
            aiEntity.setPrompt(prompt);
            aiEntity.setUpdatedAt(java.time.LocalDateTime.now());
            aiMapper.updateById(aiEntity);
            log.info("更新AI配置，ID: {}", aiEntity.getId());
        }

        return aiEntity;
    }

    /**
     * 删除AI配置
     */
    @Transactional
    public boolean deleteAiConfig(Long id) {
        int result = aiMapper.deleteById(id);
        if (result > 0) {
            log.info("删除AI配置成功，ID: {}", id);
            return true;
        }
        return false;
    }

    /**
     * 创建默认配置
     */
    @Transactional
    protected AiEntity createDefaultConfig() {
        AiEntity aiEntity = new AiEntity();
        aiEntity.setIntroduce("请在此填写您的技能介绍");
        aiEntity.setPrompt("请在此填写AI提示词模板");
        aiEntity.setCreatedAt(java.time.LocalDateTime.now());
        aiEntity.setUpdatedAt(java.time.LocalDateTime.now());
        aiMapper.insert(aiEntity);
        log.info("创建默认AI配置，ID: {}", aiEntity.getId());
        return aiEntity;
    }

    /**
     * 测试AI连接（支持智谱和DeepSeek）
     * @return 测试结果
     */
    public String testDeepSeekConnection() {
        try {
            String testMessage = "你好，请简单回复一个字：是";
            String response = sendRequest(testMessage);
            return "AI连接成功，响应: " + response;
        } catch (Exception e) {
            log.error("AI连接测试失败", e);
            return "AI连接失败: " + e.getMessage();
        }
    }

    /**
     * 获取当前使用的AI配置信息（用于调试）
     * @return 配置信息字符串
     */
    public String getCurrentAiConfig() {
        StringBuilder config = new StringBuilder();
        config.append("AI配置信息:\n");

        // 智谱AI环境变量配置
        String zhipuBaseUrl = System.getenv("ZHIPU_BASE_URL");
        String zhipuApiKey = System.getenv("ZHIPU_API_KEY");
        String zhipuModel = System.getenv("ZHIPU_MODEL");

        if (zhipuBaseUrl != null || zhipuApiKey != null) {
            config.append("- 智谱AI环境变量配置:\n");
            config.append("  ZHIPU_BASE_URL: ").append(zhipuBaseUrl != null ? zhipuBaseUrl : "未设置").append("\n");
            config.append("  ZHIPU_API_KEY: ").append(zhipuApiKey != null ? maskApiKey(zhipuApiKey) : "未设置").append("\n");
            config.append("  ZHIPU_MODEL: ").append(zhipuModel != null ? zhipuModel : "未设置").append("\n");
        }

        // DeepSeek环境变量配置
        String envBaseUrl = System.getenv("DEEPSEEK_BASE_URL");
        String envApiKey = System.getenv("DEEPSEEK_API_KEY");
        String envModel = System.getenv("DEEPSEEK_MODEL");

        if (envBaseUrl != null || envApiKey != null) {
            config.append("- DeepSeek环境变量配置:\n");
            config.append("  DEEPSEEK_BASE_URL: ").append(envBaseUrl != null ? envBaseUrl : "未设置").append("\n");
            config.append("  DEEPSEEK_API_KEY: ").append(envApiKey != null ? maskApiKey(envApiKey) : "未设置").append("\n");
            config.append("  DEEPSEEK_MODEL: ").append(envModel != null ? envModel : "未设置").append("\n");
        }

        // 数据库配置（回退选项）
        try {
            var cfg = configService.getAiConfigs();
            config.append("- 数据库配置:\n");
            config.append("  BASE_URL: ").append(cfg.get("BASE_URL")).append("\n");
            config.append("  API_KEY: ").append(maskApiKey(cfg.get("API_KEY"))).append("\n");
            config.append("  MODEL: ").append(cfg.get("MODEL")).append("\n");
        } catch (Exception e) {
            config.append("- 数据库配置: 读取失败\n");
        }

        return config.toString();
    }
}