#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float4 u_shadowColor;
    float4 u_middleColor;
    float4 u_highlightColor;
    float u_oriAlpha;
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
float _f0(thread const float3& _p0)
{
    return ((_p0.x * 0.2989999949932098388671875) + (_p0.y * 0.58700001239776611328125)) + (_p0.z * 0.114000000059604644775390625);
}

static inline __attribute__((always_inline))
float4 _f1(thread const float4& _p0, thread const float& _p1, constant float4& u_shadowColor, constant float4& u_middleColor, constant float4& u_highlightColor)
{
    float3 param = _p0.xyz;
    float _45 = _f0(param);
    float4 _t1 = _p0;
    float3 _70 = mix(mix(u_shadowColor, u_middleColor, float4(_45 / 0.5)), mix(u_middleColor, u_highlightColor, float4((_45 - 0.5) / 0.5)), float4(step(0.5, _45))).xyz;
    _t1.x = _70.x;
    _t1.y = _70.y;
    _t1.z = _70.z;
    float4 _77 = _t1;
    float4 _81 = mix(_77, _p0, float4(_p1));
    _t1 = _81;
    return _81;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_InputTexture [[texture(0)]], sampler u_InputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _95 = u_InputTexture.sample(u_InputTextureSmplr, in.v_uv);
    float4 _t2 = _95;
    float _100 = _t2.w;
    float3 _104 = _95.xyz / float3(fast::max(_100, 9.9999997473787516355514526367188e-05));
    _t2.x = _104.x;
    _t2.y = _104.y;
    _t2.z = _104.z;
    float4 param = _t2;
    float param_1 = buffer.u_oriAlpha;
    float4 _118 = _f1(param, param_1, buffer.u_shadowColor, buffer.u_middleColor, buffer.u_highlightColor);
    float4 _t3 = _118;
    float _120 = _t3.w;
    float3 _123 = _118.xyz * _120;
    _t3.x = _123.x;
    _t3.y = _123.y;
    _t3.z = _123.z;
    out.o_fragColor = _t3;
    return out;
}

