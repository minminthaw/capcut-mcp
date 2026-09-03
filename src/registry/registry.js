import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isResourceCached, getCachedResourcePath } from './cache.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const catalogPath = path.join(__dirname, 'catalog.json');
const translationsPath = path.join(__dirname, 'translations.json');

let catalogData = null;
let translationsData = null;

// Indexes for rapid O(1) lookup
let byKind = null;
let byEffectId = null;
let byResourceId = null;
let byKeyLower = null;
let byNameLower = null;
let byEnLower = null;

function loadData() {
  if (catalogData) return;
  try {
    catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  } catch (e) {
    catalogData = [];
  }

  try {
    translationsData = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));
  } catch (e) {
    translationsData = {};
  }

  byKind = new Map();
  byEffectId = new Map();
  byResourceId = new Map();
  byKeyLower = new Map();
  byNameLower = new Map();
  byEnLower = new Map();

  for (const item of catalogData) {
    if (!byKind.has(item.kind)) byKind.set(item.kind, []);
    byKind.get(item.kind).push(item);

    if (item.effectId) byEffectId.set(item.effectId, item);
    if (item.resourceId) byResourceId.set(item.resourceId, item);

    const k = item.key.toLowerCase();
    if (!byKeyLower.has(k)) byKeyLower.set(k, item);

    const n = item.name.toLowerCase();
    if (!byNameLower.has(n)) byNameLower.set(n, item);

    if (item.en) {
      const e = item.en.toLowerCase();
      if (!byEnLower.has(e)) byEnLower.set(e, item);
    }
  }
}

/**
 * Normalize string for fuzzy comparison (remove spaces, underscores, hyphens, lowercase).
 */
function normalize(s) {
  return (s || '').toLowerCase().replace(/[\s_\-–—]+/g, '');
}

/**
 * Search the catalog for matching effects, transitions, animations, filters.
 */
export function searchCatalog(query = '', { kind = null, cachedOnly = false, limit = 50 } = {}) {
  loadData();
  const q = (query || '').trim().toLowerCase();
  const qNorm = normalize(q);

  let pool = catalogData;
  if (kind) {
    pool = byKind.get(kind) || [];
  }

  const results = [];
  for (const item of pool) {
    const cached = isResourceCached(item.resourceId);
    if (cachedOnly && !cached) continue;

    if (q) {
      const nameLower = (item.name || '').toLowerCase();
      const keyLower = (item.key || '').toLowerCase();
      const enLower = (item.en || '').toLowerCase();
      const effId = item.effectId || '';
      const resId = item.resourceId || '';

      const match =
        nameLower.includes(q) ||
        keyLower.includes(q) ||
        enLower.includes(q) ||
        effId === q ||
        resId === q ||
        normalize(nameLower).includes(qNorm) ||
        normalize(keyLower).includes(qNorm) ||
        normalize(enLower).includes(qNorm);

      if (!match) continue;
    }

    results.push({
      ...item,
      cached,
      cachedPath: cached ? getCachedResourcePath(item.resourceId) : null,
    });

    if (results.length >= limit * 3) {
      // Collect slightly more before sorting and slicing
      break;
    }
  }

  // Sort cached and non-VIP items first
  results.sort((a, b) => {
    if (a.cached !== b.cached) return a.cached ? -1 : 1;
    if (a.isVip !== b.isVip) return a.isVip ? 1 : -1;
    return 0;
  });

  return results.slice(0, limit);
}

/**
 * Resolve a friendly name, English label, enum key, or effect ID into a specific catalog entry.
 */
export function resolveItem(kind, nameOrId) {
  loadData();
  if (!nameOrId) {
    throw new Error(`Missing effect/transition/animation name or ID for kind: ${kind}`);
  }

  const target = String(nameOrId).trim();
  const targetLower = target.toLowerCase();
  const targetNorm = normalize(target);

  const pool = kind ? (byKind.get(kind) || []) : catalogData;
  if (kind && pool.length === 0) {
    const validKinds = Array.from(byKind.keys()).join(', ');
    throw new Error(`Unknown kind "${kind}". Valid kinds are: ${validKinds}`);
  }

  // 1. Check direct effectId or resourceId match
  for (const item of pool) {
    if (item.effectId === target || item.resourceId === target) {
      return enrichItem(item);
    }
  }

  // 2. Check exact key match
  for (const item of pool) {
    if (item.key.toLowerCase() === targetLower) {
      return enrichItem(item);
    }
  }

  // 3. Check English translation alias
  for (const item of pool) {
    if (item.en && item.en.toLowerCase() === targetLower) {
      return enrichItem(item);
    }
  }

  // 4. Check display name match
  for (const item of pool) {
    if (item.name.toLowerCase() === targetLower) {
      return enrichItem(item);
    }
  }

  // 5. Normalized match (ignoring spaces/hyphens/underscores)
  for (const item of pool) {
    if (
      normalize(item.key) === targetNorm ||
      (item.en && normalize(item.en) === targetNorm) ||
      normalize(item.name) === targetNorm
    ) {
      return enrichItem(item);
    }
  }

  // 6. Substring match within kind
  for (const item of pool) {
    if (
      item.key.toLowerCase().includes(targetLower) ||
      (item.en && item.en.toLowerCase().includes(targetLower)) ||
      item.name.toLowerCase().includes(targetLower) ||
      (item.en && normalize(item.en).includes(targetNorm)) ||
      normalize(item.name).includes(targetNorm)
    ) {
      return enrichItem(item);
    }
  }

  // Suggest closest matches
  const suggestions = pool.slice(0, 5).map(x => x.en ? `${x.name} / ${x.en}` : x.name).join(', ');
  throw new Error(`Could not resolve "${nameOrId}" for kind "${kind}". Try searching with capcut_list_${kind === 'transition' ? 'transitions' : (kind === 'filter' ? 'filters' : (kind.includes('anim') || kind === 'intro' || kind === 'outro' ? 'animations' : 'effects'))}. Examples: ${suggestions}`);
}

function enrichItem(item) {
  const cached = isResourceCached(item.resourceId);
  return {
    ...item,
    cached,
    cachedPath: cached ? getCachedResourcePath(item.resourceId) : null,
  };
}

/**
 * Summary counts per kind and cached total.
 */
export function getCatalogCounts() {
  loadData();
  const counts = {};
  let cachedTotal = 0;
  for (const [k, arr] of byKind.entries()) {
    counts[k] = arr.length;
  }
  for (const item of catalogData) {
    if (isResourceCached(item.resourceId)) {
      cachedTotal++;
    }
  }
  counts._cached_total = cachedTotal;
  return counts;
}

export const CATALOG_KINDS = [
  'video_effect',
  'character_effect',
  'filter',
  'transition',
  'intro',
  'outro',
  'group_anim',
  'text_intro',
  'text_outro',
  'text_loop',
  'audio_effect',
];
