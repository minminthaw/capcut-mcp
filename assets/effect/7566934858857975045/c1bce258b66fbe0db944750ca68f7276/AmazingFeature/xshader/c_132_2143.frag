precision highp float;
//===begin_frag_code===
precision highp float;

// 预定义uniform变量
uniform sampler2D tDiffuse; // 源纹理
uniform sampler2D tDiffuse1; // 目标纹理
uniform float progress; // =0.0 [0.0,1.0] // 转场进度
uniform float ratio; // =1.0 [0.1,2] // 宽高比

// 自定义可调节参数
uniform float rotationSpeed; // =2.0 [0.0,5.0] // 虫洞旋转速度
uniform float twistStrength; // =1.5 [0.0,3.0] // 旋涡扭曲强度
uniform float edgeSoftness; // =0.1 [0.01,0.2] // 边缘柔化程度

varying vec2 vUv; // UV坐标变量

vec4 transition(vec4 texel1, vec4 texel2, float progress) {
    // 转换到中心坐标系
    vec2 uv_center = vUv - vec2(0.5);
    float r = length(uv_center);
    float theta = atan(uv_center.y, uv_center.x);
    
    // 应用旋涡扭曲效果
    theta += twistStrength * progress * rotationSpeed;
    
    // 计算虫洞半径（随进度扩大）
    float wormhole_radius = progress * 1.2;
    
    // 计算混合权重（边缘平滑过渡）
    float mix_weight = 1.0 - smoothstep(wormhole_radius - edgeSoftness, wormhole_radius, r);
    
    // 生成扭曲后的UV坐标
    vec2 distorted_uv = vec2(cos(theta), sin(theta)) * r + vec2(0.5);
    distorted_uv = clamp(distorted_uv, vec2(0.0), vec2(1.0)); // 防止越界
    
    // 获取扭曲后的源纹理颜色
    vec4 distorted_tex1 = texture2D(tDiffuse, distorted_uv);
    
    // 混合扭曲后的源纹理与目标纹理
    return mix(distorted_tex1, texel2, mix_weight);
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
