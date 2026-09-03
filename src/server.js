#!/usr/bin/env node
// capcut-mcp: MCP stdio server exposing CapCut draft-editing tools.
// Editing tools accumulate in an in-memory session (open -> edit -> edit -> save);
// nothing touches disk until capcut_save. All times are in SECONDS at the tool boundary.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { CapCutDraft, cloneDraft, listDrafts, listStickers, DRAFTS_DIR } from './core.js';
import { searchCatalog, getCatalogCounts } from './registry/registry.js';
import { harvestUsedMaterials } from './harvest.js';

const US = 1e6;
const open = new Map(); // name -> live CapCutDraft (unsaved edits)
const get = name => { if (!open.has(name)) open.set(name, new CapCutDraft(name)); return open.get(name); };
const ok = obj => ({ content: [{ type: 'text', text: JSON.stringify(obj, null, 2) }] });
const err = e => ({ content: [{ type: 'text', text: 'ERROR: ' + (e && e.message || e) }], isError: true });
const wrap = fn => async (a) => { try { return ok(await fn(a)); } catch (e) { return err(e); } };
const sec = v => v == null ? undefined : Math.round(v * US);

// media-placement option shape shared by add_video/image/audio
const placeOpts = {
  atSec: z.number().describe('start time on the timeline, seconds'),
  durSec: z.number().optional().describe('duration (default: full media length)'),
  srcStartSec: z.number().optional().describe('in-point inside the source file, seconds'),
  trackIndex: z.number().int().optional().describe('target track (index in the tracks list); a new track is made if omitted'),
  trackRenderIndex: z.number().int().optional().describe('layer order; higher = on top'),
  scale: z.number().optional(), posX: z.number().optional(), posY: z.number().optional(),
  rotation: z.number().optional(), opacity: z.number().optional(), volume: z.number().optional(), speed: z.number().optional(),
};
const optsFrom = a => ({ atUs: sec(a.atSec), durUs: sec(a.durSec), srcStartUs: sec(a.srcStartSec),
  trackIndex: a.trackIndex, trackRenderIndex: a.trackRenderIndex, scale: a.scale, posX: a.posX, posY: a.posY,
  rotation: a.rotation, opacity: a.opacity, volume: a.volume, speed: a.speed });

const s = new McpServer({ name: 'capcut', version: '0.2.0' });

// ==========================================
// 1. EXISTING MCP TOOLS (PRESERVED)
// ==========================================

s.tool('capcut_list_drafts', `List CapCut drafts in ${DRAFTS_DIR} with duration and lock status.`, {}, wrap(async () => ({ draftsDir: DRAFTS_DIR, drafts: listDrafts() })));

s.tool('capcut_read_timeline', 'Read a draft: canvas, fps, tracks and every segment (id, media, times, layer). Read-only.',
  { draft: z.string() }, wrap(async ({ draft }) => new CapCutDraft(draft).timeline()));

s.tool('capcut_clone_draft', 'Copy a draft folder to a new name (valid scaffolding). empty:true clears all clips/tracks for a fresh build.',
  { base: z.string(), newName: z.string(), empty: z.boolean().optional() },
  wrap(async ({ base, newName, empty }) => cloneDraft(base, newName, { empty: !!empty })));

s.tool('capcut_add_video', 'Add a video clip at a time on a track. Session edit; call capcut_save to persist.',
  { draft: z.string(), file: z.string(), ...placeOpts },
  wrap(async (a) => get(a.draft).addVideo(a.file, optsFrom(a))));

s.tool('capcut_add_image', 'Add an image at a time on a track.',
  { draft: z.string(), file: z.string(), ...placeOpts },
  wrap(async (a) => get(a.draft).addImage(a.file, optsFrom(a))));

s.tool('capcut_add_audio', 'Add an audio clip at a time on a track.',
  { draft: z.string(), file: z.string(), ...placeOpts },
  wrap(async (a) => get(a.draft).addAudio(a.file, optsFrom(a))));

