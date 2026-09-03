precision mediump float;

uniform sampler2D u_oriTex;
uniform sampler2D u_inputTex;
uniform sampler2D u_medianTex;
uniform sampler2D u_faceExtraMaskTex;
uniform vec2 u_texelStep;

varying vec2 uv0;

const float sigma = 0.6499999761581421;
const int kernelSize  = 1;

float getGaussianWeight(float offset, float sigma)
{
    float variance = sigma * sigma;
    return exp(-(offset * offset) / (2.0 * variance));
}

// u_texelStep -> (1.0 / width, 0.0) vertical, (0.0, 1.0 / height) horizontal.
vec4 GaussianBlur(sampler2D tex, vec2 uv)
{
    vec4 sumColor = vec4(0.0);
    float sumWeight = 0.0;

    // getGaussianWeight(0.0, u_sigma) = 1.0
    vec2 uv_offset = vec2(1.0 * u_texelStep.x, 1.0 * u_texelStep.y);
    const float weight = 0.30622595347271186;
    
    vec2 sampleUV1 = uv + uv_offset;
    vec2 sampleUV2 = uv - uv_offset;
    
    sumColor = texture2D(tex, uv) + weight * texture2D(tex, sampleUV1) + weight * texture2D(tex, sampleUV2);
    sumWeight = 1.0 + 2.0 * weight;
    return sumColor / sumWeight;
}

vec4 highPassFilter(vec4 oriColor, sampler2D inputTex)
{
    vec4 blurredColor = GaussianBlur(inputTex, uv0);
    return vec4(clamp(oriColor - blurredColor + vec4(0.5), 0.0, 1.0));
}

vec4 LinearLightBlend(vec4 a, vec4 b)
{
    return b + 2.0 * a - 1.0;
}

vec4 MultiplyBlend(vec4 a, vec4 b)
{
    return b * a;
}

void main()
{
    vec4 oriColor = texture2D(u_oriTex, uv0);
    vec4 highPassColor = highPassFilter(oriColor, u_inputTex);
    vec4 medianColor = texture2D(u_medianTex, uv0);

    vec4 blendColor = LinearLightBlend(highPassColor, medianColor);
    gl_FragColor = blendColor;
}