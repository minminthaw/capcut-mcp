precision highp float;

attribute vec3 position;
attribute vec2 texcoord0;
varying vec2 uv0;
// uniform mat4 u_MVP;
void main() 
{ 
    // gl_Position = u_MVP * vec4(position.xyz, 1.0);
    gl_Position = vec4(position.xyz, 1.0);
    uv0 = texcoord0;
}
