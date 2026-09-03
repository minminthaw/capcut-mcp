precision highp float;
attribute vec3 position;
attribute vec2 texcoord0;
uniform int uFlipY;
varying vec2 uv0;

void main() 
{ 
    gl_Position = vec4(position.xyz, 1.0);
    uv0 = texcoord0;
    if (uFlipY > 0) {
        uv0.y = 1.0 - uv0.y;
    }
}
