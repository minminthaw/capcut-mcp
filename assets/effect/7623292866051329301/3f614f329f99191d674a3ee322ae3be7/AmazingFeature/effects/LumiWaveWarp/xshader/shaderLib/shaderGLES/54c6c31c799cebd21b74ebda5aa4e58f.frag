precision highp float;
precision highp int;

uniform mediump int u_type;
uniform float u_amplitude;
uniform vec4 u_ScreenParams;
uniform mediump int u_fixedType;
uniform float u_wavelength;
uniform float u_phase;
uniform vec2 u_dir;
uniform mediump int u_aa;
uniform mediump sampler2D u_inputTexture;

varying vec2 v_p;

float _f4(float _p0)
{
    return sin(6.283185482025146484375 * _p0);
}

float _f5(float _p0)
{
    return step(_p0, 0.5);
}

float _f6(float _p0)
{
    return mix(-1.0, 1.0, 1.0 - (abs(0.5 - _p0) * 2.0));
}

float _f7(float _p0)
{
    return mix(-1.0, 1.0, _p0);
}

float _f8(float _p0)
{
    float _209 = mix(1.0, -1.0, fract(_p0 + _p0));
    float _215 = sqrt(1.0 - (_209 * _209));
    return mix(_215, -_215, step(0.5, _p0));
}

float _f9(float _p0)
{
    float _228 = mix(1.0, -1.0, _p0);
    return mix(1.0, -1.0, sqrt(1.0 - (_228 * _228)));
}

float _f10(float _p0)
{
    float _245 = mix(1.0, -1.0, fract(_p0 + _p0));
    float _251 = sqrt(1.0 - (_245 * _245));
    return mix(_251 - 1.0, 1.0 - _251, step(_p0, 0.5));
}

float _f11(inout float _p0)
{
    _p0 = floor(_p0 * 200.0) / 200.0;
    float _271 = _p0 * 1000.0;
    return (cos(_271 * 0.5) * cos(_271 * 0.12999999523162841796875)) * sin((_271 + 10.0) * 0.300000011920928955078125);
}

float _f12(float _p0)
{
    float _296 = (3.1415927410125732421875 * _p0) * 30.0;
    return (cos(_296 * 0.5) * cos(_296 * 0.12999999523162841796875)) * sin((_296 + 10.0) * 0.300000011920928955078125);
}

