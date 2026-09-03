precision highp float;
precision highp int;

uniform vec4 u_ScreenParams;
uniform float blurSize;
uniform mediump sampler2D inputImageTexture;

varying vec2 v_uv;

float _f1(float _p0, float _p1)
{
    return (0.3989399969577789306640625 * exp((((-0.5) * _p0) * _p0) / (_p1 * _p1))) / _p1;
}

float _f0(vec2 _p0)
{
    return ((step(0.0, _p0.x) * step(0.0, _p0.y)) * step(_p0.x, 1.0)) * step(_p0.y, 1.0);
}

void main()
{
    vec2 _72 = (u_ScreenParams.xy / vec2(min(u_ScreenParams.x, u_ScreenParams.y))) * 540.0;
    vec2 _t0 = _72;
    float _t1 = blurSize;
    if (blurSize < 1.0)
    {
        _t1 = 0.0;
    }
    else
    {
        if (blurSize <= 24.0)
        {
            _t1 = 24.0;
            _t0 = _72 * (24.0 / blurSize);
        }
        else
        {
            if (blurSize <= 64.0)
            {
                _t1 = blurSize;
                _t0 = _72;
            }
            else
            {
                _t1 = 64.0;
                _t0 = _72 * (64.0 / blurSize);
            }
        }
    }
    vec2 _t2 = vec2(1.0) / _t0;
    float param = 0.0;
    float param_1 = 4.0;
    float _139 = _f1(param, param_1);
    float _t3 = _139;
    float _t4 = _139;
    vec4 _t5 = texture2D(inputImageTexture, v_uv) * _139;
    float _157 = min(blurSize, 64.0);
    for (float _t7 = 1.0; _t7 <= _157; _t7 += mix(1.0, 2.0, step(24.0, blurSize)))
    {
        if (_t7 > _t1)
        {
            break;
        }
        float param_2 = (_t7 / _t1) * 15.0;
        float param_3 = 4.0;
        float _180 = _f1(param_2, param_3);
        _t3 = _180;
        vec2 param_4 = v_uv + vec2(0.0, _t7 * _t2.y);
        _t5 += ((texture2D(inputImageTexture, v_uv + vec2(0.0, _t7 * _t2.y)) * _180) * _f0(param_4));
        vec2 param_5 = v_uv - vec2(0.0, _t7 * _t2.y);
        _t5 += ((texture2D(inputImageTexture, v_uv - vec2(0.0, _t7 * _t2.y)) * _t3) * _f0(param_5));
        _t4 += (2.0 * _t3);
    }
    vec4 _238 = _t5;
    vec4 _240 = _238 / vec4(_t4);
    _t5 = _240;
    gl_FragData[0] = _240;
}

