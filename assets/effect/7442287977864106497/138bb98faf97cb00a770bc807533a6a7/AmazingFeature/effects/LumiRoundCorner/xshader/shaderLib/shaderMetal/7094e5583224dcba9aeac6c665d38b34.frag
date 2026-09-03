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
    float2 _32 = ((((in.v_p / buffer.u_ScreenParams.xy) - float2(0.5)) * 1.019999980926513671875) + float2(0.5)) * buffer.u_ScreenParams.xy;
    float2 _36 = buffer.u_ScreenParams.xy * 0.5;
    float2 _48 = abs(_32 - _36) - (_36 - float2(buffer.u_radius));
    float2 _t2 = _48;
    out.o_fragColor = u_inputTexture.sample(u_inputTextureSmplr, (_32 / buffer.u_ScreenParams.xy)) * smoothstep(buffer.u_fade0, buffer.u_fade1, -((length(fast::max(_48, float2(0.0))) + fast::min(fast::max(_t2.x, _t2.y), 0.0)) - buffer.u_radius));
    return out;
}

