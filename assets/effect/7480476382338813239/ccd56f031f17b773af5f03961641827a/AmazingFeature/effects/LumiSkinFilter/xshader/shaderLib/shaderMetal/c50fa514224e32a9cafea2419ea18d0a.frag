#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_skinIntensity;
    float u_bgIntensity;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_uv [[user(locn0)]];
};

static inline __attribute__((always_inline))
float3 _f0(texture2d<float> _p0, sampler _p0Smplr, thread float3& _p1)
{
    _p1 *= 63.0;
    float2 _33 = float2(floor(_p1.z), ceil(_p1.z));
    float2 _t1 = _33;
    float2 _38 = floor(_33 * 0.125);
    float4 _t4 = (float4(_33 - (_38 * 8.0), _38).xzyw * 0.125) + float4(((_p1.xy + float2(0.5)) * 0.001953125).xyxy);
    return mix(_p0.sample(_p0Smplr, float2(_t4.x, _t4.y)).xyz, _p0.sample(_p0Smplr, float2(_t4.z, _t4.w)).xyz, float3(_p1.z - _t1.x));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], texture2d<float> u_maskTex [[texture(1)]], texture2d<float> u_skinLut [[texture(2)]], texture2d<float> u_bgLut [[texture(3)]], sampler u_inputTextureSmplr [[sampler(0)]], sampler u_maskTexSmplr [[sampler(1)]], sampler u_skinLutSmplr [[sampler(2)]], sampler u_bgLutSmplr [[sampler(3)]])
{
    main0_out out = {};
    float4 _111 = u_inputTexture.sample(u_inputTextureSmplr, in.v_uv);
    float4 _t8 = _111;
    float4 _t9 = u_maskTex.sample(u_maskTexSmplr, float2(in.v_uv.x, 1.0 - in.v_uv.y));
    float3 _139 = (_111 * _t9.w).xyz;
    float3 param = _139;
    float3 _140 = _f0(u_skinLut, u_skinLutSmplr, param);
    float3 _145 = (_111 * (1.0 - _t9.w)).xyz;
    float3 param_1 = _145;
    float3 _146 = _f0(u_bgLut, u_bgLutSmplr, param_1);
    out.o_fragColor = float4(mix(_139, _140, float3(buffer.u_skinIntensity)) + mix(_145, _146, float3(buffer.u_bgIntensity)), _t8.w);
    return out;
}

