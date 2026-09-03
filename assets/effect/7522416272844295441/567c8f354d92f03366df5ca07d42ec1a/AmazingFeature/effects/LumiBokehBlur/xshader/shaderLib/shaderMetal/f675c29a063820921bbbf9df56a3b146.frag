#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_intensity;
    int u_starLineNum;
    float u_starShapeIns;
    float u_scaleX;
    float u_scaleY;
    float u_quality;
    float u_regionIns;
    float u_angle;
    float u_lightIns;
    float u_baseTexWidth;
    float u_baseTexHeight;
    float u_blurSize;
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
float2x2 _f0(thread const float& _p0)
{
    float _28 = sin(_p0);
    float _31 = cos(_p0);
    return float2x2(float2(_31, -_28), float2(_28, _31));
}

static inline __attribute__((always_inline))
float4 _f1(texture2d<float> _p0, sampler _p0Smplr, thread const float2& _p1, thread const float& _p2, thread const float2& _p3, constant float& u_intensity, constant int& u_starLineNum, constant float& u_starShapeIns, constant float& u_scaleX, constant float& u_scaleY, constant float& u_quality, constant float& u_regionIns, constant float& u_angle, constant float& u_lightIns)
{
    if (u_intensity < 0.00999999977648258209228515625)
    {
        return _p0.sample(_p0Smplr, _p1);
    }
    float4 _t6 = float4(0.0);
    float4 _t8 = float4(0.0);
    float4 _t9 = float4(9.9999997473787516355514526367188e-05);
    float2 _91 = (float2(2.0) * float2(u_scaleX, u_scaleY)) * float2(_p2);
    float2 _95 = float2(1.0) / _p3;
    float _114 = fast::max(2.0, floor(4.0 / (mix(1.5, 0.5, u_intensity) * mix(3.5, 1.0, pow(u_quality, 0.60000002384185791015625)))));
    float _119 = mix(0.699999988079071044921875, 1.0, u_regionIns);
    float param = u_angle;
    float2x2 _129 = _f0(param);
    float2 _139 = (float2(0.0, 0.75) * floor(8.0)) / float2(floor(_114));
    float2 _t18 = _139;
    float _142 = float(u_starLineNum);
    float param_1 = (-3.141590118408203125) / _142;
    float2 _t20 = _139 * _f0(param_1);
    float param_2 = 3.141590118408203125 / _142;
    float2 _t21 = _t18 * _f0(param_2);
    for (int _t22 = 0; _t22 < u_starLineNum; _t22++)
    {
        for (float _t23 = 0.0; _t23 < _114; _t23 += 1.0)
        {
            float _184 = ceil(u_starShapeIns * (_114 - _t23));
            for (float _t25 = 0.0; _t25 <= _184; _t25 += 1.0)
            {
                if (((_t22 > 0) && (_t23 < 0.100000001490116119384765625)) && (_t25 < 0.100000001490116119384765625))
                {
                    continue;
                }
                float4 _234 = _p0.sample(_p0Smplr, (_p1 - (((((_t18 * _t23) + (_t20 * (((u_starShapeIns * (_114 - _t23)) / (_184 + 1.0)) * _t25))) * _91) * _129) * _95)));
                float _241 = step(_t25, _184 - 0.5);
                _t6 = fast::max(_t6, _234 * mix(1.0, _119, _241));
                float4 _261 = ((pow(_234, float4(9.0)) * 539.45001220703125) + float4(0.4000000059604644775390625)) * mix(1.0, u_regionIns, _241);
                _t8 += (_261 * _234);
                _t9 += _261;
            }
        }
        for (float _t28 = 1.0; _t28 < _114; _t28 += 1.0)
        {
            float _289 = ceil(u_starShapeIns * (_114 - _t28));
            for (float _t30 = 1.0; _t30 <= _289; _t30 += 1.0)
            {
                float4 _327 = _p0.sample(_p0Smplr, (_p1 - (((((_t18 * _t28) + (_t21 * (((u_starShapeIns * (_114 - _t28)) / (_289 + 1.0)) * _t30))) * _91) * _129) * _95)));
                float _334 = step(_t30, _289 - 0.5);
                _t6 = fast::max(_t6, _327 * mix(1.0, _119, _334));
                float4 _351 = ((pow(_327, float4(9.0)) * 539.45001220703125) + float4(0.4000000059604644775390625)) * mix(1.0, u_regionIns, _334);
                _t8 += (_351 * _327);
                _t9 += _351;
            }
        }
        float4 _379 = _p0.sample(_p0Smplr, (_p1 - ((((_t18 * (_114 - 0.20000000298023223876953125)) * _91) * _129) * _95)));
        _t6 = fast::max(_t6, _379);
        float4 _388 = (pow(_379, float4(9.0)) * 539.45001220703125) + float4(0.4000000059604644775390625);
        _t8 += (_388 * _379);
        _t9 += _388;
        float _399 = 6.28318023681640625 / _142;
        float param_3 = _399;
        _t18 *= _f0(param_3);
        float param_4 = _399;
        _t20 *= _f0(param_4);
        float param_5 = _399;
        _t21 *= _f0(param_5);
    }
    float4 _425 = fast::clamp(_t8 / _t9, float4(0.0), float4(1.0));
    return float4(mix(_425, _t6, fast::clamp(_425 * u_lightIns, float4(0.0), float4(1.0))));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTex [[texture(0)]], sampler u_inputTexSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 param = in.v_uv;
    float param_1 = buffer.u_blurSize;
    float2 param_2 = (float2(buffer.u_baseTexWidth, buffer.u_baseTexHeight) / float2(fast::min(buffer.u_baseTexWidth, buffer.u_baseTexHeight))) * 720.0;
    out.o_fragColor = _f1(u_inputTex, u_inputTexSmplr, param, param_1, param_2, buffer.u_intensity, buffer.u_starLineNum, buffer.u_starShapeIns, buffer.u_scaleX, buffer.u_scaleY, buffer.u_quality, buffer.u_regionIns, buffer.u_angle, buffer.u_lightIns);
    return out;
}

