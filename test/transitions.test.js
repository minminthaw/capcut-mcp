import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockDraftDir } from './helpers.js';

test('Apply transition to a video segment', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  // Apply Cross Dissolve transition
  const result = draft.applyTransition(env.seg1Id, 'Cross Dissolve', { durUs: 800000 });
  assert.equal(result.transition, '叠化');
  assert.equal(result.durationSec, 0.8);

  // Verify materials.transitions contains the material
  const transMat = draft.content.materials.transitions[0];
  assert.ok(transMat, 'Transition material created');
  assert.equal(transMat.effect_id, '6724845717472416269');
  assert.equal(transMat.duration, 800000);

  // Verify segment's extra_material_refs contains transMat.id
  const { s } = draft._find(env.seg1Id);
  assert.ok(s.extra_material_refs.includes(transMat.id), 'Segment references transition ID');

  // Verify validation passes
  const val = draft.validate();
  assert.equal(val.ok, true, `Validation failed: ${val.issues.join(', ')}`);

  // Re-applying another transition updates in-place without duplicating
  const result2 = draft.applyTransition(env.seg1Id, 'Bubble Blur', { durUs: 600000 });
  assert.equal(draft.content.materials.transitions.length, 1, 'Should not create duplicate transition materials');
  assert.equal(draft.content.materials.transitions[0].name, '泡泡模糊');

  const val2 = draft.validate();
  assert.equal(val2.ok, true);

  env.cleanup();
});

test('Transition duration exceeding clip duration throws error', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  // Segment duration is 5s = 5,000,000 us. Requesting 10s should fail.
  assert.throws(
    () => draft.applyTransition(env.seg1Id, 'Cross Dissolve', { durUs: 10000000 }),
    /Transition duration .* cannot exceed clip duration/
  );

  env.cleanup();
});
