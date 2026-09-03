precision highp float;

uniform sampler2D u_tex;

varying vec2 v_uv;

void main()
{
    vec4 mask = texture2D(u_tex, vec2(v_uv.x, 1.0 - v_uv.y));
    float a = mask.a;
    gl_FragColor = vec4(mask.a);
}
