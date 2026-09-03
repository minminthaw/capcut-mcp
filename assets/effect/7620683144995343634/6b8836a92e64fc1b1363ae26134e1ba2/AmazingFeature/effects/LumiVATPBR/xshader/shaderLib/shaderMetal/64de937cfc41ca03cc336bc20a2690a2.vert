#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float3 u_minValues;
    float3 u_maxValues;
    float u_displayFrame;
    float u_frameCount;
    float u_yResolution;
    int u_absoluteNormal;
    float4x4 u_MVP;
    float4x4 u_Model;
    float4x4 u_TransposeInvModel;
};

struct main0_out
{
    float3 v_posWS [[user(locn0)]];
    float3 v_nDirWS [[user(locn1)]];
    float3 v_tDirWS [[user(locn2)]];
    float3 v_bDirWS [[user(locn3)]];
    float2 v_uv0 [[user(locn4)]];
    float2 v_uv1 [[user(locn5)]];
    float4 gl_Position [[position]];
};

struct main0_in
{
    float3 a_position [[attribute(0)]];
    float2 a_uv0 [[attribute(1)]];
    float2 a_uv1 [[attribute(2)]];
};

static inline __attribute__((always_inline))
float3 _f0(thread const float3& _p0, thread const bool& _p1, constant float3& u_minValues, constant float3& u_maxValues)
{
    float2 _20;
    if (_p1)
    {
        _20 = float2(1.0, -1.0);
    }
    else
    {
        _20 = float2(u_minValues.x, u_maxValues.x);
    }
    float2 _t0 = _20;
    float2 _t1 = float2(u_minValues.y, u_maxValues.y);
    float2 _t2 = float2(u_minValues.z, u_maxValues.z);
    return float3(mix(_t0.x, _t0.y, _p0.x), mix(_t1.x, _t1.y, _p0.y), mix(_t2.x, _t2.y, _p0.z));
}

vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_vatPosTex [[texture(0)]], texture2d<float> u_vatNormTex [[texture(1)]], sampler u_vatPosTexSmplr [[sampler(0)]], sampler u_vatNormTexSmplr [[sampler(1)]])
{
    main0_out out = {};
    float2 _110 = float2(in.a_uv1.x, (1.0 - in.a_uv1.y) + ((fract(buffer.u_displayFrame / buffer.u_frameCount) * (buffer.u_frameCount - 1.0)) / buffer.u_yResolution));
    float3 param = u_vatPosTex.sample(u_vatPosTexSmplr, _110, level(0.0)).xyz;
    bool param_1 = false;
    float3 _t11 = (u_vatNormTex.sample(u_vatNormTexSmplr, _110, level(0.0)).xyz * 2.0) - float3(1.0);
    if (buffer.u_absoluteNormal == 1)
    {
        _t11 = abs(_t11);
    }
    float4 _166 = float4(in.a_position + _f0(param, param_1, buffer.u_minValues, buffer.u_maxValues), 1.0);
    out.gl_Position = buffer.u_MVP * _166;
    out.v_posWS = (buffer.u_Model * _166).xyz;
    out.v_nDirWS = (buffer.u_TransposeInvModel * float4(_t11, 0.0)).xyz;
    float3 _191 = fast::normalize(out.v_nDirWS);
    float3 _212 = fast::normalize(cross(select(float3(1.0, 0.0, 0.0), float3(0.0, 1.0, 0.0), bool3(abs(dot(_191, float3(0.0, 1.0, 0.0))) < 0.89999997615814208984375)), _191));
    out.v_tDirWS = fast::normalize(_212 - (_191 * dot(_212, _191)));
    out.v_bDirWS = fast::normalize(cross(_191, out.v_tDirWS));
    out.v_uv0 = in.a_uv0;
    out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
    return out;
}

