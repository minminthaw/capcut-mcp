precision highp float;
attribute vec3 position;
attribute vec2 texcoord0;
varying vec2 uv0;
uniform vec2 u_center;
uniform float u_aspect;
uniform float u_rotate;
uniform vec2 u_size;
uniform int u_useMetal;
void main() 
{ 
    gl_Position = vec4(position, 1);
    vec2 uv = vec2((texcoord0.x - 0.5) * 2.0 * u_aspect, -(texcoord0.y - 0.5) * 2.0);
    if (u_useMetal == 1)
    {
        uv.y = -uv.y;
    }
    uv = vec2(uv.x - u_center.x * u_aspect, uv.y + u_center.y);
    uv = vec2(cos(u_rotate) * uv.x - sin(u_rotate) * uv.y, sin(u_rotate) * uv.x + cos(u_rotate) * uv.y);
    uv = vec2(uv.x / u_size.x, uv.y / u_size.y);
    uv0 = vec2(uv.x * 0.5 / u_aspect + 0.5, uv.y * 0.5 + 0.5);
}
