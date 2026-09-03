precision highp float;
precision highp int;

uniform vec4 u_ScreenParams;
uniform float normSize;
uniform float kernelSize;
uniform float channel;
uniform mediump sampler2D oriImageTexture;
uniform mediump sampler2D inputImageTexture;

varying vec2 v_uv;

void main()
{
    vec2 _t1 = vec2(abs(kernelSize / 5.0)) / ((u_ScreenParams.xy / vec2(min(u_ScreenParams.x, u_ScreenParams.y))) * normSize);
    if (abs(kernelSize) < 0.00999999977648258209228515625)
    {
        if (channel < 0.5)
        {
            gl_FragData[0] = texture2D(oriImageTexture, v_uv);
        }
        else
        {
            vec4 _t2 = texture2D(oriImageTexture, v_uv);
            gl_FragData[0] = vec4(vec3(((0.2989999949932098388671875 * _t2.x) + (0.58700001239776611328125 * _t2.y)) + (0.114000000059604644775390625 * _t2.z)), _t2.w);
        }
    }
    else
    {
        gl_FragData[0] = ((((((((texture2D(inputImageTexture, v_uv) * 0.20000000298023223876953125) + (texture2D(inputImageTexture, v_uv + vec2(_t1.x, 0.0)) * 0.1500000059604644775390625)) + (texture2D(inputImageTexture, v_uv + vec2(-_t1.x, 0.0)) * 0.1500000059604644775390625)) + (texture2D(inputImageTexture, v_uv + vec2(0.0, _t1.y)) * 0.1500000059604644775390625)) + (texture2D(inputImageTexture, v_uv + vec2(0.0, -_t1.y)) * 0.1500000059604644775390625)) + (texture2D(inputImageTexture, v_uv + vec2(_t1.x, _t1.y)) * 0.0500000007450580596923828125)) + (texture2D(inputImageTexture, v_uv + vec2(_t1.x, -_t1.y)) * 0.0500000007450580596923828125)) + (texture2D(inputImageTexture, v_uv + vec2(-_t1.x, _t1.y)) * 0.0500000007450580596923828125)) + (texture2D(inputImageTexture, v_uv + vec2(-_t1.x, -_t1.y)) * 0.0500000007450580596923828125);
    }
}

