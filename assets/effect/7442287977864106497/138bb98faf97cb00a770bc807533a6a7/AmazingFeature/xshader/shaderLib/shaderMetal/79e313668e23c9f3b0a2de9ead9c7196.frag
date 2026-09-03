#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], texture2d<float> u_inputTexture [[texture(0)]], texture2d<float> u_inputTexture2 [[texture(1)]], texture2d<float> u_inputTexture3 [[texture(2)]], sampler u_inputTextureSmplr [[sampler(0)]], sampler u_inputTexture2Smplr [[sampler(1)]], sampler u_inputTexture3Smplr [[sampler(2)]])
{
    main0_out out = {};
    float4 _19 = u_inputTexture.sample(u_inputTextureSmplr, in.uv0);
    float4 _t0 = _19;
    float4 _24 = u_inputTexture2.sample(u_inputTexture2Smplr, in.uv0);
    float4 _t1 = _24;
    float4 _t2 = u_inputTexture3.sample(u_inputTexture3Smplr, in.uv0);
    _t2.x = 0.0;
    _t2.y = 0.0;
    _t2.z = 0.0;
    _t2.w *= 0.60000002384185791015625;
    float _51 = _t0.w;
    float3 _57 = _19.xyz / float3(fast::max(_51, 9.9999997473787516355514526367188e-06));
    _t0.x = _57.x;
    _t0.y = _57.y;
    _t0.z = _57.z;
    float _65 = _t1.w;
    float3 _70 = _24.xyz / float3(fast::max(_65, 9.9999997473787516355514526367188e-06));
    _t1.x = _70.x;
    _t1.y = _70.y;
    _t1.z = _70.z;
    float _78 = _t2.w;
    float4 _80 = _t2;
    float3 _83 = _80.xyz / float3(fast::max(_78, 9.9999997473787516355514526367188e-06));
    _t2.x = _83.x;
    _t2.y = _83.y;
    _t2.z = _83.z;
    float4 _90 = _t1;
    float _93 = _t1.w;
    float _106 = _t1.w;
    float _113 = _t1.w;
    float3 _118 = (((_90.xyz * _93) * (1.0 - _t2.w)) + ((_t2.xyz * _t2.w) * (1.0 - _106))) + (_t2.xyz * (_t2.w * _113));
    _t1.x = _118.x;
    _t1.y = _118.y;
    _t1.z = _118.z;
    _t1.w = _t2.w + (_t1.w * (1.0 - _t2.w));
    float4 _135 = _t1;
    float _138 = _t1.w;
    float _150 = _t1.w;
    float _157 = _t1.w;
    float3 _162 = (((_135.xyz * _138) * (1.0 - _t0.w)) + ((_t0.xyz * _t0.w) * (1.0 - _150))) + (_t0.xyz * (_t0.w * _157));
    _t1.x = _162.x;
    _t1.y = _162.y;
    _t1.z = _162.z;
    _t1.w = _t0.w + (_t1.w * (1.0 - _t0.w));
    out.o_fragColor = fast::clamp(_t1, float4(0.0), float4(1.0));
    return out;
}

