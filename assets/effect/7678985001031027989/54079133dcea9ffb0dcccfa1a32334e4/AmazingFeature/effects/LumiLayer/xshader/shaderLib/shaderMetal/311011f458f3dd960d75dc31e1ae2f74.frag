#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

// Implementation of the GLSL mod() function, which is slightly different than Metal fmod()
template<typename Tx, typename Ty>
inline Tx mod(Tx x, Ty y)
{
    return x - y * floor(x / y);
}

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
    int u_hasTrs;
    float4x4 u_mvMat;
    float4x4 u_pMat;
    float u_mirrorEdge;
    float u_alpha;
};

constant float3 _2206 = {};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(locn0)]];
};

static inline __attribute__((always_inline))
float4 _f7(thread const float3& _p0, thread const float3& _p1, thread const float3& _p2, thread const float3& _p3, thread const float3& _p4)
{
    float3 _404 = _p3 - _p2;
    float3 _408 = _p4 - _p2;
    float3 _412 = cross(_p1, _408);
    float _416 = dot(_404, _412);
    if (_416 <= 1.0000000116860974230803549289703e-07)
    {
        return float4(-1.0);
    }
    float3 _428 = _p0 - _p2;
    float _434 = dot(_428, _412) / _416;
    if ((_434 < 0.0) || (_434 > 1.0))
    {
        return float4(-1.0);
    }
    float3 _446 = cross(_428, _404);
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
        return float4(-1.0);
    }
    return float4(_434, _452, dot(_408, _446) / _416, 1.0);
}

static inline __attribute__((always_inline))
float2 _f8(thread const float4x4& _p0, thread const float4x4& _p1, thread const float2& _p2)
{
    float3 _501 = (_p0 * float4(10.0000095367431640625, -10.0, 0.0, 1.0)).xyz;
    float3 _507 = (_p0 * float4(10.0, -10.0000095367431640625, 0.0, 1.0)).xyz;
    float3 _512 = (_p0 * float4(-10.0, 10.0000095367431640625, 0.0, 1.0)).xyz;
    float3 _517 = (_p0 * float4(-10.0000095367431640625, 10.0, 0.0, 1.0)).xyz;
    float4 _527 = _p1 * float4((_p2 * 2.0) - float2(1.0), 0.0, 1.0);
    float4 _t20 = _527;
    float3 _543 = fast::normalize((_527.xyz / float3(_t20.w)) - float3(0.0));
    float3 param = float3(0.0);
    float3 param_1 = _543;
    float3 _551 = (_p0 * float4(-10.0, -10.0, 0.0, 1.0)).xyz;
    float3 param_2 = _551;
    float3 param_3 = _501;
    float3 param_4 = _512;
    float4 _t24 = _f7(param, param_1, param_2, param_3, param_4);
    float3 param_5 = float3(0.0);
    float3 param_6 = _543;
    float3 param_7 = _517;
    float3 param_8 = _507;
    float3 _568 = (_p0 * float4(10.0, 10.0, 0.0, 1.0)).xyz;
    float3 param_9 = _568;
    float4 _t25 = _f7(param_5, param_6, param_7, param_8, param_9);
    float3 param_10 = float3(0.0);
    float3 param_11 = _543;
    float3 param_12 = _551;
    float3 param_13 = _512;
    float3 param_14 = _501;
    float4 _t26 = _f7(param_10, param_11, param_12, param_13, param_14);
    float3 param_15 = float3(0.0);
    float3 param_16 = _543;
    float3 param_17 = _517;
    float3 param_18 = _568;
    float3 param_19 = _507;
    float4 _t27 = _f7(param_15, param_16, param_17, param_18, param_19);
    float2 _732 = (((((((float2(-4.5) * ((1.0 - _t24.x) - _t24.y)) + (float2(5.5, -4.5) * _t24.x)) + (float2(-4.5, 5.5) * _t24.y)) * step(0.0, _t24.w)) + ((((float2(-4.5, 5.5) * ((1.0 - _t25.x) - _t25.y)) + (float2(5.5, -4.5) * _t25.x)) + (float2(5.5) * _t25.y)) * (step(_t24.w, 0.0) * step(0.0, _t25.w)))) + ((((float2(-4.5) * ((1.0 - _t26.x) - _t26.y)) + (float2(-4.5, 5.5) * _t26.x)) + (float2(5.5, -4.5) * _t26.y)) * ((step(_t24.w, 0.0) * step(_t25.w, 0.0)) * step(0.0, _t26.w)))) + ((((float2(-4.5, 5.5) * ((1.0 - _t27.x) - _t27.y)) + (float2(5.5) * _t27.x)) + (float2(5.5, -4.5) * _t27.y)) * (((step(_t24.w, 0.0) * step(_t25.w, 0.0)) * step(_t26.w, 0.0)) * step(0.0, _t27.w)))) + (float2(-10000.0) * (((step(_t24.w, 0.0) * step(_t25.w, 0.0)) * step(_t26.w, 0.0)) * step(_t27.w, 0.0)));
    return _732;
}

