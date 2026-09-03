#pragma clang diagnostic ignored "-Wmissing-prototypes"
#pragma clang diagnostic ignored "-Wmissing-braces"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

template<typename T, size_t Num>
struct spvUnsafeArray
{
    T elements[Num ? Num : 1];
    
    thread T& operator [] (size_t pos) thread
    {
        return elements[pos];
    }
    constexpr const thread T& operator [] (size_t pos) const thread
    {
        return elements[pos];
    }
    
    device T& operator [] (size_t pos) device
    {
        return elements[pos];
    }
    constexpr const device T& operator [] (size_t pos) const device
    {
        return elements[pos];
    }
    
    constexpr const constant T& operator [] (size_t pos) const constant
    {
        return elements[pos];
    }
    
    threadgroup T& operator [] (size_t pos) threadgroup
    {
        return elements[pos];
    }
    constexpr const threadgroup T& operator [] (size_t pos) const threadgroup
    {
        return elements[pos];
    }
};

// Implementation of the GLSL mod() function, which is slightly different than Metal fmod()
template<typename Tx, typename Ty>
inline Tx mod(Tx x, Ty y)
{
    return x - y * floor(x / y);
}

struct ShadingData
{
    float3 V;
    float3 N;
    float3 H;
    float3 L;
    float3 R;
    float NoV;
    float NoL;
    float NoH;
    float roughness;
    float linearRoughness;
    float3 diffuseColor;
    float3 specularColor;
    float3 energyCompensation;
    float3 directDiffuse;
    float3 directSpecular;
    float3 indirectDiffuse;
    float3 indirectSpecular;
    float3 clearCoatNormal;
    float clearCoatNoV;
    float clearCoatNoL;
    float clearCoatNoH;
    float clearCoatRoughness;
    float clearCoatLinearRoughness;
    float3 directClearCoat;
    float3 indirectClearCoat;
};

struct Material
{
    float4 albedo;
    float3 emissive;
    float3 position;
    float3 normal;
    float3 tangent;
    float3 bitangent;
    float roughness;
    float metallic;
    float reflectance;
    float ambientOcclusion;
    float clearCoat;
    float clearCoatRoughness;
    float3 clearCoatNormal;
    float3 clearCoatColor;
};

struct LightDirectional
{
    float3 direction;
    float3 color;
    float intensity;
};

struct LightPoint
{
    float3 position;
    float3 color;
    float intensity;
    float falloff;
};

struct LightSpot
{
    float3 position;
    float3 direction;
    float3 color;
    float intensity;
    float innerAngleCos;
    float outerAngleCos;
    float falloff;
};

struct buffer_t
{
    float4 u_ScreenParams;
    int u_enableDirectionalLight;
    spvUnsafeArray<float3, 1> u_DirLightsDirection;
    spvUnsafeArray<float3, 1> u_DirLightsColor;
    spvUnsafeArray<float, 1> u_DirLightsIntensity;
    int u_enablePointLight0;
    spvUnsafeArray<float3, 2> u_PointLightsPosition;
    spvUnsafeArray<float3, 2> u_PointLightsColor;
    spvUnsafeArray<float, 2> u_PointLightsIntensity;
    spvUnsafeArray<float, 2> u_PointLightsAttenRangeInv;
    int u_enablePointLight1;
    int u_enableSpotLight0;
    spvUnsafeArray<float3, 2> u_SpotLightsPosition;
    spvUnsafeArray<float3, 2> u_SpotLightsDirection;
    spvUnsafeArray<float3, 2> u_SpotLightsColor;
    spvUnsafeArray<float, 2> u_SpotLightsIntensity;
    spvUnsafeArray<float, 2> u_SpotLightsInnerAngleCos;
    spvUnsafeArray<float, 2> u_SpotLightsOuterAngleCos;
    spvUnsafeArray<float, 2> u_SpotLightsAttenRangeInv;
    int u_enableSpotLight1;
    float3 u_camPos;
    float u_rotateUV;
    float2 u_offsetUV;
    float2 u_scaleUV;
    int u_wrapMode;
    float3 u_baseColor;
    int u_enablePBR;
    float3 u_emissiveColor;
    float u_emissiveIntensity;
    float u_roughness;
    float u_metallic;
    float u_reflectance;
    float u_ambientOcclusion;
    int u_enableClearCoat;
    float u_clearCoat;
    float u_clearCoatRoughness;
    float3 u_clearCoatColor;
    float3 u_clearCoatNormal;
    float u_pbrBlend;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float3 v_posWS [[user(locn0)]];
    float3 v_nDirWS [[user(locn1)]];
    float3 v_tDirWS [[user(locn2)]];
    float3 v_bDirWS [[user(locn3)]];
    float2 v_uv0 [[user(locn4)]];
};

