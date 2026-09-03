#!/usr/bin/env bash
# ==============================================================================
# CapCut MCP Custom - 1-Click Setup Script (macOS / Linux)
# ==============================================================================

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}=====================================================${NC}"
echo -e "${GREEN}   🎬 CapCut MCP Custom - 1-Click Auto Setup         ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo ""

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

# 1. Check Node.js
echo -e "${BLUE}[1/6] Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️ Node.js is not found. Attempting automatic installation via Homebrew...${NC}"
    if command -v brew &> /dev/null; then
        brew install node
    else
        echo -e "${RED}❌ Please download and install Node.js (v18+) from https://nodejs.org${NC}"
        exit 1
    fi
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js found: ${NODE_VERSION}${NC}"

# 2. Check FFmpeg
echo -e "${BLUE}[2/5] Checking FFmpeg / FFprobe...${NC}"
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${YELLOW}⚠️ FFmpeg is not found. Attempting to install via Homebrew...${NC}"
    if command -v brew &> /dev/null; then
        brew install ffmpeg
    else
        echo -e "${YELLOW}Homebrew not found. Please install ffmpeg using: brew install ffmpeg${NC}"
    fi
else
    echo -e "${GREEN}✅ FFmpeg found: $(ffmpeg -version | head -n 1 | cut -d ' ' -f 3)${NC}"
fi

# 3. Install Dependencies
echo -e "${BLUE}[3/5] Installing npm packages...${NC}"
npm install --silent
echo -e "${GREEN}✅ Dependencies installed successfully.${NC}"

# 4. Sync CapCut Assets
echo -e "${BLUE}[4/6] Syncing CapCut Assets & Shaders...${NC}"
npm run sync-assets
echo -e "${GREEN}✅ Assets synced and ready for offline rendering.${NC}"

# 5. Install Clean CapCut Base Template
echo -e "${BLUE}[5/6] Deploying CapCut Base Template (MCP_TEMPLATE_CLEAN)...${NC}"
npm run install-template
echo -e "${GREEN}✅ Base template deployed to CapCut Drafts.${NC}"

# 6. Run Verification Tests
echo -e "${BLUE}[6/6] Running Verification Tests...${NC}"
npm test
echo ""

# Configuration Helper
SERVER_PATH="$DIR/src/server.js"
CLAUDE_CONFIG_DIR="$HOME/Library/Application Support/Claude"
CLAUDE_CONFIG_FILE="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"

echo -e "${GREEN}=====================================================${NC}"
echo -e "${GREEN}   🎉 SETUP COMPLETED SUCCESSFULLY!                 ${NC}"
echo -e "${GREEN}=====================================================${NC}"
echo ""
echo -e "Your Server Entrypoint: ${YELLOW}$SERVER_PATH${NC}"
echo ""
echo -e "To connect in Claude Desktop, Antigravity, or Cursor, add this to your MCP config:"
echo ""
echo -e "${YELLOW}{"
echo -e "  \"mcpServers\": {"
echo -e "    \"capcut\": {"
echo -e "      \"command\": \"node\","
echo -e "      \"args\": [\"$SERVER_PATH\"]"
echo -e "    }"
echo -e "  }"
echo -e "}${NC}"
echo ""

# Auto-configure Claude Desktop if present
if [ -d "$CLAUDE_CONFIG_DIR" ]; then
    read -p "Would you like to auto-configure Claude Desktop config now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        node -e '
        const fs = require("fs");
        const path = "'"$CLAUDE_CONFIG_FILE"'";
        let cfg = {};
        try { cfg = JSON.parse(fs.readFileSync(path, "utf8")); } catch {}
        cfg.mcpServers = cfg.mcpServers || {};
        cfg.mcpServers.capcut = {
          command: "node",
          args: ["'"$SERVER_PATH"'"]
        };
        fs.writeFileSync(path, JSON.stringify(cfg, null, 2));
        console.log("✅ Claude Desktop config updated at: " + path);
        '
    fi
fi

echo -e "${GREEN}You are ready to edit videos autonomously with CapCut MCP!${NC}"
echo ""
