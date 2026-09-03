exports.source=`
//===begin_frag_code===
precision highp float;

// 预定义uniform
uniform sampler2D tDiffuse; // 源纹理A
uniform sampler2D tDiffuse1; // 源纹理B
uniform float progress; // = 0.0 [0, 1] // 转场进度
uniform float ratio; // = 1.0 [0.1, 2] // 宽高比

// 自定义可调参数
uniform float blockCount; // = 8.0 [2.0, 20.0] // 切块行列数量
uniform float driftStrength; // = 0.5 [0.1, 2.0] // 漂移幅度系数
uniform float blockThickness; // = 0.1 [0.01, 0.5] // 切块厚度系数

varying vec2 vUv; // 纹理坐标

vec4 transition(vec4 texel1, vec4 texel2, float progress) {
    // 转换为等比例坐标，保证切块为正方形
    vec2 scaledUV = vUv;
    scaledUV.x *= ratio;
    vec2 screenCenter = vec2(0.5 * ratio, 0.5);
    
    // 计算当前像素所属切块ID与块内坐标
    vec2 blockGrid = scaledUV * blockCount;
    vec2 blockId = floor(blockGrid);
    vec2 blockLocalUV = fract(blockGrid);
    
    // 计算切块中心到屏幕中心的归一化距离
    vec2 blockCenter = (blockId + 0.5) / blockCount;
    blockCenter.x *= ratio;
    float distToCenter = length(blockCenter - screenCenter) / length(screenCenter);
    
    // 按距离分配动画触发时间，实现分批漂移效果
    float blockAnimProgress = clamp(progress * 1.5 - distToCenter * 0.5, 0.0, 1.0);
    // 漂移曲线：先移出后归位
    float driftFactor = smoothstep(0.0, 0.4, blockAnimProgress) - smoothstep(0.6, 1.0, blockAnimProgress);
    
    // 生成每个切块的随机漂移方向
    float randSeedX = fract(sin(dot(blockId, vec2(12.9898, 78.233))) * 43758.5453);
    float randSeedY = fract(sin(dot(blockId, vec2(34.234, 65.879))) * 23456.7891);
    vec2 driftDir = normalize(vec2(randSeedX - 0.5, randSeedY - 0.5));
    
    // 计算切块侧边（暗色面）的显示区域
    vec2 edgeSize = vec2(blockThickness * driftFactor * driftStrength);
    bool isSideFace = (blockLocalUV.x < edgeSize.x && driftDir.x < 0.0) || 
                      (blockLocalUV.x > 1.0 - edgeSize.x && driftDir.x > 0.0) ||
                      (blockLocalUV.y < edgeSize.y && driftDir.y < 0.0) ||
                      (blockLocalUV.y > 1.0 - edgeSize.y && driftDir.y > 0.0);
    
    // 纹理混合进度随切块动画进度更新
    float blendFactor = clamp(blockAnimProgress, 0.0, 1.0);
    
    // 侧边显示暗色，正面显示过渡纹理
    if (isSideFace && driftFactor > 0.01) {
        return vec4(0.1, 0.1, 0.1, 1.0);
    } else {
        return mix(texel1, texel2, blendFactor);
    }
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