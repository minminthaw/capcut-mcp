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
    float mirrorEdge;
    float alpha;
};

struct main0_out
{
    float4 gl_FragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> inputTex [[texture(0)]], sampler inputTexSmplr [[sampler(0)]])
{
    main0_out out = {};
    float _54 = step(buffer.mirrorEdge, 0.5);
    float2 _66 = (in.uv0 * _54) + (abs(mod(in.uv0 - float2(1.0), float2(2.0)) - float2(1.0)) * (1.0 - _54));
    float2 _104 = step(float2(0.0), _66) * step(_66, float2(1.0));
    out.gl_FragColor = (inputTex.sample(inputTexSmplr, _66) * buffer.alpha) * (_104.x * _104.y);
    return out;
}

