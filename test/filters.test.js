import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockDraftDir } from './helpers.js';

test('Apply clip-level color filter with intensity', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const res = draft.applyFilter(env.seg1Id, 'BW 2', { intensity: 75 });
  assert.equal(res.intensity, 75);

  const filtMat = draft.content.materials.effects[0];
  assert.ok(filtMat, 'Filter material created in materials.effects');
  assert.equal(filtMat.type, 'filter');
  assert.equal(filtMat.value, 0.75);

  const { s } = draft._find(env.seg1Id);
  assert.ok(s.extra_material_refs.includes(filtMat.id));

  const val = draft.validate();
  assert.equal(val.ok, true, `Validation failed: ${val.issues.join(', ')}`);

  env.cleanup();
});

test('Apply standalone filter layer track', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const res = draft.applyFilter(null, 'Vintage 90s', { intensity: 90, atUs: 0, durUs: 5000000 });
  assert.equal(res.intensity, 90);

  const filtTrack = draft.content.tracks.find(t => t.type === 'filter');
  assert.ok(filtTrack, 'Filter track created');
  assert.equal(filtTrack.segments.length, 1);

  const filtMat = draft.content.materials.effects[0];
  assert.equal(filtMat.apply_target_type, 2);

  const val = draft.validate();
  assert.equal(val.ok, true);

  env.cleanup();
});
