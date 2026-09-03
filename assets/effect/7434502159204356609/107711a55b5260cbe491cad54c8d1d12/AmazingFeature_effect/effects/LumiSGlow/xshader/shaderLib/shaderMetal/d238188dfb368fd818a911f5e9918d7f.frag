#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float glowFromAlpha;
    float threshold;
    float3 color;
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
    float _17;
    if (_p0 <= _p1)
    {
        _17 = 0.0;
    }
    else
    {
        _17 = (_p0 - _p1) / (1.0 - _p1);
    }
    return _17;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> inputTexture [[texture(0)]], sampler inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _44 = inputTexture.sample(inputTextureSmplr, in.v_uv);
    float4 _t0 = _44;
    float3 _53 = mix(_44.xyz, float3(1.0), float3(buffer.glowFromAlpha));
    _t0.x = _53.x;
    _t0.y = _53.y;
    _t0.z = _53.z;
    float param = _t0.x;
    float param_1 = buffer.threshold + buffer.color.x;
    float param_2 = _t0.y;
    float param_3 = buffer.threshold + buffer.color.y;
    float param_4 = _t0.z;
    float param_5 = buffer.threshold + buffer.color.z;
    out.o_fragColor = _t0 * (((_f0(param, param_1) + _f0(param_2, param_3)) + _f0(param_4, param_5)) / fast::max((_t0.x + _t0.y) + _t0.z, 9.9999999747524270787835121154785e-07));
    return out;
}

