
attribute vec4 a_position;
varying vec2 v_uv;
attribute vec2 a_texcoord0;

void main()
{
    gl_Position = a_position;
    v_uv = a_texcoord0;
}

