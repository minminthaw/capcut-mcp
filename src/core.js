// capcut-core: read/edit CapCut desktop draft projects by cloning real templates
// out of a base draft (the only reliable way to produce valid CapCut JSON).
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { isCapCutRunning } from './macos.js';
import { resolveItem, searchCatalog } from './registry/registry.js';
import { getCachedResourcePath } from './registry/cache.js';
import { getAssetsIndex } from './sync_assets.js';
import { extractVideoFrames, analyzeVideoWithAI, findScenesByQuery, generateHeuristicSceneMap } from './video_understanding.js';

// ---- where the drafts live (override with CAPCUT_DRAFTS_DIR) ----
const STD_WIN = path.join(os.homedir(), 'AppData/Local/CapCut/User Data/Projects/com.lveditor.draft');
const STD_MAC = path.join(os.homedir(), 'Movies/CapCut/User Data/Projects/com.lveditor.draft');
const CANDIDATES = [
  process.env.CAPCUT_DRAFTS_DIR,
  'D:/Capcut/CapCut Drafts',
  STD_WIN,
  STD_MAC,
].filter(Boolean);
// pick the first candidate that exists; otherwise fall back to the OS-standard CapCut location
export const DRAFTS_DIR =
  CANDIDATES.find(d => { try { return fs.statSync(d).isDirectory(); } catch { return false; } })
  || (process.platform === 'win32' ? STD_WIN : STD_MAC);
// a draft known to contain video/text/audio layers, used to harvest templates
const TEMPLATE_DRAFT = process.env.CAPCUT_TEMPLATE_DRAFT || '0723';

const uid = () => crypto.randomUUID().toUpperCase();
const clone = o => JSON.parse(JSON.stringify(o));
const US = 1e6;

function probeDur(file) {
  try { return Math.round(parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "${file}"`).toString().trim()) * US); }
  catch { return 5 * US; }
}
function probeWH(file) {
  try { const [w, h] = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x "${file}"`).toString().trim().split('x').map(Number); return { w: w || 1920, h: h || 1080 }; }
  catch { return { w: 1920, h: 1080 }; }
}

// ---- template harvesting: pull one segment (+its material +extra_material_refs +a track) per type ----
export function findMat(content, id) {
  for (const k of Object.keys(content.materials || {})) {
    if (Array.isArray(content.materials[k])) { const m = content.materials[k].find(x => x && x.id === id); if (m) return [k, m]; }
  }
  return [null, null];
}
function harvest(content) {
  const t = { tracks: {} };
  for (const track of content.tracks || []) {
    if (!t.tracks[track.type]) { const tk = clone(track); tk.segments = []; t.tracks[track.type] = tk; }
    for (const seg of (track.segments || [])) {
      const [, mat] = findMat(content, seg.material_id);
      const type = mat && mat.type ? mat.type : track.type;
      if (t[type]) continue;
      if (!mat) continue;
      const refs = (seg.extra_material_refs || []).map(id => { const [k, m] = findMat(content, id); return m ? { k, m: clone(m) } : null; }).filter(Boolean);
      t[type] = { seg: clone(seg), mat: clone(mat), refs };
    }
  }
  return t;
}

export function listDrafts() {
  let names = [];
  try {
    names = fs.readdirSync(DRAFTS_DIR).filter(n => {
      try {
        const d = path.join(DRAFTS_DIR, n);
        return fs.statSync(d).isDirectory() &&
          (fs.existsSync(path.join(d, 'draft_info.json')) || fs.existsSync(path.join(d, 'draft_content.json')));
      } catch { return false; }
    });
  } catch {}
  return names.map(name => {
    const dir = path.join(DRAFTS_DIR, name);
    let dur = null;
    try {
      const file = fs.existsSync(path.join(dir, 'draft_info.json')) ? 'draft_info.json' : 'draft_content.json';
      dur = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')).duration / US;
    } catch {}
    return { name, locked: fs.existsSync(path.join(dir, '.locked')), durationSec: dur };
  });
}

export class CapCutDraft {
  constructor(name) {
    this.name = name;
    this.dir = path.join(DRAFTS_DIR, name);
    const infoPath = path.join(this.dir, 'draft_info.json');
    const contentPath = path.join(this.dir, 'draft_content.json');

    if (fs.existsSync(infoPath)) {
      this.content = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
    } else if (fs.existsSync(contentPath)) {
      this.content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    } else {
      throw new Error(`draft not found: ${name} (in ${DRAFTS_DIR})`);
    }

    this.metaPath = path.join(this.dir, 'draft_meta_info.json');
    this.meta = fs.existsSync(this.metaPath) ? JSON.parse(fs.readFileSync(this.metaPath, 'utf8')) : null;
    this._tpl = null;

    // Automatically deduplicate any inherited duplicate material IDs
    for (const k of Object.keys(this.content.materials || {})) {
      if (Array.isArray(this.content.materials[k])) {
        const seen = new Set();
        this.content.materials[k] = this.content.materials[k].filter(m => {
          if (!m || !m.id) return true;
          if (seen.has(m.id)) return false;
          seen.add(m.id);
          return true;
        });
      }
    }
  }
  templates() {
    if (this._tpl) return this._tpl;
    let t = harvest(this.content);
    // fill any missing segment type from the template draft
    if (!t.video || !t.text || !t.audio) {
      try { const base = JSON.parse(fs.readFileSync(path.join(DRAFTS_DIR, TEMPLATE_DRAFT, 'draft_content.json'), 'utf8')); const bt = harvest(base);
        for (const k of ['video', 'audio', 'text', 'image']) if (!t[k] && bt[k]) t[k] = bt[k];
        for (const k of Object.keys(bt.tracks)) if (!t.tracks[k]) t.tracks[k] = bt.tracks[k];
      } catch {}
    }
    this._tpl = t; return t;
  }
  _mats(key) { this.content.materials = this.content.materials || {}; this.content.materials[key] = this.content.materials[key] || []; return this.content.materials[key]; }
  _nextRender() { let m = -1; for (const tr of (this.content.tracks || [])) for (const s of (tr.segments || [])) if ((s.render_index || 0) > m) m = s.render_index; return m + 1; }

  // ---------- read ----------
  timeline() {
    const c = this.content;
    return {
      name: this.name, durationSec: +(c.duration / US).toFixed(3), fps: c.fps,
      canvas: c.canvas_config && { w: c.canvas_config.width, h: c.canvas_config.height, ratio: c.canvas_config.ratio },
      locked: fs.existsSync(path.join(this.dir, '.locked')), capcutRunning: isCapCutRunning(),
      tracks: (c.tracks || []).map((tr, ti) => ({
        index: ti, type: tr.type, name: tr.name, segments: (tr.segments || []).map(s => {
          const [, m] = findMat(c, s.material_id);
          const extraMats = (s.extra_material_refs || []).map(id => {
            const [k, em] = findMat(c, id);
            return em ? { key: k, type: em.type, name: em.name, effect_id: em.effect_id } : null;
          }).filter(Boolean);

          return {
            id: s.id, material: m ? (m.material_name || (m.path || '').split(/[\\/]/).pop() || m.type || m.name) : null,
            atSec: +(s.target_timerange.start / US).toFixed(3), durSec: +(s.target_timerange.duration / US).toFixed(3),
            srcStartSec: +((s.source_timerange?.start || 0) / US).toFixed(3), renderIndex: s.render_index, trackRenderIndex: s.track_render_index,
            extraMaterials: extraMats.length > 0 ? extraMats : undefined,
          };
        }),
      })),
    };
  }

  // ---------- tracks ----------
  addTrack(type = 'video', name) {
    const tpl = this.templates().tracks[type] || this.templates().tracks.video || {
      attribute: 0,
      flag: 0,
      id: uid(),
      is_default_name: false,
      name: name || `${type} track`,
      segments: [],
      type: type,
    };
    const tk = clone(tpl); tk.id = uid(); tk.segments = []; tk.type = type; tk.name = name || `${type} track`; tk.is_default_name = false;
    this.content.tracks = this.content.tracks || [];
    this.content.tracks.push(tk);
    return this.content.tracks.length - 1;
  }
  _resolveTrack(opts, type) {
    if (opts.trackIndex != null) { const tr = this.content.tracks[opts.trackIndex]; if (!tr) throw new Error(`no track at index ${opts.trackIndex}`); return tr; }
    if (opts.trackId) { const tr = this.content.tracks.find(t => t.id === opts.trackId); if (!tr) throw new Error(`no track ${opts.trackId}`); return tr; }
    let tr = (this.content.tracks || []).find(t => t.type === type); if (tr) return tr;
    return this.content.tracks[this.addTrack(type)];
  }

