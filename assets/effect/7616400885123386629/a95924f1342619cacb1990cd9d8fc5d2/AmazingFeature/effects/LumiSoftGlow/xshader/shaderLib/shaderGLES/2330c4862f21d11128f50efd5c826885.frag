precision highp float;
precision highp int;

uniform mediump sampler2D u_inputTexture;
uniform float u_exposure;
uniform mediump sampler2D u_glowTexture;
uniform vec3 u_glowColor;
uniform mediump int u_displayGlow;

varying vec2 v_uv;

vec4 _f0(vec4 _p0, vec4 _p1)
{
    return (_p0 + _p1) - (_p0 * _p1);
}

void main()
{
    mediump vec4 _33 = texture2D(u_inputTexture, v_uv);
    vec4 _t1 = vec4(0.0);
    if (u_exposure > 9.9999997473787516355514526367188e-06)
    {
        _t1 = texture2D(u_glowTexture, v_uv);
    }
    vec4 _53 = _t1;
    vec3 _55 = _53.xyz * u_glowColor;
    _t1.x = _55.x;
    _t1.y = _55.y;
    _t1.z = _55.z;
    vec4 param = _t1;
    vec4 param_1 = _33;
    if (u_displayGlow == 1)
    {
        gl_FragData[0] = clamp(_t1, vec4(0.0), vec4(1.0));
    }
    else
    {
        gl_FragData[0] = clamp(_f0(param, param_1), vec4(0.0), vec4(1.0));
    }
}

