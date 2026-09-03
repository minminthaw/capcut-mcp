import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

const uid = () => crypto.randomUUID().toUpperCase();
const US = 1e6;

/**
 * Create a minimal valid CapCut draft directory in a temporary folder for isolated testing.
 */
export function createMockDraftDir() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'capcut_test_'));
  const draftName = 'test_draft';
  const draftFolder = path.join(tmpDir, draftName);
  fs.mkdirSync(draftFolder, { recursive: true });

  const videoMatId = uid();
  const textMatId = uid();
  const speedMatId = uid();
  const canvasMatId = uid();

  const seg1Id = uid();
  const seg2Id = uid();
  const textSegId = uid();

  const mockContent = {
    canvas_config: { height: 1080, ratio: '16:9', width: 1920 },
    duration: 10 * US,
    fps: 30,
    id: uid(),
    materials: {
      videos: [
        {
          id: videoMatId,
          type: 'video',
          path: path.join(tmpDir, 'mock_video.mp4'),
          material_name: 'mock_video.mp4',
          duration: 10 * US,
          width: 1920,
          height: 1080,
        },
      ],
      texts: [
        {
          id: textMatId,
          type: 'text',
          content: JSON.stringify({
            text: 'Test Subtitle',
            styles: [{ fill: { content: { solid: { color: [1, 1, 1] } } }, range: [0, 13], size: 15 }],
          }),
        },
      ],
      audios: [],
      transitions: [],
      video_effects: [],
      effects: [],
      material_animations: [],
      speeds: [
        { id: speedMatId, mode: 0, speed: 1.0, type: 'speed' },
      ],
      canvases: [
        { id: canvasMatId, type: 'canvas_color', color: '#00000000' },
      ],
      tracks: [],
    },
    tracks: [
      {
        attribute: 0,
        flag: 0,
        id: uid(),
        is_default_name: true,
        name: 'video track',
        type: 'video',
        segments: [
          {
            clip: { alpha: 1, flip: { horizontal: false, vertical: false }, rotation: 0, scale: { x: 1, y: 1 }, transform: { x: 0, y: 0 } },
            extra_material_refs: [speedMatId, canvasMatId],
            id: seg1Id,
            material_id: videoMatId,
            render_index: 0,
            source_timerange: { duration: 5 * US, start: 0 },
            target_timerange: { duration: 5 * US, start: 0 },
            track_render_index: 0,
            volume: 1.0,
          },
          {
            clip: { alpha: 1, flip: { horizontal: false, vertical: false }, rotation: 0, scale: { x: 1, y: 1 }, transform: { x: 0, y: 0 } },
            extra_material_refs: [speedMatId, canvasMatId],
            id: seg2Id,
            material_id: videoMatId,
            render_index: 1,
            source_timerange: { duration: 5 * US, start: 0 },
            target_timerange: { duration: 5 * US, start: 5 * US },
            track_render_index: 0,
            volume: 1.0,
          },
        ],
      },
      {
        attribute: 0,
        flag: 0,
        id: uid(),
        is_default_name: true,
        name: 'text track',
        type: 'text',
        segments: [
          {
            clip: { alpha: 1, flip: { horizontal: false, vertical: false }, rotation: 0, scale: { x: 1, y: 1 }, transform: { x: 0, y: 0 } },
            extra_material_refs: [],
            id: textSegId,
            material_id: textMatId,
            render_index: 2,
            source_timerange: { duration: 3 * US, start: 0 },
            target_timerange: { duration: 3 * US, start: 0 },
            track_render_index: 1,
          },
        ],
      },
    ],
  };

  fs.writeFileSync(path.join(draftFolder, 'draft_content.json'), JSON.stringify(mockContent, null, 2));

  // Create a dummy video file so validation of media file doesn't complain
  fs.writeFileSync(path.join(tmpDir, 'mock_video.mp4'), 'dummy-video-content');

  return {
    tmpDir,
    draftName,
    draftFolder,
    seg1Id,
    seg2Id,
    textSegId,
    cleanup: () => {
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch {}
    },
  };
}