  // ---------- add media (video/image/audio) ----------
  _addMedia(kind, file, opts) {
    if (!fs.existsSync(file)) throw new Error(`file not found: ${file}`);
    const type = kind === 'audio' ? 'audio' : (kind === 'image' ? 'photo' : 'video');
    const tplType = kind === 'image' ? (this.templates().image ? 'image' : 'video') : kind;
    const tpl = this.templates()[tplType] || this.templates().video;
    if (!tpl) throw new Error(`no ${kind} template available`);
    const dur = opts.durUs != null ? opts.durUs : probeDur(file);
    const mat = clone(tpl.mat); mat.id = uid(); mat.path = file.replace(/\\/g, '/'); mat.material_name = path.basename(file); mat.type = type;
    if (kind !== 'audio') { const { w, h } = probeWH(file); mat.width = w; mat.height = h; }
    mat.duration = kind === 'audio' ? probeDur(file) : (mat.duration || probeDur(file));
    ['local_material_id', 'origin_material_id', 'local_id', 'request_id', 'aigc_history_id', 'aigc_item_id'].forEach(k => { if (k in mat) mat[k] = ''; });
    const matKey = kind === 'audio' ? 'audios' : 'videos';
    this._mats(matKey).push(mat);
    const refs = tpl.refs.map(({ k, m }) => { const c = clone(m); c.id = uid(); this._mats(k).push(c); return c.id; });
    const seg = clone(tpl.seg); seg.id = uid(); seg.material_id = mat.id; seg.extra_material_refs = refs;
    const at = opts.atUs || 0;
    seg.target_timerange = { start: at, duration: dur };
    seg.source_timerange = { start: opts.srcStartUs || 0, duration: dur };
    this._applyProps(seg, opts);
    seg.render_index = this._nextRender();
    const track = this._resolveTrack(opts, kind === 'audio' ? 'audio' : 'video');
    seg.track_render_index = opts.trackRenderIndex != null ? opts.trackRenderIndex : (this.content.tracks.indexOf(track));
    track.segments.push(seg);
    this.content.duration = Math.max(this.content.duration || 0, at + dur);
    return { segmentId: seg.id, endUs: at + dur };
  }
  addVideo(file, opts = {}) { return this._addMedia('video', file, opts); }
  addImage(file, opts = {}) { return this._addMedia('image', file, opts); }
  addAudio(file, opts = {}) { return this._addMedia('audio', file, opts); }

  // ---------- text ----------
  addText(text, opts = {}) {
    const tpl = this.templates().text;
    if (!tpl) throw new Error('no text template found. Set CAPCUT_TEMPLATE_DRAFT to a draft that contains a text layer.');
    const mat = clone(tpl.mat); mat.id = uid();
    try {
      const content = JSON.parse(mat.content);
      content.text = text;
      if (content.styles && content.styles[0]) {
        content.styles[0].range = [0, text.length];
        if (opts.color) content.styles[0].fill = { content: { solid: { color: hexToRgb(opts.color) } } };
        if (opts.fontSize) content.styles[0].size = opts.fontSize;
      }
      mat.content = JSON.stringify(content);
    } catch { mat.content = JSON.stringify({ text, styles: [{ range: [0, text.length], size: opts.fontSize || 15, fill: { content: { solid: { color: hexToRgb(opts.color || '#ffffff') } } } }] }); }
    this._mats('texts').push(mat);
    const refs = tpl.refs.map(({ k, m }) => { const c = clone(m); c.id = uid(); this._mats(k).push(c); return c.id; });
    const seg = clone(tpl.seg); seg.id = uid(); seg.material_id = mat.id; seg.extra_material_refs = refs;
    const at = opts.atUs || 0, dur = opts.durUs || 3 * US;
    seg.target_timerange = { start: at, duration: dur };
    seg.source_timerange = { start: 0, duration: dur };
    this._applyProps(seg, opts);
    seg.render_index = this._nextRender();
    const track = this._resolveTrack(opts, 'text');
    seg.track_render_index = opts.trackRenderIndex != null ? opts.trackRenderIndex : this.content.tracks.indexOf(track);
    track.segments.push(seg);
    this.content.duration = Math.max(this.content.duration || 0, at + dur);
    return { segmentId: seg.id, endUs: at + dur };
  }

  // ---------- sticker ----------
  addSticker(stickerNameOrId, opts = {}) {
    const atUs = opts.atUs != null ? opts.atUs : (opts.atSec != null ? Math.round(opts.atSec * US) : 0);
    const durUs = opts.durUs != null ? opts.durUs : (opts.durSec != null ? Math.round(opts.durSec * US) : 3 * US);

    let resourceId = String(stickerNameOrId || '');
    let stickerName = stickerNameOrId;
    let cachedPath = getCachedResourcePath(resourceId);

    if (!cachedPath) {
      const assetsIndex = getAssetsIndex();
      const match = assetsIndex.find(a =>
        a.resourceId === resourceId ||
        a.name.toLowerCase().includes(String(stickerNameOrId).toLowerCase())
      );
      if (match) {
        resourceId = match.resourceId;
        stickerName = match.name;
        cachedPath = match.path;
      }
    }

    const matId = uid();
    const stickerMat = {
      id: matId,
      resource_id: resourceId,
      sticker_id: resourceId,
      source_platform: 1,
      type: 'sticker',
      name: stickerName || 'sticker',
      path: cachedPath || '',
      category_id: '',
      category_name: '',
      platform: 'all',
    };

    this._mats('stickers').push(stickerMat);

    const seg = {
      id: uid(),
      material_id: matId,
      target_timerange: { start: atUs, duration: durUs },
      source_timerange: { start: 0, duration: durUs },
      render_index: this._nextRender(),
      speed: 1.0,
      volume: 1.0,
      visible: opts.visible !== undefined ? !!opts.visible : true,
      extra_material_refs: [],
      clip: {
        alpha: opts.opacity != null ? opts.opacity : 1.0,
        flip: { horizontal: false, vertical: false },
        rotation: opts.rotation || 0.0,
        scale: {
          x: opts.scale != null ? opts.scale : (opts.scaleX != null ? opts.scaleX : 1.0),
          y: opts.scale != null ? opts.scale : (opts.scaleY != null ? opts.scaleY : 1.0),
        },
        transform: {
          x: opts.posX != null ? opts.posX : 0.0,
          y: opts.posY != null ? opts.posY : 0.0,
        },
      },
    };

    const track = this._resolveTrack(opts, 'sticker');
    seg.track_render_index = this.content.tracks.indexOf(track);
    track.segments.push(seg);
    this._recalcDuration();

    return {
      segmentId: seg.id,
      trackIndex: this.content.tracks.indexOf(track),
      sticker: stickerName,
      resourceId: resourceId,
      atSec: +(atUs / US).toFixed(3),
      durSec: +(durUs / US).toFixed(3),
      cached: !!cachedPath,
    };
  }

  // ---------- edit existing segments ----------
  _find(segId) { for (const tr of this.content.tracks) { const s = (tr.segments || []).find(x => x.id === segId); if (s) return { tr, s }; } throw new Error(`segment not found: ${segId}`); }
  moveSegment(segId, atUs, newTrackIndex) {
    const { tr, s } = this._find(segId); const dur = s.target_timerange.duration;
    s.target_timerange.start = atUs;
    if (newTrackIndex != null && this.content.tracks[newTrackIndex]) { tr.segments = tr.segments.filter(x => x.id !== segId); this.content.tracks[newTrackIndex].segments.push(s); }
    this._recalcDuration(); return { segmentId: segId, atSec: atUs / US, durSec: dur / US };
  }
  trimSegment(segId, { atUs, durUs, srcStartUs } = {}) {
    const { s } = this._find(segId);
    if (atUs != null) s.target_timerange.start = atUs;
    if (durUs != null) { s.target_timerange.duration = durUs; s.source_timerange.duration = durUs; }
    if (srcStartUs != null) s.source_timerange.start = srcStartUs;
    this._recalcDuration(); return { segmentId: segId };
  }
  splitSegment(segId, atUs) {
    const { tr, s } = this._find(segId);
    const t0 = s.target_timerange.start, d = s.target_timerange.duration;
    if (atUs <= t0 || atUs >= t0 + d) throw new Error('split point must be inside the segment');
    const left = atUs - t0;
    const right = clone(s); right.id = uid();
    // clone extra_material_refs so the two halves don't share state
    right.extra_material_refs = (s.extra_material_refs || []).map(id => { const [k, m] = findMat(this.content, id); if (!m) return id; const c = clone(m); c.id = uid(); this._mats(k).push(c); return c.id; });
    s.target_timerange.duration = left; s.source_timerange.duration = left;
    right.target_timerange = { start: atUs, duration: d - left };
    right.source_timerange = { start: (s.source_timerange.start || 0) + left, duration: d - left };
    right.render_index = this._nextRender();
    tr.segments.push(right);
    return { left: segId, right: right.id };
  }
  deleteSegment(segId) { const { tr } = this._find(segId); tr.segments = tr.segments.filter(x => x.id !== segId); this._recalcDuration(); return { deleted: segId }; }
  setProps(segId, props = {}) { const { s } = this._find(segId); this._applyProps(s, props); return { segmentId: segId, applied: Object.keys(props) }; }
  _applyProps(seg, p) {
    seg.clip = seg.clip || { alpha: 1, flip: { horizontal: false, vertical: false }, rotation: 0, scale: { x: 1, y: 1 }, transform: { x: 0, y: 0 } };
    if (p.scale != null) { seg.clip.scale = { x: p.scale, y: p.scale }; }
    if (p.scaleX != null) seg.clip.scale.x = p.scaleX;
    if (p.scaleY != null) seg.clip.scale.y = p.scaleY;
    if (p.posX != null) seg.clip.transform.x = p.posX;
    if (p.posY != null) seg.clip.transform.y = p.posY;
    if (p.rotation != null) seg.clip.rotation = p.rotation;
    if (p.opacity != null) seg.clip.alpha = p.opacity;
    if (p.volume != null) seg.volume = p.volume;
    if (p.visible != null) seg.visible = p.visible;
    if (p.speed != null) { seg.speed = p.speed; const spId = (seg.extra_material_refs || []).find(id => findMat(this.content, id)[0] === 'speeds'); if (spId) { const [, sp] = findMat(this.content, spId); if (sp) sp.speed = p.speed; } }
  }

