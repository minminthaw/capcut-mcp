#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int u_noUseLinearLight;
    float u_gamma;
    float u_redExposure;
    float u_redOffset;
    float u_redGrayscaleCorrection;
    float u_greenExposure;
    float u_greenOffset;
    float u_greenGrayscaleCorrection;
    float u_blueExposure;
    float u_blueOffset;
    float u_blueGrayscaleCorrection;
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
float _f0(thread float& _p0, thread const float& _p1, thread const float& _p2, thread const float& _p3, constant int& u_noUseLinearLight, constant float& u_gamma)
{
    bool _21 = u_noUseLinearLight == 0;
    if (_21)
    {
        _p0 = pow(_p0, u_gamma);
    }
    _p0 *= pow(2.0, _p1);
    _p0 += _p2;
    _p0 = pow(_p0, 1.0 / _p3) * sign(_p0);
    if (_21)
    {
        _p0 = pow(_p0, 1.0 / u_gamma) * sign(_p0);
    }
    return _p0;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _t0 = u_inputTexture.sample(u_inputTextureSmplr, in.uv0);
    float param = _t0.x;
    float param_1 = buffer.u_redExposure;
    float param_2 = buffer.u_redOffset;
    float param_3 = buffer.u_redGrayscaleCorrection;
    float _86 = _f0(param, param_1, param_2, param_3, buffer.u_noUseLinearLight, buffer.u_gamma);
    _t0.x = _86;
    float param_4 = _t0.y;
    float param_5 = buffer.u_greenExposure;
    float param_6 = buffer.u_greenOffset;
    float param_7 = buffer.u_greenGrayscaleCorrection;
    float _101 = _f0(param_4, param_5, param_6, param_7, buffer.u_noUseLinearLight, buffer.u_gamma);
    _t0.y = _101;
    float param_8 = _t0.z;
    float param_9 = buffer.u_blueExposure;
    float param_10 = buffer.u_blueOffset;
    float param_11 = buffer.u_blueGrayscaleCorrection;
    float _116 = _f0(param_8, param_9, param_10, param_11, buffer.u_noUseLinearLight, buffer.u_gamma);
    _t0.z = _116;
    out.o_fragColor = fast::clamp(_t0, float4(0.0), float4(1.0));
    return out;
}

