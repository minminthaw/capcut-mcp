precision highp float;
precision highp int;

uniform mediump int u_enableMatte;
uniform mediump sampler2D u_maskTexture;
uniform mediump int u_matteMode;
uniform mediump int u_blendMode;
uniform mediump int u_layerType;
uniform mediump int u_hasMatte;
uniform float u_layerOpacity;
uniform mediump int u_hasBlend;
uniform mediump int u_hasBaseTexture;
uniform mediump sampler2D u_baseTexure;
uniform mediump int u_hasSourceTexture;
uniform mediump int u_hasTrs;
uniform mat4 u_mvMat;
uniform mat4 u_pMat;
uniform float u_mirrorEdge;
uniform mediump sampler2D u_sourceTexture;
uniform float u_alpha;

varying vec2 uv0;

vec3 _2206;

vec4 _f7(vec3 _p0, vec3 _p1, vec3 _p2, vec3 _p3, vec3 _p4)
{
    vec3 _404 = _p3 - _p2;
    vec3 _408 = _p4 - _p2;
    vec3 _412 = cross(_p1, _408);
    float _416 = dot(_404, _412);
    if (_416 <= 1.0000000116860974230803549289703e-07)
    {
        return vec4(-1.0);
    }
    vec3 _428 = _p0 - _p2;
    float _434 = dot(_428, _412) / _416;
    if ((_434 < 0.0) || (_434 > 1.0))
    {
        return vec4(-1.0);
    }
    vec3 _446 = cross(_428, _404);
    float _452 = dot(_p1, _446) / _416;
    bool _454 = _452 < 0.0;
    bool _462;
    if (!_454)
    {
        _462 = (_434 + _452) > 1.0;
    }
    else
    {
        _462 = _454;
    }
    if (_462)
    {
        return vec4(-1.0);
    }
    return vec4(_434, _452, dot(_408, _446) / _416, 1.0);
}

vec2 _f8(mat4 _p0, mat4 _p1, vec2 _p2)
{
    vec3 _501 = (_p0 * vec4(10.0000095367431640625, -10.0, 0.0, 1.0)).xyz;
    vec3 _507 = (_p0 * vec4(10.0, -10.0000095367431640625, 0.0, 1.0)).xyz;
    vec3 _512 = (_p0 * vec4(-10.0, 10.0000095367431640625, 0.0, 1.0)).xyz;
    vec3 _517 = (_p0 * vec4(-10.0000095367431640625, 10.0, 0.0, 1.0)).xyz;
    vec4 _527 = _p1 * vec4((_p2 * 2.0) - vec2(1.0), 0.0, 1.0);
    vec4 _t20 = _527;
    vec3 _543 = normalize((_527.xyz / vec3(_t20.w)) - vec3(0.0));
    vec3 param = vec3(0.0);
    vec3 param_1 = _543;
    vec3 _551 = (_p0 * vec4(-10.0, -10.0, 0.0, 1.0)).xyz;
    vec3 param_2 = _551;
    vec3 param_3 = _501;
    vec3 param_4 = _512;
    vec4 _t24 = _f7(param, param_1, param_2, param_3, param_4);
    vec3 param_5 = vec3(0.0);
    vec3 param_6 = _543;
    vec3 param_7 = _517;
    vec3 param_8 = _507;
    vec3 _568 = (_p0 * vec4(10.0, 10.0, 0.0, 1.0)).xyz;
    vec3 param_9 = _568;
    vec4 _t25 = _f7(param_5, param_6, param_7, param_8, param_9);
    vec3 param_10 = vec3(0.0);
    vec3 param_11 = _543;
    vec3 param_12 = _551;
    vec3 param_13 = _512;
    vec3 param_14 = _501;
    vec4 _t26 = _f7(param_10, param_11, param_12, param_13, param_14);
    vec3 param_15 = vec3(0.0);
    vec3 param_16 = _543;
    vec3 param_17 = _517;
    vec3 param_18 = _568;
    vec3 param_19 = _507;
    vec4 _t27 = _f7(param_15, param_16, param_17, param_18, param_19);
    vec2 _732 = (((((((vec2(-4.5) * ((1.0 - _t24.x) - _t24.y)) + (vec2(5.5, -4.5) * _t24.x)) + (vec2(-4.5, 5.5) * _t24.y)) * step(0.0, _t24.w)) + ((((vec2(-4.5, 5.5) * ((1.0 - _t25.x) - _t25.y)) + (vec2(5.5, -4.5) * _t25.x)) + (vec2(5.5) * _t25.y)) * (step(_t24.w, 0.0) * step(0.0, _t25.w)))) + ((((vec2(-4.5) * ((1.0 - _t26.x) - _t26.y)) + (vec2(-4.5, 5.5) * _t26.x)) + (vec2(5.5, -4.5) * _t26.y)) * ((step(_t24.w, 0.0) * step(_t25.w, 0.0)) * step(0.0, _t26.w)))) + ((((vec2(-4.5, 5.5) * ((1.0 - _t27.x) - _t27.y)) + (vec2(5.5) * _t27.x)) + (vec2(5.5, -4.5) * _t27.y)) * (((step(_t24.w, 0.0) * step(_t25.w, 0.0)) * step(_t26.w, 0.0)) * step(0.0, _t27.w)))) + (vec2(-10000.0) * (((step(_t24.w, 0.0) * step(_t25.w, 0.0)) * step(_t26.w, 0.0)) * step(_t27.w, 0.0)));
    return _732;
}

