import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockDraftDir } from './helpers.js';

test('MCP Tool Handlers: list and apply operations', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const { searchCatalog } = await import(`../src/registry/registry.js?t=${Date.now()}`);

  const draft = new CapCutDraft(env.draftName);

  // 1. Test transition listing & applying
  const transitions = searchCatalog('Cross Dissolve', { kind: 'transition' });
  assert.ok(transitions.length > 0);
  const transRes = draft.applyTransition(env.seg1Id, transitions[0].key, { durUs: 500000 });
  assert.equal(transRes.durationSec, 0.5);

  // 2. Test effect listing & applying
  const effects = searchCatalog('Beat Shots', { kind: 'video_effect' });
  assert.ok(effects.length > 0);
  const effRes = draft.applyEffect(env.seg2Id, effects[0].key, { params: [50, 50, 50, 50] });
  assert.equal(effRes.effect, 'Beat Shots');

  // 3. Test animation listing & applying
  const anims = searchCatalog('Zoom In', { kind: 'intro' });
  assert.ok(anims.length > 0);
  const animRes = draft.applyAnimation(env.seg1Id, anims[0].key, { animationType: 'in', durUs: 500000 });
  assert.equal(animRes.animationType, 'in');

  // 4. Test filter listing & applying
  const filters = searchCatalog('BW 2', { kind: 'filter' });
  assert.ok(filters.length > 0);
  const filtRes = draft.applyFilter(env.seg1Id, filters[0].key, { intensity: 80 });
  assert.equal(filtRes.intensity, 80);

  // 5. Verify timeline output contains applied extra materials
  const timeline = draft.timeline();
  assert.ok(timeline.tracks.length >= 2);
  const seg1Info = timeline.tracks[0].segments.find(s => s.id === env.seg1Id);
  assert.ok(seg1Info.extraMaterials && seg1Info.extraMaterials.length >= 3);

  // 6. Validate
  const val = draft.validate();
  assert.equal(val.ok, true, `Validation failed: ${val.issues.join(', ')}`);

  // 7. Save
  const saveRes = draft.save({ force: true });
  assert.equal(saveRes.saved, env.draftName);

  env.cleanup();
});
