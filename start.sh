#!/bin/bash

# 自动化简历投递系统启动脚本
# 使用方法: ./start.sh

echo "🚀 启动自动化简历投递系统..."

# 检查Java环境
if ! command -v java &> /dev/null; then
    echo "❌ 请先安装JDK 21+"
    exit 1
fi

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装Node.js 18+"
    exit 1
fi

# 检查环境变量
if [ -z "$ZHIPU_API_KEY" ]; then
    echo "⚠️  警告: 未配置ZHIPU_API_KEY环境变量"
    echo "请运行: export ZHIPU_API_KEY='你的API密钥'"
fi

echo "📦 安装前端依赖..."
cd front
if command -v pnpm &> /dev/null; then
    pnpm install
else
    npm install
fi

echo "🔧 编译后端..."
cd ..
./gradlew compileJava

echo "🎯 启动后端服务..."
./gradlew bootRun &
BACKEND_PID=$!

echo "⏳ 等待后端启动..."
sleep 10

echo "🌐 启动前端服务..."
cd front
if command -v pnpm &> /dev/null; then
    pnpm dev &
else
    npm run dev &
fi
FRONTEND_PID=$!

echo ""
echo "✅ 服务启动完成！"
echo "📱 前端地址: http://localhost:6866"
echo "🔧 后端地址: http://localhost:8888"
echo ""
echo "按 Ctrl+C 停止服务"

# 等待用户中断
trap "echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait</content>
<parameter name="filePath">/Users/alsay_mac/Synchronization/Github_File/AutomatedResumes/start.sh