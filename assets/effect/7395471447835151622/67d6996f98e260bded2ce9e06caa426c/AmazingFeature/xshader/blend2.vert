precision highp float;

uniform vec2 u_screen_size;
uniform vec2 u_size;

attribute vec4 a_position;
attribute vec2 a_texcoord0;

varying vec2 v_uv;


vec2 transform (vec2 screen_size, vec2 image_size, vec2 translate, vec2 anchor, vec2 scale, float rotate, vec2 uv) {
    float R = rotate * 0.01745329251;
    float c = cos(R);
    float s = sin(R);

    vec2 rx = vec2(c, s);
    vec2 ry = vec2(-s, c);

    vec2 origin = translate * screen_size;
    vec2 p = uv * screen_size - origin;
    p = vec2(dot(rx, p), dot(ry, p));
    p /= image_size * scale;
    p += anchor;
    return p;
}

void main() 
{
    v_uv = transform(u_screen_size, u_size, vec2(0.5), vec2(0.5), vec2(1.0), 0.0, a_texcoord0);
    gl_Position = a_position;
}
