precision highp float;


attribute vec3 position;
attribute vec4 color;
attribute vec2 texcoord0;

uniform vec4 u_ScreenParams; // built-in uniform
uniform mat4 u_MVP;

varying vec2 uv0;
varying vec2 uv1;


void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);

    vec2 screen_position = (position.xy + 1.0) / 2.0;
    screen_position = vec2(screen_position.x, 1.0 - screen_position.y);
    screen_position = screen_position * u_ScreenParams.xy;

    uv0 = texcoord0;  // original image
    uv1 = (u_MVP * vec4(screen_position.xy, 0.0, 1.0)).xy;
}