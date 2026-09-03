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
    float u_Cycle;
    float4 u_ScreenParams;
    float2 u_Offset;
    float2 u_Scale;
    float u_Rotate;
    float u_Complexity;
    float u_Evolution;
    float u_SubImpact;
    float u_SubScale;
    float u_SubRotate;
    float2 u_SubOffset;
    float u_Brightness;
    float u_Contrast;
    float blurSize;
    float edgeOffset;
    float edgeSmooth;
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
float2 _f2(thread float2& _p0, thread const float& _p1, constant float4& u_ScreenParams)
{
    _p0.y *= (u_ScreenParams.y / u_ScreenParams.x);
    float _209 = sin(_p1);
    float _212 = cos(_p1);
    _p0 -= float2(0.5);
    _p0 = float2x2(float2(_212, _209), float2(-_209, _212)) * _p0;
    _p0 += float2(0.5);
    _p0.y *= (u_ScreenParams.x / u_ScreenParams.y);
    return _p0;
}

static inline __attribute__((always_inline))
float _f0(thread const float2& _p0)
{
    float2 _50 = fract(_p0 * 1324.5179443359375);
    float2 _t0 = _50 + float2(dot(_50, _50.yx + float2(22.5410003662109375)));
    return fract((_t0.x + _t0.y) * _t0.y);
}

static inline __attribute__((always_inline))
float2 _f1(thread const float2& _p0, thread const float2& _p1, constant float& u_Cycle)
{
    float2 param = _p0;
    float _78 = _f0(param);
    float _85 = _p1.x + _78;
    float _88 = floor(_85);
    float _t4 = _88;
    float _t5 = _88 + 1.0;
    if (u_Cycle >= 2.0)
    {
        _t4 = floor(mod(_85, u_Cycle));
        _t5 = floor(mod(_85 + 1.0, u_Cycle));
    }
    float2 _123 = fract(_p0 * ((34.532001495361328125 + (_t4 * 4.412000179290771484375)) + (_p1.y * 0.80309998989105224609375)));
    float2 _133 = _123 + float2(dot(_123, _123.yx + float2(15.4340000152587890625)));
    float2 _137 = _133.yx;
    float2 _146 = float2(_78);
    float2 _160 = fract(_p0 * ((34.532001495361328125 + (_t5 * 4.412000179290771484375)) + (_p1.y * 0.80309998989105224609375)));
    float2 _169 = _160 + float2(dot(_160, _160.yx + float2(15.4340000152587890625)));
    float2 _173 = _169.yx;
    return (mix(fract((((_133 + _137) + float2(0.5230000019073486328125)) * _137) + _146), fract((((_169 + _173) + float2(0.5230000019073486328125)) * _173) + _146), float2(fract(_85))) * 2.0) - float2(1.0);
}

static inline __attribute__((always_inline))
float _f3(thread const float2& _p0, thread const float2& _p1, constant float& u_Cycle, constant float4& u_ScreenParams)
{
    float2 _259 = (float2(720.0) * u_ScreenParams.xy) / float2(fast::min(u_ScreenParams.x, u_ScreenParams.y));
    float2 _267 = floor((_p0 * _259) / float2(100.0));
    float2 _274 = fract((_p0 * _259) / float2(100.0));
    float2 param = _267 + float2(0.0);
    float2 param_1 = _p1;
    float2 param_2 = _267 + float2(1.0, 0.0);
    float2 param_3 = _p1;
    float2 param_4 = _267 + float2(0.0, 1.0);
    float2 param_5 = _p1;
    float2 param_6 = _267 + float2(1.0);
    float2 param_7 = _p1;
    float2 _t21 = ((_274 * _274) * _274) * ((_274 * ((_274 * 6.0) - float2(15.0))) + float2(10.0));
    return (mix(mix(dot(_f1(param, param_1, u_Cycle), _274 - float2(0.0)), dot(_f1(param_2, param_3, u_Cycle), _274 - float2(1.0, 0.0)), _t21.x), mix(dot(_f1(param_4, param_5, u_Cycle), _274 - float2(0.0, 1.0)), dot(_f1(param_6, param_7, u_Cycle), _274 - float2(1.0)), _t21.x), _t21.y) * 0.5) + 0.5;
}

