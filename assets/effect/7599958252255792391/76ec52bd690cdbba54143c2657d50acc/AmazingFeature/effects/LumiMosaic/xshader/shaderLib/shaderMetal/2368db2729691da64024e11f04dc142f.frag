#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int u_horz;
    int u_vert;
    float4 u_ScreenParams;
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
float4 _f0(thread const float& _p0, thread const float2& _p1, thread const float2& _p2, texture2d<float> u_inputTexture, sampler u_inputTextureSmplr)
{
    return u_inputTexture.sample(u_inputTextureSmplr, (_p1 + (_p2 * float2(_p0, 0.0)))) + u_inputTexture.sample(u_inputTextureSmplr, (_p1 - (_p2 * float2(_p0, 0.0))));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 _t2 = float2(float(buffer.u_horz), float(buffer.u_vert));
    if (buffer.u_horz == 0)
    {
        _t2.x = (_t2.y * buffer.u_ScreenParams.x) / buffer.u_ScreenParams.y;
    }
    else
    {
        if (buffer.u_vert == 0)
        {
            _t2.y = (_t2.x * buffer.u_ScreenParams.y) / buffer.u_ScreenParams.x;
        }
    }
    float2 _104 = (floor(_t2 * in.v_uv) + float2(0.5)) / _t2;
    float4 _t4 = u_inputTexture.sample(u_inputTextureSmplr, _104);
    float2 _119 = ((float2(1.0) / _t2) / float2(4.0)) / float2(2.0);
    float _t6 = 1.0;
    for (float _t7 = 1.0; _t7 <= 4.0; _t7 += 1.0)
    {
        float param = _t7;
        float2 param_1 = _104;
        float2 param_2 = _119;
        float4 _138 = _t4;
        float3 _140 = _138.xyz + _f0(param, param_1, param_2, u_inputTexture, u_inputTextureSmplr).xyz;
        _t4.x = _140.x;
        _t4.y = _140.y;
        _t4.z = _140.z;
        _t6 += 2.0;
    }
    float4 _153 = _t4;
    float3 _156 = _153.xyz / float3(_t6);
    _t4.x = _156.x;
    _t4.y = _156.y;
    _t4.z = _156.z;
    out.o_fragColor = _t4;
    return out;
}