vec2 _f10(vec2 _p0)
{
    return abs(mod(_p0 - vec2(1.0), vec2(2.0)) - vec2(1.0));
}

float _f9(vec2 _p0)
{
    vec2 _t33 = step(vec2(0.0), _p0) * step(_p0, vec2(1.0));
    return _t33.x * _t33.y;
}

float _f5(vec3 _p0)
{
    return dot(_p0, vec3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625));
}

vec4 _f11(vec4 _p0)
{
    vec4 _t34 = vec4(0.0);
    if (u_enableMatte == 1)
    {
        _t34 = texture2D(u_maskTexture, uv0);
    }
    float _t35 = _t34.w;
    if (u_matteMode == 1)
    {
        vec3 param = _t34.xyz;
        _t35 = _f5(param);
    }
    else
    {
        if (u_matteMode == 2)
        {
            _t35 = 1.0 - _t34.w;
        }
        else
        {
            if (u_matteMode == 3)
            {
                vec3 param_1 = _t34.xyz;
                _t35 = 1.0 - _f5(param_1);
            }
        }
    }
    return _p0 * _t35;
}

float _f1(float _p0, float _p1)
{
    float _199;
    if (_p0 < 0.5)
    {
        _199 = _p1 - (((1.0 - (2.0 * _p0)) * _p1) * (1.0 - _p1));
    }
    else
    {
        float _218;
        if (_p1 < 0.25)
        {
            _218 = _p1 + ((((2.0 * _p0) - 1.0) * _p1) * ((((16.0 * _p1) - 12.0) * _p1) + 3.0));
        }
        else
        {
            _218 = _p1 + (((2.0 * _p0) - 1.0) * (sqrt(_p1) - _p1));
        }
        _199 = _218;
    }
    return _199;
}

vec3 _f2(vec3 _p0, vec3 _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return vec3(_f1(param, param_1), _f1(param_2, param_3), _f1(param_4, param_5));
}

float _f3(float _p0, float _p1)
{
    float _283;
    if (_p0 < 0.5)
    {
        _283 = (2.0 * _p0) * _p1;
    }
    else
    {
        _283 = 1.0 - ((2.0 * (1.0 - _p0)) * (1.0 - _p1));
    }
    return _283;
}

vec3 _f4(vec3 _p0, vec3 _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return vec3(_f3(param, param_1), _f3(param_2, param_3), _f3(param_4, param_5));
}

float _f13(vec3 _p0)
{
    return max(_p0.x, max(_p0.y, _p0.z)) - min(_p0.x, min(_p0.y, _p0.z));
}

