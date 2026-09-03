#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float3 factor1;
    float4 u_ScreenParams;
    float u_scale;
    float u_scaleR;
    float u_seed;
    int u_monochrome;
    float u_scaleG;
    float u_scaleB;
    float u_Brightness;
    float u_Contrast;
    int u_combine;
    float u_Saturation;
    int u_onlyNoise;
    float u_intensity;
    float u_intensityR;
    float u_intensityG;
    float u_intensityB;
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
float2 _f1(thread const float2& _p0, thread const float& _p1)
{
    float3 _187 = fract(float3(_p0.xyx) * float3(0.103100001811981201171875, 0.10300000011920928955078125, 0.097300000488758087158203125));
    float3 _200 = _187 + float3(dot(_187, (_187.yzx + float3(33.3300018310546875)) + float3(_p1)));
    return (fract((_200.xx + _200.yz) * _200.zy) * 2.0) - float2(1.0);
}

static inline __attribute__((always_inline))
float _f2(thread const float2& _p0, thread const float& _p1, thread const float& _p2, thread const float& _p3)
{
    float2 _224 = float2(floor(_p0 / float2(_p1)));
    float2 _230 = fract(_p0 / float2(_p1));
    float2 _246 = (_230 * _230) * ((_230 * ((_230 * 6.0) - float2(15.0))) + float2(10.0));
    float2 _t11 = mix(_230 * _246, _246, float2(smoothstep(0.300000011920928955078125, 0.25, _p3)));
    float2 param = (_224 + float2(0.0)) * _p1;
    float param_1 = _p2;
    float2 param_2 = (_224 + float2(1.0, 0.0)) * _p1;
    float param_3 = _p2;
    float2 param_4 = (_224 + float2(0.0, 1.0)) * _p1;
    float param_5 = _p2;
    float2 param_6 = (_224 + float2(1.0)) * _p1;
    float param_7 = _p2;
    return mix(mix(dot(_f1(param, param_1), _230 - float2(0.0)), dot(_f1(param_2, param_3), _230 - float2(1.0, 0.0)), _t11.x), mix(dot(_f1(param_4, param_5), _230 - float2(0.0, 1.0)), dot(_f1(param_6, param_7), _230 - float2(1.0)), _t11.x), _t11.y);
}

static inline __attribute__((always_inline))
float _f3(thread const float2& _p0, thread const float& _p1, thread const float& _p2)
{
    float _320 = 2.0 / fast::max(0.100000001490116119384765625, _p1);
    float _326 = floor(_320);
    float _327 = pow(2.0, _326);
    float2 param = _p0 * 500.0;
    float param_1 = 500.0 / _327;
    float param_2 = _p2;
    float param_3 = _p1;
    float _t13 = (_f2(param, param_1, param_2, param_3) * 0.5) + 0.5;
    float2 param_4 = _p0 * 300.0;
    float param_5 = 300.0 / _327;
    float param_6 = _p2;
    float param_7 = _p1;
    _t13 = (0.60000002384185791015625 * _t13) + (0.4000000059604644775390625 * ((_f2(param_4, param_5, param_6, param_7) * 0.5) + 0.5));
    float _369 = pow(2.0, _326 + 1.0);
    float2 param_8 = _p0 * 500.0;
    float param_9 = 500.0 / _369;
    float param_10 = _p2;
    float param_11 = _p1;
    float _t15 = (_f2(param_8, param_9, param_10, param_11) * 0.5) + 0.5;
    float2 param_12 = _p0 * 300.0;
    float param_13 = 300.0 / _369;
    float param_14 = _p2;
    float param_15 = _p1;
    float _397 = _t15;
    float _401 = (0.60000002384185791015625 * _397) + (0.4000000059604644775390625 * ((_f2(param_12, param_13, param_14, param_15) * 0.5) + 0.5));
    _t15 = _401;
    float _402 = _t13;
    float _406 = mix(_402, _401, fract(_320));
    _t13 = _406;
    return _406;
}

