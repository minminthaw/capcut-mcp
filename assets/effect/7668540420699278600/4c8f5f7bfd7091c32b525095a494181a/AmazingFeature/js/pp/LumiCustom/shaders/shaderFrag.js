exports.source=`
//===begin_frag_code===
precision highp float;

// 预定义uniform
uniform sampler2D tDiffuse; // 源纹理
uniform sampler2D tDiffuse1; // 目标纹理
uniform float progress; // = 0.0 [0, 1] // 转场进度
uniform float ratio; // = 1.0 [0.1, 2]

// 自定义uniform
uniform float cellSize; // = 0.09 [0.04, 0.2] // 六边形单元大小
uniform float neonStrength; // = 0.65 [0.0, 1.5] // 霓虹边缘强度
uniform float dispersion; // = 0.35 [0.0, 1.0] // RGB色散强度

varying vec2 vUv; // 纹理坐标

float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float hexSDF(vec2 p, float r) {
    p = abs(p);
    return max(p.x * 0.8660254 + p.y * 0.5, p.y) - r;
}

vec4 transition(vec4 texel1, vec4 texel2, float progress) {
    float t = clamp(progress, 0.0, 1.0);

    vec2 p = vUv - 0.5;
    p.x *= ratio;

    float maxR = length(vec2(0.5 * ratio, 0.5));
    float radial = clamp(length(p) / maxR, 0.0, 1.0);

    vec2 hp = p / cellSize;
    float row = floor(hp.y / 0.8660254 + 0.5);
    float shift = mod(row, 2.0) * 0.5;
    float col = floor(hp.x - shift + 0.5);
    vec2 cellId = vec2(col, row);

    vec2 cellCenter = vec2(col + shift, row * 0.8660254);
    vec2 local = hp - cellCenter;

    float rnd = hash21(cellId);
    float edgePulse = 0.5 + 0.5 * sin((local.x - local.y) * 7.0 + t * 6.2831 + rnd * 6.2831);

    float coverT = smoothstep(0.0, 0.42, t);
    float coverThreshold = 1.0 - radial;
    float arriveBase = smoothstep(-0.08, 0.12, coverT - coverThreshold);
    float bounce = sin(clamp((coverT - coverThreshold) * 8.0, 0.0, 3.14159)) * (1.0 - arriveBase) * 0.08;
    float arrive = clamp(arriveBase + bounce, 0.0, 1.0);

    float coverRadius = mix(0.18, 0.52, arrive);
    float dCover = hexSDF(local, coverRadius);
    float coverMask = smoothstep(0.03, -0.02, dCover) * arrive;

    float flipCell = clamp((t - (0.42 + rnd * 0.06)) / 0.20, 0.0, 1.0);
    float flipPhase = 0.5 - 0.5 * cos(3.1415926 * flipCell);
    float faceMix = smoothstep(0.45, 0.55, flipPhase);

    vec3 neonBase = vec3(0.15, 0.75, 1.0);
    vec3 rgbShift = vec3(
        1.0 + dispersion * local.x * 0.7,
        1.0,
        1.0 - dispersion * local.x * 0.7
    );
    float edge = 1.0 - smoothstep(0.0, 0.05, abs(dCover));
    vec3 neon = neonBase * rgbShift * edge * (0.6 + 0.4 * edgePulse) * neonStrength;

    float revealT = smoothstep(0.62, 1.0, t);
    float departCenterFirst = smoothstep(-0.05, 0.75, revealT - radial * 0.85);
    float endClear = smoothstep(0.92, 1.0, t);
    float depart = max(departCenterFirst, endClear);

    float revealRadius = 0.52 * (1.0 - depart);
    float dReveal = hexSDF(local, revealRadius);
    float revealMask = smoothstep(0.03, -0.02, dReveal) * (1.0 - depart);

    vec4 cellColorFlip = vec4(mix(texel1.rgb, texel2.rgb, faceMix) + neon, mix(texel1.a, texel2.a, faceMix));
    vec4 cellColorA = vec4(texel1.rgb + neon, texel1.a);
    vec4 cellColorB = vec4(texel2.rgb + neon * 0.6, texel2.a);

    float phase1 = 1.0 - smoothstep(0.40, 0.46, t);
    float phase2 = smoothstep(0.40, 0.46, t) * (1.0 - smoothstep(0.60, 0.66, t));
    float phase3 = smoothstep(0.60, 0.66, t);

    vec4 col1 = mix(texel1, cellColorA, coverMask);
    vec4 col2 = mix(texel1, cellColorFlip, smoothstep(0.03, -0.02, hexSDF(local, 0.52)));
    vec4 col3 = mix(texel2, cellColorB, revealMask);

    vec4 outCol = col1 * phase1 + col2 * phase2 + col3 * phase3;
    outCol.rgb = clamp(outCol.rgb, 0.0, 1.0);
    outCol.a = clamp(outCol.a, 0.0, 1.0);

    return mix(texel1, texel2, t) * 0.0 + outCol;
}

void main() {
    // Get the pixel color from both textures
    vec4 texel1 = texture2D(tDiffuse, vUv);
    vec4 texel2 = texture2D(tDiffuse1, vUv);

    // --- Transition Configuration ---
    const float fadeInEnd = 0.1;
    const float fadeOutStart = 0.9;

    // 1. Calculate the transition's own progress.
    float transitionProgress = clamp((progress - fadeInEnd) / (fadeOutStart - fadeInEnd), 0.0, 1.0);
    vec4 transitionColor = transition(texel1, texel2, transitionProgress);

    // 2. Calculate smooth blending factors for the start and end zones.
    float blendInFactor = smoothstep(0.0, fadeInEnd, progress);
    float blendOutFactor = smoothstep(fadeOutStart, 1.0, progress);

    // 3. Apply the blending.
    vec4 finalColor = mix(texel1, transitionColor, blendInFactor);
    finalColor = mix(finalColor, texel2, blendOutFactor);
    
    gl_FragColor = finalColor;
}
//===end_frag_code===
`;