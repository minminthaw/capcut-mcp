precision highp float;

attribute vec4 a_position;
attribute vec2 a_texcoord0;

varying highp vec2 textureCoord;
varying highp vec2 textureShift_1;
varying highp vec2 textureShift_2;
varying highp vec2 textureShift_3;
varying highp vec2 textureShift_4;

uniform highp float widthOffset;
uniform highp float heightOffset;

void main()
{
    gl_Position = a_position;
    textureCoord = a_texcoord0;
    
    textureShift_1 = vec2(a_texcoord0 + vec2(-widthOffset, 0.0));
    textureShift_2 = vec2(a_texcoord0 + vec2(widthOffset, 0.0));
    textureShift_3 = vec2(a_texcoord0 + vec2(0.0, -heightOffset));
    textureShift_4 = vec2(a_texcoord0 + vec2(0.0, heightOffset));
}