  // ---------- transitions ----------
  applyTransition(segmentId, transitionNameOrId, opts = {}) {
    const { tr, s } = this._find(segmentId);
    const item = resolveItem('transition', transitionNameOrId);

    const durUs = opts.durUs != null ? opts.durUs : (item.defaultDurationUs || 500000);
    const maxDur = s.target_timerange.duration;
    if (durUs > maxDur) {
      throw new Error(`Transition duration (${durUs / US}s) cannot exceed clip duration (${maxDur / US}s)`);
    }

    // Check if transition material already exists on this segment
    const transitionsArr = this._mats('transitions');
    s.extra_material_refs = s.extra_material_refs || [];
    const existingTransRefIdx = s.extra_material_refs.findIndex(id => transitionsArr.some(m => m.id === id));

    const transId = uid();
    const transMat = {
      category_id: '',
      category_name: '',
      duration: durUs,
      effect_id: item.effectId || '',
      id: transId,
      is_overlap: opts.overlap !== undefined ? !!opts.overlap : (item.isOverlap !== undefined ? item.isOverlap : true),
      name: item.name || item.key,
      platform: 'all',
      resource_id: item.resourceId || '',
      type: 'transition',
      path: item.cachedPath || '',
    };

    if (existingTransRefIdx !== -1) {
      const oldId = s.extra_material_refs[existingTransRefIdx];
      const oldMatIdx = transitionsArr.findIndex(m => m.id === oldId);
      if (oldMatIdx !== -1) transitionsArr.splice(oldMatIdx, 1);
      s.extra_material_refs[existingTransRefIdx] = transId;
    } else {
      s.extra_material_refs.push(transId);
    }

    transitionsArr.push(transMat);
    return {
      segmentId,
      transition: item.name || item.key,
      en: item.en || '',
      effectId: item.effectId,
      durationSec: +(durUs / US).toFixed(3),
      cached: !!item.cached,
    };
  }

  // ---------- effects (clip & layer) ----------
  applyEffect(segmentId, effectNameOrId, opts = {}) {
    let item;
    try {
      item = resolveItem('video_effect', effectNameOrId);
    } catch {
      item = resolveItem('character_effect', effectNameOrId);
    }

    const adjustParams = (item.params || []).map((p, idx) => {
      let val = p.defaultValue;
      if (opts.params && opts.params[idx] !== undefined && opts.params[idx] !== null) {
        const input = Math.max(0, Math.min(100, opts.params[idx]));
        val = p.minValue + (p.maxValue - p.minValue) * (input / 100.0);
      }
      return {
        default_value: p.defaultValue,
        max_value: p.maxValue,
        min_value: p.minValue,
        name: p.name,
        parameterIndex: idx,
        portIndex: 0,
        value: val,
      };
    });

    const isLayer = !segmentId || opts.asLayer;
    const effectMat = {
      adjust_params: adjustParams,
      apply_target_type: isLayer ? 2 : 0,
      apply_time_range: null,
      category_id: '',
      category_name: '',
      common_keyframes: [],
      disable_effect_faces: [],
      effect_id: item.effectId || '',
      formula_id: '',
      id: uid(),
      name: item.name || item.key,
      platform: 'all',
      render_index: 11000,
      resource_id: item.resourceId || '',
      source_platform: 0,
      time_range: null,
      track_render_index: 0,
      type: item.kind === 'character_effect' ? 'face_effect' : 'video_effect',
      value: opts.intensity != null ? opts.intensity / 100.0 : 1.0,
      version: '',
      path: item.cachedPath || '',
    };

    this._mats('video_effects').push(effectMat);

    if (isLayer) {
      // Standalone effect layer on an effect track
      const track = this._resolveTrack(opts, 'effect');
      const atUs = opts.atUs != null ? opts.atUs : (opts.startSec != null ? Math.round(opts.startSec * US) : (opts.atSec != null ? Math.round(opts.atSec * US) : 0));
      const durUs = opts.durUs != null ? opts.durUs : (opts.durationSec != null ? Math.round(opts.durationSec * US) : (opts.durSec != null ? Math.round(opts.durSec * US) : Math.max(US, this.content.duration - atUs)));
      const effSeg = {
        enable_adjust: true,
        enable_color_correct_adjust: false,
        enable_color_curves: true,
        enable_color_match_adjust: false,
        enable_color_wheels: true,
        enable_lut: true,
        enable_smart_color_adjust: false,
        extra_material_refs: [],
        id: uid(),
        last_nonzero_volume: 1.0,
        material_id: effectMat.id,
        render_index: this._nextRender(),
        reverse: false,
        source_timerange: null,
        speed: 1.0,
        target_timerange: { start: atUs, duration: durUs },
        track_attribute: 0,
        track_render_index: 0,
        visible: true,
        volume: 1.0,
      };
      track.segments.push(effSeg);
      this._recalcDuration();
      return {
        segmentId: effSeg.id,
        trackIndex: this.content.tracks.indexOf(track),
        effect: item.name || item.key,
        en: item.en || '',
        kind: item.kind,
        atSec: +(atUs / US).toFixed(3),
        durSec: +(durUs / US).toFixed(3),
        cached: !!item.cached,
      };
    } else {
      // Clip-level effect
      const { s } = this._find(segmentId);
      s.extra_material_refs = s.extra_material_refs || [];
      s.extra_material_refs.push(effectMat.id);
      return {
        segmentId,
        effect: item.name || item.key,
        en: item.en || '',
        kind: item.kind,
        cached: !!item.cached,
      };
    }
  }

  // ---------- animations (clip & text) ----------
  applyAnimation(segmentId, animationNameOrId, opts = {}) {
    const { s } = this._find(segmentId);
    const [, baseMat] = findMat(this.content, s.material_id);
    const isVideo = !baseMat || baseMat.type !== 'text';

    // Resolve animation in catalog across possible animation kinds
    let item = null;
    const searchKinds = isVideo ? ['intro', 'outro', 'group_anim'] : ['text_intro', 'text_outro', 'text_loop'];
    for (const k of searchKinds) {
      try {
        item = resolveItem(k, animationNameOrId);
        break;
      } catch {}
    }
    if (!item) {
      item = resolveItem(null, animationNameOrId);
    }

    let animType = opts.animationType;
    if (!animType) {
      if (item.kind === 'intro' || item.kind === 'text_intro') animType = 'in';
      else if (item.kind === 'outro' || item.kind === 'text_outro') animType = 'out';
      else if (item.kind === 'group_anim') animType = 'group';
      else if (item.kind === 'text_loop') animType = 'loop';
      else animType = 'in';
    }

    const durUs = opts.durUs != null ? opts.durUs : (item.defaultDurationUs || Math.min(500000, s.target_timerange.duration));
    let startUs = opts.startUs != null ? opts.startUs : 0;
    if (animType === 'out' && opts.startUs == null) {
      startUs = Math.max(0, s.target_timerange.duration - durUs);
    }

    const animMats = this._mats('material_animations');
    s.extra_material_refs = s.extra_material_refs || [];

    // Find or create SegmentAnimations container
    let container = null;
    const existingRefId = s.extra_material_refs.find(id => animMats.some(m => m.id === id));
    if (existingRefId) {
      container = animMats.find(m => m.id === existingRefId);
    }

    if (!container) {
      const containerId = uid();
      container = {
        animations: [],
        id: containerId,
        multi_language_current: 'none',
        type: 'sticker_animation',
      };
      animMats.push(container);
      s.extra_material_refs.push(containerId);
    }

    // Replace animation of the same type if present
    container.animations = (container.animations || []).filter(a => a.type !== animType);
    const subAnim = {
      anim_adjust_params: null,
      duration: durUs,
      id: item.effectId || item.resourceId || uid(),
      material_type: isVideo ? 'video' : 'sticker',
      name: item.name || item.key,
      panel: isVideo ? 'video' : '',
      platform: 'all',
      resource_id: item.resourceId || '',
      start: startUs,
      type: animType,
      path: item.cachedPath || '',
    };
    container.animations.push(subAnim);

    return {
      segmentId,
      animation: item.name || item.key,
      en: item.en || '',
      animationType: animType,
      durationSec: +(durUs / US).toFixed(3),
      startSec: +(startUs / US).toFixed(3),
      cached: !!item.cached,
    };
  }

