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

float _f4(float _p0, float _p1)
{
    return exp((-(_p0 * _p0)) / _p1);
}

float _f2(float _p0, float _p1)
{
    vec2 _106 = fract(vec2(_p0, _p1) * 13.5170001983642578125);
    vec2 _t5 = _106 + vec2(dot(_106, _106.yx + vec2(22.5410003662109375)));
    return fract((_t5.x + _t5.y) * _t5.y) - 0.5;
}

vec2 _f1(float _p0, float _p1)
{
    vec2 _t4 = vec2(1.0);
    if (edgeMode == 0)
    {
        _t4.x = step(0.0, _p0) * step(_p0, 1.0);
        _t4.y = step(0.0, _p1) * step(_p1, 1.0);
    }
    return _t4;
}

vec4 _f3(float _p0, float _p1)
{
    vec2 _136 = vec2(1.0) / u_ScreenParams.xy;
    float param = (_p0 + uv0.x) + 0.19900000095367431640625;
    float param_1 = _p0 * uv0.y;
    vec2 _166 = uv0 + (_136 * vec2(_p0 + ((dither * _p1) * _f2(param, param_1)), 0.0));
    vec2 _t7 = _166;
    float param_2 = (_p0 + uv0.x) + 0.676999986171722412109375;
    float param_3 = _p0 * uv0.y;
    vec2 _191 = uv0 - (_136 * vec2(_p0 + ((dither * _p1) * _f2(param_2, param_3)), 0.0));
    vec2 _t8 = _191;
    float param_4 = _t7.x;
    float param_5 = _t8.x;
    vec2 _t9 = _f1(param_4, param_5);
    return (texture2D(inputTexture, _166) * _t9.x) + (texture2D(inputTexture, _191) * _t9.y);
}

vec4 _f5(inout vec4 _p0)
{
    vec4 _t10 = vec4(1.0);
    vec4 _t11 = vec4(0.0);
    float _251 = max(1.0, max(max(ColorRadius.x, ColorRadius.y), ColorRadius.z) / MaxRadius);
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
        _p0 += (_f3(param_8, param_9) * _t11);
        _t10 += (_t11 * 2.0);
        _t15 += _251;
    }
    _p0 /= _t10;
    return _p0;
}

vec4 _f0(vec2 _p0)
{
    return vec4(floor(_p0.x * 255.0) / 255.0, fract(_p0.x * 255.0), floor(_p0.y * 255.0) / 255.0, fract(_p0.y * 255.0));
}

void main()
{
    vec4 param = texture2D(inputTexture, uv0);
    vec4 _381 = _f5(param);
    vec2 param_1 = _381.xy;
    gl_FragData[0] = _f0(param_1);
}

