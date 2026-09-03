precision highp float;
precision highp int;

uniform mediump int u_convertAlpha;
uniform mediump sampler2D u_seqTexture;
uniform vec2 u_scale;
uniform vec2 u_seqTexSize;
uniform vec4 u_ScreenParams;
uniform mediump int u_cropType;
uniform mediump int u_edgeType;
uniform float u_opacity;

varying vec2 uv0;

vec2 _f2(vec2 _p0)
{
    vec2 _105 = mod(_p0, vec2(1.0));
    return _105 + (vec2(1.0) - step(vec2(0.0), _105));
}

vec2 _f1(vec2 _p0)
{
    return abs(mod(_p0 - vec2(1.0), vec2(2.0)) - vec2(1.0));
}

vec4 _f0(vec2 _p0)
{
    if (u_convertAlpha == 0)
    {
        return texture2D(u_seqTexture, _p0);
    }
    vec4 _t2;
    _t2.w = texture2D(u_seqTexture, vec2(_p0.x * 0.5, _p0.y)).x;
    float _78 = _t2.w;
    vec3 _79 = texture2D(u_seqTexture, vec2((_p0.x * 0.5) + 0.5, _p0.y)).xyz * _78;
    _t2.x = _79.x;
    _t2.y = _79.y;
    _t2.z = _79.z;
    return _t2;
}

float _f3(vec2 _p0)
{
    vec2 _t4 = step(vec2(0.0), _p0) * step(_p0, vec2(1.0));
    return _t4.x * _t4.y;
}

void main()
{
    bool _139 = abs(u_scale.x) < 9.9999997473787516355514526367188e-05;
    bool _147;
    if (!_139)
    {
        _147 = abs(u_scale.y) < 9.9999997473787516355514526367188e-05;
    }
    else
    {
        _147 = _139;
    }
    if (_147)
    {
        gl_FragData[0] = vec4(0.0);
        return;
    }
    vec2 _163 = ((uv0 - vec2(0.5)) / u_scale) + vec2(0.5);
    vec2 _t5 = _163;
    float _170 = u_seqTexSize.x / u_seqTexSize.y;
    float _178 = u_ScreenParams.x / u_ScreenParams.y;
    vec2 _t8 = _163;
    if (u_cropType == 1)
    {
        if (_170 > _178)
        {
            _t8.y = _t5.y;
            _t8.x = ((_t5.x - 0.5) * (_178 / _170)) + 0.5;
        }
        else
        {
            _t8.x = _t5.x;
            _t8.y = ((_t5.y - 0.5) * (_170 / _178)) + 0.5;
        }
    }
    else
    {
        if (u_cropType == 2)
        {
            if (_170 < _178)
            {
                _t8.y = _t5.y;
                _t8.x = ((_t5.x - 0.5) * (_178 / _170)) + 0.5;
            }
            else
            {
                _t8.x = _t5.x;
                _t8.y = ((_t5.y - 0.5) * (_170 / _178)) + 0.5;
            }
        }
    }
    if (u_edgeType == 0)
    {
        vec2 param = _t8;
        _t8 = _f2(param);
    }
    else
    {
        if (u_edgeType == 1)
        {
            vec2 param_1 = _t8;
            _t8 = _f1(param_1);
        }
    }
    vec2 param_2 = _t8;
    vec4 _t13 = _f0(param_2);
    if (u_edgeType == 3)
    {
        vec2 param_3 = _t8;
        _t13 *= _f3(param_3);
    }
    vec4 _293 = _t13;
    vec4 _294 = _293 * u_opacity;
    _t13 = _294;
    gl_FragData[0] = _294;
}

