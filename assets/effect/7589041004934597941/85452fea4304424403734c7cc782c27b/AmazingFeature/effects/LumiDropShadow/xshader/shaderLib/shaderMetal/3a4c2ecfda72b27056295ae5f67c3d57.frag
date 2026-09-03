#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_scale;
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
float4 _f1(texture2d<float> _p0, sampler _p0Smplr, thread float2& _p1)
{
    float2 _64 = _p1;
    _p1 = step(float2(0.0), _p1) * step(_p1, float2(1.0));
    return (_p0.sample(_p0Smplr, _64) * _p1.x) * _p1.y;
}

static inline __attribute__((always_inline))
float4 _f0(thread float& _p0)
{
    float4 _t0 = float4(0.0);
    _p0 *= 255.0;
    _t0.x = floor(_p0) / 255.0;
    _p0 = fract(_p0);
    _p0 *= 255.0;
    _t0.y = floor(_p0) / 255.0;
    _p0 = fract(_p0);
    _p0 *= 255.0;
    _t0.z = floor(_p0) / 255.0;
    _p0 = fract(_p0);
    _t0.w = _p0;
    return _t0;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 param = ((in.v_uv - float2(0.5)) / float2(buffer.u_scale)) + float2(0.5);
    float4 _102 = _f1(u_inputTexture, u_inputTextureSmplr, param);
    float param_1 = _102.w;
    float4 _105 = _f0(param_1);
    out.o_fragColor = _105;
    return out;
}

