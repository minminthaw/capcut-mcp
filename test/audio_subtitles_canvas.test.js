import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockDraftDir } from './helpers.js';

test('Set audio fade-in and fade-out on audio segment', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const res = draft.setAudioFade(env.seg1Id, { fadeInSec: 1.5, fadeOutSec: 2.0 });
  assert.equal(res.fadeInSec, 1.5);
  assert.equal(res.fadeOutSec, 2.0);

  const fadeMats = draft.content.materials.audio_fades;
  assert.ok(Array.isArray(fadeMats) && fadeMats.length === 1);
  assert.equal(fadeMats[0].fade_in_duration, 1500000);
  assert.equal(fadeMats[0].fade_out_duration, 2000000);

  const val = draft.validate();
  assert.ok(val.ok, 'draft validation passed: ' + JSON.stringify(val.issues));

  env.cleanup();
});

test('Add batch subtitles to text track', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  // Mock template text segment is from 0s to 3s, so non-overlapping subtitles start after 3s
  const subtitles = [
    { startSec: 3.5, durSec: 2.5, text: 'မင်္ဂလာပါ ခင်ဗျာ' },
    { startSec: 6.5, durSec: 3.0, text: 'ဒီနေ့မှာတော့ AI အကြောင်း ပြောပြပါမယ်' },
  ];

  const res = draft.addSubtitlesBatch(subtitles, {
    fontSize: 14,
    color: '#FFE600',
    strokeColor: '#000000',
    posY: -0.8,
  });

  assert.equal(res.totalSubtitles, 2);
  assert.equal(res.subtitles.length, 2);

  const textTrack = draft.content.tracks.find(t => t.type === 'text');
  assert.ok(textTrack, 'text track exists');

  const val = draft.validate();
  assert.ok(val.ok, 'draft validation passed: ' + JSON.stringify(val.issues));

  env.cleanup();
});

test('Set canvas ratio to 9:16 vertical TikTok/Reels', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const res = draft.setCanvas('9:16');
  assert.equal(res.canvas.ratio, '9:16');
  assert.equal(res.canvas.width, 1080);
  assert.equal(res.canvas.height, 1920);

  assert.equal(draft.content.canvas_config.ratio, '9:16');
  assert.equal(draft.content.canvas_config.width, 1080);

  const val = draft.validate();
  assert.ok(val.ok, 'draft validation passed: ' + JSON.stringify(val.issues));

  env.cleanup();
});
