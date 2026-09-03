#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float foldWidth;
    float pastelMix;
    float ratio;
    float doodleAmount;
    float shadowStrength;
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
float3 pastelColor(thread const float& id)
{
    float h = fract(sin((id + 1.0) * 17.2310009002685546875) * 43758.546875);
    float3 c = float3(0.7200000286102294921875) + (cos((float3(h) + float3(0.0, 0.3300000131130218505859375, 0.670000016689300537109375)) * 6.283185482025146484375) * 0.180000007152557373046875);
    return fast::clamp(c, float3(0.0), float3(1.0));
}

static inline __attribute__((always_inline))
float hash12(thread const float2& p)
{
    float3 p3 = fract(float3(p.xyx) * 0.103100001811981201171875);
    p3 += float3(dot(p3, p3.yzx + float3(33.3300018310546875)));
    return fract((p3.x + p3.y) * p3.z);
}

static inline __attribute__((always_inline))
float4 transition(thread const float4& texel1, thread const float4& texel2, thread const float& progress, thread float2& vUv, constant float& foldWidth, texture2d<float> tDiffuse, sampler tDiffuseSmplr, texture2d<float> tDiffuse1, sampler tDiffuse1Smplr, constant float& pastelMix, constant float& ratio, constant float& doodleAmount, constant float& shadowStrength)
{
    if (progress <= 0.0)
    {
        return texel1;
    }
    if (progress >= 1.0)
    {
        return texel2;
    }
    float yLayer = fast::clamp(vUv.y * 7.0, 0.0, 6.99989986419677734375);
    float layerIndex = floor(yLayer);
    float layerFracY = fract(yLayer);
    float localT = fast::clamp((progress * 7.0) - layerIndex, 0.0, 1.0);
    float eased = (localT * localT) * (3.0 - (2.0 * localT));
    float rebound = (sin(eased * 3.141592502593994140625) * (1.0 - eased)) * 0.07999999821186065673828125;
    float foldT = fast::clamp(eased + rebound, 0.0, 1.0);
    float edgeX = 1.0 - foldT;
    float bw = foldWidth * (0.85000002384185791015625 + (0.1500000059604644775390625 * sin((layerIndex + 1.0) * 1.7000000476837158203125)));
    float aa = 0.0040000001899898052215576171875;
    float revealed = smoothstep(edgeX - aa, edgeX + aa, vUv.x);
    float distEdge = abs(vUv.x - edgeX);
    float foldBand = exp(((-distEdge) * distEdge) / fast::max(0.0005000000237487256526947021484375, bw * bw));
    float curl = ((1.0 - foldT) * foldBand) * 0.02999999932944774627685546875;
    float2 uvA = fast::clamp(vUv + float2(-curl, 0.0), float2(0.0), float2(1.0));
    float2 uvB = vUv;
    uvB.y += (((sin(((vUv.x * 44.0) + (layerIndex * 6.13000011444091796875)) - (foldT * 18.0)) * 0.0040000001899898052215576171875) * (1.0 - foldT)) * foldBand);
    uvB = fast::clamp(uvB, float2(0.0), float2(1.0));
    float3 aCol = tDiffuse.sample(tDiffuseSmplr, uvA).xyz;
    float3 bCol = tDiffuse1.sample(tDiffuse1Smplr, uvB).xyz;
    float param = layerIndex;
    float3 pastel = pastelColor(param);
    float3 noteCol = mix(aCol, pastel, float3(pastelMix));
    float edgeDark = (1.0 - (0.100000001490116119384765625 * (1.0 - smoothstep(0.0, 0.0500000007450580596923828125, layerFracY)))) - (0.07999999821186065673828125 * smoothstep(0.949999988079071044921875, 1.0, layerFracY));
    noteCol *= edgeDark;
    float perforation = (1.0 - smoothstep(0.0, 0.039999999105930328369140625, layerFracY)) * step(0.550000011920928955078125, (sin((vUv.x * 120.0) + (layerIndex * 5.19999980926513671875)) * 0.5) + 0.5);
    noteCol *= (1.0 - (0.07999999821186065673828125 * perforation));
    float2 suv = float2(((vUv.x - 0.5) * ratio) + 0.5, vUv.y);
    float2 param_1 = float2(layerIndex, floor(suv.x * 12.0));
    float doodleSeed = hash12(param_1);
    float doodleLine = smoothstep(0.98500001430511474609375, 1.0, sin((((suv.x * 70.0) + (suv.y * 110.0)) + (layerIndex * 2.7000000476837158203125)) + (doodleSeed * 6.283100128173828125)));
    noteCol = mix(noteCol, noteCol * 0.819999992847442626953125, float3((doodleLine * doodleAmount) * 0.25));
    float shadow = (shadowStrength * (1.0 - foldT)) * foldBand;
    bCol *= (1.0 - ((shadow * revealed) * 0.64999997615814208984375));
    float ripple = (sin(((vUv.y * 130.0) + (layerIndex * 4.0)) - (foldT * 22.0)) * 0.5) + 0.5;
    bCol += float3(((0.014999999664723873138427734375 * ripple) * foldBand) * (1.0 - foldT));
    float3 foldLight = float3(1.0) * ((0.100000001490116119384765625 * foldBand) * (1.0 - abs((2.0 * foldT) - 1.0)));
    float3 paperSide = fast::clamp(noteCol + foldLight, float3(0.0), float3(1.0));
    float3 col = mix(paperSide, fast::clamp(bCol, float3(0.0), float3(1.0)), float3(revealed));
    return float4(fast::clamp(col, float3(0.0), float3(1.0)), mix(texel1.w, texel2.w, revealed));
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
    float4 transitionColor = transition(param, param_1, param_2, in.vUv, buffer.foldWidth, tDiffuse, tDiffuseSmplr, tDiffuse1, tDiffuse1Smplr, buffer.pastelMix, buffer.ratio, buffer.doodleAmount, buffer.shadowStrength);
    float blendInFactor = smoothstep(0.0, 0.100000001490116119384765625, buffer.progress);
    float blendOutFactor = smoothstep(0.89999997615814208984375, 1.0, buffer.progress);
    float4 finalColor = mix(texel1, transitionColor, float4(blendInFactor));
    finalColor = mix(finalColor, texel2, float4(blendOutFactor));
    out.gl_FragColor = finalColor;
    return out;
}

