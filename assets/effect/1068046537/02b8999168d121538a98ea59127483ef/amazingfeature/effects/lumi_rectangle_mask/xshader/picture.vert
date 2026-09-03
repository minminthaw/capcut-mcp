precision highp float;
attribute vec3 position;
attribute vec2 texcoord0;
varying vec2 uv0;
varying vec2 sampIn;
uniform vec2 u_center;
uniform float u_aspect;
uniform float u_rotate;
varying float decay;
void main() 
{ 
    gl_Position = vec4(position, 1);
    uv0 = texcoord0;
    sampIn = vec2(((texcoord0.x - 0.5) * 2.0 - u_center.x) * u_aspect, (texcoord0.y - 0.5) * 2.0 - u_center.y);
    sampIn = vec2(cos(u_rotate) * sampIn.x - sin(u_rotate) * sampIn.y, sin(u_rotate) * sampIn.x + cos(u_rotate) * sampIn.y);
    decay = sqrt(1.0 - pow((mod(u_rotate, 3.1415926/2.0) / (3.1415926/4.0) - 1.0), 2.0));
    decay = sqrt(sqrt(decay));
}
