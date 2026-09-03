#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float ratio;
    float blockCount;
    float blockThickness;
    float driftStrength;
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
float4 transition(thread const float4& texel1, thread const float4& texel2, thread const float& progress, thread float2& vUv, constant float& ratio, constant float& blockCount, constant float& blockThickness, constant float& driftStrength)
{
    float2 scaledUV = vUv;
    scaledUV.x *= ratio;
    float2 screenCenter = float2(0.5 * ratio, 0.5);
    float2 blockGrid = scaledUV * blockCount;
    float2 blockId = floor(blockGrid);
    float2 blockLocalUV = fract(blockGrid);
    float2 blockCenter = (blockId + float2(0.5)) / float2(blockCount);
    blockCenter.x *= ratio;
    float distToCenter = length(blockCenter - screenCenter) / length(screenCenter);
    float blockAnimProgress = fast::clamp((progress * 1.5) - (distToCenter * 0.5), 0.0, 1.0);
    float driftFactor = smoothstep(0.0, 0.4000000059604644775390625, blockAnimProgress) - smoothstep(0.60000002384185791015625, 1.0, blockAnimProgress);
    float randSeedX = fract(sin(dot(blockId, float2(12.98980045318603515625, 78.233001708984375))) * 43758.546875);
    float randSeedY = fract(sin(dot(blockId, float2(34.23400115966796875, 65.878997802734375))) * 23456.7890625);
    float2 driftDir = fast::normalize(float2(randSeedX - 0.5, randSeedY - 0.5));
    float2 edgeSize = float2((blockThickness * driftFactor) * driftStrength);
    bool _128 = blockLocalUV.x < edgeSize.x;
    bool _134;
    if (_128)
    {
        _134 = driftDir.x < 0.0;
    }
    else
    {
        _134 = _128;
    }
    bool _150;
    if (!_134)
    {
        bool _143 = blockLocalUV.x > (1.0 - edgeSize.x);
        bool _149;
        if (_143)
        {
            _149 = driftDir.x > 0.0;
        }
        else
        {
            _149 = _143;
        }
        _150 = _149;
    }
    else
    {
        _150 = _134;
    }
    bool _166;
    if (!_150)
    {
        bool _159 = blockLocalUV.y < edgeSize.y;
        bool _165;
        if (_159)
        {
            _165 = driftDir.y < 0.0;
        }
        else
        {
            _165 = _159;
        }
        _166 = _165;
    }
    else
    {
        _166 = _150;
    }
    bool _182;
    if (!_166)
    {
        bool _175 = blockLocalUV.y > (1.0 - edgeSize.y);
        bool _181;
        if (_175)
        {
            _181 = driftDir.y > 0.0;
        }
        else
        {
            _181 = _175;
        }
        _182 = _181;
    }
    else
    {
        _182 = _166;
    }
    bool isSideFace = _182;
    float blendFactor = fast::clamp(blockAnimProgress, 0.0, 1.0);
    if (isSideFace && (driftFactor > 0.00999999977648258209228515625))
    {
        return float4(0.100000001490116119384765625, 0.100000001490116119384765625, 0.100000001490116119384765625, 1.0);
    }
    else
    {
        return mix(texel1, texel2, float4(blendFactor));
    }
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> tDiffuse [[texture(0)]], texture2d<float> tDiffuse1 [[texture(1)]], sampler tDiffuseSmplr [[sampler(0)]], sampler tDiffuse1Smplr [[sampler(1)]])
{
    main0_out out = {};
    float4 texel1 = tDiffuse.sample(tDiffuseSmplr, in.vUv);
    float4 texel2 = tDiffuse1.sample(tDiffuse1Smplr, in.vUv);
    float transitionProgress = fast::clamp((buffer.progress - 0.100000001490116119384765625) / 0.800000011920928955078125, 0.0, 1.0);
    float4 param = texel1;
    float4 param_1 = texel2;
    float param_2 = transitionProgress;
    float4 transitionColor = transition(param, param_1, param_2, in.vUv, buffer.ratio, buffer.blockCount, buffer.blockThickness, buffer.driftStrength);
    float blendInFactor = smoothstep(0.0, 0.100000001490116119384765625, buffer.progress);
    float blendOutFactor = smoothstep(0.89999997615814208984375, 1.0, buffer.progress);
    float4 finalColor = mix(texel1, transitionColor, float4(blendInFactor));
    finalColor = mix(finalColor, texel2, float4(blendOutFactor));
    out.gl_FragColor = finalColor;
    return out;
}

