precision highp float;
precision highp int;

uniform mediump sampler2D u_intexture;
uniform mediump sampler2D u_mixTexture;
uniform mediump int u_displayRayOnly;
uniform mediump int u_blendMode;

varying vec2 uv0;

vec4 _f1(vec4 _p0, vec4 _p1)
{
    vec4 _t0 = vec4(0.0);
    vec3 _50 = _p0.xyz + _p1.xyz;
    _t0.x = _50.x;
    _t0.y = _50.y;
    _t0.z = _50.z;
    _t0.w = _p0.w + (_p1.w * (1.0 - _p0.w));
    return _t0;
}

vec4 _f2(vec4 _p0, vec4 _p1)
{
    vec4 _t1 = vec4(0.0);
    vec3 _81 = max(_p0.xyz, _p1.xyz);
    _t1.x = _81.x;
    _t1.y = _81.y;
    _t1.z = _81.z;
    _t1.w = _p0.w + (_p1.w * (1.0 - _p0.w));
    return _t1;
}

vec4 _f4(vec4 _p0, vec4 _p1)
{
    vec4 _t3 = vec4(0.0);
    vec3 _147 = _p0.xyz * _p1.xyz;
    _t3.x = _147.x;
    _t3.y = _147.y;
    _t3.z = _147.z;
    _t3.w = _p0.w + (_p1.w * (1.0 - _p0.w));
    return _t3;
}

vec4 _f3(vec4 _p0, vec4 _p1)
{
    vec4 _t2 = vec4(0.0);
    _t2.w = _p0.w + (_p1.w * (1.0 - _p0.w));
    float _128 = _t2.w;
    vec3 _132 = ((_p0.xyz * _p0.w) + (_p1.xyz * ((1.0 - _p0.w) * _p1.w))) / vec3(max(_128, 0.001000000047497451305389404296875));
    _t2.x = _132.x;
    _t2.y = _132.y;
    _t2.z = _132.z;
    return _t2;
}

vec4 _f0(vec4 _p0, vec4 _p1)
{
    return vec4(1.0) - ((vec4(1.0) - _p0) * (vec4(1.0) - _p1));
}

void main()
{
    mediump vec4 _177 = texture2D(u_intexture, uv0);
    mediump vec4 _182 = texture2D(u_mixTexture, uv0);
    vec4 _t5 = _182;
    vec4 _t6 = vec4(0.0);
    if (u_displayRayOnly == 1)
    {
        _t6 = _177;
    }
    else
    {
        if (u_blendMode == 1)
        {
            vec4 param = _182;
            vec4 param_1 = _177;
            _t6 = _f1(param, param_1);
        }
        else
        {
            if (u_blendMode == 2)
            {
                vec4 param_2 = _182;
                vec4 param_3 = _177;
                _t6 = _f2(param_2, param_3);
            }
            else
            {
                if (u_blendMode == 3)
                {
                    vec4 param_4 = _182;
                    vec4 param_5 = _177;
                    _t6 = _f4(param_4, param_5);
                }
                else
                {
                    if (u_blendMode == 4)
                    {
                        vec4 param_6 = _177;
                        vec4 param_7 = _182;
                        _t6 = _f3(param_6, param_7);
                    }
                    else
                    {
                        vec4 param_8 = _182;
                        vec4 param_9 = _177;
                        _t6 = _f0(param_8, param_9);
                    }
                }
            }
        }
    }
    gl_FragData[0] = vec4(_t6.xyz, _t5.w);
}

