precision highp float;
precision highp int;

uniform mediump sampler2D combineLut;
uniform mediump float intensityBrightness;
uniform mediump float intensityContrast;
uniform mediump float intensityShadow;
uniform mediump float intensityHighlight;
uniform mediump float intensityTemperature;
uniform mediump float intensityTone;
uniform mediump float intensitySaturation;
uniform mediump float intensityLightSensation;
uniform mediump float intensityFade;
uniform mediump float intensityExposure;
uniform mediump float intensityVibrance;

varying vec2 v_uv;

vec4 _f0(vec4 _p0, float _p1, float _p2)
{
    vec4 _t1 = _p0;
    vec4 _t2 = _p0;
    float _29 = _t1.z * 16.0;
    vec2 _t4 = vec2(289.0, 17.0);
    vec2 _t6 = vec2(0.0);
    float _45 = floor(_29);
    _t6.y = floor(_45 * 0.0588235296308994293212890625);
    _t6.x = _45 - (_t6.y * 1.0);
    float _61 = ceil(_29);
    vec2 _t7;
    _t7.y = floor(_61 * 0.0588235296308994293212890625);
    _t7.x = _61 - (_t7.y * 1.0);
    vec2 _t8;
    _t8.x = (((_t6.x * 1.0) * 0.0588235296308994293212890625) + (0.5 / _t4.x)) + ((0.0588235296308994293212890625 - (1.0 / _t4.x)) * _t2.x);
    _t8.y = (((_t6.y * 1.0) / 1.0) + (0.5 / _t4.y)) + ((1.0 - (1.0 / _t4.y)) * _t2.y);
    _t8.y = (_t8.y * 0.04545454680919647216796875) + ((0.04545454680919647216796875 * (_p2 - 1.0)) * 2.0);
    vec2 _t9;
    _t9.x = (((_t7.x * 1.0) * 0.0588235296308994293212890625) + (0.5 / _t4.x)) + ((0.0588235296308994293212890625 - (1.0 / _t4.x)) * _t2.x);
    _t9.y = (((_t7.y * 1.0) / 1.0) + (0.5 / _t4.y)) + ((1.0 - (1.0 / _t4.y)) * _t2.y);
    _t9.y = (_t9.y * 0.04545454680919647216796875) + ((0.04545454680919647216796875 * (_p2 - 1.0)) * 2.0);
    if (_p1 > 0.0)
    {
        _t8.y += 0.04545454680919647216796875;
        _t9.y += 0.04545454680919647216796875;
    }
    return mix(_p0, mix(texture2D(combineLut, _t8), texture2D(combineLut, _t9), vec4(fract(_29))), vec4(abs(_p1)));
}

void main()
{
    vec4 _t14;
    _t14.x = (1.0625 * v_uv.y) - 0.03125;
    float _220 = floor(v_uv.x * 17.0);
    _t14.y = _220 / 16.0;
    _t14.z = (v_uv.x - (_220 * 0.0588235296308994293212890625)) * 17.0;
    _t14.z = (1.0625 * _t14.z) - 0.03125;
    _t14.w = 1.0;
    if (abs(intensityBrightness) > 0.00999999977648258209228515625)
    {
        vec4 param = _t14;
        float param_1 = intensityBrightness;
        float param_2 = 1.0;
        _t14 = _f0(param, param_1, param_2);
    }
    if (abs(intensityContrast) > 0.00999999977648258209228515625)
    {
        vec4 param_3 = _t14;
        float param_4 = intensityContrast;
        float param_5 = 2.0;
        _t14 = _f0(param_3, param_4, param_5);
    }
    if (abs(intensityShadow) > 0.00999999977648258209228515625)
    {
        vec4 param_6 = _t14;
        float param_7 = intensityShadow;
        float param_8 = 8.0;
        _t14 = _f0(param_6, param_7, param_8);
    }
    if (abs(intensityHighlight) > 0.00999999977648258209228515625)
    {
        vec4 param_9 = _t14;
        float param_10 = intensityHighlight;
        float param_11 = 5.0;
        _t14 = _f0(param_9, param_10, param_11);
    }
    if (abs(intensityTemperature) > 0.00999999977648258209228515625)
    {
        vec4 param_12 = _t14;
        float param_13 = intensityTemperature;
        float param_14 = 9.0;
        _t14 = _f0(param_12, param_13, param_14);
    }
    if (abs(intensityTone) > 0.00999999977648258209228515625)
    {
        vec4 param_15 = _t14;
        float param_16 = intensityTone;
        float param_17 = 10.0;
        _t14 = _f0(param_15, param_16, param_17);
    }
    if (abs(intensitySaturation) > 0.00999999977648258209228515625)
    {
        vec4 param_18 = _t14;
        float param_19 = intensitySaturation;
        float param_20 = 7.0;
        _t14 = _f0(param_18, param_19, param_20);
    }
    if (abs(intensityLightSensation) > 0.00999999977648258209228515625)
    {
        vec4 param_21 = _t14;
        float param_22 = intensityLightSensation;
        float param_23 = 6.0;
        _t14 = _f0(param_21, param_22, param_23);
    }
    if (intensityFade > 0.00999999977648258209228515625)
    {
        vec4 param_24 = _t14;
        float param_25 = intensityFade;
        float param_26 = 4.0;
        _t14 = _f0(param_24, param_25, param_26);
    }
    if (abs(intensityExposure) > 0.00999999977648258209228515625)
    {
        vec4 param_27 = _t14;
        float param_28 = intensityExposure;
        float param_29 = 3.0;
        _t14 = _f0(param_27, param_28, param_29);
    }
    if (abs(intensityVibrance) > 0.00999999977648258209228515625)
    {
        vec4 param_30 = _t14;
        float param_31 = intensityVibrance;
        float param_32 = 11.0;
        _t14 = _f0(param_30, param_31, param_32);
    }
    gl_FragData[0] = _t14;
}

