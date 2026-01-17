#!/usr/bin/env pwsh
# AutomatedResumes 后端启动脚本

Write-Host "================================" -ForegroundColor Green
Write-Host "🚀 AutomatedResumes 后端启动脚本" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# 检查Java版本
Write-Host "✓ 检查Java环境..." -ForegroundColor Cyan
$javaVersion = java -version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Java已安装" -ForegroundColor Green
    Write-Host $javaVersion[0] -ForegroundColor Gray
} else {
    Write-Host "❌ 未找到Java，请先安装JDK 21+" -ForegroundColor Red
    exit 1
}

# 检查Gradle
Write-Host ""
Write-Host "✓ 检查Gradle..." -ForegroundColor Cyan
if (Test-Path ".\gradlew.bat" -o -Path ".\gradlew") {
    Write-Host "✅ Gradle Wrapper已就绪" -ForegroundColor Green
} else {
    Write-Host "❌ 未找到Gradle Wrapper" -ForegroundColor Red
    exit 1
}

# 启动后端
Write-Host ""
Write-Host "✓ 启动Spring Boot应用..." -ForegroundColor Cyan
Write-Host "服务将监听在: http://localhost:8888" -ForegroundColor Yellow
Write-Host ""
Write-Host "按 Ctrl+C 可停止服务" -ForegroundColor Yellow
Write-Host ""

# 启动应用
if ($PSVersionTable.Platform -eq "Win32NT" -or $PSVersionTable.OS -like "*Windows*") {
    .\gradlew.bat bootRun
} else {
    ./gradlew bootRun
}
