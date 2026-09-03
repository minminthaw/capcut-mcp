precision highp float;
precision highp int;

uniform mediump sampler2D inputTexture;
uniform mediump int hasBgTex;
uniform vec4 u_ScreenParams;
uniform vec2 bgTextureSize;
uniform mediump sampler2D bgTexture;
uniform float sourceOpacity;
uniform float bgBrightness;
uniform mediump sampler2D blurTexture1;
uniform mediump sampler2D blurTexture2;
uniform vec3 GlowColor;
uniform float brightness;
uniform float glowUnderSource;
uniform float lightBackground;
uniform mediump int combine;

varying vec2 v_uv;

float _f0(vec2 _p0)
{
    return ((step(0.0, _p0.x) * step(_p0.x, 1.0)) * step(0.0, _p0.y)) * step(_p0.y, 1.0);
}

vec2 _f1(vec4 _p0)
{
    return vec2(_p0.x + (_p0.y / 255.0), _p0.z + (_p0.w / 255.0));
}

void main()
{
    mediump vec4 _73 = texture2D(inputTexture, v_uv);
    vec4 _t2 = _73;
    vec4 _t3 = vec4(0.0, 0.0, 0.0, _t2.w);
    if (hasBgTex > 0)
    {
        vec2 _t4 = v_uv;
        _t4.y = 1.0 - _t4.y;
        _t4 -= vec2(0.5);
        _t4.x *= (u_ScreenParams.x / bgTextureSize.x);
        _t4.y *= (u_ScreenParams.y / bgTextureSize.y);
        vec2 _120 = _t4;
        vec2 _122 = _120 + vec2(0.5);
        _t4 = _122;
        vec2 param = _122;
        _t3 = texture2D(bgTexture, _122) * _f0(param);
    }
    vec4 _135 = vec4(sourceOpacity);
    _t3 = mix(_t3, _73, _135) * bgBrightness;
    vec4 param_1 = texture2D(blurTexture1, v_uv);
    vec4 param_2 = texture2D(blurTexture2, v_uv);
    vec4 _158 = vec4(_f1(param_1), _f1(param_2));
    vec4 _t5 = _158;
    vec3 _165 = _158.xyz * GlowColor;
    _t5.x = _165.x;
    _t5.y = _165.y;
    _t5.z = _165.z;
    vec4 _174 = _t5;
    vec4 _175 = _174 * brightness;
    _t5 = _175;
    vec4 _192 = mix(_175, mix(_175, _73, _135), vec4(glowUnderSource)) * (1.0 - lightBackground);
    vec4 _t6 = _192;
    _t3 = clamp(_t3, vec4(0.0), vec4(1.0));
    vec4 _t8 = _73;
    if (combine == 1)
    {
        vec3 _219 = _192.xyz + _t3.xyz;
        _t8.x = _219.x;
        _t8.y = _219.y;
        _t8.z = _219.z;
    }
    else
    {
        if (combine == 2)
        {
            vec3 _236 = _t3.xyz * _192.xyz;
            _t8.x = _236.x;
            _t8.y = _236.y;
            _t8.z = _236.z;
        }
        else
        {
            if (combine == 3)
            {
                vec3 _254 = abs(_192.xyz - _t3.xyz);
                _t8.x = _254.x;
                _t8.y = _254.y;
                _t8.z = _254.z;
            }
            else
            {
                if (combine == 4)
                {
                    float _270;
                    if (_t3.x < 0.5)
                    {
                        _270 = (2.0 * _t3.x) * _t6.x;
                    }
                    else
                    {
                        _270 = 1.0 - ((2.0 * (1.0 - _t3.x)) * (1.0 - _t6.x));
                    }
                    float _294;
                    if (_t3.y < 0.5)
                    {
                        _294 = (2.0 * _t3.y) * _t6.y;
                    }
                    else
                    {
                        _294 = 1.0 - ((2.0 * (1.0 - _t3.y)) * (1.0 - _t6.y));
                    }
                    float _317;
                    if (_t3.z < 0.5)
                    {
                        _317 = (2.0 * _t3.z) * _t6.z;
                    }
                    else
                    {
                        _317 = 1.0 - ((2.0 * (1.0 - _t3.z)) * (1.0 - _t6.z));
                    }
                    vec3 _337 = vec3(_270, _294, _317);
                    _t8.x = _337.x;
                    _t8.y = _337.y;
                    _t8.z = _337.z;
                }
                else
                {
                    vec3 _355 = vec3(1.0) - ((vec3(1.0) - _t3.xyz) * (vec3(1.0) - _192.xyz));
                    _t8.x = _355.x;
                    _t8.y = _355.y;
                    _t8.z = _355.z;
                }
            }
        }
    }
    _t8.w = _t5.w + ((1.0 - _t5.w) * _t2.w);
    gl_FragData[0] = _t8;
}

