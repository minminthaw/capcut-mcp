# CapCut MCP Custom - Windows နှင့် macOS တပ်ဆင်အသုံးပြုနည်းလမ်းညွှန် 🇲🇲

ဤလမ်းညွှန်သည် **CapCut MCP Custom Server** ကို **Windows** သို့မဟုတ် **macOS** ကွန်ပျူတာ မည်သည့်စက်တွင်မဆို အလွယ်တကူ ထည့်သွင်းချိတ်ဆက်ပြီး **Claude Desktop, Antigravity, Cursor, Windsurf, VSCode** စသည့် AI Assistants များဖြင့် CapCut ဗီဒီယိုများကို အလိုအလျောက် တည်းဖြတ်နိုင်စေရန် ရေးသားထားခြင်း ဖြစ်ပါသည်။

---

## ၁။ လိုအပ်ချက်များ (Prerequisites)

1. **Node.js (v18 သို့မဟုတ် အထက်)**:
   - [nodejs.org](https://nodejs.org) မှ LTS Version ကို ဒေါင်းလုဒ်ရယူ တပ်ဆင်ပါ။
2. **FFmpeg & FFprobe**:
   - **macOS**: `brew install ffmpeg`
   - **Windows**: `winget install Gyan.FFmpeg` (သို့မဟုတ် [gyan.dev/ffmpeg](https://www.gyan.dev/ffmpeg/builds/) မှ ဒေါင်းလုဒ်ဆွဲပြီး System PATH တွင် ထည့်ပါ)။
3. **CapCut Desktop (Official Version)**:
   - CapCut Desktop ကို ဖွင့်ပြီး Template တစ်ခုခု (ဥပမာ - `MCP_TEMPLATE_CLEAN`) ကို ဖန်တီးထားပါ။

---

## ၂။ စတင်တပ်ဆင်ခြင်း (၁-ချက်တည်းဖြင့် အလိုအလျောက် တပ်ဆင်နည်း) ⚡

ဤဖိုဒါကို အခြား PC သို့ ကူးထည့်ပြီးပါက Terminal တွင် ရှည်လျားစွာ ရိုက်စရာမလိုဘဲ **1-Click Script** ကို နှိပ်လိုက်ရုံဖြင့် Dependencies သွင်းခြင်း၊ Asset များ စင့်ခ်လုပ်ခြင်းနှင့် Health Check စစ်ဆေးခြင်းတို့ကို အလိုအလျောက် ပြုလုပ်ပေးပါမည်-

### 🍏 macOS / Linux အသုံးပြုသူများအတွက်:
ဖိုဒါထဲရှိ `setup.sh` ကို Terminal တွင် run ပေးပါ (သို့မဟုတ် Double-Click နှိပ်ပါ)-
```bash
./setup.sh
```

### 🪟 Windows အသုံးပြုသူများအတွက်:
ဖိုဒါထဲရှိ **`setup.bat`** ဖိုင်ကို **Double-Click** နှိပ်ပြီး ဖွင့်လိုက်ရုံဖြစ်ပါသည်!

---

အဆိုပါ Script သည် အောက်ပါတို့ကို အလိုအလျောက် ဆောင်ရွက်ပေးပါသည်-
1. **Prerequisites Check**: Node.js နှင့် FFmpeg ရှိမရှိ စစ်ဆေးပေးခြင်း
2. **Auto Install**: `npm install` ဖြင့် Packages များ သွင်းပေးခြင်း
3. **Asset Syncing**: CapCut Shaders/Assets များကို Offline သုံးနိုင်ရန် Bundle ပြုလုပ်ပေးခြင်း
4. **Auto-Deploy Template Draft**: CapCut ထဲတွင် တည်းဖြတ်ရန် လိုအပ်သော **`MCP_TEMPLATE_CLEAN` Draft ပရောဂျက်ကို CapCut Drafts ဖိုဒါထဲသို့ အလိုအလျောက် သွင်းယူပေးခြင်း** (လူကိုယ်တိုင် Template ဖန်တီးစရာ မလိုတော့ပါ)
5. **Health Check & Auto Config**: Test Cases ၃၇ ခုစလုံးကို စစ်ဆေးပြီး သင့်စက်နှင့် ကိုက်ညီမည့် **Ready-to-use MCP JSON Code** ကို ချက်ချင်း ထုတ်ပေးခြင်း။

---

## ၃။ AI အက်ပ်များတွင် ချိတ်ဆက်နည်း (MCP Configuration)

### 🔹 (က) Antigravity / Windsurf / Cursor တွင် ချိတ်ဆက်ခြင်း

သင့်ကွန်ပျူတာရှိ `mcp_config.json` (သို့မဟုတ် Global MCP Config) ဖိုင်ထဲတွင် အောက်ပါအတိုင်း ထည့်ပါ-

#### **macOS အတွက် Configuration**:
```json
{
  "mcpServers": {
    "capcut": {
      "command": "node",
      "args": [
        "/Users/YOUR_USERNAME/Documents/capcut-mcp-custom/src/server.js"
      ]
    }
  }
}
```

#### **Windows အတွက် Configuration**:
```json
{
  "mcpServers": {
    "capcut": {
      "command": "node",
      "args": [
        "C:\\Users\\YOUR_USERNAME\\Documents\\capcut-mcp-custom\\src\\server.js"
      ]
    }
  }
}
```

---

### 🔹 (ခ) Claude Desktop တွင် ချိတ်ဆက်ခြင်း

Claude Desktop ၏ Config ဖိုင်ကို ဖွင့်ပါ-
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

အောက်ပါ JSON ကို ထည့်သွင်းပြီး Claude Desktop ကို Restart ပြုလုပ်ပါ-
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

## ၄။ အလိုအလျောက် တည်နေရာ ရှာဖွေမှုစနစ် (Auto-Path Discovery)

CapCut MCP Custom သည် ကွန်ပျူတာ OS ပေါ်မူတည်၍ CapCut Drafts ဖိုဒါကို အလိုအလျောက် ရှာဖွေပေးပါသည်-

- **macOS မူရင်းလမ်းကြောင်း**:
  `~/Movies/CapCut/User Data/Projects/com.lveditor.draft`
- **Windows မူရင်းလမ်းကြောင်း**:
  `%LOCALAPPDATA%\CapCut\User Data\Projects\com.lveditor.draft`
  သို့မဟုတ် `D:\Capcut\CapCut Drafts`

> 💡 **မှတ်ချက်**: အကယ်၍ သင့် Drafts များကို အခြား Drive (ဥပမာ External SSD / D Drive) တွင် ထားရှိပါက Environment Variable `CAPCUT_DRAFTS_DIR` တွင် သတ်မှတ်ပေးနိုင်ပါသည်။

---

## ၅။ ဗီဒီယို တည်းဖြတ်ခြင်း အဆင့်များ (Standard Workflow)

1. **CapCut Desktop တွင် `MCP_TEMPLATE_CLEAN` ကို Duplicate လုပ်ပါ**:
   - CapCut ထဲတွင် `MCP_TEMPLATE_CLEAN` ပရောဂျက်ကို Right-Click နှိပ်ပြီး **Duplicate** ပြုလုပ်ပါ (ဥပမာ - `MCP_TEMPLATE_CLEAN-copy` ဖြစ်သွားမည်)။
2. **CapCut ကို ပိတ်ပါ**:
   - CapCut ဖွင့်ထားစဉ် Save လုပ်ပါက CapCut ၏ Autosave ကြောင့် Overwrite မဖြစ်စေရန် CapCut ကို ခေတ္တ ပိတ်ထားပေးပါ။
3. **AI အား ဗီဒီယို တည်းဖြတ်ခိုင်းပါ**:
   - AI Assistant (Claude / Antigravity) အား `"ဒီ ဗီဒီယိုကို Edit လုပ်ပေး"` သို့မဟုတ် `"Edit this video"` ဟု ပြောလိုက်ရုံဖြင့် အလိုအလျောက် စတင်လုပ်ဆောင်ပေးမည် ဖြစ်ပါသည်။
4. **CapCut ကို ပြန်ဖွင့်ပါ**:
   - AI မှ Save လုပ်ပြီးကြောင်း အကြောင်းကြားစာ ရရှိပါက CapCut ကို ပြန်ဖွင့်ပြီး Finished Edit ကို ကြည့်ရှု Export လုပ်နိုင်ပါပြီ။

---

## ၆။ အဓိက အသုံးပြုနိုင်သော Tools စာရင်း (Tools Matrix)

| အမျိုးအစား | Tools များ | အသုံးဝင်ပုံ |
|---|---|---|
| **Core Editing** | `capcut_add_video`<br>`capcut_add_image`<br>`capcut_add_audio`<br>`capcut_split_segment`<br>`capcut_trim_segment`<br>`capcut_move_segment`<br>`capcut_delete_segment`<br>`capcut_auto_jumpcut` | ရုပ်/သံ ဖိုင်များ တင်ခြင်း၊ အသံတိတ်နေသော Dead Space များကို အလိုအလျောက် ဖြတ်ထုတ်ခြင်း (`auto_jumpcut`)၊ ရွှေ့ပြောင်း/ညှပ်ထုတ်ခြင်း |
| **Visual FX & Styles** | `capcut_list_effects`<br>`capcut_apply_effect`<br>`capcut_list_transitions`<br>`capcut_apply_transition`<br>`capcut_list_animations`<br>`capcut_apply_animation`<br>`capcut_list_filters`<br>`capcut_apply_filter` | 1800+ Video Effects, 1100+ Transitions, 800+ Animations, 450+ Color Filters (LUTs) များကို ရှာဖွေပြီး ထည့်သွင်းခြင်း |
| **Motion & Layout** | `capcut_add_keyframe`<br>`capcut_apply_mask`<br>`capcut_set_speed_curve`<br>`capcut_apply_pip_layout`<br>`capcut_apply_chroma_key` | Dynamic Punch-in Zoom Keyframes, Video Masks (Circle, Rect, Heart), Speed Ramping (Hero, Montage), PiP Facecam Split-Screen, Green Screen ဖောက်ခြင်း |
| **Audio & Voice** | `capcut_set_audio_fade`<br>`capcut_apply_audio_effect`<br>`capcut_auto_duck_bgm`<br>`capcut_normalize_audio` | အသံ Fade In/Out, Voice Filters (Robot, Deep, Echo), စကားပြောချိန် BGM အသံ အလိုအလျောက် တိုးပေးခြင်း (Auto-Ducking), Speech Normalizer |
| **Overlays & UI** | `capcut_add_subtitles_batch`<br>`capcut_add_progress_bar`<br>`capcut_add_lower_third`<br>`capcut_set_canvas`<br>`capcut_set_canvas_blur`<br>`capcut_inspect_edit` | Bulk Subtitles ထည့်သွင်းခြင်း, Animated Video Progress Bar (0-100%), Speaker Lower-Third Badge, 9:16 / 16:9 Canvas ပြောင်းခြင်း, Background Blur, Edit Analytics စစ်ဆေးခြင်း |
| **Video Understanding & Semantic AI Director** | `capcut_analyze_video_understanding`<br>`capcut_find_visual_scenes`<br>`capcut_semantic_edit` | ဗီဒီယို၏ ရုပ်မြင်ကွင်း၊ မျက်နှာအမူအရာ (ငိုခြင်း၊ စိတ်လှုပ်ရှားခြင်း) များကို Multimodal AI ဖြင့် ခွဲခြမ်းစိတ်ဖြာပြီး Visual Query (ဥပမာ - "ငိုတဲ့ အပိုင်း", "phone demo") ဖြင့် Effect/Filter/Zoom တိုက်ရိုက် ခိုင်းစေတည်းဖြတ်ခြင်း |

---

## ၇။ ပြဿနာ ဖြေရှင်းနည်းများ (Troubleshooting)

- **မေး။ CapCut တွင် ပြောင်းလဲမှုများ မပေါ်ပါက ဘာလုပ်ရမလဲ?**
  - **ဖြေ။** CapCut Desktop ကို ပိတ်ထားပြီးမှ MCP မှ Save ပြုလုပ်ပါ။ CapCut Desktop ၏ မူကွဲသစ်များအတွက် `draft_info.json` ရော `draft_content.json` ပါ အလိုအလျောက် ထပ်တူရေးသားပေးထားပါသည်။
- **မေး။ Transition သို့မဟုတ် Effect ပေါ်တွင် Download Icon ပြနေပါက ဘာလုပ်ရမလဲ?**
  - **ဖြေ။** `npm run sync-assets` ကို run ပေးပါ။ ၎င်းသည် CapCut Cache ထဲရှိ Package များကို MCP Persistent Folder ထဲသို့ အလိုအလျောက် ကူးယူပေးပြီး အမြဲတမ်း အော့ဖ်လိုင်း အသင့်သုံးနိုင်အောင် ပြုလုပ်ပေးပါမည်။
