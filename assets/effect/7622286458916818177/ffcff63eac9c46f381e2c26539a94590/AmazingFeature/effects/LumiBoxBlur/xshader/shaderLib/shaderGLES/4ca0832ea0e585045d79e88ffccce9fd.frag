precision highp float;
precision highp int;

uniform float u_sampleX;
uniform mediump sampler2D u_inputTexture;
uniform float u_stepX;
uniform mediump int u_borderType;

varying vec2 uv0;

void main()
{
    if (u_sampleX < 9.9999997473787516355514526367188e-06)
    {
        gl_FragData[0] = texture2D(u_inputTexture, uv0);
        return;
    }
    float _t1 = 1.0;
    vec4 _t2 = texture2D(u_inputTexture, uv0) * 1.0;
    int _45 = int(u_sampleX);
    mediump int _t3 = _45;
    if (_45 > 64)
    {
        _t3 = 64;
    }
    vec2 _t4 = uv0;
    for (mediump int _t5 = 1; _t5 <= _t3; _t5 += 2)
    {
        float _73 = (float(_t5) * u_stepX) * 2.0;
        _t4.x = uv0.x - _73;
        if (_t4.x < 0.0)
        {
            if (u_borderType == 1)
            {
                _t4.x = 0.0;
                _t2 += texture2D(u_inputTexture, _t4);
                _t1 += 1.0;
            }
            else
            {
                if (u_borderType == 2)
                {
                    _t1 += 1.0;
                }
                else
                {
                    if (u_borderType == 3)
                    {
                        _t4.x = -_t4.x;
                        _t2 += texture2D(u_inputTexture, _t4);
                        _t1 += 1.0;
                    }
                }
            }
        }
        else
        {
            _t2 += texture2D(u_inputTexture, _t4);
            _t1 += 1.0;
        }
        _t4.x = uv0.x + _73;
        if (_t4.x > 1.0)
        {
            if (u_borderType == 1)
            {
                _t4.x = 1.0;
                _t2 += texture2D(u_inputTexture, _t4);
                _t1 += 1.0;
            }
            else
            {
                if (u_borderType == 2)
                {
                    _t1 += 1.0;
                }
                else
                {
                    if (u_borderType == 3)
                    {
                        _t4.x = 2.0 - _t4.x;
                        _t2 += texture2D(u_inputTexture, _t4);
                        _t1 += 1.0;
                    }
                }
            }
        }
        else
        {
            _t2 += texture2D(u_inputTexture, _t4);
            _t1 += 1.0;
        }
    }
    vec4 _191 = _t2;
    vec4 _193 = _191 / vec4(_t1);
    _t2 = _193;
    gl_FragData[0] = _193;
}