  // ---------- filters (clip & layer) ----------
  applyFilter(segmentId, filterNameOrId, opts = {}) {
    const item = resolveItem('filter', filterNameOrId);
    const isLayer = !segmentId || opts.asLayer;
    const intensity = opts.intensity != null ? opts.intensity : 100.0;

    const filterMat = {
      adjust_params: [],
      algorithm_artifact_path: '',
      apply_target_type: isLayer ? 2 : 0,
      bloom_params: null,
      category_id: '',
      category_name: '',
      color_match_info: {
        source_feature_path: '',
        target_feature_path: '',
        target_image_path: '',
      },
      effect_id: item.effectId || '',
      enable_skin_tone_correction: false,
      exclusion_group: [],
      face_adjust_params: [],
      formula_id: '',
      id: uid(),
      intensity_key: '',
      multi_language_current: '',
      name: item.name || item.key,
      panel_id: '',
      platform: 'all',
      resource_id: item.resourceId || '',
      source_platform: 1,
      sub_type: 'none',
      time_range: null,
      type: 'filter',
      value: intensity / 100.0,
      version: '',
      path: item.cachedPath || '',
    };

    this._mats('effects').push(filterMat);

    if (isLayer) {
      // Standalone filter track
      const track = this._resolveTrack(opts, 'filter');
      const atUs = opts.atUs != null ? opts.atUs : (opts.startSec != null ? Math.round(opts.startSec * US) : (opts.atSec != null ? Math.round(opts.atSec * US) : 0));
      const durUs = opts.durUs != null ? opts.durUs : (opts.durationSec != null ? Math.round(opts.durationSec * US) : (opts.durSec != null ? Math.round(opts.durSec * US) : Math.max(US, this.content.duration - atUs)));
      const flSeg = {
        enable_adjust: true,
        enable_color_correct_adjust: false,
        enable_color_curves: true,
        enable_color_match_adjust: false,
        enable_color_wheels: true,
        enable_lut: true,
        enable_smart_color_adjust: false,
        extra_material_refs: [],
        id: uid(),
        last_nonzero_volume: 1.0,
        material_id: filterMat.id,
        render_index: this._nextRender(),
        reverse: false,
        source_timerange: null,
        speed: 1.0,
        target_timerange: { start: atUs, duration: durUs },
        track_attribute: 0,
        track_render_index: 0,
        visible: true,
        volume: 1.0,
      };
      track.segments.push(flSeg);
      this._recalcDuration();
      return {
        segmentId: flSeg.id,
        trackIndex: this.content.tracks.indexOf(track),
        filter: item.name || item.key,
        en: item.en || '',
        intensity,
        atSec: +(atUs / US).toFixed(3),
        durSec: +(durUs / US).toFixed(3),
        cached: !!item.cached,
      };
    } else {
      const { s } = this._find(segmentId);
      s.extra_material_refs = s.extra_material_refs || [];
      s.extra_material_refs.push(filterMat.id);
      return {
        segmentId,
        filter: item.name || item.key,
        en: item.en || '',
        intensity,
        cached: !!item.cached,
      };
    }
  }

  // ---------- keyframes ----------
  addKeyframe(segmentId, propertyType, keyframes = []) {
    const { s } = this._find(segmentId);
    s.common_keyframes = s.common_keyframes || [];

    const propMap = {
      scale: ['KFTypeScaleX', 'KFTypeScaleY'],
      scale_x: ['KFTypeScaleX'],
      scale_y: ['KFTypeScaleY'],
      uniform_scale: ['KFTypeScaleX', 'KFTypeScaleY'],
      position_x: ['KFTypePositionX'],
      pos_x: ['KFTypePositionX'],
      posX: ['KFTypePositionX'],
      position_y: ['KFTypePositionY'],
      pos_y: ['KFTypePositionY'],
      posY: ['KFTypePositionY'],
      rotation: ['KFTypeRotation'],
      rot: ['KFTypeRotation'],
      opacity: ['KFTypeAlpha'],
      alpha: ['KFTypeAlpha'],
      volume: ['KFTypeVolume'],
      vol: ['KFTypeVolume'],
      brightness: ['KFTypeBrightness'],
      contrast: ['KFTypeContrast'],
      saturation: ['KFTypeSaturation'],
    };

    const targetProps = propMap[String(propertyType).toLowerCase()] || [propertyType];
    const added = [];

    for (const prop of targetProps) {
      let kfList = s.common_keyframes.find(k => k.property_type === prop);
      if (!kfList) {
        kfList = {
          id: uid(),
          keyframe_list: [],
          material_id: '',
          property_type: prop,
        };
        s.common_keyframes.push(kfList);
      }

      for (const kf of keyframes) {
        const timeOffsetUs = kf.timeOffsetUs != null ? kf.timeOffsetUs : (kf.timeOffsetSec != null ? Math.round(kf.timeOffsetSec * US) : 0);
        const val = kf.value != null ? kf.value : 1.0;
        const kfId = uid();
        const kfPoint = {
          curveType: kf.curveType || 'Line',
          graphID: '',
          id: kfId,
          left_control: { x: 0.0, y: 0.0 },
          right_control: { x: 0.0, y: 0.0 },
          time_offset: timeOffsetUs,
          values: [val],
        };
        const existIdx = kfList.keyframe_list.findIndex(p => p.time_offset === timeOffsetUs);
        if (existIdx !== -1) {
          kfList.keyframe_list[existIdx] = kfPoint;
        } else {
          kfList.keyframe_list.push(kfPoint);
        }
        kfList.keyframe_list.sort((a, b) => a.time_offset - b.time_offset);
        added.push({ prop, timeOffsetSec: +(timeOffsetUs / US).toFixed(3), value: val });
      }
    }

    return {
      segmentId,
      property: propertyType,
      keyframes: added,
      totalKeyframeLists: s.common_keyframes.length,
    };
  }

  // ---------- video masks ----------
  applyMask(segmentId, maskType, config = {}) {
    const { s } = this._find(segmentId);
    s.extra_material_refs = s.extra_material_refs || [];

    const maskMetaMap = {
      line: { name: '线性', resource_type: 'line', effect_id: '6791652175668843016', resource_id: '636071' },
      linear: { name: '线性', resource_type: 'line', effect_id: '6791652175668843016', resource_id: '636071' },
      '线性': { name: '线性', resource_type: 'line', effect_id: '6791652175668843016', resource_id: '636071' },
      mirror: { name: '镜面', resource_type: 'mirror', effect_id: '6791699060140020232', resource_id: '636073' },
      '镜面': { name: '镜面', resource_type: 'mirror', effect_id: '6791699060140020232', resource_id: '636073' },
      circle: { name: '圆形', resource_type: 'circle', effect_id: '6791700663249146381', resource_id: '636075' },
      '圆形': { name: '圆形', resource_type: 'circle', effect_id: '6791700663249146381', resource_id: '636075' },
      round: { name: '圆形', resource_type: 'circle', effect_id: '6791700663249146381', resource_id: '636075' },
      rectangle: { name: '矩形', resource_type: 'rectangle', effect_id: '6791700809454195207', resource_id: '636077' },
      rect: { name: '矩形', resource_type: 'rectangle', effect_id: '6791700809454195207', resource_id: '636077' },
      '矩形': { name: '矩形', resource_type: 'rectangle', effect_id: '6791700809454195207', resource_id: '636077' },
      heart: { name: '爱心', resource_type: 'geometric_shape', effect_id: '6794051276482023949', resource_id: '636079' },
      '爱心': { name: '爱心', resource_type: 'geometric_shape', effect_id: '6794051276482023949', resource_id: '636079' },
      star: { name: '星形', resource_type: 'geometric_shape', effect_id: '6794051169434997255', resource_id: '636081' },
      '星形': { name: '星形', resource_type: 'geometric_shape', effect_id: '6794051169434997255', resource_id: '636081' },
    };

    const normType = String(maskType || 'circle').toLowerCase().trim();
    const meta = maskMetaMap[normType] || maskMetaMap['circle'];
    const maskMats = this._mats('common_mask');

    const existMaskRefIdx = s.extra_material_refs.findIndex(id => maskMats.some(m => m.id === id));
    if (existMaskRefIdx !== -1) {
      const oldId = s.extra_material_refs[existMaskRefIdx];
      const oldMatIdx = maskMats.findIndex(m => m.id === oldId);
      if (oldMatIdx !== -1) maskMats.splice(oldMatIdx, 1);
      s.extra_material_refs.splice(existMaskRefIdx, 1);
    }

    const maskId = uid();
    const maskMat = {
      config: {
        aspectRatio: config.aspectRatio != null ? config.aspectRatio : 1.0,
        centerX: config.centerX != null ? config.centerX : 0.0,
        centerY: config.centerY != null ? config.centerY : 0.0,
        feather: config.feather != null ? config.feather : 0.0,
        height: config.height != null ? config.height : 0.5,
        invert: config.invert != null ? !!config.invert : false,
        rotation: config.rotation != null ? config.rotation : 0.0,
        roundCorner: config.roundCorner != null ? config.roundCorner : 0.0,
        width: config.width != null ? config.width : 0.5,
      },
      id: maskId,
      name: meta.name,
      platform: 'all',
      position_info: '',
      resource_type: meta.resource_type,
      resource_id: meta.resource_id,
      effect_id: meta.effect_id,
      type: 'mask',
    };

    maskMats.push(maskMat);
    s.extra_material_refs.push(maskId);

    return {
      segmentId,
      maskType: meta.name,
      resourceType: meta.resource_type,
      config: maskMat.config,
    };
  }