static inline __attribute__((always_inline))
float _f4(thread float& _p0, thread const float& _p1, thread const float& _p2)
{
    _p0 += (_p1 * 0.300000011920928955078125);
    if (_p2 > 0.0)
    {
        _p0 = ((_p0 - 0.5) * ((_p2 * 10.0) + 1.0)) + 0.5;
    }
    else
    {
        _p0 = ((_p0 - 0.5) * (_p2 + 1.0)) + 0.5;
    }
    return _p0;
}

static inline __attribute__((always_inline))
float4 _f0(thread const float4& _p0, thread const float& _p1, constant float3& factor1)
{
    float3 _t0 = factor1 / float3(((factor1.x + factor1.y) + factor1.z) / 0.0199999995529651641845703125);
    float _69 = 50.0 - (_p1 * 100.0);
    float4 _t2 = _p0;
    float4 _t3;
    _t3.w = _t2.w;
    float3 _t4;
    _t4.x = 0.0;
    _t4.y = _t0.x * _69;
    _t4.z = _t0.y * _69;
    float3 _t5;
    _t5.y = _t4.yz.x;
    _t5.z = _t4.yz.y;
    _t5.x = (1.0 - _t4.z) - _t4.y;
    _t3.x = dot(_p0.xyz, _t5);
    float3 _t6;
    _t6.y = 0.0;
    _t6.x = _t0.z * _69;
    _t6.z = _t0.y * _69;
    _t5.x = _t6.xz.x;
    _t5.z = _t6.xz.y;
    _t5.y = (1.0 - _t6.x) - _t6.z;
    _t3.y = dot(_p0.xyz, _t5);
    float3 _t7;
    _t7.z = 0.0;
    _t7.x = _t0.z * _69;
    _t7.y = _t0.x * _69;
    _t5.x = _t7.xy.x;
    _t5.y = _t7.xy.y;
    _t5.z = (1.0 - _t7.x) - _t7.y;
    _t3.z = dot(_p0.xyz, _t5);
    return _t3;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_InputTexture [[texture(0)]], sampler u_InputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 _t17 = in.v_uv;
    _t17.x *= (buffer.u_ScreenParams.x / buffer.u_ScreenParams.y);
    float2 param = _t17;
    float param_1 = buffer.u_scale * buffer.u_scaleR;
    float param_2 = buffer.u_seed;
    float _463 = _f3(param, param_1, param_2);
    float _t18 = _463;
    float _t19 = _463;
    float _t20 = _463;
    if (buffer.u_monochrome == 0)
    {
        float2 param_3 = _t17;
        float param_4 = buffer.u_scale * buffer.u_scaleG;
        float param_5 = buffer.u_seed + 2.0;
        _t19 = _f3(param_3, param_4, param_5);
        float2 param_6 = _t17;
        float param_7 = buffer.u_scale * buffer.u_scaleB;
        float param_8 = buffer.u_seed + 4.0;
        _t20 = _f3(param_6, param_7, param_8);
    }
    float param_9 = _t18;
    float param_10 = buffer.u_Brightness;
    float param_11 = buffer.u_Contrast;
    float _507 = _f4(param_9, param_10, param_11);
    _t18 = _507;
    float param_12 = _t19;
    float param_13 = buffer.u_Brightness;
    float param_14 = buffer.u_Contrast;
    float _514 = _f4(param_12, param_13, param_14);
    _t19 = _514;
    float param_15 = _t20;
    float param_16 = buffer.u_Brightness;
    float param_17 = buffer.u_Contrast;
    float _521 = _f4(param_15, param_16, param_17);
    _t20 = _521;
    bool _525 = buffer.u_combine == 1;
    bool _528 = buffer.u_combine == 2;
    if (_525 || _528)
    {
        _t18 = (_t18 - 0.5) * 2.0;
        _t19 = (_t19 - 0.5) * 2.0;
        _t20 = (_t20 - 0.5) * 2.0;
    }
    else
    {
        if (buffer.u_combine == 0)
        {
            _t18 = abs(_t18 - 0.5) * 2.0;
            _t19 = abs(_t19 - 0.5) * 2.0;
            _t20 = abs(_t20 - 0.5) * 2.0;
        }
    }
    float3 _562 = float3(_t18, _t19, _t20);
    float3 _t21 = _562;
    float4 param_18 = float4(_562, 1.0);
    float param_19 = buffer.u_Saturation;
    _t21 = fast::clamp(_f0(param_18, param_19, buffer.factor1).xyz, float3(0.0), float3(1.0));
    if (buffer.u_onlyNoise == 1)
    {
        out.o_fragColor = float4(_t21, 1.0);
        return out;
    }
    float4 _598 = u_InputTexture.sample(u_InputTextureSmplr, in.v_uv);
    float4 _t22 = _598;
    float4 _t23;
    if (_525)
    {
        _t23 = float4(_t21 + _598.xyz, _t22.w);
    }
    else
    {
        if (_528)
        {
            _t23 = float4(_598.xyz * _t21, _t22.w);
        }
        else
        {
            if (buffer.u_combine == 3)
            {
                float _638;
                if (_t22.x < 0.5)
                {
                    _638 = (2.0 * _t22.x) * _t21.x;
                }
                else
                {
                    _638 = 1.0 - ((2.0 * (1.0 - _t22.x)) * (1.0 - _t21.x));
                }
                float _661;
                if (_t22.y < 0.5)
                {
                    _661 = (2.0 * _t22.y) * _t21.y;
                }
                else
                {
                    _661 = 1.0 - ((2.0 * (1.0 - _t22.y)) * (1.0 - _t21.y));
                }
                float _684;
                if (_t22.z < 0.5)
                {
                    _684 = (2.0 * _t22.z) * _t21.z;
                }
                else
                {
                    _684 = 1.0 - ((2.0 * (1.0 - _t22.z)) * (1.0 - _t21.z));
                }
                _t23 = float4(float3(_638, _661, _684), _t22.w);
            }
            else
            {
                if (buffer.u_combine == 4)
                {
                    float _757;
                    if (_t22.x < 0.5)
                    {
                        _757 = (2.0 * _t22.x) * _t21.x;
                    }
                    else
                    {
                        _757 = 1.0 - ((2.0 * (1.0 - _t22.x)) * (1.0 - _t21.x));
                    }
                    float _780;
                    if (_t22.y < 0.5)
                    {
                        _780 = (2.0 * _t22.y) * _t21.y;
                    }
                    else
                    {
                        _780 = 1.0 - ((2.0 * (1.0 - _t22.y)) * (1.0 - _t21.y));
                    }
                    float _803;
                    if (_t22.z < 0.5)
                    {
                        _803 = (2.0 * _t22.z) * _t21.z;
                    }
                    else
                    {
                        _803 = 1.0 - ((2.0 * (1.0 - _t22.z)) * (1.0 - _t21.z));
                    }
                    float3 _823 = float3(_757, _780, _803);
                    _t23 = float4(mix(_823, float3(1.0) - ((float3(1.0) - _823) * (float3(1.0) - float3(fast::max(1.0 - ((1.0 - _t21.x) / 0.5), 0.0), fast::max(1.0 - ((1.0 - _t21.y) / 0.5), 0.0), fast::max(1.0 - ((1.0 - _t21.z) / 0.5), 0.0)))), float3(0.5 * smoothstep(0.588235318660736083984375, 0.509803950786590576171875, dot(_598.xyz, float3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625))))), _t22.w);
                }
                else
                {
                    if (buffer.u_combine == 5)
                    {
                        _t23 = float4(abs(_t21 - _598.xyz), _t22.w);
                    }
                    else
                    {
                        _t23 = float4(float3(1.0) - ((float3(1.0) - _598.xyz) * (float3(1.0) - _t21)), _t22.w);
                    }
                }
            }
        }
    }
    if (_528)
    {
        _t23.x = _t22.x + ((_t23.x * buffer.u_intensity) * buffer.u_intensityR);
        _t23.y = _t22.y + ((_t23.y * buffer.u_intensity) * buffer.u_intensityG);
        _t23.z = _t22.z + ((_t23.z * buffer.u_intensity) * buffer.u_intensityB);
    }
    else
    {
        _t23.x = mix(_t22.x, _t23.x, buffer.u_intensity * buffer.u_intensityR);
        _t23.y = mix(_t22.y, _t23.y, buffer.u_intensity * buffer.u_intensityG);
        _t23.z = mix(_t22.z, _t23.z, buffer.u_intensity * buffer.u_intensityB);
    }
    out.o_fragColor = _t23;
    return out;
}

