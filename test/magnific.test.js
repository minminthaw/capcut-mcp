import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { createMockDraftDir } from './helpers.js';
import { enhanceWithMagnific } from '../src/magnific.js';

test('Magnific AI enhancer generates fallback visual when offline', async () => {
  const env = createMockDraftDir();
  const outputDir = path.join(env.tmpDir, 'broll');

  const res = await enhanceWithMagnific({
    prompt: 'Futuristic AI data visualization with neon circuits',
    creativity: 30,
    hdr: 60,
    scaleFactor: '4x',
    outputDir
  });

  assert.ok(fs.existsSync(res.filePath));
  assert.equal(res.width, 1920);
  assert.equal(res.height, 1080);
  assert.ok(res.provider);

  env.cleanup();
});

test('CapCutDraft enhanceAndInsertBroll places enhanced asset with Ken Burns zoom', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  const res = await draft.enhanceAndInsertBroll({
    prompt: 'Modern high-tech workspace with dual 4K monitors',
    startSec: 2.0,
    durSec: 4.0,
    creativity: 25,
    hdr: 50,
    kenBurns: true,
    outputDir: path.join(env.tmpDir, 'broll')
  });

  assert.ok(res.segmentId);
  assert.equal(res.startSec, 2.0);
  assert.equal(res.durationSec, 4.0);
  assert.equal(res.kenBurnsApplied, true);

  const val = draft.validate();
  assert.ok(val.ok, 'Validation failed: ' + JSON.stringify(val.issues));

  env.cleanup();
});
