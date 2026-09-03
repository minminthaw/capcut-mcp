import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockDraftDir } from './helpers.js';

test('Apply clip-level video effect with custom params', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  // Apply Beat Shots effect with params
  const res = draft.applyEffect(env.seg1Id, 'Beat Shots', { params: [50, 80, 20, 100] });
  assert.equal(res.effect, 'Beat Shots');

  const effMat = draft.content.materials.video_effects[0];
  assert.ok(effMat, 'Video effect material created');
  assert.equal(effMat.apply_target_type, 0); // Clip level
  assert.equal(effMat.adjust_params.length, 4);

  const { s } = draft._find(env.seg1Id);
  assert.ok(s.extra_material_refs.includes(effMat.id));

  const val = draft.validate();
  assert.equal(val.ok, true, `Validation failed: ${val.issues.join(', ')}`);

  env.cleanup();
});

test('Apply standalone effect layer track', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const res = draft.applyEffect(null, 'Blur', { atUs: 1000000, durUs: 4000000 });
  assert.equal(res.atSec, 1.0);
  assert.equal(res.durSec, 4.0);

  const effTrack = draft.content.tracks.find(t => t.type === 'effect');
  assert.ok(effTrack, 'Effect track created');
  assert.equal(effTrack.segments.length, 1);

  const effMat = draft.content.materials.video_effects[0];
  assert.equal(effMat.apply_target_type, 2); // Global / track level

  const val = draft.validate();
  assert.equal(val.ok, true, `Validation failed: ${val.issues.join(', ')}`);

  env.cleanup();
});