static inline __attribute__((always_inline))
float2 _f0(thread float2& _p0, thread const float& _p1, thread const float2& _p2, thread const float2& _p3, constant float4& u_ScreenParams)
{
    _p0 -= _p2;
    _p0.y *= (u_ScreenParams.y / u_ScreenParams.x);
    float _169 = sin(_p1);
    float _172 = cos(_p1);
    _p0 = float2x2(float2(_172, _169), float2(-_169, _172)) * _p0;
    _p0.y *= (u_ScreenParams.x / u_ScreenParams.y);
    _p0 /= _p3;
    _p0 += _p2;
    return _p0;
}

static inline __attribute__((always_inline))
float4 _f1(texture2d<float> _p0, sampler _p0Smplr, thread float2& _p1, thread const int& _p2)
{
    if (_p2 == 0)
    {
        float4 _217 = _p0.sample(_p0Smplr, _p1);
        float4 _t3 = _217;
        return float4(_217.xyz, _t3.w * _t3.w);
    }
    else
    {
        if (_p2 == 1)
        {
            _p1 = fract(_p1);
            return _p0.sample(_p0Smplr, _p1);
        }
        else
        {
            if (_p2 == 2)
            {
                _p1 = abs(mod(_p1 + float2(1.0), float2(2.0)) - float2(1.0));
                return _p0.sample(_p0Smplr, _p1);
            }
            else
            {
                if (_p2 == 3)
                {
                    float2 _t4 = step(float2(0.0), _p1) * step(_p1, float2(1.0));
                    return mix(float4(0.0, 0.0, 0.0, 1.0), _p0.sample(_p0Smplr, _p1), float4(_t4.x * _t4.y));
                }
                else
                {
                    if (_p2 == 4)
                    {
                        float2 _t6 = step(float2(0.0), _p1) * step(_p1, float2(1.0));
                        return mix(float4(1.0), _p0.sample(_p0Smplr, _p1), float4(_t6.x * _t6.y));
                    }
                    else
                    {
                        if (_p2 == 5)
                        {
                            float2 _t8 = step(float2(0.0), _p1) * step(_p1, float2(1.0));
                            return _p0.sample(_p0Smplr, _p1) * (_t8.x * _t8.y);
                        }
                    }
                }
            }
        }
    }
    return float4(0.0);
}

static inline __attribute__((always_inline))
ShadingData _f14()
{
    return ShadingData{ float3(0.0), float3(0.0), float3(0.0), float3(0.0), float3(0.0), 0.0, 0.0, 0.0, 0.0, 0.0, float3(0.0), float3(0.0), float3(1.0), float3(0.0), float3(0.0), float3(0.0), float3(0.0), float3(0.0), 0.0, 0.0, 0.0, 0.0, 0.0, float3(0.0), float3(0.0) };
}

static inline __attribute__((always_inline))
float _f2(thread const float& _p0)
{
    float _348 = fast::clamp(_p0, 0.0199999995529651641845703125, 1.0);
    return (0.1599999964237213134765625 * _348) * _348;
}

static inline __attribute__((always_inline))
float _f3(thread const float& _p0)
{
    return _p0 * _p0;
}

static inline __attribute__((always_inline))
float3 _f7(thread const float& _p0, thread const float3& _p1, thread const float& _p2)
{
    float3 _478 = float3(1.0) - _p1;
    return float3(1.0) + (_p1 * ((_478 * (1.0 - (pow(1.0 - _p0, 5.0) * (1.0 - _p2)))) / (float3(1.0) - (_478 * (float3(1.0) - (_p1 + ((float3(1.0) - _p1) / float3(21.0))))))));
}

