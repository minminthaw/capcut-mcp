precision highp float;
precision highp int;

uniform mediump int u_enableMatte;
uniform mediump sampler2D u_maskTexture;
uniform mediump int u_matteMode;
uniform mediump int u_layerType;
uniform mediump int u_hasMatte;
uniform float u_layerOpacity;
uniform mediump int u_hasBlend;
uniform mediump int u_hasBaseTexture;
uniform mediump sampler2D u_baseTexure;
uniform mediump int u_hasSourceTexture;
uniform mediump int u_hasTrs;
uniform mat4 u_mvMat;
uniform mat4 u_pMat;
uniform float u_mirrorEdge;
uniform mediump sampler2D u_sourceTexture;
uniform float u_alpha;

varying vec2 uv0;

vec4 _f1(vec3 _p0, vec3 _p1, vec3 _p2, vec3 _p3, vec3 _p4)
{
    vec3 _61 = _p3 - _p2;
    vec3 _65 = _p4 - _p2;
    vec3 _69 = cross(_p1, _65);
    float _74 = dot(_61, _69);
    if (_74 <= 1.0000000116860974230803549289703e-07)
    {
        return vec4(-1.0);
    }
    vec3 _87 = _p0 - _p2;
    float _93 = dot(_87, _69) / _74;
    if ((_93 < 0.0) || (_93 > 1.0))
    {
        return vec4(-1.0);
    }
    vec3 _107 = cross(_87, _61);
    float _113 = dot(_p1, _107) / _74;
    bool _115 = _113 < 0.0;
    bool _123;
    if (!_115)
    {
        _123 = (_93 + _113) > 1.0;
    }
    else
    {
        _123 = _115;
    }
    if (_123)
    {
        return vec4(-1.0);
    }
    return vec4(_93, _113, dot(_65, _107) / _74, 1.0);
}

vec2 _f2(mat4 _p0, mat4 _p1, vec2 _p2)
{
    vec4 _167 = _p1 * vec4((_p2 * 2.0) - vec2(1.0), 0.0, 1.0);
    vec4 _t13 = _167;
    vec3 _184 = normalize((_167.xyz / vec3(_t13.w)) - vec3(0.0));
    vec3 _187 = (_p0 * vec4(10.0, -10.0, 0.0, 1.0)).xyz;
    vec3 _190 = _187 + vec3(9.9999997473787516355514526367188e-06, 0.0, 0.0);
    vec3 _192 = (_p0 * vec4(-10.0, 10.0, 0.0, 1.0)).xyz;
    vec3 _194 = _192 + vec3(0.0, 9.9999997473787516355514526367188e-06, 0.0);
    vec3 param = vec3(0.0);
    vec3 param_1 = _184;
    vec3 _201 = (_p0 * vec4(-10.0, -10.0, 0.0, 1.0)).xyz;
    vec3 param_2 = _201;
    vec3 param_3 = _190;
    vec3 param_4 = _194;
    vec4 _t17 = _f1(param, param_1, param_2, param_3, param_4);
    vec3 _208 = _192 - vec3(9.9999997473787516355514526367188e-06, 0.0, 0.0);
    vec3 _211 = _187 - vec3(0.0, 9.9999997473787516355514526367188e-06, 0.0);
    vec3 param_5 = vec3(0.0);
    vec3 param_6 = _184;
    vec3 param_7 = _208;
    vec3 param_8 = _211;
    vec3 _220 = (_p0 * vec4(10.0, 10.0, 0.0, 1.0)).xyz;
    vec3 param_9 = _220;
    vec4 _t18 = _f1(param_5, param_6, param_7, param_8, param_9);
    vec3 param_10 = vec3(0.0);
    vec3 param_11 = _184;
    vec3 param_12 = _201;
    vec3 param_13 = _194;
    vec3 param_14 = _190;
    vec4 _t19 = _f1(param_10, param_11, param_12, param_13, param_14);
    vec3 param_15 = vec3(0.0);
    vec3 param_16 = _184;
    vec3 param_17 = _208;
    vec3 param_18 = _220;
    vec3 param_19 = _211;
    vec4 _t20 = _f1(param_15, param_16, param_17, param_18, param_19);
    vec2 _394 = (((((((vec2(-4.5) * ((1.0 - _t17.x) - _t17.y)) + (vec2(5.5, -4.5) * _t17.x)) + (vec2(-4.5, 5.5) * _t17.y)) * step(0.0, _t17.w)) + ((((vec2(-4.5, 5.5) * ((1.0 - _t18.x) - _t18.y)) + (vec2(5.5, -4.5) * _t18.x)) + (vec2(5.5) * _t18.y)) * (step(_t17.w, 0.0) * step(0.0, _t18.w)))) + ((((vec2(-4.5) * ((1.0 - _t19.x) - _t19.y)) + (vec2(-4.5, 5.5) * _t19.x)) + (vec2(5.5, -4.5) * _t19.y)) * ((step(_t17.w, 0.0) * step(_t18.w, 0.0)) * step(0.0, _t19.w)))) + ((((vec2(-4.5, 5.5) * ((1.0 - _t20.x) - _t20.y)) + (vec2(5.5) * _t20.x)) + (vec2(5.5, -4.5) * _t20.y)) * (((step(_t17.w, 0.0) * step(_t18.w, 0.0)) * step(_t19.w, 0.0)) * step(0.0, _t20.w)))) + (vec2(-10000.0) * (((step(_t17.w, 0.0) * step(_t18.w, 0.0)) * step(_t19.w, 0.0)) * step(_t20.w, 0.0)));
    return _394;
}

