#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int u_horz;
    int u_vert;
    float4 u_ScreenParams;
    int u_sharp;
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
    return u_inputTexture.sample(u_inputTextureSmplr, (_p1 + (_p2 * float2(0.0, _p0)))) + u_inputTexture.sample(u_inputTextureSmplr, (_p1 - (_p2 * float2(0.0, _p0))));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    bool _54 = buffer.u_horz == 0;
    bool _57 = buffer.u_vert == 0;
    if (_54 && _57)
    {
        out.o_fragColor = u_inputTexture.sample(u_inputTextureSmplr, in.v_uv);
        return out;
    }
    float2 _t2 = float2(float(buffer.u_horz), float(buffer.u_vert));
    if (_54)
    {
        _t2.x = (_t2.y * buffer.u_ScreenParams.x) / buffer.u_ScreenParams.y;
    }
    else
    {
        if (_57)
        {
            _t2.y = (_t2.x * buffer.u_ScreenParams.y) / buffer.u_ScreenParams.x;
        }
    }
    float4 _t4;
    if (buffer.u_sharp == 1)
    {
        _t4 = u_inputTexture.sample(u_inputTextureSmplr, (floor(_t2 * in.v_uv) / _t2));
    }
    else
    {
        float2 _135 = (floor(_t2 * in.v_uv) + float2(0.5)) / _t2;
        _t4 = u_inputTexture.sample(u_inputTextureSmplr, _135);
        float2 _149 = ((float2(1.0) / _t2) / float2(4.0)) / float2(2.0);
        float _t7 = 1.0;
        for (float _t8 = 1.0; _t8 <= 4.0; _t8 += 1.0)
        {
            float param = _t8;
            float2 param_1 = _135;
            float2 param_2 = _149;
            float4 _168 = _t4;
            float3 _170 = _168.xyz + _f0(param, param_1, param_2, u_inputTexture, u_inputTextureSmplr).xyz;
            _t4.x = _170.x;
            _t4.y = _170.y;
            _t4.z = _170.z;
            _t7 += 2.0;
        }
        float4 _183 = _t4;
        float3 _186 = _183.xyz / float3(_t7);
        _t4.x = _186.x;
        _t4.y = _186.y;
        _t4.z = _186.z;
    }
    out.o_fragColor = _t4;
    return out;
}