static inline __attribute__((always_inline))
void _f15(thread const Material& _p0, thread ShadingData& _p1)
{
    float param = _p0.reflectance;
    _p1.N = fast::normalize(_p0.normal);
    _p1.R = reflect(-_p1.V, _p1.N);
    _p1.NoV = fast::clamp(dot(_p1.N, _p1.V), 0.0, 1.0);
    float _t58 = _p0.roughness;
    if (_p0.roughness < 0.00999999977648258209228515625)
    {
        _t58 = 0.00999999977648258209228515625 * (1.0 - exp((-3.0) * (_t58 / 0.00999999977648258209228515625)));
    }
    _p1.roughness = fast::clamp(_t58, 0.001000000047497451305389404296875, 1.0);
    float param_1 = _p1.roughness;
    _p1.linearRoughness = _f3(param_1);
    _p1.diffuseColor = _p0.albedo.xyz * (1.0 - _p0.metallic);
    _p1.specularColor = mix(float3(_f2(param)), _p0.albedo.xyz, float3(_p0.metallic));
    float param_2 = _p1.NoV;
    float3 param_3 = _p1.specularColor;
    float param_4 = _p1.linearRoughness;
    _p1.energyCompensation = _f7(param_2, param_3, param_4);
    _p1.clearCoatNormal = fast::normalize(_p0.clearCoatNormal);
    _p1.clearCoatNoV = fast::clamp(dot(_p0.clearCoatNormal, _p1.V), 0.0, 1.0);
    _p1.clearCoatRoughness = fast::clamp(_p0.clearCoatRoughness, 0.00999999977648258209228515625, 0.60000002384185791015625);
    float param_5 = _p1.clearCoatRoughness;
    _p1.clearCoatLinearRoughness = _f3(param_5);
}

static inline __attribute__((always_inline))
float3 _f4(thread const float3& _p0, thread const float& _p1, thread const float& _p2, thread const float& _p3, thread const float& _p4)
{
    float _369 = 0.5 + (((2.0 * _p1) * _p4) * _p4);
    return _p0 * ((((_369 * pow(1.0 - _p3, 5.0)) + 1.0) * ((_369 * pow(1.0 - _p2, 5.0)) + 1.0)) / 3.1415927410125732421875);
}

static inline __attribute__((always_inline))
float _f5(thread const float& _p0, thread const float& _p1, thread const float& _p2, thread const float3& _p3, thread const float3& _p4, thread const float3& _p5)
{
    float _405 = _p1 * _p2;
    float3 _416 = float3(_p2 * dot(_p4, _p3), _p1 * dot(_p5, _p3), _405 * _p0);
    float _424 = _405 / dot(_416, _416);
    return ((_405 * _424) * _424) / 3.1415927410125732421875;
}

static inline __attribute__((always_inline))
float _f6(thread const float& _p0, thread const float& _p1, thread const float& _p2)
{
    float _436 = _p2 * _p2;
    float _443 = 1.0 - _436;
    return 0.5 / ((_p1 * sqrt(((_p0 * _p0) * _443) + _436)) + (_p0 * sqrt(((_p1 * _p1) * _443) + _436)));
}

static inline __attribute__((always_inline))
float3 _f8(thread const float& _p0, thread const float3& _p1)
{
    return _p1 + ((float3(1.0) - _p1) * pow(fast::clamp(1.0 - _p0, 0.0, 1.0), 5.0));
}

static inline __attribute__((always_inline))
float3 _f9(thread const float3& _p0, thread const float3& _p1, thread const float3& _p2, thread const float3& _p3, thread const float3& _p4, thread const float& _p5, thread const float& _p6, thread const float3& _p7)
{
    float3 _523 = fast::normalize(_p1 + _p0);
    float _528 = fast::clamp(dot(_p2, _p1), 0.0, 1.0);
    float _533 = fast::clamp(dot(_p2, _p0), 0.0, 1.0);
    float _554 = sqrt(1.0 - (_p6 * 0.89999997615814208984375));
    float param = fast::clamp(dot(_p2, _523), 0.0, 1.0);
    float param_1 = _p5 / _554;
    float param_2 = _p5 * _554;
    float3 param_3 = _523;
    float3 param_4 = _p3;
    float3 param_5 = _p4;
    float param_6 = _528;
    float param_7 = _533;
    float param_8 = _p5;
    float param_9 = fast::clamp(dot(_p1, _523), 0.0, 1.0);
    float3 param_10 = _p7;
    float param_11 = _528;
    float3 param_12 = _p7;
    float param_13 = _p5;
    return ((_f8(param_9, param_10) * (_f5(param, param_1, param_2, param_3, param_4, param_5) * _f6(param_6, param_7, param_8))) * mix(float3(1.0), _f7(param_11, param_12, param_13), float3(0.5))) / float3(((4.0 * _528) * _533) + 0.001000000047497451305389404296875);
}

