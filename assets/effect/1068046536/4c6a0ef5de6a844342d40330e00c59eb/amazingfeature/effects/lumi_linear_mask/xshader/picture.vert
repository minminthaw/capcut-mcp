precision highp float;
attribute vec3 position;
attribute vec2 texcoord0;
varying vec2 uv0;
varying vec2 samp;
uniform vec2 u_center;
uniform float u_aspect;
void main() 
{ 
    gl_Position = vec4(position, 1);
    uv0 = texcoord0;
    samp = vec2(((texcoord0.x - 0.5) * 2.0 - u_center.x) * u_aspect, (texcoord0.y - 0.5) * 2.0 - u_center.y);
}

