precision highp float;
varying vec2 uv0;
uniform sampler2D u_albedo;
uniform sampler2D u_expandMattingmask;
uniform vec2 u_position;
uniform vec2 u_scale;
uniform float u_rotation;
uniform float u_aspect;
uniform float u_diff;
uniform float u_invert;
uniform vec2 u_inputSize;
uniform int u_enableTransformUV;
uniform int u_usePreviewColor;
uniform int u_getValidMask;

vec3 addBlend(vec3 base, vec3 blend) {
    return min(base + blend, vec3(1.0));
}

vec2 rotate(vec2 coord, float angle) {
    return vec2(cos(angle) * coord.x - sin(angle) * coord.y,
                sin(angle) * coord.x + cos(angle) * coord.y);
}

vec2 transformUV(vec2 uv) {
    uv = vec2((uv.x - 0.5) * 2.0 * u_aspect, (uv.y - 0.5) * 2.0);
    uv = vec2(uv.x - u_position.x * u_aspect, uv.y + u_position.y);
    uv = rotate(uv, u_rotation);
    uv = vec2(uv.x / u_scale.x, uv.y / u_scale.y);
    uv = vec2(uv.x * 0.5 / u_aspect + 0.5, uv.y * 0.5 + 0.5);
    return uv;
}

float gaussian(float dis, float sigma) {
    return 0.39894 * exp(-0.5 * dis / (sigma * sigma)) / sigma;
}

float gaussianSimplfy(float dis, float sigma) {
    return 0.39894 * exp(-0.5 * dis) / sigma;
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
    float k = 10.0;
    float maxSample = 30.0;
    float minSample = 1.0;
    int sample = int(min(maxSample, max(minSample, k * factor)));
    float extraScale = max(2.0, sigma * 3.0);
    float dis = 0.0;
    for (int i = 1; i <= sample; i++) {
        offset = vec2(float(i), float(i)) * uvStep * vec2(extraScale, extraScale);
        dis = offset.x * offset.x;
        gaussWeight = gaussianSimplfy(dis, sigma);
        alpha += texture2D(tex, uv + vec2(offset.x, 0.0)).r * gaussWeight;
        weightSum += gaussWeight;

        alpha += texture2D(tex, uv + vec2(-offset.x, 0.0)).r * gaussWeight;
        weightSum += gaussWeight;

    }

    return clamp(alpha / weightSum, 0.0, 1.0);
}

void main()
{
    vec4 inputColor = texture2D(u_albedo, uv0);
    vec4 bgColor = vec4(0);
    float alpha = 0.0;
    if(u_enableTransformUV > 0)
    {
        vec2 transformedUV = transformUV(uv0);
        if (transformedUV.x < 1.0 && transformedUV.y < 1.0 && transformedUV.x > 0.0 && transformedUV.y > 0.0)
        {
            alpha = samplingGaussian(u_expandMattingmask, transformedUV, u_diff);
        }
    }
    else
    {
        alpha = samplingGaussian(u_expandMattingmask, uv0, u_diff);
    }

    if (u_invert > 0.0)
    {
        alpha = 1.0 - alpha;
    }
    
    vec4 color = texture2D(u_albedo, uv0);
    vec4 mask = vec4(alpha, 1.0, 1.0, 1.0);
    if (u_usePreviewColor > 0)
    {
        mask.a = 0.0;
    }
    if (u_getValidMask > 0)
    {
        mask.b = 0.0;
    }
    gl_FragColor = vec4(addBlend(color.rgb, mask.rgb), mask.a);
}

