# ==============================================================================
# CapCut MCP Custom - 1-Click Setup Script (Windows PowerShell)
# ==============================================================================

$Host.UI.RawUI.WindowTitle = "CapCut MCP Custom Setup"
Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "   CapCut MCP Custom - 1-Click Auto Setup (Windows)  " -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# 1. Refresh System & User PATH
$machinePath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
$userPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
$env:Path = "$machinePath;$userPath;$env:Path;$env:ProgramFiles\nodejs;$env:ProgramFiles(x86)\nodejs;$env:APPDATA\npm;$env:LOCALAPPDATA\Programs\node"

# 2. Check Node.js
Write-Host "[1/5] Checking Node.js..." -ForegroundColor Yellow
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    if (Test-Path "$env:ProgramFiles\nodejs\node.exe") {
        $env:Path += ";$env:ProgramFiles\nodejs"
        $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
    } elseif (Test-Path "$env:ProgramFiles(x86)\nodejs\node.exe") {
        $env:Path += ";$env:ProgramFiles(x86)\nodejs"
        $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
    } elseif (Test-Path "$env:LOCALAPPDATA\Programs\node\node.exe") {
        $env:Path += ";$env:LOCALAPPDATA\Programs\node"
        $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
    }
}

if ($nodeCmd) {
    $nodeVer = & node -v
    Write-Host "[OK] Node.js is ready: $nodeVer" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Node.js is not found!" -ForegroundColor Red
    Write-Host "Please download and install Node.js (LTS) from: https://nodejs.org" -ForegroundColor White
    Write-Host "After installing Node.js, run setup.bat again!" -ForegroundColor White
    Read-Host "Press Enter to exit"
    exit 1
}

# 3. Check FFmpeg
Write-Host "[2/5] Checking FFmpeg..." -ForegroundColor Yellow
$ffmpegCmd = Get-Command ffmpeg -ErrorAction SilentlyContinue
if ($ffmpegCmd) {
    Write-Host "[OK] FFmpeg found." -ForegroundColor Green
} else {
    Write-Host "[NOTICE] FFmpeg not found in PATH. (If needed for media probing, install from https://www.gyan.dev/ffmpeg/builds/)" -ForegroundColor Gray
}

# 4. Install Dependencies
Write-Host "[3/5] Installing npm dependencies..." -ForegroundColor Yellow
& npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] npm install failed." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Dependencies installed successfully." -ForegroundColor Green

# 5. Sync Assets
Write-Host "[4/5] Syncing CapCut Shader Assets for Offline Use..." -ForegroundColor Yellow
& npm run sync-assets

# 6. Deploy Template Draft
Write-Host "[5/5] Deploying CapCut Base Template (MCP_TEMPLATE_CLEAN)..." -ForegroundColor Yellow
& npm run install-template

# 7. Run Verification Tests
Write-Host ""
Write-Host "Running Verification Tests (npm test)..." -ForegroundColor Yellow
& npm test

# 8. Output Config
$serverPath = Join-Path $ScriptDir "src\server.js"
$serverPathEscaped = $serverPath.Replace("\", "\\")

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Green
Write-Host "   SETUP COMPLETED SUCCESSFULLY!                     " -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your server.js location:" -ForegroundColor White
Write-Host $serverPath -ForegroundColor Cyan
Write-Host ""
Write-Host "Add the following to your Claude Desktop / Antigravity / Cursor MCP config:" -ForegroundColor White
Write-Host @"
{
  "mcpServers": {
    "capcut": {
      "command": "node",
      "args": ["$serverPathEscaped"]
    }
  }
}
"@ -ForegroundColor Yellow
Write-Host ""
Write-Host "You can now use CapCut MCP autonomously!" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to close"
