import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DRAFTS_DIR } from './core.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');

export function installTemplate(templateName = 'MCP_TEMPLATE_CLEAN') {
  const srcDir = path.join(TEMPLATES_DIR, templateName);
  const targetDir = path.join(DRAFTS_DIR, templateName);

  if (!fs.existsSync(srcDir)) {
    console.log(`[install-template] Bundled template "${templateName}" not found at ${srcDir}`);
    return { ok: false, reason: 'template_not_found' };
  }

  if (!fs.existsSync(DRAFTS_DIR)) {
    fs.mkdirSync(DRAFTS_DIR, { recursive: true });
  }

  const alreadyExists = fs.existsSync(targetDir);
  if (!alreadyExists) {
    fs.mkdirSync(targetDir, { recursive: true });
    fs.cpSync(srcDir, targetDir, { recursive: true });
    console.log(`[install-template] Installed "${templateName}" to ${targetDir}`);
  } else {
    console.log(`[install-template] "${templateName}" already exists in CapCut Drafts at ${targetDir}`);
  }

  // Register in root_meta_info.json if present
  const rootMetaPath = path.join(DRAFTS_DIR, 'root_meta_info.json');
  if (fs.existsSync(rootMetaPath)) {
    try {
      const rootMeta = JSON.parse(fs.readFileSync(rootMetaPath, 'utf8'));
      if (Array.isArray(rootMeta.all_draft_store)) {
        const existIdx = rootMeta.all_draft_store.findIndex(d => d.draft_name === templateName || d.draft_folder_name === templateName);
        const nowUs = Date.now() * 1000;
        if (existIdx === -1) {
          rootMeta.all_draft_store.unshift({
            draft_cloud_capcut_id: '',
            draft_cloud_last_action_download: false,
            draft_cloud_purchase_info: '',
            draft_cloud_template_id: '',
            draft_cloud_tutorial_info: '',
            draft_cloud_videocut_purchase_info: '',
            draft_cover: path.join(targetDir, 'draft_cover.jpg'),
            draft_fold_path: targetDir,
            draft_folder_name: templateName,
            draft_id: 'MCP_TEMPLATE_CLEAN_ID',
            draft_is_ai_creation: false,
            draft_is_ai_packaging: false,
            draft_is_aigc: false,
            draft_is_cloud_merge: false,
            draft_is_invisible: false,
            draft_is_invisible_time: 0,
            draft_is_need_remove_duplicate: false,
            draft_is_offline: false,
            draft_is_pure_camera: false,
            draft_is_reconstruct_project: false,
            draft_is_semi_finished: false,
            draft_is_smart_ads: false,
            draft_is_sub_project: false,
            draft_is_system_template: false,
            draft_is_top: false,
            draft_is_ugc_template: false,
            draft_is_virtual_project: false,
            draft_materials: [],
            draft_name: templateName,
            draft_new_version: '11.1.0',
            draft_open_time: nowUs,
            draft_project_duration: 10000000,
            draft_removable: true,
            draft_root_path: DRAFTS_DIR,
            draft_scale_fps: 30,
            draft_timeline_materials_size_: 0,
            tm_draft_cloud_completed: 0,
            tm_draft_cloud_modified: 0,
            tm_draft_create: nowUs,
            tm_draft_modified: nowUs,
            tm_draft_removed: 0,
            tm_duration: 10000000,
          });
          fs.writeFileSync(rootMetaPath, JSON.stringify(rootMeta, null, 2));
          console.log(`[install-template] Registered "${templateName}" in root_meta_info.json`);
        }
      }
    } catch (err) {
      console.warn('[install-template] Notice: root_meta_info update skipped:', err.message);
    }
  }

  return { ok: true, path: targetDir, alreadyExists };
}

// Direct CLI execution
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  installTemplate();
}
