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
float _f4(thread const float& _p0, thread const float& _p1)
{
    return exp((-(_p0 * _p0)) / _p1);
}

static inline __attribute__((always_inline))
float _f2(thread const float& _p0, thread const float& _p1)
{
    float2 _106 = fract(float2(_p0, _p1) * 13.5170001983642578125);
    float2 _t5 = _106 + float2(dot(_106, _106.yx + float2(22.5410003662109375)));
    return fract((_t5.x + _t5.y) * _t5.y) - 0.5;
}

static inline __attribute__((always_inline))
float2 _f1(thread const float& _p0, thread const float& _p1, constant int& edgeMode)
{
    float2 _t4 = float2(1.0);
    if (edgeMode == 0)
    {
        _t4.x = step(0.0, _p0) * step(_p0, 1.0);
        _t4.y = step(0.0, _p1) * step(_p1, 1.0);
    }
    return _t4;
}

static inline __attribute__((always_inline))
float4 _f3(thread const float& _p0, thread const float& _p1, constant int& edgeMode, constant float4& u_ScreenParams, thread float2& uv0, constant float& dither, texture2d<float> inputTexture, sampler inputTextureSmplr)
{
    float2 _136 = float2(1.0) / u_ScreenParams.xy;
    float param = (_p0 + uv0.x) + 0.19900000095367431640625;
    float param_1 = _p0 * uv0.y;
    float2 _166 = uv0 + (_136 * float2(_p0 + ((dither * _p1) * _f2(param, param_1)), 0.0));
    float2 _t7 = _166;
    float param_2 = (_p0 + uv0.x) + 0.676999986171722412109375;
    float param_3 = _p0 * uv0.y;
    float2 _191 = uv0 - (_136 * float2(_p0 + ((dither * _p1) * _f2(param_2, param_3)), 0.0));
    float2 _t8 = _191;
    float param_4 = _t7.x;
    float param_5 = _t8.x;
    float2 _t9 = _f1(param_4, param_5, edgeMode);
    return (inputTexture.sample(inputTextureSmplr, _166) * _t9.x) + (inputTexture.sample(inputTextureSmplr, _191) * _t9.y);
}

static inline __attribute__((always_inline))
float4 _f5(thread float4& _p0, constant int& edgeMode, constant float4& u_ScreenParams, thread float2& uv0, constant float& dither, texture2d<float> inputTexture, sampler inputTextureSmplr, constant float4& ColorRadius, constant float& MaxRadius, constant float4& ColorSigma)
{
    float4 _t10 = float4(1.0);
    float4 _t11 = float4(0.0);
    float _251 = fast::max(1.0, fast::max(fast::max(ColorRadius.x, ColorRadius.y), ColorRadius.z) / MaxRadius);
    float _t15 = 1.0;
    for (float _t16 = 1.0; _t16 <= 128.0; _t16 += 1.0)
    {
        if (_t15 > 128.0)
        {
            break;
        }
        bool _270 = _t15 <= ColorRadius.x;
        bool _278;
        if (!_270)
        {
            _278 = _t15 <= ColorRadius.y;
        }
        else
        {
            _278 = _270;
        }
        bool _286;
        if (!_278)
        {
            _286 = _t15 <= ColorRadius.z;
        }
        else
        {
            _286 = _278;
        }
        if ((_t15 > (MaxRadius * _251)) || (!_286))
        {
            break;
        }
        float param = _t15;
        float param_1 = ColorSigma.x;
        _t11.x = step(_t15, ColorRadius.x) * _f4(param, param_1);
        float param_2 = _t15;
        float param_3 = ColorSigma.y;
        _t11.y = step(_t15, ColorRadius.y) * _f4(param_2, param_3);
        float param_4 = _t15;
        float param_5 = ColorSigma.z;
        _t11.z = step(_t15, ColorRadius.z) * _f4(param_4, param_5);
        float param_6 = _t15;
        float param_7 = ColorSigma.w;
        _t11.w = step(_t15, ColorRadius.w) * _f4(param_6, param_7);
        float param_8 = _t15;
        float param_9 = _251;
        _p0 += (_f3(param_8, param_9, edgeMode, u_ScreenParams, uv0, dither, inputTexture, inputTextureSmplr) * _t11);
        _t10 += (_t11 * 2.0);
        _t15 += _251;
    }
    _p0 /= _t10;
    return _p0;
}

static inline __attribute__((always_inline))
float4 _f0(thread const float2& _p0)
{
    return float4(floor(_p0.x * 255.0) / 255.0, fract(_p0.x * 255.0), floor(_p0.y * 255.0) / 255.0, fract(_p0.y * 255.0));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> inputTexture [[texture(0)]], sampler inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 param = inputTexture.sample(inputTextureSmplr, in.uv0);
    float4 _381 = _f5(param, buffer.edgeMode, buffer.u_ScreenParams, in.uv0, buffer.dither, inputTexture, inputTextureSmplr, buffer.ColorRadius, buffer.MaxRadius, buffer.ColorSigma);
    float2 param_1 = _381.zw;
    out.o_fragColor = _f0(param_1);
    return out;
}

