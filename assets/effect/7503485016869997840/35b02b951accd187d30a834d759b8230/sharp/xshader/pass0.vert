precision highp float;

attribute vec2 position;
attribute vec2 texcoord0;
uniform int imageWidth;
uniform int imageHeight;
varying vec2 uRenderSize;
varying vec2 uv0;
//uniform mat4 u_MVP;
void main() 
{ 
    //gl_Position = u_MVP * position;
    gl_Position = sign(vec4(position.xy, 0.0, 1.0));
    uv0 = texcoord0;
    uRenderSize = vec2(imageWidth, imageHeight);
}
