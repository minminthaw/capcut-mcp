precision highp float;

attribute vec3 position;
attribute vec2 texcoord0;

varying vec2 texcoord1;

void main() {
    gl_Position = vec4(position, 1.0);
    texcoord1 = (position.xy + 1.0) / 2.0;
}
