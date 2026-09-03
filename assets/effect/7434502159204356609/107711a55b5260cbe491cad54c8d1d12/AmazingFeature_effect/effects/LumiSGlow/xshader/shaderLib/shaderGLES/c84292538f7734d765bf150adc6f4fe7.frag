precision highp float;
precision highp int;

uniform mediump int edgeMode;
uniform vec4 u_ScreenParams;
uniform float dither;
uniform mediump sampler2D inputTexture;
uniform vec4 ColorRadius;
uniform float MaxRadius;
uniform vec4 ColorSigma;

varying vec2 uv0;

vec2 _f0(vec4 _p0)
{
    return vec2(_p0.x + (_p0.y / 255.0), _p0.z + (_p0.w / 255.0));
}

float _f5(float _p0, float _p1)
{
    return exp((-(_p0 * _p0)) / _p1);
}

float _f3(float _p0, float _p1)
{
    vec2 _131 = fract(vec2(_p0, _p1) * 13.5170001983642578125);
    vec2 _t7 = _131 + vec2(dot(_131, _131.yx + vec2(22.5410003662109375)));
    return fract((_t7.x + _t7.y) * _t7.y) - 0.5;
}

vec2 _f2(float _p0, float _p1)
{
    vec2 _t6 = vec2(1.0);
    if (edgeMode == 0)
    {
        _t6.x = step(0.0, _p0) * step(_p0, 1.0);
        _t6.y = step(0.0, _p1) * step(_p1, 1.0);
    }
    return _t6;
}

vec4 _f4(float _p0, float _p1)
{
    vec2 _161 = vec2(1.0) / u_ScreenParams.xy;
    float param = (_p0 + uv0.x) + 0.22300000488758087158203125;
    float param_1 = _p0 * uv0.y;
    vec2 _191 = uv0 + (_161 * vec2(0.0, _p0 + ((dither * _p1) * _f3(param, param_1))));
    vec2 _t9 = _191;
    float param_2 = (_p0 + uv0.x) + 0.5690000057220458984375;
    float param_3 = _p0 * uv0.y;
    vec2 _216 = uv0 - (_161 * vec2(0.0, _p0 + ((dither * _p1) * _f3(param_2, param_3))));
    vec2 _t10 = _216;
    float param_4 = _t9.y;
    float param_5 = _t10.y;
    vec2 _t11 = _f2(param_4, param_5);
    vec4 param_6 = texture2D(inputTexture, _191);
    vec4 param_7 = texture2D(inputTexture, _216);
    return (vec4(0.0, 0.0, _f0(param_6)) * _t11.x) + (vec4(0.0, 0.0, _f0(param_7)) * _t11.y);
}

vec4 _f6(inout vec4 _p0)
{
    vec4 _t12 = vec4(1.0);
    vec4 _t13 = vec4(0.0);
    float _285 = max(1.0, max(max(ColorRadius.x, ColorRadius.y), ColorRadius.z) / MaxRadius);
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
        _p0 += (_f4(param_8, param_9) * _t13);
        _t12 += (_t13 * 2.0);
        _t17 += _285;
    }
    _p0 /= _t12;
    return _p0;
}

vec4 _f1(vec2 _p0)
{
    return vec4(floor(_p0.x * 255.0) / 255.0, fract(_p0.x * 255.0), floor(_p0.y * 255.0) / 255.0, fract(_p0.y * 255.0));
}

void main()
{
    vec4 _t19 = vec4(0.0);
    vec4 param = texture2D(inputTexture, uv0);
    vec2 _411 = _f0(param);
    _t19.z = _411.x;
    _t19.w = _411.y;
    vec4 param_1 = _t19;
    vec4 _420 = _f6(param_1);
    vec2 param_2 = _420.zw;
    gl_FragData[0] = _f1(param_2);
}

