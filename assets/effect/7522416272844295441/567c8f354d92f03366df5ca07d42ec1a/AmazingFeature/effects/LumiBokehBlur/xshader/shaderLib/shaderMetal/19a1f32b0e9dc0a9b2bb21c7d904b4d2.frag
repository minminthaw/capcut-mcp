#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_sample;
    float u_baseTexWidth;
    float u_baseTexHeight;
    float u_intensity;
    float u_darkIns;
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
float _f0(thread const float& _p0, thread const float& _p1)
{
    return (0.3989399969577789306640625 * exp((((-0.5) * _p0) * _p0) / (_p1 * _p1))) / _p1;
}

static inline __attribute__((always_inline))
float4 _f1(texture2d<float> _p0, sampler _p0Smplr, thread const float2& _p1, thread const float2& _p2, thread const float2& _p3, constant float& u_sample)
{
    float param = 0.0;
    float param_1 = 4.0;
    float _56 = _f0(param, param_1);
    float4 _t2 = float4(0.0);
    float2 _63 = _p2 / _p3;
    float _t8 = _56;
    for (float _t10 = 1.0; _t10 <= u_sample; _t10 += 1.0)
    {
        float2 _97 = _63 * _t10;
        float param_2 = (_t10 / u_sample) * 15.0;
        float param_3 = 4.0;
        float _121 = _f0(param_2, param_3);
        _t2 = (_t2 + (pow(_p0.sample(_p0Smplr, (_p1 + _97)), float4(1.0)) * _121)) + (pow(_p0.sample(_p0Smplr, (_p1 - _97)), float4(1.0)) * _121);
        _t8 += (_121 * 2.0);
    }
    return fast::clamp(pow((_t2 + (pow(_p0.sample(_p0Smplr, _p1), float4(1.0)) * _56)) / float4(_t8), float4(1.0)), float4(0.0), float4(1.0));
}

static inline __attribute__((always_inline))
float4 _f2(thread const float4& _p0, thread const float& _p1, texture2d<float> _p2, sampler _p2Smplr)
{
    float _168 = _p0.z * 63.0;
    float _171 = floor(_168);
    float2 _t16;
    _t16.y = floor(_171 / 8.0);
    _t16.x = _171 - (_t16.y * 8.0);
    float _187 = ceil(_168);
    float2 _t17;
    _t17.y = floor(_187 / 8.0);
    _t17.x = _187 - (_t17.y * 8.0);
    float2 _t18;
    _t18.x = (((_t16.x * 1.0) / 8.0) + 0.0009765625) + (0.123046875 * _p0.x);
    _t18.y = (((_t16.y * 1.0) / 8.0) + 0.0009765625) + (0.123046875 * _p0.y);
    float2 _t19;
    _t19.x = (((_t17.x * 1.0) / 8.0) + 0.0009765625) + (0.123046875 * _p0.x);
    _t19.y = (((_t17.y * 1.0) / 8.0) + 0.0009765625) + (0.123046875 * _p0.y);
    return mix(_p0, float4(mix(_p2.sample(_p2Smplr, _t18), _p2.sample(_p2Smplr, _t19), float4(fract(_168))).xyz, _p0.w), float4(_p1));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTex [[texture(0)]], texture2d<float> noiseTex [[texture(1)]], texture2d<float> darkFilterTex [[texture(2)]], sampler u_inputTexSmplr [[sampler(0)]], sampler noiseTexSmplr [[sampler(1)]], sampler darkFilterTexSmplr [[sampler(2)]])
{
    main0_out out = {};
    float2 _290 = (float2(buffer.u_baseTexWidth, buffer.u_baseTexHeight) / float2(fast::min(buffer.u_baseTexWidth, buffer.u_baseTexHeight))) * 720.0;
    float2 _t23 = _290;
    float2 param = in.v_uv;
    float2 param_1 = float2(1.0, 0.0);
    float2 param_2 = _290;
    float4 _303 = _f1(u_inputTex, u_inputTexSmplr, param, param_1, param_2, buffer.u_sample);
    float4 _t25 = _303;
    float4 param_3 = _303;
    float param_4 = (0.5 * buffer.u_intensity) * buffer.u_darkIns;
    float4 _342 = _f2(param_3, param_4, darkFilterTex, darkFilterTexSmplr);
    _t25 = _342;
    float3 _344 = _342.xyz;
    float3 _359 = mix(_344, _344 * ((noiseTex.sample(noiseTexSmplr, fract(((in.v_uv * _290) / float2(fast::min(_t23.x, _t23.y))) * 2.0)).x * 1.0) + 0.0), float3(((dot(_303.xyz, float3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625)) * 0.100000001490116119384765625) * buffer.u_intensity) * buffer.u_darkIns));
    _t25.x = _359.x;
    _t25.y = _359.y;
    _t25.z = _359.z;
    out.o_fragColor = _t25;
    return out;
}

