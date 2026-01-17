# 🔧 故障排除指南

## 常见问题及解决方案

### 1. 后端启动失败

**问题**: `./gradlew bootRun` 失败
**解决方案**:
```bash
# 检查Java版本
java -version  # 应为21+

# 清理并重新编译
./gradlew clean build

# 检查端口占用
lsof -i :8888
```

### 2. 前端启动失败

**问题**: 前端无法访问 http://localhost:6866
**解决方案**:
```bash
cd front

# 清理缓存
rm -rf .next node_modules/.cache

# 重新安装依赖
pnpm install  # 或 npm install

# 检查端口占用
lsof -i :6866
```

### 3. AI连接失败

**问题**: AI测试返回错误
**解决方案**:
```bash
# 检查环境变量
echo $ZHIPU_API_KEY
echo $ZHIPU_BASE_URL

# 测试网络连接
curl -I https://open.bigmodel.cn

# 查看API响应
curl http://localhost:8888/api/ai/config-info
```

### 4. 浏览器自动化失败

**问题**: Playwright无法启动Chrome
**解决方案**:
```bash
# 安装浏览器
./gradlew playwright:install

# 检查Chrome安装
which google-chrome

# macOS上可能需要
brew install --cask google-chrome
```

### 5. 登录状态失效

**问题**: 招聘平台需要重新登录
**解决方案**:
```bash
# 清除浏览器数据
rm -rf db/playwright_data

# 重启应用
./gradlew bootRun
```

### 6. 数据库连接问题

**问题**: SQLite数据库错误
**解决方案**:
```bash
# 检查数据库文件权限
ls -la db/

# 删除并重新创建数据库
rm -f db/jobs.db
./gradlew bootRun  # 会自动创建
```

## 调试命令

### 查看应用日志
```bash
# 实时查看后端日志
tail -f logs/application.log

# 查看前端构建日志
cd front && npm run build
```

### 检查系统状态
```bash
# 检查端口占用
netstat -tulpn | grep :8888
netstat -tulpn | grep :6866

# 检查进程
ps aux | grep java
ps aux | grep node
```

### API调试
```bash
# 健康检查
curl http://localhost:8888/api/health

# 爬取状态
curl http://localhost:8888/api/crawl/status

# AI配置
curl http://localhost:8888/api/ai/config-info
```

## 性能优化

### JVM调优
```bash
# 增加内存
export JAVA_OPTS="-Xms512m -Xmx1024m"
./gradlew bootRun
```

### 前端优化
```bash
cd front

# 生产构建
npm run build

# 启动生产版本
npm start
```

## 获取帮助

如果问题仍然存在：

1. 查看 [GitHub Issues](https://github.com/loks666/get_jobs/issues)
2. 加入 QQ交流群 获取社区帮助
3. 查看 [完整文档](USAGE.md)

## 紧急停止

```bash
# 停止所有相关进程
pkill -f "GetJobsApplication"
pkill -f "next"
pkill -f "gradle"

# 清理临时文件
rm -rf .gradle/ build/ front/.next/
```</content>
<parameter name="filePath">/Users/alsay_mac/Synchronization/Github_File/AutomatedResumes/TROUBLESHOOTING.md