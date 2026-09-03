#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct main0_out
{
    float4 FragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(uv0)]];
    float2 maskCoord [[user(maskCoord)]];
    float2 origCoord [[user(origCoord)]];
};

fragment main0_out main0(main0_in in [[stage_in]], texture2d<float> maskTexture [[texture(0)]], texture2d<float> u_FBOTexture [[texture(1)]], sampler maskTextureSmplr [[sampler(0)]], sampler u_FBOTextureSmplr [[sampler(1)]])
{
    main0_out out = {};
    float4 maskColor = maskTexture.sample(maskTextureSmplr, in.maskCoord);
    float2 coord = mix(in.origCoord, in.uv0, float2(maskColor.x));
    coord = mix(coord, in.origCoord, float2(step(0.5, in.maskCoord.x)));
    out.FragColor = u_FBOTexture.sample(u_FBOTextureSmplr, coord);
    return out;
}

