#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float gridSize;
    float collapseStrength;
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
float4 transition(thread const float4& texel1, thread const float4& texel2, thread const float& progress, thread float2& vUv, constant float& gridSize, constant float& collapseStrength, texture2d<float> tDiffuse1, sampler tDiffuse1Smplr)
{
    float2 gridCoord = floor(vUv / float2(gridSize)) * gridSize;
    float2 centerOffset = (gridCoord + float2(gridSize * 0.5)) - vUv;
    float collapseFactor = 1.0 - (progress * collapseStrength);
    collapseFactor = fast::max(0.0, collapseFactor);
    float2 sampleCoord = vUv + (centerOffset * collapseFactor);
    sampleCoord = fast::clamp(sampleCoord, float2(0.0), float2(1.0));
    float4 sampledColor = tDiffuse1.sample(tDiffuse1Smplr, sampleCoord);
    return mix(texel1, sampledColor, float4(progress));
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
    float4 transitionColor = transition(param, param_1, param_2, in.vUv, buffer.gridSize, buffer.collapseStrength, tDiffuse1, tDiffuse1Smplr);
    float blendInFactor = smoothstep(0.0, 0.100000001490116119384765625, buffer.progress);
    float blendOutFactor = smoothstep(0.89999997615814208984375, 1.0, buffer.progress);
    float4 finalColor = mix(texel1, transitionColor, float4(blendInFactor));
    finalColor = mix(finalColor, texel2, float4(blendOutFactor));
    out.gl_FragColor = finalColor;
    return out;
}

