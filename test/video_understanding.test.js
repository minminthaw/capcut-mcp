import test from 'node:test';
import assert from 'node:assert/strict';
import { createMockDraftDir } from './helpers.js';
import { generateHeuristicSceneMap, findScenesByQuery } from '../src/video_understanding.js';

test('Heuristic scene map generator produces structured scenes', () => {
  const mockFrames = [
    { index: 0, timestampSec: 0.0 },
    { index: 1, timestampSec: 2.0 },
    { index: 2, timestampSec: 4.0 },
    { index: 3, timestampSec: 6.0 },
    { index: 4, timestampSec: 8.0 },
    { index: 5, timestampSec: 10.0 },
  ];

  const map = generateHeuristicSceneMap(mockFrames);
  assert.ok(Array.isArray(map.scenes));
  assert.ok(map.scenes.length > 0);
  assert.equal(typeof map.overallMood, 'string');

  const firstScene = map.scenes[0];
  assert.equal(firstScene.startSec, 0);
  assert.ok(firstScene.endSec > 0);
  assert.ok(firstScene.suggestedEdits);
});

test('Semantic scene search matches emotional and visual queries', () => {
  const customMap = {
    overallMood: 'Emotional Storytelling',
    scenes: [
      {
        startSec: 0.0,
        endSec: 5.0,
        sceneType: 'intro',
        visualDescription: 'Speaker intro shot',
        emotion: 'Neutral Intro',
        visualObjects: ['speaker'],
        suggestedEdits: { suggestedFilter: 'Natural Clean', suggestedEffects: [] }
      },
      {
        startSec: 5.0,
        endSec: 15.0,
        sceneType: 'emotional_peak',
        visualDescription: 'Speaker in tears, crying and speaking passionately about family',
        emotion: 'Sad / Crying / Emotional',
        visualObjects: ['face_close_up', 'tears'],
        suggestedEdits: { suggestedFilter: 'Vintage 90s', suggestedEffects: ['Soft Vignette'] }
      },
      {
        startSec: 15.0,
        endSec: 25.0,
        sceneType: 'product_demo',
        visualDescription: 'Demonstrating new smartphone features on desk',
        emotion: 'Excited',
        visualObjects: ['phone', 'laptop'],
        suggestedEdits: { suggestedFilter: 'Clear Pop', suggestedEffects: [] }
      }
    ]
  };

  // Search for crying / emotional scene
  const cryingMatches = findScenesByQuery(customMap, 'ငိုနေတဲ့ အပိုင်း');
  assert.ok(cryingMatches.length > 0);
  assert.equal(cryingMatches[0].startSec, 5.0);

  // Search for phone / product demo
  const phoneMatches = findScenesByQuery(customMap, 'phone demo');
  assert.ok(phoneMatches.length > 0);
  assert.equal(phoneMatches[0].startSec, 15.0);
});

test('Apply semantic edit directly to CapCutDraft', async () => {
  const env = createMockDraftDir();
  process.env.CAPCUT_DRAFTS_DIR = env.tmpDir;

  const { CapCutDraft } = await import(`../src/core.js?t=${Date.now()}`);
  const draft = new CapCutDraft(env.draftName);

  // Provide custom scene map
  draft.sceneMap = {
    overallMood: 'Drama',
    scenes: [
      {
        startSec: 0.0,
        endSec: 5.0,
        sceneType: 'emotional_peak',
        visualDescription: 'Crying scene with tears',
        emotion: 'Sad / Crying',
        visualObjects: ['tears'],
        suggestedEdits: { suggestedFilter: 'BW 2', suggestedEffects: ['Vignette'] }
      }
    ]
  };

  const res = draft.applySemanticEdit('crying', 'filter');
  assert.ok(res.ok);
  assert.equal(res.action, 'filter');
  assert.equal(res.matchedScene.startSec, 0.0);

  const val = draft.validate();
  assert.ok(val.ok);

  env.cleanup();
});
