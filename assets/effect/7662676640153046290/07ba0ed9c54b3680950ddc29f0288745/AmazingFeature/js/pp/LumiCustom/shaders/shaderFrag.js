exports.source=`
//===begin_frag_code===
precision highp float;

// 预定义uniform
uniform sampler2D tDiffuse; // 源纹理
uniform sampler2D tDiffuse1; // 目标纹理
uniform float progress; // = 0.0 [0.0, 1.0]
uniform float ratio; // = 1.0 [0.1, 2.0]

// 可调参数
uniform float gridCount; // = 12.0 [6.0, 24.0] // 蜂巢网格密度
uniform float glowIntensity; // = 1.1 [0.0, 2.0] // 霓虹溢出强度
uniform float aberration; // = 0.004 [0.0, 0.02] // RGB分离强度

varying vec2 vUv; // 纹理坐标

float sdHexagon(vec2 p, float r) {
    p = abs(p);
    return max(dot(p, normalize(vec2(1.0, 1.7320508))), p.x) - r;
}

vec4 transition(vec4 texel1, vec4 texel2, float progress) {
    if (progress <= 0.0) return texel1;
    if (progress >= 1.0) return texel2;

    float p = smoothstep(0.0, 1.0, progress);

    vec2 uvA = vec2(vUv.x * ratio, vUv.y);
    float cells = max(2.0, gridCount);

    float sx = ratio / cells;
    float sy = 0.8660254 / cells;

    vec2 g = vec2(uvA.x / sx, uvA.y / sy);

    vec2 idA = floor(g);
    vec2 cA = vec2((idA.x + 0.5) * sx, (idA.y + 0.5) * sy);

    vec2 gB = vec2((uvA.x - 0.5 * sx) / sx, (uvA.y - 0.5 * sy) / sy);
    vec2 idB = floor(gB);
    vec2 cB = vec2((idB.x + 1.0) * sx, (idB.y + 1.0) * sy);

    float dA = length(uvA - cA);
    float dB = length(uvA - cB);

    vec2 center = (dA < dB) ? cA : cB;

    float hexR = 0.48 * sy;
    float d = sdHexagon(uvA - center, hexR);

    float cellMask = smoothstep(0.01 * sy, -0.01 * sy, d);
    float edge = exp(-48.0 * abs(d) / max(sy, 1e-4)) * cellMask;

    float wave = (center.x + (1.0 - center.y)) / (ratio + 1.0);
    wave = clamp(wave, 0.0, 1.0);

    float tIn = clamp((p - wave * 0.32) / 0.30, 0.0, 1.0);
    float tOut = clamp((p - 0.50 - wave * 0.32) / 0.30, 0.0, 1.0);
    float flash = tIn * (1.0 - tOut);

    float peak = exp(-pow((p - 0.5) / 0.11, 2.0));
    vec2 off = vec2(aberration * peak, 0.0);

    vec3 bSplit = vec3(
        texture2D(tDiffuse1, vUv + off).r,
        texture2D(tDiffuse1, vUv).g,
        texture2D(tDiffuse1, vUv - off).b
    );

    vec3 neonA = vec3(0.58, 0.18, 1.00);
    vec3 neonB = vec3(0.12, 0.72, 1.00);
    vec3 neon = mix(neonA, neonB, fract(wave * 5.0));

    vec3 base = mix(texel1.rgb, bSplit, cellMask * tOut);
    float over = cellMask * flash;
    vec3 glow = neon * (0.45 + 0.95 * peak) * over * glowIntensity + neon * edge * 0.25 * glowIntensity;

    vec3 color = clamp(base + glow, 0.0, 1.0);
    return vec4(color, mix(texel1.a, texel2.a, tOut * cellMask));
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