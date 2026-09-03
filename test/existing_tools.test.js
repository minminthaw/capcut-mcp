import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockDraftDir } from './helpers.js';

test('Existing tools regression: move, trim, split, delete, setProps, rawPatch, validate, save', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft, cloneDraft, listDrafts } = await import(`../src/core.js?t=${Date.now()}`);

  // 1. List drafts
  const drafts = listDrafts();
  assert.ok(drafts.some(d => d.name === env.draftName), 'listDrafts finds created draft');

  // 2. Clone draft
  const clonedName = 'test_draft_clone';
  cloneDraft(env.draftName, clonedName);
  const draft = new CapCutDraft(clonedName);

  // 3. Move segment
  const moveRes = draft.moveSegment(env.seg1Id, 1000000);
  assert.equal(moveRes.atSec, 1.0);

  // 4. Trim segment
  const trimRes = draft.trimSegment(env.seg1Id, { atUs: 500000, durUs: 3000000 });
  assert.equal(trimRes.segmentId, env.seg1Id);

  // 5. Split segment
  const splitRes = draft.splitSegment(env.seg2Id, 7000000);
  assert.ok(splitRes.left && splitRes.right, 'splitSegment returns left and right IDs');

  // 6. Set props
  const propsRes = draft.setProps(splitRes.left, { scale: 1.1, opacity: 0.9, speed: 1.2 });
  assert.ok(propsRes.applied.includes('scale'));

  // 7. Delete segment
  const delRes = draft.deleteSegment(splitRes.right);
  assert.equal(delRes.deleted, splitRes.right);

  // 8. Raw patch
  const patchRes = draft.rawPatch({ duration: 12000000 });
  assert.equal(patchRes.ok, true);

  // 9. Validate
  const val = draft.validate();
  assert.equal(val.ok, true, `Validation failed: ${val.issues.join(', ')}`);

  // 10. Save
  const saveRes = draft.save({ force: true });
  assert.equal(saveRes.saved, clonedName);

  env.cleanup();
});
