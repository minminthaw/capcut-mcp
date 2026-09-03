precision highp float;

uniform sampler2D u_src0;
uniform sampler2D u_src1;
uniform float u_select;

varying vec2 v_uv;


vec4 texture2Dmirror (sampler2D tex, vec2 uv) {
    uv = mod(uv, 2.0);
    uv = mix(uv, 2.0 - uv, step(vec2(1.0), uv));
    return texture2D(tex, fract(uv));
}

void main () {
    vec4 src0 = texture2Dmirror(u_src0, v_uv);
    vec4 src1 = texture2Dmirror(u_src1, v_uv);
    gl_FragColor = mix(src0, src1, u_select);
}


// DO_NOT_PATCH_ME