s.tool('capcut_add_text', 'Add a text overlay. Requires a text template (a draft with a text layer; see CAPCUT_TEMPLATE_DRAFT).',
  { draft: z.string(), text: z.string(), atSec: z.number(), durSec: z.number().optional(),
    fontSize: z.number().optional(), color: z.string().optional().describe('hex e.g. #ffffff'),
    posX: z.number().optional(), posY: z.number().optional(), trackIndex: z.number().int().optional() },
  wrap(async (a) => get(a.draft).addText(a.text, { atUs: sec(a.atSec), durUs: sec(a.durSec), fontSize: a.fontSize, color: a.color, posX: a.posX, posY: a.posY, trackIndex: a.trackIndex })));

s.tool('capcut_add_track', 'Add a new track (video | audio | text | sticker | effect | filter).',
  { draft: z.string(), type: z.enum(['video', 'audio', 'text', 'sticker', 'effect', 'filter']).optional(), name: z.string().optional() },
  wrap(async ({ draft, type, name }) => ({ trackIndex: get(draft).addTrack(type || 'video', name) })));

s.tool('capcut_move_segment', 'Move a segment to a new start time and optionally another track.',
  { draft: z.string(), segmentId: z.string(), atSec: z.number(), trackIndex: z.number().int().optional() },
  wrap(async ({ draft, segmentId, atSec, trackIndex }) => get(draft).moveSegment(segmentId, sec(atSec), trackIndex)));

s.tool('capcut_trim_segment', 'Change a segment start / duration / source in-point (seconds).',
  { draft: z.string(), segmentId: z.string(), atSec: z.number().optional(), durSec: z.number().optional(), srcStartSec: z.number().optional() },
  wrap(async ({ draft, segmentId, atSec, durSec, srcStartSec }) => get(draft).trimSegment(segmentId, { atUs: sec(atSec), durUs: sec(durSec), srcStartUs: sec(srcStartSec) })));

s.tool('capcut_split_segment', 'Split a segment into two at a timeline time.',
  { draft: z.string(), segmentId: z.string(), atSec: z.number() },
  wrap(async ({ draft, segmentId, atSec }) => get(draft).splitSegment(segmentId, sec(atSec))));

s.tool('capcut_delete_segment', 'Remove a segment.',
  { draft: z.string(), segmentId: z.string() }, wrap(async ({ draft, segmentId }) => get(draft).deleteSegment(segmentId)));

s.tool('capcut_set_props', 'Set transform / opacity / volume / speed / visibility on a segment.',
  { draft: z.string(), segmentId: z.string(), scale: z.number().optional(), scaleX: z.number().optional(), scaleY: z.number().optional(),
    posX: z.number().optional(), posY: z.number().optional(), rotation: z.number().optional(), opacity: z.number().optional(),
    volume: z.number().optional(), speed: z.number().optional(), visible: z.boolean().optional() },
  wrap(async (a) => get(a.draft).setProps(a.segmentId, a)));

s.tool('capcut_raw_patch', 'Advanced escape hatch: deep-merge a JSON patch into draft_content (undocumented ops). Use with care.',
  { draft: z.string(), patch: z.record(z.any()) }, wrap(async ({ draft, patch }) => get(draft).rawPatch(patch)));

s.tool('capcut_validate', 'Check the (in-session) draft for overlaps, duplicate ids/render_index, dangling references, missing media.',
  { draft: z.string() }, wrap(async ({ draft }) => get(draft).validate()));

s.tool('capcut_save', 'Write session edits to disk (backs up .mcpbak, validates). Refuses if CapCut is open unless force:true.',
  { draft: z.string(), force: z.boolean().optional() },
  wrap(async ({ draft, force }) => { const r = get(draft).save({ force: !!force }); open.delete(draft); return r; }));

s.tool('capcut_discard', 'Drop unsaved session edits and reload the draft from disk.',
  { draft: z.string() }, wrap(async ({ draft }) => { open.delete(draft); return { discarded: draft }; }));

