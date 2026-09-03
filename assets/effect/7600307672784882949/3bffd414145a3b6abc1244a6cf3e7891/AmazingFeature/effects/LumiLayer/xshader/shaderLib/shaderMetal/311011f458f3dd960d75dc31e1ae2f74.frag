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

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(locn0)]];
};

static inline __attribute__((always_inline))
float4 _f1(thread const float3& _p0, thread const float3& _p1, thread const float3& _p2, thread const float3& _p3, thread const float3& _p4)
{
    float3 _61 = _p3 - _p2;
    float3 _65 = _p4 - _p2;
    float3 _69 = cross(_p1, _65);
    float _74 = dot(_61, _69);
    if (_74 <= 1.0000000116860974230803549289703e-07)
    {
        return float4(-1.0);
    }
    float3 _87 = _p0 - _p2;
    float _93 = dot(_87, _69) / _74;
    if ((_93 < 0.0) || (_93 > 1.0))
    {
        return float4(-1.0);
    }
    float3 _107 = cross(_87, _61);
    float _113 = dot(_p1, _107) / _74;
    bool _115 = _113 < 0.0;
    bool _123;
    if (!_115)
    {
        _123 = (_93 + _113) > 1.0;
    }
    else
    {
        _123 = _115;
    }
    if (_123)
    {
        return float4(-1.0);
    }
    return float4(_93, _113, dot(_65, _107) / _74, 1.0);
}

static inline __attribute__((always_inline))
float2 _f2(thread const float4x4& _p0, thread const float4x4& _p1, thread const float2& _p2)
{
    float4 _167 = _p1 * float4((_p2 * 2.0) - float2(1.0), 0.0, 1.0);
    float4 _t13 = _167;
    float3 _184 = fast::normalize((_167.xyz / float3(_t13.w)) - float3(0.0));
    float3 _187 = (_p0 * float4(10.0, -10.0, 0.0, 1.0)).xyz;
    float3 _190 = _187 + float3(9.9999997473787516355514526367188e-06, 0.0, 0.0);
    float3 _192 = (_p0 * float4(-10.0, 10.0, 0.0, 1.0)).xyz;
    float3 _194 = _192 + float3(0.0, 9.9999997473787516355514526367188e-06, 0.0);
    float3 param = float3(0.0);
    float3 param_1 = _184;
    float3 _201 = (_p0 * float4(-10.0, -10.0, 0.0, 1.0)).xyz;
    float3 param_2 = _201;
    float3 param_3 = _190;
    float3 param_4 = _194;
    float4 _t17 = _f1(param, param_1, param_2, param_3, param_4);
    float3 _208 = _192 - float3(9.9999997473787516355514526367188e-06, 0.0, 0.0);
    float3 _211 = _187 - float3(0.0, 9.9999997473787516355514526367188e-06, 0.0);
    float3 param_5 = float3(0.0);
    float3 param_6 = _184;
    float3 param_7 = _208;
    float3 param_8 = _211;
    float3 _220 = (_p0 * float4(10.0, 10.0, 0.0, 1.0)).xyz;
    float3 param_9 = _220;
    float4 _t18 = _f1(param_5, param_6, param_7, param_8, param_9);
    float3 param_10 = float3(0.0);
    float3 param_11 = _184;
    float3 param_12 = _201;
    float3 param_13 = _194;
    float3 param_14 = _190;
    float4 _t19 = _f1(param_10, param_11, param_12, param_13, param_14);
    float3 param_15 = float3(0.0);
    float3 param_16 = _184;
    float3 param_17 = _208;
    float3 param_18 = _220;
    float3 param_19 = _211;
    float4 _t20 = _f1(param_15, param_16, param_17, param_18, param_19);
    float2 _394 = (((((((float2(-4.5) * ((1.0 - _t17.x) - _t17.y)) + (float2(5.5, -4.5) * _t17.x)) + (float2(-4.5, 5.5) * _t17.y)) * step(0.0, _t17.w)) + ((((float2(-4.5, 5.5) * ((1.0 - _t18.x) - _t18.y)) + (float2(5.5, -4.5) * _t18.x)) + (float2(5.5) * _t18.y)) * (step(_t17.w, 0.0) * step(0.0, _t18.w)))) + ((((float2(-4.5) * ((1.0 - _t19.x) - _t19.y)) + (float2(-4.5, 5.5) * _t19.x)) + (float2(5.5, -4.5) * _t19.y)) * ((step(_t17.w, 0.0) * step(_t18.w, 0.0)) * step(0.0, _t19.w)))) + ((((float2(-4.5, 5.5) * ((1.0 - _t20.x) - _t20.y)) + (float2(5.5) * _t20.x)) + (float2(5.5, -4.5) * _t20.y)) * (((step(_t17.w, 0.0) * step(_t18.w, 0.0)) * step(_t19.w, 0.0)) * step(0.0, _t20.w)))) + (float2(-10000.0) * (((step(_t17.w, 0.0) * step(_t18.w, 0.0)) * step(_t19.w, 0.0)) * step(_t20.w, 0.0)));
    return _394;
}

static inline __attribute__((always_inline))
float2 _f4(thread const float2& _p0)
{
    return abs(mod(_p0 - float2(1.0), float2(2.0)) - float2(1.0));
}

static inline __attribute__((always_inline))
float _f3(thread const float2& _p0)
{
    float2 _t26 = step(float2(0.0), _p0) * step(_p0, float2(1.0));
    return _t26.x * _t26.y;
}

static inline __attribute__((always_inline))
float _f0(thread const float3& _p0)
{
    return dot(_p0, float3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625));
}

