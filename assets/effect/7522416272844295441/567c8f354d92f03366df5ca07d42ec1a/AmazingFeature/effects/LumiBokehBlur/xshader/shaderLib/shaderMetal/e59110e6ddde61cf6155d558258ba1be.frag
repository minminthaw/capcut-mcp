#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_sample;
    float u_baseTexWidth;
    float u_baseTexHeight;
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
    float _49 = _f0(param, param_1);
    float4 _t2 = float4(0.0);
    float2 _57 = _p2 / _p3;
    float _t8 = _49;
    for (float _t10 = 1.0; _t10 <= u_sample; _t10 += 1.0)
    {
        float2 _91 = _57 * _t10;
        float param_2 = (_t10 / u_sample) * 15.0;
        float param_3 = 4.0;
        float _115 = _f0(param_2, param_3);
        _t2 = (_t2 + (pow(_p0.sample(_p0Smplr, (_p1 + _91)), float4(1.0)) * _115)) + (pow(_p0.sample(_p0Smplr, (_p1 - _91)), float4(1.0)) * _115);
        _t8 += (_115 * 2.0);
    }
    return fast::clamp(pow((_t2 + (pow(_p0.sample(_p0Smplr, _p1), float4(1.0)) * _49)) / float4(_t8), float4(1.0)), float4(0.0), float4(1.0));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTex [[texture(0)]], sampler u_inputTexSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 param = in.v_uv;
    float2 param_1 = float2(0.0, 1.0);
    float2 param_2 = (float2(buffer.u_baseTexWidth, buffer.u_baseTexHeight) / float2(fast::min(buffer.u_baseTexWidth, buffer.u_baseTexHeight))) * 720.0;
    out.o_fragColor = _f1(u_inputTex, u_inputTexSmplr, param, param_1, param_2, buffer.u_sample);
    return out;
}

