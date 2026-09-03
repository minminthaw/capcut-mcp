import test from 'node:test';
import assert from 'node:assert/strict';
import { searchCatalog, resolveItem, getCatalogCounts } from '../src/registry/registry.js';

test('Catalog loads and indexes thousands of entries', () => {
  const counts = getCatalogCounts();
  assert.ok(counts.transition > 1000, `Transitions count: ${counts.transition}`);
  assert.ok(counts.video_effect > 1500, `Video effects count: ${counts.video_effect}`);
  assert.ok(counts.filter > 400, `Filters count: ${counts.filter}`);
  assert.ok(counts.intro > 200, `Intro animations count: ${counts.intro}`);
});

test('Search transitions by English and Chinese names', () => {
  const enResults = searchCatalog('Cross Dissolve', { kind: 'transition' });
  assert.ok(enResults.length > 0, 'Found Cross Dissolve');
  assert.equal(enResults[0].name, '叠化');

  const cnResults = searchCatalog('叠化', { kind: 'transition' });
  assert.ok(cnResults.length > 0, 'Found 叠化');
  assert.equal(cnResults[0].effectId, '6724845717472416269');
});

test('Resolve transitions by ID, key, English label, and Chinese name', () => {
  const byEn = resolveItem('transition', 'Cross Dissolve');
  assert.equal(byEn.name, '叠化');

  const byCn = resolveItem('transition', '叠化');
  assert.equal(byCn.effectId, '6724845717472416269');

  const byId = resolveItem('transition', '6724845717472416269');
  assert.equal(byId.name, '叠化');

  const byKey = resolveItem('transition', '叠化');
  assert.equal(byKey.effectId, '6724845717472416269');
});

test('Search effects and resolve with parameters', () => {
  const results = searchCatalog('Beat Shots', { kind: 'video_effect' });
  assert.ok(results.length > 0, 'Found Beat Shots');
  assert.ok(results[0].params && results[0].params.length > 0, 'Has effect params');

  const resolved = resolveItem('video_effect', 'Beat Shots');
  assert.equal(resolved.key, 'Beat_Shots');
});

test('Search color filters', () => {
  const filters = searchCatalog('Vintage 90s', { kind: 'filter' });
  assert.ok(filters.length > 0, 'Found Vintage 90s');

  const bw = resolveItem('filter', 'BW 2');
  assert.equal(bw.key, 'BW_2');
});

test('Search animations (intro, outro, loop, text)', () => {
  const intros = searchCatalog('Zoom In', { kind: 'intro' });
  assert.ok(intros.length > 0, 'Found zoom intro animations');

  const textIntros = searchCatalog('放大', { kind: 'text_intro' });
  assert.ok(textIntros.length > 0, 'Found text intro');
});

test('Unknown name throws informative error with suggestions', () => {
  assert.throws(
    () => resolveItem('transition', 'non_existent_crazy_transition_xyz123'),
    /Could not resolve "non_existent_crazy_transition_xyz123"/
  );
});
