precision highp float;
precision highp int;

uniform vec4 u_ScreenParams;
uniform mediump sampler2D inputImage;
uniform mediump sampler2D lut;
uniform float intensitySharp;

varying vec2 v_uv;

vec4 _f0(vec4 _p0, float _p1)
{
    if (_p1 == 0.0)
    {
        return _p0;
    }
    vec4 _t2 = _p0;
    float _64 = max(0.0, min((max(u_ScreenParams.y, u_ScreenParams.x) - 1000.0) / 2000.0, 1.0));
    float _77 = ((abs(_p1) * 4.0) * (((1.0 - _64) * 0.64999997615814208984375) + (_64 * 1.2000000476837158203125))) + 1.0;
    float _82 = (1.0 - _77) * 0.25;
    mediump vec4 _98 = texture2D(inputImage, v_uv + vec2((-1.0) / u_ScreenParams.x, 0.0));
    vec4 _t7 = _98;
    float _103 = _t7.w;
    vec3 _107 = _98.xyz / vec3(_103 + 0.001000000047497451305389404296875);
    _t7.x = _107.x;
    _t7.y = _107.y;
    _t7.z = _107.z;
    mediump vec4 _122 = texture2D(inputImage, v_uv + vec2(1.0 / u_ScreenParams.x, 0.0));
    vec4 _t8 = _122;
    float _126 = _t8.w;
    vec3 _129 = _122.xyz / vec3(_126 + 0.001000000047497451305389404296875);
    _t8.x = _129.x;
    _t8.y = _129.y;
    _t8.z = _129.z;
    mediump vec4 _143 = texture2D(inputImage, v_uv + vec2(0.0, 1.0 / u_ScreenParams.y));
    vec4 _t9 = _143;
    float _147 = _t9.w;
    vec3 _150 = _143.xyz / vec3(_147 + 0.001000000047497451305389404296875);
    _t9.x = _150.x;
    _t9.y = _150.y;
    _t9.z = _150.z;
    mediump vec4 _164 = texture2D(inputImage, v_uv + vec2(0.0, (-1.0) / u_ScreenParams.y));
    vec4 _t10 = _164;
    float _168 = _t10.w;
    vec3 _171 = _164.xyz / vec3(_168 + 0.001000000047497451305389404296875);
    _t10.x = _171.x;
    _t10.y = _171.y;
    _t10.z = _171.z;
    vec3 _201 = ((((_p0.xyz * _77) + (_t7.xyz * _82)) + (_t8.xyz * _82)) + (_t10.xyz * _82)) + (_t9.xyz * _82);
    _t2.x = _201.x;
    _t2.y = _201.y;
    _t2.z = _201.z;
    vec4 _208 = _t2;
    vec4 _211 = clamp(_208, vec4(0.0), vec4(1.0));
    _t2 = _211;
    return _211;
}

vec4 _f1(vec4 _p0)
{
    float _219 = _p0.y * 16.0;
    float _226 = 0.02941176481544971466064453125 + (_p0.x * 0.941176474094390869140625);
    float _236 = (((_p0.z * 16.0) / 17.0) + 0.02941176481544971466064453125) / 17.0;
    return mix(texture2D(lut, vec2(_236 + (floor(_219) / 17.0), _226)), texture2D(lut, vec2(_236 + (ceil(_219) / 17.0), _226)), vec4(fract(_219)));
}

void main()
{
    vec4 _t18 = texture2D(inputImage, v_uv);
    if (_t18.w > 0.0)
    {
        float _279 = _t18.w;
        vec4 _280 = _t18;
        vec3 _283 = _280.xyz / vec3(_279);
        _t18.x = _283.x;
        _t18.y = _283.y;
        _t18.z = _283.z;
    }
    float _292 = _t18.w;
    if (abs(intensitySharp) > 0.001000000047497451305389404296875)
    {
        vec4 param = _t18;
        float param_1 = intensitySharp;
        _t18 = _f0(param, param_1);
    }
    vec4 param_2 = _t18;
    gl_FragData[0] = vec4(_f1(param_2).xyz, 1.0) * _292;
}