static inline __attribute__((always_inline))
float _f10(thread const float& _p0, thread const float& _p1)
{
    float _623 = _p1 * _p1;
    float _627 = _623 * _623;
    float _639 = ((_p0 * _p0) * (_627 - 1.0)) + 1.0;
    return _627 / ((3.1415927410125732421875 * _639) * _639);
}

static inline __attribute__((always_inline))
float _f11(thread const float& _p0, thread const float& _p1, thread const float& _p2)
{
    float _652 = _p2 * _p2;
    float _659 = 1.0 - _652;
    return 0.5 / (((_p1 * sqrt(((_p0 * _p0) * _659) + _652)) + (_p0 * sqrt(((_p1 * _p1) * _659) + _652))) + 0.001000000047497451305389404296875);
}

static inline __attribute__((always_inline))
float _f12(thread const float& _p0)
{
    return 0.039999999105930328369140625 + (0.959999978542327880859375 * pow(fast::clamp(1.0 - _p0, 0.0, 1.0), 5.0));
}

static inline __attribute__((always_inline))
float3 _f13(thread const float3& _p0, thread const float3& _p1, thread const float3& _p2, thread const float& _p3, thread const float3& _p4)
{
    float3 _701 = fast::normalize(_p1 + _p0);
    float _706 = fast::clamp(dot(_p2, _p1), 0.0, 1.0);
    float _711 = fast::clamp(dot(_p2, _p0), 0.0, 1.0);
    float param = fast::clamp(dot(_p2, _701), 0.0, 1.0);
    float param_1 = _p3;
    float param_2 = _706;
    float param_3 = _711;
    float param_4 = _p3;
    float param_5 = fast::clamp(dot(_p1, _701), 0.0, 1.0);
    return _p4 * (((_f10(param, param_1) * _f11(param_2, param_3, param_4)) * _f12(param_5)) / (((4.0 * _706) * _711) + 0.001000000047497451305389404296875));
}

static inline __attribute__((always_inline))
void _f16(thread const LightDirectional& _p0, thread const Material& _p1, thread ShadingData& _p2)
{
    _p2.L = fast::normalize(-_p0.direction);
    _p2.H = fast::normalize(_p2.V + _p2.L);
    _p2.NoL = fast::clamp(dot(_p2.N, _p2.L), 0.0, 1.0);
    _p2.NoH = fast::clamp(dot(_p2.N, _p2.H), 0.0, 1.0);
    if (_p2.NoL > 0.0)
    {
        float3 _945 = _p0.color * _p0.intensity;
        float3 param = _p2.diffuseColor;
        float param_1 = _p2.roughness;
        float param_2 = _p2.NoV;
        float param_3 = _p2.NoL;
        float param_4 = fast::clamp(dot(_p2.L, _p2.H), 0.0, 1.0);
        _p2.directDiffuse += ((_f4(param, param_1, param_2, param_3, param_4) * _945) * _p2.NoL);
        float3 param_5 = _p2.L;
        float3 param_6 = _p2.V;
        float3 param_7 = _p2.N;
        float3 param_8 = fast::normalize(_p1.tangent);
        float3 param_9 = fast::normalize(_p1.bitangent);
        float param_10 = _p2.linearRoughness;
        float param_11 = 0.0;
        float3 param_12 = _p2.specularColor;
        _p2.directSpecular += ((_f9(param_5, param_6, param_7, param_8, param_9, param_10, param_11, param_12) * _945) * _p2.NoL);
        if (_p1.clearCoat > 0.0)
        {
            _p2.clearCoatNoL = fast::clamp(dot(_p2.clearCoatNormal, _p2.L), 0.0, 1.0);
            if (_p2.clearCoatNoL > 0.0)
            {
                _p2.clearCoatNoH = fast::clamp(dot(_p2.clearCoatNormal, fast::normalize(_p2.V + _p2.L)), 0.0, 1.0);
                float3 param_13 = _p2.L;
                float3 param_14 = _p2.V;
                float3 param_15 = _p2.clearCoatNormal;
                float param_16 = _p2.clearCoatLinearRoughness;
                float3 param_17 = _p1.clearCoatColor;
                _p2.directClearCoat += (((_f13(param_13, param_14, param_15, param_16, param_17) * _945) * _p2.clearCoatNoL) * _p1.clearCoat);
            }
        }
    }
}

