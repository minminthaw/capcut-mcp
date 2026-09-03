#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float2 u_LeftBottomVertex;
    float2 u_BottomLeftTangent;
    float2 u_BottomRightTangent;
    float2 u_BottomRightVertex;
    float2 u_TopLeftVertex;
    float2 u_TopLeftTangent;
    float2 u_TopRightTangent;
    float2 u_RightTopVertex;
    float2 u_LeftBottomTangent;
    float2 u_LeftTopTangent;
    float2 u_RightBottomTangent;
    float2 u_RightTopTangent;
    float4x4 u_MVP;
    float4 u_ScreenParams;
};

struct main0_out
{
    float2 v_uv [[user(locn0)]];
    float4 gl_Position [[position]];
};

struct main0_in
{
    float3 a_position [[attribute(0)]];
    float2 a_texcoord0 [[attribute(1)]];
};

static inline __attribute__((always_inline))
float2 _f0(thread const float2& _p0, thread const float2& _p1, thread const float2& _p2, thread const float2& _p3, thread const float& _p4)
{
    float2 _29 = mix(_p1, _p2, float2(_p4));
    return mix(mix(mix(_p0, _p1, float2(_p4)), _29, float2(_p4)), mix(_29, mix(_p2, _p3, float2(_p4)), float2(_p4)), float2(_p4));
}

vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
{
    main0_out out = {};
    float2 _64 = (in.a_position.xy * 0.5) + float2(0.5);
    float2 _t5 = _64;
    float2 _t6 = buffer.u_LeftBottomVertex;
    float2 _t9 = buffer.u_BottomRightVertex;
    float2 _t10 = buffer.u_TopLeftVertex;
    float2 _t13 = buffer.u_RightTopVertex;
    float2 _t14 = buffer.u_LeftBottomVertex;
    float2 _t17 = buffer.u_TopLeftVertex;
    float2 _t18 = buffer.u_BottomRightVertex;
    float2 _t21 = buffer.u_RightTopVertex;
    float2 param = buffer.u_BottomRightVertex;
    float2 param_1 = buffer.u_RightBottomTangent;
    float2 param_2 = buffer.u_RightTopTangent;
    float2 param_3 = buffer.u_RightTopVertex;
    float param_4 = _t5.y;
    float2 _124 = _f0(param, param_1, param_2, param_3, param_4);
    float2 _t22 = _124;
    float2 param_5 = buffer.u_LeftBottomVertex;
    float2 param_6 = buffer.u_LeftBottomTangent;
    float2 param_7 = buffer.u_LeftTopTangent;
    float2 param_8 = buffer.u_TopLeftVertex;
    float param_9 = _t5.y;
    float2 _137 = _f0(param_5, param_6, param_7, param_8, param_9);
    float2 _t23 = _137;
    float2 _t24 = smoothstep(float2(0.0), float2(1.0), _64.yy);
    float2 _178 = float2(mix(-mix(_t6.x, _t10.x, _t24.y), 1.0 - mix(_t9.x, _t13.x, _t24.y), _t5.x) + mix(_t23.x, _t22.x - 1.0, _t5.x), 0.0);
    float2 param_10 = _137;
    float2 param_11 = mix(buffer.u_BottomLeftTangent, buffer.u_TopLeftTangent, float2(_t24.y, _t5.y)) + _178;
    float2 param_12 = mix(buffer.u_BottomRightTangent, buffer.u_TopRightTangent, float2(_t24.y, _t5.y)) + _178;
    float2 param_13 = _124;
    float param_14 = _t5.x;
    float2 _t31 = _f0(param_10, param_11, param_12, param_13, param_14);
    float2 param_15 = buffer.u_TopLeftVertex;
    float2 param_16 = buffer.u_TopLeftTangent;
    float2 param_17 = buffer.u_TopRightTangent;
    float2 param_18 = buffer.u_RightTopVertex;
    float param_19 = _t5.x;
    float2 _230 = _f0(param_15, param_16, param_17, param_18, param_19);
    float2 _t32 = _230;
    float2 param_20 = buffer.u_LeftBottomVertex;
    float2 param_21 = buffer.u_BottomLeftTangent;
    float2 param_22 = buffer.u_BottomRightTangent;
    float2 param_23 = buffer.u_BottomRightVertex;
    float param_24 = _t5.x;
    float2 _243 = _f0(param_20, param_21, param_22, param_23, param_24);
    float2 _t33 = _243;
    float2 _t34 = smoothstep(float2(0.0), float2(1.0), _64.xx);
    float2 _281 = float2(0.0, mix(-mix(_t14.y, _t18.y, _t34.x), 1.0 - mix(_t17.y, _t21.y, _t34.x), _t5.y) + mix(_t33.y, _t32.y - 1.0, _t5.y));
    float2 param_25 = _243;
    float2 param_26 = mix(buffer.u_LeftBottomTangent, buffer.u_RightBottomTangent, float2(_t5.x, _t34.x)) + _281;
    float2 param_27 = mix(buffer.u_LeftTopTangent, buffer.u_RightTopTangent, float2(_t5.x, _t34.x)) + _281;
    float2 param_28 = _230;
    float param_29 = _t5.y;
    float2 _t41 = _f0(param_25, param_26, param_27, param_28, param_29);
    out.gl_Position = buffer.u_MVP * float4(((float2(_t31.x + 0.21400000154972076416015625, _t41.y + 0.21400000154972076416015625) * 1.39999997615814208984375) - float2(1.0)) * float2(buffer.u_ScreenParams.x / buffer.u_ScreenParams.y, 1.0), 0.0, 1.0);
    out.v_uv = in.a_texcoord0;
    out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
    return out;
}

