precision highp float;
precision highp int;

uniform float u_Cycle;
uniform vec4 u_ScreenParams;
uniform vec2 u_Offset;
uniform vec2 u_Scale;
uniform float u_Rotate;
uniform float u_Complexity;
uniform float u_Evolution;
uniform float u_SubImpact;
uniform float u_SubScale;
uniform float u_SubRotate;
uniform vec2 u_SubOffset;
uniform float u_Brightness;
uniform float u_Contrast;
uniform mediump sampler2D blurImageTexture;
uniform mediump sampler2D inputImageTexture;
uniform float blurSize;
uniform float edgeOffset;
uniform float edgeSmooth;

varying vec2 v_uv;

vec2 _f2(inout vec2 _p0, float _p1)
{
    _p0.y *= (u_ScreenParams.y / u_ScreenParams.x);
    float _209 = sin(_p1);
    float _212 = cos(_p1);
    _p0 -= vec2(0.5);
    _p0 = mat2(vec2(_212, _209), vec2(-_209, _212)) * _p0;
    _p0 += vec2(0.5);
    _p0.y *= (u_ScreenParams.x / u_ScreenParams.y);
    return _p0;
}

float _f0(vec2 _p0)
{
    vec2 _50 = fract(_p0 * 1324.5179443359375);
    vec2 _t0 = _50 + vec2(dot(_50, _50.yx + vec2(22.5410003662109375)));
    return fract((_t0.x + _t0.y) * _t0.y);
}

vec2 _f1(vec2 _p0, vec2 _p1)
{
    vec2 param = _p0;
    float _78 = _f0(param);
    float _85 = _p1.x + _78;
    float _88 = floor(_85);
    float _t4 = _88;
    float _t5 = _88 + 1.0;
    if (u_Cycle >= 2.0)
    {
        _t4 = floor(mod(_85, u_Cycle));
        _t5 = floor(mod(_85 + 1.0, u_Cycle));
    }
    vec2 _123 = fract(_p0 * ((34.532001495361328125 + (_t4 * 4.412000179290771484375)) + (_p1.y * 0.80309998989105224609375)));
    vec2 _133 = _123 + vec2(dot(_123, _123.yx + vec2(15.4340000152587890625)));
    vec2 _137 = _133.yx;
    vec2 _146 = vec2(_78);
    vec2 _160 = fract(_p0 * ((34.532001495361328125 + (_t5 * 4.412000179290771484375)) + (_p1.y * 0.80309998989105224609375)));
    vec2 _169 = _160 + vec2(dot(_160, _160.yx + vec2(15.4340000152587890625)));
    vec2 _173 = _169.yx;
    return (mix(fract((((_133 + _137) + vec2(0.5230000019073486328125)) * _137) + _146), fract((((_169 + _173) + vec2(0.5230000019073486328125)) * _173) + _146), vec2(fract(_85))) * 2.0) - vec2(1.0);
}

float _f3(vec2 _p0, vec2 _p1)
{
    vec2 _259 = (vec2(720.0) * u_ScreenParams.xy) / vec2(min(u_ScreenParams.x, u_ScreenParams.y));
    vec2 _267 = floor((_p0 * _259) / vec2(100.0));
    vec2 _274 = fract((_p0 * _259) / vec2(100.0));
    vec2 param = _267 + vec2(0.0);
    vec2 param_1 = _p1;
    vec2 param_2 = _267 + vec2(1.0, 0.0);
    vec2 param_3 = _p1;
    vec2 param_4 = _267 + vec2(0.0, 1.0);
    vec2 param_5 = _p1;
    vec2 param_6 = _267 + vec2(1.0);
    vec2 param_7 = _p1;
    vec2 _t21 = ((_274 * _274) * _274) * ((_274 * ((_274 * 6.0) - vec2(15.0))) + vec2(10.0));
    return (mix(mix(dot(_f1(param, param_1), _274 - vec2(0.0)), dot(_f1(param_2, param_3), _274 - vec2(1.0, 0.0)), _t21.x), mix(dot(_f1(param_4, param_5), _274 - vec2(0.0, 1.0)), dot(_f1(param_6, param_7), _274 - vec2(1.0)), _t21.x), _t21.y) * 0.5) + 0.5;
}