  // ---------- audio fade ----------
  setAudioFade(segmentId, { fadeInSec = 0, fadeOutSec = 0 } = {}) {
    const { s } = this._find(segmentId);
    s.extra_material_refs = s.extra_material_refs || [];
    const fadeMats = this._mats('audio_fades');

    const existIdx = s.extra_material_refs.findIndex(id => fadeMats.some(m => m.id === id));
    if (existIdx !== -1) {
      const oldId = s.extra_material_refs[existIdx];
      const oldMatIdx = fadeMats.findIndex(m => m.id === oldId);
      if (oldMatIdx !== -1) fadeMats.splice(oldMatIdx, 1);
      s.extra_material_refs.splice(existIdx, 1);
    }

    const fadeInUs = Math.round(fadeInSec * US);
    const fadeOutUs = Math.round(fadeOutSec * US);
    const fadeId = uid();

    const fadeMat = {
      fade_in_duration: fadeInUs,
      fade_out_duration: fadeOutUs,
      fade_type: 0,
      id: fadeId,
      type: 'audio_fade',
    };

    fadeMats.push(fadeMat);
    s.extra_material_refs.push(fadeId);

    return {
      segmentId,
      fadeInSec,
      fadeOutSec,
    };
  }

  // ---------- audio effects ----------
  applyAudioEffect(segmentId, effectNameOrId, opts = {}) {
    const { s } = this._find(segmentId);
    s.extra_material_refs = s.extra_material_refs || [];
    const item = resolveItem('audio_effect', effectNameOrId);
    const audioEffMats = this._mats('audio_effects');

    const effId = uid();
    const effMat = {
      audio_adjust_params: (item.params || []).map(p => ({
        default_value: p.default_value != null ? p.default_value : 50,
        name: p.name || '',
        value: p.default_value != null ? p.default_value : 50,
      })),
      category_id: 'sound_effect',
      category_name: '场景音',
      id: effId,
      is_ugc: false,
      name: item.name || item.key,
      production_path: '',
      resource_id: item.resourceId || '',
      speaker_id: '',
      sub_type: 1,
      time_range: { duration: 0, start: 0 },
      type: 'audio_effect',
    };

    audioEffMats.push(effMat);
    s.extra_material_refs.push(effId);

    return {
      segmentId,
      audioEffect: item.name || item.key,
      en: item.en || '',
      resourceId: item.resourceId,
    };
  }

  // ---------- batch subtitles ----------
  addSubtitlesBatch(subtitles = [], opts = {}) {
    const tpl = this.templates().text;
    if (!tpl) throw new Error('no text template found. Set CAPCUT_TEMPLATE_DRAFT to a draft with text layer.');

    const track = this._resolveTrack(opts, 'text');
    const added = [];

    const fontSize = opts.fontSize || 12;
    const color = opts.color || '#FFFFFF';
    const posX = opts.posX != null ? opts.posX : 0.0;
    const posY = opts.posY != null ? opts.posY : -0.75;

    for (const sub of subtitles) {
      const text = sub.text || '';
      if (!text.trim()) continue;

      const atUs = sub.atUs != null ? sub.atUs : Math.round((sub.startSec != null ? sub.startSec : (sub.start || 0)) * US);
      const durUs = sub.durUs != null ? sub.durUs : Math.round((sub.durSec != null ? sub.durSec : (sub.duration != null ? sub.duration : ((sub.end || sub.endSec || 0) - (sub.start || sub.startSec || 0)))) * US);

      if (durUs <= 0) continue;

      const mat = clone(tpl.mat);
      mat.id = uid();

      try {
        const content = JSON.parse(mat.content);
        content.text = text;
        if (content.styles && content.styles[0]) {
          content.styles[0].range = [0, text.length];
          content.styles[0].fill = { content: { solid: { color: hexToRgb(color) } } };
          content.styles[0].size = fontSize;
          if (opts.strokeColor) {
            content.styles[0].strokes = [{
              color: { content: { solid: { color: hexToRgb(opts.strokeColor) } } },
              width: opts.strokeWidth || 0.08,
            }];
          }
        }
        mat.content = JSON.stringify(content);
      } catch {
        mat.content = JSON.stringify({
          text,
          styles: [{
            range: [0, text.length],
            size: fontSize,
            fill: { content: { solid: { color: hexToRgb(color) } } },
            strokes: opts.strokeColor ? [{ color: { content: { solid: { color: hexToRgb(opts.strokeColor) } } }, width: opts.strokeWidth || 0.08 }] : [],
          }],
        });
      }

      this._mats('texts').push(mat);

      const refs = tpl.refs.map(({ k, m }) => {
        const c = clone(m);
        c.id = uid();
        this._mats(k).push(c);
        return c.id;
      });

      const seg = clone(tpl.seg);
      seg.id = uid();
      seg.material_id = mat.id;
      seg.extra_material_refs = refs;
      seg.target_timerange = { start: atUs, duration: durUs };
      seg.source_timerange = { start: 0, duration: durUs };
      seg.render_index = this._nextRender();
      seg.track_render_index = this.content.tracks.indexOf(track);

      seg.clip = seg.clip || { alpha: 1, flip: { horizontal: false, vertical: false }, rotation: 0, scale: { x: 1, y: 1 }, transform: { x: 0, y: 0 } };
      seg.clip.transform.x = posX;
      seg.clip.transform.y = posY;

      track.segments.push(seg);
      added.push({ segmentId: seg.id, atSec: +(atUs / US).toFixed(3), durSec: +(durUs / US).toFixed(3), text });
    }

    this._recalcDuration();

    return {
      trackIndex: this.content.tracks.indexOf(track),
      totalSubtitles: added.length,
      subtitles: added,
    };
  }

  // ---------- canvas config ----------
  setCanvas(ratioOrConfig) {
    const presets = {
      '16:9': { width: 1920, height: 1080, ratio: '16:9' },
      '9:16': { width: 1080, height: 1920, ratio: '9:16' },
      '1:1': { width: 1080, height: 1080, ratio: '1:1' },
      '4:5': { width: 1080, height: 1350, ratio: '4:5' },
      '21:9': { width: 2560, height: 1080, ratio: '21:9' },
    };

    let cfg = null;
    if (typeof ratioOrConfig === 'string') {
      cfg = presets[ratioOrConfig] || { width: 1920, height: 1080, ratio: ratioOrConfig };
    } else if (ratioOrConfig && typeof ratioOrConfig === 'object') {
      cfg = {
        width: ratioOrConfig.width || 1920,
        height: ratioOrConfig.height || 1080,
        ratio: ratioOrConfig.ratio || `${ratioOrConfig.width}:${ratioOrConfig.height}`,
      };
    } else {
      cfg = presets['16:9'];
    }

    this.content.canvas_config = {
      width: cfg.width,
      height: cfg.height,
      ratio: cfg.ratio,
    };

    return {
      canvas: this.content.canvas_config,
    };
  }

  // ---------- speed ramping & curves ----------
  setSpeedCurve(segmentId, curvePresetOrPoints) {
    const { s } = this._find(segmentId);
    s.extra_material_refs = s.extra_material_refs || [];
    const speedMats = this._mats('speeds');

    const presets = {
      montage: [
        { x: 0.0, y: 1.0 }, { x: 0.2, y: 4.0 }, { x: 0.5, y: 0.5 }, { x: 0.8, y: 3.0 }, { x: 1.0, y: 1.0 },
      ],
      hero: [
        { x: 0.0, y: 1.0 }, { x: 0.3, y: 0.3 }, { x: 0.6, y: 3.0 }, { x: 1.0, y: 1.0 },
      ],
      bullet: [
        { x: 0.0, y: 4.0 }, { x: 0.4, y: 0.2 }, { x: 0.7, y: 0.2 }, { x: 1.0, y: 4.0 },
      ],
      bullet_time: [
        { x: 0.0, y: 4.0 }, { x: 0.4, y: 0.2 }, { x: 0.7, y: 0.2 }, { x: 1.0, y: 4.0 },
      ],
      flash_in: [
        { x: 0.0, y: 5.0 }, { x: 0.3, y: 1.0 }, { x: 1.0, y: 1.0 },
      ],
      flash_out: [
        { x: 0.0, y: 1.0 }, { x: 0.7, y: 1.0 }, { x: 1.0, y: 5.0 },
      ],
    };

    let points = [];
    let curveName = 'custom';
    if (typeof curvePresetOrPoints === 'string') {
      const key = curvePresetOrPoints.toLowerCase().trim();
      points = presets[key] || presets.montage;
      curveName = key;
    } else if (Array.isArray(curvePresetOrPoints)) {
      points = curvePresetOrPoints;
    } else {
      points = presets.montage;
    }

    // Update existing speed material or create new
    let speedMat = null;
    const existSpeedRef = s.extra_material_refs.find(id => speedMats.some(m => m.id === id));
    if (existSpeedRef) {
      speedMat = speedMats.find(m => m.id === existSpeedRef);
    }

    if (!speedMat) {
      speedMat = {
        id: uid(),
        mode: 1,
        speed: 1.0,
        type: 'speed',
      };
      speedMats.push(speedMat);
      s.extra_material_refs.push(speedMat.id);
    }

    speedMat.mode = 1;
    speedMat.curve_speed = {
      id: uid(),
      name: curveName,
      speed_points: points,
    };

    return {
      segmentId,
      curve: curveName,
      speedPoints: points,
    };
  }

