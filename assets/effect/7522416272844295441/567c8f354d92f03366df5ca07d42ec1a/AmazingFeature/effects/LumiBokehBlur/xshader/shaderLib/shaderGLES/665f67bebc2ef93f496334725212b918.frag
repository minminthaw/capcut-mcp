precision highp float;
precision highp int;

uniform float u_intensity;
uniform float u_angle;
uniform float u_scaleX;
uniform float u_scaleY;
uniform float u_quality;
uniform mediump int posVecNum;
uniform vec2 posVec[500];
uniform float u_regionIns;
uniform mediump sampler2D u_maskTex;
uniform float u_lightIns;
uniform float u_baseTexWidth;
uniform float u_baseTexHeight;
uniform mediump sampler2D u_inputTex;
uniform float u_blurSize;

varying vec2 v_uv;

mat2 _f0(float _p0)
{
    float _32 = sin(_p0);
    float _35 = cos(_p0);
    return mat2(vec2(_35, -_32), vec2(_32, _35));
}

vec2 _f1(vec2 _p0)
{
    return abs(mod(_p0 + vec2(1.0), vec2(2.0)) - vec2(1.0));
}

vec4 _f2(mediump sampler2D _p0, vec2 _p1, float _p2, vec2 _p3)
{
    if (u_intensity < 0.00999999977648258209228515625)
    {
        return texture2D(_p0, _p1);
    }
    vec4 _t4 = vec4(0.0);
    vec4 _t6 = vec4(0.0);
    vec4 _t7 = vec4(9.9999997473787516355514526367188e-05);
    float param = u_angle;
    mat2 _91 = _f0(param);
    vec2 _102 = (vec2(2.0) * vec2(u_scaleX, u_scaleY)) * vec2(_p2);
    vec2 _106 = vec2(1.0) / _p3;
    for (mediump int _t12 = 0; _t12 < posVecNum; _t12++)
    {
        vec2 param_1 = _p1 + ((((((vec2(1.0) - posVec[_t12]) - vec2(0.5)) * _102) * _91) * vec2(11.0)) * _106);
        mediump vec4 _162 = texture2D(_p0, _f1(param_1));
        _t4 = max(_t4, _162);
        vec4 _174 = (pow(_162, vec4(9.0)) * 539.45001220703125) + vec4(0.4000000059604644775390625);
        _t6 += (_174 * _162);
        _t7 += _174;
    }
    float _196 = max(5.0, (12.0 / (mix(2.0, 0.5, u_intensity) * mix(2.0, 1.0, u_quality))) * mix(0.60000002384185791015625, 1.0, u_quality));
    float _201 = mix(0.699999988079071044921875, 1.0, u_regionIns);
    for (float _t18 = 0.0; _t18 < 30.0; _t18 += 1.0)
    {
        if ((_t18 > _196) || (u_intensity < 0.300000011920928955078125))
        {
            break;
        }
        for (float _t19 = 0.0; _t19 < 30.0; _t19 += 1.0)
        {
            if (_t19 > _196)
            {
                break;
            }
            float _239 = _t18 / _196;
            float _243 = _t19 / _196;
            if (texture2D(u_maskTex, vec2(mix(0.0, 1.0, _239), mix(0.0, 1.0, _243))).x < 0.5)
            {
                continue;
            }
            mediump vec4 _278 = texture2D(_p0, _p1 - ((((vec2(mix(-11.0, 11.0, _239), mix(-11.0, 11.0, _243)) * 0.5) * _102) * _91) * _106));
            _t4 = max(_t4, _278 * _201);
            vec4 _292 = ((pow(_278, vec4(9.0)) * 539.45001220703125) + vec4(0.4000000059604644775390625)) * u_regionIns;
            _t6 += (_292 * _278);
            _t7 += _292;
        }
    }
    vec4 _311 = clamp(_t6 / _t7, vec4(0.0), vec4(1.0));
    return vec4(mix(_311, _t4, clamp(_311 * u_lightIns, vec4(0.0), vec4(1.0))));
}

void main()
{
    vec2 param = v_uv;
    float param_1 = u_blurSize;
    vec2 param_2 = (vec2(u_baseTexWidth, u_baseTexHeight) / vec2(min(u_baseTexWidth, u_baseTexHeight))) * 720.0;
    gl_FragData[0] = _f2(u_inputTex, param, param_1, param_2);
}

