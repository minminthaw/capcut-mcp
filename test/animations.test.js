import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockDraftDir } from './helpers.js';

test('Apply intro and outro animations to video clip', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  // Apply intro animation
  const inRes = draft.applyAnimation(env.seg1Id, 'MC爆炸', { animationType: 'in', durUs: 1000000 });
  assert.equal(inRes.animationType, 'in');

  // Apply outro animation to the same clip
  const outRes = draft.applyAnimation(env.seg1Id, '缩小', { animationType: 'out', durUs: 800000 });
  assert.equal(outRes.animationType, 'out');

  // Verify materials.material_animations has single container with both animations
  const animContainer = draft.content.materials.material_animations[0];
  assert.ok(animContainer, 'Animation container created');
  assert.equal(animContainer.type, 'sticker_animation');
  assert.equal(animContainer.animations.length, 2);
  assert.equal(animContainer.animations[0].type, 'in');
  assert.equal(animContainer.animations[1].type, 'out');

  const val = draft.validate();
  assert.equal(val.ok, true, `Validation failed: ${val.issues.join(', ')}`);

  env.cleanup();
});

test('Apply text animation to subtitle overlay', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const res = draft.applyAnimation(env.textSegId, '放大', { durUs: 400000 });
  assert.equal(res.animationType, 'in');

  const animContainer = draft.content.materials.material_animations[0];
  assert.ok(animContainer);
  assert.equal(animContainer.animations[0].material_type, 'sticker');

  const val = draft.validate();
  assert.equal(val.ok, true);

  env.cleanup();
});
