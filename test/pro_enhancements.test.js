import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { createMockDraftDir } from './helpers.js';

test('Auto insert B-Roll cutaways onto overlay track', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const dummyVid = path.join(env.tmpDir, 'dummy_broll.mp4');
  const dummyImg = path.join(env.tmpDir, 'dummy_broll.png');
  fs.writeFileSync(dummyVid, 'fake-mp4');
  fs.writeFileSync(dummyImg, 'fake-png');

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const res = draft.autoInsertBroll([
    { filePath: dummyVid, startSec: 1.0, durSec: 4.0, scale: 1.05 },
    { filePath: dummyImg, startSec: 6.0, durSec: 3.0 }
  ]);

  assert.equal(res.totalInserted, 2);
  assert.ok(res.brollTrackIndex >= 0);

  const val = draft.validate();
  assert.ok(val.ok, 'Validation issues: ' + JSON.stringify(val.issues));

  env.cleanup();
});

test('Add dynamic Hormozi-style word-highlight captions', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  // Non-overlapping with mock template 0-3s text segment
  const res = draft.addDynamicCaptions([
    { text: 'Stop wasting time', startSec: 3.5, durSec: 1.5, isHighlight: true },
    { text: 'Start building AI today', startSec: 5.5, durSec: 2.0, isHighlight: false }
  ], { highlightColor: '#FFE600' });

  assert.equal(res.totalSubtitles, 2);

  const val = draft.validate();
  assert.ok(val.ok, 'Validation issues: ' + JSON.stringify(val.issues));

  env.cleanup();
});

test('Sync cuts or zoom accents to music beat markers', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const res = draft.syncToBeat([1.0, 2.5, 4.0], { action: 'accent_zoom', zoomScale: 1.10 });
  assert.equal(res.totalBeatsSynced, 3);
  assert.equal(res.action, 'accent_zoom');

  const val = draft.validate();
  assert.ok(val.ok);

  env.cleanup();
});

test('Generate structured YouTube and social chapter markers', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  draft.sceneMap = {
    scenes: [
      { startSec: 0.0, sceneType: 'intro', emotion: 'Hook', visualDescription: 'Introduction' },
      { startSec: 15.0, sceneType: 'problem', emotion: 'Frustration', visualDescription: 'Problem Setup' },
      { startSec: 45.0, sceneType: 'demo', emotion: 'Excited', visualDescription: 'Live Solution Demo' }
    ]
  };

  const res = draft.generateChapters();
  assert.equal(res.totalChapters, 3);
  assert.ok(res.formattedText.includes('00:00'));
  assert.ok(res.formattedText.includes('00:15'));
  assert.ok(res.formattedText.includes('00:45'));

  env.cleanup();
});
