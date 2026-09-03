#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float glowFromAlpha;
    float threshold;
    float3 color;
};

struct main0_out
{
    float4 gl_FragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> inputTexture [[texture(0)]], sampler inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _44 = inputTexture.sample(inputTextureSmplr, in.uv0);
    float3 _53 = mix(_44.xyz, float3(1.0), float3(buffer.glowFromAlpha));
    float _57 = _53.x;
    float4 _168 = _44;
    _168.x = _57;
    float _60 = _53.y;
    float4 _170 = _168;
    _170.y = _60;
    float _63 = _53.z;
    float4 _172 = _170;
    _172.z = _63;
    float _71 = buffer.threshold + buffer.color.x;
    float _179;
    if (_57 <= _71)
    {
        _179 = 0.0;
    }
    else
    {
        _179 = (_57 - _71) / (1.0 - _71);
    }
    float _81 = buffer.threshold + buffer.color.y;
    float _180;
    if (_60 <= _81)
    {
        _180 = 0.0;
    }
    else
    {
        _180 = (_60 - _81) / (1.0 - _81);
    }
    float _91 = buffer.threshold + buffer.color.z;
    float _181;
    if (_63 <= _91)
    {
        _181 = 0.0;
    }
    else
    {
        _181 = (_63 - _91) / (1.0 - _91);
    }
    out.gl_FragColor = _172 * (((_179 + _180) + _181) / fast::max((_57 + _60) + _63, 9.9999999747524270787835121154785e-07));
    return out;
}

