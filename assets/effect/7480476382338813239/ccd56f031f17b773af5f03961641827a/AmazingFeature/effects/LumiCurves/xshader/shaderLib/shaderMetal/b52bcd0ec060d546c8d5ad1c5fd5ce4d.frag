#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float intensityY;
    float intensityR;
    float intensityG;
    float intensityB;
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
float _f0(thread const float4& _p0)
{
    float _t0 = ((_p0.x * 255.0) + _p0.y) + (_p0.z / 255.0);
    float _53;
    if (_p0.w < 0.5)
    {
        _53 = _t0;
    }
    else
    {
        _53 = -_t0;
    }
    _t0 = _53;
    return _53;
}

static inline __attribute__((always_inline))
float4 _f2(thread const float4& _p0, thread const float4& _p1, texture2d<float> lutR, sampler lutRSmplr, constant float& intensityR)
{
    float4 _t6 = _p1;
    float4 param = lutR.sample(lutRSmplr, float2(_p0.x, 0.5));
    _t6.x = _f0(param);
    _t6.x = _p1.x + ((_t6.x - _p0.x) * intensityR);
    return _t6;
}

static inline __attribute__((always_inline))
float4 _f3(thread const float4& _p0, thread const float4& _p1, texture2d<float> lutG, sampler lutGSmplr, constant float& intensityG)
{
    float4 _t8 = _p1;
    float4 param = lutG.sample(lutGSmplr, float2(_p0.y, 0.5));
    _t8.y = _f0(param);
    _t8.y = _p1.y + ((_t8.y - _p0.y) * intensityG);
    return _t8;
}

static inline __attribute__((always_inline))
float4 _f4(thread const float4& _p0, thread const float4& _p1, texture2d<float> lutB, sampler lutBSmplr, constant float& intensityB)
{
    float4 _t10 = _p1;
    float4 param = lutB.sample(lutBSmplr, float2(_p0.z, 0.5));
    _t10.z = _f0(param);
    _t10.z = _p1.z + ((_t10.z - _p0.z) * intensityB);
    return _t10;
}

static inline __attribute__((always_inline))
float4 _f1(thread const float4& _p0, thread const float4& _p1, texture2d<float> lutY, sampler lutYSmplr, constant float& intensityY)
{
    float4 _t1 = _p1;
    float _80 = ((0.2125999927520751953125 * _p0.x) + (0.715200006961822509765625 * _p0.y)) + (0.072200000286102294921875 * _p0.z);
    float4 param = lutY.sample(lutYSmplr, float2(_80, 0.5));
    float4 _119 = _t1;
    float3 _122 = _119.xyz + float3(((_f0(param) - _80) * intensityY) - ((((0.2125999927520751953125 * _p1.x) + (0.715200006961822509765625 * _p1.y)) + (0.072200000286102294921875 * _p1.z)) - _80));
    _t1.x = _122.x;
    _t1.y = _122.y;
    _t1.z = _122.z;
    return _t1;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> lutY [[texture(0)]], texture2d<float> lutR [[texture(1)]], texture2d<float> lutG [[texture(2)]], texture2d<float> lutB [[texture(3)]], texture2d<float> inputImageTexture [[texture(4)]], sampler lutYSmplr [[sampler(0)]], sampler lutRSmplr [[sampler(1)]], sampler lutGSmplr [[sampler(2)]], sampler lutBSmplr [[sampler(3)]], sampler inputImageTextureSmplr [[sampler(4)]])
{
    main0_out out = {};
    float4 _222 = inputImageTexture.sample(inputImageTextureSmplr, in.uv0);
    float4 param = _222;
    float4 param_1 = _222;
    float4 param_2 = _222;
    float4 param_3 = _f2(param, param_1, lutR, lutRSmplr, buffer.intensityR);
    float4 param_4 = _222;
    float4 param_5 = _f3(param_2, param_3, lutG, lutGSmplr, buffer.intensityG);
    float4 param_6 = _222;
    float4 param_7 = _f4(param_4, param_5, lutB, lutBSmplr, buffer.intensityB);
    out.o_fragColor = _f1(param_6, param_7, lutY, lutYSmplr, buffer.intensityY);
    return out;
}