static inline __attribute__((always_inline))
float2 _f10(thread const float2& _p0)
{
    return abs(mod(_p0 - float2(1.0), float2(2.0)) - float2(1.0));
}

static inline __attribute__((always_inline))
float _f9(thread const float2& _p0)
{
    float2 _t33 = step(float2(0.0), _p0) * step(_p0, float2(1.0));
    return _t33.x * _t33.y;
}

static inline __attribute__((always_inline))
float _f5(thread const float3& _p0)
{
    return dot(_p0, float3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625));
}

static inline __attribute__((always_inline))
float4 _f11(thread const float4& _p0, constant int& u_enableMatte, texture2d<float> u_maskTexture, sampler u_maskTextureSmplr, thread float2& uv0, constant int& u_matteMode)
{
    float4 _t34 = float4(0.0);
    if (u_enableMatte == 1)
    {
        _t34 = u_maskTexture.sample(u_maskTextureSmplr, uv0);
    }
    float _t35 = _t34.w;
    if (u_matteMode == 1)
    {
        float3 param = _t34.xyz;
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
                float3 param_1 = _t34.xyz;
                _t35 = 1.0 - _f5(param_1);
            }
        }
    }
    return _p0 * _t35;
}

static inline __attribute__((always_inline))
float _f1(thread const float& _p0, thread const float& _p1)
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
float _f13(thread const float3& _p0)
{
    return fast::max(_p0.x, fast::max(_p0.y, _p0.z)) - fast::min(_p0.x, fast::min(_p0.y, _p0.z));
}

