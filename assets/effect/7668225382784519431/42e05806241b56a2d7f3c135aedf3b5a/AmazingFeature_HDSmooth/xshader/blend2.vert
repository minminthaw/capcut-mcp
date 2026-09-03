precision highp float;

attribute vec4 a_position;
attribute vec2 a_texcoord0;

varying vec2 uv;

void main()
{
    gl_Position = a_position;
    uv = a_texcoord0;
}
