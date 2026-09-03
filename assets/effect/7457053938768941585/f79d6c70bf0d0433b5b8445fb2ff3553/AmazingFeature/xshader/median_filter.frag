precision mediump float;
uniform sampler2D u_inputTex;
uniform vec2 u_texelStep;
uniform float u_threshold;
uniform float u_radius;

varying vec2 uv0;

vec4 medianFilter()
{
    vec4 oriColor = texture2D(u_inputTex, uv0);
    if(oriColor.a <= 0.02)
        return oriColor;
    
    int hist_r[256], hist_g[256], hist_b[256];
    int counter = 0;

    for(int i = 0; i < 256; i++)
    {
        hist_r[i] = 0;
        hist_g[i] = 0;
        hist_b[i] = 0;
    }

    ivec4 oriHistIndex = ivec4(floor(oriColor * vec4(255.0)));
    hist_r[oriHistIndex.x]++;
    hist_g[oriHistIndex.y]++;
    hist_b[oriHistIndex.z]++;
    counter++;

    int blockSize = int(u_radius) * 2 + 1;
    int halfBlock = blockSize / 2;

    for(int y = -halfBlock; y <= halfBlock; y++)
    {
        for(int x = -halfBlock; x <= halfBlock; x++)
        {
            if(x == 0 && y == 0) continue;

            vec2 clampedUV = clamp(uv0 + vec2(u_texelStep.x * float(x), u_texelStep.y * float(y)), vec2(0.0), vec2(1.0));
            vec4 color = texture2D(u_inputTex, clampedUV);
            if(color.a > 0.02)
            {
                ivec4 histIndex = ivec4(floor(color * vec4(255.0)));
                hist_r[histIndex.x]++;
                hist_g[histIndex.y]++;
                hist_b[histIndex.z]++;
                counter++;
            }
        }
    }

    int mid = counter / 2;
    float r = 0.0, g = 0.0, b = 0.0;

    ivec4 sum = ivec4(0);
    for(int i = 0; i < 256; i++)
    {
        sum += ivec4(hist_r[i], hist_g[i], hist_b[i], 0);
        if(sum.r > mid)
        {
            r = float(i) / 255.0;
            sum.r = 0;
        }
        if(sum.g > mid)
        {
            g = float(i) / 255.0;
            sum.g = 0;
        }
        if(sum.b > mid)
        {
            b = float(i) / 255.0;
            sum.b = 0;
        }
    }
    
    if (abs(r - oriColor.r) < u_threshold) {
        r = oriColor.r;
    }
    if (abs(g - oriColor.g) < u_threshold) {
        g = oriColor.g;
    }
    if (abs(b - oriColor.b) < u_threshold) {
        b = oriColor.b;
    }

    return vec4(r, g, b, oriColor.a);
}
void main()
{
    gl_FragColor = medianFilter();
}