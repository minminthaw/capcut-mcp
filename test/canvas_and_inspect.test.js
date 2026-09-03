import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockDraftDir } from './helpers.js';

test('Apply canvas background blur to segment', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const res = draft.setCanvasBlur(env.seg1Id, { blurRadius: 15 });
  assert.equal(res.type, 'canvas_blur');
  assert.equal(res.blur, 15);

  const canvasMats = draft.content.materials.canvases;
  assert.ok(Array.isArray(canvasMats) && canvasMats.length >= 1);
  assert.ok(canvasMats.some(c => c.blur === 15), 'found blur canvas material');

  const val = draft.validate();
  assert.ok(val.ok, 'draft validation passed: ' + JSON.stringify(val.issues));

  env.cleanup();
});

test('Apply manual color adjustments to segment', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const res = draft.setColorAdjustments(env.seg1Id, {
    brightness: 10,
    contrast: 15,
    saturation: -5,
  });

  assert.equal(res.adjustments.length, 3);

  const { s } = draft._find(env.seg1Id);
  assert.ok(s.common_keyframes, 'segment has keyframes for color');
  const bKf = s.common_keyframes.find(k => k.property_type === 'KFTypeBrightness');
  assert.ok(bKf, 'found brightness keyframe');

  const val = draft.validate();
  assert.ok(val.ok, 'draft validation passed: ' + JSON.stringify(val.issues));

  env.cleanup();
});

test('Inspect edit returns timeline analytics and health', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const analytics = draft.inspectEdit();
  assert.equal(analytics.name, env.draftName);
  assert.ok(analytics.durationSec > 0);
  assert.equal(typeof analytics.summary.primaryVideoCuts, 'number');
  assert.equal(typeof analytics.health.ok, 'boolean');
  assert.equal(analytics.health.ok, true);

  env.cleanup();
});
