precision mediump float;
uniform sampler2D u_inputTex;
uniform vec2 u_ScreenSize;
uniform float u_kernelSize;

varying vec2 uv0;

const float ITERATIONS = 15.0;
const float NormSize = 240.0;

float uvProtect(vec2 uvTemp)
{
    return step(0., uvTemp.x) * step(0., uvTemp.y) * step(uvTemp.x, 1.0) * step(uvTemp.y, 1.0);
}

float getColor(sampler2D tex, vec2 coord)
{
    vec4 color = texture2D(tex, coord);
    return color.r;
}

void main()
{
    vec2 mySize = u_ScreenSize.xy / min(u_ScreenSize.x, u_ScreenSize.y) * NormSize;
    vec2 unit = (abs(u_kernelSize) / ITERATIONS) / mySize;

    vec4 color = texture2D(u_inputTex, uv0);
    float res = getColor(u_inputTex, uv0);
    float resMax = res;
    float resMin = res;
    float ori = res;

    for (float i = 1.0; i <= ITERATIONS; i += 1.0) {
        float tmp = getColor(u_inputTex, uv0 + vec2(i * unit.x, 0.0));
        resMax = max(resMax, tmp);
        resMin = min(resMin, tmp);
        tmp = getColor(u_inputTex, uv0 + vec2(-i * unit.x, 0.0));
        resMax = max(resMax, tmp);
        resMin = min(resMin, tmp);
    }

    gl_FragColor = vec4(resMax, resMin, ori, 1.0);
}