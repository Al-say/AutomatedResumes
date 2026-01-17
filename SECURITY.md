# 🔐 安全配置指南

## ⚠️ 重要安全警告

**绝对不要将真实的 API 密钥提交到 Git 仓库！**

---

## 🔑 密钥配置方式

### 方式一：环境变量（推荐）

#### Windows PowerShell（当前会话）
```powershell
$env:ZHIPU_API_KEY = "your-api-key-here"
```

#### Windows 永久设置
```powershell
[System.Environment]::SetEnvironmentVariable("ZHIPU_API_KEY", "your-api-key-here", "User")
```

#### Linux/macOS
```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
export ZHIPU_API_KEY="your-api-key-here"
```

### 方式二：Web 界面配置

1. 启动后端服务
2. 访问 http://localhost:6866/ai-config
3. 在界面中输入 API 密钥

---

## 📁 受保护的文件

以下文件类型已在 `.gitignore` 中排除：

- `.env` - 环境变量文件
- `.env.*` - 任何环境配置
- `db/*.db` - 数据库文件（可能存储配置）
- `secrets.*` - 密钥文件
- `*.key`, `*.pem` - 证书/密钥文件

---

## 🚨 如果密钥已泄露

如果您的 API 密钥意外提交到了仓库：

1. **立即在 API 提供商后台重新生成密钥**
2. 删除旧密钥
3. 更新本地环境变量

### 清理 Git 历史（可选）

```bash
# 使用 git filter-repo（推荐）
pip install git-filter-repo
git filter-repo --replace-text <(echo "旧密钥==>REDACTED")

# 或使用 BFG Repo-Cleaner
bfg --replace-text passwords.txt
```

---

## ✅ 安全检查清单

- [ ] API 密钥只存储在环境变量或数据库中
- [ ] `.env` 文件已在 `.gitignore` 中
- [ ] `db/` 目录已在 `.gitignore` 中
- [ ] 提交前检查没有硬编码的密钥
- [ ] 定期更换 API 密钥

---

## 📞 API 密钥获取

- **智谱 AI**: https://open.bigmodel.cn/
- **DeepSeek**: https://platform.deepseek.com/
