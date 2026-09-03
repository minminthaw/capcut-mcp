exports.source=`
//===begin_frag_code===
precision highp float;

// 预定义uniform
uniform sampler2D tDiffuse; // 源纹理
uniform sampler2D tDiffuse1; // 目标纹理
uniform float progress; // = 0.0 [0.0, 1.0]
uniform float ratio; // = 1.0 [0.1, 2.0]

uniform float glitchAmount; // = 0.75 [0.0, 1.0] // RGB错位与故障强度
uniform float shardDelay; // = 0.22 [0.0, 0.35] // 碎片错落延迟上限
uniform float neonIntensity; // = 0.65 [0.0, 1.0] // 霓虹边缘与闪曝强度

varying vec2 vUv; // 纹理坐标

float hash11(float p) {
    return fract(sin(p * 127.1) * 43758.5453123);
}

float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

vec3 toGray(vec3 c) {
    float g = dot(c, vec3(0.299, 0.587, 0.114));
    return vec3(g);
}

vec2 getSeed(int i) {
    if (i == 0) return vec2(0.14, 0.16);
    if (i == 1) return vec2(0.33, 0.12);
    if (i == 2) return vec2(0.57, 0.15);
    if (i == 3) return vec2(0.83, 0.18);
    if (i == 4) return vec2(0.18, 0.38);
    if (i == 5) return vec2(0.41, 0.36);
    if (i == 6) return vec2(0.67, 0.40);
    if (i == 7) return vec2(0.86, 0.44);
    if (i == 8) return vec2(0.13, 0.71);
    if (i == 9) return vec2(0.36, 0.78);
    if (i == 10) return vec2(0.61, 0.74);
    return vec2(0.84, 0.80);
}

vec4 transition(vec4 texel1, vec4 texel2, float progress) {
    if (progress <= 0.0) return texel1;
    if (progress >= 1.0) return texel2;

    float p = smoothstep(0.0, 1.0, progress);
    vec2 uv = vUv;

    float aPhase = 1.0 - smoothstep(0.0, 0.28, p);
    vec2 splitA = vec2(0.018, 0.010) * glitchAmount * aPhase;
    float rA = texture2D(tDiffuse, uv + splitA).r;
    float gA = texel1.g;
    float bA = texture2D(tDiffuse, uv - splitA).b;
    vec3 aCol = vec3(rA, gA, bA);
    vec3 aGray = toGray(aCol);
    aCol = mix(aCol, aGray, 0.85 * aPhase);
    aCol += vec3(1.0, 0.35, 0.90) * (0.45 * aPhase * neonIntensity);
    aCol = clamp(aCol, 0.0, 1.0);

    float bRecover = smoothstep(0.82, 1.0, p);
    float bGrayAmt = 1.0 - bRecover;
    float bGlitch = 1.0 - smoothstep(0.72, 0.98, p);
    vec2 splitB = vec2(-0.012, 0.008) * glitchAmount * bGlitch;
    float rB = texture2D(tDiffuse1, uv + splitB).r;
    float gB = texel2.g;
    float bB = texture2D(tDiffuse1, uv - splitB).b;
    vec3 bCol = vec3(rB, gB, bB);
    bCol = mix(bCol, toGray(bCol), bGrayAmt);

    float cyanFlash = smoothstep(0.84, 0.92, p) * (1.0 - smoothstep(0.92, 0.99, p));
    bCol += vec3(0.18, 0.95, 1.0) * (0.55 * cyanFlash * neonIntensity);
    bCol = clamp(bCol, 0.0, 1.0);

    float minD = 1e5;
    int cellId = 0;
    vec2 cellSeed = vec2(0.5);

    for (int i = 0; i < 12; i++) {
        vec2 s = getSeed(i);
        vec2 d = uv - s;
        d.x *= ratio;
        float dd = dot(d, d);
        if (dd < minD) {
            minD = dd;
            cellId = i;
            cellSeed = s;
        }
    }

    float idf = float(cellId);
    float delay = hash11(idf * 13.37 + 1.7) * shardDelay;
    float localP = clamp((p - delay) / max(0.001, 1.0 - delay), 0.0, 1.0);

    vec2 dv = uv - cellSeed;
    dv.x *= ratio;

    float cellScale = 0.34 + 0.18 * hash11(idf * 7.91 + 0.3);
    float angle = atan(dv.y, dv.x);
    float sector = floor((angle + 3.1415926) / 0.5235988);
    float jag = (hash11(idf * 5.13 + sector * 1.77) - 0.5) * 0.20;

    float dNorm = length(dv) / cellScale + jag;
    dNorm = max(dNorm, 0.0);

    float threshold = 1.0 - localP;
    float keepA = 1.0 - smoothstep(threshold - 0.035, threshold + 0.035, dNorm);

    vec3 col = mix(bCol, aCol, keepA);

    float edge = 1.0 - smoothstep(0.0, 0.05, abs(dNorm - threshold));
    float n = hash21(uv * vec2(420.0, 260.0) + vec2(idf * 0.17, p * 97.0));
    float edgeActive = step(0.001, localP) * (1.0 - step(0.999, localP));
    vec3 neon = mix(vec3(1.0, 0.15, 0.8), vec3(0.2, 0.9, 1.0), n);
    col += neon * edge * n * (0.45 * neonIntensity) * edgeActive;

    col = clamp(col, 0.0, 1.0);
    return vec4(col, mix(texel1.a, texel2.a, p));
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