import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getEffectCacheDirs } from '../macos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BUNDLED_ASSETS_DIR = path.join(__dirname, '../../assets/effect');

const cacheMap = new Map(); // resourceId -> localPath or false

function copyDirRecursive(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const item of fs.readdirSync(src)) {
    const s = path.join(src, item);
    const d = path.join(dst, item);
    const st = fs.statSync(s);
    if (st.isDirectory()) {
      copyDirRecursive(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

/**
 * Find the local on-disk resource path for a given resourceId.
 * Prioritizes persistent bundled assets in capcut-mcp-custom/assets/effect/
 * and auto-copies newly downloaded assets from CapCut's cache into assets/effect/.
 */
export function getCachedResourcePath(resourceId) {
  if (!resourceId) return null;
  const idStr = String(resourceId);
  if (cacheMap.has(idStr)) {
    const cached = cacheMap.get(idStr);
    return cached === false ? null : cached;
  }

  // 1. Check persistent bundled assets in capcut-mcp-custom/assets/effect/
  const bundledItemDir = path.join(BUNDLED_ASSETS_DIR, idStr);
  try {
    if (fs.statSync(bundledItemDir).isDirectory()) {
      for (const sub of fs.readdirSync(bundledItemDir)) {
        const fullSub = path.join(bundledItemDir, sub);
        const cfg = path.join(fullSub, 'config.json');
        if (fs.existsSync(cfg)) {
          const normalized = fullSub.replace(/\\/g, '/');
          cacheMap.set(idStr, normalized);
          return normalized;
        }
      }
    }
  } catch {}

  // 2. Check CapCut's live cache and auto-copy to persistent MCP folder
  const effectDirs = getEffectCacheDirs();
  for (const effDir of effectDirs) {
    const itemDir = path.join(effDir, idStr);
    try {
      if (fs.statSync(itemDir).isDirectory()) {
        const subdirs = fs.readdirSync(itemDir);
        for (const sub of subdirs) {
          if (sub.endsWith('_tmp')) continue;
          const fullSub = path.join(itemDir, sub);
          const cfg = path.join(fullSub, 'config.json');
          if (fs.existsSync(cfg)) {
            // Auto-copy to persistent MCP assets folder
            try {
              const dstDir = path.join(BUNDLED_ASSETS_DIR, idStr, sub);
              if (!fs.existsSync(dstDir)) {
                copyDirRecursive(fullSub, dstDir);
              }
              const normalized = dstDir.replace(/\\/g, '/');
              cacheMap.set(idStr, normalized);
              return normalized;
            } catch {
              const normalized = fullSub.replace(/\\/g, '/');
              cacheMap.set(idStr, normalized);
              return normalized;
            }
          }
        }
      }
    } catch {}
  }

  cacheMap.set(idStr, false);
  return null;
}

/**
 * Check if a given resourceId is cached locally.
 */
export function isResourceCached(resourceId) {
  return !!getCachedResourcePath(resourceId);
}

/**
 * Clear memory cache (useful for testing or cache refresh).
 */
export function clearResourceCache() {
  cacheMap.clear();
}
