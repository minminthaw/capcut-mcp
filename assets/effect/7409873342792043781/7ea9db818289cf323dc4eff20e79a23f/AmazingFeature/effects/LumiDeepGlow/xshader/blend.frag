precision highp float;
varying highp vec2 uv0;

uniform int u_blendMode;
uniform int u_viewMode;
uniform int u_toggle;
uniform int u_unmult;
uniform float u_exposure;

uniform int u_gamma;
uniform float u_gammaValue;

uniform sampler2D u_inputTex;
uniform sampler2D u_thresholdTex;

uniform sampler2D u_glowBlurTex1;
uniform sampler2D u_glowBlurTex2;
uniform sampler2D u_glowBlurTex3;
uniform sampler2D u_glowBlurTex4;
uniform sampler2D u_glowBlurTex5;
uniform sampler2D u_glowBlurTex6;
uniform sampler2D u_glowBlurTex7;
uniform sampler2D u_glowBlurTex8;

uniform float u_glowIntensity;
uniform float u_srcOpacity;

#define YES 1
#define BLENDSCREEN 1
#define VIEWINPUT 0
#define VIEWFINAL 1

const float EPS = 0.0001;

vec4 blendAdd(in vec4 base, in vec4 blend)
{
    return min(base + blend, vec4(1.));
}

vec4 blendScreen(in vec4 base, in vec4 blend)
{
    return 1. - ((1. - base) * (1. - blend));
}

vec3 blendScreen(in vec3 base, in vec3 blend)
{
    return 1. - ((1. - base) * (1. - blend));
}

float alphaComp(float a, float b)
{
    return a + b - a * b;
}

vec4 composite(vec4 a, vec4 b)
{
    vec3 tmp;
    tmp =
        a.rgb * (1. - b.a) + b.rgb * (1. - a.a) + a.a * b.a * blendScreen(a.rgb / max(a.a, EPS), b.rgb / max(b.a, EPS));
    float alpha = alphaComp(a.a, b.a);
    vec4 res = vec4(tmp, alpha);
    return res;
}

vec4 unmult(vec4 color)
{
    float brightest = max(max(color.r, color.g), color.b);
    if (brightest > 0.0) {
        return vec4(color.rgb, brightest);
    } else {
        return vec4(0.0);
    }
}

void main()
{
    vec4 inputTex = texture2D(u_inputTex, uv0);
    vec4 threshold = texture2D(u_thresholdTex, uv0);

    vec4 blurColor1 = texture2D(u_glowBlurTex1, uv0);
    vec4 blurColor2 = texture2D(u_glowBlurTex2, uv0);
    vec4 blurColor3 = texture2D(u_glowBlurTex3, uv0);
    vec4 blurColor4 = texture2D(u_glowBlurTex4, uv0);
    vec4 blurColor5 = texture2D(u_glowBlurTex5, uv0);
    vec4 blurColor6 = texture2D(u_glowBlurTex6, uv0);
    vec4 blurColor7 = texture2D(u_glowBlurTex7, uv0);
    vec4 blurColor8 = texture2D(u_glowBlurTex8, uv0);

    float intensity = pow(u_glowIntensity * u_exposure, 1. / u_gammaValue);

    vec4 dis1 = clamp(blurColor1 * intensity, 0.0, 1.0);
    vec4 dis2 = clamp(blurColor2 * intensity, 0.0, 1.0);
    vec4 dis3 = clamp(blurColor3 * intensity, 0.0, 1.0);
    vec4 dis4 = clamp(blurColor4 * intensity, 0.0, 1.0);
    vec4 dis5 = clamp(blurColor5 * intensity, 0.0, 1.0);
    vec4 dis6 = clamp(blurColor6 * intensity, 0.0, 1.0);
    vec4 dis7 = clamp(blurColor7 * intensity, 0.0, 1.0);
    vec4 dis8 = clamp(blurColor8 * intensity, 0.0, 1.0);

    if (u_blendMode == BLENDSCREEN) {
        dis1 = blendScreen(dis1, dis2);
        dis1 = blendScreen(dis1, dis3);
        dis1 = blendScreen(dis1, dis4);
        dis1 = blendScreen(dis1, dis5);
        dis1 = blendScreen(dis1, dis6);
        dis1 = blendScreen(dis1, dis7);
        dis1 = blendScreen(dis1, dis8);
    } else {
        dis1 = blendAdd(dis1, dis2);
        dis1 = blendAdd(dis1, dis3);
        dis1 = blendAdd(dis1, dis4);
        dis1 = blendAdd(dis1, dis5);
        dis1 = blendAdd(dis1, dis6);
        dis1 = blendAdd(dis1, dis7);
        dis1 = blendAdd(dis1, dis8);
    }

    vec4 glowColor = clamp(vec4(dis1) * max(intensity, 1.0), 0.0, 1.0);
    vec4 blurColor = pow(glowColor, vec4(u_gammaValue));

    if (u_viewMode == VIEWINPUT) {
        vec4 glowinput = inputTex;
        if (u_toggle == YES) {
            glowinput = threshold;
        }
        gl_FragColor = glowinput;
    } else if (u_viewMode == VIEWFINAL) {
        vec4 result = inputTex;

        if (u_toggle == YES) {
            result = blurColor;

            if (u_gamma == YES) {
                result.rgb = pow(result.rgb, vec3(1. / u_gammaValue));
            }

            if (u_unmult == YES) {
                result = unmult(result);
            }

            vec4 srcMix = composite(inputTex, result);
            result = mix(result, srcMix, u_srcOpacity);
        }
        gl_FragColor = result;
    }
}
