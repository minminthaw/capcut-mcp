#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct main0_out
{
    float4 gl_FragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(uv0)]];
};

static inline __attribute__((always_inline))
float4 interp(thread const float2& coord, texture2d<float> u_uvTexture, sampler u_uvTextureSmplr)
{
    float2 w_ab = fract(coord * 512.0);
    float2 coord_0 = coord - (w_ab / float2(512.0));
    float4 p1 = u_uvTexture.sample(u_uvTextureSmplr, coord_0);
    float4 p2 = u_uvTexture.sample(u_uvTextureSmplr, (coord_0 + float2(0.0, 0.001953125)));
    float4 p3 = u_uvTexture.sample(u_uvTextureSmplr, (coord_0 + float2(0.001953125, 0.0)));
    float4 p4 = u_uvTexture.sample(u_uvTextureSmplr, (coord_0 + float2(0.001953125)));
    float4 res = ((((p1 * (1.0 - w_ab.x)) * (1.0 - w_ab.y)) + ((p2 * (1.0 - w_ab.x)) * w_ab.y)) + ((p3 * w_ab.x) * (1.0 - w_ab.y))) + ((p4 * w_ab.x) * w_ab.y);
    return res;
}

static inline __attribute__((always_inline))
float2 vec4ToVec2(thread const float4& val)
{
    float a = val.x + (val.y / 255.0);
    float b = val.z + (val.w / 255.0);
    return float2(a, b);
}

static inline __attribute__((always_inline))
float2 calibrate(thread const float2& val)
{
    float2 sign_ = sign(val);
    float2 abs_ = fast::max(abs(val) - float2(1.52587890625e-05), float2(0.0));
    return sign_ * abs_;
}

fragment main0_out main0(main0_in in [[stage_in]], texture2d<float> u_uvTexture [[texture(0)]], texture2d<float> src_Texture [[texture(1)]], sampler u_uvTextureSmplr [[sampler(0)]], sampler src_TextureSmplr [[sampler(1)]])
{
    main0_out out = {};
    float2 param = in.uv0 - float2(0.0009765625);
    float4 newCoord = interp(param, u_uvTexture, u_uvTextureSmplr);
    float4 param_1 = newCoord;
    float2 param_2 = vec4ToVec2(param_1) - float2(0.5);
    float4 textureColor = src_Texture.sample(src_TextureSmplr, (calibrate(param_2) + in.uv0));
    out.gl_FragColor = textureColor;
    return out;
}

