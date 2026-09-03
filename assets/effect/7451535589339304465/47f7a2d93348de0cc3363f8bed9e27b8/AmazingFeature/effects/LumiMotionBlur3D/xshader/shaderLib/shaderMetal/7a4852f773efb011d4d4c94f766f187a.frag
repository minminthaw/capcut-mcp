#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

// Implementation of the GLSL mod() function, which is slightly different than Metal fmod()
template<typename Tx, typename Ty>
inline Tx mod(Tx x, Ty y)
{
    return x - y * floor(x / y);
}

struct buffer_t
{
    int u_skipSample;
    float4x4 u_mvMat0;
    float4x4 u_pMat0;
    float u_mirrorEdge;
    float u_alpha;
    float4x4 u_mvMat1;
    float4x4 u_pMat1;
    float4x4 u_mvMat2;
    float4x4 u_pMat2;
    float4x4 u_mvMat3;
    float4x4 u_pMat3;
    float4x4 u_mvMat4;
    float4x4 u_pMat4;
    float4x4 u_mvMat5;
    float4x4 u_pMat5;
    float u_samples;
    float u_dither;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(locn0)]];
};

static inline __attribute__((always_inline))
float4 _f1(thread const float3& _p0, thread const float3& _p1, thread const float3& _p2, thread const float3& _p3, thread const float3& _p4)
{
    float3 _67 = _p3 - _p2;
    float3 _71 = _p4 - _p2;
    float3 _75 = cross(_p1, _71);
    float _79 = dot(_67, _75);
    if (_79 <= 1.0000000116860974230803549289703e-07)
    {
        return float4(-1.0);
    }
    float3 _92 = _p0 - _p2;
    float _98 = dot(_92, _75) / _79;
    if ((_98 < 0.0) || (_98 > 1.0))
    {
        return float4(-1.0);
    }
    float3 _111 = cross(_92, _67);
    float _117 = dot(_p1, _111) / _79;
    bool _119 = _117 < 0.0;
    bool _127;
    if (!_119)
    {
        _127 = (_98 + _117) > 1.0;
    }
    else
    {
        _127 = _119;
    }
    if (_127)
    {
        return float4(-1.0);
    }
    return float4(_98, _117, dot(_71, _111) / _79, 1.0);
}

static inline __attribute__((always_inline))
float2 _f2(thread const float4x4& _p0, thread const float4x4& _p1, thread const float2& _p2)
{
    float4 _171 = _p1 * float4((_p2 * 2.0) - float2(1.0), 0.0, 1.0);
    float4 _t13 = _171;
    float3 _188 = fast::normalize((_171.xyz / float3(_t13.w)) - float3(0.0));
    float3 _191 = (_p0 * float4(10.0, -10.0, 0.0, 1.0)).xyz;
    float3 _194 = _191 + float3(9.9999997473787516355514526367188e-06, 0.0, 0.0);
    float3 _196 = (_p0 * float4(-10.0, 10.0, 0.0, 1.0)).xyz;
    float3 _198 = _196 + float3(0.0, 9.9999997473787516355514526367188e-06, 0.0);
    float3 param = float3(0.0);
    float3 param_1 = _188;
    float3 _205 = (_p0 * float4(-10.0, -10.0, 0.0, 1.0)).xyz;
    float3 param_2 = _205;
    float3 param_3 = _194;
    float3 param_4 = _198;
    float4 _t17 = _f1(param, param_1, param_2, param_3, param_4);
    float3 _212 = _196 - float3(9.9999997473787516355514526367188e-06, 0.0, 0.0);
    float3 _215 = _191 - float3(0.0, 9.9999997473787516355514526367188e-06, 0.0);
    float3 param_5 = float3(0.0);
    float3 param_6 = _188;
    float3 param_7 = _212;
    float3 param_8 = _215;
    float3 _224 = (_p0 * float4(10.0, 10.0, 0.0, 1.0)).xyz;
    float3 param_9 = _224;
    float4 _t18 = _f1(param_5, param_6, param_7, param_8, param_9);
    float3 param_10 = float3(0.0);
    float3 param_11 = _188;
    float3 param_12 = _205;
    float3 param_13 = _198;
    float3 param_14 = _194;
    float4 _t19 = _f1(param_10, param_11, param_12, param_13, param_14);
    float3 param_15 = float3(0.0);
    float3 param_16 = _188;
    float3 param_17 = _212;
    float3 param_18 = _224;
    float3 param_19 = _215;
    float4 _t20 = _f1(param_15, param_16, param_17, param_18, param_19);
    float2 _398 = (((((((float2(-4.5) * ((1.0 - _t17.x) - _t17.y)) + (float2(5.5, -4.5) * _t17.x)) + (float2(-4.5, 5.5) * _t17.y)) * step(0.0, _t17.w)) + ((((float2(-4.5, 5.5) * ((1.0 - _t18.x) - _t18.y)) + (float2(5.5, -4.5) * _t18.x)) + (float2(5.5) * _t18.y)) * (step(_t17.w, 0.0) * step(0.0, _t18.w)))) + ((((float2(-4.5) * ((1.0 - _t19.x) - _t19.y)) + (float2(-4.5, 5.5) * _t19.x)) + (float2(5.5, -4.5) * _t19.y)) * ((step(_t17.w, 0.0) * step(_t18.w, 0.0)) * step(0.0, _t19.w)))) + ((((float2(-4.5, 5.5) * ((1.0 - _t20.x) - _t20.y)) + (float2(5.5) * _t20.x)) + (float2(5.5, -4.5) * _t20.y)) * (((step(_t17.w, 0.0) * step(_t18.w, 0.0)) * step(_t19.w, 0.0)) * step(0.0, _t20.w)))) + (float2(-10000.0) * (((step(_t17.w, 0.0) * step(_t18.w, 0.0)) * step(_t19.w, 0.0)) * step(_t20.w, 0.0)));
    return _398;
}

