precision highp float;
precision highp int;

uniform float u_Steps;
uniform float u_Sample;
uniform float u_Angle;
uniform float u_ExpandFlag;
uniform vec4 u_ScreenParams;
uniform mediump sampler2D u_InputTex;

varying vec2 uv0;

float _f0(float _p0, float _p1)
{
    return (0.3989399969577789306640625 * exp((((-0.5) * _p0) * _p0) / (_p1 * _p1))) / _p1;
}

vec4 _f1(mediump sampler2D _p0, vec2 _p1, vec2 _p2)
{
    float param = 0.0;
    float param_1 = 4.0;
    float _48 = _f0(param, param_1);
    vec4 _t2 = vec4(0.0);
    vec2 _58 = _p2 * u_Steps;
    float _t8 = _48;
    for (mediump int _t10 = 1; _t10 <= 1024; _t10++)
    {
        if (float(_t10) > u_Sample)
        {
            break;
        }
        mediump float _100 = float(_t10);
        float param_2 = (_100 / u_Sample) * 15.0;
        float param_3 = 4.0;
        float _129 = _f0(param_2, param_3);
        _t2 = (_t2 + (pow(texture2D(_p0, _p1 + (_58 * _100)), vec4(2.2000000476837158203125)) * _129)) + (pow(texture2D(_p0, _p1 + (_58 * float(-_t10))), vec4(2.2000000476837158203125)) * _129);
        _t8 += (_129 * 2.0);
    }
    return clamp(pow((_t2 + (pow(texture2D(_p0, _p1), vec4(2.2000000476837158203125)) * _48)) / vec4(_t8), vec4(0.454545438289642333984375)), vec4(0.0), vec4(1.0));
}

void main()
{
    float _177 = (u_Angle * 3.141592502593994140625) / 180.0;
    vec2 param = uv0;
    vec2 param_1 = vec2(cos(_177), sin(_177)) / ((u_ScreenParams.xy * ((1.0 + (u_ExpandFlag * 0.4000000059604644775390625)) * 720.0)) / vec2(min(u_ScreenParams.x, u_ScreenParams.y)));
    gl_FragData[0] = _f1(u_InputTex, param, param_1);
}

