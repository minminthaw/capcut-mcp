#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int u_lightSource;
    int u_inverseGammaCorrection;
    float u_gamma;
    float4 u_ScreenParams;
    float u_minAngle;
    float u_maxAngle;
    float2 u_center;
    float u_intensity;
    float u_quality;
    float u_sampleScale;
    float u_sampleBias;
    float u_weightDecay;
    float u_normalizationSample;
    int u_useAngle;
    int u_displayRayOnly;
    float u_dither;
    float u_noiseIntensity;
    float u_colorDecay;
    int u_borderType;
    float u_brightness;
    float3 u_lightColor;
    float u_grayscaleCorrection;
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
float4 _f2(thread const float2& _p0, constant int& u_lightSource, texture2d<float> u_godRayTexture2, sampler u_godRayTexture2Smplr, texture2d<float> u_godRayTexture1, sampler u_godRayTexture1Smplr, constant int& u_inverseGammaCorrection, constant float& u_gamma)
{
    float4 _t0 = float4(0.0);
    if (u_lightSource == 1)
    {
        _t0 = u_godRayTexture2.sample(u_godRayTexture2Smplr, _p0);
    }
    else
    {
        _t0 = u_godRayTexture1.sample(u_godRayTexture1Smplr, _p0);
    }
    if (u_inverseGammaCorrection == 1)
    {
        float4 _109 = _t0;
        float3 _115 = pow(_109.xyz, float3(u_gamma));
        _t0.x = _115.x;
        _t0.y = _115.y;
        _t0.z = _115.z;
    }
    return _t0;
}

static inline __attribute__((always_inline))
float _f3(thread const float& _p0, thread float& _p1, thread const float& _p2, thread const float& _p3)
{
    _p1 = sign(_p1) * ((0.89999997615814208984375 * abs(_p1)) + 0.100000001490116119384765625);
    return ((_p2 * _p0) * _p1) + _p3;
}

static inline __attribute__((always_inline))
float _f4(thread const float& _p0, thread const float& _p1, thread const float& _p2)
{
    return pow(pow(_p0, _p1), 1.0 / _p2);
}

static inline __attribute__((always_inline))
float _f6(thread float2& _p0, constant float4& u_ScreenParams, constant float& u_minAngle, constant float& u_maxAngle)
{
    _p0.y *= (u_ScreenParams.y / u_ScreenParams.x);
    float _183 = precise::atan2(_p0.y, _p0.x);
    float _t1 = _183;
    if (_183 < u_minAngle)
    {
        _t1 += 6.283185482025146484375;
    }
    else
    {
        if (_t1 > u_maxAngle)
        {
            _t1 -= 6.283185482025146484375;
        }
    }
    return _t1;
}

static inline __attribute__((always_inline))
float _f7(thread const float& _p0, constant float& u_minAngle, constant float& u_maxAngle)
{
    float _t2 = 0.1745329201221466064453125;
    float _212 = u_maxAngle - u_minAngle;
    float _t4 = _212;
    float _216;
    if (_212 < 3.1415927410125732421875)
    {
        _216 = _t4;
    }
    else
    {
        _216 = 6.283185482025146484375 - _t4;
    }
    _t4 = _216;
    float _237 = _t2;
    float _239 = fast::min(_237, _216 * 0.5);
    _t2 = _239;
    float _243 = fast::clamp(_216 * 0.20000000298023223876953125, _239, 0.785398185253143310546875);
    float _t10 = 1.0;
    if ((_p0 <= u_minAngle) || (_p0 >= u_maxAngle))
    {
        _t10 = 0.0;
    }
    else
    {
        if ((_p0 > u_minAngle) && (_p0 < (u_minAngle + _243)))
        {
            _t10 = (_p0 - u_minAngle) / fast::max(_243, 0.001000000047497451305389404296875);
        }
        else
        {
            if ((_p0 > (u_maxAngle - _243)) && (_p0 < u_maxAngle))
            {
                _t10 = (u_maxAngle - _p0) / fast::max(_243, 0.001000000047497451305389404296875);
            }
        }
    }
    float _295 = _t10;
    float _296 = smoothstep(0.0, 1.0, _295);
    _t10 = _296;
    return _296;
}