static inline __attribute__((always_inline))
float _f4(thread float2& _p0, thread const float& _p1, thread const float& _p2, thread const float& _p3, thread const float& _p4, thread const float& _p5, thread const float& _p6, thread const float2& _p7, constant float& u_Cycle, constant float4& u_ScreenParams)
{
    float2 _384 = (float2(720.0) * u_ScreenParams.xy) / float2(fast::min(u_ScreenParams.x, u_ScreenParams.y));
    float _387 = floor(_p1);
    float _390 = fract(_p1);
    float2 param = _p0;
    float2 param_1 = float2(_p2, 1.0 + _p6);
    float _t29 = 1.0;
    float _t30 = _p3;
    float _t31 = _f3(param, param_1, u_Cycle, u_ScreenParams) * 1.0;
    for (float _t32 = 2.0; _t32 <= 10.0; _t32 += 1.0)
    {
        if (_t32 > _387)
        {
            break;
        }
        _p0 -= (_p7 / _384);
        float2 param_2 = _p0;
        float param_3 = (_p5 * 3.141592502593994140625) / 180.0;
        float2 _438 = _f2(param_2, param_3, u_ScreenParams);
        _p0 = _438;
        _p0 *= _p4;
        float2 param_4 = _p0;
        float2 param_5 = float2(_p2, 1.0 + _p6);
        float _450 = _t30;
        _t29 += _450;
        _t30 = _450 * _p3;
        _t31 += (_f3(param_4, param_5, u_Cycle, u_ScreenParams) * _450);
    }
    _p0 -= (_p7 / _384);
    float2 param_6 = _p0;
    float param_7 = (_p5 * 3.141592502593994140625) / 180.0;
    float2 _474 = _f2(param_6, param_7, u_ScreenParams);
    _p0 = _474;
    _p0 *= _p4;
    float2 param_8 = _p0;
    float2 param_9 = float2(_p2, 1.0 + _p6);
    float _493 = _t29;
    float _494 = _493 + (_t30 * _390);
    _t29 = _494;
    float _496 = _t31;
    float _500 = (_496 + ((_f3(param_8, param_9, u_Cycle, u_ScreenParams) * _t30) * _390)) / _494;
    _t31 = _500;
    return fast::clamp(_500, 0.0, 1.0);
}

static inline __attribute__((always_inline))
float _f5(thread float& _p0, thread const float& _p1, thread const float& _p2)
{
    _p0 += _p1;
    _p0 = ((_p0 - 0.5) * (_p2 + 1.0)) + 0.5;
    return _p0;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> blurImageTexture [[texture(0)]], texture2d<float> inputImageTexture [[texture(1)]], sampler blurImageTextureSmplr [[sampler(0)]], sampler inputImageTextureSmplr [[sampler(1)]])
{
    main0_out out = {};
    float2 param = (((in.v_uv - buffer.u_Offset) - float2(0.5)) * (float2(1.0) / buffer.u_Scale)) + float2(0.5);
    float param_1 = (buffer.u_Rotate * 3.141592502593994140625) / 180.0;
    float2 _545 = _f2(param, param_1, buffer.u_ScreenParams);
    float2 param_2 = _545 - float2(10.0);
    float param_3 = fast::clamp(buffer.u_Complexity, 1.0, 10.0);
    float param_4 = buffer.u_Evolution;
    float param_5 = buffer.u_SubImpact;
    float param_6 = 100.0 / buffer.u_SubScale;
    float param_7 = buffer.u_SubRotate;
    float param_8 = 0.0;
    float2 param_9 = buffer.u_SubOffset;
    float _573 = _f4(param_2, param_3, param_4, param_5, param_6, param_7, param_8, param_9, buffer.u_Cycle, buffer.u_ScreenParams);
    float _t34 = _573;
    float param_10 = _573;
    float param_11 = buffer.u_Brightness;
    float param_12 = buffer.u_Contrast;
    float _582 = _f5(param_10, param_11, param_12);
    _t34 = fast::clamp(_582, 0.0, 1.0);
    float4 _t35 = blurImageTexture.sample(blurImageTextureSmplr, in.v_uv);
    float4 _t36 = inputImageTexture.sample(inputImageTextureSmplr, in.v_uv);
    if (buffer.blurSize < 1.0)
    {
        out.o_fragColor = _t36;
        return out;
    }
    float _609 = _t35.w;
    float4 _613 = _t35;
    float3 _616 = _613.xyz / float3(_609 + 0.001000000047497451305389404296875);
    _t35.x = _616.x;
    _t35.y = _616.y;
    _t35.z = _616.z;
    float _625 = _t36.w;
    float4 _627 = _t36;
    float3 _630 = _627.xyz / float3(_625 + 0.001000000047497451305389404296875);
    _t36.x = _630.x;
    _t36.y = _630.y;
    _t36.z = _630.z;
    float _637 = _t34;
    float _641 = mix(_637, 1.0, fast::max(_t35.w, 0.001000000047497451305389404296875));
    _t34 = _641;
    _t35.w *= _641;
    float _652 = ((buffer.edgeOffset - 0.5) * 0.5) + 0.5;
    float _658 = 0.0 + (buffer.edgeSmooth * _652);
    _t35.w = smoothstep(_658, fast::max(_658, 1.0 - (buffer.edgeSmooth * (1.0 - _652))), _t35.w);
    float4 _673 = _t35;
    float _678 = _t35.w;
    float3 _683 = mix(_673.xyz, _t36.xyz, float3(_678 * _t36.w));
    _t35.x = _683.x;
    _t35.y = _683.y;
    _t35.z = _683.z;
    float _691 = _t35.w;
    float4 _692 = _t35;
    float3 _694 = _692.xyz * _691;
    _t35.x = _694.x;
    _t35.y = _694.y;
    _t35.z = _694.z;
    out.o_fragColor = _t35;
    return out;
}

