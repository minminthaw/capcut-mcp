#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int u_inverseGammaCorrection;
    float u_gamma;
    float u_intensity;
    int u_blurType;
    float2 u_center;
    float u_quality;
    float u_sampleScale;
    float u_sampleBias;
    float u_weightDecay;
    float u_normalizationSample;
    float4 u_ScreenParams;
    float u_dither;
    int u_borderType;
    int u_blurAlpha;
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
float4 _f1(texture2d<float> _p0, sampler _p0Smplr, thread const float2& _p1, constant int& u_inverseGammaCorrection, constant float& u_gamma)
{
    float4 _t0 = _p0.sample(_p0Smplr, _p1);
    if (u_inverseGammaCorrection == 1)
    {
        float4 _75 = _t0;
        float3 _81 = pow(_75.xyz, float3(u_gamma));
        _t0.x = _81.x;
        _t0.y = _81.y;
        _t0.z = _81.z;
    }
    return _t0;
}

static inline __attribute__((always_inline))
float _f2(thread const float& _p0, thread float& _p1, thread const float& _p2, thread const float& _p3)
{
    _p1 = sign(_p1) * ((0.89999997615814208984375 * abs(_p1)) + 0.100000001490116119384765625);
    return ((_p2 * _p0) * _p1) + _p3;
}

static inline __attribute__((always_inline))
float _f3(thread const float& _p0, thread const float& _p1, thread const float& _p2)
{
    return pow(pow(_p0, _p1), 1.0 / _p2);
}

static inline __attribute__((always_inline))
float _f4(thread const float2& _p0)
{
    float2 _126 = fract(_p0 * 13.5170001983642578125);
    float2 _t1 = _126 + float2(dot(_126, _126.yx + float2(22.5410003662109375)));
    return fract((_t1.x + _t1.y) * _t1.y);
}

static inline __attribute__((always_inline))
float2 _f5(thread float2& _p0, thread const float2& _p1, thread const float& _p2, thread const float& _p3)
{
    float _150 = sin(_p2);
    float _153 = cos(_p2);
    _p0 -= _p1;
    _p0.y /= _p3;
    _p0 = float2x2(float2(_153, _150), float2(-_150, _153)) * _p0;
    _p0.y *= _p3;
    _p0 += _p1;
    return _p0;
}

