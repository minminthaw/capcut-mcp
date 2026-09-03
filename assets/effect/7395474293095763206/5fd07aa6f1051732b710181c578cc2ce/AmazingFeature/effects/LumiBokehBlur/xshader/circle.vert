precision highp float;

attribute vec3 a_position;
attribute vec2 a_texcoord0;
varying vec2 uv;

void main()
{
    gl_Position = vec4(a_position, 1.0);
    uv = a_texcoord0;
}
