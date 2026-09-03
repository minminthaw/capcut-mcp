precision highp float;
precision highp int;

uniform mediump sampler2D u_noiseTexture;
uniform mediump sampler2D u_inputTexture;
uniform mediump int u_combine;
uniform float u_intensity;
uniform float u_intensityR;
uniform float u_intensityG;
uniform float u_intensityB;

varying vec2 v_uv;

void main()
{
    mediump vec4 _19 = texture2D(u_noiseTexture, v_uv);
    vec4 _t0 = _19;
    mediump vec4 _24 = texture2D(u_inputTexture, v_uv);
    vec4 _t1 = _24;
    vec4 _t2;
    if (u_combine == 1)
    {
        _t2 = vec4(_19.xyz + _24.xyz, _t1.w);
    }
    else
    {
        if (u_combine == 2)
        {
            _t2 = vec4(_24.xyz * _19.xyz, _t1.w);
        }
        else
        {
            if (u_combine == 3)
            {
                float _78;
                if (_t1.x < 0.5)
                {
                    _78 = (2.0 * _t1.x) * _t0.x;
                }
                else
                {
                    _78 = 1.0 - ((2.0 * (1.0 - _t1.x)) * (1.0 - _t0.x));
                }
                float _104;
                if (_t1.y < 0.5)
                {
                    _104 = (2.0 * _t1.y) * _t0.y;
                }
                else
                {
                    _104 = 1.0 - ((2.0 * (1.0 - _t1.y)) * (1.0 - _t0.y));
                }
                float _128;
                if (_t1.z < 0.5)
                {
                    _128 = (2.0 * _t1.z) * _t0.z;
                }
                else
                {
                    _128 = 1.0 - ((2.0 * (1.0 - _t1.z)) * (1.0 - _t0.z));
                }
                _t2 = vec4(vec3(_78, _104, _128), _t1.w);
            }
            else
            {
                if (u_combine == 4)
                {
                    float _203;
                    if (_t1.x < 0.5)
                    {
                        _203 = (2.0 * _t1.x) * _t0.x;
                    }
                    else
                    {
                        _203 = 1.0 - ((2.0 * (1.0 - _t1.x)) * (1.0 - _t0.x));
                    }
                    float _226;
                    if (_t1.y < 0.5)
                    {
                        _226 = (2.0 * _t1.y) * _t0.y;
                    }
                    else
                    {
                        _226 = 1.0 - ((2.0 * (1.0 - _t1.y)) * (1.0 - _t0.y));
                    }
                    float _249;
                    if (_t1.z < 0.5)
                    {
                        _249 = (2.0 * _t1.z) * _t0.z;
                    }
                    else
                    {
                        _249 = 1.0 - ((2.0 * (1.0 - _t1.z)) * (1.0 - _t0.z));
                    }
                    vec3 _269 = vec3(_203, _226, _249);
                    _t2 = vec4(mix(_269, vec3(1.0) - ((vec3(1.0) - _269) * (vec3(1.0) - vec3(max(1.0 - ((1.0 - _t0.x) / 0.5), 0.0), max(1.0 - ((1.0 - _t0.y) / 0.5), 0.0), max(1.0 - ((1.0 - _t0.z) / 0.5), 0.0)))), vec3(0.5 * smoothstep(0.588235318660736083984375, 0.509803950786590576171875, dot(_24.xyz, vec3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625))))), _t1.w);
                }
                else
                {
                    if (u_combine == 5)
                    {
                        _t2 = vec4(abs(_19.xyz - _24.xyz), _t1.w);
                    }
                    else
                    {
                        _t2 = vec4(vec3(1.0) - ((vec3(1.0) - _24.xyz) * (vec3(1.0) - _19.xyz)), _t1.w);
                    }
                }
            }
        }
    }
    if (u_combine == 2)
    {
        _t2.x = _t1.x + ((_t2.x * u_intensity) * u_intensityR);
        _t2.y = _t1.y + ((_t2.y * u_intensity) * u_intensityG);
        _t2.z = _t1.z + ((_t2.z * u_intensity) * u_intensityB);
    }
    else
    {
        _t2.x = mix(_t1.x, _t2.x, u_intensity * u_intensityR);
        _t2.y = mix(_t1.y, _t2.y, u_intensity * u_intensityG);
        _t2.z = mix(_t1.z, _t2.z, u_intensity * u_intensityB);
    }
    gl_FragData[0] = _t2;
}

