exports.source=`
//===begin_frag_code===
precision highp float;

// 预定义uniform
uniform sampler2D tDiffuse; // 源纹理
uniform sampler2D tDiffuse1; // 第二源纹理
uniform float progress; // = 0.0 [0, 1] // Transition progress
uniform float ratio; // = 1.0 [0.1, 2]

uniform float zoomPower; // = 1.6 [0.5, 4.0] // Zoom intensity factor
uniform float blurStrength; // = 0.75 [0.0, 1.5] // Radial blur strength
uniform float chromaAmount; // = 0.003 [0.0, 0.01] // Chromatic aberration shift
uniform float flashStrength; // = 1.2 [0.0, 2.0] // Flash brightness multiplier

varying vec2 vUv; // 纹理坐标

vec4 transition(vec4 texel1, vec4 texel2, float progress) {
    float t = clamp(progress, 0.0, 1.0);
    vec2 center = vec2(0.5);
    vec2 aspect = vec2(ratio, 1.0);
    vec2 centeredUv = (vUv - center) * aspect;
    float dist = length(centeredUv);
    vec2 radialDir = dist > 1e-5 ? centeredUv / dist : vec2(0.0);
    vec2 safeDir = radialDir / aspect;

    float zoomInPhase = smoothstep(0.0, 0.45, t);
    float zoomOutPhase = smoothstep(0.55, 1.0, t);
    float inScale = mix(1.0, 1.0 + zoomPower, zoomInPhase);
    float outScale = mix(1.0 + zoomPower, 1.0, zoomOutPhase);

    float ramp = smoothstep(0.0, 0.6, t) * (1.0 - smoothstep(0.6, 1.0, t));
    float blurInAmount = blurStrength * ramp * 0.08;
    float blurOutAmount = blurStrength * smoothstep(0.35, 1.0, t) * 0.06;

    float shakeWindow = smoothstep(0.5, 0.7, t) * (1.0 - smoothstep(0.75, 1.0, t));
    vec2 shakeOffset = vec2(sin(t * 120.0), cos(t * 200.0)) * (0.006 * shakeWindow);
    shakeOffset.x /= ratio;

    vec2 uvIn = center + (centeredUv / max(inScale, 0.0001)) / aspect + shakeOffset;
    vec2 uvOut = center + (centeredUv / max(outScale, 0.0001)) / aspect + shakeOffset * 0.6;

    vec4 inA = texture2D(tDiffuse, uvIn);
    vec4 inB = texture2D(tDiffuse, uvIn - safeDir * blurInAmount);
    vec4 inC = texture2D(tDiffuse, uvIn + safeDir * blurInAmount);
    vec4 firstStage = inA * 0.5 + (inB + inC) * 0.25;

    float streak = exp(-dist * 18.0) * smoothstep(0.2, 0.55, t);
    firstStage.rgb += streak * 0.6;

    vec4 outA = texture2D(tDiffuse1, uvOut);
    vec4 outB = texture2D(tDiffuse1, uvOut + safeDir * blurOutAmount);
    vec4 outC = texture2D(tDiffuse1, uvOut - safeDir * blurOutAmount);

    float chromaPhase = smoothstep(0.45, 1.0, t);
    vec3 secondColor = outA.rgb;
    secondColor.r = mix(outA.r, outB.r, chromaPhase);
    secondColor.b = mix(outA.b, outC.b, chromaPhase);
    secondColor.g = mix(outA.g, (outB.g + outC.g) * 0.5, chromaPhase * 0.5);

    float impact = smoothstep(0.47, 0.52, t);
    vec4 secondStage = vec4(secondColor * (1.0 + impact * 0.18), mix(outA.a, (outB.a + outC.a) * 0.5, chromaPhase));

    float energyMix = smoothstep(0.35, 0.65, t);
    vec4 merged = mix(firstStage, secondStage, energyMix);

    float flashPhase = smoothstep(0.45, 0.5, t) * (1.0 - smoothstep(0.5, 0.55, t));
    float flash = flashPhase * flashStrength;
    merged.rgb = mix(merged.rgb, vec3(1.0), clamp(flash, 0.0, 1.0));

    float motionBoost = smoothstep(0.2, 0.6, t);
    vec3 motionShift = vec3(safeDir.x, safeDir.y, -safeDir.x) * chromaAmount * motionBoost;
    merged.rgb = clamp(merged.rgb + motionShift, 0.0, 1.0);
    merged.a = clamp(merged.a, 0.0, 1.0);

    return merged;
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