static inline __attribute__((always_inline))
float3 _f12(thread float3& _p0, thread const float& _p1)
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
float3 _f14(thread float3& _p0, thread const float& _p1)
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
            float3 param = _p0;
            float param_1 = _p1;
            float3 _892 = _f12(param, param_1);
            _p0 = _892;
        }
        else
        {
            float3 param_2 = _p0.xzy;
            float param_3 = _p1;
            float3 _899 = _f12(param_2, param_3);
            _p0 = float3(_899.x, _899.z, _899.y);
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
                float3 param_4 = _p0.yxz;
                float param_5 = _p1;
                float3 _930 = _f12(param_4, param_5);
                _p0 = float3(_930.y, _930.x, _930.z);
            }
            else
            {
                float3 param_6 = _p0.yzx;
                float param_7 = _p1;
                float3 _939 = _f12(param_6, param_7);
                _p0 = float3(_939.z, _939.x, _939.y);
            }
        }
        else
        {
            if (_p0.x <= _p0.y)
            {
                float3 param_8 = _p0.zxy;
                float param_9 = _p1;
                float3 _955 = _f12(param_8, param_9);
                _p0 = float3(_955.y, _955.z, _955.x);
            }
            else
            {
                float3 param_10 = _p0.zyx;
                float param_11 = _p1;
                float3 _964 = _f12(param_10, param_11);
                _p0 = float3(_964.z, _964.y, _964.x);
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
    float _354 = fast::min(_p0.x, fast::min(_p0.y, _p0.z));
    float _357 = _p0.x;
    float _359 = _p0.y;
    float _361 = _p0.z;
    float _363 = fast::max(_357, fast::max(_359, _361));
    if (_354 < 0.0)
    {
        _p0 = mix(float3(_p1, _p1, _p1), _p0, float3(_p1 / (_p1 - _354)));
    }
    if (_363 > 1.0)
    {
        _p0 = mix(float3(_p1, _p1, _p1), _p0, float3((1.0 - _p1) / (_363 - _p1)));
    }
    return _p0;
}

static inline __attribute__((always_inline))
float3 _f15(thread const float3& _p0, thread const float3& _p1)
{
    float3 param = _p1;
    float3 param_1 = _p0;
    float param_2 = _f13(param);
    float3 _976 = _f14(param_1, param_2);
    float3 param_3 = _p1;
    float3 param_4 = _976;
    float param_5 = _f5(param_3);
    float3 _982 = _f6(param_4, param_5);
    return _982;
}

static inline __attribute__((always_inline))
float3 _f16(thread const float3& _p0, thread const float3& _p1)
{
    float3 param = _p0;
    float3 param_1 = _p1;
    float param_2 = _f13(param);
    float3 _991 = _f14(param_1, param_2);
    float3 param_3 = _p1;
    float3 param_4 = _991;
    float param_5 = _f5(param_3);
    float3 _997 = _f6(param_4, param_5);
    return _997;
}

static inline __attribute__((always_inline))
float3 _f17(thread const float3& _p0, thread const float3& _p1)
{
    float3 param = _p1;
    float3 param_1 = _p0;
    float param_2 = _f5(param);
    float3 _1006 = _f6(param_1, param_2);
    return _1006;
}

static inline __attribute__((always_inline))
float _f21(thread const float& _p0, thread const float& _p1)
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
    return fast::max(0.0, (_p1 + _p0) - 1.0);
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
    return fast::min(1.0, _p1 + _p0);
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
    float _1286;
    if (_p0 <= 0.5)
    {
        _1286 = fast::min(_p1, 2.0 * _p0);
    }
    else
    {
        _1286 = fast::max(_p1, 2.0 * (_p0 - 0.5));
    }
    return _1286;
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
float _f35(thread const float& _p0, thread const float& _p1)
{
    return float((_p1 + _p0) >= 1.0);
}

static inline __attribute__((always_inline))
float3 _f36(thread const float3& _p0, thread const float3& _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return float3(_f35(param, param_1), _f35(param_2, param_3), _f35(param_4, param_5));
}

static inline __attribute__((always_inline))
float _f37(thread const float& _p0, thread const float& _p1)
{
    float _1359;
    if (_p0 > 0.0)
    {
        _1359 = fast::min(1.0, _p1 / _p0);
    }
    else
    {
        _1359 = 1.0;
    }
    return _1359;
}

static inline __attribute__((always_inline))
float3 _f38(thread const float3& _p0, thread const float3& _p1)
{
    float param = _p0.x;
    float param_1 = _p1.x;
    float param_2 = _p0.y;
    float param_3 = _p1.y;
    float param_4 = _p0.z;
    float param_5 = _p1.z;
    return float3(_f37(param, param_1), _f37(param_2, param_3), _f37(param_4, param_5));
}

static inline __attribute__((always_inline))
float3 _f20(thread const float3& _p0, thread const float3& _p1)
{
    float3 param = _p0;
    float3 param_1 = _p1;
    float param_2 = _f5(param);
    float3 _1042 = _f6(param_1, param_2);
    return _1042;
}

static inline __attribute__((always_inline))
float3 _f19(thread const float3& _p0, thread const float3& _p1)
{
    float3 param = _p1;
    float3 param_1 = _p0;
    return select(_p0, _p1, bool3(_f5(param) > _f5(param_1)));
}

static inline __attribute__((always_inline))
float3 _f18(thread const float3& _p0, thread const float3& _p1)
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
float4 _f39(thread float4& _p0, thread float4& _p1, constant int& u_enableMatte, texture2d<float> u_maskTexture, sampler u_maskTextureSmplr, thread float2& uv0, constant int& u_matteMode, constant int& u_blendMode, constant int& u_layerType, constant int& u_hasMatte, constant float& u_layerOpacity)
{
    float _1395 = _p0.w;
    float4 _1398 = _p0;
    float3 _1401 = _1398.xyz / float3(fast::max(_1395, 9.9999997473787516355514526367188e-06));
    _p0.x = _1401.x;
    _p0.y = _1401.y;
    _p0.z = _1401.z;
    float _1409 = _p1.w;
    float4 _1411 = _p1;
    float3 _1414 = _1411.xyz / float3(fast::max(_1409, 9.9999997473787516355514526367188e-06));
    _p1.x = _1414.x;
    _p1.y = _1414.y;
    _p1.z = _1414.z;
    float4 _t36 = _p1;
    if (u_blendMode == 1)
    {
        float3 _1432 = _p0.xyz + _p1.xyz;
        _t36.x = _1432.x;
        _t36.y = _1432.y;
        _t36.z = _1432.z;
    }
    else
    {
        if (u_blendMode == 2)
        {
            float3 _1448 = _p0.xyz * _p1.xyz;
            _t36.x = _1448.x;
            _t36.y = _1448.y;
            _t36.z = _1448.z;
        }
        else
        {
            if (u_blendMode == 3)
            {
                float3 _1465 = abs(_p0.xyz - _p1.xyz);
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
                    float3 _1547 = float3(_1481, _1504, _1527);
                    _t36.x = _1547.x;
                    _t36.y = _1547.y;
                    _t36.z = _1547.z;
                }
                else
                {
                    if (u_blendMode == 5)
                    {
                        float3 _1564 = fast::min(_p0.xyz, _p1.xyz);
                        _t36.x = _1564.x;
                        _t36.y = _1564.y;
                        _t36.z = _1564.z;
                    }
                    else
                    {
                        if (u_blendMode == 6)
                        {
                            float3 _1581 = fast::max(_p0.xyz, _p1.xyz);
                            _t36.x = _1581.x;
                            _t36.y = _1581.y;
                            _t36.z = _1581.z;
                        }
                        else
                        {
                            if (u_blendMode == 7)
                            {
                                float3 param = _p0.xyz;
                                float3 param_1 = _p1.xyz;
                                float3 _1600 = _f2(param, param_1);
                                _t36.x = _1600.x;
                                _t36.y = _1600.y;
                                _t36.z = _1600.z;
                            }
                            else
                            {
                                if (u_blendMode == 8)
                                {
                                    float3 param_2 = _p0.xyz;
                                    float3 param_3 = _p1.xyz;
                                    float3 _1619 = _f4(param_2, param_3);
                                    _t36.x = _1619.x;
                                    _t36.y = _1619.y;
                                    _t36.z = _1619.z;
                                }
                                else
                                {
                                    if (u_blendMode == 9)
                                    {
                                        float3 param_4 = _p0.xyz;
                                        float3 param_5 = _p1.xyz;
                                        float3 _1638 = _f15(param_4, param_5);
                                        _t36.x = _1638.x;
                                        _t36.y = _1638.y;
                                        _t36.z = _1638.z;
                                    }
                                    else
                                    {
                                        if (u_blendMode == 10)
                                        {
                                            float3 param_6 = _p0.xyz;
                                            float3 param_7 = _p1.xyz;
                                            float3 _1657 = _f16(param_6, param_7);
                                            _t36.x = _1657.x;
                                            _t36.y = _1657.y;
                                            _t36.z = _1657.z;
                                        }
                                        else
                                        {
                                            if (u_blendMode == 11)
                                            {
                                                float3 param_8 = _p0.xyz;
                                                float3 param_9 = _p1.xyz;
                                                float3 _1676 = _f17(param_8, param_9);
                                                _t36.x = _1676.x;
                                                _t36.y = _1676.y;
                                                _t36.z = _1676.z;
                                            }
                                            else
                                            {
                                                if (u_blendMode == 12)
                                                {
                                                    float3 _1699 = (_p0.xyz + _p1.xyz) - (_p0.xyz * _p1.xyz);
                                                    _t36.x = _1699.x;
                                                    _t36.y = _1699.y;
                                                    _t36.z = _1699.z;
                                                }
                                                else
                                                {
                                                    if (u_blendMode == 13)
                                                    {
                                                        float3 param_10 = _p0.xyz;
                                                        float3 param_11 = _p1.xyz;
                                                        float3 _1718 = _f22(param_10, param_11);
                                                        _t36.x = _1718.x;
                                                        _t36.y = _1718.y;
                                                        _t36.z = _1718.z;
                                                    }
                                                    else
                                                    {
                                                        if (u_blendMode == 14)
                                                        {
                                                            float3 param_12 = _p0.xyz;
                                                            float3 param_13 = _p1.xyz;
                                                            float3 _1737 = _f24(param_12, param_13);
                                                            _t36.x = _1737.x;
                                                            _t36.y = _1737.y;
                                                            _t36.z = _1737.z;
                                                        }
                                                        else
                                                        {
                                                            if (u_blendMode == 15)
                                                            {
                                                                float3 param_14 = _p0.xyz;
                                                                float3 param_15 = _p1.xyz;
                                                                float3 _1756 = _f26(param_14, param_15);
                                                                _t36.x = _1756.x;
                                                                _t36.y = _1756.y;
                                                                _t36.z = _1756.z;
                                                            }
                                                            else
                                                            {
                                                                if (u_blendMode == 16)
                                                                {
                                                                    float3 param_16 = _p0.xyz;
                                                                    float3 param_17 = _p1.xyz;
                                                                    float3 _1775 = _f28(param_16, param_17);
                                                                    _t36.x = _1775.x;
                                                                    _t36.y = _1775.y;
                                                                    _t36.z = _1775.z;
                                                                }
                                                                else
                                                                {
                                                                    if (u_blendMode == 17)
                                                                    {
                                                                        float3 param_18 = _p0.xyz;
                                                                        float3 param_19 = _p1.xyz;
                                                                        float3 _1794 = _f30(param_18, param_19);
                                                                        _t36.x = _1794.x;
                                                                        _t36.y = _1794.y;
                                                                        _t36.z = _1794.z;
                                                                    }
                                                                    else
                                                                    {
                                                                        if (u_blendMode == 18)
                                                                        {
                                                                            float3 param_20 = _p0.xyz;
                                                                            float3 param_21 = _p1.xyz;
                                                                            float3 _1813 = _f32(param_20, param_21);
                                                                            _t36.x = _1813.x;
                                                                            _t36.y = _1813.y;
                                                                            _t36.z = _1813.z;
                                                                        }
                                                                        else
                                                                        {
                                                                            if (u_blendMode == 19)
                                                                            {
                                                                                float3 param_22 = _p0.xyz;
                                                                                float3 param_23 = _p1.xyz;
                                                                                float3 _1832 = _f34(param_22, param_23);
                                                                                _t36.x = _1832.x;
                                                                                _t36.y = _1832.y;
                                                                                _t36.z = _1832.z;
                                                                            }
                                                                            else
                                                                            {
                                                                                if (u_blendMode == 20)
                                                                                {
                                                                                    float3 param_24 = _p0.xyz;
                                                                                    float3 param_25 = _p1.xyz;
                                                                                    float3 _1851 = _f36(param_24, param_25);
                                                                                    _t36.x = _1851.x;
                                                                                    _t36.y = _1851.y;
                                                                                    _t36.z = _1851.z;
                                                                                }
                                                                                else
                                                                                {
                                                                                    if (u_blendMode == 21)
                                                                                    {
                                                                                        float3 _1875 = (_p1.xyz + _p0.xyz) - ((_p1.xyz * 2.0) * _p0.xyz);
                                                                                        _t36.x = _1875.x;
                                                                                        _t36.y = _1875.y;
                                                                                        _t36.z = _1875.z;
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        if (u_blendMode == 22)
                                                                                        {
                                                                                            float3 _1893 = fast::max(float3(0.0), _p1.xyz - _p0.xyz);
                                                                                            _t36.x = _1893.x;
                                                                                            _t36.y = _1893.y;
                                                                                            _t36.z = _1893.z;
                                                                                        }
                                                                                        else
                                                                                        {
                                                                                            if (u_blendMode == 23)
                                                                                            {
                                                                                                float3 param_26 = _p0.xyz;
                                                                                                float3 param_27 = _p1.xyz;
                                                                                                float3 _1912 = _f38(param_26, param_27);
                                                                                                _t36.x = _1912.x;
                                                                                                _t36.y = _1912.y;
                                                                                                _t36.z = _1912.z;
                                                                                            }
                                                                                            else
                                                                                            {
                                                                                                if (u_blendMode == 24)
                                                                                                {
                                                                                                    float3 param_28 = _p0.xyz;
                                                                                                    float3 param_29 = _p1.xyz;
                                                                                                    float3 _1931 = _f20(param_28, param_29);
                                                                                                    _t36.x = _1931.x;
                                                                                                    _t36.y = _1931.y;
                                                                                                    _t36.z = _1931.z;
                                                                                                }
                                                                                                else
                                                                                                {
                                                                                                    if (u_blendMode == 25)
                                                                                                    {
                                                                                                        float3 param_30 = _p0.xyz;
                                                                                                        float3 param_31 = _p1.xyz;
                                                                                                        float3 _1950 = _f19(param_30, param_31);
                                                                                                        _t36.x = _1950.x;
                                                                                                        _t36.y = _1950.y;
                                                                                                        _t36.z = _1950.z;
                                                                                                    }
                                                                                                    else
                                                                                                    {
                                                                                                        if (u_blendMode == 26)
                                                                                                        {
                                                                                                            float3 param_32 = _p0.xyz;
                                                                                                            float3 param_33 = _p1.xyz;
                                                                                                            float3 _1969 = _f18(param_32, param_33);
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
                                                                                                                        float2 param_34 = uv0;
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
    float4 _t37 = float4(0.0);
    if (u_layerType == 1)
    {
        float _t38 = 1.0;
        if (u_hasMatte == 1)
        {
            float4 param_35 = float4(1.0);
            _t38 = _f11(param_35, u_enableMatte, u_maskTexture, u_maskTextureSmplr, uv0, u_matteMode).w;
        }
        float4 _2051 = mix(_p1, float4(_t36.xyz, _p0.w), float4(u_layerOpacity * _t38));
        _t37 = _2051;
        float _2053 = _t37.w;
        float3 _2056 = _2051.xyz * _2053;
        _t37.x = _2056.x;
        _t37.y = _2056.y;
        _t37.z = _2056.z;
    }
    else
    {
        float3 _2091 = (((_p1.xyz * _p1.w) * (1.0 - _p0.w)) + ((_p0.xyz * _p0.w) * (1.0 - _p1.w))) + (_t36.xyz * (_p0.w * _p1.w));
        _t37.x = _2091.x;
        _t37.y = _2091.y;
        _t37.z = _2091.z;
        _t37.w = _p0.w + (_p1.w * (1.0 - _p0.w));
    }
    return _t37;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_maskTexture [[texture(0)]], texture2d<float> u_baseTexure [[texture(1)]], texture2d<float> u_sourceTexture [[texture(2)]], sampler u_maskTextureSmplr [[sampler(0)]], sampler u_baseTexureSmplr [[sampler(1)]], sampler u_sourceTextureSmplr [[sampler(2)]])
{
    main0_out out = {};
    float4 _t39 = float4(0.0);
    bool _2114 = buffer.u_hasBlend == 1;
    if (_2114)
    {
        if (buffer.u_hasBaseTexture == 1)
        {
            _t39 = u_baseTexure.sample(u_baseTexureSmplr, in.uv0);
        }
        if (buffer.u_hasSourceTexture == 0)
        {
            out.o_fragColor = _t39;
            return out;
        }
    }
    float4 _t40 = float4(0.0);
    if (buffer.u_hasTrs == 1)
    {
        float4x4 param = buffer.u_mvMat;
        float4x4 param_1 = buffer.u_pMat;
        float2 param_2 = in.uv0;
        float2 _2152 = _f8(param, param_1, param_2);
        float _2155 = step(buffer.u_mirrorEdge, 0.5);
        float2 param_3 = _2152;
        float2 _2165 = (_2152 * _2155) + (_f10(param_3) * (1.0 - _2155));
        float2 param_4 = _2165;
        _t40 = (u_sourceTexture.sample(u_sourceTextureSmplr, _2165) * buffer.u_alpha) * _f9(param_4);
    }
    else
    {
        if (buffer.u_hasSourceTexture == 1)
        {
            _t40 = u_sourceTexture.sample(u_sourceTextureSmplr, in.uv0);
        }
    }
    if ((buffer.u_layerType != 1) && (buffer.u_hasMatte == 1))
    {
        float4 param_5 = _t40;
        _t40 = _f11(param_5, buffer.u_enableMatte, u_maskTexture, u_maskTextureSmplr, in.uv0, buffer.u_matteMode);
    }
    if (_2114)
    {
        float4 param_6 = _t40;
        float4 param_7 = _t39;
        float4 _2203 = _f39(param_6, param_7, buffer.u_enableMatte, u_maskTexture, u_maskTextureSmplr, in.uv0, buffer.u_matteMode, buffer.u_blendMode, buffer.u_layerType, buffer.u_hasMatte, buffer.u_layerOpacity);
        _t40 = _2203;
    }
    out.o_fragColor = _t40;
    return out;
}

