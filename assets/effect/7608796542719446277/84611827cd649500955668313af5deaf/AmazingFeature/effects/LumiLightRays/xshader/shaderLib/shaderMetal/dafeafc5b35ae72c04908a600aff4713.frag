#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float light_transferMode;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> inputTexture [[texture(0)]], texture2d<float> lightTexture [[texture(1)]], sampler inputTextureSmplr [[sampler(0)]], sampler lightTextureSmplr [[sampler(1)]])
{
    main0_out out = {};
    float4 _19 = inputTexture.sample(inputTextureSmplr, in.uv0);
    float4 _24 = lightTexture.sample(lightTextureSmplr, in.uv0);
    if (buffer.light_transferMode < 0.5)
    {
        out.o_fragColor = _24;
    }
    else
    {
        if (buffer.light_transferMode < 1.5)
        {
            out.o_fragColor = _24 + _19;
        }
        else
        {
            if (buffer.light_transferMode < 2.5)
            {
                out.o_fragColor = fast::max(_24, _19);
            }
            else
            {
                if (buffer.light_transferMode < 3.5)
                {
                    out.o_fragColor = float4(1.0) - ((float4(1.0) - _24) * (float4(1.0) - _19));
                }
                else
                {
                    out.o_fragColor = _24;
                }
            }
        }
    }
    return out;
}

