precision highp float;
precision highp int;

uniform mediump sampler2D u_inputTexture;
uniform float u_intensity;

varying vec2 v_uv;

void main()
{
    mediump vec4 _19 = texture2D(u_inputTexture, v_uv);
    vec4 _t1 = _19;
    vec3 _34 = vec3(0.2085399925708770751953125, 0.702085971832275390625, 0.089373998343944549560546875) * (1.0 - u_intensity);
    vec3 _42 = _19.xyz;
    _t1.x = dot(_42, _34 + vec3(u_intensity, 0.0, 0.0));
    _t1.y = dot(_42, _34 + vec3(0.0, u_intensity, 0.0));
    _t1.z = dot(_42, _34 + vec3(0.0, 0.0, u_intensity));
    gl_FragData[0] = clamp(_t1, vec4(0.0), vec4(1.0));
}

