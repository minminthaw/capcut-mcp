precision highp float;
precision highp int;

uniform float u_size;
uniform float u_ratio;
uniform mediump sampler2D u_InputTex;
uniform float u_opacity;

varying vec2 v_uv;

void main()
{
    vec2 _t0 = v_uv;
    float _22 = 0.00999999977648258209228515625 * u_size;
    _t0.x -= _22;
    _t0.y -= (_22 * u_ratio);
    float _40 = 0.0199999995529651641845703125 * u_size;
    _t0.x *= (1.0 + _40);
    _t0.y *= (1.0 + (_40 * u_ratio));
    vec4 _t1 = vec4(0.0, 0.0, 0.0, 1.0);
    bool _61 = _t0.x > 0.0;
    bool _67;
    if (_61)
    {
        _67 = _t0.x < 1.0;
    }
    else
    {
        _67 = _61;
    }
    if (_67)
    {
        _t1 = vec4(1.0);
        bool _73 = _t0.y > 0.0;
        bool _79;
        if (_73)
        {
            _79 = _t0.y < 1.0;
        }
        else
        {
            _79 = _73;
        }
        if (_79)
        {
            _t1 = vec4(1.0);
        }
        else
        {
            _t1 = vec4(0.0, 0.0, 0.0, 1.0);
        }
    }
    else
    {
        _t1 = vec4(0.0, 0.0, 0.0, 1.0);
    }
    vec4 _t2 = texture2D(u_InputTex, v_uv);
    _t2.x = 1.0;
    _t2.y = 1.0;
    _t2.z = 1.0;
    vec4 _t3 = texture2D(u_InputTex, _t0) * _t1.x;
    _t2 *= (1.0 - _t3.w);
    if (u_size > 0.00999999977648258209228515625)
    {
        _t3 = clamp(_t3 + _t2, vec4(0.0), vec4(1.0));
    }
    gl_FragData[0] = _t3 * u_opacity;
}

