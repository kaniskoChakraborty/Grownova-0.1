@echo off
title GrowNova OS - One Operating System for Indian Businesses
echo ======================================================================
echo    GROWNOVA - ONE OPERATING SYSTEM FOR INDIAN BUSINESSES
echo ======================================================================
echo.

echo [1/3] Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Node.js is not found on your computer!
    echo Please download and install Node.js from: https://nodejs.org/
    echo (Choose the recommended LTS version, install it, and reopen this file)
    echo.
    pause
    exit /b
)
echo Found Node.js version:
node -v
echo.

echo [2/3] Checking frontend dependencies...
cd /d "%~dp0frontend"
if not exist node_modules (
    echo Dependencies not found. Installing packages... (This only happens on the first run)
    call npm install
) else (
    echo Dependencies already verified!
)
echo.

echo [3/3] Starting GrowNova and opening browser...
timeout /t 2 >nul
start http://localhost:5173
echo.
echo ======================================================================
echo   GrowNova is LIVE!
echo   - Main Landing Page:  http://localhost:5173
echo   - Sign In / Sign Up:  http://localhost:5173/auth
echo.
echo   Press Ctrl + C in this window to stop the server at any time.
echo ======================================================================
echo.
call npm run dev
pause
