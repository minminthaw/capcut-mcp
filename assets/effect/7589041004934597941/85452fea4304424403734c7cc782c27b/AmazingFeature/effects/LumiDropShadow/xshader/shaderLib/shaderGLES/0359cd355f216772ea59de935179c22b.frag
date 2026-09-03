precision highp float;
precision highp int;

uniform vec4 u_ScreenParams;
uniform mediump sampler2D u_inputTexture;
uniform float u_sigma;
uniform float u_step;
uniform float u_radius;
uniform vec2 u_dir;

varying vec2 v_p;

vec2 _f0()
{
    return u_ScreenParams.xy * (1080.0 / min(u_ScreenParams.x, u_ScreenParams.y));
}

float _f2(mediump sampler2D _p0, inout vec2 _p1)
{
    vec2 _89 = _p1;
    _p1 = step(vec2(0.0), _p1) * step(_p1, vec2(1.0));
    vec4 _t2 = texture2D(_p0, _89) * (_p1.x * _p1.y);
    return ((_t2.x + (_t2.y / 255.0)) + (_t2.z / 65025.0)) + (_t2.w / 16581375.0);
}

float _f3(float _p0, float _p1)
{
    return exp((((-0.5) * _p0) * _p0) / (_p1 * _p1));
}

vec4 _f1(inout float _p0)
{
    vec4 _t1 = vec4(0.0);
    _p0 *= 255.0;
    _t1.x = floor(_p0) / 255.0;
    _p0 = fract(_p0);
    _p0 *= 255.0;
    _t1.y = floor(_p0) / 255.0;
    _p0 = fract(_p0);
    _p0 *= 255.0;
    _t1.z = floor(_p0) / 255.0;
    _p0 = fract(_p0);
    _t1.w = _p0;
    return _t1;
}

void main()
{
    vec2 _139 = vec2(1.0) / _f0();
    vec2 param = v_p * _139;
    float _148 = _f2(u_inputTexture, param);
    float _t4 = _148;
    float param_1 = 0.0;
    float param_2 = u_sigma;
    float _t5 = _f3(param_1, param_2);
    for (mediump int _t6 = 1; _t6 < 1024; _t6++)
    {
        float _173 = u_step * float(_t6);
        if (_173 > u_radius)
        {
            break;
        }
        float param_3 = _173;
        float param_4 = u_sigma;
        float _186 = _f3(param_3, param_4);
        vec2 _193 = u_dir * _173;
        vec2 param_5 = (v_p + _193) * _139;
        float _198 = _f2(u_inputTexture, param_5);
        _t4 += (_186 * _198);
        vec2 param_6 = (v_p - _193) * _139;
        float _211 = _f2(u_inputTexture, param_6);
        _t4 += (_186 * _211);
        _t5 += (_186 * 2.0);
    }
    float param_7 = _t4 / _t5;
    vec4 _228 = _f1(param_7);
    gl_FragData[0] = _228;
}

