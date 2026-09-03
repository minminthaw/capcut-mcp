precision mediump float;

uniform sampler2D u_inputTex;
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

void main()
{
    gl_FragColor = GaussianBlur(u_inputTex, uv0);
}