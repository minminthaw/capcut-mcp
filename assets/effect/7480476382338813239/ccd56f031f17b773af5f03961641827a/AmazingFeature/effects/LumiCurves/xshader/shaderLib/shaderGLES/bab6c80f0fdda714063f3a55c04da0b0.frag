precision highp float;
precision highp int;

uniform vec2 controlPoints[75];
uniform mediump int pointsNums;

varying vec2 uv0;

vec2 _f0(mediump int _p0)
{
    vec2 _t0 = vec2(0.0);
    for (mediump int _t1 = 0; _t1 < 75; _t1++)
    {
        if (_p0 == _t1)
        {
            _t0 = controlPoints[_t1];
            break;
        }
    }
    return _t0;
}

float _f2(float _p0, float _p1, float _p2, float _p3, float _p4)
{
    if (_p2 <= _p0)
    {
        if (_p4 > _p2)
        {
            return _p3;
        }
        else
        {
            return _p1;
        }
    }
    return (((_p4 - _p0) * (_p3 - _p1)) / (_p2 - _p0)) + _p1;
}

float _f3(float _p0, float _p1, float _p2, float _p3, float _p4)
{
    float _160 = ((1.0 - _p4) * _p1) + (_p4 * _p2);
    return ((1.0 - _p4) * (((1.0 - _p4) * (((1.0 - _p4) * _p0) + (_p4 * _p1))) + (_p4 * _160))) + (_p4 * (((1.0 - _p4) * _160) + (_p4 * (((1.0 - _p4) * _p2) + (_p4 * _p3)))));
}

float _f4(float _p0, float _p1, float _p2, float _p3, float _p4)
{
    if (abs(_p0 - _p4) < 0.001000000047497451305389404296875)
    {
        return 0.0;
    }
    if (abs(_p3 - _p4) < 0.001000000047497451305389404296875)
    {
        return 1.0;
    }
    float _t12 = 0.0;
    float _t13 = 1.0;
    float _t14 = 0.5;
    float param = _p0;
    float param_1 = _p1;
    float param_2 = _p2;
    float param_3 = _p3;
    float param_4 = 0.5;
    float _t15 = _f3(param, param_1, param_2, param_3, param_4);
    for (mediump int _t16 = 0; _t16 < 20; _t16++)
    {
        if (abs(_t15 - _p4) < 0.001000000047497451305389404296875)
        {
            break;
        }
        if (_t15 < _p4)
        {
            _t12 = _t14;
        }
        else
        {
            _t13 = _t14;
        }
        float _262 = (_t12 + _t13) / 2.0;
        _t14 = _262;
        float param_5 = _p0;
        float param_6 = _p1;
        float param_7 = _p2;
        float param_8 = _p3;
        float param_9 = _262;
        _t15 = _f3(param_5, param_6, param_7, param_8, param_9);
    }
    return _t14;
}

float _f5(float _p0)
{
    mediump int _t17 = 0;
    for (mediump int _t18 = 0; _t18 < 75; _t18++)
    {
        _t17 = _t18;
        if (_t18 >= pointsNums)
        {
            break;
        }
    }
    mediump int param = 0;
    if (_p0 < _f0(param).x)
    {
        mediump int param_1 = 0;
        mediump int param_2 = 0;
        mediump int param_3 = 1;
        mediump int param_4 = 1;
        float param_5 = _f0(param_1).x;
        float param_6 = _f0(param_2).y;
        float param_7 = _f0(param_3).x;
        float param_8 = _f0(param_4).y;
        float param_9 = _p0;
        return _f2(param_5, param_6, param_7, param_8, param_9);
    }
    else
    {
        mediump int param_10 = (_t17 - 1) * 3;
        if (_p0 > _f0(param_10).x)
        {
            mediump int param_11 = ((_t17 - 1) * 3) - 1;
            mediump int param_12 = ((_t17 - 1) * 3) - 1;
            mediump int param_13 = (_t17 - 1) * 3;
            mediump int param_14 = (_t17 - 1) * 3;
            float param_15 = _f0(param_11).x;
            float param_16 = _f0(param_12).y;
            float param_17 = _f0(param_13).x;
            float param_18 = _f0(param_14).y;
            float param_19 = _p0;
            return _f2(param_15, param_16, param_17, param_18, param_19);
        }
    }
    mediump int _t19 = 0;
    for (mediump int _t20 = 0; _t20 < 75; _t20++)
    {
        _t19 = _t20;
        if (_t20 >= pointsNums)
        {
            break;
        }
        mediump int param_20 = _t20 * 3;
        if (_p0 < _f0(param_20).x)
        {
            break;
        }
    }
    mediump int param_21 = (_t19 - 1) * 3;
    vec2 _t21 = _f0(param_21);
    mediump int param_22 = ((_t19 - 1) * 3) + 1;
    vec2 _t22 = _f0(param_22);
    mediump int param_23 = ((_t19 - 1) * 3) + 2;
    vec2 _t23 = _f0(param_23);
    mediump int param_24 = _t19 * 3;
    vec2 _t24 = _f0(param_24);
    float param_25 = _t21.x;
    float param_26 = _t22.x;
    float param_27 = _t23.x;
    float param_28 = _t24.x;
    float param_29 = _p0;
    float param_30 = _t21.y;
    float param_31 = _t22.y;
    float param_32 = _t23.y;
    float param_33 = _t24.y;
    float param_34 = _f4(param_25, param_26, param_27, param_28, param_29);
    return _f3(param_30, param_31, param_32, param_33, param_34);
}

vec4 _f1(float _p0)
{
    return vec4(floor(abs(_p0)) / 255.0, floor(fract(abs(_p0)) * 255.0) / 255.0, fract(fract(abs(_p0)) * 255.0), float(_p0 < 0.0));
}

void main()
{
    float param = uv0.x;
    float param_1 = _f5(param);
    gl_FragData[0] = _f1(param_1);
}

