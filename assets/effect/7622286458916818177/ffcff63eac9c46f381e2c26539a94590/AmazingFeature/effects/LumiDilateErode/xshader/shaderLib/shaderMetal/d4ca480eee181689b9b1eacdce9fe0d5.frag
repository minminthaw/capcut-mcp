#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float4 u_ScreenParams;
    float normSize;
    float kernelSize;
    float channel;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_uv [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> oriImageTexture [[texture(0)]], texture2d<float> inputImageTexture [[texture(1)]], sampler oriImageTextureSmplr [[sampler(0)]], sampler inputImageTextureSmplr [[sampler(1)]])
{
    main0_out out = {};
    float2 _t1 = float2(abs(buffer.kernelSize / 5.0)) / ((buffer.u_ScreenParams.xy / float2(fast::min(buffer.u_ScreenParams.x, buffer.u_ScreenParams.y))) * buffer.normSize);
    if (abs(buffer.kernelSize) < 0.00999999977648258209228515625)
    {
        if (buffer.channel < 0.5)
        {
            out.o_fragColor = oriImageTexture.sample(oriImageTextureSmplr, in.v_uv);
        }
        else
        {
            float4 _t2 = oriImageTexture.sample(oriImageTextureSmplr, in.v_uv);
            out.o_fragColor = float4(float3(((0.2989999949932098388671875 * _t2.x) + (0.58700001239776611328125 * _t2.y)) + (0.114000000059604644775390625 * _t2.z)), _t2.w);
        }
    }
    else
    {
        out.o_fragColor = ((((((((inputImageTexture.sample(inputImageTextureSmplr, in.v_uv) * 0.20000000298023223876953125) + (inputImageTexture.sample(inputImageTextureSmplr, (in.v_uv + float2(_t1.x, 0.0))) * 0.1500000059604644775390625)) + (inputImageTexture.sample(inputImageTextureSmplr, (in.v_uv + float2(-_t1.x, 0.0))) * 0.1500000059604644775390625)) + (inputImageTexture.sample(inputImageTextureSmplr, (in.v_uv + float2(0.0, _t1.y))) * 0.1500000059604644775390625)) + (inputImageTexture.sample(inputImageTextureSmplr, (in.v_uv + float2(0.0, -_t1.y))) * 0.1500000059604644775390625)) + (inputImageTexture.sample(inputImageTextureSmplr, (in.v_uv + float2(_t1.x, _t1.y))) * 0.0500000007450580596923828125)) + (inputImageTexture.sample(inputImageTextureSmplr, (in.v_uv + float2(_t1.x, -_t1.y))) * 0.0500000007450580596923828125)) + (inputImageTexture.sample(inputImageTextureSmplr, (in.v_uv + float2(-_t1.x, _t1.y))) * 0.0500000007450580596923828125)) + (inputImageTexture.sample(inputImageTextureSmplr, (in.v_uv + float2(-_t1.x, -_t1.y))) * 0.0500000007450580596923828125);
    }
    return out;
}

