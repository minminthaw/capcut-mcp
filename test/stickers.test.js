import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockDraftDir } from './helpers.js';

test('List stickers from asset catalog and cache', async () => {
  const { listStickers } = await import(`../src/core.js?t=${Date.now()}`);
  const stickers = listStickers('', { limit: 10 });
  assert.ok(Array.isArray(stickers), 'returns array of stickers');
});

test('Add sticker to timeline on sticker track with transforms', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const res = draft.addSticker('7083799735387050498', {
    atSec: 2.0,
    durSec: 3.0,
    scale: 0.8,
    posX: 0.5,
    posY: -0.5,
    rotation: 15,
  });

  assert.equal(res.atSec, 2.0);
  assert.equal(res.durSec, 3.0);
  assert.ok(res.segmentId, 'has segment ID');

  const stickerTrack = draft.content.tracks.find(t => t.type === 'sticker');
  assert.ok(stickerTrack, 'created sticker track');
  assert.equal(stickerTrack.segments.length, 1);

  const seg = stickerTrack.segments[0];
  assert.equal(seg.clip.scale.x, 0.8);
  assert.equal(seg.clip.transform.x, 0.5);
  assert.equal(seg.clip.transform.y, -0.5);
  assert.equal(seg.clip.rotation, 15);

  const stickerMats = draft.content.materials.stickers;
  assert.ok(Array.isArray(stickerMats) && stickerMats.length >= 1);
  assert.equal(stickerMats[0].type, 'sticker');

  const val = draft.validate();
  assert.ok(val.ok, 'draft validation passed: ' + JSON.stringify(val.issues));

  env.cleanup();
});
