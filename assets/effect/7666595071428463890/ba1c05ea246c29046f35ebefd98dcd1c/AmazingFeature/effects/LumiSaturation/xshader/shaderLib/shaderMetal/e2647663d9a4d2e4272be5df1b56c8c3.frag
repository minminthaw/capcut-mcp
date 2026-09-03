#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_intensity;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_uv [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _19 = u_inputTexture.sample(u_inputTextureSmplr, in.v_uv);
    float4 _t1 = _19;
    float3 _34 = float3(0.2085399925708770751953125, 0.702085971832275390625, 0.089373998343944549560546875) * (1.0 - buffer.u_intensity);
    float3 _42 = _19.xyz;
    _t1.x = dot(_42, _34 + float3(buffer.u_intensity, 0.0, 0.0));
    _t1.y = dot(_42, _34 + float3(0.0, buffer.u_intensity, 0.0));
    _t1.z = dot(_42, _34 + float3(0.0, 0.0, buffer.u_intensity));
    out.o_fragColor = fast::clamp(_t1, float4(0.0), float4(1.0));
    return out;
}

