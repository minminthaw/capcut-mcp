precision mediump float;
uniform sampler2D u_inputTex;
uniform sampler2D u_facialMaskTex;

uniform vec2 u_ScreenSize;
uniform float u_kernelSize;

varying vec2 uv0;

const float ITERATIONS = 15.0;
const float NormSize = 240.0;

void main()
{
    vec2 mySize = u_ScreenSize.xy / min(u_ScreenSize.x, u_ScreenSize.y) * NormSize;
    vec2 unit = (abs(u_kernelSize) / ITERATIONS) / mySize;

    vec4 last = texture2D(u_inputTex, uv0);
    float resMax = last.x;
    float resMin = last.y;
    float ori = last.z;
    float res = ori;

    for (float i = 1.0; i <= ITERATIONS; i += 1.0) {
        vec4 tmp = texture2D(u_inputTex, uv0 + vec2(0.0, i * unit.y));
        resMax = max(resMax, tmp.x);
        resMin = min(resMin, tmp.y);
        tmp = texture2D(u_inputTex, uv0 + vec2(0.0, -i * unit.y));
        resMax = max(resMax, tmp.x);
        resMin = min(resMin, tmp.y);
    }

    if (u_kernelSize >= 0.0) {
        res = resMax;
    } else {
        res = resMin;
    }

    if (u_kernelSize < 0.0) {
        float diff = resMax - ori;
        res = res - diff * (abs(u_kernelSize) / 5.0);
        res = clamp(res, 0.0, 1.0);
        res = pow(res, 1.0 + abs(u_kernelSize) / 4.0);
    }
    float facialMask = texture2D(u_facialMaskTex, uv0).b;
    gl_FragColor = vec4(res, res * facialMask, facialMask, 1.0);
}