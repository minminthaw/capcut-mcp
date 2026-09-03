precision highp float;
precision highp int;

uniform mediump int u_skipSample;
uniform mat4 u_mvMat0;
uniform mat4 u_pMat0;
uniform float u_mirrorEdge;
uniform mediump sampler2D u_inputTex;
uniform float u_alpha;
uniform mat4 u_mvMat1;
uniform mat4 u_pMat1;
uniform mat4 u_mvMat2;
uniform mat4 u_pMat2;
uniform mat4 u_mvMat3;
uniform mat4 u_pMat3;
uniform mat4 u_mvMat4;
uniform mat4 u_pMat4;
uniform mat4 u_mvMat5;
uniform mat4 u_pMat5;
uniform float u_samples;
uniform float u_dither;

varying vec2 uv0;

vec4 _f1(vec3 _p0, vec3 _p1, vec3 _p2, vec3 _p3, vec3 _p4)
{
    vec3 _67 = _p3 - _p2;
    vec3 _71 = _p4 - _p2;
    vec3 _75 = cross(_p1, _71);
    float _79 = dot(_67, _75);
    if (_79 <= 1.0000000116860974230803549289703e-07)
    {
        return vec4(-1.0);
    }
    vec3 _92 = _p0 - _p2;
    float _98 = dot(_92, _75) / _79;
    if ((_98 < 0.0) || (_98 > 1.0))
    {
        return vec4(-1.0);
    }
    vec3 _111 = cross(_92, _67);
    float _117 = dot(_p1, _111) / _79;
    bool _119 = _117 < 0.0;
    bool _127;
    if (!_119)
    {
        _127 = (_98 + _117) > 1.0;
    }
    else
    {
        _127 = _119;
    }
    if (_127)
    {
        return vec4(-1.0);
    }
    return vec4(_98, _117, dot(_71, _111) / _79, 1.0);
}

vec2 _f2(mat4 _p0, mat4 _p1, vec2 _p2)
{
    vec4 _171 = _p1 * vec4((_p2 * 2.0) - vec2(1.0), 0.0, 1.0);
    vec4 _t13 = _171;
    vec3 _188 = normalize((_171.xyz / vec3(_t13.w)) - vec3(0.0));
    vec3 _191 = (_p0 * vec4(10.0, -10.0, 0.0, 1.0)).xyz;
    vec3 _194 = _191 + vec3(9.9999997473787516355514526367188e-06, 0.0, 0.0);
    vec3 _196 = (_p0 * vec4(-10.0, 10.0, 0.0, 1.0)).xyz;
    vec3 _198 = _196 + vec3(0.0, 9.9999997473787516355514526367188e-06, 0.0);
    vec3 param = vec3(0.0);
    vec3 param_1 = _188;
    vec3 _205 = (_p0 * vec4(-10.0, -10.0, 0.0, 1.0)).xyz;
    vec3 param_2 = _205;
    vec3 param_3 = _194;
    vec3 param_4 = _198;
    vec4 _t17 = _f1(param, param_1, param_2, param_3, param_4);
    vec3 _212 = _196 - vec3(9.9999997473787516355514526367188e-06, 0.0, 0.0);
    vec3 _215 = _191 - vec3(0.0, 9.9999997473787516355514526367188e-06, 0.0);
    vec3 param_5 = vec3(0.0);
    vec3 param_6 = _188;
    vec3 param_7 = _212;
    vec3 param_8 = _215;
    vec3 _224 = (_p0 * vec4(10.0, 10.0, 0.0, 1.0)).xyz;
    vec3 param_9 = _224;
    vec4 _t18 = _f1(param_5, param_6, param_7, param_8, param_9);
    vec3 param_10 = vec3(0.0);
    vec3 param_11 = _188;
    vec3 param_12 = _205;
    vec3 param_13 = _198;
    vec3 param_14 = _194;
    vec4 _t19 = _f1(param_10, param_11, param_12, param_13, param_14);
    vec3 param_15 = vec3(0.0);
    vec3 param_16 = _188;
    vec3 param_17 = _212;
    vec3 param_18 = _224;
    vec3 param_19 = _215;
    vec4 _t20 = _f1(param_15, param_16, param_17, param_18, param_19);
    vec2 _398 = (((((((vec2(-4.5) * ((1.0 - _t17.x) - _t17.y)) + (vec2(5.5, -4.5) * _t17.x)) + (vec2(-4.5, 5.5) * _t17.y)) * step(0.0, _t17.w)) + ((((vec2(-4.5, 5.5) * ((1.0 - _t18.x) - _t18.y)) + (vec2(5.5, -4.5) * _t18.x)) + (vec2(5.5) * _t18.y)) * (step(_t17.w, 0.0) * step(0.0, _t18.w)))) + ((((vec2(-4.5) * ((1.0 - _t19.x) - _t19.y)) + (vec2(-4.5, 5.5) * _t19.x)) + (vec2(5.5, -4.5) * _t19.y)) * ((step(_t17.w, 0.0) * step(_t18.w, 0.0)) * step(0.0, _t19.w)))) + ((((vec2(-4.5, 5.5) * ((1.0 - _t20.x) - _t20.y)) + (vec2(5.5) * _t20.x)) + (vec2(5.5, -4.5) * _t20.y)) * (((step(_t17.w, 0.0) * step(_t18.w, 0.0)) * step(_t19.w, 0.0)) * step(0.0, _t20.w)))) + (vec2(-10000.0) * (((step(_t17.w, 0.0) * step(_t18.w, 0.0)) * step(_t19.w, 0.0)) * step(_t20.w, 0.0)));
    return _398;
}