vec3 _f12(inout vec3 _p0, float _p1)
{
    if (_p0.z > _p0.x)
    {
        _p0.y = ((_p0.y - _p0.x) * _p1) / (_p0.z - _p0.x);
        _p0.z = _p1;
    }
    else
    {
        _p0.y = 0.0;
        _p0.z = 0.0;
    }
    _p0.x = 0.0;
    return _p0;
}

vec3 _f14(inout vec3 _p0, float _p1)
{
    bool _870 = _p0.x <= _p0.y;
    bool _878;
    if (_870)
    {
        _878 = _p0.x <= _p0.z;
    }
    else
    {
        _878 = _870;
    }
    if (_878)
    {
        if (_p0.y <= _p0.z)
        {
            vec3 param = _p0;
            float param_1 = _p1;
            vec3 _892 = _f12(param, param_1);
            _p0 = _892;
        }
        else
        {
            vec3 param_2 = _p0.xzy;
            float param_3 = _p1;
            vec3 _899 = _f12(param_2, param_3);
            _p0 = vec3(_899.x, _899.z, _899.y);
        }
    }
    else
    {
        bool _907 = _p0.y <= _p0.x;
        bool _915;
        if (_907)
        {
            _915 = _p0.y <= _p0.z;
        }
        else
        {
            _915 = _907;
        }
        if (_915)
        {
            if (_p0.x <= _p0.z)
            {
                vec3 param_4 = _p0.yxz;
                float param_5 = _p1;
                vec3 _930 = _f12(param_4, param_5);
                _p0 = vec3(_930.y, _930.x, _930.z);
            }
            else
            {
                vec3 param_6 = _p0.yzx;
                float param_7 = _p1;
                vec3 _939 = _f12(param_6, param_7);
                _p0 = vec3(_939.z, _939.x, _939.y);
            }
        }
        else
        {
            if (_p0.x <= _p0.y)
            {
                vec3 param_8 = _p0.zxy;
                float param_9 = _p1;
                vec3 _955 = _f12(param_8, param_9);
                _p0 = vec3(_955.y, _955.z, _955.x);
            }
            else
            {
                vec3 param_10 = _p0.zyx;
                float param_11 = _p1;
                vec3 _964 = _f12(param_10, param_11);
                _p0 = vec3(_964.z, _964.y, _964.x);
            }
        }
    }
    return _p0;
}

vec3 _f6(inout vec3 _p0, inout float _p1)
{
    vec3 param = _p0;
    _p0 += vec3(_p1 - _f5(param));
    vec3 param_1 = _p0;
    _p1 = _f5(param_1);
    float _354 = min(_p0.x, min(_p0.y, _p0.z));
    float _357 = _p0.x;
    float _359 = _p0.y;
    float _361 = _p0.z;
    float _363 = max(_357, max(_359, _361));
    if (_354 < 0.0)
    {
        _p0 = mix(vec3(_p1, _p1, _p1), _p0, vec3(_p1 / (_p1 - _354)));
    }
    if (_363 > 1.0)
    {
        _p0 = mix(vec3(_p1, _p1, _p1), _p0, vec3((1.0 - _p1) / (_363 - _p1)));
    }
    return _p0;
}

vec3 _f15(vec3 _p0, vec3 _p1)
{
    vec3 param = _p1;
    vec3 param_1 = _p0;
    float param_2 = _f13(param);
    vec3 _976 = _f14(param_1, param_2);
    vec3 param_3 = _p1;
    vec3 param_4 = _976;
    float param_5 = _f5(param_3);
    vec3 _982 = _f6(param_4, param_5);
    return _982;
}

vec3 _f16(vec3 _p0, vec3 _p1)
{
    vec3 param = _p0;
    vec3 param_1 = _p1;
    float param_2 = _f13(param);
    vec3 _991 = _f14(param_1, param_2);
    vec3 param_3 = _p1;
    vec3 param_4 = _991;
    float param_5 = _f5(param_3);
    vec3 _997 = _f6(param_4, param_5);
    return _997;
}