// ==========================================
// 2. EFFECTS, TRANSITIONS, ANIMATIONS & FILTERS
// ==========================================

s.tool('capcut_list_effects', 'Search CapCut visual/character effects catalog (~1800+ entries) by keyword or category.',
  { query: z.string().optional().describe('search keyword (e.g. "blur", "shake", "glitch", "flash")'),
    category: z.enum(['video_effect', 'character_effect', 'audio_effect']).optional().describe('filter by category'),
    cachedOnly: z.boolean().optional().describe('only return effects cached locally on this machine'),
    limit: z.number().int().optional().describe('max results to return (default: 20)') },
  wrap(async ({ query, category, cachedOnly, limit }) => {
    const results = searchCatalog(query, { kind: category || 'video_effect', cachedOnly: !!cachedOnly, limit: limit || 20 });
    return { count: results.length, totalCatalog: getCatalogCounts(), results };
  }));

s.tool('capcut_apply_effect', 'Apply a visual effect to a specific segment or as a standalone effect layer track.',
  { draft: z.string(),
    segmentId: z.string().optional().describe('target clip segment ID, or omit for a standalone effect track layer'),
    effect: z.string().describe('effect name, English label, or effect ID (e.g. "Blur", "模糊", "Beat Shots")'),
    startSec: z.number().optional().describe('timeline start time in seconds (for standalone effect layer)'),
    durationSec: z.number().optional().describe('effect duration in seconds'),
    intensity: z.number().optional().describe('effect intensity 0-100'),
    params: z.array(z.number()).optional().describe('optional effect parameter values (0-100 each)'),
    trackIndex: z.number().int().optional().describe('target track index if creating a layer') },
  wrap(async (a) => get(a.draft).applyEffect(a.segmentId, a.effect, {
    atUs: sec(a.startSec), durUs: sec(a.durationSec), intensity: a.intensity, params: a.params, trackIndex: a.trackIndex, asLayer: !a.segmentId,
  })));

s.tool('capcut_list_transitions', 'Search CapCut transitions catalog (~1100+ entries, e.g. "Cross Dissolve", "Bubble Blur", "Flash White").',
  { query: z.string().optional().describe('search keyword (e.g. "dissolve", "blur", "wipe", "zoom")'),
    cachedOnly: z.boolean().optional().describe('only return transitions cached locally on this machine'),
    limit: z.number().int().optional().describe('max results to return (default: 20)') },
  wrap(async ({ query, cachedOnly, limit }) => {
    const results = searchCatalog(query, { kind: 'transition', cachedOnly: !!cachedOnly, limit: limit || 20 });
    return { count: results.length, results };
  }));

s.tool('capcut_apply_transition', 'Apply a transition after the selected clip segment (transitioning into the following clip).',
  { draft: z.string(),
    segmentId: z.string().describe('the segment after which the transition occurs'),
    transition: z.string().describe('transition name, English label, or effect ID (e.g. "Cross Dissolve", "叠化", "Bubble Blur")'),
    durationSec: z.number().optional().describe('transition duration in seconds (default ~0.5s-0.8s)'),
    overlap: z.boolean().optional().describe('whether transition overlaps adjacent clips (default: true)') },
  wrap(async (a) => get(a.draft).applyTransition(a.segmentId, a.transition, {
    durUs: sec(a.durationSec), overlap: a.overlap,
  })));

s.tool('capcut_list_animations', 'Search CapCut animations catalog (~800+ entries: in, out, loop, group for video or text).',
  { query: z.string().optional().describe('search keyword (e.g. "zoom", "fade", "slide", "bounce")'),
    type: z.enum(['in', 'out', 'loop', 'group', 'intro', 'outro']).optional().describe('animation direction/type'),
    targetType: z.enum(['video', 'text']).optional().describe('target element type (video or text)'),
    cachedOnly: z.boolean().optional().describe('only return animations cached locally'),
    limit: z.number().int().optional().describe('max results to return (default: 20)') },
  wrap(async ({ query, type, targetType, cachedOnly, limit }) => {
    let kind = null;
    if (targetType === 'text') {
      if (type === 'in' || type === 'intro') kind = 'text_intro';
      else if (type === 'out' || type === 'outro') kind = 'text_outro';
      else if (type === 'loop') kind = 'text_loop';
    } else {
      if (type === 'in' || type === 'intro') kind = 'intro';
      else if (type === 'out' || type === 'outro') kind = 'outro';
      else if (type === 'group') kind = 'group_anim';
    }
    const results = searchCatalog(query, { kind, cachedOnly: !!cachedOnly, limit: limit || 20 });
    return { count: results.length, results };
  }));