static inline __attribute__((always_inline))
void _f17(thread const LightPoint& _p0, thread const Material& _p1, thread ShadingData& _p2)
{
    float3 _1073 = _p0.position - _p1.position;
    float _1076 = length(_1073);
    _p2.L = fast::normalize(_1073);
    _p2.H = fast::normalize(_p2.V + _p2.L);
    _p2.NoL = fast::clamp(dot(_p2.N, _p2.L), 0.0, 1.0);
    _p2.NoH = fast::clamp(dot(_p2.N, _p2.H), 0.0, 1.0);
    if (_p2.NoL > 0.0)
    {
        float _1124 = fast::clamp(1.0 - pow(_1076 * _p0.falloff, 4.0), 0.0, 1.0);
        float3 _1140 = (_p0.color * _p0.intensity) * ((_1124 * _1124) / ((_1076 * _1076) + 1.0));
        float3 param = _p2.diffuseColor;
        float param_1 = _p2.roughness;
        float param_2 = _p2.NoV;
        float param_3 = _p2.NoL;
        float param_4 = fast::clamp(dot(_p2.L, _p2.H), 0.0, 1.0);
        _p2.directDiffuse += ((_f4(param, param_1, param_2, param_3, param_4) * _1140) * _p2.NoL);
        float3 param_5 = _p2.L;
        float3 param_6 = _p2.V;
        float3 param_7 = _p2.N;
        float3 param_8 = fast::normalize(_p1.tangent);
        float3 param_9 = fast::normalize(_p1.bitangent);
        float param_10 = _p2.linearRoughness;
        float param_11 = 0.0;
        float3 param_12 = _p2.specularColor;
        _p2.directSpecular += ((_f9(param_5, param_6, param_7, param_8, param_9, param_10, param_11, param_12) * _1140) * _p2.NoL);
        if (_p1.clearCoat > 0.0)
        {
            _p2.clearCoatNoL = fast::clamp(dot(_p2.clearCoatNormal, _p2.L), 0.0, 1.0);
            if (_p2.clearCoatNoL > 0.0)
            {
                _p2.clearCoatNoH = fast::clamp(dot(_p2.clearCoatNormal, fast::normalize(_p2.V + _p2.L)), 0.0, 1.0);
                float3 param_13 = _p2.L;
                float3 param_14 = _p2.V;
                float3 param_15 = _p2.clearCoatNormal;
                float param_16 = _p2.clearCoatLinearRoughness;
                float3 param_17 = _p1.clearCoatColor;
                _p2.directClearCoat += (((_f13(param_13, param_14, param_15, param_16, param_17) * _1140) * _p2.clearCoatNoL) * _p1.clearCoat);
            }
        }
    }
}

