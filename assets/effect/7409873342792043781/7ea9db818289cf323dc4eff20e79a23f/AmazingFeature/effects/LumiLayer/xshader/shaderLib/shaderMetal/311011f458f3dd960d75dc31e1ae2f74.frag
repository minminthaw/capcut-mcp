#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int u_enableMatte;
    int u_matteMode;
    int u_blendMode;
    int u_layerType;
    int u_hasMatte;
    float u_layerOpacity;
    int u_hasBlend;
    int u_hasBaseTexture;
    int u_hasSourceTexture;
};

constant float3 _1786 = {};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(locn0)]];
};

static inline __attribute__((always_inline))
float _f5(thread const float3& _p0)
{
    return dot(_p0, float3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625));
}

static inline __attribute__((always_inline))
float4 _f7(thread const float4& _p0, constant int& u_enableMatte, texture2d<float> u_maskTexture, sampler u_maskTextureSmplr, thread float2& uv0, constant int& u_matteMode)
{
    if (u_enableMatte == 0)
    {
        return _p0;
    }
    float4 _397 = u_maskTexture.sample(u_maskTextureSmplr, uv0);
    float4 _t3 = _397;
    float _t4 = _t3.w;
    if (u_matteMode == 1)
    {
        float3 param = _397.xyz;
        _t4 = _f5(param);
    }
    else
    {
        if (u_matteMode == 2)
        {
            _t4 = 1.0 - _t3.w;
        }
        else
        {
            if (u_matteMode == 3)
            {
                float3 param_1 = _397.xyz;
                _t4 = 1.0 - _f5(param_1);
            }
        }
    }
    return _p0 * _t4;
}

static inline __attribute__((always_inline))
float _f1(thread const float& _p0, thread const float& _p1)
{
    float _176;
    if (_p0 < 0.5)
    {
        _176 = _p1 - (((1.0 - (2.0 * _p0)) * _p1) * (1.0 - _p1));
    }
    else
    {
        float _195;
        if (_p1 < 0.25)
        {
            _195 = _p1 + ((((2.0 * _p0) - 1.0) * _p1) * ((((16.0 * _p1) - 12.0) * _p1) + 3.0));
        }
        else
        {
            _195 = _p1 + (((2.0 * _p0) - 1.0) * (sqrt(_p1) - _p1));
        }
        _176 = _195;
    }
    return _176;
}

static inline __attribute__((always_inline))
float3 _f2(thread const float3& _p0, thread const float3& _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return float3(_f1(param, param_1), _f1(param_2, param_3), _f1(param_4, param_5));
}

static inline __attribute__((always_inline))
float _f3(thread const float& _p0, thread const float& _p1)
{
    float _260;
    if (_p0 < 0.5)
    {
        _260 = (2.0 * _p0) * _p1;
    }
    else
    {
        _260 = 1.0 - ((2.0 * (1.0 - _p0)) * (1.0 - _p1));
    }
    return _260;
}

static inline __attribute__((always_inline))
float3 _f4(thread const float3& _p0, thread const float3& _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return float3(_f3(param, param_1), _f3(param_2, param_3), _f3(param_4, param_5));
}

static inline __attribute__((always_inline))
float _f9(thread const float3& _p0)
{
    return fast::max(_p0.x, fast::max(_p0.y, _p0.z)) - fast::min(_p0.x, fast::min(_p0.y, _p0.z));
}

static inline __attribute__((always_inline))
float3 _f8(thread float3& _p0, thread const float& _p1)
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