s.tool('capcut_apply_animation', 'Apply an in/out/loop animation to a video clip, image, or text overlay.',
  { draft: z.string(),
    segmentId: z.string().describe('target segment ID (video clip, image, or text overlay)'),
    animation: z.string().describe('animation name, English label, or effect ID (e.g. "Fade In", "渐显", "Zoom In")'),
    animationType: z.enum(['in', 'out', 'loop', 'group']).optional().describe('animation type (defaults to catalog type)'),
    durationSec: z.number().optional().describe('animation duration in seconds'),
    startSec: z.number().optional().describe('start offset within the segment in seconds') },
  wrap(async (a) => get(a.draft).applyAnimation(a.segmentId, a.animation, {
    animationType: a.animationType, durUs: sec(a.durationSec), startUs: sec(a.startSec),
  })));

s.tool('capcut_list_filters', 'Search CapCut color filters catalog (~450+ LUTs/looks, e.g. "Vintage 90s", "American Film", "Teal & Orange").',
  { query: z.string().optional().describe('search keyword (e.g. "vintage", "film", "teal", "bw")'),
    cachedOnly: z.boolean().optional().describe('only return filters cached locally on this machine'),
    limit: z.number().int().optional().describe('max results to return (default: 20)') },
  wrap(async ({ query, cachedOnly, limit }) => {
    const results = searchCatalog(query, { kind: 'filter', cachedOnly: !!cachedOnly, limit: limit || 20 });
    return { count: results.length, results };
  }));

s.tool('capcut_apply_filter', 'Apply a color filter (grade/look) to a specific segment or as a standalone adjustment filter track.',
  { draft: z.string(),
    segmentId: z.string().optional().describe('target clip segment ID, or omit for a standalone filter track layer'),
    filter: z.string().describe('filter name, English label, or effect ID (e.g. "Vintage 90s", "复古90s", "BW 2")'),
    intensity: z.number().optional().describe('filter intensity (0-100, default: 100)'),
    startSec: z.number().optional().describe('timeline start time in seconds (for standalone filter layer)'),
    durationSec: z.number().optional().describe('filter duration in seconds'),
    trackIndex: z.number().int().optional().describe('target track index if creating a layer') },
  wrap(async (a) => get(a.draft).applyFilter(a.segmentId, a.filter, {
    intensity: a.intensity, atUs: sec(a.startSec), durUs: sec(a.durationSec), trackIndex: a.trackIndex, asLayer: !a.segmentId,
  })));

s.tool('capcut_list_stickers', 'Search available and cached CapCut stickers, emojis, subscribe buttons, and badges.',
  { query: z.string().optional().describe('search keyword or sticker name/ID'),
    limit: z.number().int().optional().describe('max results to return (default: 30)') },
  wrap(async ({ query, limit }) => {
    const results = listStickers(query, { limit: limit || 30 });
    return { count: results.length, results };
  }));