static inline __attribute__((always_inline))
void _f18(thread const LightSpot& _p0, thread const Material& _p1, thread ShadingData& _p2)
{
    float3 _1268 = _p0.position - _p1.position;
    float _1271 = length(_1268);
    _p2.L = fast::normalize(_1268);
    _p2.H = fast::normalize(_p2.V + _p2.L);
    _p2.NoL = fast::clamp(dot(_p2.N, _p2.L), 0.0, 1.0);
    _p2.NoH = fast::clamp(dot(_p2.N, _p2.H), 0.0, 1.0);
    if (_p2.NoL > 0.0)
    {
        float _1319 = fast::clamp(1.0 - pow(_1271 / _p0.falloff, 4.0), 0.0, 1.0);
        float3 _1334 = _p2.L;
        float3 _1354 = (_p0.color * _p0.intensity) * (((_1319 * _1319) / ((_1271 * _1271) + 1.0)) * smoothstep(_p0.outerAngleCos, _p0.innerAngleCos, dot(_1334, fast::normalize(_p0.direction))));
        float3 param = _p2.diffuseColor;
        float param_1 = _p2.roughness;
        float param_2 = _p2.NoV;
        float param_3 = _p2.NoL;
        float param_4 = fast::clamp(dot(_p2.L, _p2.H), 0.0, 1.0);
        _p2.directDiffuse += ((_f4(param, param_1, param_2, param_3, param_4) * _1354) * _p2.NoL);
        float3 param_5 = _p2.L;
        float3 param_6 = _p2.V;
        float3 param_7 = _p2.N;
        float3 param_8 = fast::normalize(_p1.tangent);
        float3 param_9 = fast::normalize(_p1.bitangent);
        float param_10 = _p2.linearRoughness;
        float param_11 = 0.0;
        float3 param_12 = _p2.specularColor;
        _p2.directSpecular += ((_f9(param_5, param_6, param_7, param_8, param_9, param_10, param_11, param_12) * _1354) * _p2.NoL);
        if (_p1.clearCoat > 0.0)
        {
            _p2.clearCoatNoL = fast::clamp(dot(_p2.clearCoatNormal, _p2.L), 0.0, 1.0);
            if (_p2.clearCoatNoL > 0.0)
            {
                _p2.clearCoatNoH = fast::clamp(dot(_p2.clearCoatNormal, fast::normalize(_p2.V + _p2.L)), 0.0, 1.0);
                float3 param_13 = _p2.L;
                float3 param_14 = _p2.V;
                float3 param_15 = _p2.clearCoatNormal;
                float param_16 = _p2.clearCoatLinearRoughness;
                float3 param_17 = _p1.clearCoatColor;
                _p2.directClearCoat += (((_f13(param_13, param_14, param_15, param_16, param_17) * _1354) * _p2.clearCoatNoL) * _p1.clearCoat);
            }
        }
    }
}

