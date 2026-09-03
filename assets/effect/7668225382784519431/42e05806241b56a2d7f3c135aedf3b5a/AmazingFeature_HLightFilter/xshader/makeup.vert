precision highp float;

attribute vec4 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 u_MVP;
varying vec3 pos0;
varying vec2 uv0;
varying vec2 uv1;
varying vec3 normal0;

void main()
{
    gl_Position = u_MVP * position;
    pos0 = gl_Position.xyz;
    uv0 = uv.st;
    normal0 = normal.xyz;
    normal0.x =normal0.x * 0.7;
    uv1 = gl_Position.xy /gl_Position.w *  0.5 + 0.5;  
}