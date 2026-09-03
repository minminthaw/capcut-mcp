precision highp float;
precision highp int;

uniform float u_sampleY;
uniform mediump sampler2D u_inputTexture;
uniform float u_sigmaY;
uniform float u_stepY;
uniform float u_exposure;

varying vec2 v_uv;

float _f0(float _p0, float _p1)
{
    return exp((((-0.5) * _p0) * _p0) / (_p1 * _p1));
}

void main()
{
    if (u_sampleY < 9.9999997473787516355514526367188e-06)
    {
        gl_FragData[0] = texture2D(u_inputTexture, v_uv);
        return;
    }
    float param = 0.0;
    float param_1 = u_sigmaY;
    float _58 = _f0(param, param_1);
    float _t1 = _58;
    vec4 _t2 = texture2D(u_inputTexture, v_uv) * _58;
    vec2 _t3 = v_uv;
    for (mediump int _t4 = 1; _t4 <= 1024; _t4++)
    {
        mediump float _80 = float(_t4);
        if (_80 > u_sampleY)
        {
            break;
        }
        float _91 = _80 * u_stepY;
        float param_2 = _91;
        float param_3 = u_sigmaY;
        float _97 = _f0(param_2, param_3);
        _t3.y = v_uv.y - _91;
        if (_t3.y >= 0.0)
        {
            _t2 += (texture2D(u_inputTexture, _t3) * _97);
            _t1 += _97;
        }
        _t3.y = v_uv.y + _91;
        if (_t3.y <= 1.0)
        {
            _t2 += (texture2D(u_inputTexture, _t3) * _97);
            _t1 += _97;
        }
    }
    vec4 _145 = _t2;
    vec4 _147 = _145 / vec4(_t1);
    _t2 = _147;
    vec3 _153 = _147.xyz * u_exposure;
    _t2.x = _153.x;
    _t2.y = _153.y;
    _t2.z = _153.z;
    gl_FragData[0] = clamp(_t2, vec4(0.0), vec4(1.0));
}

