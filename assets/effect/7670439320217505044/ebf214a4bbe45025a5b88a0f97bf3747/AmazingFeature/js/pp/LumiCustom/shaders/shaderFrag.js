exports.source=`
//===begin_frag_code===
precision highp float;

// 预定义uniform
uniform sampler2D tDiffuse; // 源纹理A
uniform sampler2D tDiffuse1; // 目标纹理B
uniform float progress; // = 0.0 [0, 1] // 转场进度
uniform float ratio; // = 1.0 [0.1, 2] // 宽高比

// 自定义可调参数
uniform float bladeCount; // = 4.0 [2.0, 8.0] // 风车叶片数量
uniform float foldSoftness; // = 0.15 [0.01, 0.5] // 折叠边缘柔和度
uniform float staggerOffset; // = 0.06 [0.0, 0.2] // 叶片错帧折叠偏移量

varying vec2 vUv; // 纹理坐标

vec4 transition(vec4 texel1, vec4 texel2, float progress) {
    // 生成居中适配宽高的坐标
    vec2 centeredUv = vUv - 0.5;
    centeredUv.x *= ratio;
    
    // 极坐标转换
    float radius = length(centeredUv);
    float angle = atan(centeredUv.y, centeredUv.x);
    float normalizedAngle = mod(angle / 6.283185307, 1.0);
    
    // 计算叶片索引与错帧进度
    float bladeIndex = floor(normalizedAngle * bladeCount);
    float localProgress = clamp(progress * 1.2 - bladeIndex * staggerOffset, 0.0, 1.0);
    
    // 叶片内相对角度
    float bladeLocalAngle = mod(normalizedAngle * bladeCount, 1.0);
    
    // 计算折叠阈值与遮罩
    float foldThreshold = 1.0 - localProgress;
    float bladeMask = smoothstep(foldThreshold - foldSoftness, foldThreshold + foldSoftness, bladeLocalAngle + radius * 0.5);
    float centerShrinkMask = smoothstep(1.0 - progress * 2.0, 1.0 - progress * 2.0 + foldSoftness, radius);
    
    float mask = clamp(bladeMask + centerShrinkMask, 0.0, 1.0);
    return mix(texel1, texel2, mask);
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