  // ---------- chroma key (green screen) ----------
  applyChromaKey(segmentId, { color = '#00FF00', intensity = 50, shadow = 50 } = {}) {
    const { s } = this._find(segmentId);
    s.extra_material_refs = s.extra_material_refs || [];
    const chromaMats = this._mats('chromas');

    const existIdx = s.extra_material_refs.findIndex(id => chromaMats.some(m => m.id === id));
    if (existIdx !== -1) {
      const oldId = s.extra_material_refs[existIdx];
      const oldMatIdx = chromaMats.findIndex(m => m.id === oldId);
      if (oldMatIdx !== -1) chromaMats.splice(oldMatIdx, 1);
      s.extra_material_refs.splice(existIdx, 1);
    }

    const chromaId = uid();
    const chromaMat = {
      color,
      id: chromaId,
      intensity: Number(intensity),
      shadow: Number(shadow),
      type: 'chroma',
    };

    chromaMats.push(chromaMat);
    s.extra_material_refs.push(chromaId);

    return {
      segmentId,
      color,
      intensity,
      shadow,
    };
  }

  // ---------- picture-in-picture & split layouts ----------
  applyPipLayout(segmentId, layout = 'corner_br', opts = {}) {
    const { s } = this._find(segmentId);
    s.clip = s.clip || { alpha: 1, flip: { horizontal: false, vertical: false }, rotation: 0, scale: { x: 1, y: 1 }, transform: { x: 0, y: 0 } };

    const scale = opts.scale != null ? opts.scale : 0.35;
    const layouts = {
      corner_br: { scale: { x: scale, y: scale }, transform: { x: 0.6, y: -0.6 } },
      corner_tr: { scale: { x: scale, y: scale }, transform: { x: 0.6, y: 0.6 } },
      corner_bl: { scale: { x: scale, y: scale }, transform: { x: -0.6, y: -0.6 } },
      corner_tl: { scale: { x: scale, y: scale }, transform: { x: -0.6, y: 0.6 } },
      split_left: { scale: { x: 1.0, y: 1.0 }, transform: { x: -0.5, y: 0.0 }, mask: { type: 'rectangle', centerX: -0.5, width: 0.5, height: 1.0 } },
      split_right: { scale: { x: 1.0, y: 1.0 }, transform: { x: 0.5, y: 0.0 }, mask: { type: 'rectangle', centerX: 0.5, width: 0.5, height: 1.0 } },
      split_top: { scale: { x: 1.0, y: 1.0 }, transform: { x: 0.0, y: 0.5 }, mask: { type: 'rectangle', centerY: 0.5, width: 1.0, height: 0.5 } },
      split_bottom: { scale: { x: 1.0, y: 1.0 }, transform: { x: 0.0, y: -0.5 }, mask: { type: 'rectangle', centerY: -0.5, width: 1.0, height: 0.5 } },
    };

    const cfg = layouts[layout.toLowerCase().trim()] || layouts.corner_br;
    s.clip.scale = cfg.scale;
    s.clip.transform = cfg.transform;

    if (cfg.mask) {
      this.applyMask(segmentId, cfg.mask.type, cfg.mask);
    }

    return {
      segmentId,
      layout,
      scale: s.clip.scale,
      transform: s.clip.transform,
    };
  }

  // ---------- smart audio ducking ----------
  autoDuckBgm(bgmTrackIndex, speechTrackIndex = 0, opts = {}) {
    const bgmTrack = this.content.tracks[bgmTrackIndex];
    if (!bgmTrack) throw new Error(`BGM track index ${bgmTrackIndex} not found`);

    const speechTrack = this.content.tracks[speechTrackIndex];
    if (!speechTrack) throw new Error(`Speech track index ${speechTrackIndex} not found`);

    const duckVolume = opts.duckVolume != null ? opts.duckVolume : 0.15;
    const baseVolume = opts.baseVolume != null ? opts.baseVolume : 0.70;
    const fadeDurSec = opts.fadeDurationSec != null ? opts.fadeDurationSec : 0.4;

    const speechIntervals = (speechTrack.segments || []).map(s => ({
      startSec: s.target_timerange.start / US,
      endSec: (s.target_timerange.start + s.target_timerange.duration) / US,
    }));

    let duckedSegmentsCount = 0;

    for (const bgmSeg of bgmTrack.segments || []) {
      const segStartSec = bgmSeg.target_timerange.start / US;
      const segEndSec = (bgmSeg.target_timerange.start + bgmSeg.target_timerange.duration) / US;

      const keyframes = [{ timeOffsetSec: 0.0, value: baseVolume }];

      for (const sp of speechIntervals) {
        if (sp.endSec <= segStartSec || sp.startSec >= segEndSec) continue;

        const relStartSec = Math.max(0, sp.startSec - segStartSec);
        const relEndSec = Math.min(segEndSec - segStartSec, sp.endSec - segStartSec);

        keyframes.push({ timeOffsetSec: Math.max(0, relStartSec - fadeDurSec), value: baseVolume });
        keyframes.push({ timeOffsetSec: relStartSec, value: duckVolume });
        keyframes.push({ timeOffsetSec: relEndSec, value: duckVolume });
        keyframes.push({ timeOffsetSec: Math.min(segEndSec - segStartSec, relEndSec + fadeDurSec), value: baseVolume });
      }

      // Sort and deduplicate keyframe offsets
      keyframes.sort((a, b) => a.timeOffsetSec - b.timeOffsetSec);
      const uniqueKf = [];
      for (const kf of keyframes) {
        if (!uniqueKf.some(u => Math.abs(u.timeOffsetSec - kf.timeOffsetSec) < 0.05)) {
          uniqueKf.push(kf);
        }
      }

      this.addKeyframe(bgmSeg.id, 'volume', uniqueKf);
      duckedSegmentsCount++;
    }

    return {
      bgmTrackIndex,
      speechTrackIndex,
      duckedSegments: duckedSegmentsCount,
      duckVolume,
      baseVolume,
    };
  }

  // ---------- animated progress bar ----------
  addProgressBar(opts = {}) {
    const color = opts.color || '#FF0055';
    const posY = opts.position === 'top' ? 0.95 : -0.95;
    const durUs = this.content.duration || 10 * US;

    const tpl = this.templates().text;
    if (!tpl) throw new Error('Text template required for progress bar');

    const trackIndex = opts.trackIndex != null ? opts.trackIndex : this.addTrack('text', 'Progress Bar Track');
    const track = this.content.tracks[trackIndex];
    const mat = clone(tpl.mat);
    mat.id = uid();

    // Create a horizontal solid bar glyph
    const barText = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    try {
      const content = JSON.parse(mat.content);
      content.text = barText;
      if (content.styles && content.styles[0]) {
        content.styles[0].range = [0, barText.length];
        content.styles[0].fill = { content: { solid: { color: hexToRgb(color) } } };
        content.styles[0].size = 20;
      }
      mat.content = JSON.stringify(content);
    } catch {
      mat.content = JSON.stringify({
        text: barText,
        styles: [{ range: [0, barText.length], size: 20, fill: { content: { solid: { color: hexToRgb(color) } } } }],
      });
    }

    this._mats('texts').push(mat);

    const refs = tpl.refs.map(({ k, m }) => {
      const c = clone(m);
      c.id = uid();
      this._mats(k).push(c);
      return c.id;
    });

    const seg = clone(tpl.seg);
    seg.id = uid();
    seg.material_id = mat.id;
    seg.extra_material_refs = refs;
    seg.target_timerange = { start: 0, duration: durUs };
    seg.source_timerange = { start: 0, duration: durUs };
    seg.render_index = this._nextRender();
    seg.track_render_index = this.content.tracks.indexOf(track);
    seg.clip = { alpha: 1, flip: { horizontal: false, vertical: false }, rotation: 0, scale: { x: 1, y: 0.3 }, transform: { x: 0, y: posY } };

    track.segments.push(seg);

    // Animate scale from 0.0 to 1.0
    this.addKeyframe(seg.id, 'scale_x', [
      { timeOffsetSec: 0.0, value: 0.01 },
      { timeOffsetSec: +(durUs / US).toFixed(3), value: 1.0 },
    ]);

    return {
      segmentId: seg.id,
      trackIndex: this.content.tracks.indexOf(track),
      color,
      position: opts.position || 'bottom',
      durationSec: +(durUs / US).toFixed(3),
    };
  }

  // ---------- professional lower-third ----------
  addLowerThird(title, subtitle = '', opts = {}) {
    const atUs = opts.atUs != null ? opts.atUs : Math.round((opts.atSec || 0) * US);
    const durUs = opts.durUs != null ? opts.durUs : Math.round((opts.durSec || 5.0) * US);
    const posX = opts.posX != null ? opts.posX : -0.45;
    const posY = opts.posY != null ? opts.posY : -0.65;

    const fullText = subtitle ? `${title}\n${subtitle}` : title;
    const subRes = this.addSubtitlesBatch([
      { startSec: +(atUs / US).toFixed(3), durSec: +(durUs / US).toFixed(3), text: fullText },
    ], {
      fontSize: opts.fontSize || 14,
      color: opts.titleColor || '#FFFFFF',
      strokeColor: opts.strokeColor || '#000000',
      strokeWidth: 0.1,
      posX,
      posY,
      trackIndex: opts.trackIndex,
    });

    return {
      title,
      subtitle,
      atSec: +(atUs / US).toFixed(3),
      durSec: +(durUs / US).toFixed(3),
      subtitles: subRes,
    };
  }

