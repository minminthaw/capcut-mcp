import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

/**
 * Resolve the standard or overridden CapCut Cache directories on macOS / Windows.
 */
export function getCacheDirs() {
  const custom = process.env.CAPCUT_CACHE_DIR;
  const candidates = [
    custom,
    path.join(os.homedir(), 'Movies/CapCut/User Data/Cache'),
    path.join(os.homedir(), 'Library/Containers/com.lemon.lvoverseas/Data/Movies/CapCut/User Data/Cache'),
    path.join(os.homedir(), 'AppData/Local/CapCut/User Data/Cache'),
  ].filter(Boolean);

  return candidates.filter(dir => {
    try {
      return fs.statSync(dir).isDirectory();
    } catch {
      return false;
    }
  });
}

/**
 * Resolve the effect cache directory (where downloaded effect resource subfolders live).
 */
export function getEffectCacheDirs() {
  return getCacheDirs().map(c => path.join(c, 'effect')).filter(d => {
    try {
      return fs.statSync(d).isDirectory();
    } catch {
      return false;
    }
  });
}

/**
 * Check if CapCut Desktop is currently running.
 * macOS uses pgrep / ps; Windows uses tasklist.
 */
export function isCapCutRunning() {
  if (process.env.CAPCUT_MOCK_RUNNING !== undefined) {
    return process.env.CAPCUT_MOCK_RUNNING === 'true' || process.env.CAPCUT_MOCK_RUNNING === '1';
  }

  if (process.platform === 'darwin') {
    try {
      const pgrep = execSync('pgrep -x CapCut || pgrep -i CapCut', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
      if (pgrep) return true;
    } catch {}
    try {
      const ps = execSync('ps -ax -o comm', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      return /CapCut\.app\/Contents\/MacOS\/CapCut/i.test(ps);
    } catch {
      return false;
    }
  }

  if (process.platform === 'win32') {
    try {
      return /CapCut\.exe/i.test(execSync('tasklist /FI "IMAGENAME eq CapCut.exe" /NH', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
    } catch {
      return false;
    }
  }

  return false;
}
