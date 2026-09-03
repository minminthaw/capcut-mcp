#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float glitchAmount;
    float neonIntensity;
    float ratio;
    float shardDelay;
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
float3 toGray(thread const float3& c)
{
    float g = dot(c, float3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625));
    return float3(g);
}

static inline __attribute__((always_inline))
float2 getSeed(thread const int& i)
{
    if (i == 0)
    {
        return float2(0.14000000059604644775390625, 0.1599999964237213134765625);
    }
    if (i == 1)
    {
        return float2(0.3300000131130218505859375, 0.119999997317790985107421875);
    }
    if (i == 2)
    {
        return float2(0.569999992847442626953125, 0.1500000059604644775390625);
    }
    if (i == 3)
    {
        return float2(0.829999983310699462890625, 0.180000007152557373046875);
    }
    if (i == 4)
    {
        return float2(0.180000007152557373046875, 0.37999999523162841796875);
    }
    if (i == 5)
    {
        return float2(0.4099999964237213134765625, 0.36000001430511474609375);
    }
    if (i == 6)
    {
        return float2(0.670000016689300537109375, 0.4000000059604644775390625);
    }
    if (i == 7)
    {
        return float2(0.86000001430511474609375, 0.439999997615814208984375);
    }
    if (i == 8)
    {
        return float2(0.12999999523162841796875, 0.709999978542327880859375);
    }
    if (i == 9)
    {
        return float2(0.36000001430511474609375, 0.7799999713897705078125);
    }
    if (i == 10)
    {
        return float2(0.61000001430511474609375, 0.7400000095367431640625);
    }
    return float2(0.839999973773956298828125, 0.800000011920928955078125);
}

static inline __attribute__((always_inline))
float hash11(thread const float& p)
{
    return fract(sin(p * 127.09999847412109375) * 43758.546875);
}

static inline __attribute__((always_inline))
float hash21(thread const float2& p)
{
    return fract(sin(dot(p, float2(127.09999847412109375, 311.70001220703125))) * 43758.546875);
}