float _f13(float _p0)
{
    if (u_type == 0)
    {
        float param = _p0;
        return _f4(param);
    }
    else
    {
        if (u_type == 1)
        {
            float param_1 = _p0;
            return _f5(param_1);
        }
        else
        {
            if (u_type == 2)
            {
                float param_2 = _p0;
                return _f6(param_2);
            }
            else
            {
                if (u_type == 3)
                {
                    float param_3 = _p0;
                    return _f7(param_3);
                }
                else
                {
                    if (u_type == 4)
                    {
                        float param_4 = _p0;
                        return _f8(param_4);
                    }
                    else
                    {
                        if (u_type == 5)
                        {
                            float param_5 = _p0;
                            return _f9(param_5);
                        }
                        else
                        {
                            if (u_type == 6)
                            {
                                float param_6 = _p0;
                                return _f10(param_6);
                            }
                            else
                            {
                                if (u_type == 7)
                                {
                                    float param_7 = _p0;
                                    float _394 = _f11(param_7);
                                    return _394;
                                }
                                else
                                {
                                    if (u_type == 8)
                                    {
                                        float param_8 = _p0;
                                        return _f12(param_8);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return 0.0;
}

vec2 _f2(vec2 _p0, vec2 _p1, vec2 _p2)
{
    return clamp((_p2 - _p0) / (_p1 - _p0), vec2(0.0), vec2(1.0));
}

vec2 _f14(vec2 _p0, vec2 _p1)
{
    vec2 _414 = vec2(u_amplitude * 1.2000000476837158203125);
    vec2 param = vec2(0.0);
    vec2 param_1 = _414;
    vec2 param_2 = _p0;
    vec2 param_3 = u_ScreenParams.xy;
    vec2 param_4 = u_ScreenParams.xy - _414;
    vec2 param_5 = _p0;
    vec2 _t17 = min(_f2(param, param_1, param_2), _f2(param_3, param_4, param_5));
    return mix(_p0, _p1, vec2(min(_t17.x, _t17.y)));
}

float _f1(float _p0, float _p1, float _p2)
{
    return clamp((_p2 - _p0) / (_p1 - _p0), 0.0, 1.0);
}

float _f3(float _p0)
{
    return _p0 * _p0;
}

vec2 _f15(vec2 _p0, vec2 _p1)
{
    vec2 _t18 = u_ScreenParams.xy;
    float param = 0.0;
    float param_1 = min(_t18.x, _t18.y) * 0.4000000059604644775390625;
    float param_2 = length(_p0 - (u_ScreenParams.xy * 0.5));
    float param_3 = _f1(param, param_1, param_2);
    return mix(_p0, _p1, vec2(_f3(param_3)));
}

vec2 _f16(vec2 _p0, vec2 _p1)
{
    float param = 0.0;
    float param_1 = u_amplitude * 1.2000000476837158203125;
    float param_2 = _p0.x;
    return mix(_p0, _p1, vec2(_f1(param, param_1, param_2)));
}

vec2 _f17(vec2 _p0, vec2 _p1)
{
    float param = 0.0;
    float param_1 = u_amplitude * 1.2000000476837158203125;
    float param_2 = _p0.y;
    return mix(_p0, _p1, vec2(_f1(param, param_1, param_2)));
}

vec2 _f18(vec2 _p0, vec2 _p1)
{
    float param = u_ScreenParams.x;
    float param_1 = u_ScreenParams.x - (u_amplitude * 1.2000000476837158203125);
    float param_2 = _p0.x;
    return mix(_p0, _p1, vec2(_f1(param, param_1, param_2)));
}

vec2 _f19(vec2 _p0, vec2 _p1)
{
    float param = u_ScreenParams.y;
    float param_1 = u_ScreenParams.y - (u_amplitude * 1.2000000476837158203125);
    float param_2 = _p0.y;
    return mix(_p0, _p1, vec2(_f1(param, param_1, param_2)));
}

vec2 _f20(vec2 _p0, vec2 _p1)
{
    float _564 = u_amplitude * 1.2000000476837158203125;
    float param = 0.0;
    float param_1 = _564;
    float param_2 = _p0.x;
    float param_3 = u_ScreenParams.x;
    float param_4 = u_ScreenParams.x - _564;
    float param_5 = _p0.x;
    return mix(_p0, _p1, vec2(min(_f1(param, param_1, param_2), _f1(param_3, param_4, param_5))));
}

vec2 _f21(vec2 _p0, vec2 _p1)
{
    float _596 = u_amplitude * 1.2000000476837158203125;
    float param = 0.0;
    float param_1 = _596;
    float param_2 = _p0.y;
    float param_3 = u_ScreenParams.y;
    float param_4 = u_ScreenParams.y - _596;
    float param_5 = _p0.y;
    return mix(_p0, _p1, vec2(min(_f1(param, param_1, param_2), _f1(param_3, param_4, param_5))));
}

vec2 _f22(vec2 _p0, vec2 _p1)
{
    if (u_fixedType == 0)
    {
        return _p1;
    }
    else
    {
        if (u_fixedType == 1)
        {
            vec2 param = _p0;
            vec2 param_1 = _p1;
            return _f14(param, param_1);
        }
        else
        {
            if (u_fixedType == 2)
            {
                vec2 param_2 = _p0;
                vec2 param_3 = _p1;
                return _f15(param_2, param_3);
            }
            else
            {
                if (u_fixedType == 3)
                {
                    vec2 param_4 = _p0;
                    vec2 param_5 = _p1;
                    return _f16(param_4, param_5);
                }
                else
                {
                    if (u_fixedType == 4)
                    {
                        vec2 param_6 = _p0;
                        vec2 param_7 = _p1;
                        return _f17(param_6, param_7);
                    }
                    else
                    {
                        if (u_fixedType == 5)
                        {
                            vec2 param_8 = _p0;
                            vec2 param_9 = _p1;
                            return _f18(param_8, param_9);
                        }
                        else
                        {
                            if (u_fixedType == 6)
                            {
                                vec2 param_10 = _p0;
                                vec2 param_11 = _p1;
                                return _f19(param_10, param_11);
                            }
                            else
                            {
                                if (u_fixedType == 7)
                                {
                                    vec2 param_12 = _p0;
                                    vec2 param_13 = _p1;
                                    return _f20(param_12, param_13);
                                }
                                else
                                {
                                    if (u_fixedType == 8)
                                    {
                                        vec2 param_14 = _p0;
                                        vec2 param_15 = _p1;
                                        return _f21(param_14, param_15);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return _p0;
}

vec4 _f0(mediump sampler2D _p0, inout vec2 _p1)
{
    vec2 _124 = _p1;
    _p1 = step(vec2(0.0), _p1) * step(_p1, vec2(1.0));
    return (texture2D(_p0, _124) * _p1.x) * _p1.y;
}

vec4 _f24(mediump sampler2D _p0, vec2 _p1, vec2 _p2, vec2 _p3)
{
    float param = fract((dot(_p1, _p2) / u_wavelength) + u_phase);
    vec2 param_1 = _p1;
    vec2 param_2 = _p1 - (_p3 * (_f13(param) * u_amplitude));
    vec2 _t39 = _f22(param_1, param_2) / u_ScreenParams.xy;
    vec2 param_3 = vec2(_t39.x, 1.0 - _t39.y);
    vec4 _804 = _f0(_p0, param_3);
    vec4 _t40 = _804;
    vec2 _t41 = vec2(0.4000000059604644775390625, 0.300000011920928955078125);
    for (mediump int _t42 = 0; _t42 < 4; _t42++)
    {
        vec2 _819 = _p1 + _t41;
        float param_4 = fract((dot(_819, _p2) / u_wavelength) + u_phase);
        vec2 param_5 = _819;
        vec2 param_6 = _819 - (_p3 * (_f13(param_4) * u_amplitude));
        vec2 _t44 = _f22(param_5, param_6) / u_ScreenParams.xy;
        vec2 param_7 = vec2(_t44.x, 1.0 - _t44.y);
        vec4 _854 = _f0(_p0, param_7);
        _t40 += _854;
        _t41 = vec2(-_t41.y, _t41.x);
    }
    return _t40 / vec4(5.0);
}

vec4 _f25(mediump sampler2D _p0, vec2 _p1, vec2 _p2, vec2 _p3)
{
    float param = fract((dot(_p1, _p2) / u_wavelength) + u_phase);
    vec2 param_1 = _p1;
    vec2 param_2 = _p1 - (_p3 * (_f13(param) * u_amplitude));
    vec2 _t48 = _f22(param_1, param_2) / u_ScreenParams.xy;
    vec2 param_3 = vec2(_t48.x, 1.0 - _t48.y);
    vec4 _909 = _f0(_p0, param_3);
    vec4 _t49 = _909;
    vec2 _t50 = vec2(0.319999992847442626953125, 0.23999999463558197021484375);
    for (mediump int _t51 = 0; _t51 < 4; _t51++)
    {
        vec2 _925 = _p1 + _t50;
        float param_4 = fract((dot(_925, _p2) / u_wavelength) + u_phase);
        vec2 param_5 = _925;
        vec2 param_6 = _925 - (_p3 * (_f13(param_4) * u_amplitude));
        vec2 _t53 = _f22(param_5, param_6) / u_ScreenParams.xy;
        vec2 param_7 = vec2(_t53.x, 1.0 - _t53.y);
        vec4 _960 = _f0(_p0, param_7);
        _t49 += _960;
        _t50 = vec2(-_t50.y, _t50.x);
    }
    _t50 = vec2(0.38999998569488525390625, 0.519999980926513671875);
    for (mediump int _t54 = 0; _t54 < 4; _t54++)
    {
        vec2 _985 = _p1 + _t50;
        float param_8 = fract((dot(_985, _p2) / u_wavelength) + u_phase);
        vec2 param_9 = _985;
        vec2 param_10 = _985 - (_p3 * (_f13(param_8) * u_amplitude));
        vec2 _t56 = _f22(param_9, param_10) / u_ScreenParams.xy;
        vec2 param_11 = vec2(_t56.x, 1.0 - _t56.y);
        vec4 _1020 = _f0(_p0, param_11);
        _t49 += _1020;
        _t50 = vec2(-_t50.y, _t50.x);
    }
    return _t49 / vec4(9.0);
}

vec4 _f23(mediump sampler2D _p0, vec2 _p1, vec2 _p2, vec2 _p3)
{
    float param = fract((dot(_p1, _p2) / u_wavelength) + u_phase);
    vec2 param_1 = _p1;
    vec2 param_2 = _p1 - (_p3 * (_f13(param) * u_amplitude));
    vec2 _t35 = _f22(param_1, param_2) / u_ScreenParams.xy;
    vec2 param_3 = vec2(_t35.x, 1.0 - _t35.y);
    vec4 _763 = _f0(_p0, param_3);
    return _763;
}

void main()
{
    vec2 _t57 = u_dir;
    vec2 _1047 = vec2(-_t57.y, _t57.x);
    if (u_aa == 1)
    {
        vec2 param = v_p;
        vec2 param_1 = u_dir;
        vec2 param_2 = _1047;
        gl_FragData[0] = _f24(u_inputTexture, param, param_1, param_2);
    }
    else
    {
        if (u_aa == 2)
        {
            vec2 param_3 = v_p;
            vec2 param_4 = u_dir;
            vec2 param_5 = _1047;
            gl_FragData[0] = _f25(u_inputTexture, param_3, param_4, param_5);
        }
        else
        {
            vec2 param_6 = v_p;
            vec2 param_7 = u_dir;
            vec2 param_8 = _1047;
            gl_FragData[0] = _f23(u_inputTexture, param_6, param_7, param_8);
        }
    }
}