s.tool('capcut_add_sticker', 'Place a sticker/overlay onto the timeline at a specific time, position, scale, and duration.',
  { draft: z.string(),
    sticker: z.string().describe('sticker resource ID or keyword/name (e.g. "Like", "Subscribe", resource ID)'),
    atSec: z.number().describe('start time on the timeline, seconds'),
    durSec: z.number().optional().describe('duration on the timeline, seconds (default: 3.0s)'),
    scale: z.number().optional().describe('scale multiplier (default: 1.0)'),
    posX: z.number().optional().describe('horizontal position from -1.0 to 1.0 (default: 0.0 center)'),
    posY: z.number().optional().describe('vertical position from -1.0 to 1.0 (default: 0.0 center)'),
    rotation: z.number().optional().describe('rotation in degrees (default: 0.0)'),
    opacity: z.number().optional().describe('opacity from 0.0 to 1.0 (default: 1.0)'),
    trackIndex: z.number().int().optional().describe('target sticker track index') },
  wrap(async (a) => get(a.draft).addSticker(a.sticker, {
    atUs: sec(a.atSec), durUs: sec(a.durSec), scale: a.scale, posX: a.posX, posY: a.posY,
    rotation: a.rotation, opacity: a.opacity, trackIndex: a.trackIndex,
  })));

s.tool('capcut_add_keyframe', 'Add smooth animation keyframes (scale, position, rotation, opacity, volume) to a segment.',
  { draft: z.string(),
    segmentId: z.string().describe('target clip segment ID'),
    property: z.enum(['scale', 'scale_x', 'scale_y', 'position_x', 'position_y', 'rotation', 'opacity', 'volume']).describe('property to animate'),
    keyframes: z.array(z.object({
      timeOffsetSec: z.number().describe('time offset relative to segment start in seconds'),
      value: z.number().describe('target value at this keyframe (e.g. scale: 1.15, opacity: 0.5, posX: 0.2)')
    })).describe('list of keyframe points') },
  wrap(async (a) => get(a.draft).addKeyframe(a.segmentId, a.property, a.keyframes)));

s.tool('capcut_apply_mask', 'Apply a video shape mask (circle, rectangle, linear, mirror, heart, star) with feather and inversion.',
  { draft: z.string(),
    segmentId: z.string().describe('target clip segment ID'),
    maskType: z.enum(['circle', 'rectangle', 'linear', 'mirror', 'heart', 'star']).describe('mask shape'),
    centerX: z.number().optional().describe('center X position (-1.0 to 1.0, default: 0.0)'),
    centerY: z.number().optional().describe('center Y position (-1.0 to 1.0, default: 0.0)'),
    width: z.number().optional().describe('mask width (0.0 to 1.0, default: 0.5)'),
    height: z.number().optional().describe('mask height (0.0 to 1.0, default: 0.5)'),
    rotation: z.number().optional().describe('rotation degrees (0-360)'),
    feather: z.number().optional().describe('edge feather/softness (0.0 to 1.0)'),
    roundCorner: z.number().optional().describe('corner roundness for rectangle (0.0 to 1.0)'),
    invert: z.boolean().optional().describe('invert mask (cut out inside vs outside)') },
  wrap(async (a) => get(a.draft).applyMask(a.segmentId, a.maskType, {
    centerX: a.centerX, centerY: a.centerY, width: a.width, height: a.height,
    rotation: a.rotation, feather: a.feather, roundCorner: a.roundCorner, invert: a.invert
  })));
s.tool('capcut_set_audio_fade', 'Set fade-in and fade-out durations on an audio or video clip.',
  { draft: z.string(),
    segmentId: z.string().describe('target audio/video segment ID'),
    fadeInSec: z.number().optional().describe('fade-in duration in seconds (default: 0.0)'),
    fadeOutSec: z.number().optional().describe('fade-out duration in seconds (default: 0.0)') },
  wrap(async (a) => get(a.draft).setAudioFade(a.segmentId, { fadeInSec: a.fadeInSec, fadeOutSec: a.fadeOutSec })));

s.tool('capcut_apply_audio_effect', 'Apply a voice filter or audio scene effect (e.g. "Robot", "Deep", "Echo", "Telephone", "Chipmunk").',
  { draft: z.string(),
    segmentId: z.string().describe('target audio or video clip segment ID'),
    audioEffect: z.string().describe('audio effect name or ID (e.g. "Robot", "Deep", "Echo", "Low Pitch", "High Pitch")') },
  wrap(async (a) => get(a.draft).applyAudioEffect(a.segmentId, a.audioEffect)));

