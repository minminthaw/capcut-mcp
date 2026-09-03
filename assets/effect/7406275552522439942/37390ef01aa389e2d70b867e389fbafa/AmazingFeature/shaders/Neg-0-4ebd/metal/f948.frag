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
    float2 origCoord [[user(origCoord)]];
};

static inline __attribute__((always_inline))
float4 interp(thread const float2& coord, texture2d<float> u_FBOTexture, sampler u_FBOTextureSmplr)
{
    float2 w_ab = fract(coord * 512.0);
    float2 coord_0 = coord - (w_ab / float2(512.0));
    float4 p1 = u_FBOTexture.sample(u_FBOTextureSmplr, coord_0);
    float4 p2 = u_FBOTexture.sample(u_FBOTextureSmplr, (coord_0 + float2(0.0, 0.001953125)));
    float4 p3 = u_FBOTexture.sample(u_FBOTextureSmplr, (coord_0 + float2(0.001953125, 0.0)));
    float4 p4 = u_FBOTexture.sample(u_FBOTextureSmplr, (coord_0 + float2(0.001953125)));
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
float4 vec2ToVec4(thread const float2& val)
{
    float a = floor(val.x * 255.0) / 255.0;
    float b = fract(val.x * 255.0);
    float c = floor(val.y * 255.0) / 255.0;
    float d = fract(val.y * 255.0);
    return float4(a, b, c, d);
}

fragment main0_out main0(main0_in in [[stage_in]], texture2d<float> u_FBOTexture [[texture(0)]], sampler u_FBOTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 param = in.uv0 - float2(0.0009765625);
    float4 param_1 = interp(param, u_FBOTexture, u_FBOTextureSmplr);
    float2 param_2 = (vec4ToVec2(param_1) + in.uv0) - in.origCoord;
    out.gl_FragColor = vec2ToVec4(param_2);
    return out;
}

