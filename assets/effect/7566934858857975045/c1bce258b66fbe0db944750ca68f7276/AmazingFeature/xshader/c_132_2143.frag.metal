#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float twistStrength;
    float rotationSpeed;
    float edgeSoftness;
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
float4 transition(thread const float4& texel1, thread const float4& texel2, thread const float& progress, thread float2& vUv, constant float& twistStrength, constant float& rotationSpeed, constant float& edgeSoftness, texture2d<float> tDiffuse, sampler tDiffuseSmplr)
{
    float2 uv_center = vUv - float2(0.5);
    float r = length(uv_center);
    float theta = precise::atan2(uv_center.y, uv_center.x);
    theta += ((twistStrength * progress) * rotationSpeed);
    float wormhole_radius = progress * 1.2000000476837158203125;
    float mix_weight = 1.0 - smoothstep(wormhole_radius - edgeSoftness, wormhole_radius, r);
    float2 distorted_uv = (float2(cos(theta), sin(theta)) * r) + float2(0.5);
    distorted_uv = fast::clamp(distorted_uv, float2(0.0), float2(1.0));
    float4 distorted_tex1 = tDiffuse.sample(tDiffuseSmplr, distorted_uv);
    return mix(distorted_tex1, texel2, float4(mix_weight));
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
    float4 transitionColor = transition(param, param_1, param_2, in.vUv, buffer.twistStrength, buffer.rotationSpeed, buffer.edgeSoftness, tDiffuse, tDiffuseSmplr);
    float blendInFactor = smoothstep(0.0, 0.100000001490116119384765625, buffer.progress);
    float blendOutFactor = smoothstep(0.89999997615814208984375, 1.0, buffer.progress);
    float4 finalColor = mix(texel1, transitionColor, float4(blendInFactor));
    finalColor = mix(finalColor, texel2, float4(blendOutFactor));
    out.gl_FragColor = finalColor;
    return out;
}