s.tool('capcut_add_subtitles_batch', 'Bulk add Burmese/English subtitles with typography styling, outline strokes, and positions.',
  { draft: z.string(),
    subtitles: z.array(z.object({
      startSec: z.number().describe('subtitle start time in seconds'),
      durSec: z.number().optional().describe('subtitle duration in seconds'),
      endSec: z.number().optional().describe('subtitle end time in seconds'),
      text: z.string().describe('subtitle text line')
    })).describe('array of subtitle segments'),
    fontSize: z.number().optional().describe('font size (default: 12)'),
    color: z.string().optional().describe('text fill hex color (e.g. "#FFFFFF", "#FFE600")'),
    strokeColor: z.string().optional().describe('outline stroke hex color (e.g. "#000000")'),
    strokeWidth: z.number().optional().describe('outline stroke width (default: 0.08)'),
    posY: z.number().optional().describe('vertical position from -1.0 to 1.0 (default: -0.75 near bottom)'),
    trackIndex: z.number().int().optional().describe('target text track index') },
  wrap(async (a) => get(a.draft).addSubtitlesBatch(a.subtitles, {
    fontSize: a.fontSize, color: a.color, strokeColor: a.strokeColor,
    strokeWidth: a.strokeWidth, posY: a.posY, trackIndex: a.trackIndex
  })));

s.tool('capcut_set_canvas', 'Change project canvas aspect ratio (e.g. "9:16" for TikTok/Reels, "16:9" for YouTube, "1:1" for Square).',
  { draft: z.string(),
    ratio: z.enum(['16:9', '9:16', '1:1', '4:5', '21:9']).describe('aspect ratio preset'),
    width: z.number().int().optional().describe('custom width in pixels'),
    height: z.number().int().optional().describe('custom height in pixels') },
  wrap(async (a) => get(a.draft).setCanvas(a.width && a.height ? { width: a.width, height: a.height, ratio: a.ratio } : a.ratio)));

s.tool('capcut_set_speed_curve', 'Apply dynamic speed ramping/curves (e.g. "montage", "hero", "bullet_time", "flash_in", "flash_out") to a video clip.',
  { draft: z.string(),
    segmentId: z.string().describe('target video segment ID'),
    curve: z.union([
      z.enum(['montage', 'hero', 'bullet', 'bullet_time', 'flash_in', 'flash_out']),
      z.array(z.object({ x: z.number(), y: z.number() }))
    ]).describe('speed ramping preset name or array of {x,y} curve points') },
  wrap(async (a) => get(a.draft).setSpeedCurve(a.segmentId, a.curve)));

s.tool('capcut_apply_chroma_key', 'Apply Green Screen / Chroma Key background cutout with intensity and shadow.',
  { draft: z.string(),
    segmentId: z.string().describe('target video/image segment ID'),
    color: z.string().optional().describe('hex color to key out (default: "#00FF00" green)'),
    intensity: z.number().optional().describe('chroma intensity (0-100, default: 50)'),
    shadow: z.number().optional().describe('shadow preservation (0-100, default: 50)') },
  wrap(async (a) => get(a.draft).applyChromaKey(a.segmentId, { color: a.color, intensity: a.intensity, shadow: a.shadow })));

s.tool('capcut_apply_pip_layout', 'Apply Picture-in-Picture or Split-Screen layout preset to a clip.',
  { draft: z.string(),
    segmentId: z.string().describe('target video/image segment ID'),
    layout: z.enum(['corner_br', 'corner_tr', 'corner_bl', 'corner_tl', 'split_left', 'split_right', 'split_top', 'split_bottom']).describe('PiP or split-screen preset'),
    scale: z.number().optional().describe('scale for corner PiP (default: 0.35)') },
  wrap(async (a) => get(a.draft).applyPipLayout(a.segmentId, a.layout, { scale: a.scale })));

