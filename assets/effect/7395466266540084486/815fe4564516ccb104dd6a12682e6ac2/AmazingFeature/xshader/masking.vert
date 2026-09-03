precision highp float;

uniform mat4 u_mat;

attribute vec4 a_position;
attribute vec2 a_texcoord0;

varying vec2 v_uv;
varying vec2 mask_uv_re;

void main () {
    mask_uv_re = (u_mat * vec4(a_texcoord0, 0.0, 1.0)).st;
    v_uv = a_texcoord0;
    gl_Position = a_position;
}