float _f4(inout vec2 _p0, float _p1, float _p2, float _p3, float _p4, float _p5, float _p6, vec2 _p7)
{
    vec2 _384 = (vec2(720.0) * u_ScreenParams.xy) / vec2(min(u_ScreenParams.x, u_ScreenParams.y));
    float _387 = floor(_p1);
    float _390 = fract(_p1);
    vec2 param = _p0;
    vec2 param_1 = vec2(_p2, 1.0 + _p6);
    float _t29 = 1.0;
    float _t30 = _p3;
    float _t31 = _f3(param, param_1) * 1.0;
    for (float _t32 = 2.0; _t32 <= 10.0; _t32 += 1.0)
    {
        if (_t32 > _387)
        {
            break;
        }
        _p0 -= (_p7 / _384);
        vec2 param_2 = _p0;
        float param_3 = (_p5 * 3.141592502593994140625) / 180.0;
        vec2 _438 = _f2(param_2, param_3);
        _p0 = _438;
        _p0 *= _p4;
        vec2 param_4 = _p0;
        vec2 param_5 = vec2(_p2, 1.0 + _p6);
        float _450 = _t30;
        _t29 += _450;
        _t30 = _450 * _p3;
        _t31 += (_f3(param_4, param_5) * _450);
    }
    _p0 -= (_p7 / _384);
    vec2 param_6 = _p0;
    float param_7 = (_p5 * 3.141592502593994140625) / 180.0;
    vec2 _474 = _f2(param_6, param_7);
    _p0 = _474;
    _p0 *= _p4;
    vec2 param_8 = _p0;
    vec2 param_9 = vec2(_p2, 1.0 + _p6);
    float _493 = _t29;
    float _494 = _493 + (_t30 * _390);
    _t29 = _494;
    float _496 = _t31;
    float _500 = (_496 + ((_f3(param_8, param_9) * _t30) * _390)) / _494;
    _t31 = _500;
    return clamp(_500, 0.0, 1.0);
}

float _f5(inout float _p0, float _p1, float _p2)
{
    _p0 += _p1;
    _p0 = ((_p0 - 0.5) * (_p2 + 1.0)) + 0.5;
    return _p0;
}

void main()
{
    vec2 param = (((v_uv - u_Offset) - vec2(0.5)) * (vec2(1.0) / u_Scale)) + vec2(0.5);
    float param_1 = (u_Rotate * 3.141592502593994140625) / 180.0;
    vec2 _545 = _f2(param, param_1);
    vec2 param_2 = _545 - vec2(10.0);
    float param_3 = clamp(u_Complexity, 1.0, 10.0);
    float param_4 = u_Evolution;
    float param_5 = u_SubImpact;
    float param_6 = 100.0 / u_SubScale;
    float param_7 = u_SubRotate;
    float param_8 = 0.0;
    vec2 param_9 = u_SubOffset;
    float _573 = _f4(param_2, param_3, param_4, param_5, param_6, param_7, param_8, param_9);
    float _t34 = _573;
    float param_10 = _573;
    float param_11 = u_Brightness;
    float param_12 = u_Contrast;
    float _582 = _f5(param_10, param_11, param_12);
    _t34 = clamp(_582, 0.0, 1.0);
    vec4 _t35 = texture2D(blurImageTexture, v_uv);
    vec4 _t36 = texture2D(inputImageTexture, v_uv);
    if (blurSize < 1.0)
    {
        gl_FragData[0] = _t36;
        return;
    }
    float _609 = _t35.w;
    vec4 _613 = _t35;
    vec3 _616 = _613.xyz / vec3(_609 + 0.001000000047497451305389404296875);
    _t35.x = _616.x;
    _t35.y = _616.y;
    _t35.z = _616.z;
    float _625 = _t36.w;
    vec4 _627 = _t36;
    vec3 _630 = _627.xyz / vec3(_625 + 0.001000000047497451305389404296875);
    _t36.x = _630.x;
    _t36.y = _630.y;
    _t36.z = _630.z;
    float _637 = _t34;
    float _641 = mix(_637, 1.0, max(_t35.w, 0.001000000047497451305389404296875));
    _t34 = _641;
    _t35.w *= _641;
    float _652 = ((edgeOffset - 0.5) * 0.5) + 0.5;
    float _658 = 0.0 + (edgeSmooth * _652);
    _t35.w = smoothstep(_658, max(_658, 1.0 - (edgeSmooth * (1.0 - _652))), _t35.w);
    vec4 _673 = _t35;
    float _678 = _t35.w;
    vec3 _683 = mix(_673.xyz, _t36.xyz, vec3(_678 * _t36.w));
    _t35.x = _683.x;
    _t35.y = _683.y;
    _t35.z = _683.z;
    float _691 = _t35.w;
    vec4 _692 = _t35;
    vec3 _694 = _692.xyz * _691;
    _t35.x = _694.x;
    _t35.y = _694.y;
    _t35.z = _694.z;
    gl_FragData[0] = _t35;
}

