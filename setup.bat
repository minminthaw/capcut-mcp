@echo off
REM ==============================================================================
REM CapCut MCP Custom - 1-Click Auto Setup for Windows
REM ==============================================================================

chcp 65001 >nul
echo.
echo =====================================================
echo    🎬 CapCut MCP Custom - 1-Click Auto Setup (Windows)
echo =====================================================
echo.

cd /d "%~dp0"

REM 1. Check Node.js
echo [1/5] Checking Node.js...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo [OK] Node.js found: %NODE_VER%

REM 2. Check FFmpeg
echo [2/5] Checking FFmpeg...
where ffmpeg >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] FFmpeg not found in PATH.
    echo Please install FFmpeg via 'winget install Gyan.FFmpeg' or download from https://www.gyan.dev/ffmpeg/builds/
) else (
    echo [OK] FFmpeg found.
)

REM 3. Install Dependencies
echo [3/5] Installing npm dependencies...
call npm install --silent
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
)
echo [OK] Dependencies installed.

REM 4. Sync Assets
echo [4/6] Syncing CapCut Shader Assets...
call npm run sync-assets

REM 5. Deploy CapCut Base Template
echo [5/6] Deploying CapCut Base Template (MCP_TEMPLATE_CLEAN)...
call npm run install-template

REM 6. Run Verification Tests
echo [6/6] Running Verification Tests...
call npm test
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Some tests failed. Please review the output above.
) else (
    echo [OK] All unit tests passed successfully.
)

set "SERVER_PATH=%~dp0src\server.js"
set "SERVER_PATH_ESCAPED=%SERVER_PATH:\=\\%"

echo.
echo =====================================================
echo    🎉 SETUP COMPLETED SUCCESSFULLY!
echo =====================================================
echo.
echo Your server.js location:
echo %SERVER_PATH%
echo.
echo Add the following to your Claude Desktop / Antigravity / Cursor MCP config:
echo.
echo {
echo   "mcpServers": {
echo     "capcut": {
echo       "command": "node",
echo       "args": ["%SERVER_PATH_ESCAPED%"]
echo     }
echo   }
echo }
echo.
echo You can now use CapCut MCP autonomously!
pause
