import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockDraftDir } from './helpers.js';

test('Add scale keyframes to segment for dynamic zoom', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const res = draft.addKeyframe(env.seg1Id, 'scale', [
    { timeOffsetSec: 0.0, value: 1.0 },
    { timeOffsetSec: 3.0, value: 1.15 },
  ]);

  assert.equal(res.segmentId, env.seg1Id);
  assert.equal(res.property, 'scale');

  const { s } = draft._find(env.seg1Id);
  assert.ok(s.common_keyframes, 'segment has common_keyframes array');
  assert.equal(s.common_keyframes.length, 2, 'has KFTypeScaleX and KFTypeScaleY lists');

  const kfX = s.common_keyframes.find(k => k.property_type === 'KFTypeScaleX');
  assert.ok(kfX, 'found scale X list');
  assert.equal(kfX.keyframe_list.length, 2);
  assert.equal(kfX.keyframe_list[0].values[0], 1.0);
  assert.equal(kfX.keyframe_list[1].values[0], 1.15);

  const val = draft.validate();
  assert.ok(val.ok, 'draft validation passed: ' + JSON.stringify(val.issues));

  env.cleanup();
});

test('Apply circular mask to video clip with feather', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const res = draft.applyMask(env.seg1Id, 'circle', {
    centerX: 0.2,
    centerY: -0.2,
    width: 0.6,
    height: 0.6,
    feather: 0.1,
    invert: false,
  });

  assert.equal(res.segmentId, env.seg1Id);
  assert.equal(res.maskType, '圆形');
  assert.equal(res.resourceType, 'circle');
  assert.equal(res.config.centerX, 0.2);
  assert.equal(res.config.feather, 0.1);

  const maskMats = draft.content.materials.common_mask;
  assert.ok(Array.isArray(maskMats) && maskMats.length === 1);
  assert.equal(maskMats[0].resource_type, 'circle');

  const { s } = draft._find(env.seg1Id);
  assert.ok(s.extra_material_refs.includes(maskMats[0].id));

  const val = draft.validate();
  assert.ok(val.ok, 'draft validation passed: ' + JSON.stringify(val.issues));

  env.cleanup();
});
