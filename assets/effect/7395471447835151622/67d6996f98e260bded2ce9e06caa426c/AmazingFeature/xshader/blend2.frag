precision highp float;

uniform sampler2D u_base;

varying vec2 v_uv;


void main () {
    vec4 base = texture2D(u_base, v_uv);
    gl_FragColor = base;
}