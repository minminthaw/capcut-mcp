#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float4 u_ScreenParams;
    float blurSize;
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
float _f1(thread const float& _p0, thread const float& _p1)
{
    return (0.3989399969577789306640625 * exp((((-0.5) * _p0) * _p0) / (_p1 * _p1))) / _p1;
}

static inline __attribute__((always_inline))
float _f0(thread const float2& _p0)
{
    return ((step(0.0, _p0.x) * step(0.0, _p0.y)) * step(_p0.x, 1.0)) * step(_p0.y, 1.0);
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> inputImageTexture [[texture(0)]], sampler inputImageTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 _72 = (buffer.u_ScreenParams.xy / float2(fast::min(buffer.u_ScreenParams.x, buffer.u_ScreenParams.y))) * 540.0;
    float2 _t0 = _72;
    float _t1 = buffer.blurSize;
    if (buffer.blurSize < 1.0)
    {
        _t1 = 0.0;
    }
    else
    {
        if (buffer.blurSize <= 24.0)
        {
            _t1 = 24.0;
            _t0 = _72 * (24.0 / buffer.blurSize);
        }
        else
        {
            if (buffer.blurSize <= 64.0)
            {
                _t1 = buffer.blurSize;
                _t0 = _72;
            }
            else
            {
                _t1 = 64.0;
                _t0 = _72 * (64.0 / buffer.blurSize);
            }
        }
    }
    float2 _t2 = float2(1.0) / _t0;
    float param = 0.0;
    float param_1 = 4.0;
    float _139 = _f1(param, param_1);
    float _t3 = _139;
    float _t4 = _139;
    float4 _t5 = inputImageTexture.sample(inputImageTextureSmplr, in.v_uv) * _139;
    float _157 = fast::min(buffer.blurSize, 64.0);
    for (float _t7 = 1.0; _t7 <= _157; _t7 += mix(1.0, 2.0, step(24.0, buffer.blurSize)))
    {
        if (_t7 > _t1)
        {
            break;
        }
        float param_2 = (_t7 / _t1) * 15.0;
        float param_3 = 4.0;
        float _180 = _f1(param_2, param_3);
        _t3 = _180;
        float2 param_4 = in.v_uv + float2(_t7 * _t2.x, 0.0);
        _t5 += ((inputImageTexture.sample(inputImageTextureSmplr, (in.v_uv + float2(_t7 * _t2.x, 0.0))) * _180) * _f0(param_4));
        float2 param_5 = in.v_uv - float2(_t7 * _t2.x, 0.0);
        _t5 += ((inputImageTexture.sample(inputImageTextureSmplr, (in.v_uv - float2(_t7 * _t2.x, 0.0))) * _t3) * _f0(param_5));
        _t4 += (2.0 * _t3);
    }
    float4 _238 = _t5;
    float4 _240 = _238 / float4(_t4);
    _t5 = _240;
    out.o_fragColor = _240;
    return out;
}

