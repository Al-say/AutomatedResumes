@echo off
REM ========================================
REM AutomatedResumes 后端启动脚本
REM ========================================

setlocal enabledelayedexpansion

cd /d "%~dp0"

echo.
echo ========================================
echo  AutomatedResumes 后端启动脚本
echo ========================================
echo.

REM 检查Java版本
echo 正在检查Java环境...
java -version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ 错误: 未找到Java，请先安装JDK 21+
    echo.
    pause
    exit /b 1
)
echo ✅ Java环境就绪

REM 检查Gradle Wrapper
echo 正在检查Gradle...
if not exist "gradlew.bat" (
    echo.
    echo ❌ 错误: 未找到gradlew.bat
    echo.
    pause
    exit /b 1
)
echo ✅ Gradle Wrapper就绪

echo.
echo ========================================
echo  启动Spring Boot应用...
echo ========================================
echo.
echo 📝 服务将监听在: http://localhost:8888
echo 🛑 按 Ctrl+C 可停止服务
echo.

REM 启动应用
call .\gradlew.bat bootRun

if errorlevel 1 (
    echo.
    echo ❌ 启动失败，请检查错误信息
    echo.
    pause
    exit /b 1
)

pause
