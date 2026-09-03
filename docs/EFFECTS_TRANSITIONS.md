# CapCut MCP: Effects, Transitions, Animations & Filters

This document describes the architecture, catalog registry, MCP tool schemas, safety mechanisms, and resource resolution for CapCut transitions, video/character effects, animations, and color filters in `capcut-mcp-custom`.

---

## 1. Architecture Overview

```
+-------------------------------------------------------------------------+
|                              MCP Client                                 |
|               (Claude / Antigravity Autonomous Editor)                  |
+-------------------------------------------------------------------------+
                                    │
                                    ▼ (JSON-RPC / stdio)
+-------------------------------------------------------------------------+
|                           src/server.js                                 |
|  - 16 Core Drafting Tools (add_video, trim, split, add_text, save...)    |
|  - 8 Direct Effect Tools (list/apply transitions, effects, anims, luts)  |
+-------------------------------------------------------------------------+
        │                                                │
        ▼                                                ▼
+-----------------------+                    +-----------------------+
|      src/core.js      |                    |  src/registry/        |
|  - CapCutDraft class  | ◄── Resolution ─── |  - catalog.json       |
|  - Session mutation   |     & Linking      |    (4,582 items)      |
|  - Safety validation  |                    |  - translations.json  |
|  - Atomic file save   |                    |  - cache.js           |
+-----------------------+                    |  - registry.js        |
        │                                    +-----------------------+
        ▼                                                │
+-----------------------+                                ▼
|  draft_content.json   |                    +-----------------------+
|  materials.*          | ◄── Cache Link ─── |  macOS CapCut Cache   |
|  tracks.*             |     (Local Disk)   |  ~/Movies/CapCut/...  |
+-----------------------+                    +-----------------------+
```

---

## 2. Catalog & Registry Format

The catalog (`src/registry/catalog.json`) indexes 4,582 built-in CapCut effects, transitions, animations, and filters across 11 categories:

| Category Kind | Description | Example Built-in Items |
| :--- | :--- | :--- |
| `transition` | Video clip transitions (outgoing to incoming clip) | `Cross Dissolve` (叠化), `Bubble Blur` (泡泡模糊), `Flash White` (闪白) |
| `video_effect` | Visual scene effects (glitch, blur, shake, light leak) | `Beat Shots`, `Blur` (模糊), `Gaussian Blur` (高斯模糊), `Film Light Leak` |
| `character_effect`| Face & character effects | Face tracking, portrait glow, beauty effects |
| `filter` | Color grading looks / LUTs | `Vintage 90s` (复古90s), `American Film`, `BW 2`, `Teal & Orange` |
| `intro` | Video clip entrance animations | `Dynamic Zoom In` (动感放大), `Slide Up` (向上滑动), `MC爆炸` |
| `outro` | Video clip exit animations | `Zoom Out` (缩小), `Fade Out` (渐隐), `Slide Down` |
| `group_anim` | Video clip combo/group animations | 3D rotations, camera shake combinations |
| `text_intro` | Subtitle / text entrance animations | `Zoom In / Pop` (放大), `Fade In` (渐显), `Typewriter` |
| `text_outro` | Subtitle / text exit animations | `Fade Out` (渐隐), `Slide Down` |
| `text_loop` | Subtitle continuous loop animations | Wave, pulse, heartbeat, flashing |
| `audio_effect` | Sound and voice effects | Pitch shift, echo, reverb, robot |

### Catalog Entry Schema

```json
{
  "kind": "transition",
  "key": "叠化",
  "name": "叠化",
  "en": "Cross Dissolve",
  "effectId": "6724845717472416269",
  "resourceId": "6724845717472416269",
  "isVip": false,
  "defaultDurationUs": 500000,
  "isOverlap": true,
  "params": []
}
```

---

## 3. Name Resolution & Lookup Engine

`resolveItem(kind, query)` resolves user/AI queries using multi-tier lookup:

1. **Exact ID Match**: matches `effectId` or `resourceId` (e.g. `6724845717472416269`).
2. **Exact Key Match**: matches enum identifier (e.g. `Cross_Dissolve`, `Beat_Shots`, `BW_2`).
3. **English Alias Match**: matches curated English label from `translations.json` (e.g. `"Cross Dissolve"`, `"Bubble Blur"`, `"Vintage 90s"`).
4. **Display Name Match**: matches CapCut's native display name (e.g. `"叠化"`, `"泡泡模糊"`).
5. **Normalized Fuzzy Match**: strips spaces, hyphens, and casing (e.g. `"crossdissolve"` -> `"Cross Dissolve"`).
6. **Substring Search**: finds closest matching item within the requested kind.

---

## 4. MCP Tools & API Reference

### 1. `capcut_list_effects`
Search visual and character effects.
- `query` *(optional string)*: Search keyword (e.g., `"blur"`, `"shake"`, `"glitch"`).
- `category` *(optional string)*: `'video_effect'` \| `'character_effect'` \| `'audio_effect'`.
- `cachedOnly` *(optional boolean)*: Return only items cached locally on disk.
- `limit` *(optional number)*: Max results (default: 20).