static inline __attribute__((always_inline))
float4 _f19(thread const Material& _p0, thread ShadingData& _p1, constant int& u_enableDirectionalLight, constant spvUnsafeArray<float3, 1>& u_DirLightsDirection, constant spvUnsafeArray<float3, 1>& u_DirLightsColor, constant spvUnsafeArray<float, 1>& u_DirLightsIntensity, constant int& u_enablePointLight0, constant spvUnsafeArray<float3, 2>& u_PointLightsPosition, constant spvUnsafeArray<float3, 2>& u_PointLightsColor, constant spvUnsafeArray<float, 2>& u_PointLightsIntensity, constant spvUnsafeArray<float, 2>& u_PointLightsAttenRangeInv, constant int& u_enablePointLight1, constant int& u_enableSpotLight0, constant spvUnsafeArray<float3, 2>& u_SpotLightsPosition, constant spvUnsafeArray<float3, 2>& u_SpotLightsDirection, constant spvUnsafeArray<float3, 2>& u_SpotLightsColor, constant spvUnsafeArray<float, 2>& u_SpotLightsIntensity, constant spvUnsafeArray<float, 2>& u_SpotLightsInnerAngleCos, constant spvUnsafeArray<float, 2>& u_SpotLightsOuterAngleCos, constant spvUnsafeArray<float, 2>& u_SpotLightsAttenRangeInv, constant int& u_enableSpotLight1)
{
    Material param = _p0;
    ShadingData param_1 = _p1;
    _f15(param, param_1);
    _p1 = param_1;
    _p1.directDiffuse = float3(0.0);
    _p1.directSpecular = float3(0.0);
    _p1.indirectDiffuse = float3(0.0);
    _p1.indirectSpecular = float3(0.0);
    _p1.directClearCoat = float3(0.0);
    _p1.indirectClearCoat = float3(0.0);
    _p1.indirectDiffuse *= _p0.ambientOcclusion;
    _p1.indirectSpecular *= _p0.ambientOcclusion;
    if (u_enableDirectionalLight > 0)
    {
        LightDirectional param_2 = LightDirectional{ u_DirLightsDirection[0], u_DirLightsColor[0], u_DirLightsIntensity[0] };
        Material param_3 = _p0;
        ShadingData param_4 = _p1;
        _f16(param_2, param_3, param_4);
        _p1 = param_4;
    }
    if (u_enablePointLight0 > 0)
    {
        LightPoint param_5 = LightPoint{ u_PointLightsPosition[0], u_PointLightsColor[0], u_PointLightsIntensity[0], u_PointLightsAttenRangeInv[0] };
        Material param_6 = _p0;
        ShadingData param_7 = _p1;
        _f17(param_5, param_6, param_7);
        _p1 = param_7;
    }
    if (u_enablePointLight1 > 0)
    {
        LightPoint param_8 = LightPoint{ u_PointLightsPosition[1], u_PointLightsColor[1], u_PointLightsIntensity[1], u_PointLightsAttenRangeInv[1] };
        Material param_9 = _p0;
        ShadingData param_10 = _p1;
        _f17(param_8, param_9, param_10);
        _p1 = param_10;
    }
    if (u_enableSpotLight0 > 0)
    {
        LightSpot param_11 = LightSpot{ u_SpotLightsPosition[0], u_SpotLightsDirection[0], u_SpotLightsColor[0], u_SpotLightsIntensity[0], u_SpotLightsInnerAngleCos[0], u_SpotLightsOuterAngleCos[0], u_SpotLightsAttenRangeInv[0] };
        Material param_12 = _p0;
        ShadingData param_13 = _p1;
        _f18(param_11, param_12, param_13);
        _p1 = param_13;
    }
    if (u_enableSpotLight1 > 0)
    {
        LightSpot param_14 = LightSpot{ u_SpotLightsPosition[1], u_SpotLightsDirection[1], u_SpotLightsColor[1], u_SpotLightsIntensity[1], u_SpotLightsInnerAngleCos[1], u_SpotLightsOuterAngleCos[1], u_SpotLightsAttenRangeInv[1] };
        Material param_15 = _p0;
        ShadingData param_16 = _p1;
        _f18(param_14, param_15, param_16);
        _p1 = param_16;
    }
    float4 _t97 = float4(0.0, 0.0, 0.0, 1.0);
    float param_17 = _p1.clearCoatNoV;
    float3 _1706 = ((((_p1.indirectDiffuse + _p1.directDiffuse) + _p1.indirectSpecular) + _p1.directSpecular) * (1.0 - (_p0.clearCoat * _f12(param_17)))) + (_p1.directClearCoat + _p1.indirectClearCoat);
    _t97.x = _1706.x;
    _t97.y = _1706.y;
    _t97.z = _1706.z;
    float4 _1715 = _t97;
    float3 _1717 = _1715.xyz + _p0.emissive;
    _t97.x = _1717.x;
    _t97.y = _1717.y;
    _t97.z = _1717.z;
    _t97.w = _p0.albedo.w;
    float4 _1727 = _t97;
    float3 _1731 = fast::min(_1727.xyz, float3(65504.0));
    _t97.x = _1731.x;
    _t97.y = _1731.y;
    _t97.z = _1731.z;
    return _t97;
}

