# ✅ 后端启动完成指南

## 🎯 启动状态

你的 AutomatedResumes 后端已准备好启动！

## 📋 启动要求

| 项目 | 状态 | 详情 |
|-----|------|------|
| **Java版本** | ✅ 就绪 | JDK 21+ (当前: OpenJDK 23.0.2) |
| **Gradle** | ✅ 就绪 | Gradle Wrapper 已配置 |
| **Spring Boot** | ✅ 就绪 | 版本 3.5.7 |
| **SQLite数据库** | ✅ 就绪 | db/getjobs.db 已存在 |

## 🚀 启动步骤

### 步骤1：打开终端
在项目根目录 `e:\BaiduSyncdisk\Github_File\AutomatedResumes` 打开PowerShell或CMD

### 步骤2：执行启动命令
```powershell
.\gradlew bootRun
```

或在 CMD 中：
```cmd
gradlew bootRun
```

### 步骤3：等待启动完成
你会看到类似的日志输出：
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_|\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot :: (v3.5.7)

2026-01-17 13:20:00.000  INFO 12345 --- [main] c.getjobs.GetJobsApplication : Starting GetJobsApplication
2026-01-17 13:20:05.000  INFO 12345 --- [main] c.getjobs.GetJobsApplication : Started GetJobsApplication in 5.234s
```

## 🌐 验证启动成功

启动完成后，在浏览器访问：

- **本地服务**: [http://localhost:8080/](http://localhost:8080/)
- **API接口**: [http://localhost:8080/api/jobs](http://localhost:8080/api/jobs)
- **Web前端**: [http://localhost:8080/dist/](http://localhost:8080/dist/) (若已编译)

## ⚙️ 配置说明

### 应用配置文件
主配置文件位置：`src/main/resources/application.yaml`

关键配置项：
```yaml
spring:
  application:
    name: GetJobs
  datasource:
    url: jdbc:sqlite:db/getjobs.db
    
server:
  port: 8080
  servlet:
    context-path: /
```

### 数据库
- **类型**: SQLite
- **位置**: `db/getjobs.db`
- **驱动**: org.xerial:sqlite-jdbc:3.45.1.0

## 📦 依赖清单

```
✅ Spring Boot 3.5.7
✅ Spring Web (REST API)
✅ Spring JDBC (数据库)
✅ MyBatis Plus 3.5.9
✅ SQLite JDBC 3.45.1.0
✅ Playwright 1.51.0 (浏览器自动化)
✅ HttpClient5 (HTTP请求)
✅ Jackson YAML (配置文件解析)
✅ Lombok (代码简化)
```

## 🔧 常见问题

### Q1: 启动很慢
**A**: 首次启动需要下载依赖，可能需要5-10分钟。请确保网络连接良好。

### Q2: 端口8080已被占用
**A**: 编辑 `src/main/resources/application.yaml` 修改端口：
```yaml
server:
  port: 8081
```

### Q3: 内存溢出错误
**A**: 增加JVM内存配置：
```powershell
$env:JAVA_OPTS = "-Xmx2g -Xms512m"
.\gradlew bootRun
```

### Q4: Gradle构建失败
**A**: 清除缓存后重试：
```
.\gradlew clean build --refresh-dependencies
```

## 📚 相关文档

- [快速开始](QUICKSTART.md) - 5分钟上手
- [使用说明](USAGE.md) - 详细功能说明
- [故障排除](TROUBLESHOOTING.md) - 问题排查
- [项目结构](PROJECT.md) - 代码组织

## 🛑 停止服务

在启动终端中按 `Ctrl+C` 停止服务。

---

**祝你使用愉快！** 🎉
