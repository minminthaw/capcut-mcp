#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int u_colorType;
    float u_threshold;
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
float _f0(thread const float3& _p0)
{
    return dot(_p0, float3(0.2125999927520751953125, 0.715200006961822509765625, 0.072200000286102294921875));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _33 = u_inputTexture.sample(u_inputTextureSmplr, in.uv0);
    float4 _t0 = _33;
    float3 param = _33.xyz;
    float _39 = _f0(param);
    if (buffer.u_colorType == 1)
    {
        float3 _50 = float3(_39);
        _t0.x = _50.x;
        _t0.y = _50.y;
        _t0.z = _50.z;
    }
    if (_39 < buffer.u_threshold)
    {
        _t0 = float4(0.0);
    }
    out.o_fragColor = _t0;
    return out;
}

