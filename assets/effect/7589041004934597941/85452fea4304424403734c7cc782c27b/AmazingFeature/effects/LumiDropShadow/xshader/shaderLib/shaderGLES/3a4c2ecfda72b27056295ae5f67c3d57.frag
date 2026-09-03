precision highp float;
precision highp int;

uniform float u_scale;
uniform mediump sampler2D u_inputTexture;

varying vec2 v_uv;

vec4 _f1(mediump sampler2D _p0, inout vec2 _p1)
{
    vec2 _64 = _p1;
    _p1 = step(vec2(0.0), _p1) * step(_p1, vec2(1.0));
    return (texture2D(_p0, _64) * _p1.x) * _p1.y;
}

vec4 _f0(inout float _p0)
{
    vec4 _t0 = vec4(0.0);
    _p0 *= 255.0;
    _t0.x = floor(_p0) / 255.0;
    _p0 = fract(_p0);
    _p0 *= 255.0;
    _t0.y = floor(_p0) / 255.0;
    _p0 = fract(_p0);
    _p0 *= 255.0;
    _t0.z = floor(_p0) / 255.0;
    _p0 = fract(_p0);
    _t0.w = _p0;
    return _t0;
}

void main()
{
    vec2 param = ((v_uv - vec2(0.5)) / vec2(u_scale)) + vec2(0.5);
    vec4 _102 = _f1(u_inputTexture, param);
    float param_1 = _102.w;
    vec4 _105 = _f0(param_1);
    gl_FragData[0] = _105;
}

