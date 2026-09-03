precision highp float;
precision highp int;

uniform mediump sampler2D u_inputTexture;
uniform mediump int u_colorType;
uniform float u_threshold;

varying vec2 uv0;

float _f0(vec3 _p0)
{
    return dot(_p0, vec3(0.2125999927520751953125, 0.715200006961822509765625, 0.072200000286102294921875));
}

void main()
{
    mediump vec4 _33 = texture2D(u_inputTexture, uv0);
    vec4 _t0 = _33;
    vec3 param = _33.xyz;
    float _39 = _f0(param);
    if (u_colorType == 1)
    {
        vec3 _50 = vec3(_39);
        _t0.x = _50.x;
        _t0.y = _50.y;
        _t0.z = _50.z;
    }
    if (_39 < u_threshold)
    {
        _t0 = vec4(0.0);
    }
    gl_FragData[0] = _t0;
}