static inline __attribute__((always_inline))
float4 _f5(thread const float4& _p0, constant int& u_enableMatte, texture2d<float> u_maskTexture, sampler u_maskTextureSmplr, thread float2& uv0, constant int& u_matteMode)
{
    float4 _t27 = float4(0.0);
    if (u_enableMatte == 1)
    {
        _t27 = u_maskTexture.sample(u_maskTextureSmplr, uv0);
    }
    float _t28 = _t27.w;
    if (u_matteMode == 1)
    {
        float3 param = _t27.xyz;
        _t28 = _f0(param);
    }
    else
    {
        if (u_matteMode == 2)
        {
            _t28 = 1.0 - _t27.w;
        }
        else
        {
            if (u_matteMode == 3)
            {
                float3 param_1 = _t27.xyz;
                _t28 = 1.0 - _f0(param_1);
            }
        }
    }
    return _p0 * _t28;
}

static inline __attribute__((always_inline))
float4 _f6(thread float4& _p0, thread float4& _p1, constant int& u_enableMatte, texture2d<float> u_maskTexture, sampler u_maskTextureSmplr, thread float2& uv0, constant int& u_matteMode, constant int& u_layerType, constant int& u_hasMatte, constant float& u_layerOpacity)
{
    float _480 = _p0.w;
    float4 _482 = _p0;
    float3 _485 = _482.xyz / float3(fast::max(_480, 9.9999997473787516355514526367188e-06));
    _p0.x = _485.x;
    _p0.y = _485.y;
    _p0.z = _485.z;
    float _494 = _p1.w;
    float4 _496 = _p1;
    float3 _499 = _496.xyz / float3(fast::max(_494, 9.9999997473787516355514526367188e-06));
    _p1.x = _499.x;
    _p1.y = _499.y;
    _p1.z = _499.z;
    float4 _t29 = _p1;
    _t29.x = _p0.xyz.x;
    _t29.y = _p0.xyz.y;
    _t29.z = _p0.xyz.z;
    float4 _t30 = float4(0.0);
    if (u_layerType == 1)
    {
        float _t31 = 1.0;
        if (u_hasMatte == 1)
        {
            float4 param = float4(1.0);
            _t31 = _f5(param, u_enableMatte, u_maskTexture, u_maskTextureSmplr, uv0, u_matteMode).w;
        }
        float4 _547 = mix(_p1, float4(_t29.xyz, _p0.w), float4(u_layerOpacity * _t31));
        _t30 = _547;
        float _549 = _t30.w;
        float3 _552 = _547.xyz * _549;
        _t30.x = _552.x;
        _t30.y = _552.y;
        _t30.z = _552.z;
    }
    else
    {
        float3 _587 = (((_p1.xyz * _p1.w) * (1.0 - _p0.w)) + ((_p0.xyz * _p0.w) * (1.0 - _p1.w))) + (_t29.xyz * (_p0.w * _p1.w));
        _t30.x = _587.x;
        _t30.y = _587.y;
        _t30.z = _587.z;
        _t30.w = _p0.w + (_p1.w * (1.0 - _p0.w));
    }
    return _t30;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_maskTexture [[texture(0)]], texture2d<float> u_baseTexure [[texture(1)]], texture2d<float> u_sourceTexture [[texture(2)]], sampler u_maskTextureSmplr [[sampler(0)]], sampler u_baseTexureSmplr [[sampler(1)]], sampler u_sourceTextureSmplr [[sampler(2)]])
{
    main0_out out = {};
    float4 _t32 = float4(0.0);
    bool _610 = buffer.u_hasBlend == 1;
    if (_610)
    {
        if (buffer.u_hasBaseTexture == 1)
        {
            _t32 = u_baseTexure.sample(u_baseTexureSmplr, in.uv0);
        }
        if (buffer.u_hasSourceTexture == 0)
        {
            out.o_fragColor = _t32;
            return out;
        }
    }
    float4 _t33 = float4(0.0);
    if (buffer.u_hasTrs == 1)
    {
        float4x4 param = buffer.u_mvMat;
        float4x4 param_1 = buffer.u_pMat;
        float2 param_2 = in.uv0;
        float2 _648 = _f2(param, param_1, param_2);
        float _652 = step(buffer.u_mirrorEdge, 0.5);
        float2 param_3 = _648;
        float2 _662 = (_648 * _652) + (_f4(param_3) * (1.0 - _652));
        float2 param_4 = _662;
        _t33 = (u_sourceTexture.sample(u_sourceTextureSmplr, _662) * buffer.u_alpha) * _f3(param_4);
    }
    else
    {
        if (buffer.u_hasSourceTexture == 1)
        {
            _t33 = u_sourceTexture.sample(u_sourceTextureSmplr, in.uv0);
        }
    }
    if ((buffer.u_layerType != 1) && (buffer.u_hasMatte == 1))
    {
        float4 param_5 = _t33;
        _t33 = _f5(param_5, buffer.u_enableMatte, u_maskTexture, u_maskTextureSmplr, in.uv0, buffer.u_matteMode);
    }
    if (_610)
    {
        float4 param_6 = _t33;
        float4 param_7 = _t32;
        float4 _700 = _f6(param_6, param_7, buffer.u_enableMatte, u_maskTexture, u_maskTextureSmplr, in.uv0, buffer.u_matteMode, buffer.u_layerType, buffer.u_hasMatte, buffer.u_layerOpacity);
        _t33 = _700;
    }
    out.o_fragColor = _t33;
    return out;
}

