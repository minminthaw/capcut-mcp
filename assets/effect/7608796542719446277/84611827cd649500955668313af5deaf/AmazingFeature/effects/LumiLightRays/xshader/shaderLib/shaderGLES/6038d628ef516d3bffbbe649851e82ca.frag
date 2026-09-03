precision highp float;
precision highp int;

uniform float scale;
uniform float light_warpSoftness;
uniform float light_intensity;
uniform mediump sampler2D inputTexture;
uniform float light_shape;
uniform vec2 light_coordinate;
uniform float light_radius;
uniform float scale_degree;
uniform float light_enhance;
uniform float light_colorSource;
uniform vec3 light_color;
uniform float light_transferMode;

varying vec2 uv0;

vec2 _f1(inout vec2 _p0, vec2 _p1, float _p2)
{
    vec2 _70 = vec2(scale, 1.0);
    for (mediump int _t1 = 0; _t1 < 16; _t1++)
    {
        _p0 = (_p0 - _p1) * _70;
        _p0 *= pow(pow(length(_p0 * 2.0), 1.2000000476837158203125) + 1.0, -pow(_p2 * 0.00593749992549419403076171875, 3.0));
        _p0 /= _70;
        _p0 += _p1;
    }
    return _p0;
}

vec2 _f2(vec2 _p0, vec2 _p1, float _p2)
{
    vec2 _130 = ((_p0 - _p1) * vec2(scale, 1.0)) / vec2(0.569999992847442626953125);
    vec2 _t4 = _130;
    float _144 = (_t4.x * _t4.x) + (_t4.y * _t4.y);
    float _148 = _144 * _144;
    float _165 = ((1.0 + (0.84899997711181640625 * _144)) + (0.268999993801116943359375 * _148)) + ((-0.12800000607967376708984375) * (_144 * _148));
    if (_p2 < 220.0)
    {
        vec2 param = ((((_130 / vec2(_165)) * 0.569999992847442626953125) * 2.5) * (_p2 * pow(1.0 - (light_warpSoftness / 100.0), 5.0))) + _p1;
        vec2 param_1 = _p1;
        float param_2 = 220.0 - _p2;
        vec2 _200 = _f1(param, param_1, param_2);
        return _200;
    }
    else
    {
        return ((((_130 / vec2(_165)) * 0.569999992847442626953125) * 2.5) * (1.0 + ((_p2 - 220.0) / 500.0))) + _p1;
    }
}

float _f3(float _p0, float _p1, vec2 _p2)
{
    if (((_p2.y - (_p0 * _p2.x)) - _p1) <= 0.0)
    {
        return -1.0;
    }
    else
    {
        return 1.0;
    }
}

