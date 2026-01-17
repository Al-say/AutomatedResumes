# 🚀 AutomatedResumes 后端启动指南

## 📌 快速启动

你的后端已准备完毕，可以立即启动！

### **一键启动（推荐）**

#### Windows (PowerShell)
```powershell
.\run-backend.ps1
```

#### Windows (CMD)
```cmd
run-backend.bat
```

#### Linux/Mac
```bash
./run-backend.sh
# 或
./gradlew bootRun
```

---

## 🎯 启动状态检查

| 环境 | 状态 | 说明 |
|------|------|------|
| **Java版本** | ✅ | JDK 21+ (当前: OpenJDK 23.0.2) |
| **Gradle** | ✅ | 已配置Wrapper模式 |
| **Spring Boot** | ✅ | v3.5.7 |
| **数据库** | ✅ | SQLite (db/getjobs.db) |
| **端口** | ✅ | 8888 (已配置) |

---

## 🌐 启动完成后访问

启动成功后，打开浏览器访问：

- **🏠 主页面**: [http://localhost:8888/](http://localhost:8888/)
- **📊 数据页面**: [http://localhost:8888/dist/](http://localhost:8888/dist/)
- **📡 API测试**: [http://localhost:8888/api/jobs](http://localhost:8888/api/jobs)

---

## 📋 启动日志示例

成功启动后，你会看到：

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_|\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot :: (v3.5.7)

2026-01-17 13:45:20.123  INFO 12345 --- [main] c.getjobs.GetJobsApplication : Starting GetJobsApplication v0.0.1-SNAPSHOT
2026-01-17 13:45:25.456  INFO 12345 --- [main] c.getjobs.GetJobsApplication : Started GetJobsApplication in 5.234 seconds
```

---

## ⚙️ 关键配置

### 服务器配置
- **端口**: 8888
- **上下文路径**: /
- **字符编码**: UTF-8

### 数据库配置
- **类型**: SQLite
- **URL**: `jdbc:sqlite:./db/getjobs.db`
- **连接池**: Hikari (最大连接数: 5)

### 日志配置
- **级别**: INFO
- **日志文件**: `./target/logs/get-jobs.log`
- **控制台格式**: 彩色输出

---

## 🔧 常见问题

### ❓ Q1: 启动很慢（首次）
**A**: 首次启动需要下载Gradle依赖，可能需要5-15分钟，请耐心等待和保持网络连接。

### ❓ Q2: 端口8888已被占用
**A**: 修改配置文件 `src/main/resources/application.yaml`:
```yaml
server:
  port: 8889  # 改为其他端口
```

### ❓ Q3: 内存不足 (OutOfMemory)
**A**: 增加JVM内存：
```powershell
$env:JAVA_OPTS = "-Xmx2g -Xms512m"
.\gradlew bootRun
```

### ❓ Q4: Gradle下载失败
**A**: 使用国内镜像源，编辑 `gradle.properties`:
```properties
# 阿里云镜像
maven_url=https://maven.aliyun.com/repository/public
```

### ❓ Q5: 数据库连接错误
**A**: 确保 `db/getjobs.db` 文件存在，或手动创建：
```sql
-- 创建基本表结构
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  platform TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📚 更多文档

- 📖 [快速开始](QUICKSTART.md) - 5分钟上手指南
- 📘 [使用说明](USAGE.md) - 完整功能说明
- 🐛 [故障排除](TROUBLESHOOTING.md) - 问题解决方案
- 📁 [项目结构](PROJECT.md) - 代码组织

---

## 🛑 停止服务

在启动终端按 **`Ctrl+C`** 即可停止服务。

---

## 💡 下一步

启动后端后，你可以：

1. **启动前端** (可选)
   ```bash
   cd front
   pnpm install  # 或 npm install
   pnpm dev      # 或 npm run dev
   ```

2. **配置AI服务** (可选)
   - 编辑 `src/main/resources/application.yaml`
   - 设置 `ZHIPU_API_KEY` 和 `DEEPSEEK_API_KEY`

3. **使用Web界面**
   - 访问 http://localhost:8888 配置爬虫参数
   - 启动自动投递任务

---

**祝你使用愉快！** 🎉

有问题？查看 [故障排除](TROUBLESHOOTING.md) 或提交 Issue