s.tool('capcut_auto_duck_bgm', 'Automatically duck/lower BGM music volume during spoken dialogue and raise volume during silence.',
  { draft: z.string(),
    bgmTrackIndex: z.number().int().describe('track index of the BGM music'),
    speechTrackIndex: z.number().int().optional().describe('track index of dialogue/voice (default: 0)'),
    duckVolume: z.number().optional().describe('volume during speech (default: 0.15)'),
    baseVolume: z.number().optional().describe('volume during silence/breaks (default: 0.70)'),
    fadeDurationSec: z.number().optional().describe('transition fade duration in seconds (default: 0.4s)') },
  wrap(async (a) => get(a.draft).autoDuckBgm(a.bgmTrackIndex, a.speechTrackIndex || 0, {
    duckVolume: a.duckVolume, baseVolume: a.baseVolume, fadeDurationSec: a.fadeDurationSec
  })));

s.tool('capcut_add_progress_bar', 'Add an animated video progress bar that fills from 0% to 100% across the video duration.',
  { draft: z.string(),
    color: z.string().optional().describe('hex color (e.g. "#FF0055", "#FFE600", default: "#FF0055")'),
    position: z.enum(['bottom', 'top']).optional().describe('bar position (default: "bottom")'),
    trackIndex: z.number().int().optional().describe('target track index') },
  wrap(async (a) => get(a.draft).addProgressBar({ color: a.color, position: a.position, trackIndex: a.trackIndex })));

s.tool('capcut_add_lower_third', 'Add a speaker name and title badge / lower-third overlay with animations.',
  { draft: z.string(),
    title: z.string().describe('speaker name or main title'),
    subtitle: z.string().optional().describe('speaker role, company, or sub-headline'),
    atSec: z.number().optional().describe('start time in seconds (default: 0.0)'),
    durSec: z.number().optional().describe('duration in seconds (default: 5.0)'),
    titleColor: z.string().optional().describe('title font color (default: "#FFFFFF")'),
    strokeColor: z.string().optional().describe('outline stroke color (default: "#000000")'),
    posX: z.number().optional().describe('horizontal position (default: -0.45 bottom-left)'),
    posY: z.number().optional().describe('vertical position (default: -0.65 bottom-left)'),
    trackIndex: z.number().int().optional().describe('target text track index') },
  wrap(async (a) => get(a.draft).addLowerThird(a.title, a.subtitle, {
    atSec: a.atSec, durSec: a.durSec, titleColor: a.titleColor, strokeColor: a.strokeColor,
    posX: a.posX, posY: a.posY, trackIndex: a.trackIndex
  })));

s.tool('capcut_normalize_audio', 'Normalize dialogue/voice volume across all segments on a track.',
  { draft: z.string(),
    trackIndex: z.number().int().optional().describe('target voice/audio track index (default: 0)'),
    targetVolume: z.number().optional().describe('target volume level multiplier (default: 1.3)') },
  wrap(async (a) => get(a.draft).normalizeAudio(a.trackIndex || 0, a.targetVolume || 1.3)));

s.tool('capcut_auto_jumpcut', 'Automatically slice and ripple-delete silence dead space on the main video track based on speech intervals.',
  { draft: z.string(),
    speechIntervals: z.array(z.object({
      startSec: z.number().describe('start time of speech in seconds'),
      endSec: z.number().describe('end time of speech in seconds')
    })).describe('list of speech active intervals'),
    paddingSec: z.number().optional().describe('safety audio padding around words in seconds (default: 0.08)'),
    trackIndex: z.number().int().optional().describe('target video track index (default: 0)') },
  wrap(async (a) => get(a.draft).autoJumpcut(a.speechIntervals, { paddingSec: a.paddingSec, trackIndex: a.trackIndex })));

