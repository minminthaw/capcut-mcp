#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float intensityBrightness;
    float intensityContrast;
    float intensityShadow;
    float intensityHighlight;
    float intensityTemperature;
    float intensityTone;
    float intensitySaturation;
    float intensityLightSensation;
    float intensityFade;
    float intensityExposure;
    float intensityVibrance;
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
float4 _f0(thread const float4& _p0, thread const float& _p1, thread const float& _p2, texture2d<float> combineLut, sampler combineLutSmplr)
{
    float4 _t1 = _p0;
    float4 _t2 = _p0;
    float _29 = _t1.z * 16.0;
    float2 _t4 = float2(289.0, 17.0);
    float2 _t6 = float2(0.0);
    float _45 = floor(_29);
    _t6.y = floor(_45 * 0.0588235296308994293212890625);
    _t6.x = _45 - (_t6.y * 1.0);
    float _61 = ceil(_29);
    float2 _t7;
    _t7.y = floor(_61 * 0.0588235296308994293212890625);
    _t7.x = _61 - (_t7.y * 1.0);
    float2 _t8;
    _t8.x = (((_t6.x * 1.0) * 0.0588235296308994293212890625) + (0.5 / _t4.x)) + ((0.0588235296308994293212890625 - (1.0 / _t4.x)) * _t2.x);
    _t8.y = (((_t6.y * 1.0) / 1.0) + (0.5 / _t4.y)) + ((1.0 - (1.0 / _t4.y)) * _t2.y);
    _t8.y = (_t8.y * 0.04545454680919647216796875) + ((0.04545454680919647216796875 * (_p2 - 1.0)) * 2.0);
    float2 _t9;
    _t9.x = (((_t7.x * 1.0) * 0.0588235296308994293212890625) + (0.5 / _t4.x)) + ((0.0588235296308994293212890625 - (1.0 / _t4.x)) * _t2.x);
    _t9.y = (((_t7.y * 1.0) / 1.0) + (0.5 / _t4.y)) + ((1.0 - (1.0 / _t4.y)) * _t2.y);
    _t9.y = (_t9.y * 0.04545454680919647216796875) + ((0.04545454680919647216796875 * (_p2 - 1.0)) * 2.0);
    if (_p1 > 0.0)
    {
        _t8.y += 0.04545454680919647216796875;
        _t9.y += 0.04545454680919647216796875;
    }
    return mix(_p0, mix(combineLut.sample(combineLutSmplr, _t8), combineLut.sample(combineLutSmplr, _t9), float4(fract(_29))), float4(abs(_p1)));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> combineLut [[texture(0)]], sampler combineLutSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _t14;
    _t14.x = (1.0625 * in.v_uv.y) - 0.03125;
    float _220 = floor(in.v_uv.x * 17.0);
    _t14.y = _220 / 16.0;
    _t14.z = (in.v_uv.x - (_220 * 0.0588235296308994293212890625)) * 17.0;
    _t14.z = (1.0625 * _t14.z) - 0.03125;
    _t14.w = 1.0;
    if (abs(buffer.intensityBrightness) > 0.00999999977648258209228515625)
    {
        float4 param = _t14;
        float param_1 = buffer.intensityBrightness;
        float param_2 = 1.0;
        _t14 = _f0(param, param_1, param_2, combineLut, combineLutSmplr);
    }
    if (abs(buffer.intensityContrast) > 0.00999999977648258209228515625)
    {
        float4 param_3 = _t14;
        float param_4 = buffer.intensityContrast;
        float param_5 = 2.0;
        _t14 = _f0(param_3, param_4, param_5, combineLut, combineLutSmplr);
    }
    if (abs(buffer.intensityShadow) > 0.00999999977648258209228515625)
    {
        float4 param_6 = _t14;
        float param_7 = buffer.intensityShadow;
        float param_8 = 8.0;
        _t14 = _f0(param_6, param_7, param_8, combineLut, combineLutSmplr);
    }
    if (abs(buffer.intensityHighlight) > 0.00999999977648258209228515625)
    {
        float4 param_9 = _t14;
        float param_10 = buffer.intensityHighlight;
        float param_11 = 5.0;
        _t14 = _f0(param_9, param_10, param_11, combineLut, combineLutSmplr);
    }
    if (abs(buffer.intensityTemperature) > 0.00999999977648258209228515625)
    {
        float4 param_12 = _t14;
        float param_13 = buffer.intensityTemperature;
        float param_14 = 9.0;
        _t14 = _f0(param_12, param_13, param_14, combineLut, combineLutSmplr);
    }
    if (abs(buffer.intensityTone) > 0.00999999977648258209228515625)
    {
        float4 param_15 = _t14;
        float param_16 = buffer.intensityTone;
        float param_17 = 10.0;
        _t14 = _f0(param_15, param_16, param_17, combineLut, combineLutSmplr);
    }
    if (abs(buffer.intensitySaturation) > 0.00999999977648258209228515625)
    {
        float4 param_18 = _t14;
        float param_19 = buffer.intensitySaturation;
        float param_20 = 7.0;
        _t14 = _f0(param_18, param_19, param_20, combineLut, combineLutSmplr);
    }
    if (abs(buffer.intensityLightSensation) > 0.00999999977648258209228515625)
    {
        float4 param_21 = _t14;
        float param_22 = buffer.intensityLightSensation;
        float param_23 = 6.0;
        _t14 = _f0(param_21, param_22, param_23, combineLut, combineLutSmplr);
    }
    if (buffer.intensityFade > 0.00999999977648258209228515625)
    {
        float4 param_24 = _t14;
        float param_25 = buffer.intensityFade;
        float param_26 = 4.0;
        _t14 = _f0(param_24, param_25, param_26, combineLut, combineLutSmplr);
    }
    if (abs(buffer.intensityExposure) > 0.00999999977648258209228515625)
    {
        float4 param_27 = _t14;
        float param_28 = buffer.intensityExposure;
        float param_29 = 3.0;
        _t14 = _f0(param_27, param_28, param_29, combineLut, combineLutSmplr);
    }
    if (abs(buffer.intensityVibrance) > 0.00999999977648258209228515625)
    {
        float4 param_30 = _t14;
        float param_31 = buffer.intensityVibrance;
        float param_32 = 11.0;
        _t14 = _f0(param_30, param_31, param_32, combineLut, combineLutSmplr);
    }
    out.o_fragColor = _t14;
    return out;
}