  // ---------- audio normalizer ----------
  normalizeAudio(trackIndex = 0, targetVolume = 1.3) {
    const track = this.content.tracks[trackIndex];
    if (!track) throw new Error(`Track index ${trackIndex} not found`);

    let normalizedCount = 0;
    for (const seg of track.segments || []) {
      seg.volume = Number(targetVolume);
      normalizedCount++;
    }

    return {
      trackIndex,
      normalizedSegments: normalizedCount,
      targetVolume,
    };
  }

  // ---------- smart jumpcut / silence remover ----------
  autoJumpcut(speechIntervals = [], opts = {}) {
    const trackIndex = opts.trackIndex || 0;
    const track = this.content.tracks[trackIndex];
    if (!track) throw new Error(`Track index ${trackIndex} not found`);

    if (!speechIntervals || speechIntervals.length === 0) {
      return { ok: false, message: 'No speech intervals provided' };
    }

    const paddingUs = Math.round((opts.paddingSec != null ? opts.paddingSec : 0.08) * US);
    const originalSegs = [...(track.segments || [])];
    if (originalSegs.length === 0) return { ok: false, message: 'Track has no segments' };

    const baseSeg = originalSegs[0];
    const newSegs = [];
    let currentTimelineUs = 0;

    for (const sp of speechIntervals) {
      const spStartUs = Math.max(0, Math.round(sp.startSec * US) - paddingUs);
      const spEndUs = Math.round(sp.endSec * US) + paddingUs;
      const spDurUs = Math.max(US / 10, spEndUs - spStartUs);

      const newSeg = clone(baseSeg);
      newSeg.id = uid();
      newSeg.source_timerange = { start: spStartUs, duration: spDurUs };
      newSeg.target_timerange = { start: currentTimelineUs, duration: spDurUs };
      newSeg.render_index = this._nextRender();
      newSeg.extra_material_refs = [];

      newSegs.push(newSeg);
      currentTimelineUs += spDurUs;
    }

    track.segments = newSegs;
    this._recalcDuration();

    return {
      trackIndex,
      speechSegmentsCreated: newSegs.length,
      newTotalDurationSec: +(currentTimelineUs / US).toFixed(3),
    };
  }

  // ---------- canvas blur & background ----------
  setCanvasBlur(segmentId, { blurRadius = 10, color = '', type = 'blur' } = {}) {
    const { s } = this._find(segmentId);
    s.extra_material_refs = s.extra_material_refs || [];
    const canvasMats = this._mats('canvases');

    const existIdx = s.extra_material_refs.findIndex(id => canvasMats.some(m => m.id === id));
    if (existIdx !== -1) {
      const oldId = s.extra_material_refs[existIdx];
      s.extra_material_refs.splice(existIdx, 1);
      const stillUsed = (this.content.tracks || []).some(tr => (tr.segments || []).some(seg => (seg.extra_material_refs || []).includes(oldId)));
      if (!stillUsed) {
        const oldMatIdx = canvasMats.findIndex(m => m.id === oldId);
        if (oldMatIdx !== -1) canvasMats.splice(oldMatIdx, 1);
      }
    }

    const canvasId = uid();
    const isColor = type === 'color' || (color && !blurRadius);
    const canvasMat = {
      album_image: '',
      blur: isColor ? 0 : Number(blurRadius || 10),
      color: isColor ? (color || '#000000') : '',
      id: canvasId,
      image: '',
      image_id: '',
      image_name: '',
      source_platform: 0,
      team_id: '',
      type: isColor ? 'canvas_color' : 'canvas_blur',
    };

    canvasMats.push(canvasMat);
    s.extra_material_refs.push(canvasId);

    return {
      segmentId,
      type: canvasMat.type,
      blur: canvasMat.blur,
      color: canvasMat.color,
    };
  }

  // ---------- manual color adjustments ----------
  setColorAdjustments(segmentId, opts = {}) {
    const { s } = this._find(segmentId);

    const adjustments = [];
    if (opts.brightness != null) {
      const val = Number(opts.brightness) / 100.0;
      this.addKeyframe(segmentId, 'brightness', [{ timeOffsetSec: 0, value: val }]);
      adjustments.push({ property: 'brightness', value: opts.brightness });
    }
    if (opts.contrast != null) {
      const val = Number(opts.contrast) / 100.0;
      this.addKeyframe(segmentId, 'contrast', [{ timeOffsetSec: 0, value: val }]);
      adjustments.push({ property: 'contrast', value: opts.contrast });
    }
    if (opts.saturation != null) {
      const val = Number(opts.saturation) / 100.0;
      this.addKeyframe(segmentId, 'saturation', [{ timeOffsetSec: 0, value: val }]);
      adjustments.push({ property: 'saturation', value: opts.saturation });
    }

    s.enable_color_correct_adjust = true;
    s.enable_adjust = true;

    return {
      segmentId,
      adjustments,
    };
  }

  // ---------- timeline analytics & inspect edit ----------
  inspectEdit() {
    const c = this.content;
    const durSec = +(c.duration / US).toFixed(3);
    const tracks = c.tracks || [];

    const videoTrack = tracks.find(t => t.type === 'video');
    const primaryCuts = videoTrack ? (videoTrack.segments || []).length : 0;

    const brollTrack = tracks.length > 1 && tracks[1].type === 'video' ? tracks[1] : null;
    let brollDurUs = 0;
    const brollCount = brollTrack ? (brollTrack.segments || []).length : 0;
    if (brollTrack) {
      for (const s of brollTrack.segments || []) {
        brollDurUs += (s.target_timerange?.duration || 0);
      }
    }
    const brollCoverageSec = +(brollDurUs / US).toFixed(3);
    const brollCoveragePercent = durSec > 0 ? +((brollCoverageSec / durSec) * 100).toFixed(1) : 0;

    let subtitleCount = 0;
    for (const t of tracks.filter(x => x.type === 'text')) {
      subtitleCount += (t.segments || []).length;
    }

    const transitionsCount = (c.materials?.transitions || []).length;
    const effectsCount = (c.materials?.video_effects || []).length;
    const filtersCount = (c.materials?.effects || []).filter(e => e.type === 'filter').length;
    const stickersCount = (c.materials?.stickers || []).length;
    const audioFadesCount = (c.materials?.audio_fades || []).length;
    const audioEffectsCount = (c.materials?.audio_effects || []).length;

    let keyframesCount = 0;
    for (const tr of tracks) {
      for (const s of tr.segments || []) {
        for (const kf of s.common_keyframes || []) {
          keyframesCount += (kf.keyframe_list || []).length;
        }
      }
    }

    const val = this.validate();

    return {
      name: this.name,
      durationSec: durSec,
      aspectRatio: c.canvas_config?.ratio || '16:9',
      resolution: c.canvas_config ? `${c.canvas_config.width}x${c.canvas_config.height}` : '1920x1080',
      fps: c.fps,
      summary: {
        totalTracks: tracks.length,
        primaryVideoCuts: primaryCuts,
        brollClips: brollCount,
        brollCoverageSec,
        brollCoveragePercent: `${brollCoveragePercent}%`,
        subtitlesCount: subtitleCount,
        transitionsCount,
        effectsCount,
        filtersCount,
        stickersCount,
        audioFadesCount,
        audioEffectsCount,
        keyframesCount,
      },
      health: {
        ok: val.ok,
        issues: val.issues,
        warnings: val.warnings,
      },
    };
  }

  // ---------- video understanding & semantic AI director ----------
  async analyzeVideoUnderstanding(videoPath, opts = {}) {
    const extracted = extractVideoFrames(videoPath, {
      intervalSec: opts.intervalSec || 2,
      maxFrames: opts.maxFrames || 30
    });

    try {
      const sceneMap = await analyzeVideoWithAI(extracted.frames, {
        apiKey: opts.apiKey,
        provider: opts.provider || 'gemini',
        transcript: opts.transcript || []
      });

      this.sceneMap = sceneMap;
      return {
        videoPath,
        durationSec: +(this.content.duration / US).toFixed(3),
        overallMood: sceneMap.overallMood,
        summary: sceneMap.summary,
        totalScenes: sceneMap.scenes?.length || 0,
        scenes: sceneMap.scenes || []
      };
    } finally {
      extracted.cleanup();
    }
  }

  findVisualScenes(query, customSceneMap) {
    const map = customSceneMap || this.sceneMap;
    if (!map) {
      throw new Error('Scene map not found. Run analyzeVideoUnderstanding first or provide sceneMap.');
    }
    return findScenesByQuery(map, query);
  }

