#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float uniAlpha;
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
float4 _f0(texture2d<float> _p0, sampler _p0Smplr, thread const float4& _p1, thread const float& _p2)
{
    float4 _t0 = _p1;
    float _27 = _t0.z * 63.0;
    float _32 = floor(_27);
    float2 _t2;
    _t2.y = floor(_32 / 8.0);
    _t2.x = _32 - (_t2.y * 8.0);
    float _48 = ceil(_27);
    float2 _t3;
    _t3.y = floor(_48 / 8.0);
    _t3.x = _48 - (_t3.y * 8.0);
    float2 _t4;
    _t4.x = (((_t2.x * 1.0) / 8.0) + 0.0009765625) + (0.123046875 * _t0.x);
    _t4.y = (((_t2.y * 1.0) / 8.0) + 0.0009765625) + (0.123046875 * _t0.y);
    float2 _t5;
    _t5.x = (((_t3.x * 1.0) / 8.0) + 0.0009765625) + (0.123046875 * _t0.x);
    _t5.y = (((_t3.y * 1.0) / 8.0) + 0.0009765625) + (0.123046875 * _t0.y);
    _t4.y = 1.0 - _t4.y;
    _t5.y = 1.0 - _t5.y;
    return mix(_p1, float4(mix(_p0.sample(_p0Smplr, _t4), _p0.sample(_p0Smplr, _t5), float4(fract(_27))).xyz, _t0.w), float4(_p2));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> inputImageTexture [[texture(0)]], texture2d<float> inputImageTexture2 [[texture(1)]], sampler inputImageTextureSmplr [[sampler(0)]], sampler inputImageTexture2Smplr [[sampler(1)]])
{
    main0_out out = {};
    if (buffer.uniAlpha < 9.9999997473787516355514526367188e-06)
    {
        out.o_fragColor = inputImageTexture.sample(inputImageTextureSmplr, in.v_uv);
        return out;
    }
    float4 _164 = inputImageTexture.sample(inputImageTextureSmplr, in.v_uv);
    float4 _t9 = _164;
    float4 param = _164;
    float param_1 = buffer.uniAlpha;
    float4 _171 = _f0(inputImageTexture2, inputImageTexture2Smplr, param, param_1);
    float4 _t10 = _171;
    float3 _179 = mix(_164.xyz, _171.xyz, float3(_t9.w));
    _t10.x = _179.x;
    _t10.y = _179.y;
    _t10.z = _179.z;
    _t10.w = _t9.w;
    out.o_fragColor = _t10;
    return out;
}

