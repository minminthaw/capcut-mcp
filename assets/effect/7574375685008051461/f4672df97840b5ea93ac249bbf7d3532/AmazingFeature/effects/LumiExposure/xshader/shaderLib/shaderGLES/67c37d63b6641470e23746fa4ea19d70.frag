precision highp float;
precision highp int;

uniform mediump int u_noUseLinearLight;
uniform float u_gamma;
uniform mediump sampler2D u_inputTexture;
uniform float u_redExposure;
uniform float u_redOffset;
uniform float u_redGrayscaleCorrection;
uniform float u_greenExposure;
uniform float u_greenOffset;
uniform float u_greenGrayscaleCorrection;
uniform float u_blueExposure;
uniform float u_blueOffset;
uniform float u_blueGrayscaleCorrection;

varying vec2 uv0;

float _f0(inout float _p0, float _p1, float _p2, float _p3)
{
    bool _21 = u_noUseLinearLight == 0;
    if (_21)
    {
        _p0 = pow(_p0, u_gamma);
    }
    _p0 *= pow(2.0, _p1);
    _p0 += _p2;
    _p0 = pow(_p0, 1.0 / _p3) * sign(_p0);
    if (_21)
    {
        _p0 = pow(_p0, 1.0 / u_gamma) * sign(_p0);
    }
    return _p0;
}

void main()
{
    vec4 _t0 = texture2D(u_inputTexture, uv0);
    float param = _t0.x;
    float param_1 = u_redExposure;
    float param_2 = u_redOffset;
    float param_3 = u_redGrayscaleCorrection;
    float _86 = _f0(param, param_1, param_2, param_3);
    _t0.x = _86;
    float param_4 = _t0.y;
    float param_5 = u_greenExposure;
    float param_6 = u_greenOffset;
    float param_7 = u_greenGrayscaleCorrection;
    float _101 = _f0(param_4, param_5, param_6, param_7);
    _t0.y = _101;
    float param_8 = _t0.z;
    float param_9 = u_blueExposure;
    float param_10 = u_blueOffset;
    float param_11 = u_blueGrayscaleCorrection;
    float _116 = _f0(param_8, param_9, param_10, param_11);
    _t0.z = _116;
    gl_FragData[0] = clamp(_t0, vec4(0.0), vec4(1.0));
}

