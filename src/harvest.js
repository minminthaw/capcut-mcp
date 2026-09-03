import fs from 'fs';
import path from 'path';
import { isResourceCached } from './registry/cache.js';
import { searchCatalog } from './registry/registry.js';

const MATERIAL_KEYS = {
  effects: 'filter/adjust',
  filters: 'filter',
  video_effects: 'video_effect',
  transitions: 'transition',
  material_animations: 'animation',
};

/**
 * Scan all drafts in draftsDir in read-only mode and extract used effect/transition/filter materials.
 */
export function harvestUsedMaterials(draftsDir) {
  const used = new Map();
  const counts = new Map();

  if (!draftsDir || !fs.existsSync(draftsDir)) {
    return [];
  }

  let draftFolders = [];
  try {
    draftFolders = fs.readdirSync(draftsDir).filter(name => {
      try {
        const p = path.join(draftsDir, name);
        return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'draft_content.json'));
      } catch {
        return false;
      }
    });
  } catch {
    return [];
  }

  for (const name of draftFolders) {
    const contentPath = path.join(draftsDir, name, 'draft_content.json');
    try {
      const data = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
      const mats = data.materials || {};

      for (const [key, kindLabel] of Object.entries(MATERIAL_KEYS)) {
        const arr = mats[key];
        if (!Array.isArray(arr)) continue;

        for (const item of arr) {
          if (!item || typeof item !== 'object') continue;
          const eid = String(item.effect_id || '');
          const rid = String(item.resource_id || '');
          const itemName = item.name || item.material_name || '';

          if (!eid && !rid && !itemName) continue;

          const ukey = eid || rid || `name:${itemName}`;
          counts.set(ukey, (counts.get(ukey) || 0) + 1);

          if (!used.has(ukey)) {
            used.set(ukey, {
              name: itemName,
              effectId: eid,
              resourceId: rid,
              kind: kindLabel,
              type: item.type || '',
              cached: isResourceCached(rid),
              rawTemplate: item,
            });
          }
        }
      }
    } catch {
      // Ignore unparseable or locked drafts safely
    }
  }

  const results = [];
  for (const [ukey, rec] of used.entries()) {
    rec.useCount = counts.get(ukey) || 1;
    // Check if present in static catalog
    const catalogMatches = rec.effectId ? searchCatalog(rec.effectId, { limit: 1 }) : [];
    rec.inCatalog = catalogMatches.length > 0;
    results.push(rec);
  }

  results.sort((a, b) => b.useCount - a.useCount);
  return results;
}

/**
 * CLI execution for standalone harvesting inspection
 */
if (process.argv[1] && process.argv[1].endsWith('harvest.js')) {
  const targetDir = process.env.CAPCUT_DRAFTS_DIR || path.join(process.env.HOME || '', 'Movies/CapCut/User Data/Projects/com.lveditor.draft');
  console.log(`Harvesting drafts from: ${targetDir}`);
  const items = harvestUsedMaterials(targetDir);
  console.log(`Found ${items.length} unique used materials across drafts.`);
  for (const it of items.slice(0, 10)) {
    console.log(` - [${it.kind}] ${it.name || it.effectId || it.resourceId} (uses: ${it.useCount}, cached: ${it.cached}, inCatalog: ${it.inCatalog})`);
  }
}
