precision highp float;
precision highp int;

uniform float uniAlpha;
uniform mediump sampler2D inputImageTexture;
uniform mediump sampler2D inputImageTexture2;

varying vec2 v_uv;

vec4 _f0(mediump sampler2D _p0, vec4 _p1, float _p2)
{
    vec4 _t0 = _p1;
    float _27 = _t0.z * 63.0;
    float _32 = floor(_27);
    vec2 _t2;
    _t2.y = floor(_32 / 8.0);
    _t2.x = _32 - (_t2.y * 8.0);
    float _48 = ceil(_27);
    vec2 _t3;
    _t3.y = floor(_48 / 8.0);
    _t3.x = _48 - (_t3.y * 8.0);
    vec2 _t4;
    _t4.x = (((_t2.x * 1.0) / 8.0) + 0.0009765625) + (0.123046875 * _t0.x);
    _t4.y = (((_t2.y * 1.0) / 8.0) + 0.0009765625) + (0.123046875 * _t0.y);
    vec2 _t5;
    _t5.x = (((_t3.x * 1.0) / 8.0) + 0.0009765625) + (0.123046875 * _t0.x);
    _t5.y = (((_t3.y * 1.0) / 8.0) + 0.0009765625) + (0.123046875 * _t0.y);
    _t4.y = 1.0 - _t4.y;
    _t5.y = 1.0 - _t5.y;
    return mix(_p1, vec4(mix(texture2D(_p0, _t4), texture2D(_p0, _t5), vec4(fract(_27))).xyz, _t0.w), vec4(_p2));
}

void main()
{
    if (uniAlpha < 9.9999997473787516355514526367188e-06)
    {
        gl_FragData[0] = texture2D(inputImageTexture, v_uv);
        return;
    }
    mediump vec4 _164 = texture2D(inputImageTexture, v_uv);
    vec4 _t9 = _164;
    vec4 param = _164;
    float param_1 = uniAlpha;
    vec4 _171 = _f0(inputImageTexture2, param, param_1);
    vec4 _t10 = _171;
    vec3 _179 = mix(_164.xyz, _171.xyz, vec3(_t9.w));
    _t10.x = _179.x;
    _t10.y = _179.y;
    _t10.z = _179.z;
    _t10.w = _t9.w;
    gl_FragData[0] = _t10;
}