static inline __attribute__((always_inline))
float _f0(thread const float& _p0, thread const float& _p1, thread const float& _p2, thread const float& _p3, thread const float& _p4)
{
    return _p3 + (((_p0 - _p1) * (_p4 - _p3)) / (_p2 - _p1));
}

static inline __attribute__((always_inline))
float _f5(thread const float2& _p0)
{
    return fract(sin(dot(_p0, float2(41.0, 289.0))) * 45758.546875);
}

static inline __attribute__((always_inline))
float _f8(thread float& _p0)
{
    _p0 = abs(_p0);
    return abs((floor(ceil(_p0) / 2.0) * 2.0) - _p0);
}

static inline __attribute__((always_inline))
float _f1(thread const float3& _p0)
{
    return dot(_p0, float3(0.2125999927520751953125, 0.715200006961822509765625, 0.072200000286102294921875));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_godRayTexture2 [[texture(0)]], texture2d<float> u_godRayTexture1 [[texture(1)]], sampler u_godRayTexture2Smplr [[sampler(0)]], sampler u_godRayTexture1Smplr [[sampler(1)]])
{
    main0_out out = {};
    float2 param = in.uv0;
    float _t12 = 1.0;
    float _t13 = 1.0;
    float4 _t14 = _f2(param, buffer.u_lightSource, u_godRayTexture2, u_godRayTexture2Smplr, u_godRayTexture1, u_godRayTexture1Smplr, buffer.u_inverseGammaCorrection, buffer.u_gamma) * 1.0;
    float2 _t15 = in.uv0;
    float2 _336 = (in.uv0 - buffer.u_center) * buffer.u_intensity;
    float _339 = length(_336);
    float param_1 = buffer.u_quality;
    float param_2 = _339;
    float param_3 = buffer.u_sampleScale;
    float param_4 = buffer.u_sampleBias;
    float _352 = _f3(param_1, param_2, param_3, param_4);
    float _355 = fast::min(_352, 1024.0);
    float2 _360 = _336 / float2(_355);
    float param_5 = buffer.u_weightDecay;
    float param_6 = buffer.u_normalizationSample;
    float param_7 = _355;
    float _370 = _f4(param_5, param_6, param_7);
    float _t21 = 1.0;
    bool _374 = buffer.u_useAngle == 1;
    if (_374 && (_339 > 0.001000000047497451305389404296875))
    {
        float2 param_8 = _336;
        float _383 = _f6(param_8, buffer.u_ScreenParams, buffer.u_minAngle, buffer.u_maxAngle);
        float param_9 = _383;
        _t21 = _f7(param_9, buffer.u_minAngle, buffer.u_maxAngle);
        if ((_383 < buffer.u_minAngle) || (_383 > buffer.u_maxAngle))
        {
            float4 _t23 = float4(0.0);
            if (buffer.u_displayRayOnly == 1)
            {
                _t23 = float4(0.0);
            }
            out.o_fragColor = _t23;
            return out;
        }
    }
    float _t24 = smoothstep(0.0, 0.100000001490116119384765625, _339);
    float _412 = buffer.u_maxAngle - buffer.u_minAngle;
    if (_412 > 1.57079637050628662109375)
    {
        float param_10 = _412;
        float param_11 = 1.57079637050628662109375;
        float param_12 = 3.1415927410125732421875;
        float param_13 = _t24;
        float param_14 = 1.0;
        _t24 = _f0(param_10, param_11, param_12, param_13, param_14);
    }
    float _426 = _t24;
    float _427 = fast::clamp(_426, 0.0, 1.0);
    _t24 = _427;
    float _t27 = 0.0;
    bool _435 = buffer.u_dither > 0.001000000047497451305389404296875;
    bool _438 = buffer.u_noiseIntensity > 0.001000000047497451305389404296875;
    if (_435 || _438)
    {
        float2 param_15 = in.uv0;
        _t27 = _f5(param_15);
    }
    if (_435)
    {
        _t15 += ((_336 * (buffer.u_dither * ((_t27 * 2.0) - 1.0))) / float2(buffer.u_normalizationSample));
    }
    float _467 = 1.0 / fast::max(buffer.u_colorDecay, 0.001000000047497451305389404296875);
    for (int _t30 = 1; _t30 <= 1024; _t30++)
    {
        float _480 = float(_t30);
        if (_480 > _355)
        {
            break;
        }
        _t12 *= _370;
        float2 _495 = _t15 - (_360 * _480);
        float2 _t32 = _495;
        float _506 = smoothstep(0.0, 2.0 * _467, 1.0 / fast::max(distance(_495, buffer.u_center), 0.001000000047497451305389404296875));
        bool _509 = _t32.x < 0.0;
        bool _516;
        if (!_509)
        {
            _516 = _t32.y < 0.0;
        }
        else
        {
            _516 = _509;
        }
        bool _523;
        if (!_516)
        {
            _523 = _t32.x > 1.0;
        }
        else
        {
            _523 = _516;
        }
        bool _530;
        if (!_523)
        {
            _530 = _t32.y > 1.0;
        }
        else
        {
            _530 = _523;
        }
        if (_530)
        {
            if (buffer.u_borderType == 0)
            {
                float param_16 = _t32.x;
                float _542 = _f8(param_16);
                _t32.x = _542;
                float param_17 = _t32.y;
                float _547 = _f8(param_17);
                _t32.y = _547;
                float2 param_18 = _t32;
                _t14 += (_f2(param_18, buffer.u_lightSource, u_godRayTexture2, u_godRayTexture2Smplr, u_godRayTexture1, u_godRayTexture1Smplr, buffer.u_inverseGammaCorrection, buffer.u_gamma) * (_t12 * _506));
                _t13 += _t12;
            }
            else
            {
                _t13 += _t12;
            }
        }
        else
        {
            float2 param_19 = _t32;
            _t14 += (_f2(param_19, buffer.u_lightSource, u_godRayTexture2, u_godRayTexture2Smplr, u_godRayTexture1, u_godRayTexture1Smplr, buffer.u_inverseGammaCorrection, buffer.u_gamma) * (_t12 * _506));
            _t13 += _t12;
        }
    }
    _t14 /= float4(_t13);
    if (_438)
    {
        float3 param_20 = _t14.xyz;
        float4 _613 = _t14;
        float3 _621 = float3(1.0) - ((float3(1.0) - _613.xyz) * (1.0 - (((smoothstep(0.0, 5.0 * _467, 1.0 / fast::max(distance(in.uv0, buffer.u_center), 0.001000000047497451305389404296875)) * buffer.u_noiseIntensity) * _t21) * _t27)));
        _t14.x = _621.x;
        _t14.y = _621.y;
        _t14.z = _621.z;
    }
    float4 _643 = _t14;
    float4 _644 = _643 * (((11.6700000762939453125 * buffer.u_brightness) - (19.0 * pow(buffer.u_brightness, 2.0))) + (23.0 * pow(buffer.u_brightness, 3.0)));
    _t14 = _644;
    float _647 = _t14.w;
    float3 _650 = _644.xyz * _647;
    _t14.x = _650.x;
    _t14.y = _650.y;
    _t14.z = _650.z;
    float4 _660 = _t14;
    float3 _662 = _660.xyz * buffer.u_lightColor;
    _t14.x = _662.x;
    _t14.y = _662.y;
    _t14.z = _662.z;
    _t14 = fast::clamp(_t14, float4(0.0), float4(1.0));
    if (buffer.u_inverseGammaCorrection == 1)
    {
        float4 _677 = _t14;
        float3 _682 = pow(_677.xyz, float3(1.0 / buffer.u_gamma));
        _t14.x = _682.x;
        _t14.y = _682.y;
        _t14.z = _682.z;
    }
    float4 _689 = _t14;
    float3 _694 = pow(_689.xyz, float3(buffer.u_grayscaleCorrection));
    _t14.x = _694.x;
    _t14.y = _694.y;
    _t14.z = _694.z;
    if (buffer.u_weightDecay < 0.800000011920928955078125)
    {
        _t14 = mix(float4(0.0), _t14, float4(1.25 * buffer.u_weightDecay));
    }
    float4 _t39 = _t14;
    if (_374)
    {
        _t39 *= (_t21 * _427);
    }
    out.o_fragColor = fast::clamp(_t39, float4(0.0), float4(1.0));
    return out;
}

