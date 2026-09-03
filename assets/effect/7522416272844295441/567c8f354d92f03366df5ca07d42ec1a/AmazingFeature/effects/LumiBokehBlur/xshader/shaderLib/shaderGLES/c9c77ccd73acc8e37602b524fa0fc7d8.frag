precision highp float;
precision highp int;

uniform mediump sampler2D u_maskTex;

varying vec2 v_uv;

void main()
{
    float _t0 = min(texture2D(u_maskTex, v_uv).x, 99.0);
    for (mediump int _t2 = -1; _t2 <= 1; _t2++)
    {
        for (mediump int _t3 = -1; _t3 <= 1; _t3++)
        {
            _t0 = min(texture2D(u_maskTex, v_uv + (vec2(float(_t2), float(_t3)) * vec2(0.014999999664723873138427734375))).x, _t0);
        }
    }
    float _79 = _t0;
    float _111 = min(texture2D(u_maskTex, v_uv + vec2(0.0, -0.02999999932944774627685546875)).x, min(texture2D(u_maskTex, v_uv + vec2(0.0, 0.02999999932944774627685546875)).x, min(texture2D(u_maskTex, v_uv + vec2(0.02999999932944774627685546875, 0.0)).x, min(texture2D(u_maskTex, v_uv + vec2(-0.02999999932944774627685546875, 0.0)).x, _79))));
    _t0 = _111;
    gl_FragData[0] = vec4(_111, _111, _111, 1.0);
}

