import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockDraftDir } from './helpers.js';
import { harvestUsedMaterials } from '../src/harvest.js';

test('Harvest used materials from drafts folder in read-only mode', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  // Apply some materials and save
  draft.applyTransition(env.seg1Id, 'Cross Dissolve');
  draft.applyEffect(env.seg2Id, 'Beat Shots');
  draft.applyFilter(env.seg1Id, 'BW 2');
  draft.save({ force: true });

  const harvested = harvestUsedMaterials(env.tmpDir);
  assert.ok(harvested.length >= 3, `Expected at least 3 harvested materials, got ${harvested.length}`);

  const trans = harvested.find(x => x.kind === 'transition');
  assert.ok(trans, 'Harvested transition');
  assert.equal(trans.effectId, '6724845717472416269');

  const eff = harvested.find(x => x.kind === 'video_effect');
  assert.ok(eff, 'Harvested video effect');

  const filt = harvested.find(x => x.kind === 'filter/adjust');
  assert.ok(filt, 'Harvested filter');

  env.cleanup();
});
