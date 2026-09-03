precision highp float;

uniform sampler2D u_inputTex;
uniform sampler2D u_masking;
uniform vec2 mask_uv;
varying vec2 mask_uv_re;

varying vec2 v_uv;


void main() {
    //vec4 inputsrc = texture2D(u_inputTex, v_uv);
    //vec4 maskingsrc = texture2D(u_masking, v_uv + mask_uv_re - mask_uv);
    //vec4 maskingsrc = texture2D(u_masking, mask_uv_re);
    //vec4 resrc = inputsrc * maskingsrc.r;
    //gl_FragColor = inputsrc + resrc * (1.0 - resrc.a);

    gl_FragColor = texture2D(u_masking, mask_uv_re);
}


