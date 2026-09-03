exports.source=`
//===begin_frag_code===
precision highp float;

uniform sampler2D tDiffuse; // 源纹理
uniform sampler2D tDiffuse1; // 第二源纹理
uniform float progress; // = 0.0 [0, 1]
uniform float ratio; // = 1.0 [0.1, 2]
uniform float blockScale; // = 40.0 [8.0, 120.0] // 控制像素块密度

varying vec2 vUv; // 纹理坐标

float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec4 transition(vec4 texel1, vec4 texel2, float progress) {
    vec2 gridCount = vec2(blockScale, blockScale / ratio);
    vec2 cell = floor(vUv * gridCount);
    vec2 baseCoord = (cell + 0.5) / gridCount;
    vec2 toCenter = vec2(0.5) - baseCoord;

    float rnd = hash(cell);
    float wave = sin(progress * 6.2831853 + rnd * 6.2831853);
    float waveNorm = wave * 0.5 + 0.5;

    float gatherPhase = smoothstep(0.0, 0.45, progress);
    float scatterPhase = smoothstep(0.55, 1.0, progress);

    float gatherStrength = gatherPhase * (0.55 + 0.45 * waveNorm);
    float scatterStrength = scatterPhase * (0.8 + 0.6 * rnd);
    float net = gatherStrength - scatterStrength;

    vec2 warpedCoord = clamp(baseCoord + toCenter * net, 0.0, 1.0);

    vec4 sample1 = texture2D(tDiffuse, warpedCoord);
    vec4 sample2 = texture2D(tDiffuse1, warpedCoord);

    vec2 radialVec = vec2((baseCoord.x - 0.5) * ratio, baseCoord.y - 0.5);
    float radial = length(radialVec);

    float thresholdBase = radial * 0.85 + rnd * 0.25;
    float threshold = clamp(max(0.0, thresholdBase - 0.05 * wave), 0.0, 1.0);
    float softness = 0.18;

    float blockMix = smoothstep(threshold - softness, threshold + softness, progress);
    blockMix = mix(0.0, blockMix, smoothstep(0.02, 0.2, progress));
    blockMix = mix(blockMix, 1.0, smoothstep(0.8, 1.0, progress));

    vec2 fractCoord = fract(vUv * gridCount);
    float innerEdge = smoothstep(0.12, 0.4, min(fractCoord.x, fractCoord.y));
    float outerHighlight = smoothstep(0.6, 0.92, max(fractCoord.x, fractCoord.y));
    float blockShade = mix(0.82, 1.08, innerEdge) * mix(1.0, 1.15, outerHighlight * gatherPhase);
    blockShade = clamp(blockShade, 0.75, 1.15);

    vec3 blended = mix(sample1.rgb, sample2.rgb, blockMix);
    vec3 shaded = clamp(blended * blockShade, 0.0, 1.0);
    float alpha = mix(sample1.a, sample2.a, blockMix);

    return vec4(shaded, alpha);
}

void main() {
    vec4 texel1 = texture2D(tDiffuse, vUv);
    vec4 texel2 = texture2D(tDiffuse1, vUv);

    const float fadeInEnd = 0.1;
    const float fadeOutStart = 0.9;

    float transitionProgress = clamp((progress - fadeInEnd) / (fadeOutStart - fadeInEnd), 0.0, 1.0);
    vec4 transitionColor = transition(texel1, texel2, transitionProgress);

    float blendInFactor = smoothstep(0.0, fadeInEnd, progress);
    float blendOutFactor = smoothstep(fadeOutStart, 1.0, progress);

    vec4 finalColor = mix(texel1, transitionColor, blendInFactor);
    finalColor = mix(finalColor, texel2, blendOutFactor);
    
    gl_FragColor = finalColor;
}
//===end_frag_code===
`;