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
    int u_convertAlpha;
    float2 u_scale;
    float2 u_seqTexSize;
    float4 u_ScreenParams;
    int u_cropType;
    int u_edgeType;
    float u_opacity;
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
float2 _f2(thread const float2& _p0)
{
    float2 _105 = mod(_p0, float2(1.0));
    return _105 + (float2(1.0) - step(float2(0.0), _105));
}

static inline __attribute__((always_inline))
float2 _f1(thread const float2& _p0)
{
    return abs(mod(_p0 - float2(1.0), float2(2.0)) - float2(1.0));
}

static inline __attribute__((always_inline))
float4 _f0(thread const float2& _p0, constant int& u_convertAlpha, texture2d<float> u_seqTexture, sampler u_seqTextureSmplr)
{
    if (u_convertAlpha == 0)
    {
        return u_seqTexture.sample(u_seqTextureSmplr, _p0);
    }
    float4 _t2;
    _t2.w = u_seqTexture.sample(u_seqTextureSmplr, float2(_p0.x * 0.5, _p0.y)).x;
    float _78 = _t2.w;
    float3 _79 = u_seqTexture.sample(u_seqTextureSmplr, float2((_p0.x * 0.5) + 0.5, _p0.y)).xyz * _78;
    _t2.x = _79.x;
    _t2.y = _79.y;
    _t2.z = _79.z;
    return _t2;
}

static inline __attribute__((always_inline))
float _f3(thread const float2& _p0)
{
    float2 _t4 = step(float2(0.0), _p0) * step(_p0, float2(1.0));
    return _t4.x * _t4.y;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_seqTexture [[texture(0)]], sampler u_seqTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    bool _139 = abs(buffer.u_scale.x) < 9.9999997473787516355514526367188e-05;
    bool _147;
    if (!_139)
    {
        _147 = abs(buffer.u_scale.y) < 9.9999997473787516355514526367188e-05;
    }
    else
    {
        _147 = _139;
    }
    if (_147)
    {
        out.o_fragColor = float4(0.0);
        return out;
    }
    float2 _163 = ((in.uv0 - float2(0.5)) / buffer.u_scale) + float2(0.5);
    float2 _t5 = _163;
    float _170 = buffer.u_seqTexSize.x / buffer.u_seqTexSize.y;
    float _178 = buffer.u_ScreenParams.x / buffer.u_ScreenParams.y;
    float2 _t8 = _163;
    if (buffer.u_cropType == 1)
    {
        if (_170 > _178)
        {
            _t8.y = _t5.y;
            _t8.x = ((_t5.x - 0.5) * (_178 / _170)) + 0.5;
        }
        else
        {
            _t8.x = _t5.x;
            _t8.y = ((_t5.y - 0.5) * (_170 / _178)) + 0.5;
        }
    }
    else
    {
        if (buffer.u_cropType == 2)
        {
            if (_170 < _178)
            {
                _t8.y = _t5.y;
                _t8.x = ((_t5.x - 0.5) * (_178 / _170)) + 0.5;
            }
            else
            {
                _t8.x = _t5.x;
                _t8.y = ((_t5.y - 0.5) * (_170 / _178)) + 0.5;
            }
        }
    }
    if (buffer.u_edgeType == 0)
    {
        float2 param = _t8;
        _t8 = _f2(param);
    }
    else
    {
        if (buffer.u_edgeType == 1)
        {
            float2 param_1 = _t8;
            _t8 = _f1(param_1);
        }
    }
    float2 param_2 = _t8;
    float4 _t13 = _f0(param_2, buffer.u_convertAlpha, u_seqTexture, u_seqTextureSmplr);
    if (buffer.u_edgeType == 3)
    {
        float2 param_3 = _t8;
        _t13 *= _f3(param_3);
    }
    float4 _293 = _t13;
    float4 _294 = _293 * buffer.u_opacity;
    _t13 = _294;
    out.o_fragColor = _294;
    return out;
}