static inline __attribute__((always_inline))
float4 _f20(thread const Material& _p0, constant int& u_enableDirectionalLight, constant spvUnsafeArray<float3, 1>& u_DirLightsDirection, constant spvUnsafeArray<float3, 1>& u_DirLightsColor, constant spvUnsafeArray<float, 1>& u_DirLightsIntensity, constant int& u_enablePointLight0, constant spvUnsafeArray<float3, 2>& u_PointLightsPosition, constant spvUnsafeArray<float3, 2>& u_PointLightsColor, constant spvUnsafeArray<float, 2>& u_PointLightsIntensity, constant spvUnsafeArray<float, 2>& u_PointLightsAttenRangeInv, constant int& u_enablePointLight1, constant int& u_enableSpotLight0, constant spvUnsafeArray<float3, 2>& u_SpotLightsPosition, constant spvUnsafeArray<float3, 2>& u_SpotLightsDirection, constant spvUnsafeArray<float3, 2>& u_SpotLightsColor, constant spvUnsafeArray<float, 2>& u_SpotLightsIntensity, constant spvUnsafeArray<float, 2>& u_SpotLightsInnerAngleCos, constant spvUnsafeArray<float, 2>& u_SpotLightsOuterAngleCos, constant spvUnsafeArray<float, 2>& u_SpotLightsAttenRangeInv, constant int& u_enableSpotLight1, constant float3& u_camPos)
{
    ShadingData _1742 = _f14();
    Material param = _p0;
    ShadingData param_1 = ShadingData{ fast::normalize(u_camPos - _p0.position), _1742.N, _1742.H, _1742.L, _1742.R, _1742.NoV, _1742.NoL, _1742.NoH, _1742.roughness, _1742.linearRoughness, _1742.diffuseColor, _1742.specularColor, _1742.energyCompensation, _1742.directDiffuse, _1742.directSpecular, _1742.indirectDiffuse, _1742.indirectSpecular, _1742.clearCoatNormal, _1742.clearCoatNoV, _1742.clearCoatNoL, _1742.clearCoatNoH, _1742.clearCoatRoughness, _1742.clearCoatLinearRoughness, _1742.directClearCoat, _1742.indirectClearCoat };
    float4 _1754 = _f19(param, param_1, u_enableDirectionalLight, u_DirLightsDirection, u_DirLightsColor, u_DirLightsIntensity, u_enablePointLight0, u_PointLightsPosition, u_PointLightsColor, u_PointLightsIntensity, u_PointLightsAttenRangeInv, u_enablePointLight1, u_enableSpotLight0, u_SpotLightsPosition, u_SpotLightsDirection, u_SpotLightsColor, u_SpotLightsIntensity, u_SpotLightsInnerAngleCos, u_SpotLightsOuterAngleCos, u_SpotLightsAttenRangeInv, u_enableSpotLight1);
    return _1754;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTex [[texture(0)]], sampler u_inputTexSmplr [[sampler(0)]])
{
    main0_out out = {};
    float3 _1766 = fast::normalize(in.v_nDirWS);
    float2 param = in.v_uv0;
    float param_1 = buffer.u_rotateUV;
    float2 param_2 = buffer.u_offsetUV;
    float2 param_3 = buffer.u_scaleUV;
    float2 _1794 = _f0(param, param_1, param_2, param_3, buffer.u_ScreenParams);
    float2 param_4 = _1794;
    int param_5 = buffer.u_wrapMode;
    float4 _1802 = _f1(u_inputTex, u_inputTexSmplr, param_4, param_5);
    float4 _1811 = float4(buffer.u_baseColor, 1.0) * _1802;
    float4 _t109;
    if (buffer.u_enablePBR == 1)
    {
        float _1925;
        float _1926;
        float3 _1927;
        float3 _1928;
        if (buffer.u_enableClearCoat == 1)
        {
            _1925 = buffer.u_clearCoat;
            _1926 = buffer.u_clearCoatRoughness;
            _1928 = buffer.u_clearCoatColor;
            float3 _1869;
            if (length(buffer.u_clearCoatNormal) > 0.100000001490116119384765625)
            {
                _1869 = fast::normalize(buffer.u_clearCoatNormal);
            }
            else
            {
                _1869 = _1766;
            }
            _1927 = _1869;
        }
        else
        {
            _1925 = 0.0;
            _1926 = 0.0;
            _1927 = _1766;
            _1928 = float3(1.0);
        }
        Material param_6 = Material{ _1811, buffer.u_emissiveColor * buffer.u_emissiveIntensity, in.v_posWS, _1766, fast::normalize(in.v_tDirWS), fast::normalize(in.v_bDirWS), buffer.u_roughness, buffer.u_metallic, buffer.u_reflectance, buffer.u_ambientOcclusion, _1925, _1926, _1927, _1928 };
        _t109 = mix(_1811, _f20(param_6, buffer.u_enableDirectionalLight, buffer.u_DirLightsDirection, buffer.u_DirLightsColor, buffer.u_DirLightsIntensity, buffer.u_enablePointLight0, buffer.u_PointLightsPosition, buffer.u_PointLightsColor, buffer.u_PointLightsIntensity, buffer.u_PointLightsAttenRangeInv, buffer.u_enablePointLight1, buffer.u_enableSpotLight0, buffer.u_SpotLightsPosition, buffer.u_SpotLightsDirection, buffer.u_SpotLightsColor, buffer.u_SpotLightsIntensity, buffer.u_SpotLightsInnerAngleCos, buffer.u_SpotLightsOuterAngleCos, buffer.u_SpotLightsAttenRangeInv, buffer.u_enableSpotLight1, buffer.u_camPos), float4(buffer.u_pbrBlend));
    }
    else
    {
        _t109 = _1811;
    }
    out.o_fragColor = _t109;
    return out;
}

