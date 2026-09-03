precision highp float;
precision highp int;

uniform mediump sampler2D u_inputTexture;
uniform mediump sampler2D u_maskTex;
uniform mediump sampler2D u_skinLut;
uniform mediump sampler2D u_bgLut;
uniform float u_skinIntensity;
uniform float u_bgIntensity;

varying vec2 v_uv;

vec3 _f0(mediump sampler2D _p0, inout vec3 _p1)
{
    _p1 *= 63.0;
    vec2 _33 = vec2(floor(_p1.z), ceil(_p1.z));
    vec2 _t1 = _33;
    vec2 _38 = floor(_33 * 0.125);
    vec4 _t4 = (vec4(_33 - (_38 * 8.0), _38).xzyw * 0.125) + vec4(((_p1.xy + vec2(0.5)) * 0.001953125).xyxy);
    return mix(texture2D(_p0, vec2(_t4.x, _t4.y)).xyz, texture2D(_p0, vec2(_t4.z, _t4.w)).xyz, vec3(_p1.z - _t1.x));
}

void main()
{
    mediump vec4 _111 = texture2D(u_inputTexture, v_uv);
    vec4 _t8 = _111;
    vec4 _t9 = texture2D(u_maskTex, vec2(v_uv.x, 1.0 - v_uv.y));
    vec3 _139 = (_111 * _t9.w).xyz;
    vec3 param = _139;
    vec3 _140 = _f0(u_skinLut, param);
    vec3 _145 = (_111 * (1.0 - _t9.w)).xyz;
    vec3 param_1 = _145;
    vec3 _146 = _f0(u_bgLut, param_1);
    gl_FragData[0] = vec4(mix(_139, _140, vec3(u_skinIntensity)) + mix(_145, _146, vec3(u_bgIntensity)), _t8.w);
}