s.tool('capcut_set_canvas_blur', 'Apply Gaussian canvas background blur or solid color behind a clip for vertical/horizontal reframing.',
  { draft: z.string(),
    segmentId: z.string().describe('target video/image segment ID'),
    blurRadius: z.number().optional().describe('blur intensity radius (default: 10.0)'),
    color: z.string().optional().describe('solid color hex code if using color background'),
    type: z.enum(['blur', 'color']).optional().describe('canvas background type (default: "blur")') },
  wrap(async (a) => get(a.draft).setCanvasBlur(a.segmentId, { blurRadius: a.blurRadius, color: a.color, type: a.type })));

s.tool('capcut_set_color_adjustments', 'Set manual slider color adjustments (brightness, contrast, saturation) on a segment.',
  { draft: z.string(),
    segmentId: z.string().describe('target video/image segment ID'),
    brightness: z.number().optional().describe('brightness slider (-100 to 100)'),
    contrast: z.number().optional().describe('contrast slider (-100 to 100)'),
    saturation: z.number().optional().describe('saturation slider (-100 to 100)') },
  wrap(async (a) => get(a.draft).setColorAdjustments(a.segmentId, {
    brightness: a.brightness, contrast: a.contrast, saturation: a.saturation
  })));

s.tool('capcut_inspect_edit', 'Analyze and inspect timeline statistics, B-Roll coverage percentage, cut count, and validation health.',
  { draft: z.string() },
  wrap(async ({ draft }) => get(draft).inspectEdit()));

s.tool('capcut_analyze_video_understanding', 'Extract keyframes from video and analyze scene composition, emotion, visual actions, and recommended CapCut edits using Multimodal AI.',
  { draft: z.string(),
    videoPath: z.string().describe('absolute path to source video file'),
    intervalSec: z.number().optional().describe('frame extraction interval in seconds (default: 2)'),
    maxFrames: z.number().int().optional().describe('maximum frames to sample (default: 30)'),
    apiKey: z.string().optional().describe('optional Gemini or OpenRouter API key'),
    model: z.string().optional().describe('custom model name (e.g. "gemini-2.0-flash", "gemini-2.5-flash", "google/gemini-2.0-flash-001", "openai/gpt-4o")'),
    provider: z.enum(['gemini', 'openrouter', 'heuristic']).optional().describe('AI analysis provider (default: "gemini")') },
  wrap(async (a) => get(a.draft).analyzeVideoUnderstanding(a.videoPath, {
    intervalSec: a.intervalSec, maxFrames: a.maxFrames, apiKey: a.apiKey, model: a.model, provider: a.provider
  })));

s.tool('capcut_find_visual_scenes', 'Search and retrieve timestamped scenes from the video understanding map by visual query or emotion (e.g. "crying", "phone demo", "high energy").',
  { draft: z.string(),
    query: z.string().describe('visual description or emotion to search for (e.g. "crying", "holding phone", "excited")') },
  wrap(async (a) => get(a.draft).findVisualScenes(a.query)));

s.tool('capcut_semantic_edit', 'Automatically apply a CapCut editing action (filter, effect, zoom, lower_third, canvas_blur) matching a visual scene query.',
  { draft: z.string(),
    query: z.string().describe('visual scene or emotion to match (e.g. "crying moment", "phone screen", "intro")'),
    action: z.enum(['filter', 'effect', 'zoom', 'lower_third', 'canvas_blur']).describe('editing action to apply'),
    name: z.string().optional().describe('specific filter or effect name override (e.g. "Vintage 90s", "Soft Vignette")'),
    scale: z.number().optional().describe('zoom scale factor if action is zoom (e.g. 1.10)'),
    intensity: z.number().optional().describe('filter intensity (0 to 100)'),
    title: z.string().optional().describe('title text if action is lower_third'),
    subtitle: z.string().optional().describe('subtitle text if action is lower_third') },
  wrap(async (a) => get(a.draft).applySemanticEdit(a.query, a.action, {
    name: a.name, scale: a.scale, intensity: a.intensity, title: a.title, subtitle: a.subtitle
  })));

const transport = new StdioServerTransport();
await s.connect(transport);
process.stderr.write(`[capcut-mcp] ready. drafts: ${DRAFTS_DIR}\n`);
