#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float ratio;
    float gridCount;
    float aberration;
    float glowIntensity;
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
float sdHexagon(thread float2& p, thread const float& r)
{
    p = abs(p);
    return fast::max(dot(p, float2(0.5, 0.866025388240814208984375)), p.x) - r;
}

static inline __attribute__((always_inline))
float4 transition(thread const float4& texel1, thread const float4& texel2, thread const float& progress, thread float2& vUv, constant float& ratio, constant float& gridCount, constant float& aberration, texture2d<float> tDiffuse1, sampler tDiffuse1Smplr, constant float& glowIntensity)
{
    if (progress <= 0.0)
    {
        return texel1;
    }
    if (progress >= 1.0)
    {
        return texel2;
    }
    float p = smoothstep(0.0, 1.0, progress);
    float2 uvA = float2(vUv.x * ratio, vUv.y);
    float cells = fast::max(2.0, gridCount);
    float sx = ratio / cells;
    float sy = 0.866025388240814208984375 / cells;
    float2 g = float2(uvA.x / sx, uvA.y / sy);
    float2 idA = floor(g);
    float2 cA = float2((idA.x + 0.5) * sx, (idA.y + 0.5) * sy);
    float2 gB = float2((uvA.x - (0.5 * sx)) / sx, (uvA.y - (0.5 * sy)) / sy);
    float2 idB = floor(gB);
    float2 cB = float2((idB.x + 1.0) * sx, (idB.y + 1.0) * sy);
    float dA = length(uvA - cA);
    float dB = length(uvA - cB);
    float2 center = select(cB, cA, bool2(dA < dB));
    float hexR = 0.4799999892711639404296875 * sy;
    float2 param = uvA - center;
    float param_1 = hexR;
    float _169 = sdHexagon(param, param_1);
    float d = _169;
    float cellMask = smoothstep(0.00999999977648258209228515625 * sy, (-0.00999999977648258209228515625) * sy, d);
    float edge = exp(((-48.0) * abs(d)) / fast::max(sy, 9.9999997473787516355514526367188e-05)) * cellMask;
    float wave = (center.x + (1.0 - center.y)) / (ratio + 1.0);
    wave = fast::clamp(wave, 0.0, 1.0);
    float tIn = fast::clamp((p - (wave * 0.319999992847442626953125)) / 0.300000011920928955078125, 0.0, 1.0);
    float tOut = fast::clamp(((p - 0.5) - (wave * 0.319999992847442626953125)) / 0.300000011920928955078125, 0.0, 1.0);
    float flash = tIn * (1.0 - tOut);
    float peak = exp(-pow((p - 0.5) / 0.10999999940395355224609375, 2.0));
    float2 off = float2(aberration * peak, 0.0);
    float3 bSplit = float3(tDiffuse1.sample(tDiffuse1Smplr, (vUv + off)).x, tDiffuse1.sample(tDiffuse1Smplr, vUv).y, tDiffuse1.sample(tDiffuse1Smplr, (vUv - off)).z);
    float3 neonA = float3(0.579999983310699462890625, 0.180000007152557373046875, 1.0);
    float3 neonB = float3(0.119999997317790985107421875, 0.7200000286102294921875, 1.0);
    float3 neon = mix(neonA, neonB, float3(fract(wave * 5.0)));
    float3 base = mix(texel1.xyz, bSplit, float3(cellMask * tOut));
    float over = cellMask * flash;
    float3 glow = (((neon * (0.449999988079071044921875 + (0.949999988079071044921875 * peak))) * over) * glowIntensity) + (((neon * edge) * 0.25) * glowIntensity);
    float3 color = fast::clamp(base + glow, float3(0.0), float3(1.0));
    return float4(color, mix(texel1.w, texel2.w, tOut * cellMask));
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
    float4 transitionColor = transition(param, param_1, param_2, in.vUv, buffer.ratio, buffer.gridCount, buffer.aberration, tDiffuse1, tDiffuse1Smplr, buffer.glowIntensity);
    float blendInFactor = smoothstep(0.0, 0.100000001490116119384765625, buffer.progress);
    float blendOutFactor = smoothstep(0.89999997615814208984375, 1.0, buffer.progress);
    float4 finalColor = mix(texel1, transitionColor, float4(blendInFactor));
    finalColor = mix(finalColor, texel2, float4(blendOutFactor));
    out.gl_FragColor = finalColor;
    return out;
}

