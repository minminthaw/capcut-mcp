exports.source=`
//===begin_frag_code===
precision highp float;

// 预定义uniform
uniform sampler2D tDiffuse; // 源纹理A
uniform sampler2D tDiffuse1; // 源纹理B
uniform float progress; // = 0.0 [0, 1] // 转场进度
uniform float ratio; // = 1.0 [0.1, 2] // 画面宽高比

// 自定义可调节参数
uniform float gridCount; // = 8.0 [2.0, 32.0] // 网格划分行数
uniform float maxPixelBlock; // = 64.0 [8.0, 256.0] // 最大像素块尺寸(px)
uniform float offsetStrength; // = 0.1 [0.0, 0.5] // 水平偏移最大幅度
uniform float flashProb; // = 0.2 [0.0, 1.0] // 行闪白触发概率

varying vec2 vUv; // 纹理坐标

// 伪随机函数
float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

vec4 transition(vec4 texel1, vec4 texel2, float progress) {
    // 适配宽高比得到正方形网格坐标
    vec2 squareUv = vUv;
    squareUv.x *= ratio;
    
    // 计算网格ID与网格内坐标
    vec2 gridPos = squareUv * gridCount;
    vec2 gridId = floor(gridPos);
    
    // 当前扫描线位置
    float scanRow = progress * gridCount;
    float rowDelta = scanRow - gridId.y;
    
    // 计算当前行的干扰强度：扫描线附近干扰最强
    float effectWeight = smoothstep(-1.0, 0.0, rowDelta) * (1.0 - smoothstep(0.0, 1.0, rowDelta));
    
    // 像素化下采样计算
    float pixelScale = maxPixelBlock / 1080.0 * effectWeight;
    vec2 pixelUv = floor(vUv / pixelScale) * pixelScale;
    pixelUv = mix(vUv, pixelUv, effectWeight);
    
    // 相邻行反方向水平偏移
    float offsetDir = mod(gridId.y, 2.0) * 2.0 - 1.0;
    pixelUv.x += offsetDir * offsetStrength * effectWeight;
    
    // 随机行闪白效果
    float flashRand = rand(vec2(gridId.y, floor(progress * 30.0)));
    float flashOn = step(flashRand, flashProb) * effectWeight;
    
    // 扫过区域使用B纹理，未扫过使用A纹理
    vec4 outputColor = rowDelta >= 0.0 ? texture2D(tDiffuse1, pixelUv) : texture2D(tDiffuse, pixelUv);
    
    // 应用闪白效果
    outputColor = mix(outputColor, vec4(1.0), flashOn);
    
    return outputColor;
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