#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float4 u_ScreenParams;
    float u_radius;
    float u_fade0;
    float u_fade1;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_p [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 _16 = buffer.u_ScreenParams.xy * 0.5;
    float2 _30 = abs(in.v_p - _16) - (_16 - float2(buffer.u_radius));
    float2 _t1 = _30;
    out.o_fragColor = u_inputTexture.sample(u_inputTextureSmplr, (in.v_p / buffer.u_ScreenParams.xy)) * smoothstep(buffer.u_fade0, buffer.u_fade1, -((length(fast::max(_30, float2(0.0))) + fast::min(fast::max(_t1.x, _t1.y), 0.0)) - buffer.u_radius));
    return out;
}

