# 🚀 AutomatedResumes 项目启动完全指南

## 📌 项目概览

- **项目名称**: AutomatedResumes (工作无忧)
- **后端框架**: Spring Boot 3.5.7
- **前端框架**: Next.js + TypeScript
- **构建工具**: Gradle
- **Java版本**: JDK 21+
- **数据库**: SQLite

---

## 🏃 快速启动 (3步)

### 第1步: 打开项目目录
```bash
cd e:\BaiduSyncdisk\Github_File\AutomatedResumes
```

### 第2步: 选择启动方式

#### 💻 Windows 用户
```cmd
# 方式1: 双击运行 (推荐)
run-backend.bat

# 方式2: 手动命令
gradlew bootRun
```

#### 🍎 Mac/Linux 用户
```bash
# 方式1: 运行脚本 (推荐)
chmod +x run-backend.sh
./run-backend.sh

# 方式2: 手动命令
./gradlew bootRun
```

### 第3步: 等待启动完成
看到 `Started GetJobsApplication` 日志表示启动成功。

---

## ✨ 启动成功标志

```
2026-01-17 13:45:25.456 INFO --- [main] c.getjobs.GetJobsApplication : Started GetJobsApplication in 5.234 seconds
```

此时可以访问:
- **Web界面**: http://localhost:8888/
- **API接口**: http://localhost:8888/api/jobs

---

## 📁 启动脚本说明

| 文件 | 用途 | 使用场景 |
|------|------|---------|
| `run-backend.bat` | Windows CMD脚本 | Windows用户 |
| `run-backend.ps1` | PowerShell脚本 | Windows PowerShell用户 |
| `run-backend.sh` | Bash脚本 | Linux/Mac用户 |

---

## 🔧 手动启动命令

如果脚本不工作，可以直接运行：

```bash
# 清理构建
.\gradlew clean

# 构建项目
.\gradlew build

# 启动应用
.\gradlew bootRun

# 或构建并启动
.\gradlew clean build bootRun
```

---

## 🌐 访问地址

启动成功后，可以访问以下地址：

| 地址 | 说明 |
|------|------|
| http://localhost:8888/ | Web主页 |
| http://localhost:8888/dist/ | 前端页面 (若存在) |
| http://localhost:8888/api/ | API基础路径 |

---

## ⚙️ 配置文件说明

### 主配置文件
**位置**: `src/main/resources/application.yaml`

关键配置:
```yaml
server:
  port: 8888                           # 服务端口
  
spring:
  datasource:
    url: jdbc:sqlite:./db/getjobs.db  # 数据库路径
    driver-class-name: org.sqlite.JDBC
    
  env:
    ZHIPU_API_KEY: xxx                 # 智谱AI密钥
    ZHIPU_BASE_URL: https://...        # AI服务地址
```

### 修改端口
如果8888被占用，编辑上述配置文件改为其他端口：
```yaml
server:
  port: 8889  # 改为其他端口
```

---

## 🐛 常见问题解决

### ❓ 问题1: 启动特别慢
**原因**: 首次启动下载依赖
**解决**:
- 首次启动可能需要5-15分钟
- 确保网络连接稳定
- 可以使用代理或镜像源加速

### ❓ 问题2: 端口已被占用
**错误**: `Address already in use: bind`
**解决**: 
```yaml
# 编辑 src/main/resources/application.yaml
server:
  port: 8889  # 改为其他端口
```

### ❓ 问题3: Java未找到
**错误**: `java: 命令未找到`
**解决**:
1. 确认已安装 JDK 21+
2. 配置 JAVA_HOME 环境变量
3. 重启终端

### ❓ 问题4: 内存不足
**错误**: `OutOfMemoryError`
**解决**:
```powershell
# PowerShell
$env:JAVA_OPTS = "-Xmx2g -Xms512m"
.\gradlew bootRun
```

### ❓ 问题5: Gradle下载失败
**原因**: 网络问题或镜像源不稳定
**解决**:
```properties
# 编辑 gradle.properties
maven_url=https://maven.aliyun.com/repository/public
```

### ❓ 问题6: 数据库错误
**错误**: `sqlite database is locked`
**解决**:
1. 关闭其他使用数据库的进程
2. 删除 `.db-journal` 文件（如存在）
3. 重启应用

---

## 📊 依赖清单

### 核心依赖
- ✅ Spring Boot 3.5.7
- ✅ Spring Web (REST API)
- ✅ Spring JDBC (数据库)
- ✅ MyBatis Plus 3.5.9

### 数据库
- ✅ SQLite JDBC 3.45.1.0
- ✅ Hikari 连接池

### 浏览器自动化
- ✅ Playwright 1.51.0

### 工具库
- ✅ HttpClient5 (HTTP请求)
- ✅ Jackson (JSON/YAML解析)
- ✅ Lombok (代码简化)

---

## 📚 相关文档

| 文档 | 说明 |
|------|------|
| [BACKEND_RUN.md](BACKEND_RUN.md) | 后端启动详细指南 |
| [QUICKSTART.md](QUICKSTART.md) | 5分钟快速开始 |
| [USAGE.md](USAGE.md) | 功能使用说明 |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | 问题排查 |
| [PROJECT.md](PROJECT.md) | 项目结构 |

---

## 🚀 进阶用法

### 启动前端 (可选)
```bash
cd front
pnpm install  # 或 npm install
pnpm dev      # 或 npm run dev
```
前端将在 http://localhost:3000 启动

### 配置AI服务
编辑 `src/main/resources/application.yaml`:
```yaml
spring:
  env:
    ZHIPU_API_KEY: "your_api_key_here"
    ZHIPU_BASE_URL: "https://open.bigmodel.cn/api/paas/v4"
    ZHIPU_MODEL: "glm-4"
```

### 使用环境变量
```bash
# Linux/Mac
export ZHIPU_API_KEY="xxx"
./gradlew bootRun

# Windows PowerShell
$env:ZHIPU_API_KEY = "xxx"
.\gradlew bootRun
```

---

## 🛑 停止应用

在启动终端按 **`Ctrl+C`** 即可优雅关闭应用。

---

## 📞 获取帮助

- 📖 查看本项目文档
- 🐛 提交 GitHub Issues
- 💬 加入 QQ 交流群
- 🔗 访问项目主页: https://github.com/loks666/get_jobs

---

## ✅ 验证清单

启动前，确认以下项已完成:

- [ ] JDK 21+ 已安装
- [ ] Gradle Wrapper 可用
- [ ] 项目文件完整
- [ ] 数据库文件存在 (db/getjobs.db)
- [ ] 网络连接正常
- [ ] 8888 端口未被占用

---

**祝你使用愉快!** 🎉
