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
    float bladeCount;
    float staggerOffset;
    float foldSoftness;
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
float4 transition(thread const float4& texel1, thread const float4& texel2, thread const float& progress, thread float2& vUv, constant float& ratio, constant float& bladeCount, constant float& staggerOffset, constant float& foldSoftness)
{
    float2 centeredUv = vUv - float2(0.5);
    centeredUv.x *= ratio;
    float radius = length(centeredUv);
    float angle = precise::atan2(centeredUv.y, centeredUv.x);
    float normalizedAngle = mod(angle / 6.283185482025146484375, 1.0);
    float bladeIndex = floor(normalizedAngle * bladeCount);
    float localProgress = fast::clamp((progress * 1.2000000476837158203125) - (bladeIndex * staggerOffset), 0.0, 1.0);
    float bladeLocalAngle = mod(normalizedAngle * bladeCount, 1.0);
    float foldThreshold = 1.0 - localProgress;
    float bladeMask = smoothstep(foldThreshold - foldSoftness, foldThreshold + foldSoftness, bladeLocalAngle + (radius * 0.5));
    float centerShrinkMask = smoothstep(1.0 - (progress * 2.0), (1.0 - (progress * 2.0)) + foldSoftness, radius);
    float mask = fast::clamp(bladeMask + centerShrinkMask, 0.0, 1.0);
    return mix(texel1, texel2, float4(mask));
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
    float4 transitionColor = transition(param, param_1, param_2, in.vUv, buffer.ratio, buffer.bladeCount, buffer.staggerOffset, buffer.foldSoftness);
    float blendInFactor = smoothstep(0.0, 0.100000001490116119384765625, buffer.progress);
    float blendOutFactor = smoothstep(0.89999997615814208984375, 1.0, buffer.progress);
    float4 finalColor = mix(texel1, transitionColor, float4(blendInFactor));
    finalColor = mix(finalColor, texel2, float4(blendOutFactor));
    out.gl_FragColor = finalColor;
    return out;
}

