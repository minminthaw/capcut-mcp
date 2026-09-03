# capcut-mcp-custom 🎬✨

An enhanced, high-performance **Model Context Protocol (MCP)** server that empowers AI assistants (Claude Desktop, Antigravity, Cursor, Windsurf, Claude Code) to autonomously read, direct, and edit **CapCut Desktop draft projects** across **macOS** and **Windows**.

> **100% Autonomous AI Video Editing Ready:** Supports speech jumpcutting, B-Roll overlays, 1800+ effects, 1100+ transitions, 800+ animations, 450+ LUT filters, keyframe motion zooms, video masking, speed curves, chroma key, smart dialogue BGM auto-ducking, typography subtitles, animated progress bars, and speaker lower-thirds.

---

## 📚 Documentation
- **[English Setup & Architecture Guide](#installation--configuration)** (below)
- **[🇲🇲 မြန်မာလို အသေးစိတ် တပ်ဆင်အသုံးပြုနည်း လမ်းညွှန် (Burmese Guide)](docs/SETUP_GUIDE_MY.md)**
- **[Effects & Transitions Catalog & Resolution Specs](docs/EFFECTS_TRANSITIONS.md)**

---

## 💻 Requirements
- **Node.js 18+** ([nodejs.org](https://nodejs.org))
- **FFmpeg & FFprobe** on system PATH:
  - **macOS**: `brew install ffmpeg`
  - **Windows**: `winget install Gyan.FFmpeg`
- **CapCut Desktop** (App Store or Official Desktop version)

---

## 🚀 Quick 1-Click Setup (Recommended)

Copy or clone this `capcut-mcp-custom` folder to your target PC, then run the 1-click installer:

### 🍏 macOS / Linux:
```bash
./setup.sh
```

### 🪟 Windows:
Double-click **`setup.bat`** in the folder!

---

*The 1-click script automatically:*
1. Validates Node.js & FFmpeg prerequisites.
2. Installs npm dependencies (`npm install`).
3. Syncs CapCut shader & visual assets for offline rendering (`npm run sync-assets`).
4. Runs full test suite (37 unit tests).
5. Generates the exact, ready-to-use JSON config block for your machine.

---

## ⚙️ AI Client Configuration

### 🔹 Option A: Claude Desktop
Add to your `claude_desktop_config.json`:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "capcut": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/capcut-mcp-custom/src/server.js"
      ]
    }
  }
}
```

### 🔹 Option B: Antigravity / Windsurf / Cursor
Add to your project's `.gemini/config/mcp_config.json` or Global MCP settings:

```json
{
  "mcpServers": {
    "capcut": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/capcut-mcp-custom/src/server.js"
      ]
    }
  }
}
```

---

## 📁 Drafts Directory Auto-Discovery

`capcut-mcp-custom` automatically detects your CapCut drafts folder across platforms:

| Platform | Default Path |
|---|---|
| **macOS** | `~/Movies/CapCut/User Data/Projects/com.lveditor.draft` |
| **Windows** | `%LOCALAPPDATA%\CapCut\User Data\Projects\com.lveditor.draft`<br>or `D:\Capcut\CapCut Drafts` |

*To override with a custom location, set the environment variable `CAPCUT_DRAFTS_DIR`.*

---

## 🛠️ Complete MCP Tools Reference (35+ Tools)

### 1. Timeline & Media Ops
| Tool | Description |
|---|---|
| `capcut_list_drafts` | List all local CapCut drafts with duration, fps, resolution, and lock status |
| `capcut_read_timeline` | Full inspect of timeline tracks, media paths, timeranges, and render layers |
| `capcut_clone_draft` | Duplicate a draft (optionally emptied) for fresh edits |
| `capcut_add_video` | Place a video file onto a specified track at a start time |
| `capcut_add_image` | Place an image/overlay file onto a track with duration |
| `capcut_add_audio` | Place dialogue, music (BGM), or sound effects (SFX) |
| `capcut_add_track` | Add a new video, audio, text, sticker, effect, or filter track |
| `capcut_move_segment` | Move a clip start time or change track index |
| `capcut_trim_segment` | Trim clip start, duration, or source in-point |
| `capcut_split_segment` | Split a clip cleanly at an exact timestamp |
| `capcut_delete_segment` | Remove a segment from a track |
| `capcut_set_props` | Adjust scale, position X/Y, rotation, opacity, volume, speed, visibility |
| `capcut_auto_jumpcut` | Automatically slice and ripple-delete silence dead space |

### 2. Visual Effects, Transitions & Filters
| Tool | Description |
|---|---|
| `capcut_list_effects` | Search 1800+ scene and character visual effects |
| `capcut_apply_effect` | Apply visual effect to a clip or as a standalone effect layer track |
| `capcut_list_transitions` | Search 1100+ video transitions (e.g. Cross Dissolve, Bubble Blur, Flash White) |
| `capcut_apply_transition` | Apply transition between adjoining clips |
| `capcut_list_animations` | Search 800+ in/out/loop/group video and text animations |
| `capcut_apply_animation` | Apply entrance/exit animation with duration |
| `capcut_list_filters` | Search 450+ color grading looks / LUTs (e.g. Vintage 90s, BW 2) |
| `capcut_apply_filter` | Apply color filter to clip or as a filter layer track |
| `capcut_list_stickers` | Search cached CapCut stickers, badges, and emojis |
| `capcut_add_sticker` | Place sticker onto timeline with scale, position, and rotation |

### 3. Motion, Framing & Color
| Tool | Description |
|---|---|
| `capcut_add_keyframe` | Add dynamic animation keyframes (scale, position, rotation, opacity, volume) |
| `capcut_apply_mask` | Apply shape masks (circle, rectangle, linear, mirror, heart, star) with feather |
| `capcut_set_speed_curve` | Apply speed ramping curves (montage, hero, bullet_time, flash_in, flash_out) |
| `capcut_apply_chroma_key` | Green Screen / Chroma Key cutout with intensity & shadow preservation |
| `capcut_apply_pip_layout` | Picture-in-Picture or Split-Screen layout presets (Corner PiP, 50/50 Split) |
| `capcut_set_canvas_blur` | Apply Gaussian background blur or color behind reframed clips |
| `capcut_set_color_adjustments` | Manual color slider adjustments (brightness, contrast, saturation) |

### 4. Audio, Subtitles & Formatting
| Tool | Description |
|---|---|
| `capcut_set_audio_fade` | Set audio fade-in and fade-out durations on clips |
| `capcut_apply_audio_effect` | Apply voice filters and audio scene effects (Robot, Deep, Echo, Chipmunk) |
| `capcut_auto_duck_bgm` | Automatically duck BGM volume during spoken dialogue |
| `capcut_normalize_audio` | Normalize dialogue loudness across tracks |
| `capcut_add_subtitles_batch` | Bulk place styled subtitles with typography, colors, and outlines |
| `capcut_add_progress_bar` | Add animated video progress bar (0% to 100% fill across timeline) |
| `capcut_add_lower_third` | Add speaker name and role title badge overlay with animations |
| `capcut_set_canvas` | Set canvas aspect ratio (9:16 vertical, 16:9 widescreen, 1:1 square) |

### 5. Diagnostics, Validation & Safety
| Tool | Description |
|---|---|
| `capcut_inspect_edit` | Analyze timeline statistics, B-Roll coverage %, cut count, health |
| `capcut_validate` | Validate timeline overlaps, duplicate IDs, dangling references, missing media |
| `capcut_raw_patch` | Deep-merge JSON patch escape hatch |
| `capcut_save` / `capcut_discard` | Persist or revert session with atomic write & `.mcpbak` backup |

---

## 🔒 Safety & Crash Protection
- **Autosave Protection**: Automatically detects if CapCut Desktop is open to prevent file write collisions.
- **Dual JSON & Timestamp Synchronization**: Writes both `draft_info.json` and `draft_content.json` and updates `root_meta_info.json` timestamps for modern macOS & Windows CapCut versions.
- **Atomic Backups**: Creates `.mcpbak` snapshots prior to disk writes.

---

## 📄 License
MIT License © 2026. Free & Open Source for all video editors and AI engineers.
# capcut-mcp
