precision highp float;
precision highp int;

uniform mediump sampler2D u_inputTexture;
uniform mediump sampler2D u_inputTexture2;
uniform mediump sampler2D u_inputTexture3;

varying vec2 uv0;

void main()
{
    mediump vec4 _19 = texture2D(u_inputTexture, uv0);
    vec4 _t0 = _19;
    mediump vec4 _24 = texture2D(u_inputTexture2, uv0);
    vec4 _t1 = _24;
    vec4 _t2 = texture2D(u_inputTexture3, uv0);
    _t2.x = 0.0;
    _t2.y = 0.0;
    _t2.z = 0.0;
    _t2.w *= 0.60000002384185791015625;
    float _51 = _t0.w;
    vec3 _57 = _19.xyz / vec3(max(_51, 9.9999997473787516355514526367188e-06));
    _t0.x = _57.x;
    _t0.y = _57.y;
    _t0.z = _57.z;
    float _65 = _t1.w;
    vec3 _70 = _24.xyz / vec3(max(_65, 9.9999997473787516355514526367188e-06));
    _t1.x = _70.x;
    _t1.y = _70.y;
    _t1.z = _70.z;
    float _78 = _t2.w;
    vec4 _80 = _t2;
    vec3 _83 = _80.xyz / vec3(max(_78, 9.9999997473787516355514526367188e-06));
    _t2.x = _83.x;
    _t2.y = _83.y;
    _t2.z = _83.z;
    vec4 _90 = _t1;
    float _93 = _t1.w;
    float _106 = _t1.w;
    float _113 = _t1.w;
    vec3 _118 = (((_90.xyz * _93) * (1.0 - _t2.w)) + ((_t2.xyz * _t2.w) * (1.0 - _106))) + (_t2.xyz * (_t2.w * _113));
    _t1.x = _118.x;
    _t1.y = _118.y;
    _t1.z = _118.z;
    _t1.w = _t2.w + (_t1.w * (1.0 - _t2.w));
    vec4 _135 = _t1;
    float _138 = _t1.w;
    float _150 = _t1.w;
    float _157 = _t1.w;
    vec3 _162 = (((_135.xyz * _138) * (1.0 - _t0.w)) + ((_t0.xyz * _t0.w) * (1.0 - _150))) + (_t0.xyz * (_t0.w * _157));
    _t1.x = _162.x;
    _t1.y = _162.y;
    _t1.z = _162.z;
    _t1.w = _t0.w + (_t1.w * (1.0 - _t0.w));
    gl_FragData[0] = clamp(_t1, vec4(0.0), vec4(1.0));
}

