precision highp float;
precision highp int;

uniform mediump sampler2D inputTexture;
uniform float glowFromAlpha;
uniform float threshold;
uniform vec3 color;

varying vec2 v_uv;

float _f0(float _p0, float _p1)
{
    float _17;
    if (_p0 <= _p1)
    {
        _17 = 0.0;
    }
    else
    {
        _17 = (_p0 - _p1) / (1.0 - _p1);
    }
    return _17;
}

void main()
{
    mediump vec4 _44 = texture2D(inputTexture, v_uv);
    vec4 _t0 = _44;
    vec3 _53 = mix(_44.xyz, vec3(1.0), vec3(glowFromAlpha));
    _t0.x = _53.x;
    _t0.y = _53.y;
    _t0.z = _53.z;
    float param = _t0.x;
    float param_1 = threshold + color.x;
    float param_2 = _t0.y;
    float param_3 = threshold + color.y;
    float param_4 = _t0.z;
    float param_5 = threshold + color.z;
    gl_FragData[0] = _t0 * (((_f0(param, param_1) + _f0(param_2, param_3)) + _f0(param_4, param_5)) / max((_t0.x + _t0.y) + _t0.z, 9.9999999747524270787835121154785e-07));
}

