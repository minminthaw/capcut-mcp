#pragma clang diagnostic ignored "-Wmissing-prototypes"
#pragma clang diagnostic ignored "-Wmissing-braces"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

template<typename T, size_t Num>
struct spvUnsafeArray
{
    T elements[Num ? Num : 1];
    
    thread T& operator [] (size_t pos) thread
    {
        return elements[pos];
    }
    constexpr const thread T& operator [] (size_t pos) const thread
    {
        return elements[pos];
    }
    
    device T& operator [] (size_t pos) device
    {
        return elements[pos];
    }
    constexpr const device T& operator [] (size_t pos) const device
    {
        return elements[pos];
    }
    
    constexpr const constant T& operator [] (size_t pos) const constant
    {
        return elements[pos];
    }
    
    threadgroup T& operator [] (size_t pos) threadgroup
    {
        return elements[pos];
    }
    constexpr const threadgroup T& operator [] (size_t pos) const threadgroup
    {
        return elements[pos];
    }
};

// Implementation of the GLSL mod() function, which is slightly different than Metal fmod()
template<typename Tx, typename Ty>
inline Tx mod(Tx x, Ty y)
{
    return x - y * floor(x / y);
}

struct buffer_t
{
    float u_intensity;
    float u_angle;
    float u_scaleX;
    float u_scaleY;
    float u_quality;
    int posVecNum;
    spvUnsafeArray<float2, 500> posVec;
    float u_regionIns;
    float u_lightIns;
    float u_baseTexWidth;
    float u_baseTexHeight;
    float u_blurSize;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_uv [[user(locn0)]];
};

static inline __attribute__((always_inline))
float2x2 _f0(thread const float& _p0)
{
    float _32 = sin(_p0);
    float _35 = cos(_p0);
    return float2x2(float2(_35, -_32), float2(_32, _35));
}

static inline __attribute__((always_inline))
float2 _f1(thread const float2& _p0)
{
    return abs(mod(_p0 + float2(1.0), float2(2.0)) - float2(1.0));
}

static inline __attribute__((always_inline))
float4 _f2(texture2d<float> _p0, sampler _p0Smplr, thread const float2& _p1, thread const float& _p2, thread const float2& _p3, constant float& u_intensity, constant float& u_angle, constant float& u_scaleX, constant float& u_scaleY, constant float& u_quality, constant int& posVecNum, constant spvUnsafeArray<float2, 500>& posVec, constant float& u_regionIns, texture2d<float> u_maskTex, sampler u_maskTexSmplr, constant float& u_lightIns)
{
    if (u_intensity < 0.00999999977648258209228515625)
    {
        return _p0.sample(_p0Smplr, _p1);
    }
    float4 _t4 = float4(0.0);
    float4 _t6 = float4(0.0);
    float4 _t7 = float4(9.9999997473787516355514526367188e-05);
    float param = u_angle;
    float2x2 _91 = _f0(param);
    float2 _102 = (float2(2.0) * float2(u_scaleX, u_scaleY)) * float2(_p2);
    float2 _106 = float2(1.0) / _p3;
    for (int _t12 = 0; _t12 < posVecNum; _t12++)
    {
        float2 param_1 = _p1 + ((((((float2(1.0) - posVec[_t12]) - float2(0.5)) * _102) * _91) * float2(11.0)) * _106);
        float4 _162 = _p0.sample(_p0Smplr, _f1(param_1));
        _t4 = fast::max(_t4, _162);
        float4 _174 = (pow(_162, float4(9.0)) * 539.45001220703125) + float4(0.4000000059604644775390625);
        _t6 += (_174 * _162);
        _t7 += _174;
    }
    float _196 = fast::max(5.0, (12.0 / (mix(2.0, 0.5, u_intensity) * mix(2.0, 1.0, u_quality))) * mix(0.60000002384185791015625, 1.0, u_quality));
    float _201 = mix(0.699999988079071044921875, 1.0, u_regionIns);
    for (float _t18 = 0.0; _t18 < 30.0; _t18 += 1.0)
    {
        if ((_t18 > _196) || (u_intensity < 0.300000011920928955078125))
        {
            break;
        }
        for (float _t19 = 0.0; _t19 < 30.0; _t19 += 1.0)
        {
            if (_t19 > _196)
            {
                break;
            }
            float _239 = _t18 / _196;
            float _243 = _t19 / _196;
            if (u_maskTex.sample(u_maskTexSmplr, float2(mix(0.0, 1.0, _239), mix(0.0, 1.0, _243))).x < 0.5)
            {
                continue;
            }
            float4 _278 = _p0.sample(_p0Smplr, (_p1 - ((((float2(mix(-11.0, 11.0, _239), mix(-11.0, 11.0, _243)) * 0.5) * _102) * _91) * _106)));
            _t4 = fast::max(_t4, _278 * _201);
            float4 _292 = ((pow(_278, float4(9.0)) * 539.45001220703125) + float4(0.4000000059604644775390625)) * u_regionIns;
            _t6 += (_292 * _278);
            _t7 += _292;
        }
    }
    float4 _311 = fast::clamp(_t6 / _t7, float4(0.0), float4(1.0));
    return float4(mix(_311, _t4, fast::clamp(_311 * u_lightIns, float4(0.0), float4(1.0))));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_maskTex [[texture(0)]], texture2d<float> u_inputTex [[texture(1)]], sampler u_maskTexSmplr [[sampler(0)]], sampler u_inputTexSmplr [[sampler(1)]])
{
    main0_out out = {};
    float2 param = in.v_uv;
    float param_1 = buffer.u_blurSize;
    float2 param_2 = (float2(buffer.u_baseTexWidth, buffer.u_baseTexHeight) / float2(fast::min(buffer.u_baseTexWidth, buffer.u_baseTexHeight))) * 720.0;
    out.o_fragColor = _f2(u_inputTex, u_inputTexSmplr, param, param_1, param_2, buffer.u_intensity, buffer.u_angle, buffer.u_scaleX, buffer.u_scaleY, buffer.u_quality, buffer.posVecNum, buffer.posVec, buffer.u_regionIns, u_maskTex, u_maskTexSmplr, buffer.u_lightIns);
    return out;
}

