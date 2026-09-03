precision highp float;
precision highp int;

uniform float u_intensity;
uniform mediump int u_starLineNum;
uniform float u_starShapeIns;
uniform float u_scaleX;
uniform float u_scaleY;
uniform float u_quality;
uniform float u_regionIns;
uniform float u_angle;
uniform float u_lightIns;
uniform float u_baseTexWidth;
uniform float u_baseTexHeight;
uniform mediump sampler2D u_inputTex;
uniform float u_blurSize;

varying vec2 v_uv;

mat2 _f0(float _p0)
{
    float _28 = sin(_p0);
    float _31 = cos(_p0);
    return mat2(vec2(_31, -_28), vec2(_28, _31));
}

vec4 _f1(mediump sampler2D _p0, vec2 _p1, float _p2, vec2 _p3)
{
    if (u_intensity < 0.00999999977648258209228515625)
    {
        return texture2D(_p0, _p1);
    }
    vec4 _t6 = vec4(0.0);
    vec4 _t8 = vec4(0.0);
    vec4 _t9 = vec4(9.9999997473787516355514526367188e-05);
    vec2 _91 = (vec2(2.0) * vec2(u_scaleX, u_scaleY)) * vec2(_p2);
    vec2 _95 = vec2(1.0) / _p3;
    float _114 = max(2.0, floor(4.0 / (mix(1.5, 0.5, u_intensity) * mix(3.5, 1.0, pow(u_quality, 0.60000002384185791015625)))));
    float _119 = mix(0.699999988079071044921875, 1.0, u_regionIns);
    float param = u_angle;
    mat2 _129 = _f0(param);
    vec2 _139 = (vec2(0.0, 0.75) * floor(8.0)) / vec2(floor(_114));
    vec2 _t18 = _139;
    mediump float _142 = float(u_starLineNum);
    float param_1 = (-3.141590118408203125) / _142;
    vec2 _t20 = _139 * _f0(param_1);
    float param_2 = 3.141590118408203125 / _142;
    vec2 _t21 = _t18 * _f0(param_2);
    for (mediump int _t22 = 0; _t22 < u_starLineNum; _t22++)
    {
        for (float _t23 = 0.0; _t23 < _114; _t23 += 1.0)
        {
            float _184 = ceil(u_starShapeIns * (_114 - _t23));
            for (float _t25 = 0.0; _t25 <= _184; _t25 += 1.0)
            {
                if (((_t22 > 0) && (_t23 < 0.100000001490116119384765625)) && (_t25 < 0.100000001490116119384765625))
                {
                    continue;
                }
                mediump vec4 _234 = texture2D(_p0, _p1 - (((((_t18 * _t23) + (_t20 * (((u_starShapeIns * (_114 - _t23)) / (_184 + 1.0)) * _t25))) * _91) * _129) * _95));
                float _241 = step(_t25, _184 - 0.5);
                _t6 = max(_t6, _234 * mix(1.0, _119, _241));
                vec4 _261 = ((pow(_234, vec4(9.0)) * 539.45001220703125) + vec4(0.4000000059604644775390625)) * mix(1.0, u_regionIns, _241);
                _t8 += (_261 * _234);
                _t9 += _261;
            }
        }
        for (float _t28 = 1.0; _t28 < _114; _t28 += 1.0)
        {
            float _289 = ceil(u_starShapeIns * (_114 - _t28));
            for (float _t30 = 1.0; _t30 <= _289; _t30 += 1.0)
            {
                mediump vec4 _327 = texture2D(_p0, _p1 - (((((_t18 * _t28) + (_t21 * (((u_starShapeIns * (_114 - _t28)) / (_289 + 1.0)) * _t30))) * _91) * _129) * _95));
                float _334 = step(_t30, _289 - 0.5);
                _t6 = max(_t6, _327 * mix(1.0, _119, _334));
                vec4 _351 = ((pow(_327, vec4(9.0)) * 539.45001220703125) + vec4(0.4000000059604644775390625)) * mix(1.0, u_regionIns, _334);
                _t8 += (_351 * _327);
                _t9 += _351;
            }
        }
        mediump vec4 _379 = texture2D(_p0, _p1 - ((((_t18 * (_114 - 0.20000000298023223876953125)) * _91) * _129) * _95));
        _t6 = max(_t6, _379);
        vec4 _388 = (pow(_379, vec4(9.0)) * 539.45001220703125) + vec4(0.4000000059604644775390625);
        _t8 += (_388 * _379);
        _t9 += _388;
        float _399 = 6.28318023681640625 / _142;
        float param_3 = _399;
        _t18 *= _f0(param_3);
        float param_4 = _399;
        _t20 *= _f0(param_4);
        float param_5 = _399;
        _t21 *= _f0(param_5);
    }
    vec4 _425 = clamp(_t8 / _t9, vec4(0.0), vec4(1.0));
    return vec4(mix(_425, _t6, clamp(_425 * u_lightIns, vec4(0.0), vec4(1.0))));
}

void main()
{
    vec2 param = v_uv;
    float param_1 = u_blurSize;
    vec2 param_2 = (vec2(u_baseTexWidth, u_baseTexHeight) / vec2(min(u_baseTexWidth, u_baseTexHeight))) * 720.0;
    gl_FragData[0] = _f1(u_inputTex, param, param_1, param_2);
}