static inline __attribute__((always_inline))
float3 _f10(thread float3& _p0, thread const float& _p1)
{
    bool _490 = _p0.x <= _p0.y;
    bool _498;
    if (_490)
    {
        _498 = _p0.x <= _p0.z;
    }
    else
    {
        _498 = _490;
    }
    if (_498)
    {
        if (_p0.y <= _p0.z)
        {
            float3 param = _p0;
            float param_1 = _p1;
            float3 _512 = _f8(param, param_1);
            _p0 = _512;
        }
        else
        {
            float3 param_2 = _p0.xzy;
            float param_3 = _p1;
            float3 _519 = _f8(param_2, param_3);
            _p0 = float3(_519.x, _519.z, _519.y);
        }
    }
    else
    {
        bool _527 = _p0.y <= _p0.x;
        bool _535;
        if (_527)
        {
            _535 = _p0.y <= _p0.z;
        }
        else
        {
            _535 = _527;
        }
        if (_535)
        {
            if (_p0.x <= _p0.z)
            {
                float3 param_4 = _p0.yxz;
                float param_5 = _p1;
                float3 _550 = _f8(param_4, param_5);
                _p0 = float3(_550.y, _550.x, _550.z);
            }
            else
            {
                float3 param_6 = _p0.yzx;
                float param_7 = _p1;
                float3 _559 = _f8(param_6, param_7);
                _p0 = float3(_559.z, _559.x, _559.y);
            }
        }
        else
        {
            if (_p0.x <= _p0.y)
            {
                float3 param_8 = _p0.zxy;
                float param_9 = _p1;
                float3 _575 = _f8(param_8, param_9);
                _p0 = float3(_575.y, _575.z, _575.x);
            }
            else
            {
                float3 param_10 = _p0.zyx;
                float param_11 = _p1;
                float3 _584 = _f8(param_10, param_11);
                _p0 = float3(_584.z, _584.y, _584.x);
            }
        }
    }
    return _p0;
}

static inline __attribute__((always_inline))
float3 _f6(thread float3& _p0, thread float& _p1)
{
    float3 param = _p0;
    _p0 += float3(_p1 - _f5(param));
    float3 param_1 = _p0;
    _p1 = _f5(param_1);
    float _331 = fast::min(_p0.x, fast::min(_p0.y, _p0.z));
    float _334 = _p0.x;
    float _336 = _p0.y;
    float _338 = _p0.z;
    float _340 = fast::max(_334, fast::max(_336, _338));
    if (_331 < 0.0)
    {
        _p0 = mix(float3(_p1, _p1, _p1), _p0, float3(_p1 / (_p1 - _331)));
    }
    if (_340 > 1.0)
    {
        _p0 = mix(float3(_p1, _p1, _p1), _p0, float3((1.0 - _p1) / (_340 - _p1)));
    }
    return _p0;
}

static inline __attribute__((always_inline))
float3 _f11(thread const float3& _p0, thread const float3& _p1)
{
    float3 param = _p1;
    float3 param_1 = _p0;
    float param_2 = _f9(param);
    float3 _596 = _f10(param_1, param_2);
    float3 param_3 = _p1;
    float3 param_4 = _596;
    float param_5 = _f5(param_3);
    float3 _602 = _f6(param_4, param_5);
    return _602;
}

static inline __attribute__((always_inline))
float3 _f12(thread const float3& _p0, thread const float3& _p1)
{
    float3 param = _p0;
    float3 param_1 = _p1;
    float param_2 = _f9(param);
    float3 _611 = _f10(param_1, param_2);
    float3 param_3 = _p1;
    float3 param_4 = _611;
    float param_5 = _f5(param_3);
    float3 _617 = _f6(param_4, param_5);
    return _617;
}

static inline __attribute__((always_inline))
float3 _f13(thread const float3& _p0, thread const float3& _p1)
{
    float3 param = _p1;
    float3 param_1 = _p0;
    float param_2 = _f5(param);
    float3 _626 = _f6(param_1, param_2);
    return _626;
}

static inline __attribute__((always_inline))
float _f17(thread const float& _p0, thread const float& _p1)
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
            return 1.0 - fast::min(1.0, (1.0 - _p1) / _p0);
        }
    }
}

static inline __attribute__((always_inline))
float3 _f18(thread const float3& _p0, thread const float3& _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return float3(_f17(param, param_1), _f17(param_2, param_3), _f17(param_4, param_5));
}

static inline __attribute__((always_inline))
float _f19(thread const float& _p0, thread const float& _p1)
{
    return fast::max(0.0, (_p1 + _p0) - 1.0);
}

