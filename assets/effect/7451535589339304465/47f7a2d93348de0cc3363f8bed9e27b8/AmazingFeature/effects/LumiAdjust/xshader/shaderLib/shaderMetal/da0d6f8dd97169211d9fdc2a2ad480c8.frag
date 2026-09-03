#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float ins;
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
float3 _f0(thread const float3& _p0)
{
    float4 _83 = mix(float4(_p0.zy, -1.0, 0.666666686534881591796875), float4(_p0.yz, 0.0, -0.3333333432674407958984375), float4(step(_p0.z, _p0.y)));
    float4 _t1 = _83;
    float4 _t2 = mix(float4(_83.xyw, _p0.x), float4(_p0.x, _83.yzx), float4(step(_t1.x, _p0.x)));
    float _118 = _t2.x - fast::min(_t2.w, _t2.y);
    return float3(abs(_t2.z + ((_t2.w - _t2.y) / ((6.0 * _118) + 1.0000000133514319600180897396058e-10))), _118 / (_t2.x + 1.0000000133514319600180897396058e-10), _t2.x);
}

static inline __attribute__((always_inline))
float _f4(thread const float& _p0, thread const float& _p1)
{
    float _t8 = 1.0 - (_p0 / _p1);
    if (_p0 >= _p1)
    {
        _t8 = 0.0;
    }
    return _t8;
}

static inline __attribute__((always_inline))
float _f2(thread const float& _p0, texture2d<float> _p1, sampler _p1Smplr, thread const float& _p2)
{
    return _p1.sample(_p1Smplr, float2(_p0, _p2)).x;
}

static inline __attribute__((always_inline))
float3 _f1(thread const float3& _p0)
{
    return mix(float3(1.0), fast::clamp(abs((fract(_p0.xxx + float3(1.0, 0.666666686534881591796875, 0.3333333432674407958984375)) * 6.0) - float3(3.0)) - float3(1.0), float3(0.0), float3(1.0)), float3(_p0.y)) * _p0.z;
}

static inline __attribute__((always_inline))
float3 _f3(thread const float3& _p0, texture2d<float> _p1, sampler _p1Smplr, thread const float& _p2)
{
    return float3(_p1.sample(_p1Smplr, float2(_p0.x, _p2)).x, _p1.sample(_p1Smplr, float2(_p0.y, _p2)).x, _p1.sample(_p1Smplr, float2(_p0.z, _p2)).x);
}

static inline __attribute__((always_inline))
float3 _f5(thread const float3& _p0, thread const float& _p1, texture2d<float> pLut1, sampler pLut1Smplr, texture2d<float> pLut2, sampler pLut2Smplr)
{
    float3 param = _p0;
    float3 _t9 = _f0(param);
    float param_1 = _t9.z;
    float param_2 = 0.800000011920928955078125;
    float param_3 = _t9.z;
    float param_4 = _p1;
    _t9.z = _f2(param_3, pLut1, pLut1Smplr, param_4);
    float3 param_5 = _t9;
    float3 param_6 = mix(_p0, _f1(param_5), float3(_f4(param_1, param_2)));
    float param_7 = _p1;
    return _f3(param_6, pLut2, pLut2Smplr, param_7);
}

static inline __attribute__((always_inline))
float3 _f6(thread const float3& _p0, thread const float& _p1, texture2d<float> nLut1, sampler nLut1Smplr, texture2d<float> nLut2, sampler nLut2Smplr)
{
    float3 param = _p0;
    float3 _t13 = _f0(param);
    float param_1 = _t13.z;
    float param_2 = 0.89999997615814208984375;
    float param_3 = _t13.z;
    float param_4 = _p1;
    _t13.z = mix(_t13.z, _f2(param_3, nLut1, nLut1Smplr, param_4), _f4(param_1, param_2));
    float3 param_5 = _t13;
    float3 param_6 = _f1(param_5);
    float param_7 = _p1;
    return _f3(param_6, nLut2, nLut2Smplr, param_7);
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> pLut1 [[texture(0)]], texture2d<float> pLut2 [[texture(1)]], texture2d<float> nLut1 [[texture(2)]], texture2d<float> nLut2 [[texture(3)]], texture2d<float> inputImageTexture [[texture(4)]], sampler pLut1Smplr [[sampler(0)]], sampler pLut2Smplr [[sampler(1)]], sampler nLut1Smplr [[sampler(2)]], sampler nLut2Smplr [[sampler(3)]], sampler inputImageTextureSmplr [[sampler(4)]])
{
    main0_out out = {};
    float4 _317 = inputImageTexture.sample(inputImageTextureSmplr, in.v_uv);
    float4 _t17 = _317;
    float _325 = (buffer.ins - 0.5) * 2.0;
    float _328 = abs(_325);
    float3 param = _317.xyz;
    float param_1 = _328;
    float3 param_2 = _t17.xyz;
    float param_3 = _328;
    float3 _348 = mix(_f6(param_2, param_3, nLut1, nLut1Smplr, nLut2, nLut2Smplr), _f5(param, param_1, pLut1, pLut1Smplr, pLut2, pLut2Smplr), float3(step(0.0, _325)));
    _t17.x = _348.x;
    _t17.y = _348.y;
    _t17.z = _348.z;
    out.o_fragColor = float4(_t17);
    return out;
}

