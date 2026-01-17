#!/bin/bash

# API测试脚本
# 使用方法: ./test-api.sh

BASE_URL="http://localhost:8888"

echo "🔍 测试自动化简历投递系统API..."

# 测试健康检查
echo "1. 测试健康检查..."
curl -s -o /dev/null -w "   状态码: %{http_code}\n" "$BASE_URL/api/health"

# 测试AI配置信息
echo "2. 测试AI配置..."
curl -s "$BASE_URL/api/ai/config-info" | head -5

# 测试AI连接
echo "3. 测试智谱AI连接..."
response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$BASE_URL/api/ai/test/zhipu")
http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
body=$(echo $response | sed -e 's/HTTPSTATUS:.*//g')

if [ "$http_code" -eq 200 ]; then
    echo "   ✅ AI连接成功"
    echo "   响应: $body" | head -1
else
    echo "   ❌ AI连接失败 (HTTP $http_code)"
fi

# 测试爬取状态
echo "4. 测试爬取状态..."
curl -s "$BASE_URL/api/crawl/status" | grep -o '"success":[^,]*' | head -1

echo ""
echo "📊 测试完成！"
echo "💡 如果AI测试失败，请检查环境变量配置"</content>
<parameter name="filePath">/Users/alsay_mac/Synchronization/Github_File/AutomatedResumes/test-api.sh