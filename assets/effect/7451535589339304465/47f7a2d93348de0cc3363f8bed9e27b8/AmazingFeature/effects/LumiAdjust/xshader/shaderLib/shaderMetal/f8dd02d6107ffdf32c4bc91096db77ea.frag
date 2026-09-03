#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float4 u_ScreenParams;
    float intensitySharp;
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
float4 _f0(thread const float4& _p0, thread const float& _p1, constant float4& u_ScreenParams, texture2d<float> inputImage, sampler inputImageSmplr, thread float2& v_uv)
{
    if (_p1 == 0.0)
    {
        return _p0;
    }
    float4 _t2 = _p0;
    float _64 = fast::max(0.0, fast::min((fast::max(u_ScreenParams.y, u_ScreenParams.x) - 1000.0) / 2000.0, 1.0));
    float _77 = ((abs(_p1) * 4.0) * (((1.0 - _64) * 0.64999997615814208984375) + (_64 * 1.2000000476837158203125))) + 1.0;
    float _82 = (1.0 - _77) * 0.25;
    float4 _98 = inputImage.sample(inputImageSmplr, (v_uv + float2((-1.0) / u_ScreenParams.x, 0.0)));
    float4 _t7 = _98;
    float _103 = _t7.w;
    float3 _107 = _98.xyz / float3(_103 + 0.001000000047497451305389404296875);
    _t7.x = _107.x;
    _t7.y = _107.y;
    _t7.z = _107.z;
    float4 _122 = inputImage.sample(inputImageSmplr, (v_uv + float2(1.0 / u_ScreenParams.x, 0.0)));
    float4 _t8 = _122;
    float _126 = _t8.w;
    float3 _129 = _122.xyz / float3(_126 + 0.001000000047497451305389404296875);
    _t8.x = _129.x;
    _t8.y = _129.y;
    _t8.z = _129.z;
    float4 _143 = inputImage.sample(inputImageSmplr, (v_uv + float2(0.0, 1.0 / u_ScreenParams.y)));
    float4 _t9 = _143;
    float _147 = _t9.w;
    float3 _150 = _143.xyz / float3(_147 + 0.001000000047497451305389404296875);
    _t9.x = _150.x;
    _t9.y = _150.y;
    _t9.z = _150.z;
    float4 _164 = inputImage.sample(inputImageSmplr, (v_uv + float2(0.0, (-1.0) / u_ScreenParams.y)));
    float4 _t10 = _164;
    float _168 = _t10.w;
    float3 _171 = _164.xyz / float3(_168 + 0.001000000047497451305389404296875);
    _t10.x = _171.x;
    _t10.y = _171.y;
    _t10.z = _171.z;
    float3 _201 = ((((_p0.xyz * _77) + (_t7.xyz * _82)) + (_t8.xyz * _82)) + (_t10.xyz * _82)) + (_t9.xyz * _82);
    _t2.x = _201.x;
    _t2.y = _201.y;
    _t2.z = _201.z;
    float4 _208 = _t2;
    float4 _211 = fast::clamp(_208, float4(0.0), float4(1.0));
    _t2 = _211;
    return _211;
}

static inline __attribute__((always_inline))
float4 _f1(thread const float4& _p0, texture2d<float> lut, sampler lutSmplr)
{
    float _219 = _p0.y * 16.0;
    float _226 = 0.02941176481544971466064453125 + (_p0.x * 0.941176474094390869140625);
    float _236 = (((_p0.z * 16.0) / 17.0) + 0.02941176481544971466064453125) / 17.0;
    return mix(lut.sample(lutSmplr, float2(_236 + (floor(_219) / 17.0), _226)), lut.sample(lutSmplr, float2(_236 + (ceil(_219) / 17.0), _226)), float4(fract(_219)));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> inputImage [[texture(0)]], texture2d<float> lut [[texture(1)]], sampler inputImageSmplr [[sampler(0)]], sampler lutSmplr [[sampler(1)]])
{
    main0_out out = {};
    float4 _t18 = inputImage.sample(inputImageSmplr, in.v_uv);
    if (_t18.w > 0.0)
    {
        float _279 = _t18.w;
        float4 _280 = _t18;
        float3 _283 = _280.xyz / float3(_279);
        _t18.x = _283.x;
        _t18.y = _283.y;
        _t18.z = _283.z;
    }
    float _292 = _t18.w;
    if (abs(buffer.intensitySharp) > 0.001000000047497451305389404296875)
    {
        float4 param = _t18;
        float param_1 = buffer.intensitySharp;
        _t18 = _f0(param, param_1, buffer.u_ScreenParams, inputImage, inputImageSmplr, in.v_uv);
    }
    float4 param_2 = _t18;
    out.o_fragColor = float4(_f1(param_2, lut, lutSmplr).xyz, 1.0) * _292;
    return out;
}

