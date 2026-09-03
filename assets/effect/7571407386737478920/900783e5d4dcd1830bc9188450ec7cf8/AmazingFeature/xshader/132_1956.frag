
//===begin_frag_code===
precision highp float;

// 预定义uniform
uniform sampler2D tDiffuse; // 源纹理
uniform sampler2D tDiffuse1; // 目标纹理
uniform float progress; // = 0.0 [0, 1] // 转场进度
uniform float ratio; // = 1.0 [0.1, 2] // 宽高比

// 自定义uniform参数
uniform float gridSize; // = 0.1 [0.01, 0.5] // 晶格大小
uniform float collapseStrength; // = 1.0 [0.0, 2.0] // 塌陷强度

varying vec2 vUv; // 纹理坐标

vec4 transition(vec4 texel1, vec4 texel2, float progress) {
    // 计算晶格坐标
    vec2 gridCoord = floor(vUv / gridSize) * gridSize;
    
    // 计算晶格中心偏移
    vec2 centerOffset = (gridCoord + gridSize * 0.5) - vUv;
    
    // 应用塌陷效果：progress越大，偏移越小
    float collapseFactor = 1.0 - progress * collapseStrength;
    collapseFactor = max(0.0, collapseFactor);
    
    // 计算采样点坐标
    vec2 sampleCoord = vUv + centerOffset * collapseFactor;
    
    // 确保采样坐标在有效范围内
    sampleCoord = clamp(sampleCoord, 0.0, 1.0);
    
    // 从目标纹理采样
    vec4 sampledColor = texture2D(tDiffuse1, sampleCoord);
    
    // 根据塌陷程度混合原图和目标图
    return mix(texel1, sampledColor, progress);
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
