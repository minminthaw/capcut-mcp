import fs from 'fs';
import path from 'path';
import os from 'os';
import { execSync } from 'child_process';

/**
 * Extract keyframes from video at regular intervals using ffmpeg
 */
export function extractVideoFrames(videoPath, { intervalSec = 2, maxFrames = 30, scaleWidth = 640 } = {}) {
  if (!fs.existsSync(videoPath)) {
    throw new Error(`Source video not found: ${videoPath}`);
  }

  const tmpDir = path.join(os.tmpdir(), `capcut_frames_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`);
  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    const fpsVal = +(1 / Number(intervalSec)).toFixed(4);
    const cmd = `ffmpeg -y -i "${videoPath}" -vf "fps=${fpsVal},scale=${scaleWidth}:-1" -q:v 3 -vframes ${maxFrames} "${tmpDir}/frame_%03d.jpg"`;
    execSync(cmd, { stdio: 'pipe' });

    const files = fs.readdirSync(tmpDir).filter(f => f.endsWith('.jpg')).sort();
    const frames = [];

    for (let i = 0; i < files.length; i++) {
      const fName = files[i];
      const filePath = path.join(tmpDir, fName);
      const timestampSec = +(i * intervalSec).toFixed(2);
      const b64 = fs.readFileSync(filePath).toString('base64');
      frames.push({
        index: i,
        timestampSec,
        filePath,
        base64: b64,
      });
    }

    return {
      tmpDir,
      frames,
      cleanup: () => {
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
      }
    };
  } catch (err) {
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
    throw new Error(`Failed to extract frames with ffmpeg: ${err.message}`);
  }
}

/**
 * Analyze extracted frames using Multimodal AI (Gemini / OpenRouter)
 */
