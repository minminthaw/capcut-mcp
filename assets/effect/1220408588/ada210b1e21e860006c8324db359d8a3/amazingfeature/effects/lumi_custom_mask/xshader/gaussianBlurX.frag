precision highp float;
varying highp vec2 uv0;
uniform sampler2D u_maskTex;
uniform float u_diff;
uniform vec2 u_inputSize;

float gaussian(float dis, float sigma) {
    return 0.39894 * exp(-0.5 * dis / (sigma * sigma)) / sigma;
}

float samplingGaussian(sampler2D tex, vec2 uv, float sigma) {
     if (sigma < 0.001)
    {
        return texture2D(tex, uv).r;
    }

    float alpha = texture2D(tex, uv).r;
    float weightSum = 1.0;
    vec2 uvStep = vec2(1.0 / u_inputSize.x, 1.0 / u_inputSize.y);

    vec2 offset = vec2(0.0);
    float gaussWeight = 0.0;
    float factor = sigma * 3.0;
    int sample = 15;
    float dis = 0.0;
    for (int i = 1; i <= sample; i++) {
        offset = vec2(float(i), float(i)) * uvStep * vec2(factor, factor);
        dis = offset.x * offset.x;
        gaussWeight = gaussian(dis, sigma);
        alpha += texture2D(tex, uv + vec2(offset.x, 0.0)).r * gaussWeight;
        weightSum += gaussWeight;

        alpha += texture2D(tex, uv + vec2(-offset.x, 0.0)).r * gaussWeight;
        weightSum += gaussWeight;

    }

    return clamp(alpha / weightSum, 0.0, 1.0);
}

void main()
{
    float alpha = 0.0;
    alpha = samplingGaussian(u_maskTex, uv0, u_diff);
    vec4 mask = vec4(alpha);
    gl_FragColor = mask;
}