#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_Steps;
    float u_Sample;
    float u_Angle;
    float u_ExpandFlag;
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

static inline __attribute__((always_inline))
float _f0(thread const float& _p0, thread const float& _p1)
{
    return (0.3989399969577789306640625 * exp((((-0.5) * _p0) * _p0) / (_p1 * _p1))) / _p1;
}

static inline __attribute__((always_inline))
float4 _f1(texture2d<float> _p0, sampler _p0Smplr, thread const float2& _p1, thread const float2& _p2, constant float& u_Steps, constant float& u_Sample)
{
    float param = 0.0;
    float param_1 = 4.0;
    float _48 = _f0(param, param_1);
    float4 _t2 = float4(0.0);
    float2 _58 = _p2 * u_Steps;
    float _t8 = _48;
    for (int _t10 = 1; _t10 <= 1024; _t10++)
    {
        if (float(_t10) > u_Sample)
        {
            break;
        }
        float _100 = float(_t10);
        float param_2 = (_100 / u_Sample) * 15.0;
        float param_3 = 4.0;
        float _129 = _f0(param_2, param_3);
        _t2 = (_t2 + (pow(_p0.sample(_p0Smplr, (_p1 + (_58 * _100))), float4(2.2000000476837158203125)) * _129)) + (pow(_p0.sample(_p0Smplr, (_p1 + (_58 * float(-_t10)))), float4(2.2000000476837158203125)) * _129);
        _t8 += (_129 * 2.0);
    }
    return fast::clamp(pow((_t2 + (pow(_p0.sample(_p0Smplr, _p1), float4(2.2000000476837158203125)) * _48)) / float4(_t8), float4(0.454545438289642333984375)), float4(0.0), float4(1.0));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_InputTex [[texture(0)]], sampler u_InputTexSmplr [[sampler(0)]])
{
    main0_out out = {};
    float _177 = (buffer.u_Angle * 3.141592502593994140625) / 180.0;
    float2 param = in.uv0;
    float2 param_1 = float2(cos(_177), sin(_177)) / ((buffer.u_ScreenParams.xy * ((1.0 + (buffer.u_ExpandFlag * 0.4000000059604644775390625)) * 720.0)) / float2(fast::min(buffer.u_ScreenParams.x, buffer.u_ScreenParams.y)));
    out.o_fragColor = _f1(u_InputTex, u_InputTexSmplr, param, param_1, buffer.u_Steps, buffer.u_Sample);
    return out;
}

