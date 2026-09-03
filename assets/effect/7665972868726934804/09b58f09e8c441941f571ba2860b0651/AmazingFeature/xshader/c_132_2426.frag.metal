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
    int uSlices;
    float uTwist;
    float uBrightness;
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
float4 effect(thread const float4& texel, thread const float& progress, thread float2& vUv, constant float& ratio, constant int& uSlices, constant float& uTwist, texture2d<float> tDiffuse, sampler tDiffuseSmplr, constant float& uBrightness)
{
    float2 center = float2(0.5);
    float2 p = vUv - center;
    p.x *= ratio;
    float r = length(p);
    float ang = precise::atan2(p.y, p.x);
    float pi = 3.1415927410125732421875;
    float ang01 = (ang + pi) / (2.0 * pi);
    float slices = float(uSlices);
    float sectorPos = ang01 * slices;
    float sectorId = floor(sectorPos);
    float sectorFrac = fract(sectorPos);
    float distToCenter = abs(sectorFrac - 0.5);
    float fanMask = smoothstep(0.5, 0.07999999821186065673828125, distToCenter);
    float midPulse = sin(progress * pi);
    float radialMask = smoothstep(0.949999988079071044921875, 0.100000001490116119384765625, r);
    float alt = (mod(sectorId, 2.0) * 2.0) - 1.0;
    float2 _100;
    if (r > 9.9999997473787516355514526367188e-06)
    {
        _100 = p / float2(r);
    }
    else
    {
        _100 = float2(0.0);
    }
    float2 dir = _100;
    float2 offset = (((((dir * alt) * fanMask) * radialMask) * midPulse) * uTwist) * 0.07999999821186065673828125;
    offset.x /= ratio;
    float2 uvWarp = fast::clamp(vUv + offset, float2(0.0), float2(1.0));
    float4 warped = tDiffuse.sample(tDiffuseSmplr, uvWarp);
    float seam = (smoothstep(0.4600000083446502685546875, 0.0, distToCenter) * midPulse) * 0.180000007152557373046875;
    float shade = 1.0 - (seam * (0.3499999940395355224609375 + (0.64999997615814208984375 * smoothstep(0.0, 1.0, r))));
    float bright = mix(1.0, uBrightness, 0.64999997615814208984375 * midPulse);
    float3 col = (warped.xyz * shade) * bright;
    col = fast::clamp(col, float3(0.0), float3(1.0));
    return float4(col, texel.w);
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> tDiffuse [[texture(0)]], sampler tDiffuseSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 texel = tDiffuse.sample(tDiffuseSmplr, in.vUv);
    float effectProgress = fast::clamp((buffer.progress - 0.100000001490116119384765625) / 0.800000011920928955078125, 0.0, 1.0);
    float4 param = texel;
    float param_1 = effectProgress;
    float4 effectColor = effect(param, param_1, in.vUv, buffer.ratio, buffer.uSlices, buffer.uTwist, tDiffuse, tDiffuseSmplr, buffer.uBrightness);
    float fadeInStrength = smoothstep(0.0, 0.100000001490116119384765625, buffer.progress);
    float fadeOutStrength = 1.0 - smoothstep(0.89999997615814208984375, 1.0, buffer.progress);
    float effectStrength = fast::min(fadeInStrength, fadeOutStrength);
    float4 finalColor = mix(texel, effectColor, float4(effectStrength));
    out.gl_FragColor = finalColor;
    return out;
}

