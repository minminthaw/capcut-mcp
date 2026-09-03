precision highp float;

uniform sampler2D u_base;

varying vec2 v_uv;


vec4 texture2Dmirror (sampler2D tex, vec2 uv) {
    uv = mod(uv, 2.0);
    uv = mix(uv, 2.0 - uv, step(vec2(1.0), uv));
    return texture2D(tex, fract(uv));
}

void main () {
    vec4 base = texture2Dmirror(u_base, v_uv);
    gl_FragColor = base;
}