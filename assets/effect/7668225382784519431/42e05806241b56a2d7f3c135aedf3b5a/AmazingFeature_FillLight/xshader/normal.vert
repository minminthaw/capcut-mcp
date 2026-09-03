precision highp float;

attribute vec4 a_position;
attribute vec2 a_texcoord0;

varying vec2 textureCoordinate;

void main() {
    gl_Position = a_position;
    textureCoordinate = a_texcoord0;
}
