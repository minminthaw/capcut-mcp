#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int u_blendMode;
    int u_directionNum;
    float u_exposure;
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
float4 _f0(thread const float4& _p0, thread const float4& _p1)
{
    return (_p0 + _p1) - (_p0 * _p1);
}

static inline __attribute__((always_inline))
float4 _f1(thread const float4& _p0, thread const float4& _p1)
{
    return _p0 + _p1;
}

static inline __attribute__((always_inline))
float4 _f2(thread const float4& _p0, thread const float4& _p1, constant int& u_blendMode)
{
    if (u_blendMode == 0)
    {
        float4 param = _p0;
        float4 param_1 = _p1;
        return _f0(param, param_1);
    }
    else
    {
        float4 param_2 = _p0;
        float4 param_3 = _p1;
        return _f1(param_2, param_3);
    }
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_tex1 [[texture(0)]], texture2d<float> u_tex2 [[texture(1)]], texture2d<float> u_tex3 [[texture(2)]], texture2d<float> u_tex4 [[texture(3)]], sampler u_tex1Smplr [[sampler(0)]], sampler u_tex2Smplr [[sampler(1)]], sampler u_tex3Smplr [[sampler(2)]], sampler u_tex4Smplr [[sampler(3)]])
{
    main0_out out = {};
    float4 _t0 = u_tex1.sample(u_tex1Smplr, in.v_uv);
    if (buffer.u_directionNum >= 2)
    {
        float4 param = _t0;
        float4 param_1 = u_tex2.sample(u_tex2Smplr, in.v_uv);
        _t0 = _f2(param, param_1, buffer.u_blendMode);
    }
    if (buffer.u_directionNum >= 3)
    {
        float4 param_2 = _t0;
        float4 param_3 = u_tex3.sample(u_tex3Smplr, in.v_uv);
        _t0 = _f2(param_2, param_3, buffer.u_blendMode);
    }
    if (buffer.u_directionNum >= 4)
    {
        float4 param_4 = _t0;
        float4 param_5 = u_tex4.sample(u_tex4Smplr, in.v_uv);
        _t0 = _f2(param_4, param_5, buffer.u_blendMode);
    }
    if (buffer.u_blendMode == 2)
    {
        _t0 /= float4(float(buffer.u_directionNum));
    }
    float4 _129 = _t0;
    float3 _131 = _129.xyz * buffer.u_exposure;
    _t0.x = _131.x;
    _t0.y = _131.y;
    _t0.z = _131.z;
    out.o_fragColor = fast::clamp(_t0, float4(0.0), float4(1.0));
    return out;
}

