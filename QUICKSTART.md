# 🚀 快速开始指南

## 1. 环境准备
```bash
# 确保安装JDK 21+
java -version

# 确保安装Node.js 18+
node -version

# 确保安装Gradle
gradle -v
```

## 2. 克隆和配置
```bash
# 克隆项目
git clone https://github.com/loks666/get_jobs.git
cd get_jobs

# 复制环境变量模板
cp .env.example .env

# 编辑.env文件，填入你的AI配置
vim .env  # 或使用其他编辑器
```

## 3. 一键启动（推荐）
```bash
# 使用启动脚本（自动安装依赖并启动服务）
./start.sh
```

## 4. 手动启动
```bash
# 配置环境变量
source .env  # 或手动设置export

# 启动后端
./gradlew bootRun

# 新终端启动前端
cd front
pnpm install  # 或 npm install
pnpm dev      # 或 npm run dev
```

## 5. 验证安装
```bash
# 运行API测试
./test-api.sh
```

## 6. 使用步骤
1. 浏览器访问 http://localhost:6866
2. 在各招聘平台手动登录一次
3. 配置搜索关键词和城市
4. 点击"开始投递"

## ⚠️ 重要提醒
- Boss直聘每日上限150次
- 关闭墙外代理
- 定期检查登录状态
- 遵守平台规则，避免被封号

更多详情请查看 [USAGE.md](USAGE.md)</content>
<parameter name="filePath">/Users/alsay_mac/Synchronization/Github_File/AutomatedResumes/QUICKSTART.md