import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getEffectCacheDirs } from './macos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const BUNDLED_ASSETS_DIR = path.join(__dirname, '../assets/effect');

/**
 * Scan CapCut's local cache on macOS and automatically copy all downloaded
 * effect/transition packages into the persistent capcut-mcp-custom/assets/ folder.
 */
export function syncAssetsFromCache() {
  if (!fs.existsSync(BUNDLED_ASSETS_DIR)) {
    fs.mkdirSync(BUNDLED_ASSETS_DIR, { recursive: true });
  }

  const cacheDirs = getEffectCacheDirs();
  let copiedCount = 0;
  const index = [];

  for (const cDir of cacheDirs) {
    let ids = [];
    try {
      ids = fs.readdirSync(cDir);
    } catch {
      continue;
    }

    for (const id of ids) {
      const srcIdDir = path.join(cDir, id);
      try {
        if (!fs.statSync(srcIdDir).isDirectory()) continue;
        const subdirs = fs.readdirSync(srcIdDir);

        for (const sub of subdirs) {
          if (sub.endsWith('_tmp')) continue;
          const srcSub = path.join(srcIdDir, sub);
          const cfgPath = path.join(srcSub, 'config.json');

          if (fs.existsSync(cfgPath)) {
            const dstIdDir = path.join(BUNDLED_ASSETS_DIR, id);
            const dstSub = path.join(dstIdDir, sub);

            if (!fs.existsSync(dstSub)) {
              fs.mkdirSync(dstIdDir, { recursive: true });
              copyDirRecursive(srcSub, dstSub);
              copiedCount++;
            }

            // Read config metadata for index
            try {
              const cfg = JSON.parse(fs.readFileSync(path.join(dstSub, 'config.json'), 'utf8'));
              index.push({
                resourceId: id,
                hash: sub,
                name: cfg.name || cfg.effect?.name || '',
                type: cfg.type || cfg.effect?.type || '',
                path: dstSub.replace(/\\/g, '/'),
              });
            } catch {}
          }
        }
      } catch {}
    }
  }

  // Write index
  const indexPath = path.join(__dirname, '../assets/assets_index.json');
  try {
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  } catch {}

  return { copiedCount, totalBundled: index.length, assetsDir: BUNDLED_ASSETS_DIR };
}

export function getAssetsIndex() {
  const indexPath = path.join(__dirname, '../assets/assets_index.json');
  try {
    if (fs.existsSync(indexPath)) {
      return JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    }
  } catch {}
  return [];
}

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

// CLI execution
if (process.argv[1] && process.argv[1].endsWith('sync_assets.js')) {
  console.log('Syncing CapCut cached assets to persistent MCP assets folder...');
  const res = syncAssetsFromCache();
  console.log(`Synced ${res.copiedCount} new assets. Total bundled assets in MCP: ${res.totalBundled}`);
  console.log(`Saved to: ${res.assetsDir}`);
}
