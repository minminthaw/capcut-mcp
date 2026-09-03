precision highp float;
precision highp int;

uniform float u_intensity;
uniform float u_angle;
uniform float u_scaleX;
uniform float u_scaleY;
uniform float u_quality;
uniform float u_regionIns;
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

float _f1(vec2 _p0)
{
    return step(dot(_p0, _p0), 121.0);
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
    mat2 _87 = _f0(param);
    vec2 _99 = (vec2(2.0) * vec2(u_scaleX, u_scaleY)) * vec2(_p2);
    vec2 _103 = vec2(1.0) / _p3;
    float _111 = mix(2.0, 0.5, u_intensity) * mix(2.0, 1.0, u_quality);
    float _122 = max(5.0, (12.0 / _111) * mix(0.60000002384185791015625, 1.0, u_quality));
    float _127 = mix(0.699999988079071044921875, 1.0, u_regionIns);
    for (float _t14 = 0.0; _t14 < 30.0; _t14 += 1.0)
    {
        if ((_t14 > _122) || (u_intensity < 0.300000011920928955078125))
        {
            break;
        }
        for (float _t15 = 0.0; _t15 < 30.0; _t15 += 1.0)
        {
            if (_t15 > _122)
            {
                break;
            }
            vec2 _172 = vec2(mix(-11.0, 11.0, _t14 / _122), mix(-11.0, 11.0, _t15 / _122));
            vec2 param_1 = _172;
            if (_f1(param_1) < 0.5)
            {
                continue;
            }
            mediump vec4 _192 = texture2D(_p0, _p1 - ((((_172 * 0.5) * _99) * _87) * _103));
            _t4 = max(_t4, _192 * _127);
            vec4 _209 = ((pow(_192, vec4(9.0)) * 539.45001220703125) + vec4(0.4000000059604644775390625)) * u_regionIns;
            _t6 += (_209 * _192);
            _t7 += _209;
        }
    }
    float _234 = max(15.0, (34.0 / _111) * mix(0.5, 1.0, clamp(u_quality * 1.5, 0.0, 1.0)));
    float param_2 = 6.280000209808349609375 / _234;
    mat2 _240 = _f0(param_2);
    vec2 _t20 = vec2(11.0, 0.0);
    for (float _t21 = 0.0; _t21 < 70.0; _t21 += 1.0)
    {
        if (_t21 > _234)
        {
            break;
        }
        vec2 _259 = _t20;
        vec2 _260 = _259 * _240;
        _t20 = _260;
        mediump vec4 _273 = texture2D(_p0, _p1 - ((((_260 * 0.5) * _99) * _87) * _103));
        _t4 = max(_t4, _273);
        vec4 _282 = (pow(_273, vec4(9.0)) * 539.45001220703125) + vec4(0.4000000059604644775390625);
        _t6 += (_282 * _273);
        _t7 += _282;
    }
    vec4 _299 = clamp(_t6 / _t7, vec4(0.0), vec4(1.0));
    return vec4(mix(_299, _t4, clamp(_299 * u_lightIns, vec4(0.0), vec4(1.0))));
}

void main()
{
    vec2 param = v_uv;
    float param_1 = u_blurSize;
    vec2 param_2 = (vec2(u_baseTexWidth, u_baseTexHeight) / vec2(min(u_baseTexWidth, u_baseTexHeight))) * 720.0;
    gl_FragData[0] = _f2(u_inputTex, param, param_1, param_2);
}