vec2 _f4(vec2 _p0)
{
    return abs(mod(_p0 - vec2(1.0), vec2(2.0)) - vec2(1.0));
}

float _f3(vec2 _p0)
{
    vec2 _t26 = step(vec2(0.0), _p0) * step(_p0, vec2(1.0));
    return _t26.x * _t26.y;
}

float _f0(vec3 _p0)
{
    return dot(_p0, vec3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625));
}

vec4 _f5(vec4 _p0)
{
    vec4 _t27 = vec4(0.0);
    if (u_enableMatte == 1)
    {
        _t27 = texture2D(u_maskTexture, uv0);
    }
    float _t28 = _t27.w;
    if (u_matteMode == 1)
    {
        vec3 param = _t27.xyz;
        _t28 = _f0(param);
    }
    else
    {
        if (u_matteMode == 2)
        {
            _t28 = 1.0 - _t27.w;
        }
        else
        {
            if (u_matteMode == 3)
            {
                vec3 param_1 = _t27.xyz;
                _t28 = 1.0 - _f0(param_1);
            }
        }
    }
    return _p0 * _t28;
}

vec4 _f6(inout vec4 _p0, inout vec4 _p1)
{
    float _480 = _p0.w;
    vec4 _482 = _p0;
    vec3 _485 = _482.xyz / vec3(max(_480, 9.9999997473787516355514526367188e-06));
    _p0.x = _485.x;
    _p0.y = _485.y;
    _p0.z = _485.z;
    float _494 = _p1.w;
    vec4 _496 = _p1;
    vec3 _499 = _496.xyz / vec3(max(_494, 9.9999997473787516355514526367188e-06));
    _p1.x = _499.x;
    _p1.y = _499.y;
    _p1.z = _499.z;
    vec4 _t29 = _p1;
    _t29.x = _p0.xyz.x;
    _t29.y = _p0.xyz.y;
    _t29.z = _p0.xyz.z;
    vec4 _t30 = vec4(0.0);
    if (u_layerType == 1)
    {
        float _t31 = 1.0;
        if (u_hasMatte == 1)
        {
            vec4 param = vec4(1.0);
            _t31 = _f5(param).w;
        }
        vec4 _547 = mix(_p1, vec4(_t29.xyz, _p0.w), vec4(u_layerOpacity * _t31));
        _t30 = _547;
        float _549 = _t30.w;
        vec3 _552 = _547.xyz * _549;
        _t30.x = _552.x;
        _t30.y = _552.y;
        _t30.z = _552.z;
    }
    else
    {
        vec3 _587 = (((_p1.xyz * _p1.w) * (1.0 - _p0.w)) + ((_p0.xyz * _p0.w) * (1.0 - _p1.w))) + (_t29.xyz * (_p0.w * _p1.w));
        _t30.x = _587.x;
        _t30.y = _587.y;
        _t30.z = _587.z;
        _t30.w = _p0.w + (_p1.w * (1.0 - _p0.w));
    }
    return _t30;
}

void main()
{
    vec4 _t32 = vec4(0.0);
    bool _610 = u_hasBlend == 1;
    if (_610)
    {
        if (u_hasBaseTexture == 1)
        {
            _t32 = texture2D(u_baseTexure, uv0);
        }
        if (u_hasSourceTexture == 0)
        {
            gl_FragData[0] = _t32;
            return;
        }
    }
    vec4 _t33 = vec4(0.0);
    if (u_hasTrs == 1)
    {
        mat4 param = u_mvMat;
        mat4 param_1 = u_pMat;
        vec2 param_2 = uv0;
        vec2 _648 = _f2(param, param_1, param_2);
        float _652 = step(u_mirrorEdge, 0.5);
        vec2 param_3 = _648;
        vec2 _662 = (_648 * _652) + (_f4(param_3) * (1.0 - _652));
        vec2 param_4 = _662;
        _t33 = (texture2D(u_sourceTexture, _662) * u_alpha) * _f3(param_4);
    }
    else
    {
        if (u_hasSourceTexture == 1)
        {
            _t33 = texture2D(u_sourceTexture, uv0);
        }
    }
    if ((u_layerType != 1) && (u_hasMatte == 1))
    {
        vec4 param_5 = _t33;
        _t33 = _f5(param_5);
    }
    if (_610)
    {
        vec4 param_6 = _t33;
        vec4 param_7 = _t32;
        vec4 _700 = _f6(param_6, param_7);
        _t33 = _700;
    }
    gl_FragData[0] = _t33;
}