static inline __attribute__((always_inline))
float4 transition(thread const float4& texel1, thread const float4& texel2, thread const float& progress, thread float2& vUv, constant float& glitchAmount, texture2d<float> tDiffuse, sampler tDiffuseSmplr, constant float& neonIntensity, texture2d<float> tDiffuse1, sampler tDiffuse1Smplr, constant float& ratio, constant float& shardDelay)
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
    float2 uv = vUv;
    float aPhase = 1.0 - smoothstep(0.0, 0.2800000011920928955078125, p);
    float2 splitA = (float2(0.017999999225139617919921875, 0.00999999977648258209228515625) * glitchAmount) * aPhase;
    float rA = tDiffuse.sample(tDiffuseSmplr, (uv + splitA)).x;
    float gA = texel1.y;
    float bA = tDiffuse.sample(tDiffuseSmplr, (uv - splitA)).z;
    float3 aCol = float3(rA, gA, bA);
    float3 param = aCol;
    float3 aGray = toGray(param);
    aCol = mix(aCol, aGray, float3(0.85000002384185791015625 * aPhase));
    aCol += (float3(1.0, 0.3499999940395355224609375, 0.89999997615814208984375) * ((0.449999988079071044921875 * aPhase) * neonIntensity));
    aCol = fast::clamp(aCol, float3(0.0), float3(1.0));
    float bRecover = smoothstep(0.819999992847442626953125, 1.0, p);
    float bGrayAmt = 1.0 - bRecover;
    float bGlitch = 1.0 - smoothstep(0.7200000286102294921875, 0.980000019073486328125, p);
    float2 splitB = (float2(-0.01200000010430812835693359375, 0.008000000379979610443115234375) * glitchAmount) * bGlitch;
    float rB = tDiffuse1.sample(tDiffuse1Smplr, (uv + splitB)).x;
    float gB = texel2.y;
    float bB = tDiffuse1.sample(tDiffuse1Smplr, (uv - splitB)).z;
    float3 bCol = float3(rB, gB, bB);
    float3 param_1 = bCol;
    bCol = mix(bCol, toGray(param_1), float3(bGrayAmt));
    float cyanFlash = smoothstep(0.839999973773956298828125, 0.920000016689300537109375, p) * (1.0 - smoothstep(0.920000016689300537109375, 0.9900000095367431640625, p));
    bCol += (float3(0.180000007152557373046875, 0.949999988079071044921875, 1.0) * ((0.550000011920928955078125 * cyanFlash) * neonIntensity));
    bCol = fast::clamp(bCol, float3(0.0), float3(1.0));
    float minD = 100000.0;
    int cellId = 0;
    float2 cellSeed = float2(0.5);
    for (int i = 0; i < 12; i++)
    {
        int param_2 = i;
        float2 s = getSeed(param_2);
        float2 d = uv - s;
        d.x *= ratio;
        float dd = dot(d, d);
        if (dd < minD)
        {
            minD = dd;
            cellId = i;
            cellSeed = s;
        }
    }
    float idf = float(cellId);
    float param_3 = (idf * 13.36999988555908203125) + 1.7000000476837158203125;
    float delay = hash11(param_3) * shardDelay;
    float localP = fast::clamp((p - delay) / fast::max(0.001000000047497451305389404296875, 1.0 - delay), 0.0, 1.0);
    float2 dv = uv - cellSeed;
    dv.x *= ratio;
    float param_4 = (idf * 7.909999847412109375) + 0.300000011920928955078125;
    float cellScale = 0.3400000035762786865234375 + (0.180000007152557373046875 * hash11(param_4));
    float angle = precise::atan2(dv.y, dv.x);
    float sector = floor((angle + 3.141592502593994140625) / 0.52359879016876220703125);
    float param_5 = (idf * 5.13000011444091796875) + (sector * 1.769999980926513671875);
    float jag = (hash11(param_5) - 0.5) * 0.20000000298023223876953125;
    float dNorm = (length(dv) / cellScale) + jag;
    dNorm = fast::max(dNorm, 0.0);
    float threshold = 1.0 - localP;
    float keepA = 1.0 - smoothstep(threshold - 0.0350000001490116119384765625, threshold + 0.0350000001490116119384765625, dNorm);
    float3 col = mix(bCol, aCol, float3(keepA));
    float edge = 1.0 - smoothstep(0.0, 0.0500000007450580596923828125, abs(dNorm - threshold));
    float2 param_6 = (uv * float2(420.0, 260.0)) + float2(idf * 0.17000000178813934326171875, p * 97.0);
    float n = hash21(param_6);
    float edgeActive = step(0.001000000047497451305389404296875, localP) * (1.0 - step(0.999000012874603271484375, localP));
    float3 neon = mix(float3(1.0, 0.1500000059604644775390625, 0.800000011920928955078125), float3(0.20000000298023223876953125, 0.89999997615814208984375, 1.0), float3(n));
    col += ((((neon * edge) * n) * (0.449999988079071044921875 * neonIntensity)) * edgeActive);
    col = fast::clamp(col, float3(0.0), float3(1.0));
    return float4(col, mix(texel1.w, texel2.w, p));
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
    float4 transitionColor = transition(param, param_1, param_2, in.vUv, buffer.glitchAmount, tDiffuse, tDiffuseSmplr, buffer.neonIntensity, tDiffuse1, tDiffuse1Smplr, buffer.ratio, buffer.shardDelay);
    float blendInFactor = smoothstep(0.0, 0.100000001490116119384765625, buffer.progress);
    float blendOutFactor = smoothstep(0.89999997615814208984375, 1.0, buffer.progress);
    float4 finalColor = mix(texel1, transitionColor, float4(blendInFactor));
    finalColor = mix(finalColor, texel2, float4(blendOutFactor));
    out.gl_FragColor = finalColor;
    return out;
}

