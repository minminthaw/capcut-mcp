#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float4 u_ScreenParams;
};

struct main0_out
{
    float2 v_p [[user(locn0)]];
    float4 gl_Position [[position]];
};

struct main0_in
{
    float4 a_position [[attribute(0)]];
    float2 a_texcoord0 [[attribute(1)]];
};

static inline __attribute__((always_inline))
float2 _f0(constant float4& u_ScreenParams)
{
    return u_ScreenParams.xy * (1080.0 / fast::min(u_ScreenParams.x, u_ScreenParams.y));
}

vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
{
    main0_out out = {};
    out.gl_Position = in.a_position;
    out.v_p = in.a_texcoord0 * _f0(buffer.u_ScreenParams);
    out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
    return out;
}

