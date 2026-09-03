#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int u_thresholdType;
    float u_thresholdLow;
    float u_thresholdHigh;
    float u_thresholdSmooth;
    float u_grayScale;
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
float _f3(thread float& _p0, thread const float& _p1, thread const float& _p2)
{
    if ((_p0 <= _p1) || (_p0 > _p2))
    {
        _p0 = 0.0;
    }
    else
    {
        _p0 = (_p0 - _p1) / (1.0 - _p1);
    }
    return _p0;
}

static inline __attribute__((always_inline))
float4 _f4(thread float4& _p0, thread const float& _p1, thread const float& _p2)
{
    float param = _p0.x;
    float param_1 = _p1;
    float param_2 = _p2;
    float _154 = _f3(param, param_1, param_2);
    float param_3 = _p0.y;
    float param_4 = _p1;
    float param_5 = _p2;
    float _163 = _f3(param_3, param_4, param_5);
    float param_6 = _p0.z;
    float param_7 = _p1;
    float param_8 = _p2;
    float _172 = _f3(param_6, param_7, param_8);
    float _180 = _p0.x;
    float _182 = _p0.y;
    float _185 = _p0.z;
    float4 _190 = _p0;
    float3 _192 = _190.xyz * (((_154 + _163) + _172) / fast::max((_180 + _182) + _185, 9.9999997473787516355514526367188e-06));
    _p0.x = _192.x;
    _p0.y = _192.y;
    _p0.z = _192.z;
    return _p0;
}

static inline __attribute__((always_inline))
float _f1(thread float& _p0, thread const float& _p1, thread const float& _p2, thread const float& _p3)
{
    if (_p0 <= _p1)
    {
        _p0 = ((_p3 * _p0) * _p0) / fast::max(_p1, 9.9999997473787516355514526367188e-06);
    }
    else
    {
        if (_p0 > _p2)
        {
            _p0 = _p3 * (((_p0 * _p0) - (_p2 * _p0)) + _p2);
        }
    }
    return _p0;
}

static inline __attribute__((always_inline))
float4 _f2(thread float4& _p0, thread const float& _p1, thread const float& _p2, thread const float& _p3)
{
    float param = _p0.x;
    float param_1 = _p1;
    float param_2 = _p2;
    float param_3 = _p3;
    float _96 = _f1(param, param_1, param_2, param_3);
    _p0.x = _96;
    float param_4 = _p0.y;
    float param_5 = _p1;
    float param_6 = _p2;
    float param_7 = _p3;
    float _108 = _f1(param_4, param_5, param_6, param_7);
    _p0.y = _108;
    float param_8 = _p0.z;
    float param_9 = _p1;
    float param_10 = _p2;
    float param_11 = _p3;
    float _120 = _f1(param_8, param_9, param_10, param_11);
    _p0.z = _120;
    return _p0;
}

static inline __attribute__((always_inline))
float _f0(thread const float3& _p0)
{
    return dot(_p0, float3(0.2125999927520751953125, 0.715200006961822509765625, 0.072200000286102294921875));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _t4 = u_inputTexture.sample(u_inputTextureSmplr, in.v_uv);
    if (buffer.u_thresholdType == 0)
    {
        float4 param = _t4;
        float param_1 = buffer.u_thresholdLow;
        float param_2 = buffer.u_thresholdHigh;
        float4 _230 = _f4(param, param_1, param_2);
        _t4 = _230;
    }
    else
    {
        float4 param_3 = _t4;
        float param_4 = buffer.u_thresholdLow;
        float param_5 = buffer.u_thresholdHigh;
        float param_6 = buffer.u_thresholdSmooth;
        float4 _241 = _f2(param_3, param_4, param_5, param_6);
        _t4 = _241;
        float3 param_7 = _241.xyz;
        float4 _247 = _t4;
        float3 _254 = mix(_247.xyz, float3(_f0(param_7)), float3(buffer.u_grayScale));
        _t4.x = _254.x;
        _t4.y = _254.y;
        _t4.z = _254.z;
    }
    out.o_fragColor = _t4;
    return out;
}