static inline __attribute__((always_inline))
float _f0(thread float& _p0)
{
    _p0 = abs(_p0);
    return abs((floor(ceil(_p0) / 2.0) * 2.0) - _p0);
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float _t4 = buffer.u_intensity;
    bool _191 = buffer.u_blurType == 4;
    if (_191)
    {
        _t4 *= 0.5;
    }
    float2 param = in.uv0;
    float4 _203 = _f1(u_inputTexture, u_inputTextureSmplr, param, buffer.u_inverseGammaCorrection, buffer.u_gamma);
    float4 _t5 = _203;
    float _t6 = 1.0;
    float _t7 = 1.0;
    float4 _t8 = _203 * 1.0;
    float param_1 = buffer.u_quality;
    float param_2 = length((in.uv0 - buffer.u_center) * _t4);
    float param_3 = buffer.u_sampleScale;
    float param_4 = buffer.u_sampleBias;
    float _234 = _f2(param_1, param_2, param_3, param_4);
    float _237 = fast::min(_234, 128.0);
    float _245 = (6.28318500518798828125 * _t4) / _237;
    float param_5 = buffer.u_weightDecay;
    float param_6 = buffer.u_normalizationSample;
    float param_7 = _237;
    float _255 = _f3(param_5, param_6, param_7);
    float _263 = buffer.u_ScreenParams.x / buffer.u_ScreenParams.y;
    float _t16 = 0.0;
    if (buffer.u_dither > 9.9999997473787516355514526367188e-06)
    {
        float2 param_8 = float2(in.uv0);
        _t16 = (buffer.u_dither * ((_f4(param_8) * 2.0) - 1.0)) * _245;
    }
    for (int _t17 = 1; _t17 <= 128; _t17++)
    {
        float _295 = float(_t17);
        if (_295 > _237)
        {
            break;
        }
        _t6 *= _255;
        float2 param_9 = in.uv0;
        float2 param_10 = buffer.u_center;
        float param_11 = (_295 * _245) + _t16;
        float param_12 = _263;
        float2 _318 = _f5(param_9, param_10, param_11, param_12);
        float2 _t19 = _318;
        bool _321 = _t19.x < 0.0;
        bool _328;
        if (!_321)
        {
            _328 = _t19.y < 0.0;
        }
        else
        {
            _328 = _321;
        }
        bool _335;
        if (!_328)
        {
            _335 = _t19.x > 1.0;
        }
        else
        {
            _335 = _328;
        }
        bool _342;
        if (!_335)
        {
            _342 = _t19.y > 1.0;
        }
        else
        {
            _342 = _335;
        }
        if (_342)
        {
            if (buffer.u_borderType == 0)
            {
                _t7 += _t6;
            }
            else
            {
                float param_13 = _t19.x;
                float _358 = _f0(param_13);
                _t19.x = _358;
                float param_14 = _t19.y;
                float _363 = _f0(param_14);
                _t19.y = _363;
                float2 param_15 = _t19;
                _t8 += (_f1(u_inputTexture, u_inputTextureSmplr, param_15, buffer.u_inverseGammaCorrection, buffer.u_gamma) * _t6);
                _t7 += _t6;
            }
        }
        else
        {
            float2 param_16 = _t19;
            _t8 += (_f1(u_inputTexture, u_inputTextureSmplr, param_16, buffer.u_inverseGammaCorrection, buffer.u_gamma) * _t6);
            _t7 += _t6;
        }
        if (_191)
        {
            float2 param_17 = in.uv0;
            float2 param_18 = buffer.u_center;
            float param_19 = ((-_295) * _245) + _t16;
            float param_20 = _263;
            float2 _403 = _f5(param_17, param_18, param_19, param_20);
            _t19 = _403;
            bool _406 = _t19.x < 0.0;
            bool _413;
            if (!_406)
            {
                _413 = _t19.y < 0.0;
            }
            else
            {
                _413 = _406;
            }
            bool _420;
            if (!_413)
            {
                _420 = _t19.x > 1.0;
            }
            else
            {
                _420 = _413;
            }
            bool _427;
            if (!_420)
            {
                _427 = _t19.y > 1.0;
            }
            else
            {
                _427 = _420;
            }
            if (_427)
            {
                if (buffer.u_borderType == 0)
                {
                    _t7 += _t6;
                }
                else
                {
                    float param_21 = _t19.x;
                    float _441 = _f0(param_21);
                    _t19.x = _441;
                    float param_22 = _t19.y;
                    float _446 = _f0(param_22);
                    _t19.y = _446;
                    float2 param_23 = _t19;
                    _t8 += (_f1(u_inputTexture, u_inputTextureSmplr, param_23, buffer.u_inverseGammaCorrection, buffer.u_gamma) * _t6);
                    _t7 += _t6;
                }
            }
            else
            {
                float2 param_24 = _t19;
                _t8 += (_f1(u_inputTexture, u_inputTextureSmplr, param_24, buffer.u_inverseGammaCorrection, buffer.u_gamma) * _t6);
                _t7 += _t6;
            }
        }
    }
    _t8 /= float4(_t7);
    if (buffer.u_inverseGammaCorrection == 1)
    {
        float4 _479 = _t8;
        float3 _484 = pow(_479.xyz, float3(1.0 / buffer.u_gamma));
        _t8.x = _484.x;
        _t8.y = _484.y;
        _t8.z = _484.z;
    }
    if (buffer.u_blurAlpha == 0)
    {
        _t8.w = _t5.w;
    }
    out.o_fragColor = _t8;
    return out;
}