static inline __attribute__((always_inline))
float3 _f20(thread const float3& _p0, thread const float3& _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return float3(_f19(param, param_1), _f19(param_2, param_3), _f19(param_4, param_5));
}

static inline __attribute__((always_inline))
float _f21(thread const float& _p0, thread const float& _p1)
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
        return fast::min(1.0, _p1 / (1.0 - _p0));
    }
}

static inline __attribute__((always_inline))
float3 _f22(thread const float3& _p0, thread const float3& _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return float3(_f21(param, param_1), _f21(param_2, param_3), _f21(param_4, param_5));
}

static inline __attribute__((always_inline))
float _f23(thread const float& _p0, thread const float& _p1)
{
    return fast::min(1.0, _p1 + _p0);
}

static inline __attribute__((always_inline))
float3 _f24(thread const float3& _p0, thread const float3& _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return float3(_f23(param, param_1), _f23(param_2, param_3), _f23(param_4, param_5));
}

static inline __attribute__((always_inline))
float _f25(thread const float& _p0, thread const float& _p1)
{
    float _814;
    if (_p0 <= 0.5)
    {
        float param = _p1;
        float param_1 = 2.0 * _p0;
        _814 = _f17(param, param_1);
    }
    else
    {
        float param_2 = _p1;
        float param_3 = 2.0 * (_p0 - 0.5);
        _814 = _f21(param_2, param_3);
    }
    return _814;
}

static inline __attribute__((always_inline))
float3 _f26(thread const float3& _p0, thread const float3& _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return float3(_f25(param, param_1), _f25(param_2, param_3), _f25(param_4, param_5));
}

static inline __attribute__((always_inline))
float _f27(thread const float& _p0, thread const float& _p1)
{
    float _860;
    if (_p0 <= 0.5)
    {
        float param = _p1;
        float param_1 = 2.0 * _p0;
        _860 = _f19(param, param_1);
    }
    else
    {
        float param_2 = _p1;
        float param_3 = 2.0 * (_p0 - 0.5);
        _860 = _f23(param_2, param_3);
    }
    return _860;
}

static inline __attribute__((always_inline))
float3 _f28(thread const float3& _p0, thread const float3& _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return float3(_f27(param, param_1), _f27(param_2, param_3), _f27(param_4, param_5));
}

static inline __attribute__((always_inline))
float _f29(thread const float& _p0, thread const float& _p1)
{
    float _906;
    if (_p0 <= 0.5)
    {
        _906 = fast::min(_p1, 2.0 * _p0);
    }
    else
    {
        _906 = fast::max(_p1, 2.0 * (_p0 - 0.5));
    }
    return _906;
}

static inline __attribute__((always_inline))
float3 _f30(thread const float3& _p0, thread const float3& _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return float3(_f29(param, param_1), _f29(param_2, param_3), _f29(param_4, param_5));
}

static inline __attribute__((always_inline))
float _f31(thread const float& _p0, thread const float& _p1)
{
    return float((_p1 + _p0) >= 1.0);
}

static inline __attribute__((always_inline))
float3 _f32(thread const float3& _p0, thread const float3& _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return float3(_f31(param, param_1), _f31(param_2, param_3), _f31(param_4, param_5));
}

static inline __attribute__((always_inline))
float _f33(thread const float& _p0, thread const float& _p1)
{
    float _979;
    if (_p0 > 0.0)
    {
        _979 = fast::min(1.0, _p1 / _p0);
    }
    else
    {
        _979 = 1.0;
    }
    return _979;
}

static inline __attribute__((always_inline))
float3 _f34(thread const float3& _p0, thread const float3& _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return float3(_f33(param, param_1), _f33(param_2, param_3), _f33(param_4, param_5));
}

static inline __attribute__((always_inline))
float3 _f16(thread const float3& _p0, thread const float3& _p1)
{
    float3 param = _p0;
    float3 param_1 = _p1;
    float param_2 = _f5(param);
    float3 _662 = _f6(param_1, param_2);
    return _662;
}

static inline __attribute__((always_inline))
float3 _f15(thread const float3& _p0, thread const float3& _p1)
{
    float3 param = _p1;
    float3 param_1 = _p0;
    return select(_p0, _p1, bool3(_f5(param) > _f5(param_1)));
}

