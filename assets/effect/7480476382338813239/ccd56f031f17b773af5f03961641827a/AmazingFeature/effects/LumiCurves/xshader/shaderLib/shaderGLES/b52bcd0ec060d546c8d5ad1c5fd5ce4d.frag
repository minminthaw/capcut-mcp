precision highp float;
precision highp int;

uniform mediump sampler2D lutY;
uniform float intensityY;
uniform mediump sampler2D lutR;
uniform float intensityR;
uniform mediump sampler2D lutG;
uniform float intensityG;
uniform mediump sampler2D lutB;
uniform float intensityB;
uniform mediump sampler2D inputImageTexture;

varying vec2 uv0;

float _f0(vec4 _p0)
{
    float _t0 = ((_p0.x * 255.0) + _p0.y) + (_p0.z / 255.0);
    float _53;
    if (_p0.w < 0.5)
    {
        _53 = _t0;
    }
    else
    {
        _53 = -_t0;
    }
    _t0 = _53;
    return _53;
}

vec4 _f2(vec4 _p0, vec4 _p1)
{
    vec4 _t6 = _p1;
    vec4 param = texture2D(lutR, vec2(_p0.x, 0.5));
    _t6.x = _f0(param);
    _t6.x = _p1.x + ((_t6.x - _p0.x) * intensityR);
    return _t6;
}

vec4 _f3(vec4 _p0, vec4 _p1)
{
    vec4 _t8 = _p1;
    vec4 param = texture2D(lutG, vec2(_p0.y, 0.5));
    _t8.y = _f0(param);
    _t8.y = _p1.y + ((_t8.y - _p0.y) * intensityG);
    return _t8;
}

vec4 _f4(vec4 _p0, vec4 _p1)
{
    vec4 _t10 = _p1;
    vec4 param = texture2D(lutB, vec2(_p0.z, 0.5));
    _t10.z = _f0(param);
    _t10.z = _p1.z + ((_t10.z - _p0.z) * intensityB);
    return _t10;
}

vec4 _f1(vec4 _p0, vec4 _p1)
{
    vec4 _t1 = _p1;
    float _80 = ((0.2125999927520751953125 * _p0.x) + (0.715200006961822509765625 * _p0.y)) + (0.072200000286102294921875 * _p0.z);
    vec4 param = texture2D(lutY, vec2(_80, 0.5));
    vec4 _119 = _t1;
    vec3 _122 = _119.xyz + vec3(((_f0(param) - _80) * intensityY) - ((((0.2125999927520751953125 * _p1.x) + (0.715200006961822509765625 * _p1.y)) + (0.072200000286102294921875 * _p1.z)) - _80));
    _t1.x = _122.x;
    _t1.y = _122.y;
    _t1.z = _122.z;
    return _t1;
}

void main()
{
    mediump vec4 _222 = texture2D(inputImageTexture, uv0);
    vec4 param = _222;
    vec4 param_1 = _222;
    vec4 param_2 = _222;
    vec4 param_3 = _f2(param, param_1);
    vec4 param_4 = _222;
    vec4 param_5 = _f3(param_2, param_3);
    vec4 param_6 = _222;
    vec4 param_7 = _f4(param_4, param_5);
    gl_FragData[0] = _f1(param_6, param_7);
}

