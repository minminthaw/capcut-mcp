precision highp float;

attribute vec2 a_position;
attribute vec2 a_texcoord0;
varying vec2 uv0;

void main()
{
    gl_Position = (vec4(a_texcoord0.xy * 2.0 - 1.0, 0.0, 1.0));
    uv0 = a_texcoord0;
}