export async function analyzeVideoWithAI(frames, { apiKey, provider = 'gemini', transcript = [] } = {}) {
  const geminiKey = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const openrouterKey = apiKey || process.env.OPENROUTER_API_KEY;

  const promptText = `
You are an expert Autonomous AI Video Director and Cinematographer.
Analyze these chronological video frames extracted from a video with their exact timestamps (seconds).
${transcript.length > 0 ? `Speech Transcript Context: ${JSON.stringify(transcript.slice(0, 50))}` : ''}

For each distinct scene, emotion change, or visual event, produce a structured breakdown.
Identify:
- Time range (startSec to endSec)
- Visual description (actions, facial expressions, camera framing, lighting, gestures)
- Emotion / Tone (e.g. "Sad / Crying", "Excited / High Energy", "Serious / Explaining", "Happy / Laughing", "Neutral Intro")
- Emotion intensity ("low", "medium", "high")
- Visual objects detected (e.g. ["phone", "screen", "laptop", "face_close_up", "tears"])
- Recommended CapCut editing decisions:
  * cameraMove (e.g. "slow_punch_in", "snap_zoom_110", "static")
  * suggestedFilter (e.g. "Vintage 90s", "Cinematic Cool", "Natural Clean", "B&W")
  * suggestedEffects (e.g. ["Soft Vignette", "Subtle Blur", "Edge Glow", "Shake"])
  * suggestedTransition (e.g. "Cross Dissolve", "Bubble Blur", "Flash White", "None")
  * suggestedSfx (e.g. ["whoosh", "pop", "impact", "emotional_piano", "camera_click"])
  * bgmMood (e.g. "emotional", "upbeat", "chill", "tech", "suspense")

Return ONLY valid JSON matching this schema:
{
  "overallMood": "string",
  "summary": "string",
  "scenes": [
    {
      "startSec": 0.0,
      "endSec": 5.0,
      "sceneType": "intro | talking_head | emotional_peak | product_demo | high_energy | outro",
      "visualDescription": "string",
      "emotion": "string",
      "intensity": "low | medium | high",
      "visualObjects": ["string"],
      "suggestedEdits": {
        "cameraMove": "string",
        "suggestedFilter": "string",
        "suggestedEffects": ["string"],
        "suggestedTransition": "string",
        "suggestedSfx": ["string"],
        "bgmMood": "string"
      }
    }
  ]
}
`;

  // 1. Google Gemini API Provider
  if (provider === 'gemini' && geminiKey) {
    try {
      const modelName = opts.model || process.env.GEMINI_MODEL || 'gemini-2.0-flash';
      const parts = [{ text: promptText }];
      const step = Math.max(1, Math.floor(frames.length / 16));
      for (let i = 0; i < frames.length; i += step) {
        const fr = frames[i];
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: fr.base64
          }
        });
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          return JSON.parse(jsonText);
        }
      }
    } catch (err) {
      console.warn('[video-understanding] Gemini API call error:', err.message);
    }
  }

  // 2. OpenRouter API Provider
  if (provider === 'openrouter' || (!geminiKey && openrouterKey)) {
    try {
      const modelName = opts.model || process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';
      const contentParts = [{ type: 'text', text: promptText }];
      const step = Math.max(1, Math.floor(frames.length / 16));
      for (let i = 0; i < frames.length; i += step) {
        const fr = frames[i];
        contentParts.push({
          type: 'image_url',
          image_url: {
            url: `data:image/jpeg;base64,${fr.base64}`
          }
        });
      }

      const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openrouterKey}`
        },
        body: JSON.stringify({
          model: modelName,
          messages: [{ role: 'user', content: contentParts }],
          response_format: { type: 'json_object' }
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        const jsonText = data.choices?.[0]?.message?.content;
        if (jsonText) {
          return JSON.parse(jsonText);
        }
      }
    } catch (err) {
      console.warn('[video-understanding] OpenRouter API call error:', err.message);
    }
  }

  // 3. Fallback heuristic intelligence if offline or no API key provided
  return generateHeuristicSceneMap(frames, transcript);
}

/**
 * Generate a smart heuristic scene map based on frame timing and transcript
 */
export function generateHeuristicSceneMap(frames = [], transcript = []) {
  const maxDur = frames.length > 0 ? frames[frames.length - 1].timestampSec + 2.0 : 60.0;
  const scenes = [];

  const interval = Math.max(5.0, +(maxDur / 4).toFixed(1));
  let curStart = 0;

  while (curStart < maxDur) {
    const curEnd = Math.min(maxDur, +(curStart + interval).toFixed(1));
    const isFirst = curStart === 0;
    const isLast = curEnd >= maxDur;

    scenes.push({
      startSec: curStart,
      endSec: curEnd,
      sceneType: isFirst ? 'intro' : (isLast ? 'outro' : 'talking_head'),
      visualDescription: isFirst ? 'Opening shot, speaker introducing topic directly to camera' :
        (isLast ? 'Concluding remarks, call to action and closing gaze' : 'Main presentation, continuous dialogue with hand gestures'),
      emotion: isFirst ? 'Welcoming / Engaging' : (isLast ? 'Encouraging / Decisive' : 'Informative / Serious'),
      intensity: 'medium',
      visualObjects: ['speaker', 'face_portrait'],
      suggestedEdits: {
        cameraMove: isFirst ? 'static' : 'slow_punch_in',
        suggestedFilter: 'Natural Clean',
        suggestedEffects: [],
        suggestedTransition: isFirst ? 'None' : 'Cross Dissolve',
        suggestedSfx: isFirst ? ['whoosh'] : [],
        bgmMood: 'chill_tech'
      }
    });

    curStart = curEnd;
  }

  return {
    overallMood: 'Informative & Engaging Dialogue',
    summary: 'Talking-head video with direct camera address and continuous storytelling.',
    scenes,
  };
}

/**
 * Semantic query search across timestamped scenes
 */
export function findScenesByQuery(sceneMap, query = '') {
  if (!sceneMap || !Array.isArray(sceneMap.scenes)) return [];

  const q = String(query).toLowerCase().trim();
  const keywords = q.split(/\s+/).filter(Boolean);

  const matched = [];

  for (const sc of sceneMap.scenes) {
    const textBlob = [
      sc.sceneType || '',
      sc.visualDescription || '',
      sc.emotion || '',
      ...(sc.visualObjects || []),
      sc.suggestedEdits?.suggestedFilter || '',
      ...(sc.suggestedEdits?.suggestedEffects || []),
    ].join(' ').toLowerCase();

    // Check direct matches
    let score = 0;
    if (textBlob.includes(q)) score += 10;
    for (const kw of keywords) {
      if (textBlob.includes(kw)) score += 2;
    }

    // Emotion semantic aliases
    if ((q.includes('cry') || q.includes('ငို') || q.includes('sad') || q.includes('tear')) &&
        (textBlob.includes('sad') || textBlob.includes('cry') || textBlob.includes('emotional') || textBlob.includes('tear'))) {
      score += 15;
    }
    if ((q.includes('phone') || q.includes('screen') || q.includes('product') || q.includes('demo') || q.includes('ဖုန်း')) &&
        (textBlob.includes('phone') || textBlob.includes('screen') || textBlob.includes('product') || textBlob.includes('demo'))) {
      score += 15;
    }
    if ((q.includes('excited') || q.includes('energy') || q.includes('shout') || q.includes('ရယ်') || q.includes('happy')) &&
        (textBlob.includes('excited') || textBlob.includes('high_energy') || textBlob.includes('happy') || textBlob.includes('energy'))) {
      score += 15;
    }

    if (score > 0) {
      matched.push({
        ...sc,
        matchScore: score,
      });
    }
  }

  return matched.sort((a, b) => b.matchScore - a.matchScore);
}
