
uniform vec4 u_ScreenParams;

attribute vec4 a_position;
varying vec2 v_p;
attribute vec2 a_texcoord0;

vec2 _f0()
{
    return u_ScreenParams.xy * (1080.0 / min(u_ScreenParams.x, u_ScreenParams.y));
}

void main()
{
    gl_Position = a_position;
    v_p = a_texcoord0 * _f0();
}

