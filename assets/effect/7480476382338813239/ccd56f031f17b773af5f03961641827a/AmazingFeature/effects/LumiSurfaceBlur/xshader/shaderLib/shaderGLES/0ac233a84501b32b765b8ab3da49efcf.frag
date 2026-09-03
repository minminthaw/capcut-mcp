precision highp float;
precision highp int;

uniform vec4 u_ScreenParams;
uniform mediump sampler2D u_inputTexture;
uniform float u_radius;
uniform float u_blurStep;
uniform float u_intensity;

varying vec2 uv;

vec3 _f0(vec3 _p0, vec3 _p1, float _p2)
{
    return max(vec3(1.0) - (abs(_p0 - _p1) / vec3(2.5 * _p2)), vec3(0.0));
}

vec4 _f1(mediump sampler2D _p0, vec2 _p1, float _p2, float _p3, float _p4)
{
    vec2 _55 = vec2(_p3, _p3) / u_ScreenParams.xy;
    mediump vec4 _60 = texture2D(_p0, _p1);
    vec4 _t1 = _60;
    vec4 _t2 = vec4(0.0);
    vec3 _t3 = vec3(0.0);
    float _68 = -floor(_p2);
    for (float _t4 = _68; _t4 <= 7.0100002288818359375; _t4 += 1.0)
    {
        if (_t4 > _p2)
        {
            break;
        }
        vec3 _96 = _60.xyz;
        vec3 param = _96;
        vec3 _99 = texture2D(_p0, _p1 + (vec2(_t4, 0.0) * _55)).xyz;
        vec3 param_1 = _99;
        float param_2 = _p4;
        vec3 _102 = _f0(param, param_1, param_2);
        vec4 _107 = _t2;
        vec3 _109 = _107.xyz + (_99 * _102);
        _t2.x = _109.x;
        _t2.y = _109.y;
        _t2.z = _109.z;
        _t3 += _102;
        for (float _t7 = 1.0; _t7 <= 7.0100002288818359375; _t7 += 1.0)
        {
            if (_t7 > _p2)
            {
                break;
            }
            vec3 param_3 = _96;
            vec3 _168 = texture2D(_p0, _p1 + (vec2(_t4, _t7) * _55)).xyz;
            vec3 param_4 = _168;
            float param_5 = _p4;
            vec3 _171 = _f0(param_3, param_4, param_5);
            vec3 param_6 = _96;
            vec3 _178 = texture2D(_p0, _p1 + (vec2(_t4, -_t7) * _55)).xyz;
            vec3 param_7 = _178;
            float param_8 = _p4;
            vec3 _181 = _f0(param_6, param_7, param_8);
            vec4 _186 = _t2;
            vec3 _188 = _186.xyz + (_168 * _171);
            _t2.x = _188.x;
            _t2.y = _188.y;
            _t2.z = _188.z;
            vec4 _199 = _t2;
            vec3 _201 = _199.xyz + (_178 * _181);
            _t2.x = _201.x;
            _t2.y = _201.y;
            _t2.z = _201.z;
            _t3 += (_171 + _181);
        }
    }
    return vec4(clamp(_t2.xyz / _t3, vec3(0.0), vec3(1.0)), _t1.w);
}

void main()
{
    vec2 param = uv;
    float param_1 = u_radius;
    float param_2 = u_blurStep;
    float param_3 = u_intensity;
    gl_FragData[0] = vec4(_f1(u_inputTexture, param, param_1, param_2, param_3));
}

