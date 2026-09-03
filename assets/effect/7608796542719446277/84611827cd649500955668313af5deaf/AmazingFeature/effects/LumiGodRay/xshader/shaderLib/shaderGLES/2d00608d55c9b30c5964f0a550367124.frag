precision highp float;
precision highp int;

uniform mediump int u_lightSource;
uniform mediump sampler2D u_godRayTexture2;
uniform mediump sampler2D u_godRayTexture1;
uniform mediump int u_inverseGammaCorrection;
uniform float u_gamma;
uniform vec4 u_ScreenParams;
uniform float u_minAngle;
uniform float u_maxAngle;
uniform vec2 u_center;
uniform float u_intensity;
uniform float u_quality;
uniform float u_sampleScale;
uniform float u_sampleBias;
uniform float u_weightDecay;
uniform float u_normalizationSample;
uniform mediump int u_useAngle;
uniform mediump int u_displayRayOnly;
uniform float u_dither;
uniform float u_noiseIntensity;
uniform float u_colorDecay;
uniform mediump int u_borderType;
uniform float u_brightness;
uniform vec3 u_lightColor;
uniform float u_grayscaleCorrection;

varying vec2 uv0;

vec4 _f2(vec2 _p0)
{
    vec4 _t0 = vec4(0.0);
    if (u_lightSource == 1)
    {
        _t0 = texture2D(u_godRayTexture2, _p0);
    }
    else
    {
        _t0 = texture2D(u_godRayTexture1, _p0);
    }
    if (u_inverseGammaCorrection == 1)
    {
        vec4 _109 = _t0;
        vec3 _115 = pow(_109.xyz, vec3(u_gamma));
        _t0.x = _115.x;
        _t0.y = _115.y;
        _t0.z = _115.z;
    }
    return _t0;
}

float _f3(float _p0, inout float _p1, float _p2, float _p3)
{
    _p1 = sign(_p1) * ((0.89999997615814208984375 * abs(_p1)) + 0.100000001490116119384765625);
    return ((_p2 * _p0) * _p1) + _p3;
}

float _f4(float _p0, float _p1, float _p2)
{
    return pow(pow(_p0, _p1), 1.0 / _p2);
}

float _f6(inout vec2 _p0)
{
    _p0.y *= (u_ScreenParams.y / u_ScreenParams.x);
    float _183 = atan(_p0.y, _p0.x);
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

float _f7(float _p0)
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
    float _239 = min(_237, _216 * 0.5);
    _t2 = _239;
    float _243 = clamp(_216 * 0.20000000298023223876953125, _239, 0.785398185253143310546875);
    float _t10 = 1.0;
    if ((_p0 <= u_minAngle) || (_p0 >= u_maxAngle))
    {
        _t10 = 0.0;
    }
    else
    {
        if ((_p0 > u_minAngle) && (_p0 < (u_minAngle + _243)))
        {
            _t10 = (_p0 - u_minAngle) / max(_243, 0.001000000047497451305389404296875);
        }
        else
        {
            if ((_p0 > (u_maxAngle - _243)) && (_p0 < u_maxAngle))
            {
                _t10 = (u_maxAngle - _p0) / max(_243, 0.001000000047497451305389404296875);
            }
        }
    }
    float _295 = _t10;
    float _296 = smoothstep(0.0, 1.0, _295);
    _t10 = _296;
    return _296;
}

float _f0(float _p0, float _p1, float _p2, float _p3, float _p4)
{
    return _p3 + (((_p0 - _p1) * (_p4 - _p3)) / (_p2 - _p1));
}

float _f5(vec2 _p0)
{
    return fract(sin(dot(_p0, vec2(41.0, 289.0))) * 45758.546875);
}

float _f8(inout float _p0)
{
    _p0 = abs(_p0);
    return abs((floor(ceil(_p0) / 2.0) * 2.0) - _p0);
}

float _f1(vec3 _p0)
{
    return dot(_p0, vec3(0.2125999927520751953125, 0.715200006961822509765625, 0.072200000286102294921875));
}

