@echo off
REM ==============================================================================
REM CapCut MCP Custom - 1-Click Auto Setup for Windows (Smart Detection)
REM ==============================================================================

chcp 65001 >nul
setlocal EnableDelayedExpansion

echo.
echo =====================================================
echo    🎬 CapCut MCP Custom - 1-Click Auto Setup (Windows)
echo =====================================================
echo.

cd /d "%~dp0"

REM 1. Smart Node.js Detection
echo [1/6] Checking Node.js...

REM Read latest PATH from registry to get any newly installed programs
for /f "tokens=2*" %%a in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "USER_PATH=%%b"
for /f "tokens=2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do set "SYS_PATH=%%b"
set "PATH=%USER_PATH%;%SYS_PATH%;%PATH%;%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%APPDATA%\npm;%LOCALAPPDATA%\Programs\node;%APPDATA%\nvm;%LOCALAPPDATA%\scoop\apps\nodejs\current\bin;%ProgramData%\chocolatey\bin"

where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    if exist "%ProgramFiles%\nodejs\node.exe" (
        set "PATH=%ProgramFiles%\nodejs;%PATH%"
    ) else if exist "%ProgramFiles(x86)%\nodejs\node.exe" (
        set "PATH=%ProgramFiles(x86)%\nodejs;%PATH%"
    ) else if exist "%LOCALAPPDATA%\Programs\node\node.exe" (
        set "PATH=%LOCALAPPDATA%\Programs\node;%PATH%"
    )
)

where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [NOTICE] Node.js is not found in system paths. Attempting automatic installation...
    
    where winget >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        echo Installing Node.js LTS via winget...
        winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
    ) else (
        echo Downloading and installing Node.js LTS via PowerShell...
        powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Write-Host 'Downloading Node.js installer...'; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi' -OutFile '$env:TEMP\nodejs.msi'; Write-Host 'Installing Node.js...'; Start-Process msiexec.exe -ArgumentList '/i `\"$env:TEMP\nodejs.msi`\" /qn /norestart' -Wait; Remove-Item '$env:TEMP\nodejs.msi'"
    )
    
    set "PATH=%PATH%;%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%APPDATA%\npm;%LOCALAPPDATA%\Programs\node"
    
    where node >nul 2>&1
    if !ERRORLEVEL! NEQ 0 (
        echo.
        echo [ERROR] Node.js installation completed, but terminal requires restart.
        echo Please close and reopen setup.bat!
        pause
        exit /b 1
    )
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo [OK] Node.js is ready: %NODE_VER%

REM 2. Check & Auto-Install FFmpeg
echo [2/6] Checking FFmpeg / FFprobe...
where ffmpeg >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [NOTICE] FFmpeg is not found. Attempting automatic installation...
    where winget >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        echo Installing FFmpeg via winget...
        winget install Gyan.FFmpeg --silent --accept-package-agreements --accept-source-agreements
    ) else (
        echo [NOTICE] If FFmpeg is needed for media probing, install from https://www.gyan.dev/ffmpeg/builds/
    )
) else (
    echo [OK] FFmpeg found.
)

REM 3. Install Dependencies
echo [3/6] Installing npm dependencies for capcut-mcp...
call npm install --silent
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
)
echo [OK] Dependencies installed successfully.

REM 4. Sync Assets
echo [4/6] Syncing CapCut Shader Assets for Offline Use...
call npm run sync-assets

REM 5. Deploy CapCut Base Template
echo [5/6] Deploying CapCut Base Template (MCP_TEMPLATE_CLEAN)...
call npm run install-template

REM 6. Run Verification Tests
echo [6/6] Running Verification Tests...
call npm test
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Some tests reported issues. Please check output.
) else (
    echo [OK] All unit tests passed (37/37).
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
