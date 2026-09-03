#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float4 u_ScreenParams;
    float u_radius;
    float u_blurStep;
    float u_intensity;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 uv [[user(locn0)]];
};

static inline __attribute__((always_inline))
float3 _f0(thread const float3& _p0, thread const float3& _p1, thread const float& _p2)
{
    return fast::max(float3(1.0) - (abs(_p0 - _p1) / float3(2.5 * _p2)), float3(0.0));
}

static inline __attribute__((always_inline))
float4 _f1(texture2d<float> _p0, sampler _p0Smplr, thread const float2& _p1, thread const float& _p2, thread const float& _p3, thread const float& _p4, constant float4& u_ScreenParams)
{
    float2 _55 = float2(_p3, _p3) / u_ScreenParams.xy;
    float4 _60 = _p0.sample(_p0Smplr, _p1);
    float4 _t1 = _60;
    float4 _t2 = float4(0.0);
    float3 _t3 = float3(0.0);
    float _68 = -floor(_p2);
    for (float _t4 = _68; _t4 <= 7.0100002288818359375; _t4 += 1.0)
    {
        if (_t4 > _p2)
        {
            break;
        }
        float3 _96 = _60.xyz;
        float3 param = _96;
        float3 _99 = _p0.sample(_p0Smplr, (_p1 + (float2(_t4, 0.0) * _55))).xyz;
        float3 param_1 = _99;
        float param_2 = _p4;
        float3 _102 = _f0(param, param_1, param_2);
        float4 _107 = _t2;
        float3 _109 = _107.xyz + (_99 * _102);
        _t2.x = _109.x;
        _t2.y = _109.y;
        _t2.z = _109.z;
        _t3 += _102;
        for (float _t7 = 1.0; _t7 <= 7.0100002288818359375; _t7 += 1.0)
        {
            if (_t7 > _p2)
            {
                break;
            }
            float3 param_3 = _96;
            float3 _168 = _p0.sample(_p0Smplr, (_p1 + (float2(_t4, _t7) * _55))).xyz;
            float3 param_4 = _168;
            float param_5 = _p4;
            float3 _171 = _f0(param_3, param_4, param_5);
            float3 param_6 = _96;
            float3 _178 = _p0.sample(_p0Smplr, (_p1 + (float2(_t4, -_t7) * _55))).xyz;
            float3 param_7 = _178;
            float param_8 = _p4;
            float3 _181 = _f0(param_6, param_7, param_8);
            float4 _186 = _t2;
            float3 _188 = _186.xyz + (_168 * _171);
            _t2.x = _188.x;
            _t2.y = _188.y;
            _t2.z = _188.z;
            float4 _199 = _t2;
            float3 _201 = _199.xyz + (_178 * _181);
            _t2.x = _201.x;
            _t2.y = _201.y;
            _t2.z = _201.z;
            _t3 += (_171 + _181);
        }
    }
    return float4(fast::clamp(_t2.xyz / _t3, float3(0.0), float3(1.0)), _t1.w);
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 param = in.uv;
    float param_1 = buffer.u_radius;
    float param_2 = buffer.u_blurStep;
    float param_3 = buffer.u_intensity;
    out.o_fragColor = float4(_f1(u_inputTexture, u_inputTextureSmplr, param, param_1, param_2, param_3, buffer.u_ScreenParams));
    return out;
}

