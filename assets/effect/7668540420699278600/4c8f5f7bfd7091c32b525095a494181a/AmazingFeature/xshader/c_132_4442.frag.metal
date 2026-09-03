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
    float cellSize;
    float dispersion;
    float neonStrength;
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
float hash21(thread float2& p)
{
    p = fract(p * float2(123.339996337890625, 456.209991455078125));
    p += float2(dot(p, p + float2(45.31999969482421875)));
    return fract(p.x * p.y);
}

static inline __attribute__((always_inline))
float hexSDF(thread float2& p, thread const float& r)
{
    p = abs(p);
    return fast::max((p.x * 0.866025388240814208984375) + (p.y * 0.5), p.y) - r;
}

static inline __attribute__((always_inline))
float4 transition(thread const float4& texel1, thread const float4& texel2, thread const float& progress, thread float2& vUv, constant float& ratio, constant float& cellSize, constant float& dispersion, constant float& neonStrength)
{
    float t = fast::clamp(progress, 0.0, 1.0);
    float2 p = vUv - float2(0.5);
    p.x *= ratio;
    float maxR = length(float2(0.5 * ratio, 0.5));
    float radial = fast::clamp(length(p) / maxR, 0.0, 1.0);
    float2 hp = p / float2(cellSize);
    float row = floor((hp.y / 0.866025388240814208984375) + 0.5);
    float shift = mod(row, 2.0) * 0.5;
    float col = floor((hp.x - shift) + 0.5);
    float2 cellId = float2(col, row);
    float2 cellCenter = float2(col + shift, row * 0.866025388240814208984375);
    float2 local = hp - cellCenter;
    float2 param = cellId;
    float _142 = hash21(param);
    float rnd = _142;
    float edgePulse = 0.5 + (0.5 * sin((((local.x - local.y) * 7.0) + (t * 6.283100128173828125)) + (rnd * 6.283100128173828125)));
    float coverT = smoothstep(0.0, 0.4199999868869781494140625, t);
    float coverThreshold = 1.0 - radial;
    float arriveBase = smoothstep(-0.07999999821186065673828125, 0.119999997317790985107421875, coverT - coverThreshold);
    float bounce = (sin(fast::clamp((coverT - coverThreshold) * 8.0, 0.0, 3.141590118408203125)) * (1.0 - arriveBase)) * 0.07999999821186065673828125;
    float arrive = fast::clamp(arriveBase + bounce, 0.0, 1.0);
    float coverRadius = mix(0.180000007152557373046875, 0.519999980926513671875, arrive);
    float2 param_1 = local;
    float param_2 = coverRadius;
    float _204 = hexSDF(param_1, param_2);
    float dCover = _204;
    float coverMask = smoothstep(0.02999999932944774627685546875, -0.0199999995529651641845703125, dCover) * arrive;
    float flipCell = fast::clamp((t - (0.4199999868869781494140625 + (rnd * 0.0599999986588954925537109375))) / 0.20000000298023223876953125, 0.0, 1.0);
    float flipPhase = 0.5 - (0.5 * cos(3.141592502593994140625 * flipCell));
    float faceMix = smoothstep(0.449999988079071044921875, 0.550000011920928955078125, flipPhase);
    float3 neonBase = float3(0.1500000059604644775390625, 0.75, 1.0);
    float3 rgbShift = float3(1.0 + ((dispersion * local.x) * 0.699999988079071044921875), 1.0, 1.0 - ((dispersion * local.x) * 0.699999988079071044921875));
    float edge = 1.0 - smoothstep(0.0, 0.0500000007450580596923828125, abs(dCover));
    float3 neon = (((neonBase * rgbShift) * edge) * (0.60000002384185791015625 + (0.4000000059604644775390625 * edgePulse))) * neonStrength;
    float revealT = smoothstep(0.62000000476837158203125, 1.0, t);
    float departCenterFirst = smoothstep(-0.0500000007450580596923828125, 0.75, revealT - (radial * 0.85000002384185791015625));
    float endClear = smoothstep(0.920000016689300537109375, 1.0, t);
    float depart = fast::max(departCenterFirst, endClear);
    float revealRadius = 0.519999980926513671875 * (1.0 - depart);
    float2 param_3 = local;
    float param_4 = revealRadius;
    float _306 = hexSDF(param_3, param_4);
    float dReveal = _306;
    float revealMask = smoothstep(0.02999999932944774627685546875, -0.0199999995529651641845703125, dReveal) * (1.0 - depart);
    float4 cellColorFlip = float4(mix(texel1.xyz, texel2.xyz, float3(faceMix)) + neon, mix(texel1.w, texel2.w, faceMix));
    float4 cellColorA = float4(texel1.xyz + neon, texel1.w);
    float4 cellColorB = float4(texel2.xyz + (neon * 0.60000002384185791015625), texel2.w);
    float phase1 = 1.0 - smoothstep(0.4000000059604644775390625, 0.4600000083446502685546875, t);
    float phase2 = smoothstep(0.4000000059604644775390625, 0.4600000083446502685546875, t) * (1.0 - smoothstep(0.60000002384185791015625, 0.660000026226043701171875, t));
    float phase3 = smoothstep(0.60000002384185791015625, 0.660000026226043701171875, t);
    float4 col1 = mix(texel1, cellColorA, float4(coverMask));
    float2 param_5 = local;
    float param_6 = 0.519999980926513671875;
    float _385 = hexSDF(param_5, param_6);
    float4 col2 = mix(texel1, cellColorFlip, float4(smoothstep(0.02999999932944774627685546875, -0.0199999995529651641845703125, _385)));
    float4 col3 = mix(texel2, cellColorB, float4(revealMask));
    float4 outCol = ((col1 * phase1) + (col2 * phase2)) + (col3 * phase3);
    float4 _407 = outCol;
    float3 _411 = fast::clamp(_407.xyz, float3(0.0), float3(1.0));
    outCol.x = _411.x;
    outCol.y = _411.y;
    outCol.z = _411.z;
    outCol.w = fast::clamp(outCol.w, 0.0, 1.0);
    return (mix(texel1, texel2, float4(t)) * 0.0) + outCol;
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
    float4 transitionColor = transition(param, param_1, param_2, in.vUv, buffer.ratio, buffer.cellSize, buffer.dispersion, buffer.neonStrength);
    float blendInFactor = smoothstep(0.0, 0.100000001490116119384765625, buffer.progress);
    float blendOutFactor = smoothstep(0.89999997615814208984375, 1.0, buffer.progress);
    float4 finalColor = mix(texel1, transitionColor, float4(blendInFactor));
    finalColor = mix(finalColor, texel2, float4(blendOutFactor));
    out.gl_FragColor = finalColor;
    return out;
}

