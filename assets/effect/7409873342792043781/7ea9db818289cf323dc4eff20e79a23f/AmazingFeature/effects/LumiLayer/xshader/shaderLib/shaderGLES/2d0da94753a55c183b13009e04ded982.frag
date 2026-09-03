precision highp float;
precision highp int;

uniform float u_mirrorEdge;
uniform mediump sampler2D inputTex;
uniform float u_alpha;

varying vec2 v_uv;

vec2 _f1(vec2 _p0)
{
    return abs(mod(_p0 - vec2(1.0), vec2(2.0)) - vec2(1.0));
}

float _f0(vec2 _p0)
{
    vec2 _t0 = step(vec2(0.0), _p0) * step(_p0, vec2(1.0));
    return _t0.x * _t0.y;
}

void main()
{
    float _54 = step(u_mirrorEdge, 0.5);
    vec2 param = v_uv;
    vec2 _66 = (v_uv * _54) + (_f1(param) * (1.0 - _54));
    vec2 param_1 = _66;
    gl_FragData[0] = (texture2D(inputTex, _66) * u_alpha) * _f0(param_1);
}

