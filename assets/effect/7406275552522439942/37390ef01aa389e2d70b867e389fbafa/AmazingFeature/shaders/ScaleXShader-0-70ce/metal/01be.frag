#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct main0_out
{
    float4 gl_FragColor [[color(0)]];
};

static inline __attribute__((always_inline))
float4 vec2ToVec4(thread const float2& val)
{
    float a = floor(val.x * 255.0) / 255.0;
    float b = fract(val.x * 255.0);
    float c = floor(val.y * 255.0) / 255.0;
    float d = fract(val.y * 255.0);
    return float4(a, b, c, d);
}

fragment main0_out main0()
{
    main0_out out = {};
    float2 param = float2(0.5);
    out.gl_FragColor = vec2ToVec4(param);
    return out;
}