vec2 _f0(vec2 _p0)
{
    return abs(mod(_p0 - vec2(1.0), vec2(2.0)) - vec2(1.0));
}

float _f3(vec2 _p0)
{
    return ((step(0.0, _p0.x) * step(0.0, _p0.y)) * step(_p0.x, 1.0)) * step(_p0.y, 1.0);
}

float _f5(float _p0, float _p1)
{
    vec2 _500 = fract(vec2(_p0, _p1) * 13.5170001983642578125);
    vec2 _t26 = _500 + vec2(dot(_500, _500.yx + vec2(22.5410003662109375)));
    return fract((_t26.x + _t26.y) * _t26.y);
}

vec2 _f4(float _p0, vec2 _p1, vec2 _p2, vec2 _p3, vec2 _p4, vec2 _p5, vec2 _p6)
{
    return ((((mix(_p1, _p2, vec2(_p0 * 5.0)) * step(_p0, 0.20000000298023223876953125)) + ((mix(_p2, _p3, vec2((_p0 * 5.0) - 1.0)) * (1.0 - step(_p0, 0.20000000298023223876953125))) * step(_p0, 0.4000000059604644775390625))) + ((mix(_p3, _p4, vec2((_p0 * 5.0) - 2.0)) * (1.0 - step(_p0, 0.4000000059604644775390625))) * step(_p0, 0.60000002384185791015625))) + ((mix(_p4, _p5, vec2((_p0 * 5.0) - 3.0)) * (1.0 - step(_p0, 0.60000002384185791015625))) * step(_p0, 0.800000011920928955078125))) + (mix(_p5, _p6, vec2((_p0 * 5.0) - 4.0)) * (1.0 - step(_p0, 0.800000011920928955078125)));
}

void main()
{
    if (u_skipSample == 1)
    {
        mat4 param = u_mvMat0;
        mat4 param_1 = u_pMat0;
        vec2 param_2 = uv0;
        vec2 _542 = _f2(param, param_1, param_2);
        float _547 = step(u_mirrorEdge, 0.5);
        vec2 param_3 = _542;
        vec2 _557 = (_542 * _547) + (_f0(param_3) * (1.0 - _547));
        vec2 param_4 = _557;
        gl_FragData[0] = (texture2D(u_inputTex, _557) * u_alpha) * _f3(param_4);
        return;
    }
    mat4 param_5 = u_mvMat0;
    mat4 param_6 = u_pMat0;
    vec2 param_7 = uv0;
    vec2 _582 = _f2(param_5, param_6, param_7);
    mat4 param_8 = u_mvMat1;
    mat4 param_9 = u_pMat1;
    vec2 param_10 = uv0;
    vec2 _592 = _f2(param_8, param_9, param_10);
    mat4 param_11 = u_mvMat2;
    mat4 param_12 = u_pMat2;
    vec2 param_13 = uv0;
    vec2 _602 = _f2(param_11, param_12, param_13);
    mat4 param_14 = u_mvMat3;
    mat4 param_15 = u_pMat3;
    vec2 param_16 = uv0;
    vec2 _612 = _f2(param_14, param_15, param_16);
    mat4 param_17 = u_mvMat4;
    mat4 param_18 = u_pMat4;
    vec2 param_19 = uv0;
    vec2 _622 = _f2(param_17, param_18, param_19);
    mat4 param_20 = u_mvMat5;
    mat4 param_21 = u_pMat5;
    vec2 param_22 = uv0;
    vec2 _632 = _f2(param_20, param_21, param_22);
    vec4 _t34 = vec4(0.0);
    for (float _t35 = 0.0; _t35 <= 256.0; _t35 += 1.0)
    {
        if (_t35 >= u_samples)
        {
            break;
        }
        float _t36 = _t35 / (u_samples - 1.0);
        float param_23 = _t35 + uv0.x;
        float param_24 = _t35 * uv0.y;
        float _674 = _t36;
        float _675 = _674 + ((u_dither * (_f5(param_23, param_24) - 0.5)) / u_samples);
        _t36 = _675;
        float param_25 = _675;
        vec2 param_26 = _582;
        vec2 param_27 = _592;
        vec2 param_28 = _602;
        vec2 param_29 = _612;
        vec2 param_30 = _622;
        vec2 param_31 = _632;
        vec2 _691 = _f4(param_25, param_26, param_27, param_28, param_29, param_30, param_31);
        float _693 = step(u_mirrorEdge, 0.5);
        vec2 param_32 = _691;
        vec2 _703 = (_691 * _693) + (_f0(param_32) * (1.0 - _693));
        vec2 param_33 = _703;
        _t34 += ((texture2D(u_inputTex, _703) * u_alpha) * _f3(param_33));
    }
    vec4 _718 = _t34;
    vec4 _720 = _718 / vec4(u_samples);
    _t34 = _720;
    gl_FragData[0] = _720;
}

