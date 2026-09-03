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

struct buffer_t
{
    spvUnsafeArray<float2, 10> u_posVec;
    int u_lineNum;
    float u_intensity;
    float u_quality;
    float u_regionIns;
    float u_angle;
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
    float _38 = sin(_p0);
    float _41 = cos(_p0);
    return float2x2(float2(_41, -_38), float2(_38, _41));
}

static inline __attribute__((always_inline))
float _f1(thread const float2& _p0, thread const float2& _p1, thread const float2& _p2)
{
    return step(cross(float3(_p0 - _p1, 0.0), float3(_p2 - _p1, 0.0)).z, 0.0);
}

static inline __attribute__((always_inline))
float _f2(thread const float2& _p0, constant spvUnsafeArray<float2, 10>& u_posVec, constant int& u_lineNum)
{
    float2 param = _p0;
    float2 param_1 = u_posVec[u_lineNum];
    float2 param_2 = u_posVec[0];
    float _t5 = _f1(param, param_1, param_2);
    for (int _t6 = 0; _t6 < u_lineNum; _t6++)
    {
        float2 param_3 = _p0;
        float2 param_4 = u_posVec[_t6];
        float2 param_5 = u_posVec[_t6 + 1];
        _t5 *= _f1(param_3, param_4, param_5);
    }
    return _t5;
}

static inline __attribute__((always_inline))
float4 _f3(texture2d<float> _p0, sampler _p0Smplr, thread const float2& _p1, thread const float& _p2, thread const float2& _p3, constant spvUnsafeArray<float2, 10>& u_posVec, constant int& u_lineNum, constant float& u_intensity, constant float& u_quality, constant float& u_regionIns, constant float& u_angle, constant float& u_lightIns)
{
    if (u_intensity < 0.00999999977648258209228515625)
    {
        return _p0.sample(_p0Smplr, _p1);
    }
    float4 _t9 = float4(0.0);
    float4 _t11 = float4(0.0);
    float4 _t12 = float4(9.9999997473787516355514526367188e-05);
    float2 _162 = float2(2.0) * float2(_p2);
    float2 _166 = float2(1.0) / _p3;
    float _174 = mix(2.0, 0.5, u_intensity) * mix(2.0, 1.0, u_quality);
    float _185 = fast::max(5.0, (12.0 / _174) * mix(0.64999997615814208984375, 1.0, u_quality));
    float _190 = mix(0.699999988079071044921875, 1.0, u_regionIns);
    float param = u_angle;
    float2x2 _196 = _f0(param);
    for (float _t19 = 0.0; _t19 < 30.0; _t19 += 1.0)
    {
        if ((_t19 > _185) || (u_intensity < 0.300000011920928955078125))
        {
            break;
        }
        for (float _t20 = 0.0; _t20 < 30.0; _t20 += 1.0)
        {
            if (_t20 > _185)
            {
                break;
            }
            float2 _241 = float2(mix(-11.0, 11.0, _t19 / _185), mix(-11.0, 11.0, _t20 / _185));
            float2 param_1 = _241;
            if (_f2(param_1, u_posVec, u_lineNum) < 0.5)
            {
                continue;
            }
            float4 _261 = _p0.sample(_p0Smplr, (_p1 - ((((_241 * 0.5) * _162) * _196) * _166)));
            _t9 = fast::max(_t9, _261 * _190);
            float4 _278 = ((pow(_261, float4(9.0)) * 539.45001220703125) + float4(0.4000000059604644775390625)) * u_regionIns;
            _t11 += (_278 * _261);
            _t12 += _278;
        }
    }
    for (int _t23 = 0; _t23 < u_lineNum; _t23++)
    {
        float _319 = fast::max((length(u_posVec[_t23] - u_posVec[_t23 + 1]) / 1.5) * mix(0.5, 1.0, fast::clamp(u_quality * 1.5, 0.0, 1.0)), 3.0);
        for (float _t25 = 0.0; _t25 < 40.0; _t25 += 1.0)
        {
            float _332 = _t25 * _174;
            if (_332 > _319)
            {
                break;
            }
            float4 _364 = _p0.sample(_p0Smplr, (_p1 - ((((mix(u_posVec[_t23], u_posVec[_t23 + 1], float2(_332 / _319)) * 0.5) * _162) * _196) * _166)));
            _t9 = fast::max(_t9, _364);
            float4 _373 = (pow(_364, float4(9.0)) * 539.45001220703125) + float4(0.4000000059604644775390625);
            _t11 += (_373 * _364);
            _t12 += _373;
        }
    }
    float4 _392 = fast::clamp(_t11 / _t12, float4(0.0), float4(1.0));
    return float4(mix(_392, _t9, fast::clamp(_392 * u_lightIns, float4(0.0), float4(1.0))));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTex [[texture(0)]], sampler u_inputTexSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 param = in.v_uv;
    float param_1 = buffer.u_blurSize;
    float2 param_2 = (float2(buffer.u_baseTexWidth, buffer.u_baseTexHeight) / float2(fast::min(buffer.u_baseTexWidth, buffer.u_baseTexHeight))) * 720.0;
    out.o_fragColor = _f3(u_inputTex, u_inputTexSmplr, param, param_1, param_2, buffer.u_posVec, buffer.u_lineNum, buffer.u_intensity, buffer.u_quality, buffer.u_regionIns, buffer.u_angle, buffer.u_lightIns);
    return out;
}

