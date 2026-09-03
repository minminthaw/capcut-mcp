exports.source=`
//===begin_frag_code===
precision highp float;

// 预定义uniform
uniform sampler2D tDiffuse; // 源纹理
uniform float progress; // = 0.0 [0, 1] // 画面特效和转场类型声明，其它类型无需指定该参数
uniform float ratio; // = 1.0 [0.1, 2]
uniform sampler2D tDiffuse1; // 第二输入纹理（转场类型必需）

uniform float flashStrength; // = 0.75 [0.0, 1.5] // 闪回冲击强度
uniform float grainAmount; // = 0.03 [0.0, 0.2] // 颗粒强度

varying vec2 vUv; // 纹理坐标

float cubicInOut(float x) {
    return (x < 0.5) ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) * 0.5;
}

float luma(vec3 c) {
    return dot(c, vec3(0.299, 0.587, 0.114));
}

vec3 setSaturation(vec3 c, float s) {
    float g = luma(c);
    return mix(vec3(g), c, s);
}

vec2 clampUv(vec2 uv) {
    return clamp(uv, vec2(0.001), vec2(0.999));
}

float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

vec4 transition(vec4 texel1, vec4 texel2, float progress) {
    if (progress <= 0.0) return texel1;
    if (progress >= 1.0) return texel2;

    float p = cubicInOut(progress);

    float k1 = smoothstep(0.0, 0.0625, p);
    float k2 = smoothstep(0.0625, 0.1375, p);
    float k3 = smoothstep(0.1375, 0.5, p);
    float k4 = smoothstep(0.5, 0.775, p);
    float k5 = smoothstep(0.775, 0.925, p);
    float k6 = smoothstep(0.925, 1.0, p);

    vec2 uv = vUv;
    vec2 center = vec2(0.5);
    vec2 d = uv - center;
    vec2 dAspect = vec2(d.x * ratio, d.y);
    float r = length(dAspect);

    float shock = smoothstep(0.08, 0.1375, p) * (1.0 - smoothstep(0.1375, 0.22, p));
    vec2 jitter = vec2(
        (hash21(uv * 97.1 + p * 31.7) - 0.5),
        (hash21(uv * 83.4 + p * 19.3) - 0.5)
    ) * 0.008 * shock * flashStrength;

    float stretch = 1.0 + 0.06 * shock * exp(-r * 7.0) * flashStrength;
    vec2 uvA = center + d * stretch + jitter;

    float zoomPulse = smoothstep(0.275, 0.38, p) * (1.0 - smoothstep(0.42, 0.5, p));
    float zoom = 1.0 + 0.03 * zoomPulse;
    uvA = center + (uvA - center) / zoom;

    uvA = clampUv(uvA);

    vec2 dir = normalize(dAspect + vec2(1e-6)) * vec2(1.0 / ratio, 1.0);
    float rb = 0.008 * shock;
    vec4 a0 = texture2D(tDiffuse, uvA);
    vec4 a1 = texture2D(tDiffuse, clampUv(uvA + dir * rb));
    vec4 a2 = texture2D(tDiffuse, clampUv(uvA - dir * rb));
    vec4 a3 = texture2D(tDiffuse, clampUv(uvA + dir * rb * 2.0));
    vec4 a4 = texture2D(tDiffuse, clampUv(uvA - dir * rb * 2.0));
    vec4 colA = mix(a0, (a0 + a1 + a2 + a3 + a4) * 0.2, smoothstep(0.09, 0.18, p));

    float satDrop = mix(1.0, 0.0, k1);
    satDrop = mix(satDrop, 0.0, k2);
    vec3 aSat = setSaturation(colA.rgb, satDrop * 0.35);

    float cold = smoothstep(0.02, 0.1, p) * (1.0 - smoothstep(0.22, 0.35, p));
    vec3 coldGray = vec3(luma(aSat)) * vec3(0.9, 0.95, 1.0);
    aSat = mix(aSat, coldGray, 0.75 * k1 + 0.25 * cold);

    float flashA = (hash21(vec2(p * 120.0, 3.7)) - 0.5) * 0.10 * k1;
    float flashWhite = smoothstep(0.11, 0.1375, p) * (1.0 - smoothstep(0.1375, 0.17, p));
    aSat += flashA + flashWhite * 0.25 * flashStrength;

    float lowContrast = smoothstep(0.28, 0.5, p);
    aSat = mix(aSat, vec3(0.5) + (aSat - vec3(0.5)) * 0.65, lowContrast);

    float grain = (hash21(uv * 600.0 + p * 37.0) - 0.5) * grainAmount * smoothstep(0.32, 0.5, p);
    aSat += grain;

    vec4 imageA = vec4(clamp(aSat, 0.0, 1.0), colA.a);

    vec2 uvB = clampUv(uv);
    vec4 b0 = texture2D(tDiffuse1, uvB);

    float hBlurAmt = 0.0035 * (1.0 - smoothstep(0.775, 0.925, p)) * smoothstep(0.5, 0.62, p);
    vec2 hx = vec2(hBlurAmt, 0.0);
    vec4 b1 = texture2D(tDiffuse1, clampUv(uvB + hx));
    vec4 b2 = texture2D(tDiffuse1, clampUv(uvB - hx));
    vec4 blurB = (b0 + b1 + b2) / 3.0;

    vec2 ghostOff = vec2(0.006 * (1.0 - k5), 0.0);
    vec4 ghost = texture2D(tDiffuse1, clampUv(uvB - ghostOff));
    vec4 colB = mix(blurB, ghost, 0.18 * k4);

    float bSat = mix(0.2, 1.0, k5);
    vec3 bCol = setSaturation(colB.rgb, bSat);

    float flickerB = smoothstep(0.82, 0.86, p) * (1.0 - smoothstep(0.86, 0.9, p));
    bCol += flickerB * 0.08;

    bCol = clamp(bCol, 0.0, 1.0);
    vec4 imageB = vec4(bCol, colB.a);

    float cross = smoothstep(0.48, 0.52, p);
    vec4 outCol = mix(imageA, imageB, cross);
    outCol.rgb = clamp(outCol.rgb, 0.0, 1.0);
    return outCol;
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