static inline __attribute__((always_inline))
float3 _f14(thread const float3& _p0, thread const float3& _p1)
{
    float3 param = _p1;
    float3 param_1 = _p0;
    return select(_p0, _p1, bool3(_f5(param) <= _f5(param_1)));
}

static inline __attribute__((always_inline))
float _f0(thread const float2& _p0)
{
    return fract(sin(dot(_p0, float2(12.98980045318603515625, 78.233001708984375))) * 43758.546875);
}

static inline __attribute__((always_inline))
float4 _f35(thread float4& _p0, thread float4& _p1, constant int& u_enableMatte, texture2d<float> u_maskTexture, sampler u_maskTextureSmplr, thread float2& uv0, constant int& u_matteMode, constant int& u_blendMode, constant int& u_layerType, constant int& u_hasMatte, constant float& u_layerOpacity)
{
    float _1015 = _p0.w;
    float4 _1018 = _p0;
    float3 _1021 = _1018.xyz / float3(fast::max(_1015, 9.9999997473787516355514526367188e-06));
    _p0.x = _1021.x;
    _p0.y = _1021.y;
    _p0.z = _1021.z;
    float _1029 = _p1.w;
    float4 _1031 = _p1;
    float3 _1034 = _1031.xyz / float3(fast::max(_1029, 9.9999997473787516355514526367188e-06));
    _p1.x = _1034.x;
    _p1.y = _1034.y;
    _p1.z = _1034.z;
    float4 _t5 = _p1;
    if (u_blendMode == 1)
    {
        float3 _1052 = _p0.xyz + _p1.xyz;
        _t5.x = _1052.x;
        _t5.y = _1052.y;
        _t5.z = _1052.z;
    }
    else
    {
        if (u_blendMode == 2)
        {
            float3 _1068 = _p0.xyz * _p1.xyz;
            _t5.x = _1068.x;
            _t5.y = _1068.y;
            _t5.z = _1068.z;
        }
        else
        {
            if (u_blendMode == 3)
            {
                float3 _1085 = abs(_p0.xyz - _p1.xyz);
                _t5.x = _1085.x;
                _t5.y = _1085.y;
                _t5.z = _1085.z;
            }
            else
            {
                if (u_blendMode == 4)
                {
                    float _1101;
                    if (_p1.x < 0.5)
                    {
                        _1101 = (2.0 * _p1.x) * _p0.x;
                    }
                    else
                    {
                        _1101 = 1.0 - ((2.0 * (1.0 - _p1.x)) * (1.0 - _p0.x));
                    }
                    float _1124;
                    if (_p1.y < 0.5)
                    {
                        _1124 = (2.0 * _p1.y) * _p0.y;
                    }
                    else
                    {
                        _1124 = 1.0 - ((2.0 * (1.0 - _p1.y)) * (1.0 - _p0.y));
                    }
                    float _1147;
                    if (_p1.z < 0.5)
                    {
                        _1147 = (2.0 * _p1.z) * _p0.z;
                    }
                    else
                    {
                        _1147 = 1.0 - ((2.0 * (1.0 - _p1.z)) * (1.0 - _p0.z));
                    }
                    float3 _1167 = float3(_1101, _1124, _1147);
                    _t5.x = _1167.x;
                    _t5.y = _1167.y;
                    _t5.z = _1167.z;
                }
                else
                {
                    if (u_blendMode == 5)
                    {
                        float3 _1184 = fast::min(_p0.xyz, _p1.xyz);
                        _t5.x = _1184.x;
                        _t5.y = _1184.y;
                        _t5.z = _1184.z;
                    }
                    else
                    {
                        if (u_blendMode == 6)
                        {
                            float3 _1201 = fast::max(_p0.xyz, _p1.xyz);
                            _t5.x = _1201.x;
                            _t5.y = _1201.y;
                            _t5.z = _1201.z;
                        }
                        else
                        {
                            if (u_blendMode == 7)
                            {
                                float3 param = _p0.xyz;
                                float3 param_1 = _p1.xyz;
                                float3 _1220 = _f2(param, param_1);
                                _t5.x = _1220.x;
                                _t5.y = _1220.y;
                                _t5.z = _1220.z;
                            }
                            else
                            {
                                if (u_blendMode == 8)
                                {
                                    float3 param_2 = _p0.xyz;
                                    float3 param_3 = _p1.xyz;
                                    float3 _1239 = _f4(param_2, param_3);
                                    _t5.x = _1239.x;
                                    _t5.y = _1239.y;
                                    _t5.z = _1239.z;
                                }
                                else
                                {
                                    if (u_blendMode == 9)
                                    {
                                        float3 param_4 = _p0.xyz;
                                        float3 param_5 = _p1.xyz;
                                        float3 _1258 = _f11(param_4, param_5);
                                        _t5.x = _1258.x;
                                        _t5.y = _1258.y;
                                        _t5.z = _1258.z;
                                    }
                                    else
                                    {
                                        if (u_blendMode == 10)
                                        {
                                            float3 param_6 = _p0.xyz;
                                            float3 param_7 = _p1.xyz;
                                            float3 _1277 = _f12(param_6, param_7);
                                            _t5.x = _1277.x;
                                            _t5.y = _1277.y;
                                            _t5.z = _1277.z;
                                        }
                                        else
                                        {
                                            if (u_blendMode == 11)
                                            {
                                                float3 param_8 = _p0.xyz;
                                                float3 param_9 = _p1.xyz;
                                                float3 _1296 = _f13(param_8, param_9);
                                                _t5.x = _1296.x;
                                                _t5.y = _1296.y;
                                                _t5.z = _1296.z;
                                            }
                                            else
                                            {
                                                if (u_blendMode == 12)
                                                {
                                                    float3 _1319 = (_p0.xyz + _p1.xyz) - (_p0.xyz * _p1.xyz);
                                                    _t5.x = _1319.x;
                                                    _t5.y = _1319.y;
                                                    _t5.z = _1319.z;
                                                }
                                                else
                                                {
                                                    if (u_blendMode == 13)
                                                    {
                                                        float3 param_10 = _p0.xyz;
                                                        float3 param_11 = _p1.xyz;
                                                        float3 _1338 = _f18(param_10, param_11);
                                                        _t5.x = _1338.x;
                                                        _t5.y = _1338.y;
                                                        _t5.z = _1338.z;
                                                    }
                                                    else
                                                    {
                                                        if (u_blendMode == 14)
                                                        {
                                                            float3 param_12 = _p0.xyz;
                                                            float3 param_13 = _p1.xyz;
                                                            float3 _1357 = _f20(param_12, param_13);
                                                            _t5.x = _1357.x;
                                                            _t5.y = _1357.y;
                                                            _t5.z = _1357.z;
                                                        }
                                                        else
                                                        {
                                                            if (u_blendMode == 15)
                                                            {
                                                                float3 param_14 = _p0.xyz;
                                                                float3 param_15 = _p1.xyz;
                                                                float3 _1376 = _f22(param_14, param_15);
                                                                _t5.x = _1376.x;
                                                                _t5.y = _1376.y;
                                                                _t5.z = _1376.z;
                                                            }
                                                            else
                                                            {
                                                                if (u_blendMode == 16)
                                                                {
                                                                    float3 param_16 = _p0.xyz;
                                                                    float3 param_17 = _p1.xyz;
                                                                    float3 _1395 = _f24(param_16, param_17);
                                                                    _t5.x = _1395.x;
                                                                    _t5.y = _1395.y;
                                                                    _t5.z = _1395.z;
                                                                }
                                                                else
                                                                {
                                                                    if (u_blendMode == 17)
                                                                    {
                                                                        float3 param_18 = _p0.xyz;
                                                                        float3 param_19 = _p1.xyz;
                                                                        float3 _1414 = _f26(param_18, param_19);
                                                                        _t5.x = _1414.x;
                                                                        _t5.y = _1414.y;
                                                                        _t5.z = _1414.z;
                                                                    }
                                                                    else
                                                                    {
                                                                        if (u_blendMode == 18)
                                                                        {
                                                                            float3 param_20 = _p0.xyz;
                                                                            float3 param_21 = _p1.xyz;
                                                                            float3 _1433 = _f28(param_20, param_21);
                                                                            _t5.x = _1433.x;
                                                                            _t5.y = _1433.y;
                                                                            _t5.z = _1433.z;
                                                                        }
                                                                        else
                                                                        {
                                                                            if (u_blendMode == 19)
                                                                            {
                                                                                float3 param_22 = _p0.xyz;
                                                                                float3 param_23 = _p1.xyz;
                                                                                float3 _1452 = _f30(param_22, param_23);
                                                                                _t5.x = _1452.x;
                                                                                _t5.y = _1452.y;
                                                                                _t5.z = _1452.z;
                                                                            }
                                                                            else
                                                                            {
                                                                                if (u_blendMode == 20)
                                                                                {
                                                                                    float3 param_24 = _p0.xyz;
                                                                                    float3 param_25 = _p1.xyz;
                                                                                    float3 _1471 = _f32(param_24, param_25);
                                                                                    _t5.x = _1471.x;
                                                                                    _t5.y = _1471.y;
                                                                                    _t5.z = _1471.z;
                                                                                }
                                                                                else
                                                                                {
                                                                                    if (u_blendMode == 21)
                                                                                    {
                                                                                        float3 _1495 = (_p1.xyz + _p0.xyz) - ((_p1.xyz * 2.0) * _p0.xyz);
                                                                                        _t5.x = _1495.x;
                                                                                        _t5.y = _1495.y;
                                                                                        _t5.z = _1495.z;
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        if (u_blendMode == 22)
                                                                                        {
                                                                                            float3 _1514 = fast::max(float3(0.0), _p1.xyz - _p0.xyz);
                                                                                            _t5.x = _1514.x;
                                                                                            _t5.y = _1514.y;
                                                                                            _t5.z = _1514.z;
                                                                                        }
                                                                                        else
                                                                                        {
                                                                                            if (u_blendMode == 23)
                                                                                            {
                                                                                                float3 param_26 = _p0.xyz;
                                                                                                float3 param_27 = _p1.xyz;
                                                                                                float3 _1533 = _f34(param_26, param_27);
                                                                                                _t5.x = _1533.x;
                                                                                                _t5.y = _1533.y;
                                                                                                _t5.z = _1533.z;
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                if (u_blendMode == 24)
                                                                                                {
                                                                                                    float3 param_28 = _p0.xyz;
                                                                                                    float3 param_29 = _p1.xyz;
                                                                                                    float3 _1552 = _f16(param_28, param_29);
                                                                                                    _t5.x = _1552.x;
                                                                                                    _t5.y = _1552.y;
                                                                                                    _t5.z = _1552.z;
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    if (u_blendMode == 25)
                                                                                                    {
                                                                                                        float3 param_30 = _p0.xyz;
                                                                                                        float3 param_31 = _p1.xyz;
                                                                                                        float3 _1571 = _f15(param_30, param_31);
                                                                                                        _t5.x = _1571.x;
                                                                                                        _t5.y = _1571.y;
                                                                                                        _t5.z = _1571.z;
                                                                                                    }
                                                                                                    else
                                                                                                    {
                                                                                                        if (u_blendMode == 26)
                                                                                                        {
                                                                                                            float3 param_32 = _p0.xyz;
                                                                                                            float3 param_33 = _p1.xyz;
                                                                                                            float3 _1590 = _f14(param_32, param_33);
                                                                                                            _t5.x = _1590.x;
                                                                                                            _t5.y = _1590.y;
                                                                                                            _t5.z = _1590.z;
                                                                                                        }
                                                                                                        else
                                                                                                        {
                                                                                                            if (u_blendMode == 27)
                                                                                                            {
                                                                                                                bool _1605 = _p0.w == 1.0;
                                                                                                                bool _1621;
                                                                                                                if (!_1605)
                                                                                                                {
                                                                                                                    bool _1611 = _p0.w > 0.0;
                                                                                                                    bool _1620;
                                                                                                                    if (_1611)
                                                                                                                    {
                                                                                                                        float2 param_34 = uv0;
                                                                                                                        _1620 = _p0.w > _f0(param_34);
                                                                                                                    }
                                                                                                                    else
                                                                                                                    {
                                                                                                                        _1620 = _1611;
                                                                                                                    }
                                                                                                                    _1621 = _1620;
                                                                                                                }
                                                                                                                else
                                                                                                                {
                                                                                                                    _1621 = _1605;
                                                                                                                }
                                                                                                                if (_1621)
                                                                                                                {
                                                                                                                    _t5.x = _p0.xyz.x;
                                                                                                                    _t5.y = _p0.xyz.y;
                                                                                                                    _t5.z = _p0.xyz.z;
                                                                                                                }
                                                                                                            }
                                                                                                            else
                                                                                                            {
                                                                                                                _t5.x = _p0.xyz.x;
                                                                                                                _t5.y = _p0.xyz.y;
                                                                                                                _t5.z = _p0.xyz.z;
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
    float4 _t6 = float4(0.0);
    if (u_layerType == 1)
    {
        float _t7 = 1.0;
        if (u_hasMatte == 1)
        {
            float4 param_35 = float4(1.0);
            _t7 = _f7(param_35, u_enableMatte, u_maskTexture, u_maskTextureSmplr, uv0, u_matteMode).w;
        }
        float4 _1673 = mix(_p1, float4(_t5.xyz, _p0.w), float4(u_layerOpacity * _t7));
        _t6 = _1673;
        float _1675 = _t6.w;
        float3 _1678 = _1673.xyz * _1675;
        _t6.x = _1678.x;
        _t6.y = _1678.y;
        _t6.z = _1678.z;
    }
    else
    {
        float3 _1713 = (((_p1.xyz * _p1.w) * (1.0 - _p0.w)) + ((_p0.xyz * _p0.w) * (1.0 - _p1.w))) + (_t5.xyz * (_p0.w * _p1.w));
        _t6.x = _1713.x;
        _t6.y = _1713.y;
        _t6.z = _1713.z;
        _t6.w = _p0.w + (_p1.w * (1.0 - _p0.w));
    }
    return _t6;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_maskTexture [[texture(0)]], texture2d<float> u_baseTexure [[texture(1)]], texture2d<float> u_sourceTexture [[texture(2)]], sampler u_maskTextureSmplr [[sampler(0)]], sampler u_baseTexureSmplr [[sampler(1)]], sampler u_sourceTextureSmplr [[sampler(2)]])
{
    main0_out out = {};
    float4 _t8 = float4(0.0);
    bool _1736 = buffer.u_hasBlend == 1;
    if (_1736)
    {
        if (buffer.u_hasBaseTexture == 1)
        {
            _t8 = u_baseTexure.sample(u_baseTexureSmplr, in.uv0);
        }
        if (buffer.u_hasSourceTexture == 0)
        {
            out.o_fragColor = _t8;
            return out;
        }
    }
    float4 _t9 = float4(0.0);
    if (buffer.u_hasSourceTexture == 1)
    {
        _t9 = u_sourceTexture.sample(u_sourceTextureSmplr, in.uv0);
    }
    if ((buffer.u_layerType != 1) && (buffer.u_hasMatte == 1))
    {
        float4 param = _t9;
        _t9 = _f7(param, buffer.u_enableMatte, u_maskTexture, u_maskTextureSmplr, in.uv0, buffer.u_matteMode);
    }
    if (_1736)
    {
        float4 param_1 = _t9;
        float4 param_2 = _t8;
        float4 _1784 = _f35(param_1, param_2, buffer.u_enableMatte, u_maskTexture, u_maskTextureSmplr, in.uv0, buffer.u_matteMode, buffer.u_blendMode, buffer.u_layerType, buffer.u_hasMatte, buffer.u_layerOpacity);
        _t9 = _1784;
    }
    out.o_fragColor = _t9;
    return out;
}