  applySemanticEdit(query, action = 'filter', params = {}) {
    const matched = this.findVisualScenes(query, params.sceneMap);
    if (matched.length === 0) {
      return { ok: false, message: `No visual scene matching "${query}" found.` };
    }

    const scene = matched[0];
    const atSec = params.atSec != null ? params.atSec : scene.startSec;
    const durSec = params.durSec != null ? params.durSec : +(scene.endSec - scene.startSec).toFixed(2);

    let editResult = null;
    switch (action.toLowerCase()) {
      case 'filter':
      case 'color_filter': {
        const filterName = params.name || params.filterName || scene.suggestedEdits?.suggestedFilter || 'BW 2';
        editResult = this.applyFilter(null, filterName, { startSec: atSec, durationSec: durSec, intensity: params.intensity || 80 });
        break;
      }
      case 'effect':
      case 'video_effect': {
        const effectName = params.name || params.effectName || scene.suggestedEdits?.suggestedEffects?.[0] || 'Vignette';
        editResult = this.applyEffect(null, effectName, { startSec: atSec, durationSec: durSec });
        break;
      }
      case 'zoom':
      case 'punch_in': {
        const atUs = atSec * US;
        const mainTrack = (this.content.tracks || []).find(t => t.type === 'video');
        const seg = (mainTrack?.segments || []).find(s => s.target_timerange.start <= atUs && (s.target_timerange.start + s.target_timerange.duration) > atUs);
        if (seg) {
          const scale = params.scale || 1.10;
          editResult = this.addKeyframe(seg.id, 'scale', [
            { timeOffsetSec: 0, value: scale },
            { timeOffsetSec: durSec, value: 1.0 }
          ]);
        }
        break;
      }
      case 'lower_third':
      case 'badge': {
        const title = params.title || scene.emotion || 'Scene Highlight';
        const subtitle = params.subtitle || scene.visualDescription?.slice(0, 30) || '';
        editResult = this.addLowerThird(title, subtitle, { atSec, durSec: Math.min(durSec, 5.0) });
        break;
      }
      case 'canvas_blur': {
        const atUs = atSec * US;
        const mainTrack = (this.content.tracks || []).find(t => t.type === 'video');
        const seg = (mainTrack?.segments || []).find(s => s.target_timerange.start <= atUs && (s.target_timerange.start + s.target_timerange.duration) > atUs);
        if (seg) {
          editResult = this.setCanvasBlur(seg.id, { blurRadius: params.blurRadius || 12 });
        }
        break;
      }
      default:
        throw new Error(`Unsupported semantic action "${action}". Supported: filter, effect, zoom, lower_third, canvas_blur`);
    }

    return {
      ok: true,
      query,
      action,
      matchedScene: {
        startSec: scene.startSec,
        endSec: scene.endSec,
        emotion: scene.emotion,
        visualDescription: scene.visualDescription
      },
      editResult
    };
  }

  _recalcDuration() { let max = 0; for (const tr of (this.content.tracks || [])) for (const s of (tr.segments || [])) max = Math.max(max, s.target_timerange.start + s.target_timerange.duration); this.content.duration = max; }

  // escape hatch: apply a JSON-merge-style patch to content (advanced/undocumented ops)
  rawPatch(patch) { deepMerge(this.content, patch); return { ok: true }; }

  // ---------- validate ----------
  validate() {
    const c = this.content; const issues = [], warnings = [];
    const allMaterialIds = new Set();
    const matIdMap = new Map(); // id -> category
    let dupMat = 0;

    for (const k of Object.keys(c.materials || {})) {
      if (Array.isArray(c.materials[k])) {
        for (const m of c.materials[k]) {
          if (!m || !m.id) continue;
          if (allMaterialIds.has(m.id)) dupMat++;
          allMaterialIds.add(m.id);
          matIdMap.set(m.id, k);
        }
      }
    }
    if (dupMat) issues.push(`${dupMat} duplicate material id(s)`);

    // Check dangling references
    let dangling = 0;
    for (const tr of (c.tracks || [])) {
      for (const s of (tr.segments || [])) {
        if (s.material_id && !allMaterialIds.has(s.material_id)) {
          dangling++;
        }
        for (const refId of (s.extra_material_refs || [])) {
          if (!allMaterialIds.has(refId)) {
            dangling++;
          }
        }
      }
    }
    if (dangling) issues.push(`${dangling} dangling material reference(s) found in segments`);

    let overlaps = 0;
    const ris = new Map(); // render_index -> [ {start,end} ] across visual tracks
    for (const tr of (c.tracks || [])) {
      if (tr.type === 'audio') continue; // audio tracks have independent render order
      const ss = [...(tr.segments || [])].sort((a, b) => a.target_timerange.start - b.target_timerange.start);
      for (const s of ss) {
        const e = { a: s.target_timerange.start, b: s.target_timerange.start + s.target_timerange.duration };
        (ris.get(s.render_index) || ris.set(s.render_index, []).get(s.render_index)).push(e);
      }
      for (let i = 1; i < ss.length; i++) {
        if (ss[i].target_timerange.start < ss[i - 1].target_timerange.start + ss[i - 1].target_timerange.duration) {
          overlaps++;
        }
      }
    }

    let riClash = 0;
    for (const arr of ris.values()) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i].a < arr[j].b && arr[j].a < arr[i].b) riClash++;
        }
      }
    }
    if (overlaps) issues.push(`${overlaps} overlapping segment(s) on a single track`);
    if (riClash) issues.push(`${riClash} overlapping segment pair(s) share a render_index (ambiguous layer order)`);
    else if (ris.size < [...ris.values()].reduce((n, a) => n + a.length, 0)) warnings.push('some non-overlapping segments share a render_index (harmless; CapCut does this for sequential clips)');

    for (const s of (c.materials?.videos || [])) {
      if (s.path && !fs.existsSync(s.path)) issues.push(`missing media file: ${s.path}`);
    }
    return { ok: issues.length === 0, issues, warnings };
  }

  // ---------- save ----------
  save({ force = false } = {}) {
    if (!force) {
      if (fs.existsSync(path.join(this.dir, '.locked'))) throw new Error('draft is locked (open in CapCut). Close CapCut, or pass force:true. Autosave will overwrite edits made while open.');
      if (isCapCutRunning()) throw new Error('CapCut is running. Close it before saving, or pass force:true.');
    }
    const v = this.validate();

    // Write to both draft_content.json and draft_info.json for multi-version CapCut compatibility
    for (const fn of ['draft_content.json', 'draft_info.json']) {
      const filePath = path.join(this.dir, fn);
      try { fs.copyFileSync(filePath, filePath + '.mcpbak'); } catch {}
      const tmp = filePath + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify(this.content));
      fs.renameSync(tmp, filePath);
    }

    if (this.meta) {
      try { fs.copyFileSync(this.metaPath, this.metaPath + '.mcpbak'); } catch {}
      const mt = this.metaPath + '.tmp';
      fs.writeFileSync(mt, JSON.stringify(this.meta));
      fs.renameSync(mt, this.metaPath);
    }

    // Sync root_meta_info.json if present
    try {
      const rootMetaPath = path.join(DRAFTS_DIR, 'root_meta_info.json');
      if (fs.existsSync(rootMetaPath)) {
        const rootData = JSON.parse(fs.readFileSync(rootMetaPath, 'utf8'));
        if (Array.isArray(rootData.all_draft_store)) {
          const entry = rootData.all_draft_store.find(e => e.draft_name === this.name || e.draft_fold_path?.endsWith(this.name));
          if (entry) {
            entry.tm_draft_modified = Date.now() * 1000;
            entry.tm_duration = this.content.duration;
            fs.writeFileSync(rootMetaPath + '.tmp', JSON.stringify(rootData, null, 2));
            fs.renameSync(rootMetaPath + '.tmp', rootMetaPath);
          }
        }
      }
    } catch {}

    return { saved: this.name, durationSec: +(this.content.duration / US).toFixed(3), validation: v };
  }
}

// clone a whole draft folder to a new name (valid scaffolding), optionally emptied
export function cloneDraft(base, newName, { empty = false } = {}) {
  const src = path.join(DRAFTS_DIR, base), dst = path.join(DRAFTS_DIR, newName);
  const srcHasJson = fs.existsSync(path.join(src, 'draft_info.json')) || fs.existsSync(path.join(src, 'draft_content.json'));
  if (!srcHasJson) throw new Error(`base draft not found: ${base}`);
  if (fs.existsSync(dst)) throw new Error(`draft already exists: ${newName}`);
  fs.mkdirSync(dst, { recursive: true });
  for (const fn of fs.readdirSync(src)) { const s = path.join(src, fn); try { if (fs.statSync(s).isFile()) fs.copyFileSync(s, path.join(dst, fn)); } catch {} }
  if (empty) {
    const d = new CapCutDraft(newName);
    for (const k of Object.keys(d.content.materials || {})) if (Array.isArray(d.content.materials[k])) d.content.materials[k] = [];
    for (const tr of (d.content.tracks || [])) tr.segments = [];
    d.content.duration = 0; d.content.id = uid(); d.content.name = newName;
    for (const fn of ['draft_content.json', 'draft_info.json']) {
      fs.writeFileSync(path.join(dst, fn), JSON.stringify(d.content));
    }
  }
  return { created: newName, dir: dst };
}

export function listStickers(query = '', { limit = 50 } = {}) {
  const assetsIndex = getAssetsIndex();
  const q = String(query || '').toLowerCase().trim();
  const filtered = assetsIndex.filter(a => {
    const isSticker = a.name.toLowerCase().includes('sticker') || a.type.toLowerCase().includes('sticker');
    if (!q) return isSticker;
    return a.resourceId.includes(q) || a.name.toLowerCase().includes(q) || a.type.toLowerCase().includes(q);
  });
  return (filtered.length > 0 ? filtered : assetsIndex).slice(0, limit).map(s => ({
    resourceId: s.resourceId,
    name: s.name,
    type: s.type,
    cached: true,
    path: s.path,
  }));
}

function hexToRgb(hex) { const h = hex.replace('#', ''); return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255]; }
function deepMerge(t, s) { for (const k of Object.keys(s)) { if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k]) && t[k] && typeof t[k] === 'object') deepMerge(t[k], s[k]); else t[k] = s[k]; } return t; }

export const _us = US;
