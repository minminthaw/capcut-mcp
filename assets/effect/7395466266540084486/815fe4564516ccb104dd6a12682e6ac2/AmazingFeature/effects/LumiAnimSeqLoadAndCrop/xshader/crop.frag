precision highp float;
varying highp vec2 uv0;
uniform sampler2D u_inputTexture;
uniform sampler2D u_seqTexture;
uniform vec2 u_seqTexSize;
uniform vec4 u_ScreenParams;
uniform int u_convertAlpha;
uniform int u_cropType;
uniform int u_edgeType;
uniform float u_opacity;
uniform vec2 u_scale;

#define FALSE 0
#define TRUE 1

#define CROP_TYPE_STRETCH 0
#define CROP_TYPE_FILL 1
#define CROP_TYPE_FIT 2

#define EDGE_TYPE_TILE 0
#define EDGE_TYPE_MIRROR 1
#define EDGE_TYPE_CLAMP 2
#define EDGE_TYPE_EMPTY 3

const float Eps = 0.0001;

vec4 getVideoColor(highp vec2 uv)
{
    if (u_convertAlpha == FALSE) {
        return texture2D(u_seqTexture, uv);
    }
    vec4 color;
    highp vec2 alphaUV = vec2(uv.x * 0.5, uv.y);
    highp vec2 colorUV = vec2(uv.x * 0.5 + 0.5, uv.y);
    color.a = texture2D(u_seqTexture, alphaUV).r;
    color.rgb = texture2D(u_seqTexture, colorUV).rgb * color.a;
    return color;
}

vec2 mirrorTexCoord(vec2 x)
{
    return abs(mod(x - 1., 2.) - 1.);
}

vec2 repeatTexCoord(vec2 coord)
{
    vec2 t = mod(coord, 1.0);
    t += (1.0 - step(0., t));
    return t;
}

float uvProtect(vec2 uv)
{
    vec2 uvp = step(vec2(0.0), uv) * step(uv, vec2(1.0));
    return uvp.x * uvp.y;
}

void main()
{
    if (abs(u_scale.x) < Eps || abs(u_scale.y) < Eps) {
        gl_FragColor = vec4(0.0);
        return;
    }
    highp vec2 uv1 = (uv0 - 0.5) / u_scale + 0.5;

    float aspectRatioSeqTex = u_seqTexSize.x / u_seqTexSize.y;
    float aspectRatioScreen = u_ScreenParams.x / u_ScreenParams.y;

    highp vec2 uv = uv1;
    if (u_cropType == CROP_TYPE_FILL) {
        if (aspectRatioSeqTex > aspectRatioScreen) {
            float scale = aspectRatioScreen / aspectRatioSeqTex;
            uv.y = uv1.y;
            uv.x = (uv1.x - 0.5) * scale + 0.5;
        } else {
            float scale = aspectRatioSeqTex / aspectRatioScreen;
            uv.x = uv1.x;
            uv.y = (uv1.y - 0.5) * scale + 0.5;
        }
    } else if (u_cropType == CROP_TYPE_FIT) {
        if (aspectRatioSeqTex < aspectRatioScreen) {
            float scale = aspectRatioScreen / aspectRatioSeqTex;
            uv.y = uv1.y;
            uv.x = (uv1.x - 0.5) * scale + 0.5;
        } else {
            float scale = aspectRatioSeqTex / aspectRatioScreen;
            uv.x = uv1.x;
            uv.y = (uv1.y - 0.5) * scale + 0.5;
        }
    }

    if (u_edgeType == EDGE_TYPE_TILE) {
        uv = repeatTexCoord(uv);
    }
    else if (u_edgeType == EDGE_TYPE_MIRROR) {
        uv = mirrorTexCoord(uv);
    }

    vec4 result = getVideoColor(uv);
    if (u_edgeType == EDGE_TYPE_EMPTY) {
        result *= uvProtect(uv);
    }

    result *= u_opacity;

    gl_FragColor = result;
}