vec3 _f17(vec3 _p0, vec3 _p1)
{
    vec3 param = _p1;
    vec3 param_1 = _p0;
    float param_2 = _f5(param);
    vec3 _1006 = _f6(param_1, param_2);
    return _1006;
}

float _f21(float _p0, float _p1)
{
    if (_p1 >= 1.0)
    {
        return 1.0;
    }
    else
    {
        if (_p0 <= 0.0)
        {
            return 0.0;
        }
        else
        {
            return 1.0 - min(1.0, (1.0 - _p1) / _p0);
        }
    }
}

vec3 _f22(vec3 _p0, vec3 _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return vec3(_f21(param, param_1), _f21(param_2, param_3), _f21(param_4, param_5));
}

float _f23(float _p0, float _p1)
{
    return max(0.0, (_p1 + _p0) - 1.0);
}

vec3 _f24(vec3 _p0, vec3 _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return vec3(_f23(param, param_1), _f23(param_2, param_3), _f23(param_4, param_5));
}

float _f25(float _p0, float _p1)
{
    if (_p1 <= 0.0)
    {
        return 0.0;
    }
    if (_p0 >= 1.0)
    {
        return 1.0;
    }
    else
    {
        return min(1.0, _p1 / (1.0 - _p0));
    }
}

vec3 _f26(vec3 _p0, vec3 _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return vec3(_f25(param, param_1), _f25(param_2, param_3), _f25(param_4, param_5));
}

float _f27(float _p0, float _p1)
{
    return min(1.0, _p1 + _p0);
}

vec3 _f28(vec3 _p0, vec3 _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return vec3(_f27(param, param_1), _f27(param_2, param_3), _f27(param_4, param_5));
}

float _f29(float _p0, float _p1)
{
    float _1194;
    if (_p0 <= 0.5)
    {
        float param = _p1;
        float param_1 = 2.0 * _p0;
        _1194 = _f21(param, param_1);
    }
    else
    {
        float param_2 = _p1;
        float param_3 = 2.0 * (_p0 - 0.5);
        _1194 = _f25(param_2, param_3);
    }
    return _1194;
}

vec3 _f30(vec3 _p0, vec3 _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return vec3(_f29(param, param_1), _f29(param_2, param_3), _f29(param_4, param_5));
}

float _f31(float _p0, float _p1)
{
    float _1240;
    if (_p0 <= 0.5)
    {
        float param = _p1;
        float param_1 = 2.0 * _p0;
        _1240 = _f23(param, param_1);
    }
    else
    {
        float param_2 = _p1;
        float param_3 = 2.0 * (_p0 - 0.5);
        _1240 = _f27(param_2, param_3);
    }
    return _1240;
}

vec3 _f32(vec3 _p0, vec3 _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return vec3(_f31(param, param_1), _f31(param_2, param_3), _f31(param_4, param_5));
}

float _f33(float _p0, float _p1)
{
    float _1286;
    if (_p0 <= 0.5)
    {
        _1286 = min(_p1, 2.0 * _p0);
    }
    else
    {
        _1286 = max(_p1, 2.0 * (_p0 - 0.5));
    }
    return _1286;
}

vec3 _f34(vec3 _p0, vec3 _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return vec3(_f33(param, param_1), _f33(param_2, param_3), _f33(param_4, param_5));
}

float _f35(float _p0, float _p1)
{
    return float((_p1 + _p0) >= 1.0);
}

vec3 _f36(vec3 _p0, vec3 _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return vec3(_f35(param, param_1), _f35(param_2, param_3), _f35(param_4, param_5));
}

float _f37(float _p0, float _p1)
{
    float _1359;
    if (_p0 > 0.0)
    {
        _1359 = min(1.0, _p1 / _p0);
    }
    else
    {
        _1359 = 1.0;
    }
    return _1359;
}

vec3 _f38(vec3 _p0, vec3 _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return vec3(_f37(param, param_1), _f37(param_2, param_3), _f37(param_4, param_5));
}

vec3 _f20(vec3 _p0, vec3 _p1)
{
    vec3 param = _p0;
    vec3 param_1 = _p1;
    float param_2 = _f5(param);
    vec3 _1042 = _f6(param_1, param_2);
    return _1042;
}

