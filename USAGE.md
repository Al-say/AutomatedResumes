# 自动化简历投递系统使用文档

## � 文档导航

- 🚀 **[快速开始](QUICKSTART.md)** - 5分钟上手指南
- 📖 **[详细文档](USAGE.md)** - 完整使用说明
- 🔧 **[故障排除](TROUBLESHOOTING.md)** - 常见问题解决方案
- 🛠️ **[环境配置](https://github.com/loks666/get_jobs/wiki/环境配置)** - 开发环境搭建

## �📖 项目简介

这是一个基于Spring Boot + Next.js开发的自动化简历投递系统，支持在多个招聘平台（Boss直聘、猎聘、51job、智联招聘）上自动投递简历，并集成AI智能匹配功能。

### ✨ 主要功能
- 🖥️ 图形化Web界面管理
- 🤖 AI智能岗位匹配和打招呼语生成
- 📷 自动发送图片简历
- 🔄 支持多个招聘平台
- 📢 企业微信消息推送
- 🚫 智能过滤和黑名单功能

## 🛠️ 环境要求

- **JDK**: 21+
- **Node.js**: 18+
- **Gradle**: 8.0+
- **浏览器**: Chrome/Chromium

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/loks666/get_jobs.git
cd get_jobs
```

### 2. 后端配置

#### 配置AI环境变量（推荐）
```bash
# 编辑 ~/.zshrc 或 ~/.bash_profile
export ZHIPU_API_KEY="你的智谱AI API密钥"
export ZHIPU_BASE_URL="https://open.bigmodel.cn/api/paas/v4"
export ZHIPU_MODEL="glm-4"

# 重新加载配置
source ~/.zshrc
```

#### 启动后端服务
```bash
./gradlew bootRun
```
服务将在 http://localhost:8888 启动

### 3. 前端配置

#### 安装依赖
```bash
cd front
npm install
# 或使用pnpm
pnpm install
```

#### 启动前端服务
```bash
npm run dev
# 或使用pnpm
pnpm dev
```
前端将在 http://localhost:6866 启动

## ⚙️ 配置说明

### AI配置
系统支持智谱AI和DeepSeek两种AI服务：

**智谱AI配置：**
- API_KEY: 从[智谱AI官网](https://open.bigmodel.cn/)获取
- BASE_URL: `https://open.bigmodel.cn/api/paas/v4`
- MODEL: `glm-4`、`glm-3-turbo`、`glm-4v`等

**DeepSeek配置：**
- API_KEY: 从[DeepSeek官网](https://platform.deepseek.com/)获取
- BASE_URL: `https://api.deepseek.com`
- MODEL: `deepseek-chat`、`deepseek-reasoner`

### 企业微信推送（可选）
```bash
export HOOK_URL="https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=你的机器人key"
```

## 🎯 使用方法

### 1. 访问Web界面
打开浏览器访问 http://localhost:6866

### 2. 配置AI
在Web界面中配置AI参数，或使用环境变量

### 3. 登录招聘平台
首次使用需要在各平台手动登录，系统会自动保存Cookie

### 4. 开始投递
通过Web界面或API启动简历投递：

```bash
POST http://localhost:8888/api/crawl/start
Content-Type: application/json

{
  "keyword": "Java开发工程师",
  "city": "北京",
  "platforms": "boss,liepin,51job,zhilian"
}
```

## 📊 API接口

### 核心API
- `GET /api/health` - 健康检查
- `POST /api/crawl/start` - 开始投递
- `POST /api/crawl/stop` - 停止投递
- `GET /api/crawl/status` - 获取状态
- `GET /api/ai/test/zhipu` - 测试AI连接

### 参数说明
- `keyword`: 搜索关键词（如"Java开发工程师"）
- `city`: 城市名称（如"北京"）
- `platforms`: 平台列表，用逗号分隔

## ⚠️ 注意事项

### 平台限制
- **Boss直聘**: 每日投递上限150次，支持AI打招呼
- **猎聘**: 主动发消息有上限，推荐使用App设置打招呼语
- **51job**: 投递有上限，不推荐使用
- **智联招聘**: 投递上限约100次，目前存在问题

### 使用建议
1. 不要依赖程序投递Boss，手机端更可靠
2. Boss投递后建议第二天继续，避免被封号
3. 关闭墙外代理，确保页面加载正常
4. 定期检查登录状态，及时重新登录

### 安全提醒
- 请勿用于商业用途
- 遵守各平台的投递规则
- 避免过度投递导致账号被封

## 🔧 故障排除

### 常见问题
1. **AI连接失败**: 检查API密钥和网络连接
2. **浏览器启动失败**: 确保Chrome/Chromium已安装
3. **登录失效**: 需要重新扫码登录各平台
4. **投递失败**: 检查平台限制和账号状态

### 日志查看
```bash
# 查看后端日志
tail -f logs/application.log

# 查看前端日志
cd front && npm run dev
```

## 📞 技术支持

- QQ交流群: [点击加入](https://github.com/loks666/get_jobs)
- GitHub Issues: [提交问题](https://github.com/loks666/get_jobs/issues)
- 文档: [Wiki](https://github.com/loks666/get_jobs/wiki)

## 📝 更新日志

请查看 [CHANGELOG.md](CHANGELOG.md) 或 GitHub Releases 获取最新更新信息。

---

**最后更新**: 2026年1月17日</content>
<parameter name="filePath">/Users/alsay_mac/Synchronization/Github_File/AutomatedResumes/USAGE.md