static inline __attribute__((always_inline))
float2 _f0(thread const float2& _p0)
{
    return abs(mod(_p0 - float2(1.0), float2(2.0)) - float2(1.0));
}

static inline __attribute__((always_inline))
float _f3(thread const float2& _p0)
{
    return ((step(0.0, _p0.x) * step(0.0, _p0.y)) * step(_p0.x, 1.0)) * step(_p0.y, 1.0);
}

static inline __attribute__((always_inline))
float _f5(thread const float& _p0, thread const float& _p1)
{
    float2 _500 = fract(float2(_p0, _p1) * 13.5170001983642578125);
    float2 _t26 = _500 + float2(dot(_500, _500.yx + float2(22.5410003662109375)));
    return fract((_t26.x + _t26.y) * _t26.y);
}

static inline __attribute__((always_inline))
float2 _f4(thread const float& _p0, thread const float2& _p1, thread const float2& _p2, thread const float2& _p3, thread const float2& _p4, thread const float2& _p5, thread const float2& _p6)
{
    return ((((mix(_p1, _p2, float2(_p0 * 5.0)) * step(_p0, 0.20000000298023223876953125)) + ((mix(_p2, _p3, float2((_p0 * 5.0) - 1.0)) * (1.0 - step(_p0, 0.20000000298023223876953125))) * step(_p0, 0.4000000059604644775390625))) + ((mix(_p3, _p4, float2((_p0 * 5.0) - 2.0)) * (1.0 - step(_p0, 0.4000000059604644775390625))) * step(_p0, 0.60000002384185791015625))) + ((mix(_p4, _p5, float2((_p0 * 5.0) - 3.0)) * (1.0 - step(_p0, 0.60000002384185791015625))) * step(_p0, 0.800000011920928955078125))) + (mix(_p5, _p6, float2((_p0 * 5.0) - 4.0)) * (1.0 - step(_p0, 0.800000011920928955078125)));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTex [[texture(0)]], sampler u_inputTexSmplr [[sampler(0)]])
{
    main0_out out = {};
    if (buffer.u_skipSample == 1)
    {
        float4x4 param = buffer.u_mvMat0;
        float4x4 param_1 = buffer.u_pMat0;
        float2 param_2 = in.uv0;
        float2 _542 = _f2(param, param_1, param_2);
        float _547 = step(buffer.u_mirrorEdge, 0.5);
        float2 param_3 = _542;
        float2 _557 = (_542 * _547) + (_f0(param_3) * (1.0 - _547));
        float2 param_4 = _557;
        out.o_fragColor = (u_inputTex.sample(u_inputTexSmplr, _557) * buffer.u_alpha) * _f3(param_4);
        return out;
    }
    float4x4 param_5 = buffer.u_mvMat0;
    float4x4 param_6 = buffer.u_pMat0;
    float2 param_7 = in.uv0;
    float2 _582 = _f2(param_5, param_6, param_7);
    float4x4 param_8 = buffer.u_mvMat1;
    float4x4 param_9 = buffer.u_pMat1;
    float2 param_10 = in.uv0;
    float2 _592 = _f2(param_8, param_9, param_10);
    float4x4 param_11 = buffer.u_mvMat2;
    float4x4 param_12 = buffer.u_pMat2;
    float2 param_13 = in.uv0;
    float2 _602 = _f2(param_11, param_12, param_13);
    float4x4 param_14 = buffer.u_mvMat3;
    float4x4 param_15 = buffer.u_pMat3;
    float2 param_16 = in.uv0;
    float2 _612 = _f2(param_14, param_15, param_16);
    float4x4 param_17 = buffer.u_mvMat4;
    float4x4 param_18 = buffer.u_pMat4;
    float2 param_19 = in.uv0;
    float2 _622 = _f2(param_17, param_18, param_19);
    float4x4 param_20 = buffer.u_mvMat5;
    float4x4 param_21 = buffer.u_pMat5;
    float2 param_22 = in.uv0;
    float2 _632 = _f2(param_20, param_21, param_22);
    float4 _t34 = float4(0.0);
    for (float _t35 = 0.0; _t35 <= 256.0; _t35 += 1.0)
    {
        if (_t35 >= buffer.u_samples)
        {
            break;
        }
        float _t36 = _t35 / (buffer.u_samples - 1.0);
        float param_23 = _t35 + in.uv0.x;
        float param_24 = _t35 * in.uv0.y;
        float _674 = _t36;
        float _675 = _674 + ((buffer.u_dither * (_f5(param_23, param_24) - 0.5)) / buffer.u_samples);
        _t36 = _675;
        float param_25 = _675;
        float2 param_26 = _582;
        float2 param_27 = _592;
        float2 param_28 = _602;
        float2 param_29 = _612;
        float2 param_30 = _622;
        float2 param_31 = _632;
        float2 _691 = _f4(param_25, param_26, param_27, param_28, param_29, param_30, param_31);
        float _693 = step(buffer.u_mirrorEdge, 0.5);
        float2 param_32 = _691;
        float2 _703 = (_691 * _693) + (_f0(param_32) * (1.0 - _693));
        float2 param_33 = _703;
        _t34 += ((u_inputTex.sample(u_inputTexSmplr, _703) * buffer.u_alpha) * _f3(param_33));
    }
    float4 _718 = _t34;
    float4 _720 = _718 / float4(buffer.u_samples);
    _t34 = _720;
    out.o_fragColor = _720;
    return out;
}

