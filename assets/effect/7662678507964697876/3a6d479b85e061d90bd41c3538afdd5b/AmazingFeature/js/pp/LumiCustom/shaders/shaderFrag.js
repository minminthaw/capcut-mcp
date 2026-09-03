exports.source=`
//===begin_frag_code===
precision highp float;

// 预定义uniform
uniform sampler2D tDiffuse; // 源纹理
uniform float progress; // = 0.0 [0, 1]
uniform float ratio; // = 1.0 [0.1, 2]
uniform sampler2D tDiffuse1; // 目标纹理

uniform float foldWidth; // = 0.14 [0.03, 0.35] // 翻折带宽度
uniform float shadowStrength; // = 0.35 [0.0, 1.0] // 阴影强度
uniform float pastelMix; // = 0.28 [0.0, 0.8] // 便签马卡龙混合强度
uniform float doodleAmount; // = 0.45 [0.0, 1.0] // 手绘涂鸦强度

varying vec2 vUv; // 纹理坐标

float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec3 pastelColor(float id) {
    float h = fract(sin((id + 1.0) * 17.231) * 43758.5453);
    vec3 c = 0.72 + 0.18 * cos(6.2831853 * (h + vec3(0.0, 0.33, 0.67)));
    return clamp(c, 0.0, 1.0);
}

vec4 transition(vec4 texel1, vec4 texel2, float progress) {
    if (progress <= 0.0) return texel1;
    if (progress >= 1.0) return texel2;

    const float layers = 7.0;
    float yLayer = clamp(vUv.y * layers, 0.0, layers - 0.0001);
    float layerIndex = floor(yLayer);        // 0: 最下层
    float layerFracY = fract(yLayer);

    float localT = clamp(progress * layers - layerIndex, 0.0, 1.0);
    float eased = localT * localT * (3.0 - 2.0 * localT);
    float rebound = sin(eased * 3.1415926) * (1.0 - eased) * 0.08;
    float foldT = clamp(eased + rebound, 0.0, 1.0);

    float edgeX = 1.0 - foldT;
    float bw = foldWidth * (0.85 + 0.15 * sin((layerIndex + 1.0) * 1.7));
    float aa = 0.004;
    float revealed = smoothstep(edgeX - aa, edgeX + aa, vUv.x);

    float distEdge = abs(vUv.x - edgeX);
    float foldBand = exp(-distEdge * distEdge / max(0.0005, bw * bw));

    float curl = (1.0 - foldT) * foldBand * 0.03;
    vec2 uvA = clamp(vUv + vec2(-curl, 0.0), 0.0, 1.0);

    vec2 uvB = vUv;
    uvB.y += sin((vUv.x * 44.0 + layerIndex * 6.13) - foldT * 18.0) * 0.004 * (1.0 - foldT) * foldBand;
    uvB = clamp(uvB, 0.0, 1.0);

    vec3 aCol = texture2D(tDiffuse, uvA).rgb;
    vec3 bCol = texture2D(tDiffuse1, uvB).rgb;

    vec3 pastel = pastelColor(layerIndex);
    vec3 noteCol = mix(aCol, pastel, pastelMix);

    float edgeDark = 1.0 - 0.10 * (1.0 - smoothstep(0.0, 0.05, layerFracY)) - 0.08 * smoothstep(0.95, 1.0, layerFracY);
    noteCol *= edgeDark;

    float perforation = (1.0 - smoothstep(0.0, 0.04, layerFracY)) * step(0.55, sin(vUv.x * 120.0 + layerIndex * 5.2) * 0.5 + 0.5);
    noteCol *= (1.0 - 0.08 * perforation);

    vec2 suv = vec2((vUv.x - 0.5) * ratio + 0.5, vUv.y);
    float doodleSeed = hash12(vec2(layerIndex, floor(suv.x * 12.0)));
    float doodleLine = smoothstep(0.985, 1.0, sin(suv.x * 70.0 + suv.y * 110.0 + layerIndex * 2.7 + doodleSeed * 6.2831));
    noteCol = mix(noteCol, noteCol * 0.82, doodleLine * doodleAmount * 0.25);

    float shadow = shadowStrength * (1.0 - foldT) * foldBand;
    bCol *= (1.0 - shadow * revealed * 0.65);

    float ripple = sin((vUv.y * 130.0 + layerIndex * 4.0) - foldT * 22.0) * 0.5 + 0.5;
    bCol += vec3(0.015 * ripple * foldBand * (1.0 - foldT));

    vec3 foldLight = vec3(1.0) * (0.10 * foldBand * (1.0 - abs(2.0 * foldT - 1.0)));
    vec3 paperSide = clamp(noteCol + foldLight, 0.0, 1.0);

    vec3 col = mix(paperSide, clamp(bCol, 0.0, 1.0), revealed);
    return vec4(clamp(col, 0.0, 1.0), mix(texel1.a, texel2.a, revealed));
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