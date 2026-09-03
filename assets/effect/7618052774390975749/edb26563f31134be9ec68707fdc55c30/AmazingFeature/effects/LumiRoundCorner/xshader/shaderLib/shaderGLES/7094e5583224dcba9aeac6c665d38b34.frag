precision highp float;
precision highp int;

uniform vec4 u_ScreenParams;
uniform float u_radius;
uniform float u_fade0;
uniform float u_fade1;
uniform mediump sampler2D u_inputTexture;

varying vec2 v_p;

void main()
{
    vec2 _16 = u_ScreenParams.xy * 0.5;
    vec2 _30 = abs(v_p - _16) - (_16 - vec2(u_radius));
    vec2 _t1 = _30;
    gl_FragData[0] = texture2D(u_inputTexture, v_p / u_ScreenParams.xy) * smoothstep(u_fade0, u_fade1, -((length(max(_30, vec2(0.0))) + min(max(_t1.x, _t1.y), 0.0)) - u_radius));
}

