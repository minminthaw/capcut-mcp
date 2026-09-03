precision highp float;
precision highp int;

uniform mediump vec4 u_shadowColor;
uniform mediump vec4 u_middleColor;
uniform mediump vec4 u_highlightColor;
uniform mediump sampler2D u_InputTexture;
uniform mediump float u_oriAlpha;

varying vec2 v_uv;

mediump float _f0(mediump vec3 _p0)
{
    return ((_p0.x * 0.2989999949932098388671875) + (_p0.y * 0.58700001239776611328125)) + (_p0.z * 0.114000000059604644775390625);
}

mediump vec4 _f1(mediump vec4 _p0, mediump float _p1)
{
    mediump vec3 param = _p0.xyz;
    mediump float _45 = _f0(param);
    mediump vec4 _t1 = _p0;
    mediump vec3 _70 = mix(mix(u_shadowColor, u_middleColor, vec4(_45 / 0.5)), mix(u_middleColor, u_highlightColor, vec4((_45 - 0.5) / 0.5)), vec4(step(0.5, _45))).xyz;
    _t1.x = _70.x;
    _t1.y = _70.y;
    _t1.z = _70.z;
    mediump vec4 _77 = _t1;
    mediump vec4 _81 = mix(_77, _p0, vec4(_p1));
    _t1 = _81;
    return _81;
}

void main()
{
    mediump vec4 _95 = texture2D(u_InputTexture, v_uv);
    mediump vec4 _t2 = _95;
    mediump float _100 = _t2.w;
    mediump vec3 _104 = _95.xyz / vec3(max(_100, 9.9999997473787516355514526367188e-05));
    _t2.x = _104.x;
    _t2.y = _104.y;
    _t2.z = _104.z;
    mediump vec4 param = _t2;
    mediump float param_1 = u_oriAlpha;
    mediump vec4 _118 = _f1(param, param_1);
    mediump vec4 _t3 = _118;
    mediump float _120 = _t3.w;
    mediump vec3 _123 = _118.xyz * _120;
    _t3.x = _123.x;
    _t3.y = _123.y;
    _t3.z = _123.z;
    gl_FragData[0] = _t3;
}

