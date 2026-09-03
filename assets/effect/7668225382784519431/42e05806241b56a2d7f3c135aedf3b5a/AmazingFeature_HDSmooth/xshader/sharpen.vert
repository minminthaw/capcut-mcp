precision highp float;

attribute vec4 a_position;
attribute vec2 a_texcoord0;

varying highp vec2 textureCoord;

void main()
{
    gl_Position = a_position;
    textureCoord = a_texcoord0;
}