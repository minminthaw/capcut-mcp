precision highp float;

uniform float u_step_x;
uniform float u_step_y;
uniform float u_direction;
uniform float u_intensity;

attribute vec2 attPosition;
attribute vec2 attUV;

varying vec2 v_uv[9];

#define PI 3.14159265359


void main () {
    float a = PI * u_direction;
    float s = sin(a);
    float c = cos(a);

    vec2 t = vec2(u_step_x, u_step_y) * u_intensity;
    mat2 m = mat2(c, s, -s, c);

    v_uv[0] = attUV;
    v_uv[1] = attUV + m * vec2(1.407333, 0.0) * t;
    v_uv[2] = attUV - m * vec2(1.407333, 0.0) * t;
    v_uv[3] = attUV + m * vec2(3.294215, 0.0) * t;
    v_uv[4] = attUV - m * vec2(3.294215, 0.0) * t;
    v_uv[5] = attUV + m * vec2(5.351806, 0.0) * t;
    v_uv[6] = attUV - m * vec2(5.351806, 0.0) * t;
    v_uv[7] = attUV + m * vec2(7.302940, 0.0) * t;
    v_uv[8] = attUV - m * vec2(7.302940, 0.0) * t;

    gl_Position = vec4(attPosition, 0.0, 1.0);
}
// DO_NOT_PATCH_ME