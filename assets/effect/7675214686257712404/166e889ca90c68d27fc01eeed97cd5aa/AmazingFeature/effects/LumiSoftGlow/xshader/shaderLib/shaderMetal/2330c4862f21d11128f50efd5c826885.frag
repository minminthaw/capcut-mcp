#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_exposure;
    float3 u_glowColor;
    int u_displayGlow;
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
float4 _f0(thread const float4& _p0, thread const float4& _p1)
{
    return (_p0 + _p1) - (_p0 * _p1);
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], texture2d<float> u_glowTexture [[texture(1)]], sampler u_inputTextureSmplr [[sampler(0)]], sampler u_glowTextureSmplr [[sampler(1)]])
{
    main0_out out = {};
    float4 _33 = u_inputTexture.sample(u_inputTextureSmplr, in.v_uv);
    float4 _t1 = float4(0.0);
    if (buffer.u_exposure > 9.9999997473787516355514526367188e-06)
    {
        _t1 = u_glowTexture.sample(u_glowTextureSmplr, in.v_uv);
    }
    float4 _53 = _t1;
    float3 _55 = _53.xyz * buffer.u_glowColor;
    _t1.x = _55.x;
    _t1.y = _55.y;
    _t1.z = _55.z;
    float4 param = _t1;
    float4 param_1 = _33;
    if (buffer.u_displayGlow == 1)
    {
        out.o_fragColor = fast::clamp(_t1, float4(0.0), float4(1.0));
    }
    else
    {
        out.o_fragColor = fast::clamp(_f0(param, param_1), float4(0.0), float4(1.0));
    }
    return out;
}