vec2 _f4(vec2 _p0, vec2 _p1, inout float _p2, float _p3)
{
    _p2 = 90.0 - mod(_p2, 90.0);
    float _t14;
    if (_p2 == 45.0)
    {
        bool _251 = _p0.x <= _p1.x;
        bool _259;
        if (_251)
        {
            _259 = _p0.y >= _p1.y;
        }
        else
        {
            _259 = _251;
        }
        if (_259)
        {
            _t14 = 1.0;
        }
        else
        {
            bool _268 = _p0.x <= _p1.x;
            bool _276;
            if (_268)
            {
                _276 = _p0.y <= _p1.y;
            }
            else
            {
                _276 = _268;
            }
            if (_276)
            {
                _t14 = 2.0;
            }
            else
            {
                bool _284 = _p0.x >= _p1.x;
                bool _292;
                if (_284)
                {
                    _292 = _p0.y <= _p1.y;
                }
                else
                {
                    _292 = _284;
                }
                if (_292)
                {
                    _t14 = 3.0;
                }
                else
                {
                    _t14 = 4.0;
                }
            }
        }
    }
    else
    {
        float _305 = tan(((_p2 + 45.0) / 180.0) * 3.141592502593994140625);
        float _314 = (_305 < 0.0) ? _305 : ((-1.0) / _305);
        float _317 = (-1.0) / _314;
        float param = _314;
        float param_1 = _p1.y - (_314 * _p1.x);
        vec2 param_2 = _p0;
        float _341 = _f3(param, param_1, param_2);
        float param_3 = _317;
        float param_4 = _p1.y - (_317 * _p1.x);
        vec2 param_5 = _p0;
        float _349 = _f3(param_3, param_4, param_5);
        bool _353 = _349 >= 0.0;
        if ((_341 >= 0.0) && _353)
        {
            _t14 = 1.0;
        }
        else
        {
            bool _361 = _341 <= 0.0;
            if (_353 && _361)
            {
                _t14 = 2.0;
            }
            else
            {
                if ((_349 <= 0.0) && _361)
                {
                    _t14 = 3.0;
                }
                else
                {
                    _t14 = 4.0;
                }
            }
        }
    }
    float _t23;
    if (_p2 == 0.0)
    {
        if (_t14 == 1.0)
        {
            _t23 = _p0.y - _p1.y;
        }
        else
        {
            if (_t14 == 2.0)
            {
                _t23 = _p1.x - _p0.x;
            }
            else
            {
                if (_t14 == 3.0)
                {
                    _t23 = _p1.y - _p0.y;
                }
                else
                {
                    _t23 = _p0.x - _p1.x;
                }
            }
        }
    }
    else
    {
        float _418 = tan((_p2 / 180.0) * 3.141592502593994140625);
        float _420 = (-1.0) / _418;
        float _432 = _p1.y - (_418 * _p1.x);
        float _440 = _p1.y - (_420 * _p1.x);
        if (_p2 <= 45.0)
        {
            if ((_t14 == 1.0) || (_t14 == 3.0))
            {
                _t23 = abs((_p0.y - (_418 * _p0.x)) - _432) / sqrt(1.0 + (_418 * _418));
            }
            else
            {
                _t23 = abs((_p0.y - (_420 * _p0.x)) - _440) / sqrt(1.0 + (_420 * _420));
            }
        }
        else
        {
            if ((45.0 < _p2) && (_p2 <= 90.0))
            {
                if ((_t14 == 2.0) || (_t14 == 4.0))
                {
                    _t23 = abs((_p0.y - (_418 * _p0.x)) - _432) / sqrt(1.0 + (_418 * _418));
                }
                else
                {
                    _t23 = abs((_p0.y - (_420 * _p0.x)) - _440) / sqrt(1.0 + (_420 * _420));
                }
            }
        }
    }
    vec2 _535 = vec2(scale, 1.0);
    vec2 param_6 = ((((_p0 - _p1) * _535) * (3.0 / (1.0 + (2.0 * _t23)))) / _535) + _p1;
    vec2 param_7 = _p1;
    float param_8 = 220.0 - _p3;
    vec2 _561 = _f1(param_6, param_7, param_8);
    return _561;
}

float _f0(vec2 _p0)
{
    return ((step(0.0, _p0.x) * step(_p0.x, 1.0)) * step(0.0, _p0.y)) * step(_p0.y, 1.0);
}

float _f5(vec2 _p0, float _p1, float _p2)
{
    float _582 = _p1 / 2000.0;
    return clamp(((1.0 / max(1.0 + (max(length((uv0 - _p0) * vec2(scale, 1.0)) - _582, -0.980000019073486328125) * (0.5 / max(_582, 9.9999997473787516355514526367188e-05))), 9.9999997473787516355514526367188e-05)) * (1.0 - (_p2 / 120.0))) * light_intensity, -255.0, 255.0);
}

void main()
{
    mediump vec4 _626 = texture2D(inputTexture, uv0);
    vec2 _t40 = uv0;
    if (light_shape < 0.5)
    {
        vec2 param = uv0;
        vec2 param_1 = light_coordinate;
        float param_2 = light_radius;
        _t40 = _f2(param, param_1, param_2);
    }
    else
    {
        vec2 param_3 = uv0;
        vec2 param_4 = light_coordinate;
        float param_5 = scale_degree;
        float param_6 = light_radius;
        vec2 _657 = _f4(param_3, param_4, param_5, param_6);
        _t40 = _657;
    }
    vec2 param_7 = _t40;
    vec4 _t41 = texture2D(inputTexture, _t40) * _f0(param_7);
    vec2 param_8 = light_coordinate;
    float param_9 = light_radius;
    float param_10 = light_warpSoftness;
    float _t42 = _f5(param_8, param_9, param_10);
    if (light_enhance < 0.5)
    {
        _t42 = clamp(_t42, 0.0, 1.0);
    }
    if (light_colorSource < 0.5)
    {
        vec3 _691 = light_color * _t42;
        _t41.x = _691.x;
        _t41.y = _691.y;
        _t41.z = _691.z;
    }
    else
    {
        _t41 *= _t42;
    }
    if (light_transferMode < 0.5)
    {
        gl_FragData[0] = _t41;
    }
    else
    {
        if (light_transferMode < 1.5)
        {
            gl_FragData[0] = _t41 + _626;
        }
        else
        {
            if (light_transferMode < 2.5)
            {
                gl_FragData[0] = max(_t41, _626);
            }
            else
            {
                if (light_transferMode < 3.5)
                {
                    gl_FragData[0] = vec4(1.0) - ((vec4(1.0) - _t41) * (vec4(1.0) - _626));
                }
                else
                {
                    gl_FragData[0] = _t41;
                }
            }
        }
    }
}

