precision highp float;
varying highp vec2 uv0;
uniform sampler2D u_inputTex;
uniform float u_baseTexWidth;
uniform float u_baseTexHeight;
uniform float u_blurSize;
uniform float u_lightIns;
uniform float u_intensity;
uniform float u_regionIns;
uniform float u_quality;

#ifndef lineNum
#define lineNum 5
#endif
uniform vec2 u_posVec[10];

vec2 getPos(int i)
{
    if (i == 0) {
        return u_posVec[0];
    }
    if (i == 1) {
        return u_posVec[1];
    }
    if (i == 2) {
        return u_posVec[2];
    }
    if (i == 3) {
        return u_posVec[3];
    }
    if (i == 4) {
        return u_posVec[4];
    }
    if (i == 5) {
        return u_posVec[5];
    }
    if (i == 6) {
        return u_posVec[6];
    }
    if (i == 7) {
        return u_posVec[7];
    }
    if (i == 8) {
        return u_posVec[8];
    }
    if (i == 9) {
        return u_posVec[9];
    }
}
mat2 rot2(float angle)
{
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

float side(vec2 p, vec2 a, vec2 b)
{
    vec2 pa = p - a, ba = b - a;
    return step(cross(vec3(pa, 0), vec3(ba, 0)).z, 0.0);
}

float sdf(vec2 uv)
{
    vec2 newUV = uv;
    float d = side(newUV, getPos(lineNum), u_posVec[0]);
    for (int i = 0; i < lineNum; i++) {
        d *= side(newUV, getPos(i), getPos(i + 1));
    }
    return d;
}

vec2 flipUV(vec2 uv)
{
    return abs(mod(uv + 1., 2.) - 1.0);
}

vec4 blur(sampler2D inputTexture, vec2 textureCoordinate, float blurSize, vec2 screenSize)
{
    if (u_intensity < 0.01) {
        return texture2D(inputTexture, textureCoordinate);
    }
    float amount = 539.45;
    vec4 oriCol = vec4(0.);
    vec4 maxCol = oriCol;
    vec4 bokeh = pow(oriCol, vec4(9.0)) * amount + .4;
    vec4 sumCol = vec4(0.);
    vec4 sumWeight = bokeh;
    vec2 unitUV = vec2(2., 2.) * vec2(blurSize) / screenSize;

    float blurStep = mix(2.0, 0.5, u_intensity) * mix(2.0, 1.0, u_quality);
    float blurRadius = 12. / blurStep * mix(0.65, 1.0, u_quality);
    blurRadius = max(5., blurRadius);
    float maxRegionIns = mix(0.7, 1.0, u_regionIns);
    for (float i = 0.; i < 30.; i++) {
        if (i > blurRadius || u_intensity < 0.3) {
            break;
        }
        for (float j = 0.; j < 30.; j++) {
            if (j > blurRadius) {
                break;
            }
            vec2 tempVec = vec2(mix(-11., 11., i / blurRadius), mix(-11., 11., j / blurRadius));
            if (sdf(tempVec) < 0.5) {
                continue;
            }
            vec4 tempCol = texture2D(inputTexture, (textureCoordinate - 0.5 * tempVec * unitUV));
            maxCol = max(maxCol, tempCol * maxRegionIns);
            bokeh = pow(tempCol, vec4(9.0)) * amount + .4;
            bokeh *= u_regionIns;
            sumCol += bokeh * tempCol;
            sumWeight += bokeh;
        }
    }
    for (int j = 0; j < lineNum; j++) {
        float lineLength = length(getPos(j) - getPos(j + 1)) / 1.5 * mix(0.5, 1.0, clamp(u_quality * 1.5, 0.0 ,1.0));
        // lineLength = floor(lineLength);
        lineLength = max(lineLength , 3.);
        for (float i = 0.; i < 40.; i++) {
            float p = i * blurStep;
            if (p > lineLength) {
                break;
            }
            vec2 tempVec = mix(getPos(j), getPos(j + 1), p / lineLength);
            vec4 tempCol = texture2D(inputTexture, (textureCoordinate - 0.5 * tempVec * unitUV));
            maxCol = max(maxCol, tempCol);
            bokeh = pow(tempCol, vec4(9.0)) * amount + .4;
            sumCol += bokeh * tempCol;
            sumWeight += bokeh;
        }
    }

    vec4 resultCol = clamp(sumCol / sumWeight, 0., 1.);
    return vec4(mix(resultCol, maxCol, clamp(resultCol * u_lightIns, 0.0, 1.0)));
}

void main()
{
    vec2 screenSize = vec2(u_baseTexWidth, u_baseTexHeight) / min(u_baseTexWidth, u_baseTexHeight) * 720.;
    gl_FragColor = blur(u_inputTex, uv0, u_blurSize, screenSize);
}
