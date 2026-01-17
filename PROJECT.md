# 📁 项目结构说明

```
AutomatedResumes/
├── 📄 README.md                 # 项目说明
├── 📄 USAGE.md                  # 详细使用文档
├── 📄 QUICKSTART.md             # 快速开始指南
├── 📄 TROUBLESHOOTING.md        # 故障排除指南
├── 📄 .env.example              # 环境变量模板
├── 📄 .gitignore                # Git忽略文件
├── 🔧 start.sh                  # 一键启动脚本
├── 🔍 test-api.sh               # API测试脚本
├── 📦 build.gradle.kts          # Gradle构建配置
├── 🔧 gradlew                   # Gradle包装器
├── 📁 src/main/java/com/getjobs/ # 后端源码
│   ├── 📄 GetJobsApplication.java    # 应用入口
│   ├── 📁 application/               # 应用层代码
│   │   ├── 📁 config/                # 配置类
│   │   ├── 📁 controller/            # REST控制器
│   │   ├── 📁 service/               # 业务服务
│   │   └── 📁 entity/                # 数据实体
│   └── 📁 worker/                    # 工作线程
│       ├── 📁 manager/               # 管理器
│       └── 📁 platform/              # 平台实现
├── 📁 src/main/resources/       # 后端资源文件
│   ├── 📄 application.yaml       # 应用配置
│   └── 📁 static/               # 静态资源
├── 📁 front/                    # 前端项目
│   ├── 📄 package.json           # 前端依赖
│   ├── 📄 next.config.ts         # Next.js配置
│   ├── 📁 app/                   # Next.js App Router
│   ├── 📁 components/            # React组件
│   ├── 📁 lib/                   # 工具库
│   └── 📁 public/                # 静态资源
├── 📁 db/                       # 数据库文件
├── 📁 doc/                      # 文档目录
└── 📁 build/                    # 构建输出
```

## 🔍 核心文件说明

### 后端核心文件
- `GetJobsApplication.java` - Spring Boot应用启动类
- `AiService.java` - AI服务集成（智谱AI/DeepSeek）
- `CrawlingController.java` - 爬取控制API
- `PlaywrightManager.java` - 浏览器自动化管理

### 前端核心文件
- `app/page.tsx` - 主页面
- `app/api/` - Next.js API路由
- `components/` - UI组件库

### 配置文件
- `application.yaml` - Spring Boot配置
- `build.gradle.kts` - 项目构建配置
- `.env` - 环境变量（需要手动创建）

## 🚀 快速定位

### 新手入门
1. 查看 [QUICKSTART.md](QUICKSTART.md)
2. 运行 `./start.sh`
3. 访问 http://localhost:6866

### 开发调试
1. 查看 [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. 运行 `./test-api.sh`
3. 检查日志文件

### 功能扩展
- 后端API: `src/main/java/com/getjobs/application/controller/`
- 前端页面: `front/app/`
- 平台支持: `src/main/java/com/getjobs/worker/platform/`

## 📝 开发规范

### 代码组织
- 后端按功能模块划分包结构
- 前端使用组件化开发
- 配置文件集中管理

### 命名约定
- 类名: PascalCase
- 方法名: camelCase
- 常量: UPPER_SNAKE_CASE
- 文件名: kebab-case

### 提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试相关
chore: 构建/工具
```</content>
<parameter name="filePath">/Users/alsay_mac/Synchronization/Github_File/AutomatedResumes/PROJECT.md