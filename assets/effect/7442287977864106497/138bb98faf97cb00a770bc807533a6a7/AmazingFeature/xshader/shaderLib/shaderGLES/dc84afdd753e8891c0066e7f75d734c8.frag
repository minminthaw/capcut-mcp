precision highp float;
precision highp int;

uniform mediump sampler2D u_inputTexture;
uniform mediump sampler2D u_one_one;
uniform vec4 u_ScreenParams;
uniform mediump sampler2D u_nine_;
uniform mediump sampler2D u_three_four;

varying vec2 uv0;

void main()
{
    vec4 _t1 = texture2D(u_inputTexture, uv0);
    vec4 _t2 = texture2D(u_one_one, uv0);
    float _38 = u_ScreenParams.x / u_ScreenParams.y;
    if (_38 <= 0.75)
    {
        _t2 = texture2D(u_nine_, uv0);
    }
    if (_38 >= 1.34000003337860107421875)
    {
        _t2 = texture2D(u_three_four, uv0);
    }
    vec4 _65 = _t1;
    vec4 _66 = _65 * _t2.w;
    _t1 = _66;
    gl_FragData[0] = _66;
}

