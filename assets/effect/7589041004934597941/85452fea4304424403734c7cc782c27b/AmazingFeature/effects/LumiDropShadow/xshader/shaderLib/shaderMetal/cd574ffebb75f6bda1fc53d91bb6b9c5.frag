#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_angle;
    float u_distance;
    float2 u_screenSize;
    float u_scale;
    float4 u_color;
    float u_opacity;
    float u_inputOpacity;
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
float2 _f1(thread const float2& _p0, constant float& u_angle, constant float& u_distance, constant float2& u_screenSize)
{
    float _85 = (u_angle * 3.141590118408203125) / 180.0;
    return _p0 + ((float2(cos(_85), sin(_85)) * u_distance) / float2(u_screenSize.x));
}

static inline __attribute__((always_inline))
float _f0(texture2d<float> _p0, sampler _p0Smplr, thread float2& _p1)
{
    float2 _35 = _p1;
    _p1 = step(float2(0.0), _p1) * step(_p1, float2(1.0));
    float4 _t0 = _p0.sample(_p0Smplr, _35) * (_p1.x * _p1.y);
    return ((_t0.x + (_t0.y / 255.0)) + (_t0.z / 65025.0)) + (_t0.w / 16581375.0);
}

static inline __attribute__((always_inline))
float4 _f2(texture2d<float> _p0, sampler _p0Smplr, thread float2& _p1)
{
    float2 _108 = _p1;
    _p1 = step(float2(0.0), _p1) * step(_p1, float2(1.0));
    return (_p0.sample(_p0Smplr, _108) * _p1.x) * _p1.y;
}

static inline __attribute__((always_inline))
float4 _f3(thread const float4& _p0, thread const float4& _p1)
{
    return _p1 + (_p0 * (1.0 - _p1.w));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_shadowTexture [[texture(0)]], texture2d<float> u_shadowMaskTexture [[texture(1)]], texture2d<float> u_inputTexture [[texture(2)]], sampler u_shadowTextureSmplr [[sampler(0)]], sampler u_shadowMaskTextureSmplr [[sampler(1)]], sampler u_inputTextureSmplr [[sampler(2)]])
{
    main0_out out = {};
    float2 param = in.v_uv;
    float2 _138 = _f1(param, buffer.u_angle, buffer.u_distance, buffer.u_screenSize);
    float2 param_1 = ((_138 - float2(0.5)) * buffer.u_scale) + float2(0.5);
    float _153 = _f0(u_shadowTexture, u_shadowTextureSmplr, param_1);
    float4 _t7 = u_shadowMaskTexture.sample(u_shadowMaskTextureSmplr, _138);
    float2 param_2 = in.v_uv;
    float4 _164 = _f2(u_inputTexture, u_inputTextureSmplr, param_2);
    float4 param_3 = ((buffer.u_color * _153) * buffer.u_opacity) * _t7.x;
    float4 param_4 = _164 * buffer.u_inputOpacity;
    out.o_fragColor = _f3(param_3, param_4);
    return out;
}

