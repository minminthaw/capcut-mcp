precision highp float;
varying highp vec2 uv;
uniform sampler2D u_inputTex;
uniform float u_baseTexWidth;
uniform float u_baseTexHeight;
uniform float u_blurSize;
uniform float u_lightIns;
uniform float u_intensity;
uniform float u_regionIns;
uniform float u_quality;
uniform float u_scaleX;
uniform float u_scaleY;
uniform float u_angle;

/* Math 2D Transformations */
mat2 rotate2d(in float angle)
{
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}
float sdHeart(in vec2 p)
{
    return p.x * p.x + pow((p.y + 1.5 - 2.3 * sqrt(abs(p.x))), 2.);
}
float sdf(vec2 uv)
{
    vec2 newUV = uv;

    return step(sdHeart(uv), 75.);
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
    // oriCol.rgb = vec3(1.0);
    vec4 maxCol = oriCol;
    vec4 bokeh = pow(oriCol, vec4(9.0)) * amount + .4;
    vec4 sumCol = vec4(0.);
    vec4 sumWeight = bokeh;
    mat2 rotMat = rotate2d(u_angle);
    vec2 unitUV = vec2(2., 1.5) * 11. / 9. * vec2(u_scaleX, u_scaleY) * vec2(blurSize);
    vec2 screenOffset = 1. / screenSize;

    float blurStep = mix(2.0, 0.5, u_intensity) * mix(2.0, 1.0, u_quality);
    float blurRadius = 10. / blurStep * mix(0.7, 1.0, u_quality);
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
            vec2 tempVec = vec2(mix(-9., 9., i / blurRadius), mix(-7., 11., j / blurRadius));
            // tempVec = vec2(0.);
            if (sdf(tempVec) < 0.5) {
                continue;
            }
            tempVec -= vec2(0.,1.5);
            vec2 tempUV = textureCoordinate - 0.5 * tempVec  * unitUV * rotMat * screenOffset;
            vec4 tempCol = texture2D(inputTexture, (tempUV));
            maxCol = max(maxCol, tempCol * maxRegionIns);
            bokeh = pow(tempCol, vec4(9.0)) * amount + .4;
            bokeh *= u_regionIns;
            sumCol += bokeh * tempCol;
            sumWeight += bokeh;
        }
    }

    float heartRadius = floor(24. / blurStep * mix(0.3, 1.0, clamp(u_quality * 1.5, 0.0 ,1.0)));
    heartRadius = max(heartRadius,7.);
    heartRadius += mod(heartRadius, 2.) + 1.; // make sure (i/heartRadius)!= 0.5
    for (float i = 0.; i < 70.; i++) {
        if (i > heartRadius || u_intensity < 0.01) {
            break;
        }
        float tempI = i / heartRadius;
        if (tempI < 0.15) {
            tempI = mix(0.0, 0.05, tempI / 0.15);
        } else if (tempI < 0.85) {
            tempI = mix(0.05, 0.95, (tempI - 0.15) / 0.7);
        } else {
            tempI = mix(0.95, 1.0, (tempI - 0.85) / 0.15);
        }
        float x = mix(-8.66, 8.66, tempI); // sqrt(75)=8.66
        if (75. - x * x < 0.) {
            continue;
        }
        float y = sqrt(75. - x * x) - 1.5 + 2.3 * sqrt(abs(x)) - 1.5;
        vec2 tempVec = vec2(x, y);
        vec2 tempUV = textureCoordinate - 0.5 * tempVec  * unitUV * rotMat * screenOffset;
        vec4 tempCol = texture2D(inputTexture, (tempUV));
        maxCol = max(maxCol, tempCol);
        bokeh = pow(tempCol, vec4(9.0)) * amount + .4;
        sumCol += bokeh * tempCol;
        sumWeight += bokeh;
    }

    for (float i = 0.; i < 70.; i++) {
        if (i > heartRadius || u_intensity < 0.01) {
            break;
        }
        float tempI = i / heartRadius;
        if (tempI < 0.15) {
            tempI = mix(0.0, 0.05, tempI / 0.15);
        } else if (tempI < 0.85) {
            tempI = mix(0.05, 0.95, (tempI - 0.15) / 0.7);
        } else {
            tempI = mix(0.95, 1.0, (tempI - 0.85) / 0.15);
        }
        float x = mix(-8.66, 8.66, tempI); // sqrt(75)=8.66
        if (75. - x * x < 0.) {
            continue;
        }
        float y = -sqrt(75. - x * x) - 1.5 + 2.3 * sqrt(abs(x)) + smoothstep(1.3, 0.0, abs(x)) * 0.7 - 1.5;
        vec2 tempVec = vec2(x, y);
        vec2 tempUV = textureCoordinate - 0.5 * tempVec  * unitUV * rotMat * screenOffset;
        vec4 tempCol = texture2D(inputTexture, (tempUV));
        maxCol = max(maxCol, tempCol);
        bokeh = pow(tempCol, vec4(9.0)) * amount + .4;
        sumCol += bokeh * tempCol;
        sumWeight += bokeh;
    }

    vec4 resultCol = clamp(sumCol / sumWeight, 0., 1.);
    return vec4(mix(resultCol, maxCol, clamp(resultCol * u_lightIns, 0.0, 1.0)));
}

void main()
{
    vec2 screenSize = vec2(u_baseTexWidth, u_baseTexHeight) / min(u_baseTexWidth, u_baseTexHeight) * 720.;
    gl_FragColor = blur(u_inputTex, uv, u_blurSize, screenSize);
}
