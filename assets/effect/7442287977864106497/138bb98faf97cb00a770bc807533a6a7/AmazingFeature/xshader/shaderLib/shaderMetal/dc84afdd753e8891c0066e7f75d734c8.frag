#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float4 u_ScreenParams;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], texture2d<float> u_one_one [[texture(1)]], texture2d<float> u_nine_ [[texture(2)]], texture2d<float> u_three_four [[texture(3)]], sampler u_inputTextureSmplr [[sampler(0)]], sampler u_one_oneSmplr [[sampler(1)]], sampler u_nine_Smplr [[sampler(2)]], sampler u_three_fourSmplr [[sampler(3)]])
{
    main0_out out = {};
    float4 _t1 = u_inputTexture.sample(u_inputTextureSmplr, in.uv0);
    float4 _t2 = u_one_one.sample(u_one_oneSmplr, in.uv0);
    float _38 = buffer.u_ScreenParams.x / buffer.u_ScreenParams.y;
    if (_38 <= 0.75)
    {
        _t2 = u_nine_.sample(u_nine_Smplr, in.uv0);
    }
    if (_38 >= 1.34000003337860107421875)
    {
        _t2 = u_three_four.sample(u_three_fourSmplr, in.uv0);
    }
    float4 _65 = _t1;
    float4 _66 = _65 * _t2.w;
    _t1 = _66;
    out.o_fragColor = _66;
    return out;
}

