precision highp float;
attribute vec3 position;
attribute vec2 texcoord0;
// out vec2 blurCoords[21];
varying vec2 uv;

void main()
{
    gl_Position = vec4(position, 1.0);
    uv = texcoord0;
}