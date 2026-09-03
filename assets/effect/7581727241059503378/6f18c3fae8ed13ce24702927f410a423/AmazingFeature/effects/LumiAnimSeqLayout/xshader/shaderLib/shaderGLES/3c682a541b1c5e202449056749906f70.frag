precision highp float;
precision highp int;

uniform mediump int u_yFlip;
uniform mediump int u_convertAlpha;
uniform mediump sampler2D u_seqTexture;
uniform vec2 u_scale;
uniform mediump int u_alignmentX;
uniform mediump int u_alignmentY;
uniform vec2 u_seqTexSize;
uniform vec4 u_ScreenParams;
uniform vec2 u_offsetLocal;
uniform vec2 u_offsetGlobal;
uniform float u_rotation;
uniform mediump int u_edgeType;
uniform float u_opacity;
uniform mediump sampler2D u_inputTexture;
uniform mediump int u_blendInput;

varying vec2 uv0;

vec2 _f5(inout vec2 _p0, float _p1, vec2 _p2, vec2 _p3, vec2 _p4)
{
    _p0 -= _p2;
    _p0 -= _p3;
    _p0 /= _p4;
    _p0 += _p3;
    return _p0;
}

vec2 _f4(inout vec2 _p0, float _p1, float _p2)
{
    _p0 -= vec2(0.5);
    _p0.y /= _p2;
    float _165 = sin(_p1);
    float _168 = cos(_p1);
    _p0 = mat2(vec2(_168, _165), vec2(-_165, _168)) * _p0;
    _p0.y *= _p2;
    _p0 += vec2(0.5);
    return _p0;
}

vec2 _f2(vec2 _p0)
{
    vec2 _128 = mod(_p0, vec2(1.0));
    return _128 + (vec2(1.0) - step(vec2(0.0), _128));
}

vec2 _f1(vec2 _p0)
{
    return abs(mod(_p0 - vec2(1.0), vec2(2.0)) - vec2(1.0));
}

vec4 _f0(inout vec2 _p0)
{
    if (u_yFlip == 1)
    {
        _p0 = vec2(_p0.x, 1.0 - _p0.y);
    }
    if (u_convertAlpha == 0)
    {
        return texture2D(u_seqTexture, _p0);
    }
    vec4 _t2;
    _t2.w = texture2D(u_seqTexture, vec2(_p0.x * 0.5, _p0.y)).x;
    mediump vec3 _103 = texture2D(u_seqTexture, vec2((_p0.x * 0.5) + 0.5, _p0.y)).xyz;
    _t2.x = _103.x;
    _t2.y = _103.y;
    _t2.z = _103.z;
    return _t2;
}

float _f3(vec2 _p0)
{
    vec2 _t4 = step(vec2(0.0), _p0) * step(_p0, vec2(1.0));
    return _t4.x * _t4.y;
}

void main()
{
    bool _215 = abs(u_scale.x) < 9.9999997473787516355514526367188e-05;
    bool _223;
    if (!_215)
    {
        _223 = abs(u_scale.y) < 9.9999997473787516355514526367188e-05;
    }
    else
    {
        _223 = _215;
    }
    if (_223)
    {
        gl_FragData[0] = vec4(0.0);
        return;
    }
    vec2 _t8 = uv0;
    vec2 _t9 = vec2(0.0);
    mediump float _238 = float(u_alignmentX);
    _t9.x = mix(0.0, 0.5, step(0.5, _238)) + mix(0.0, 0.5, step(1.5, _238));
    mediump float _254 = float(u_alignmentY);
    _t9.y = mix(0.0, 0.5, step(0.5, _254)) + mix(0.0, 0.5, step(1.5, _254));
    _t9.y = 1.0 - _t9.y;
    float _276 = u_seqTexSize.x / u_seqTexSize.y;
    float _284 = u_ScreenParams.x / u_ScreenParams.y;
    vec2 _t16 = vec2(0.0);
    bool _288 = _276 < _284;
    if (_288)
    {
        _t16.y = (u_offsetLocal.y * u_scale.y) + u_offsetGlobal.y;
        _t16.x = (((u_offsetLocal.x * u_scale.x) * _276) / _284) + u_offsetGlobal.x;
    }
    else
    {
        _t16.x = (u_offsetLocal.x * u_scale.x) + u_offsetGlobal.x;
        _t16.y = (((u_offsetLocal.y * u_scale.y) * _284) / _276) + u_offsetGlobal.y;
    }
    vec2 param = _t8;
    float param_1 = 0.0;
    vec2 param_2 = _t16;
    vec2 param_3 = _t9;
    vec2 param_4 = u_scale;
    vec2 _347 = _f5(param, param_1, param_2, param_3, param_4);
    _t8 = _347;
    if (_288)
    {
        float _356 = _284 / _276;
        _t8.y = _t8.y;
        _t8.x = ((_t8.x - 0.5) * _356) + 0.5;
        if (u_alignmentX == 0)
        {
            _t8.x -= ((1.0 - _356) * 0.5);
        }
        else
        {
            if (u_alignmentX == 2)
            {
                _t8.x += ((1.0 - _356) * 0.5);
            }
        }
    }
    else
    {
        float _395 = _276 / _284;
        _t8.x = _t8.x;
        _t8.y = ((_t8.y - 0.5) * _395) + 0.5;
        if (u_alignmentY == 0)
        {
            _t8.y += ((1.0 - _395) * 0.5);
        }
        else
        {
            if (u_alignmentY == 2)
            {
                _t8.y -= ((1.0 - _395) * 0.5);
            }
        }
    }
    vec2 param_5 = _t8;
    float param_6 = u_rotation;
    float param_7 = _276;
    vec2 _436 = _f4(param_5, param_6, param_7);
    _t8 = _436;
    vec2 _t19 = _436;
    if (u_edgeType == 0)
    {
        vec2 param_8 = _t19;
        _t19 = _f2(param_8);
    }
    else
    {
        if (u_edgeType == 1)
        {
            vec2 param_9 = _t19;
            _t19 = _f1(param_9);
        }
    }
    vec2 param_10 = _t19;
    vec4 _458 = _f0(param_10);
    vec4 _t20 = _458;
    if (u_edgeType == 3)
    {
        vec2 param_11 = _t19;
        _t20 *= _f3(param_11);
    }
    vec4 _471 = _t20;
    vec4 _472 = _471 * u_opacity;
    _t20 = _472;
    float _482 = _t20.w;
    vec4 _490 = mix(_472, _472 + (texture2D(u_inputTexture, uv0) * (1.0 - _482)), vec4(float(u_blendInput)));
    _t20 = _490;
    gl_FragData[0] = _490;
}

