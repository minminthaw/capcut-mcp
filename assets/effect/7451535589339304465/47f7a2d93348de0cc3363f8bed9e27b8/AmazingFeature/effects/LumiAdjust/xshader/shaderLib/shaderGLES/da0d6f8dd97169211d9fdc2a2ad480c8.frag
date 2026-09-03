precision highp float;
precision highp int;

uniform mediump sampler2D pLut1;
uniform mediump sampler2D pLut2;
uniform mediump sampler2D nLut1;
uniform mediump sampler2D nLut2;
uniform mediump sampler2D inputImageTexture;
uniform float ins;

varying vec2 v_uv;

vec3 _f0(vec3 _p0)
{
    vec4 _83 = mix(vec4(_p0.zy, -1.0, 0.666666686534881591796875), vec4(_p0.yz, 0.0, -0.3333333432674407958984375), vec4(step(_p0.z, _p0.y)));
    vec4 _t1 = _83;
    vec4 _t2 = mix(vec4(_83.xyw, _p0.x), vec4(_p0.x, _83.yzx), vec4(step(_t1.x, _p0.x)));
    float _118 = _t2.x - min(_t2.w, _t2.y);
    return vec3(abs(_t2.z + ((_t2.w - _t2.y) / ((6.0 * _118) + 1.0000000133514319600180897396058e-10))), _118 / (_t2.x + 1.0000000133514319600180897396058e-10), _t2.x);
}

float _f4(float _p0, float _p1)
{
    float _t8 = 1.0 - (_p0 / _p1);
    if (_p0 >= _p1)
    {
        _t8 = 0.0;
    }
    return _t8;
}

float _f2(float _p0, mediump sampler2D _p1, float _p2)
{
    return texture2D(_p1, vec2(_p0, _p2)).x;
}

vec3 _f1(vec3 _p0)
{
    return mix(vec3(1.0), clamp(abs((fract(_p0.xxx + vec3(1.0, 0.666666686534881591796875, 0.3333333432674407958984375)) * 6.0) - vec3(3.0)) - vec3(1.0), vec3(0.0), vec3(1.0)), vec3(_p0.y)) * _p0.z;
}

vec3 _f3(vec3 _p0, mediump sampler2D _p1, float _p2)
{
    return vec3(texture2D(_p1, vec2(_p0.x, _p2)).x, texture2D(_p1, vec2(_p0.y, _p2)).x, texture2D(_p1, vec2(_p0.z, _p2)).x);
}

vec3 _f5(vec3 _p0, float _p1)
{
    vec3 param = _p0;
    vec3 _t9 = _f0(param);
    float param_1 = _t9.z;
    float param_2 = 0.800000011920928955078125;
    float param_3 = _t9.z;
    float param_4 = _p1;
    _t9.z = _f2(param_3, pLut1, param_4);
    vec3 param_5 = _t9;
    vec3 param_6 = mix(_p0, _f1(param_5), vec3(_f4(param_1, param_2)));
    float param_7 = _p1;
    return _f3(param_6, pLut2, param_7);
}

vec3 _f6(vec3 _p0, float _p1)
{
    vec3 param = _p0;
    vec3 _t13 = _f0(param);
    float param_1 = _t13.z;
    float param_2 = 0.89999997615814208984375;
    float param_3 = _t13.z;
    float param_4 = _p1;
    _t13.z = mix(_t13.z, _f2(param_3, nLut1, param_4), _f4(param_1, param_2));
    vec3 param_5 = _t13;
    vec3 param_6 = _f1(param_5);
    float param_7 = _p1;
    return _f3(param_6, nLut2, param_7);
}

void main()
{
    mediump vec4 _317 = texture2D(inputImageTexture, v_uv);
    vec4 _t17 = _317;
    float _325 = (ins - 0.5) * 2.0;
    float _328 = abs(_325);
    vec3 param = _317.xyz;
    float param_1 = _328;
    vec3 param_2 = _t17.xyz;
    float param_3 = _328;
    vec3 _348 = mix(_f6(param_2, param_3), _f5(param, param_1), vec3(step(0.0, _325)));
    _t17.x = _348.x;
    _t17.y = _348.y;
    _t17.z = _348.z;
    gl_FragData[0] = vec4(_t17);
}

