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
    float ratio;
    float gridCount;
    float maxPixelBlock;
    float offsetStrength;
    float flashProb;
    float progress;
};

struct main0_out
{
    float4 gl_FragColor [[color(0)]];
};

struct main0_in
{
    float2 vUv [[user(vUv)]];
};

static inline __attribute__((always_inline))
float rand(thread const float2& co)
{
    return fract(sin(dot(co, float2(12.98980045318603515625, 78.233001708984375))) * 43758.546875);
}

static inline __attribute__((always_inline))
float4 transition(thread const float4& texel1, thread const float4& texel2, thread const float& progress, thread float2& vUv, constant float& ratio, constant float& gridCount, constant float& maxPixelBlock, constant float& offsetStrength, constant float& flashProb, texture2d<float> tDiffuse1, sampler tDiffuse1Smplr, texture2d<float> tDiffuse, sampler tDiffuseSmplr)
{
    float2 squareUv = vUv;
    squareUv.x *= ratio;
    float2 gridPos = squareUv * gridCount;
    float2 gridId = floor(gridPos);
    float scanRow = progress * gridCount;
    float rowDelta = scanRow - gridId.y;
    float effectWeight = smoothstep(-1.0, 0.0, rowDelta) * (1.0 - smoothstep(0.0, 1.0, rowDelta));
    float pixelScale = (maxPixelBlock / 1080.0) * effectWeight;
    float2 pixelUv = floor(vUv / float2(pixelScale)) * pixelScale;
    pixelUv = mix(vUv, pixelUv, float2(effectWeight));
    float offsetDir = (mod(gridId.y, 2.0) * 2.0) - 1.0;
    pixelUv.x += ((offsetDir * offsetStrength) * effectWeight);
    float2 param = float2(gridId.y, floor(progress * 30.0));
    float flashRand = rand(param);
    float flashOn = step(flashRand, flashProb) * effectWeight;
    float4 _132;
    if (rowDelta >= 0.0)
    {
        _132 = tDiffuse1.sample(tDiffuse1Smplr, pixelUv);
    }
    else
    {
        _132 = tDiffuse.sample(tDiffuseSmplr, pixelUv);
    }
    float4 outputColor = _132;
    outputColor = mix(outputColor, float4(1.0), float4(flashOn));
    return outputColor;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> tDiffuse1 [[texture(0)]], texture2d<float> tDiffuse [[texture(1)]], sampler tDiffuse1Smplr [[sampler(0)]], sampler tDiffuseSmplr [[sampler(1)]])
{
    main0_out out = {};
    float4 texel1 = tDiffuse.sample(tDiffuseSmplr, in.vUv);
    float4 texel2 = tDiffuse1.sample(tDiffuse1Smplr, in.vUv);
    float transitionProgress = fast::clamp((buffer.progress - 0.100000001490116119384765625) / 0.800000011920928955078125, 0.0, 1.0);
    float4 param = texel1;
    float4 param_1 = texel2;
    float param_2 = transitionProgress;
    float4 transitionColor = transition(param, param_1, param_2, in.vUv, buffer.ratio, buffer.gridCount, buffer.maxPixelBlock, buffer.offsetStrength, buffer.flashProb, tDiffuse1, tDiffuse1Smplr, tDiffuse, tDiffuseSmplr);
    float blendInFactor = smoothstep(0.0, 0.100000001490116119384765625, buffer.progress);
    float blendOutFactor = smoothstep(0.89999997615814208984375, 1.0, buffer.progress);
    float4 finalColor = mix(texel1, transitionColor, float4(blendInFactor));
    finalColor = mix(finalColor, texel2, float4(blendOutFactor));
    out.gl_FragColor = finalColor;
    return out;
}

