exports.source=`
//===begin_frag_code===
precision highp float;

// 预定义uniform
uniform sampler2D tDiffuse; // 源纹理
uniform float progress; // = 0.0 [0.0, 1.0] // 转场进度
uniform float ratio; // = 1.0 [0.1, 2.0]
uniform sampler2D tDiffuse1; // 目标纹理

uniform float panelSpread; // = 0.38 [0.0, 0.8] // 面板外跳位移强度
uniform float settleStrength; // = 0.65 [0.0, 1.0] // 结尾回弹强度

varying vec2 vUv; // 纹理坐标

float bounceOut(float x) {
    if (x < 1.0 / 2.75) {
        return 7.5625 * x * x;
    } else if (x < 2.0 / 2.75) {
        x -= 1.5 / 2.75;
        return 7.5625 * x * x + 0.75;
    } else if (x < 2.5 / 2.75) {
        x -= 2.25 / 2.75;
        return 7.5625 * x * x + 0.9375;
    } else {
        x -= 2.625 / 2.75;
        return 7.5625 * x * x + 0.984375;
    }
}

void panelData(int id, out vec2 mn, out vec2 mx, out vec2 dir, out float delay, out float speed) {
    if (id == 0) {
        mn = vec2(0.0, 0.5); mx = vec2(0.5, 1.0); dir = vec2(-1.0,  1.0); delay = 0.00; speed = 1.00;
    } else if (id == 1) {
        mn = vec2(0.5, 0.5); mx = vec2(1.0, 1.0); dir = vec2( 1.0,  1.0); delay = 0.08; speed = 1.15;
    } else if (id == 2) {
        mn = vec2(0.0, 0.0); mx = vec2(0.5, 0.5); dir = vec2(-1.0, -1.0); delay = 0.14; speed = 0.95;
    } else {
        mn = vec2(0.5, 0.0); mx = vec2(1.0, 0.5); dir = vec2( 1.0, -1.0); delay = 0.20; speed = 1.10;
    }
}

vec4 phaseAOut(vec2 uv, float t) {
    vec4 col = texture2D(tDiffuse1, uv);
    vec2 aspectShift = vec2(1.0 / max(ratio, 0.0001), 1.0);

    for (int i = 0; i < 4; i++) {
        vec2 mn, mx, dir;
        float delay, speed;
        panelData(i, mn, mx, dir, delay, speed);

        float localT = clamp((t - delay) / (1.0 - delay), 0.0, 1.0);
        localT = clamp(localT * speed, 0.0, 1.0);
        float b = bounceOut(localT);

        vec2 off = dir * panelSpread * b * aspectShift;
        vec2 mnM = mn + off;
        vec2 mxM = mx + off;

        if (uv.x >= mnM.x && uv.x <= mxM.x && uv.y >= mnM.y && uv.y <= mxM.y) {
            vec2 srcUv = clamp(uv - off, 0.0, 1.0);
            col = texture2D(tDiffuse, srcUv);
            break;
        }
    }

    return col;
}

vec4 phaseBIn(vec2 uv, float t, vec4 texel1, vec4 texel2) {
    vec4 base = mix(texel1, texel2, smoothstep(0.0, 1.0, t) * 0.35);
    vec4 col = base;
    vec2 aspectShift = vec2(1.0 / max(ratio, 0.0001), 1.0);

    for (int i = 0; i < 4; i++) {
        vec2 mn, mx, dir;
        float delay, speed;
        panelData(i, mn, mx, dir, delay, speed);

        float localT = clamp((t - delay) / (1.0 - delay), 0.0, 1.0);
        localT = clamp(localT * speed, 0.0, 1.0);
        float b = bounceOut(localT);

        vec2 off = dir * panelSpread * (1.0 - b) * aspectShift;
        vec2 mnM = mn + off;
        vec2 mxM = mx + off;

        if (uv.x >= mnM.x && uv.x <= mxM.x && uv.y >= mnM.y && uv.y <= mxM.y) {
            vec2 srcUv = clamp(uv - off, 0.0, 1.0);
            col = texture2D(tDiffuse1, srcUv);
            break;
        }
    }

    return col;
}

vec4 phaseSettle(vec2 uv, float t) {
    float b = bounceOut(t);
    float scale = 1.0 + 0.06 * settleStrength * (1.0 - b);
    vec2 suv = (uv - 0.5) / scale + 0.5;
    suv = clamp(suv, 0.0, 1.0);
    return texture2D(tDiffuse1, suv);
}

vec4 transition(vec4 texel1, vec4 texel2, float progress) {
    float p = clamp(progress, 0.0, 1.0);

    float p1End = 0.35;
    float p2End = 0.75;

    vec4 c1 = phaseAOut(vUv, clamp(p / p1End, 0.0, 1.0));
    vec4 c2 = phaseBIn(vUv, clamp((p - p1End) / (p2End - p1End), 0.0, 1.0), texel1, texel2);
    vec4 c3 = phaseSettle(vUv, clamp((p - p2End) / (1.0 - p2End), 0.0, 1.0));

    float w12 = smoothstep(p1End - 0.03, p1End + 0.03, p);
    float w23 = smoothstep(p2End - 0.03, p2End + 0.03, p);

    vec4 m12 = mix(c1, c2, w12);
    vec4 outCol = mix(m12, c3, w23);

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