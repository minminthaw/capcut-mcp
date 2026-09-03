precision highp float;
precision highp int;

uniform float u_angle;
uniform float u_distance;
uniform vec2 u_screenSize;
uniform float u_scale;
uniform mediump sampler2D u_shadowTexture;
uniform mediump sampler2D u_shadowMaskTexture;
uniform mediump sampler2D u_inputTexture;
uniform vec4 u_color;
uniform float u_opacity;
uniform float u_inputOpacity;

varying vec2 v_uv;

vec2 _f1(vec2 _p0)
{
    float _85 = (u_angle * 3.141590118408203125) / 180.0;
    return _p0 + ((vec2(cos(_85), sin(_85)) * u_distance) / vec2(u_screenSize.x));
}

float _f0(mediump sampler2D _p0, inout vec2 _p1)
{
    vec2 _35 = _p1;
    _p1 = step(vec2(0.0), _p1) * step(_p1, vec2(1.0));
    vec4 _t0 = texture2D(_p0, _35) * (_p1.x * _p1.y);
    return ((_t0.x + (_t0.y / 255.0)) + (_t0.z / 65025.0)) + (_t0.w / 16581375.0);
}

vec4 _f2(mediump sampler2D _p0, inout vec2 _p1)
{
    vec2 _108 = _p1;
    _p1 = step(vec2(0.0), _p1) * step(_p1, vec2(1.0));
    return (texture2D(_p0, _108) * _p1.x) * _p1.y;
}

vec4 _f3(vec4 _p0, vec4 _p1)
{
    return _p1 + (_p0 * (1.0 - _p1.w));
}

void main()
{
    vec2 param = v_uv;
    vec2 _138 = _f1(param);
    vec2 param_1 = ((_138 - vec2(0.5)) * u_scale) + vec2(0.5);
    float _153 = _f0(u_shadowTexture, param_1);
    vec4 _t7 = texture2D(u_shadowMaskTexture, _138);
    vec2 param_2 = v_uv;
    vec4 _164 = _f2(u_inputTexture, param_2);
    vec4 param_3 = ((u_color * _153) * u_opacity) * _t7.x;
    vec4 param_4 = _164 * u_inputOpacity;
    gl_FragData[0] = _f3(param_3, param_4);
}

