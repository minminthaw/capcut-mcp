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
    int u_yFlip;
    int u_convertAlpha;
    float2 u_scale;
    int u_alignmentX;
    int u_alignmentY;
    float2 u_seqTexSize;
    float4 u_ScreenParams;
    float2 u_offsetLocal;
    float2 u_offsetGlobal;
    float u_rotation;
    int u_edgeType;
    float u_opacity;
    int u_blendInput;
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
float2 _f5(thread float2& _p0, thread const float& _p1, thread const float2& _p2, thread const float2& _p3, thread const float2& _p4)
{
    _p0 -= _p2;
    _p0 -= _p3;
    _p0 /= _p4;
    _p0 += _p3;
    return _p0;
}

static inline __attribute__((always_inline))
float2 _f4(thread float2& _p0, thread const float& _p1, thread const float& _p2)
{
    _p0 -= float2(0.5);
    _p0.y /= _p2;
    float _165 = sin(_p1);
    float _168 = cos(_p1);
    _p0 = float2x2(float2(_168, _165), float2(-_165, _168)) * _p0;
    _p0.y *= _p2;
    _p0 += float2(0.5);
    return _p0;
}

static inline __attribute__((always_inline))
float2 _f2(thread const float2& _p0)
{
    float2 _128 = mod(_p0, float2(1.0));
    return _128 + (float2(1.0) - step(float2(0.0), _128));
}

static inline __attribute__((always_inline))
float2 _f1(thread const float2& _p0)
{
    return abs(mod(_p0 - float2(1.0), float2(2.0)) - float2(1.0));
}

static inline __attribute__((always_inline))
float4 _f0(thread float2& _p0, constant int& u_yFlip, constant int& u_convertAlpha, texture2d<float> u_seqTexture, sampler u_seqTextureSmplr)
{
    if (u_yFlip == 1)
    {
        _p0 = float2(_p0.x, 1.0 - _p0.y);
    }
    if (u_convertAlpha == 0)
    {
        return u_seqTexture.sample(u_seqTextureSmplr, _p0);
    }
    float4 _t2;
    _t2.w = u_seqTexture.sample(u_seqTextureSmplr, float2(_p0.x * 0.5, _p0.y)).x;
    float3 _103 = u_seqTexture.sample(u_seqTextureSmplr, float2((_p0.x * 0.5) + 0.5, _p0.y)).xyz;
    _t2.x = _103.x;
    _t2.y = _103.y;
    _t2.z = _103.z;
    return _t2;
}

static inline __attribute__((always_inline))
float _f3(thread const float2& _p0)
{
    float2 _t4 = step(float2(0.0), _p0) * step(_p0, float2(1.0));
    return _t4.x * _t4.y;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_seqTexture [[texture(0)]], texture2d<float> u_inputTexture [[texture(1)]], sampler u_seqTextureSmplr [[sampler(0)]], sampler u_inputTextureSmplr [[sampler(1)]])
{
    main0_out out = {};
    bool _215 = abs(buffer.u_scale.x) < 9.9999997473787516355514526367188e-05;
    bool _223;
    if (!_215)
    {
        _223 = abs(buffer.u_scale.y) < 9.9999997473787516355514526367188e-05;
    }
    else
    {
        _223 = _215;
    }
    if (_223)
    {
        out.o_fragColor = float4(0.0);
        return out;
    }
    float2 _t8 = in.uv0;
    float2 _t9 = float2(0.0);
    float _238 = float(buffer.u_alignmentX);
    _t9.x = mix(0.0, 0.5, step(0.5, _238)) + mix(0.0, 0.5, step(1.5, _238));
    float _254 = float(buffer.u_alignmentY);
    _t9.y = mix(0.0, 0.5, step(0.5, _254)) + mix(0.0, 0.5, step(1.5, _254));
    _t9.y = 1.0 - _t9.y;
    float _276 = buffer.u_seqTexSize.x / buffer.u_seqTexSize.y;
    float _284 = buffer.u_ScreenParams.x / buffer.u_ScreenParams.y;
    float2 _t16 = float2(0.0);
    bool _288 = _276 < _284;
    if (_288)
    {
        _t16.y = (buffer.u_offsetLocal.y * buffer.u_scale.y) + buffer.u_offsetGlobal.y;
        _t16.x = (((buffer.u_offsetLocal.x * buffer.u_scale.x) * _276) / _284) + buffer.u_offsetGlobal.x;
    }
    else
    {
        _t16.x = (buffer.u_offsetLocal.x * buffer.u_scale.x) + buffer.u_offsetGlobal.x;
        _t16.y = (((buffer.u_offsetLocal.y * buffer.u_scale.y) * _284) / _276) + buffer.u_offsetGlobal.y;
    }
    float2 param = _t8;
    float param_1 = 0.0;
    float2 param_2 = _t16;
    float2 param_3 = _t9;
    float2 param_4 = buffer.u_scale;
    float2 _347 = _f5(param, param_1, param_2, param_3, param_4);
    _t8 = _347;
    if (_288)
    {
        float _356 = _284 / _276;
        _t8.y = _t8.y;
        _t8.x = ((_t8.x - 0.5) * _356) + 0.5;
        if (buffer.u_alignmentX == 0)
        {
            _t8.x -= ((1.0 - _356) * 0.5);
        }
        else
        {
            if (buffer.u_alignmentX == 2)
            {
                _t8.x += ((1.0 - _356) * 0.5);
            }
        }
    }
    else
    {
        float _395 = _276 / _284;
        _t8.x = _t8.x;
        _t8.y = ((_t8.y - 0.5) * _395) + 0.5;
        if (buffer.u_alignmentY == 0)
        {
            _t8.y += ((1.0 - _395) * 0.5);
        }
        else
        {
            if (buffer.u_alignmentY == 2)
            {
                _t8.y -= ((1.0 - _395) * 0.5);
            }
        }
    }
    float2 param_5 = _t8;
    float param_6 = buffer.u_rotation;
    float param_7 = _276;
    float2 _436 = _f4(param_5, param_6, param_7);
    _t8 = _436;
    float2 _t19 = _436;
    if (buffer.u_edgeType == 0)
    {
        float2 param_8 = _t19;
        _t19 = _f2(param_8);
    }
    else
    {
        if (buffer.u_edgeType == 1)
        {
            float2 param_9 = _t19;
            _t19 = _f1(param_9);
        }
    }
    float2 param_10 = _t19;
    float4 _458 = _f0(param_10, buffer.u_yFlip, buffer.u_convertAlpha, u_seqTexture, u_seqTextureSmplr);
    float4 _t20 = _458;
    if (buffer.u_edgeType == 3)
    {
        float2 param_11 = _t19;
        _t20 *= _f3(param_11);
    }
    float4 _471 = _t20;
    float4 _472 = _471 * buffer.u_opacity;
    _t20 = _472;
    float _482 = _t20.w;
    float4 _490 = mix(_472, _472 + (u_inputTexture.sample(u_inputTextureSmplr, in.uv0) * (1.0 - _482)), float4(float(buffer.u_blendInput)));
    _t20 = _490;
    out.o_fragColor = _490;
    return out;
}

