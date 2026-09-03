precision highp float;
precision highp int;

uniform float u_sampleX;
uniform mediump sampler2D u_inputTexture;
uniform float u_sigmaX;
uniform float u_dx;

varying vec2 uv0;

float _f0(float _p0, float _p1)
{
    return exp((((-0.5) * _p0) * _p0) / (_p1 * _p1));
}

void main()
{
    if (u_sampleX < 0.001000000047497451305389404296875)
    {
        gl_FragData[0] = texture2D(u_inputTexture, uv0);
        return;
    }
    float param = 0.0;
    float param_1 = u_sigmaX;
    float _58 = _f0(param, param_1);
    float _t1 = _58;
    vec4 _t2 = texture2D(u_inputTexture, uv0) * _58;
    vec2 _t3 = uv0;
    for (mediump int _t4 = 1; _t4 <= 1024; _t4++)
    {
        mediump float _80 = float(_t4);
        if (_80 > u_sampleX)
        {
            break;
        }
        float _91 = _80 * u_dx;
        float param_2 = _91;
        float param_3 = u_sigmaX;
        float _97 = _f0(param_2, param_3);
        _t3.x = uv0.x - _91;
        if (_t3.x >= 0.0)
        {
            _t2 += (texture2D(u_inputTexture, _t3) * _97);
            _t1 += _97;
        }
        _t3.x = uv0.x + _91;
        if (_t3.x <= 1.0)
        {
            _t2 += (texture2D(u_inputTexture, _t3) * _97);
            _t1 += _97;
        }
    }
    vec4 _145 = _t2;
    vec4 _147 = _145 / vec4(_t1);
    _t2 = _147;
    gl_FragData[0] = _147;
}

