precision highp float;

uniform float u_OutputWidth;
uniform float u_OutputHeight;

uniform sampler2D _MainTex;
uniform vec3 param;
uniform vec4 _MainTex_ST;
uniform float u_percent; // 0.0 到 1.0 的时间戳

varying vec2 uv0;

void main() {
    // --- 1. 动画进度控制 ---
    // 输入: 0.0 -> 1.0
    // 转换: 0.0(张开) -> 1.0(闭合) -> 0.0(张开)
    float t = u_percent * 2.0;
    float foldProgress = 1.0 - abs(t - 1.0);

    // 使用 smoothstep 让折返点的动作更圆滑，不是生硬的三角波
    foldProgress = smoothstep(0.0, 1.0, foldProgress);

    // --- 2. 基础 Y 轴折叠 (纸张变短) ---
    // 随着折叠，屏幕上显示的区域高度被压缩
    // maxFold 决定了最大折叠幅度，0.6 表示最折叠时只剩 40% 高度
    float maxFold = 1.0;
    float yScale = 1.0 - foldProgress * maxFold;

    // 计算当前像素相对于中心点的偏移
    vec2 center = vec2(0.5, 0.5);
    vec2 dist = uv0 - center;

    // 目标纹理坐标初始化
    vec2 uvF = uv0;

    // 反向映射 Y 轴：屏幕上较短的距离 对应 纹理上较长的距离
    uvF.y = center.y + dist.y / yScale;

    // --- 3. 裁剪 ---
    // 如果映射后的坐标超出了纹理原本的范围，说明是折叠产生的空隙
    if(uvF.y < 0.0 || uvF.y > 1.0) {
        gl_FragColor = vec4(0.0);
        return;
    }

    // --- 4. 中间线透视收缩与曲线模拟 ---
    // 目标：越靠近中间 (y=0.5)，X 轴收缩越厉害 (模拟中间向远处折弯)

    // 计算当前纹理坐标距离中心的垂直距离 (0.0 为中心，0.5 为边缘)
    float distY = abs(uvF.y - 0.5);

    // 计算"弯曲权重" (Curve Weight)
    // 1.0 代表在正中心，0.0 代表在边缘
    float curveWeight = 1.0 - (distY * 2.0);

    // 核心修改：增加曲线感
    // 使用 pow 让线性距离变成抛物线形状，模拟纸张弯曲的弧度，而不是尖锐的折痕
    curveWeight = pow(curveWeight, 2.5); 

    // 透视强度：随着 foldProgress 增大而增大
    // 0.5 是透视系数，值越大中间缩得越小
    float perspectiveAmount = 1.0 + curveWeight * foldProgress * 0.3;

    // 应用 X 轴透视
    // 将 X 轴坐标乘以一个大于 1 的系数，相当于在纹理上取了更宽的范围放到屏幕上
    // 视觉效果就是：屏幕上的图像变窄（收缩）了
    uvF.x = center.x + dist.x * perspectiveAmount;

    // 再次裁剪 X 轴可能溢出的部分
    if(uvF.x < 0.0 || uvF.x > 1.0) {
        gl_FragColor = vec4(0.0);
        return;
    }

    // --- 5. 纹理采样与光影 ---
    vec4 color = vec4(0);

    #if defined(ANIMSEQ) && ANIMSEQ == 1
    uvF.x = clamp(uvF.x, 0., 1.);
    uvF.y = clamp(uvF.y, 0., 1.);
    uvF = uvF * _MainTex_ST.xy + _MainTex_ST.zw;
    #endif
    color = texture2D(_MainTex, uvF);

    // 添加光影增强立体感
    // 中间折痕处因为向内凹陷/远离，稍微变暗
    // 边缘保持原亮度
    float shadow = 1.0 - curveWeight * foldProgress * 0.3;
    color.rgb *= shadow;

    gl_FragColor = color;
}