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
    vec2 _32 = ((((v_p / u_ScreenParams.xy) - vec2(0.5)) * 1.019999980926513671875) + vec2(0.5)) * u_ScreenParams.xy;
    vec2 _36 = u_ScreenParams.xy * 0.5;
    vec2 _48 = abs(_32 - _36) - (_36 - vec2(u_radius));
    vec2 _t2 = _48;
    gl_FragData[0] = texture2D(u_inputTexture, _32 / u_ScreenParams.xy) * smoothstep(u_fade0, u_fade1, -((length(max(_48, vec2(0.0))) + min(max(_t2.x, _t2.y), 0.0)) - u_radius));
}

