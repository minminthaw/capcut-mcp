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
    float u_mirrorEdge;
    float u_alpha;
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
float2 _f1(thread const float2& _p0)
{
    return abs(mod(_p0 - float2(1.0), float2(2.0)) - float2(1.0));
}

static inline __attribute__((always_inline))
float _f0(thread const float2& _p0)
{
    float2 _t0 = step(float2(0.0), _p0) * step(_p0, float2(1.0));
    return _t0.x * _t0.y;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> inputTex [[texture(0)]], sampler inputTexSmplr [[sampler(0)]])
{
    main0_out out = {};
    float _54 = step(buffer.u_mirrorEdge, 0.5);
    float2 param = in.v_uv;
    float2 _66 = (in.v_uv * _54) + (_f1(param) * (1.0 - _54));
    float2 param_1 = _66;
    out.o_fragColor = (inputTex.sample(inputTexSmplr, _66) * buffer.u_alpha) * _f0(param_1);
    return out;
}

