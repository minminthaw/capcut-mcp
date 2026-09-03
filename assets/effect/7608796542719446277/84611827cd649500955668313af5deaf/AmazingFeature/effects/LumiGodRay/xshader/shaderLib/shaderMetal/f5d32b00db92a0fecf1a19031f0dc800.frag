#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int u_displayRayOnly;
    int u_blendMode;
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
float4 _f1(thread const float4& _p0, thread const float4& _p1)
{
    float4 _t0 = float4(0.0);
    float3 _50 = _p0.xyz + _p1.xyz;
    _t0.x = _50.x;
    _t0.y = _50.y;
    _t0.z = _50.z;
    _t0.w = _p0.w + (_p1.w * (1.0 - _p0.w));
    return _t0;
}

static inline __attribute__((always_inline))
float4 _f2(thread const float4& _p0, thread const float4& _p1)
{
    float4 _t1 = float4(0.0);
    float3 _81 = fast::max(_p0.xyz, _p1.xyz);
    _t1.x = _81.x;
    _t1.y = _81.y;
    _t1.z = _81.z;
    _t1.w = _p0.w + (_p1.w * (1.0 - _p0.w));
    return _t1;
}

static inline __attribute__((always_inline))
float4 _f4(thread const float4& _p0, thread const float4& _p1)
{
    float4 _t3 = float4(0.0);
    float3 _147 = _p0.xyz * _p1.xyz;
    _t3.x = _147.x;
    _t3.y = _147.y;
    _t3.z = _147.z;
    _t3.w = _p0.w + (_p1.w * (1.0 - _p0.w));
    return _t3;
}

static inline __attribute__((always_inline))
float4 _f3(thread const float4& _p0, thread const float4& _p1)
{
    float4 _t2 = float4(0.0);
    _t2.w = _p0.w + (_p1.w * (1.0 - _p0.w));
    float _128 = _t2.w;
    float3 _132 = ((_p0.xyz * _p0.w) + (_p1.xyz * ((1.0 - _p0.w) * _p1.w))) / float3(fast::max(_128, 0.001000000047497451305389404296875));
    _t2.x = _132.x;
    _t2.y = _132.y;
    _t2.z = _132.z;
    return _t2;
}

static inline __attribute__((always_inline))
float4 _f0(thread const float4& _p0, thread const float4& _p1)
{
    return float4(1.0) - ((float4(1.0) - _p0) * (float4(1.0) - _p1));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_intexture [[texture(0)]], texture2d<float> u_mixTexture [[texture(1)]], sampler u_intextureSmplr [[sampler(0)]], sampler u_mixTextureSmplr [[sampler(1)]])
{
    main0_out out = {};
    float4 _177 = u_intexture.sample(u_intextureSmplr, in.uv0);
    float4 _182 = u_mixTexture.sample(u_mixTextureSmplr, in.uv0);
    float4 _t5 = _182;
    float4 _t6 = float4(0.0);
    if (buffer.u_displayRayOnly == 1)
    {
        _t6 = _177;
    }
    else
    {
        if (buffer.u_blendMode == 1)
        {
            float4 param = _182;
            float4 param_1 = _177;
            _t6 = _f1(param, param_1);
        }
        else
        {
            if (buffer.u_blendMode == 2)
            {
                float4 param_2 = _182;
                float4 param_3 = _177;
                _t6 = _f2(param_2, param_3);
            }
            else
            {
                if (buffer.u_blendMode == 3)
                {
                    float4 param_4 = _182;
                    float4 param_5 = _177;
                    _t6 = _f4(param_4, param_5);
                }
                else
                {
                    if (buffer.u_blendMode == 4)
                    {
                        float4 param_6 = _177;
                        float4 param_7 = _182;
                        _t6 = _f3(param_6, param_7);
                    }
                    else
                    {
                        float4 param_8 = _182;
                        float4 param_9 = _177;
                        _t6 = _f0(param_8, param_9);
                    }
                }
            }
        }
    }
    out.o_fragColor = float4(_t6.xyz, _t5.w);
    return out;
}

