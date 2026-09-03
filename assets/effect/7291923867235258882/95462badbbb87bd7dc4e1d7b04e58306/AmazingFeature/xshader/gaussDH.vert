precision highp float;
attribute vec3 position;
attribute vec2 texcoord0;
// out vec2 blurCoords[21];
varying vec2 uv;

varying vec3 blue_color;
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main()
{
    blue_color = hsv2rgb(vec3(0.6,1.0,1.0));
    gl_Position = vec4(position, 1.0);
    uv = texcoord0;
}