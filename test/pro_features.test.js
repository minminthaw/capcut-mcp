import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockDraftDir } from './helpers.js';

test('Apply Speed Curve (Hero preset) to segment', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const res = draft.setSpeedCurve(env.seg1Id, 'hero');
  assert.equal(res.curve, 'hero');
  assert.ok(Array.isArray(res.speedPoints) && res.speedPoints.length >= 4);

  const speedMats = draft.content.materials.speeds;
  assert.ok(Array.isArray(speedMats) && speedMats.length === 1);
  assert.equal(speedMats[0].mode, 1);
  assert.equal(speedMats[0].curve_speed.name, 'hero');

  const val = draft.validate();
  assert.ok(val.ok, 'draft validation passed: ' + JSON.stringify(val.issues));

  env.cleanup();
});

test('Apply Chroma Key green screen cutout to segment', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const res = draft.applyChromaKey(env.seg1Id, { color: '#00FF00', intensity: 60, shadow: 40 });
  assert.equal(res.color, '#00FF00');
  assert.equal(res.intensity, 60);

  const chromaMats = draft.content.materials.chromas;
  assert.ok(Array.isArray(chromaMats) && chromaMats.length === 1);
  assert.equal(chromaMats[0].color, '#00FF00');

  const { s } = draft._find(env.seg1Id);
  assert.ok(s.extra_material_refs.includes(chromaMats[0].id));

  const val = draft.validate();
  assert.ok(val.ok, 'draft validation passed: ' + JSON.stringify(val.issues));

  env.cleanup();
});

test('Apply Picture-in-Picture layout to segment', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const res = draft.applyPipLayout(env.seg1Id, 'corner_tr', { scale: 0.3 });
  assert.equal(res.layout, 'corner_tr');
  assert.equal(res.scale.x, 0.3);
  assert.equal(res.transform.x, 0.6);
  assert.equal(res.transform.y, 0.6);

  const val = draft.validate();
  assert.ok(val.ok, 'draft validation passed: ' + JSON.stringify(val.issues));

  env.cleanup();
});

test('Auto-duck BGM track based on speech track segments', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  // Add an audio segment to simulate BGM track
  draft.addTrack('audio');
  const bgmTrackIdx = draft.content.tracks.length - 1;
  const bgmTrack = draft.content.tracks[bgmTrackIdx];

  const dummyAudioMatId = 'DUMMY_AUDIO_ID';
  draft.content.materials.audios = [{
    id: dummyAudioMatId,
    type: 'audio',
    path: '/path/to/mock_bgm.mp3',
    duration: 10000000,
  }];

  bgmTrack.segments.push({
    id: 'BGM_SEG_1',
    material_id: dummyAudioMatId,
    render_index: 0,
    source_timerange: { start: 0, duration: 10000000 },
    target_timerange: { start: 0, duration: 10000000 },
    track_render_index: bgmTrackIdx,
    volume: 1.0,
    extra_material_refs: [],
  });

  const res = draft.autoDuckBgm(bgmTrackIdx, 0, { duckVolume: 0.15, baseVolume: 0.70 });
  assert.equal(res.bgmTrackIndex, bgmTrackIdx);
  assert.equal(res.duckedSegments, 1);

  const bgmSeg = bgmTrack.segments[0];
  assert.ok(bgmSeg.common_keyframes, 'bgm segment has keyframes');
  const volKf = bgmSeg.common_keyframes.find(k => k.property_type === 'KFTypeVolume');
  assert.ok(volKf, 'has volume keyframes list');
  assert.ok(volKf.keyframe_list.length >= 2, 'has keyframes generated');

  const val = draft.validate();
  assert.ok(val.ok, 'draft validation passed: ' + JSON.stringify(val.issues));

  env.cleanup();
});
