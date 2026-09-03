#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float4 u_ScreenParams;
    float u_sigma;
    float u_step;
    float u_radius;
    float2 u_dir;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_p [[user(locn0)]];
};

static inline __attribute__((always_inline))
float2 _f0(constant float4& u_ScreenParams)
{
    return u_ScreenParams.xy * (1080.0 / fast::min(u_ScreenParams.x, u_ScreenParams.y));
}

static inline __attribute__((always_inline))
float _f2(texture2d<float> _p0, sampler _p0Smplr, thread float2& _p1)
{
    float2 _89 = _p1;
    _p1 = step(float2(0.0), _p1) * step(_p1, float2(1.0));
    float4 _t2 = _p0.sample(_p0Smplr, _89) * (_p1.x * _p1.y);
    return ((_t2.x + (_t2.y / 255.0)) + (_t2.z / 65025.0)) + (_t2.w / 16581375.0);
}

static inline __attribute__((always_inline))
float _f3(thread const float& _p0, thread const float& _p1)
{
    return exp((((-0.5) * _p0) * _p0) / (_p1 * _p1));
}

static inline __attribute__((always_inline))
float4 _f1(thread float& _p0)
{
    float4 _t1 = float4(0.0);
    _p0 *= 255.0;
    _t1.x = floor(_p0) / 255.0;
    _p0 = fract(_p0);
    _p0 *= 255.0;
    _t1.y = floor(_p0) / 255.0;
    _p0 = fract(_p0);
    _p0 *= 255.0;
    _t1.z = floor(_p0) / 255.0;
    _p0 = fract(_p0);
    _t1.w = _p0;
    return _t1;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 _139 = float2(1.0) / _f0(buffer.u_ScreenParams);
    float2 param = in.v_p * _139;
    float _148 = _f2(u_inputTexture, u_inputTextureSmplr, param);
    float _t4 = _148;
    float param_1 = 0.0;
    float param_2 = buffer.u_sigma;
    float _t5 = _f3(param_1, param_2);
    for (int _t6 = 1; _t6 < 1024; _t6++)
    {
        float _173 = buffer.u_step * float(_t6);
        if (_173 > buffer.u_radius)
        {
            break;
        }
        float param_3 = _173;
        float param_4 = buffer.u_sigma;
        float _186 = _f3(param_3, param_4);
        float2 _193 = buffer.u_dir * _173;
        float2 param_5 = (in.v_p + _193) * _139;
        float _198 = _f2(u_inputTexture, u_inputTextureSmplr, param_5);
        _t4 += (_186 * _198);
        float2 param_6 = (in.v_p - _193) * _139;
        float _211 = _f2(u_inputTexture, u_inputTextureSmplr, param_6);
        _t4 += (_186 * _211);
        _t5 += (_186 * 2.0);
    }
    float param_7 = _t4 / _t5;
    float4 _228 = _f1(param_7);
    out.o_fragColor = _228;
    return out;
}

