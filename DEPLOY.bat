@echo off
REM F1 Telemetry Dashboard - Automated GitHub Pages Deployment Script (Windows)

echo.
echo 🏁 F1 Telemetry Dashboard - GitHub Pages Deployment
echo ==================================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Get GitHub username
set /p GITHUB_USERNAME="📝 Enter your GitHub username: "

if "%GITHUB_USERNAME%"=="" (
    echo ❌ GitHub username cannot be empty
    pause
    exit /b 1
)

set REPO_NAME=f1-telemetry-dashboard
set REPO_URL=https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git

echo.
echo 📋 Deployment Configuration:
echo    GitHub Username: %GITHUB_USERNAME%
echo    Repository: %REPO_NAME%
echo    URL: %REPO_URL%
echo.

REM Initialize git if not already done
if not exist ".git" (
    echo 🔧 Initializing git repository...
    git init
    git config user.email "f1-dashboard@local.dev"
    git config user.name "F1 Dashboard"
)

REM Add all files
echo 📦 Adding files to git...
git add .

REM Create initial commit
echo 💾 Creating initial commit...
git commit -m "Initial commit: F1 Telemetry Dashboard" 2>nul || (
    echo (Files already committed)
)

REM Add remote
echo 🔗 Adding remote repository...
git remote remove origin 2>nul
git remote add origin "%REPO_URL%"

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ✅ Code pushed to GitHub!
echo.
echo 📝 Next steps to enable GitHub Pages:
echo    1. Go to: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo    2. Click Settings (top right)
echo    3. Click Pages (left sidebar)
echo    4. Under Source:
echo       - Select: main branch
echo       - Select: / (root) folder
echo    5. Click Save
echo    6. Wait 1-2 minutes for deployment
echo.
echo 🎉 Your dashboard will be live at:
echo    https://%GITHUB_USERNAME%.github.io/%REPO_NAME%/
echo.
echo 📚 For detailed instructions, see QUICK_START.md
echo.
pause
