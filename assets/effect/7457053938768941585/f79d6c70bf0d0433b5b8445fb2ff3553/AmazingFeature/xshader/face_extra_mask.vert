precision highp float;
attribute vec3 attPosition;
attribute vec2 attUV;

uniform vec2 u_ScreenSize; // built-in uniform
uniform mat4 u_MVP0;
uniform mat4 u_MVP1;
uniform mat4 u_MVP2;
uniform mat4 u_MVP3;
uniform mat4 u_MVP4;

varying vec2 uv;

varying vec2 uv0;
varying vec2 uv1;
varying vec2 uv2;
varying vec2 uv3;
varying vec2 uv4;


void main() {
    gl_Position = vec4(attPosition.xy, 0.0, 1.0);

    vec2 screen_position = (attPosition.xy + 1.0) / 2.0;
    screen_position = vec2(screen_position.x, 1.0 - screen_position.y);
    screen_position = screen_position * u_ScreenSize.xy;

    uv = attUV;  // original image
    uv0 = (u_MVP0 * vec4(screen_position.xy, 0.0, 1.0)).xy;
    uv1 = (u_MVP1 * vec4(screen_position.xy, 0.0, 1.0)).xy;
    uv2 = (u_MVP2 * vec4(screen_position.xy, 0.0, 1.0)).xy;
    uv3 = (u_MVP3 * vec4(screen_position.xy, 0.0, 1.0)).xy;
    uv4 = (u_MVP4 * vec4(screen_position.xy, 0.0, 1.0)).xy;
}