void main()
{
    vec2 param = uv0;
    float _t12 = 1.0;
    float _t13 = 1.0;
    vec4 _t14 = _f2(param) * 1.0;
    vec2 _t15 = uv0;
    vec2 _336 = (uv0 - u_center) * u_intensity;
    float _339 = length(_336);
    float param_1 = u_quality;
    float param_2 = _339;
    float param_3 = u_sampleScale;
    float param_4 = u_sampleBias;
    float _352 = _f3(param_1, param_2, param_3, param_4);
    float _355 = min(_352, 1024.0);
    vec2 _360 = _336 / vec2(_355);
    float param_5 = u_weightDecay;
    float param_6 = u_normalizationSample;
    float param_7 = _355;
    float _370 = _f4(param_5, param_6, param_7);
    float _t21 = 1.0;
    bool _374 = u_useAngle == 1;
    if (_374 && (_339 > 0.001000000047497451305389404296875))
    {
        vec2 param_8 = _336;
        float _383 = _f6(param_8);
        float param_9 = _383;
        _t21 = _f7(param_9);
        if ((_383 < u_minAngle) || (_383 > u_maxAngle))
        {
            vec4 _t23 = vec4(0.0);
            if (u_displayRayOnly == 1)
            {
                _t23 = vec4(0.0);
            }
            gl_FragData[0] = _t23;
            return;
        }
    }
    float _t24 = smoothstep(0.0, 0.100000001490116119384765625, _339);
    float _412 = u_maxAngle - u_minAngle;
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
    float _427 = clamp(_426, 0.0, 1.0);
    _t24 = _427;
    float _t27 = 0.0;
    bool _435 = u_dither > 0.001000000047497451305389404296875;
    bool _438 = u_noiseIntensity > 0.001000000047497451305389404296875;
    if (_435 || _438)
    {
        vec2 param_15 = uv0;
        _t27 = _f5(param_15);
    }
    if (_435)
    {
        _t15 += ((_336 * (u_dither * ((_t27 * 2.0) - 1.0))) / vec2(u_normalizationSample));
    }
    float _467 = 1.0 / max(u_colorDecay, 0.001000000047497451305389404296875);
    for (mediump int _t30 = 1; _t30 <= 1024; _t30++)
    {
        mediump float _480 = float(_t30);
        if (_480 > _355)
        {
            break;
        }
        _t12 *= _370;
        vec2 _495 = _t15 - (_360 * _480);
        vec2 _t32 = _495;
        float _506 = smoothstep(0.0, 2.0 * _467, 1.0 / max(distance(_495, u_center), 0.001000000047497451305389404296875));
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
            if (u_borderType == 0)
            {
                float param_16 = _t32.x;
                float _542 = _f8(param_16);
                _t32.x = _542;
                float param_17 = _t32.y;
                float _547 = _f8(param_17);
                _t32.y = _547;
                vec2 param_18 = _t32;
                _t14 += (_f2(param_18) * (_t12 * _506));
                _t13 += _t12;
            }
            else
            {
                _t13 += _t12;
            }
        }
        else
        {
            vec2 param_19 = _t32;
            _t14 += (_f2(param_19) * (_t12 * _506));
            _t13 += _t12;
        }
    }
    _t14 /= vec4(_t13);
    if (_438)
    {
        vec3 param_20 = _t14.xyz;
        vec4 _613 = _t14;
        vec3 _621 = vec3(1.0) - ((vec3(1.0) - _613.xyz) * (1.0 - (((smoothstep(0.0, 5.0 * _467, 1.0 / max(distance(uv0, u_center), 0.001000000047497451305389404296875)) * u_noiseIntensity) * _t21) * _t27)));
        _t14.x = _621.x;
        _t14.y = _621.y;
        _t14.z = _621.z;
    }
    vec4 _643 = _t14;
    vec4 _644 = _643 * (((11.6700000762939453125 * u_brightness) - (19.0 * pow(u_brightness, 2.0))) + (23.0 * pow(u_brightness, 3.0)));
    _t14 = _644;
    float _647 = _t14.w;
    vec3 _650 = _644.xyz * _647;
    _t14.x = _650.x;
    _t14.y = _650.y;
    _t14.z = _650.z;
    vec4 _660 = _t14;
    vec3 _662 = _660.xyz * u_lightColor;
    _t14.x = _662.x;
    _t14.y = _662.y;
    _t14.z = _662.z;
    _t14 = clamp(_t14, vec4(0.0), vec4(1.0));
    if (u_inverseGammaCorrection == 1)
    {
        vec4 _677 = _t14;
        vec3 _682 = pow(_677.xyz, vec3(1.0 / u_gamma));
        _t14.x = _682.x;
        _t14.y = _682.y;
        _t14.z = _682.z;
    }
    vec4 _689 = _t14;
    vec3 _694 = pow(_689.xyz, vec3(u_grayscaleCorrection));
    _t14.x = _694.x;
    _t14.y = _694.y;
    _t14.z = _694.z;
    if (u_weightDecay < 0.800000011920928955078125)
    {
        _t14 = mix(vec4(0.0), _t14, vec4(1.25 * u_weightDecay));
    }
    vec4 _t39 = _t14;
    if (_374)
    {
        _t39 *= (_t21 * _427);
    }
    gl_FragData[0] = clamp(_t39, vec4(0.0), vec4(1.0));
}

