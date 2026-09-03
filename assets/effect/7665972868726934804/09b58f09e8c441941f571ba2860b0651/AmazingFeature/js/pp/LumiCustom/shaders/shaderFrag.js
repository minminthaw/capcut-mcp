exports.source=`
//===begin_frag_code===
precision highp float;

// 预定义uniform
uniform sampler2D tDiffuse; // 源纹理
uniform float progress; // = 0.0 [0.0, 1.0] // 画面特效进度
uniform float ratio; // = 1.0 [0.1, 2.0]

// 可调参数
uniform int uSlices; // = 10 [3, 20] // 辐轴扇区数量
uniform float uTwist; // = 0.55 [0.0, 1.5] // 扇区径向偏移强度
uniform float uBrightness; // = 1.0 [0.0, 1.5] // 整体亮度调节

varying vec2 vUv; // 纹理坐标

vec4 effect(vec4 texel, float progress) {
    vec2 center = vec2(0.5, 0.5);
    vec2 p = vUv - center;
    p.x *= ratio;

    float r = length(p);
    float ang = atan(p.y, p.x);
    float pi = 3.141592653589793;
    float ang01 = (ang + pi) / (2.0 * pi);

    float slices = float(uSlices);
    float sectorPos = ang01 * slices;
    float sectorId = floor(sectorPos);
    float sectorFrac = fract(sectorPos);

    float distToCenter = abs(sectorFrac - 0.5);
    float fanMask = smoothstep(0.5, 0.08, distToCenter);

    float midPulse = sin(progress * pi);
    float radialMask = smoothstep(0.95, 0.1, r);
    float alt = mod(sectorId, 2.0) * 2.0 - 1.0;

    vec2 dir = (r > 1e-5) ? (p / r) : vec2(0.0, 0.0);
    vec2 offset = dir * alt * fanMask * radialMask * midPulse * uTwist * 0.08;
    offset.x /= ratio;

    vec2 uvWarp = clamp(vUv + offset, 0.0, 1.0);
    vec4 warped = texture2D(tDiffuse, uvWarp);

    float seam = smoothstep(0.46, 0.0, distToCenter) * midPulse * 0.18;
    float shade = 1.0 - seam * (0.35 + 0.65 * smoothstep(0.0, 1.0, r));
    float bright = mix(1.0, uBrightness, 0.65 * midPulse);

    vec3 col = warped.rgb * shade * bright;
    col = clamp(col, 0.0, 1.0);

    return vec4(col, texel.a);
}

void main() {
    // Get the pixel color from both textures
    vec4 texel = texture2D(tDiffuse, vUv);

    // --- Effect Configration ---
    const float fadeInEnd = 0.1;
    const float fadeOutStart = 0.9;

    // 1. Calculate the effect's own progress.
    float effectProgress = clamp((progress - fadeInEnd) / (fadeOutStart - fadeInEnd), 0.0, 1.0);
    vec4 effectColor = effect(texel, effectProgress);

    // 2. Calculate the unified effect strength.
    float fadeInStrength = smoothstep(0.0, fadeInEnd, progress);
    float fadeOutStrength = 1.0 - smoothstep(fadeOutStart, 1.0, progress);
    float effectStrength = min(fadeInStrength, fadeOutStrength);

    // 3. Apply the blending.
    vec4 finalColor = mix(texel, effectColor, effectStrength);

    gl_FragColor = finalColor;
}
//===end_frag_code===
`;