### 2. `capcut_apply_effect`
Apply an effect to a segment or create a standalone effect layer track.
- `draft` *(string)*: Draft project name.
- `segmentId` *(optional string)*: Target clip segment ID. If omitted, creates a standalone effect layer on an `"effect"` track.
- `effect` *(string)*: Effect name, English label, or ID (e.g., `"Blur"`, `"Beat Shots"`).
- `startSec` *(optional number)*: Start time in seconds (for layer mode).
- `durationSec` *(optional number)*: Duration in seconds.
- `intensity` *(optional number)*: Intensity 0–100.
- `params` *(optional array of numbers)*: Parameter adjustments (0–100 each).

### 3. `capcut_list_transitions`
Search video clip transitions.
- `query` *(optional string)*: Keyword (e.g., `"dissolve"`, `"wipe"`, `"blur"`, `"zoom"`).
- `cachedOnly` *(optional boolean)*: Only locally cached resources.
- `limit` *(optional number)*: Max results (default: 20).

### 4. `capcut_apply_transition`
Apply a transition after a clip into the following clip on the timeline.
- `draft` *(string)*: Draft project name.
- `segmentId` *(string)*: Target outgoing segment ID.
- `transition` *(string)*: Transition name or ID (e.g. `"Cross Dissolve"`, `"Bubble Blur"`).
- `durationSec` *(optional number)*: Transition duration in seconds (default ~0.5s–0.8s).
- `overlap` *(optional boolean)*: Whether transition overlaps adjacent clips (default: true).

### 5. `capcut_list_animations`
Search in, out, loop, and combo animations for video or text.
- `query` *(optional string)*: Keyword (e.g., `"zoom"`, `"fade"`, `"slide"`, `"pop"`).
- `type` *(optional string)*: `'in'` \| `'out'` \| `'loop'` \| `'group'`.
- `targetType` *(optional string)*: `'video'` \| `'text'`.
- `cachedOnly` *(optional boolean)*: Only cached resources.
- `limit` *(optional number)*: Max results (default: 20).

### 6. `capcut_apply_animation`
Apply an entrance, exit, or loop animation to a video clip or text overlay.
- `draft` *(string)*: Draft project name.
- `segmentId` *(string)*: Target video or text segment ID.
- `animation` *(string)*: Animation name or ID (e.g., `"Zoom In"`, `"Fade In"`, `"MC爆炸"`).
- `animationType` *(optional string)*: `'in'` \| `'out'` \| `'loop'` \| `'group'`.
- `durationSec` *(optional number)*: Animation duration in seconds.
- `startSec` *(optional number)*: Start offset within segment in seconds.

### 7. `capcut_list_filters`
Search color filter looks and LUTs.
- `query` *(optional string)*: Keyword (e.g., `"vintage"`, `"film"`, `"teal"`, `"bw"`).
- `cachedOnly` *(optional boolean)*: Only cached filters.
- `limit` *(optional number)*: Max results (default: 20).

### 8. `capcut_apply_filter`
Apply a color filter to a clip or as an adjustment layer track.
- `draft` *(string)*: Draft project name.
- `segmentId` *(optional string)*: Target clip segment ID. If omitted, creates a filter adjustment track.
- `filter` *(string)*: Filter name or ID (e.g., `"Vintage 90s"`, `"BW 2"`, `"American Film"`).
- `intensity` *(optional number)*: Intensity 0–100 (default: 100).
- `startSec` *(optional number)*: Start time in seconds (for layer mode).
- `durationSec` *(optional number)*: Duration in seconds.

---

## 5. Local macOS Cache Discovery

CapCut Desktop caches downloaded effect resources on macOS in:
- `~/Movies/CapCut/User Data/Cache/effect/<resourceId>/<hash>/config.json`
- `~/Library/Containers/com.lemon.lvoverseas/Data/Movies/CapCut/User Data/Cache/effect/...`

When `applyEffect`, `applyTransition`, `applyFilter`, or `applyAnimation` runs, `src/registry/cache.js` checks whether the target `resourceId` is downloaded on the machine. If present:
1. `cached: true` is reported.
2. The material's `path` in `draft_content.json` is set directly to the local folder path.
3. When opened in CapCut Desktop, the effect renders immediately without prompting the user to download assets.

---

## 6. Read-Only Harvester (`src/harvest.js`)

The harvester scans existing drafts in `CAPCUT_DRAFTS_DIR` in strictly read-only mode:
- Identifies all effect, transition, filter, and animation materials already used in the user's projects.
- Tracks `useCount` and detects local cache availability.
- Extracts verified material JSON structures to guarantee format compatibility with installed CapCut Desktop versions.

To run the harvester manually:
```bash
node src/harvest.js
```

---

## 7. Safety, Validation & Atomic Saves

1. **Process Lock Check**: `isCapCutRunning()` checks for active `CapCut` processes using macOS-native `pgrep` and `ps`. Saving refuses to overwrite open drafts unless `force: true` is passed.
2. **Backup Pre-Save**: Before writing to `draft_content.json`, an automatic `.mcpbak` backup is created.
3. **Atomic File Write**: Edits are written to a `.tmp` file and renamed atomically into place.
4. **Comprehensive Validation**:
   - Validates that transition duration does not exceed segment duration.
   - Detects duplicate material IDs across materials.
   - Checks for dangling `extra_material_refs` (references with no corresponding material).
   - Validates non-overlapping tracks and missing media files.

---

## 8. Adding New Resource Mappings

To add new English aliases or custom translations:
1. Open `src/registry/translations.json`.
2. Add the Chinese display name as key and the English label as value:
   ```json
   "新特效名称": "New Effect English Label"
   ```
3. The catalog will automatically resolve lookups using either name.
