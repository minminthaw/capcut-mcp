#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int edgeMode;
    float4 u_ScreenParams;
    float dither;
    float4 ColorRadius;
    float MaxRadius;
    float4 ColorSigma;
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
float2 _f0(thread const float4& _p0)
{
    return float2(_p0.x + (_p0.y / 255.0), _p0.z + (_p0.w / 255.0));
}

static inline __attribute__((always_inline))
float _f5(thread const float& _p0, thread const float& _p1)
{
    return exp((-(_p0 * _p0)) / _p1);
}

static inline __attribute__((always_inline))
float _f3(thread const float& _p0, thread const float& _p1)
{
    float2 _131 = fract(float2(_p0, _p1) * 13.5170001983642578125);
    float2 _t7 = _131 + float2(dot(_131, _131.yx + float2(22.5410003662109375)));
    return fract((_t7.x + _t7.y) * _t7.y) - 0.5;
}

static inline __attribute__((always_inline))
float2 _f2(thread const float& _p0, thread const float& _p1, constant int& edgeMode)
{
    float2 _t6 = float2(1.0);
    if (edgeMode == 0)
    {
        _t6.x = step(0.0, _p0) * step(_p0, 1.0);
        _t6.y = step(0.0, _p1) * step(_p1, 1.0);
    }
    return _t6;
}

static inline __attribute__((always_inline))
float4 _f4(thread const float& _p0, thread const float& _p1, constant int& edgeMode, constant float4& u_ScreenParams, thread float2& uv0, constant float& dither, texture2d<float> inputTexture, sampler inputTextureSmplr)
{
    float2 _161 = float2(1.0) / u_ScreenParams.xy;
    float param = (_p0 + uv0.x) + 0.22300000488758087158203125;
    float param_1 = _p0 * uv0.y;
    float2 _191 = uv0 + (_161 * float2(0.0, _p0 + ((dither * _p1) * _f3(param, param_1))));
    float2 _t9 = _191;
    float param_2 = (_p0 + uv0.x) + 0.5690000057220458984375;
    float param_3 = _p0 * uv0.y;
    float2 _216 = uv0 - (_161 * float2(0.0, _p0 + ((dither * _p1) * _f3(param_2, param_3))));
    float2 _t10 = _216;
    float param_4 = _t9.y;
    float param_5 = _t10.y;
    float2 _t11 = _f2(param_4, param_5, edgeMode);
    float4 param_6 = inputTexture.sample(inputTextureSmplr, _191);
    float4 param_7 = inputTexture.sample(inputTextureSmplr, _216);
    return (float4(0.0, 0.0, _f0(param_6)) * _t11.x) + (float4(0.0, 0.0, _f0(param_7)) * _t11.y);
}

static inline __attribute__((always_inline))
float4 _f6(thread float4& _p0, constant int& edgeMode, constant float4& u_ScreenParams, thread float2& uv0, constant float& dither, texture2d<float> inputTexture, sampler inputTextureSmplr, constant float4& ColorRadius, constant float& MaxRadius, constant float4& ColorSigma)
{
    float4 _t12 = float4(1.0);
    float4 _t13 = float4(0.0);
    float _285 = fast::max(1.0, fast::max(fast::max(ColorRadius.x, ColorRadius.y), ColorRadius.z) / MaxRadius);
    float _t17 = 1.0;
    for (float _t18 = 1.0; _t18 <= 128.0; _t18 += 1.0)
    {
        if (_t17 > 128.0)
        {
            break;
        }
        bool _304 = _t17 <= ColorRadius.x;
        bool _312;
        if (!_304)
        {
            _312 = _t17 <= ColorRadius.y;
        }
        else
        {
            _312 = _304;
        }
        bool _320;
        if (!_312)
        {
            _320 = _t17 <= ColorRadius.z;
        }
        else
        {
            _320 = _312;
        }
        if ((_t17 > (MaxRadius * _285)) || (!_320))
        {
            break;
        }
        float param = _t17;
        float param_1 = ColorSigma.x;
        _t13.x = step(_t17, ColorRadius.x) * _f5(param, param_1);
        float param_2 = _t17;
        float param_3 = ColorSigma.y;
        _t13.y = step(_t17, ColorRadius.y) * _f5(param_2, param_3);
        float param_4 = _t17;
        float param_5 = ColorSigma.z;
        _t13.z = step(_t17, ColorRadius.z) * _f5(param_4, param_5);
        float param_6 = _t17;
        float param_7 = ColorSigma.w;
        _t13.w = step(_t17, ColorRadius.w) * _f5(param_6, param_7);
        float param_8 = _t17;
        float param_9 = _285;
        _p0 += (_f4(param_8, param_9, edgeMode, u_ScreenParams, uv0, dither, inputTexture, inputTextureSmplr) * _t13);
        _t12 += (_t13 * 2.0);
        _t17 += _285;
    }
    _p0 /= _t12;
    return _p0;
}

static inline __attribute__((always_inline))
float4 _f1(thread const float2& _p0)
{
    return float4(floor(_p0.x * 255.0) / 255.0, fract(_p0.x * 255.0), floor(_p0.y * 255.0) / 255.0, fract(_p0.y * 255.0));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> inputTexture [[texture(0)]], sampler inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _t19 = float4(0.0);
    float4 param = inputTexture.sample(inputTextureSmplr, in.uv0);
    float2 _411 = _f0(param);
    _t19.z = _411.x;
    _t19.w = _411.y;
    float4 param_1 = _t19;
    float4 _420 = _f6(param_1, buffer.edgeMode, buffer.u_ScreenParams, in.uv0, buffer.dither, inputTexture, inputTextureSmplr, buffer.ColorRadius, buffer.MaxRadius, buffer.ColorSigma);
    float2 param_2 = _420.zw;
    out.o_fragColor = _f1(param_2);
    return out;
}