vec3 _f19(vec3 _p0, vec3 _p1)
{
    vec3 param = _p1;
    vec3 param_1 = _p0;
    bvec3 _1032 = bvec3(_f5(param) > _f5(param_1));
    return vec3(_1032.x ? _p1.x : _p0.x, _1032.y ? _p1.y : _p0.y, _1032.z ? _p1.z : _p0.z);
}

vec3 _f18(vec3 _p0, vec3 _p1)
{
    vec3 param = _p1;
    vec3 param_1 = _p0;
    bvec3 _1019 = bvec3(_f5(param) <= _f5(param_1));
    return vec3(_1019.x ? _p1.x : _p0.x, _1019.y ? _p1.y : _p0.y, _1019.z ? _p1.z : _p0.z);
}

float _f0(vec2 _p0)
{
    return fract(sin(dot(_p0, vec2(12.98980045318603515625, 78.233001708984375))) * 43758.546875);
}

vec4 _f39(inout vec4 _p0, inout vec4 _p1)
{
    float _1395 = _p0.w;
    vec4 _1398 = _p0;
    vec3 _1401 = _1398.xyz / vec3(max(_1395, 9.9999997473787516355514526367188e-06));
    _p0.x = _1401.x;
    _p0.y = _1401.y;
    _p0.z = _1401.z;
    float _1409 = _p1.w;
    vec4 _1411 = _p1;
    vec3 _1414 = _1411.xyz / vec3(max(_1409, 9.9999997473787516355514526367188e-06));
    _p1.x = _1414.x;
    _p1.y = _1414.y;
    _p1.z = _1414.z;
    vec4 _t36 = _p1;
    if (u_blendMode == 1)
    {
        vec3 _1432 = _p0.xyz + _p1.xyz;
        _t36.x = _1432.x;
        _t36.y = _1432.y;
        _t36.z = _1432.z;
    }
    else
    {
        if (u_blendMode == 2)
        {
            vec3 _1448 = _p0.xyz * _p1.xyz;
            _t36.x = _1448.x;
            _t36.y = _1448.y;
            _t36.z = _1448.z;
        }
        else
        {
            if (u_blendMode == 3)
            {
                vec3 _1465 = abs(_p0.xyz - _p1.xyz);
                _t36.x = _1465.x;
                _t36.y = _1465.y;
                _t36.z = _1465.z;
            }
            else
            {
                if (u_blendMode == 4)
                {
                    float _1481;
                    if (_p1.x < 0.5)
                    {
                        _1481 = (2.0 * _p1.x) * _p0.x;
                    }
                    else
                    {
                        _1481 = 1.0 - ((2.0 * (1.0 - _p1.x)) * (1.0 - _p0.x));
                    }
                    float _1504;
                    if (_p1.y < 0.5)
                    {
                        _1504 = (2.0 * _p1.y) * _p0.y;
                    }
                    else
                    {
                        _1504 = 1.0 - ((2.0 * (1.0 - _p1.y)) * (1.0 - _p0.y));
                    }
                    float _1527;
                    if (_p1.z < 0.5)
                    {
                        _1527 = (2.0 * _p1.z) * _p0.z;
                    }
                    else
                    {
                        _1527 = 1.0 - ((2.0 * (1.0 - _p1.z)) * (1.0 - _p0.z));
                    }
                    vec3 _1547 = vec3(_1481, _1504, _1527);
                    _t36.x = _1547.x;
                    _t36.y = _1547.y;
                    _t36.z = _1547.z;
                }
                else
                {
                    if (u_blendMode == 5)
                    {
                        vec3 _1564 = min(_p0.xyz, _p1.xyz);
                        _t36.x = _1564.x;
                        _t36.y = _1564.y;
                        _t36.z = _1564.z;
                    }
                    else
                    {
                        if (u_blendMode == 6)
                        {
                            vec3 _1581 = max(_p0.xyz, _p1.xyz);
                            _t36.x = _1581.x;
                            _t36.y = _1581.y;
                            _t36.z = _1581.z;
                        }
                        else
                        {
                            if (u_blendMode == 7)
                            {
                                vec3 param = _p0.xyz;
                                vec3 param_1 = _p1.xyz;
                                vec3 _1600 = _f2(param, param_1);
                                _t36.x = _1600.x;
                                _t36.y = _1600.y;
                                _t36.z = _1600.z;
                            }
                            else
                            {
                                if (u_blendMode == 8)
                                {
                                    vec3 param_2 = _p0.xyz;
                                    vec3 param_3 = _p1.xyz;
                                    vec3 _1619 = _f4(param_2, param_3);
                                    _t36.x = _1619.x;
                                    _t36.y = _1619.y;
                                    _t36.z = _1619.z;
                                }
                                else
                                {
                                    if (u_blendMode == 9)
                                    {
                                        vec3 param_4 = _p0.xyz;
                                        vec3 param_5 = _p1.xyz;
                                        vec3 _1638 = _f15(param_4, param_5);
                                        _t36.x = _1638.x;
                                        _t36.y = _1638.y;
                                        _t36.z = _1638.z;
                                    }
                                    else
                                    {
                                        if (u_blendMode == 10)
                                        {
                                            vec3 param_6 = _p0.xyz;
                                            vec3 param_7 = _p1.xyz;
                                            vec3 _1657 = _f16(param_6, param_7);
                                            _t36.x = _1657.x;
                                            _t36.y = _1657.y;
                                            _t36.z = _1657.z;
                                        }
                                        else
                                        {
                                            if (u_blendMode == 11)
                                            {
                                                vec3 param_8 = _p0.xyz;
                                                vec3 param_9 = _p1.xyz;
                                                vec3 _1676 = _f17(param_8, param_9);
                                                _t36.x = _1676.x;
                                                _t36.y = _1676.y;
                                                _t36.z = _1676.z;
                                            }
                                            else
                                            {
                                                if (u_blendMode == 12)
                                                {
                                                    vec3 _1699 = (_p0.xyz + _p1.xyz) - (_p0.xyz * _p1.xyz);
                                                    _t36.x = _1699.x;
                                                    _t36.y = _1699.y;
                                                    _t36.z = _1699.z;
                                                }
                                                else
                                                {
                                                    if (u_blendMode == 13)
                                                    {
                                                        vec3 param_10 = _p0.xyz;
                                                        vec3 param_11 = _p1.xyz;
                                                        vec3 _1718 = _f22(param_10, param_11);
                                                        _t36.x = _1718.x;
                                                        _t36.y = _1718.y;
                                                        _t36.z = _1718.z;
                                                    }
                                                    else
                                                    {
                                                        if (u_blendMode == 14)
                                                        {
                                                            vec3 param_12 = _p0.xyz;
                                                            vec3 param_13 = _p1.xyz;
                                                            vec3 _1737 = _f24(param_12, param_13);
                                                            _t36.x = _1737.x;
                                                            _t36.y = _1737.y;
                                                            _t36.z = _1737.z;
                                                        }
                                                        else
                                                        {
                                                            if (u_blendMode == 15)
                                                            {
                                                                vec3 param_14 = _p0.xyz;
                                                                vec3 param_15 = _p1.xyz;
                                                                vec3 _1756 = _f26(param_14, param_15);
                                                                _t36.x = _1756.x;
                                                                _t36.y = _1756.y;
                                                                _t36.z = _1756.z;
                                                            }
                                                            else
                                                            {
                                                                if (u_blendMode == 16)
                                                                {
                                                                    vec3 param_16 = _p0.xyz;
                                                                    vec3 param_17 = _p1.xyz;
                                                                    vec3 _1775 = _f28(param_16, param_17);
                                                                    _t36.x = _1775.x;
                                                                    _t36.y = _1775.y;
                                                                    _t36.z = _1775.z;
                                                                }
                                                                else
                                                                {
                                                                    if (u_blendMode == 17)
                                                                    {
                                                                        vec3 param_18 = _p0.xyz;
                                                                        vec3 param_19 = _p1.xyz;
                                                                        vec3 _1794 = _f30(param_18, param_19);
                                                                        _t36.x = _1794.x;
                                                                        _t36.y = _1794.y;
                                                                        _t36.z = _1794.z;
                                                                    }
                                                                    else
                                                                    {
                                                                        if (u_blendMode == 18)
                                                                        {
                                                                            vec3 param_20 = _p0.xyz;
                                                                            vec3 param_21 = _p1.xyz;
                                                                            vec3 _1813 = _f32(param_20, param_21);
                                                                            _t36.x = _1813.x;
                                                                            _t36.y = _1813.y;
                                                                            _t36.z = _1813.z;
                                                                        }
                                                                        else
                                                                        {
                                                                            if (u_blendMode == 19)
                                                                            {
                                                                                vec3 param_22 = _p0.xyz;
                                                                                vec3 param_23 = _p1.xyz;
                                                                                vec3 _1832 = _f34(param_22, param_23);
                                                                                _t36.x = _1832.x;
                                                                                _t36.y = _1832.y;
                                                                                _t36.z = _1832.z;
                                                                            }
                                                                            else
                                                                            {
                                                                                if (u_blendMode == 20)
                                                                                {
                                                                                    vec3 param_24 = _p0.xyz;
                                                                                    vec3 param_25 = _p1.xyz;
                                                                                    vec3 _1851 = _f36(param_24, param_25);
                                                                                    _t36.x = _1851.x;
                                                                                    _t36.y = _1851.y;
                                                                                    _t36.z = _1851.z;
                                                                                }
                                                                                else
                                                                                {
                                                                                    if (u_blendMode == 21)
                                                                                    {
                                                                                        vec3 _1875 = (_p1.xyz + _p0.xyz) - ((_p1.xyz * 2.0) * _p0.xyz);
                                                                                        _t36.x = _1875.x;
                                                                                        _t36.y = _1875.y;
                                                                                        _t36.z = _1875.z;
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        if (u_blendMode == 22)
                                                                                        {
                                                                                            vec3 _1893 = max(vec3(0.0), _p1.xyz - _p0.xyz);
                                                                                            _t36.x = _1893.x;
                                                                                            _t36.y = _1893.y;
                                                                                            _t36.z = _1893.z;
                                                                                        }
                                                                                        else
                                                                                        {
                                                                                            if (u_blendMode == 23)
                                                                                            {
                                                                                                vec3 param_26 = _p0.xyz;
                                                                                                vec3 param_27 = _p1.xyz;
                                                                                                vec3 _1912 = _f38(param_26, param_27);
                                                                                                _t36.x = _1912.x;
                                                                                                _t36.y = _1912.y;
                                                                                                _t36.z = _1912.z;
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                if (u_blendMode == 24)
                                                                                                {
                                                                                                    vec3 param_28 = _p0.xyz;
                                                                                                    vec3 param_29 = _p1.xyz;
                                                                                                    vec3 _1931 = _f20(param_28, param_29);
                                                                                                    _t36.x = _1931.x;
                                                                                                    _t36.y = _1931.y;
                                                                                                    _t36.z = _1931.z;
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    if (u_blendMode == 25)
                                                                                                    {
                                                                                                        vec3 param_30 = _p0.xyz;
                                                                                                        vec3 param_31 = _p1.xyz;
                                                                                                        vec3 _1950 = _f19(param_30, param_31);
                                                                                                        _t36.x = _1950.x;
                                                                                                        _t36.y = _1950.y;
                                                                                                        _t36.z = _1950.z;
                                                                                                    }
                                                                                                    else
                                                                                                    {
                                                                                                        if (u_blendMode == 26)
                                                                                                        {
                                                                                                            vec3 param_32 = _p0.xyz;
                                                                                                            vec3 param_33 = _p1.xyz;
                                                                                                            vec3 _1969 = _f18(param_32, param_33);
                                                                                                            _t36.x = _1969.x;
                                                                                                            _t36.y = _1969.y;
                                                                                                            _t36.z = _1969.z;
                                                                                                        }
                                                                                                        else
                                                                                                        {
                                                                                                            if (u_blendMode == 27)
                                                                                                            {
                                                                                                                bool _1984 = _p0.w == 1.0;
                                                                                                                bool _2000;
                                                                                                                if (!_1984)
                                                                                                                {
                                                                                                                    bool _1990 = _p0.w > 0.0;
                                                                                                                    bool _1999;
                                                                                                                    if (_1990)
                                                                                                                    {
                                                                                                                        vec2 param_34 = uv0;
                                                                                                                        _1999 = _p0.w > _f0(param_34);
                                                                                                                    }
                                                                                                                    else
                                                                                                                    {
                                                                                                                        _1999 = _1990;
                                                                                                                    }
                                                                                                                    _2000 = _1999;
                                                                                                                }
                                                                                                                else
                                                                                                                {
                                                                                                                    _2000 = _1984;
                                                                                                                }
                                                                                                                if (_2000)
                                                                                                                {
                                                                                                                    _t36.x = _p0.xyz.x;
                                                                                                                    _t36.y = _p0.xyz.y;
                                                                                                                    _t36.z = _p0.xyz.z;
                                                                                                                }
                                                                                                            }
                                                                                                            else
                                                                                                            {
                                                                                                                _t36.x = _p0.xyz.x;
                                                                                                                _t36.y = _p0.xyz.y;
                                                                                                                _t36.z = _p0.xyz.z;
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    vec4 _t37 = vec4(0.0);
    if (u_layerType == 1)
    {
        float _t38 = 1.0;
        if (u_hasMatte == 1)
        {
            vec4 param_35 = vec4(1.0);
            _t38 = _f11(param_35).w;
        }
        vec4 _2051 = mix(_p1, vec4(_t36.xyz, _p0.w), vec4(u_layerOpacity * _t38));
        _t37 = _2051;
        float _2053 = _t37.w;
        vec3 _2056 = _2051.xyz * _2053;
        _t37.x = _2056.x;
        _t37.y = _2056.y;
        _t37.z = _2056.z;
    }
    else
    {
        vec3 _2091 = (((_p1.xyz * _p1.w) * (1.0 - _p0.w)) + ((_p0.xyz * _p0.w) * (1.0 - _p1.w))) + (_t36.xyz * (_p0.w * _p1.w));
        _t37.x = _2091.x;
        _t37.y = _2091.y;
        _t37.z = _2091.z;
        _t37.w = _p0.w + (_p1.w * (1.0 - _p0.w));
    }
    return _t37;
}

void main()
{
    vec4 _t39 = vec4(0.0);
    bool _2114 = u_hasBlend == 1;
    if (_2114)
    {
        if (u_hasBaseTexture == 1)
        {
            _t39 = texture2D(u_baseTexure, uv0);
        }
        if (u_hasSourceTexture == 0)
        {
            gl_FragData[0] = _t39;
            return;
        }
    }
    vec4 _t40 = vec4(0.0);
    if (u_hasTrs == 1)
    {
        mat4 param = u_mvMat;
        mat4 param_1 = u_pMat;
        vec2 param_2 = uv0;
        vec2 _2152 = _f8(param, param_1, param_2);
        float _2155 = step(u_mirrorEdge, 0.5);
        vec2 param_3 = _2152;
        vec2 _2165 = (_2152 * _2155) + (_f10(param_3) * (1.0 - _2155));
        vec2 param_4 = _2165;
        _t40 = (texture2D(u_sourceTexture, _2165) * u_alpha) * _f9(param_4);
    }
    else
    {
        if (u_hasSourceTexture == 1)
        {
            _t40 = texture2D(u_sourceTexture, uv0);
        }
    }
    if ((u_layerType != 1) && (u_hasMatte == 1))
    {
        vec4 param_5 = _t40;
        _t40 = _f11(param_5);
    }
    if (_2114)
    {
        vec4 param_6 = _t40;
        vec4 param_7 = _t39;
        vec4 _2203 = _f39(param_6, param_7);
        _t40 = _2203;
    }
    gl_FragData[0] = _t40;
}

