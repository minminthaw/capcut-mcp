import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockDraftDir } from './helpers.js';

test('Add animated progress bar overlay', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const res = draft.addProgressBar({ color: '#FF0055', position: 'bottom' });
  assert.equal(res.color, '#FF0055');
  assert.equal(res.position, 'bottom');
  assert.ok(res.segmentId, 'created progress bar segment');

  const { s } = draft._find(res.segmentId);
  assert.ok(s.common_keyframes, 'has animation keyframes');
  const kfX = s.common_keyframes.find(k => k.property_type === 'KFTypeScaleX');
  assert.ok(kfX, 'has scale_x keyframe for 0 to 100% fill');

  const val = draft.validate();
  assert.ok(val.ok, 'draft validation passed: ' + JSON.stringify(val.issues));

  env.cleanup();
});

test('Add professional lower-third badge', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const res = draft.addLowerThird('Dr. Min Thu', 'AI Researcher & Developer', {
    atSec: 3.5,
    durSec: 4.0,
    titleColor: '#FFE600',
  });

  assert.equal(res.title, 'Dr. Min Thu');
  assert.equal(res.subtitle, 'AI Researcher & Developer');
  assert.equal(res.atSec, 3.5);

  const val = draft.validate();
  assert.ok(val.ok, 'draft validation passed: ' + JSON.stringify(val.issues));

  env.cleanup();
});

test('Normalize audio volume across track', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const res = draft.normalizeAudio(0, 1.4);
  assert.equal(res.trackIndex, 0);
  assert.equal(res.targetVolume, 1.4);
  assert.equal(res.normalizedSegments, 2);

  assert.equal(draft.content.tracks[0].segments[0].volume, 1.4);
  assert.equal(draft.content.tracks[0].segments[1].volume, 1.4);

  const val = draft.validate();
  assert.ok(val.ok, 'draft validation passed: ' + JSON.stringify(val.issues));

  env.cleanup();
});

test('Auto jumpcut slices and ripples speech intervals', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const speechIntervals = [
    { startSec: 0.5, endSec: 2.0 },
    { startSec: 3.0, endSec: 4.5 },
  ];

  const res = draft.autoJumpcut(speechIntervals, { paddingSec: 0.05, trackIndex: 0 });
  assert.equal(res.speechSegmentsCreated, 2);
  assert.ok(res.newTotalDurationSec > 0);

  const val = draft.validate();
  assert.ok(val.ok, 'draft validation passed: ' + JSON.stringify(val.issues));

  env.cleanup();
});
