precision highp float;
precision highp int;

struct ShadingData
{
    vec3 V;
    vec3 N;
    vec3 H;
    vec3 L;
    vec3 R;
    float NoV;
    float NoL;
    float NoH;
    float roughness;
    float linearRoughness;
    vec3 diffuseColor;
    vec3 specularColor;
    vec3 energyCompensation;
    vec3 directDiffuse;
    vec3 directSpecular;
    vec3 indirectDiffuse;
    vec3 indirectSpecular;
    vec3 clearCoatNormal;
    float clearCoatNoV;
    float clearCoatNoL;
    float clearCoatNoH;
    float clearCoatRoughness;
    float clearCoatLinearRoughness;
    vec3 directClearCoat;
    vec3 indirectClearCoat;
};

struct Material
{
    vec4 albedo;
    vec3 emissive;
    vec3 position;
    vec3 normal;
    vec3 tangent;
    vec3 bitangent;
    float roughness;
    float metallic;
    float reflectance;
    float ambientOcclusion;
    float clearCoat;
    float clearCoatRoughness;
    vec3 clearCoatNormal;
    vec3 clearCoatColor;
};

struct LightDirectional
{
    vec3 direction;
    vec3 color;
    float intensity;
};

struct LightPoint
{
    vec3 position;
    vec3 color;
    float intensity;
    float falloff;
};

struct LightSpot
{
    vec3 position;
    vec3 direction;
    vec3 color;
    float intensity;
    float innerAngleCos;
    float outerAngleCos;
    float falloff;
};

uniform vec4 u_ScreenParams;
uniform mediump int u_enableDirectionalLight;
uniform vec3 u_DirLightsDirection[1];
uniform vec3 u_DirLightsColor[1];
uniform float u_DirLightsIntensity[1];
uniform mediump int u_enablePointLight0;
uniform vec3 u_PointLightsPosition[2];
uniform vec3 u_PointLightsColor[2];
uniform float u_PointLightsIntensity[2];
uniform float u_PointLightsAttenRangeInv[2];
uniform mediump int u_enablePointLight1;
uniform mediump int u_enableSpotLight0;
uniform vec3 u_SpotLightsPosition[2];
uniform vec3 u_SpotLightsDirection[2];
uniform vec3 u_SpotLightsColor[2];
uniform float u_SpotLightsIntensity[2];
uniform float u_SpotLightsInnerAngleCos[2];
uniform float u_SpotLightsOuterAngleCos[2];
uniform float u_SpotLightsAttenRangeInv[2];
uniform mediump int u_enableSpotLight1;
uniform vec3 u_camPos;
uniform float u_rotateUV;
uniform vec2 u_offsetUV;
uniform vec2 u_scaleUV;
uniform mediump sampler2D u_inputTex;
uniform mediump int u_wrapMode;
uniform vec3 u_baseColor;
uniform mediump int u_enablePBR;
uniform vec3 u_emissiveColor;
uniform float u_emissiveIntensity;
uniform float u_roughness;
uniform float u_metallic;
uniform float u_reflectance;
uniform float u_ambientOcclusion;
uniform mediump int u_enableClearCoat;
uniform float u_clearCoat;
uniform float u_clearCoatRoughness;
uniform vec3 u_clearCoatColor;
uniform vec3 u_clearCoatNormal;
uniform float u_pbrBlend;

varying vec3 v_posWS;
varying vec3 v_nDirWS;
varying vec3 v_tDirWS;
varying vec3 v_bDirWS;
varying vec2 v_uv0;

vec2 _f0(inout vec2 _p0, float _p1, vec2 _p2, vec2 _p3)
{
    _p0 -= _p2;
    _p0.y *= (u_ScreenParams.y / u_ScreenParams.x);
    float _169 = sin(_p1);
    float _172 = cos(_p1);
    _p0 = mat2(vec2(_172, _169), vec2(-_169, _172)) * _p0;
    _p0.y *= (u_ScreenParams.x / u_ScreenParams.y);
    _p0 /= _p3;
    _p0 += _p2;
    return _p0;
}

vec4 _f1(mediump sampler2D _p0, inout vec2 _p1, mediump int _p2)
{
    if (_p2 == 0)
    {
        mediump vec4 _217 = texture2D(_p0, _p1);
        vec4 _t3 = _217;
        return vec4(_217.xyz, _t3.w * _t3.w);
    }
    else
    {
        if (_p2 == 1)
        {
            _p1 = fract(_p1);
            return texture2D(_p0, _p1);
        }
        else
        {
            if (_p2 == 2)
            {
                _p1 = abs(mod(_p1 + vec2(1.0), vec2(2.0)) - vec2(1.0));
                return texture2D(_p0, _p1);
            }
            else
            {
                if (_p2 == 3)
                {
                    vec2 _t4 = step(vec2(0.0), _p1) * step(_p1, vec2(1.0));
                    return mix(vec4(0.0, 0.0, 0.0, 1.0), texture2D(_p0, _p1), vec4(_t4.x * _t4.y));
                }
                else
                {
                    if (_p2 == 4)
                    {
                        vec2 _t6 = step(vec2(0.0), _p1) * step(_p1, vec2(1.0));
                        return mix(vec4(1.0), texture2D(_p0, _p1), vec4(_t6.x * _t6.y));
                    }
                    else
                    {
                        if (_p2 == 5)
                        {
                            vec2 _t8 = step(vec2(0.0), _p1) * step(_p1, vec2(1.0));
                            return texture2D(_p0, _p1) * (_t8.x * _t8.y);
                        }
                    }
                }
            }
        }
    }
    return vec4(0.0);
}

ShadingData _f14()
{
    return ShadingData(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0), 0.0, 0.0, 0.0, 0.0, 0.0, vec3(0.0), vec3(0.0), vec3(1.0), vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0), 0.0, 0.0, 0.0, 0.0, 0.0, vec3(0.0), vec3(0.0));
}

float _f2(float _p0)
{
    float _348 = clamp(_p0, 0.0199999995529651641845703125, 1.0);
    return (0.1599999964237213134765625 * _348) * _348;
}

float _f3(float _p0)
{
    return _p0 * _p0;
}

vec3 _f7(float _p0, vec3 _p1, float _p2)
{
    vec3 _478 = vec3(1.0) - _p1;
    return vec3(1.0) + (_p1 * ((_478 * (1.0 - (pow(1.0 - _p0, 5.0) * (1.0 - _p2)))) / (vec3(1.0) - (_478 * (vec3(1.0) - (_p1 + ((vec3(1.0) - _p1) / vec3(21.0))))))));
}

void _f15(Material _p0, inout ShadingData _p1)
{
    float param = _p0.reflectance;
    _p1.N = normalize(_p0.normal);
    _p1.R = reflect(-_p1.V, _p1.N);
    _p1.NoV = clamp(dot(_p1.N, _p1.V), 0.0, 1.0);
    float _t58 = _p0.roughness;
    if (_p0.roughness < 0.00999999977648258209228515625)
    {
        _t58 = 0.00999999977648258209228515625 * (1.0 - exp((-3.0) * (_t58 / 0.00999999977648258209228515625)));
    }
    _p1.roughness = clamp(_t58, 0.001000000047497451305389404296875, 1.0);
    float param_1 = _p1.roughness;
    _p1.linearRoughness = _f3(param_1);
    _p1.diffuseColor = _p0.albedo.xyz * (1.0 - _p0.metallic);
    _p1.specularColor = mix(vec3(_f2(param)), _p0.albedo.xyz, vec3(_p0.metallic));
    float param_2 = _p1.NoV;
    vec3 param_3 = _p1.specularColor;
    float param_4 = _p1.linearRoughness;
    _p1.energyCompensation = _f7(param_2, param_3, param_4);
    _p1.clearCoatNormal = normalize(_p0.clearCoatNormal);
    _p1.clearCoatNoV = clamp(dot(_p0.clearCoatNormal, _p1.V), 0.0, 1.0);
    _p1.clearCoatRoughness = clamp(_p0.clearCoatRoughness, 0.00999999977648258209228515625, 0.60000002384185791015625);
    float param_5 = _p1.clearCoatRoughness;
    _p1.clearCoatLinearRoughness = _f3(param_5);
}

vec3 _f4(vec3 _p0, float _p1, float _p2, float _p3, float _p4)
{
    float _369 = 0.5 + (((2.0 * _p1) * _p4) * _p4);
    return _p0 * ((((_369 * pow(1.0 - _p3, 5.0)) + 1.0) * ((_369 * pow(1.0 - _p2, 5.0)) + 1.0)) / 3.1415927410125732421875);
}

float _f5(float _p0, float _p1, float _p2, vec3 _p3, vec3 _p4, vec3 _p5)
{
    float _405 = _p1 * _p2;
    vec3 _416 = vec3(_p2 * dot(_p4, _p3), _p1 * dot(_p5, _p3), _405 * _p0);
    float _424 = _405 / dot(_416, _416);
    return ((_405 * _424) * _424) / 3.1415927410125732421875;
}

float _f6(float _p0, float _p1, float _p2)
{
    float _436 = _p2 * _p2;
    float _443 = 1.0 - _436;
    return 0.5 / ((_p1 * sqrt(((_p0 * _p0) * _443) + _436)) + (_p0 * sqrt(((_p1 * _p1) * _443) + _436)));
}

vec3 _f8(float _p0, vec3 _p1)
{
    return _p1 + ((vec3(1.0) - _p1) * pow(clamp(1.0 - _p0, 0.0, 1.0), 5.0));
}

vec3 _f9(vec3 _p0, vec3 _p1, vec3 _p2, vec3 _p3, vec3 _p4, float _p5, float _p6, vec3 _p7)
{
    vec3 _523 = normalize(_p1 + _p0);
    float _528 = clamp(dot(_p2, _p1), 0.0, 1.0);
    float _533 = clamp(dot(_p2, _p0), 0.0, 1.0);
    float _554 = sqrt(1.0 - (_p6 * 0.89999997615814208984375));
    float param = clamp(dot(_p2, _523), 0.0, 1.0);
    float param_1 = _p5 / _554;
    float param_2 = _p5 * _554;
    vec3 param_3 = _523;
    vec3 param_4 = _p3;
    vec3 param_5 = _p4;
    float param_6 = _528;
    float param_7 = _533;
    float param_8 = _p5;
    float param_9 = clamp(dot(_p1, _523), 0.0, 1.0);
    vec3 param_10 = _p7;
    float param_11 = _528;
    vec3 param_12 = _p7;
    float param_13 = _p5;
    return ((_f8(param_9, param_10) * (_f5(param, param_1, param_2, param_3, param_4, param_5) * _f6(param_6, param_7, param_8))) * mix(vec3(1.0), _f7(param_11, param_12, param_13), vec3(0.5))) / vec3(((4.0 * _528) * _533) + 0.001000000047497451305389404296875);
}

float _f10(float _p0, float _p1)
{
    float _623 = _p1 * _p1;
    float _627 = _623 * _623;
    float _639 = ((_p0 * _p0) * (_627 - 1.0)) + 1.0;
    return _627 / ((3.1415927410125732421875 * _639) * _639);
}

float _f11(float _p0, float _p1, float _p2)
{
    float _652 = _p2 * _p2;
    float _659 = 1.0 - _652;
    return 0.5 / (((_p1 * sqrt(((_p0 * _p0) * _659) + _652)) + (_p0 * sqrt(((_p1 * _p1) * _659) + _652))) + 0.001000000047497451305389404296875);
}

float _f12(float _p0)
{
    return 0.039999999105930328369140625 + (0.959999978542327880859375 * pow(clamp(1.0 - _p0, 0.0, 1.0), 5.0));
}

vec3 _f13(vec3 _p0, vec3 _p1, vec3 _p2, float _p3, vec3 _p4)
{
    vec3 _701 = normalize(_p1 + _p0);
    float _706 = clamp(dot(_p2, _p1), 0.0, 1.0);
    float _711 = clamp(dot(_p2, _p0), 0.0, 1.0);
    float param = clamp(dot(_p2, _701), 0.0, 1.0);
    float param_1 = _p3;
    float param_2 = _706;
    float param_3 = _711;
    float param_4 = _p3;
    float param_5 = clamp(dot(_p1, _701), 0.0, 1.0);
    return _p4 * (((_f10(param, param_1) * _f11(param_2, param_3, param_4)) * _f12(param_5)) / (((4.0 * _706) * _711) + 0.001000000047497451305389404296875));
}

void _f16(LightDirectional _p0, Material _p1, inout ShadingData _p2)
{
    _p2.L = normalize(-_p0.direction);
    _p2.H = normalize(_p2.V + _p2.L);
    _p2.NoL = clamp(dot(_p2.N, _p2.L), 0.0, 1.0);
    _p2.NoH = clamp(dot(_p2.N, _p2.H), 0.0, 1.0);
    if (_p2.NoL > 0.0)
    {
        vec3 _945 = _p0.color * _p0.intensity;
        vec3 param = _p2.diffuseColor;
        float param_1 = _p2.roughness;
        float param_2 = _p2.NoV;
        float param_3 = _p2.NoL;
        float param_4 = clamp(dot(_p2.L, _p2.H), 0.0, 1.0);
        _p2.directDiffuse += ((_f4(param, param_1, param_2, param_3, param_4) * _945) * _p2.NoL);
        vec3 param_5 = _p2.L;
        vec3 param_6 = _p2.V;
        vec3 param_7 = _p2.N;
        vec3 param_8 = normalize(_p1.tangent);
        vec3 param_9 = normalize(_p1.bitangent);
        float param_10 = _p2.linearRoughness;
        float param_11 = 0.0;
        vec3 param_12 = _p2.specularColor;
        _p2.directSpecular += ((_f9(param_5, param_6, param_7, param_8, param_9, param_10, param_11, param_12) * _945) * _p2.NoL);
        if (_p1.clearCoat > 0.0)
        {
            _p2.clearCoatNoL = clamp(dot(_p2.clearCoatNormal, _p2.L), 0.0, 1.0);
            if (_p2.clearCoatNoL > 0.0)
            {
                _p2.clearCoatNoH = clamp(dot(_p2.clearCoatNormal, normalize(_p2.V + _p2.L)), 0.0, 1.0);
                vec3 param_13 = _p2.L;
                vec3 param_14 = _p2.V;
                vec3 param_15 = _p2.clearCoatNormal;
                float param_16 = _p2.clearCoatLinearRoughness;
                vec3 param_17 = _p1.clearCoatColor;
                _p2.directClearCoat += (((_f13(param_13, param_14, param_15, param_16, param_17) * _945) * _p2.clearCoatNoL) * _p1.clearCoat);
            }
        }
    }
}

void _f17(LightPoint _p0, Material _p1, inout ShadingData _p2)
{
    vec3 _1073 = _p0.position - _p1.position;
    float _1076 = length(_1073);
    _p2.L = normalize(_1073);
    _p2.H = normalize(_p2.V + _p2.L);
    _p2.NoL = clamp(dot(_p2.N, _p2.L), 0.0, 1.0);
    _p2.NoH = clamp(dot(_p2.N, _p2.H), 0.0, 1.0);
    if (_p2.NoL > 0.0)
    {
        float _1124 = clamp(1.0 - pow(_1076 * _p0.falloff, 4.0), 0.0, 1.0);
        vec3 _1140 = (_p0.color * _p0.intensity) * ((_1124 * _1124) / ((_1076 * _1076) + 1.0));
        vec3 param = _p2.diffuseColor;
        float param_1 = _p2.roughness;
        float param_2 = _p2.NoV;
        float param_3 = _p2.NoL;
        float param_4 = clamp(dot(_p2.L, _p2.H), 0.0, 1.0);
        _p2.directDiffuse += ((_f4(param, param_1, param_2, param_3, param_4) * _1140) * _p2.NoL);
        vec3 param_5 = _p2.L;
        vec3 param_6 = _p2.V;
        vec3 param_7 = _p2.N;
        vec3 param_8 = normalize(_p1.tangent);
        vec3 param_9 = normalize(_p1.bitangent);
        float param_10 = _p2.linearRoughness;
        float param_11 = 0.0;
        vec3 param_12 = _p2.specularColor;
        _p2.directSpecular += ((_f9(param_5, param_6, param_7, param_8, param_9, param_10, param_11, param_12) * _1140) * _p2.NoL);
        if (_p1.clearCoat > 0.0)
        {
            _p2.clearCoatNoL = clamp(dot(_p2.clearCoatNormal, _p2.L), 0.0, 1.0);
            if (_p2.clearCoatNoL > 0.0)
            {
                _p2.clearCoatNoH = clamp(dot(_p2.clearCoatNormal, normalize(_p2.V + _p2.L)), 0.0, 1.0);
                vec3 param_13 = _p2.L;
                vec3 param_14 = _p2.V;
                vec3 param_15 = _p2.clearCoatNormal;
                float param_16 = _p2.clearCoatLinearRoughness;
                vec3 param_17 = _p1.clearCoatColor;
                _p2.directClearCoat += (((_f13(param_13, param_14, param_15, param_16, param_17) * _1140) * _p2.clearCoatNoL) * _p1.clearCoat);
            }
        }
    }
}

void _f18(LightSpot _p0, Material _p1, inout ShadingData _p2)
{
    vec3 _1268 = _p0.position - _p1.position;
    float _1271 = length(_1268);
    _p2.L = normalize(_1268);
    _p2.H = normalize(_p2.V + _p2.L);
    _p2.NoL = clamp(dot(_p2.N, _p2.L), 0.0, 1.0);
    _p2.NoH = clamp(dot(_p2.N, _p2.H), 0.0, 1.0);
    if (_p2.NoL > 0.0)
    {
        float _1319 = clamp(1.0 - pow(_1271 / _p0.falloff, 4.0), 0.0, 1.0);
        vec3 _1334 = _p2.L;
        vec3 _1354 = (_p0.color * _p0.intensity) * (((_1319 * _1319) / ((_1271 * _1271) + 1.0)) * smoothstep(_p0.outerAngleCos, _p0.innerAngleCos, dot(_1334, normalize(_p0.direction))));
        vec3 param = _p2.diffuseColor;
        float param_1 = _p2.roughness;
        float param_2 = _p2.NoV;
        float param_3 = _p2.NoL;
        float param_4 = clamp(dot(_p2.L, _p2.H), 0.0, 1.0);
        _p2.directDiffuse += ((_f4(param, param_1, param_2, param_3, param_4) * _1354) * _p2.NoL);
        vec3 param_5 = _p2.L;
        vec3 param_6 = _p2.V;
        vec3 param_7 = _p2.N;
        vec3 param_8 = normalize(_p1.tangent);
        vec3 param_9 = normalize(_p1.bitangent);
        float param_10 = _p2.linearRoughness;
        float param_11 = 0.0;
        vec3 param_12 = _p2.specularColor;
        _p2.directSpecular += ((_f9(param_5, param_6, param_7, param_8, param_9, param_10, param_11, param_12) * _1354) * _p2.NoL);
        if (_p1.clearCoat > 0.0)
        {
            _p2.clearCoatNoL = clamp(dot(_p2.clearCoatNormal, _p2.L), 0.0, 1.0);
            if (_p2.clearCoatNoL > 0.0)
            {
                _p2.clearCoatNoH = clamp(dot(_p2.clearCoatNormal, normalize(_p2.V + _p2.L)), 0.0, 1.0);
                vec3 param_13 = _p2.L;
                vec3 param_14 = _p2.V;
                vec3 param_15 = _p2.clearCoatNormal;
                float param_16 = _p2.clearCoatLinearRoughness;
                vec3 param_17 = _p1.clearCoatColor;
                _p2.directClearCoat += (((_f13(param_13, param_14, param_15, param_16, param_17) * _1354) * _p2.clearCoatNoL) * _p1.clearCoat);
            }
        }
    }
}

vec4 _f19(Material _p0, inout ShadingData _p1)
{
    Material param = _p0;
    ShadingData param_1 = _p1;
    _f15(param, param_1);
    _p1 = param_1;
    _p1.directDiffuse = vec3(0.0);
    _p1.directSpecular = vec3(0.0);
    _p1.indirectDiffuse = vec3(0.0);
    _p1.indirectSpecular = vec3(0.0);
    _p1.directClearCoat = vec3(0.0);
    _p1.indirectClearCoat = vec3(0.0);
    _p1.indirectDiffuse *= _p0.ambientOcclusion;
    _p1.indirectSpecular *= _p0.ambientOcclusion;
    if (u_enableDirectionalLight > 0)
    {
        LightDirectional param_2 = LightDirectional(u_DirLightsDirection[0], u_DirLightsColor[0], u_DirLightsIntensity[0]);
        Material param_3 = _p0;
        ShadingData param_4 = _p1;
        _f16(param_2, param_3, param_4);
        _p1 = param_4;
    }
    if (u_enablePointLight0 > 0)
    {
        LightPoint param_5 = LightPoint(u_PointLightsPosition[0], u_PointLightsColor[0], u_PointLightsIntensity[0], u_PointLightsAttenRangeInv[0]);
        Material param_6 = _p0;
        ShadingData param_7 = _p1;
        _f17(param_5, param_6, param_7);
        _p1 = param_7;
    }
    if (u_enablePointLight1 > 0)
    {
        LightPoint param_8 = LightPoint(u_PointLightsPosition[1], u_PointLightsColor[1], u_PointLightsIntensity[1], u_PointLightsAttenRangeInv[1]);
        Material param_9 = _p0;
        ShadingData param_10 = _p1;
        _f17(param_8, param_9, param_10);
        _p1 = param_10;
    }
    if (u_enableSpotLight0 > 0)
    {
        LightSpot param_11 = LightSpot(u_SpotLightsPosition[0], u_SpotLightsDirection[0], u_SpotLightsColor[0], u_SpotLightsIntensity[0], u_SpotLightsInnerAngleCos[0], u_SpotLightsOuterAngleCos[0], u_SpotLightsAttenRangeInv[0]);
        Material param_12 = _p0;
        ShadingData param_13 = _p1;
        _f18(param_11, param_12, param_13);
        _p1 = param_13;
    }
    if (u_enableSpotLight1 > 0)
    {
        LightSpot param_14 = LightSpot(u_SpotLightsPosition[1], u_SpotLightsDirection[1], u_SpotLightsColor[1], u_SpotLightsIntensity[1], u_SpotLightsInnerAngleCos[1], u_SpotLightsOuterAngleCos[1], u_SpotLightsAttenRangeInv[1]);
        Material param_15 = _p0;
        ShadingData param_16 = _p1;
        _f18(param_14, param_15, param_16);
        _p1 = param_16;
    }
    vec4 _t97 = vec4(0.0, 0.0, 0.0, 1.0);
    float param_17 = _p1.clearCoatNoV;
    vec3 _1706 = ((((_p1.indirectDiffuse + _p1.directDiffuse) + _p1.indirectSpecular) + _p1.directSpecular) * (1.0 - (_p0.clearCoat * _f12(param_17)))) + (_p1.directClearCoat + _p1.indirectClearCoat);
    _t97.x = _1706.x;
    _t97.y = _1706.y;
    _t97.z = _1706.z;
    vec4 _1715 = _t97;
    vec3 _1717 = _1715.xyz + _p0.emissive;
    _t97.x = _1717.x;
    _t97.y = _1717.y;
    _t97.z = _1717.z;
    _t97.w = _p0.albedo.w;
    vec4 _1727 = _t97;
    vec3 _1731 = min(_1727.xyz, vec3(65504.0));
    _t97.x = _1731.x;
    _t97.y = _1731.y;
    _t97.z = _1731.z;
    return _t97;
}

vec4 _f20(Material _p0)
{
    ShadingData _1742 = _f14();
    Material param = _p0;
    ShadingData param_1 = ShadingData(normalize(u_camPos - _p0.position), _1742.N, _1742.H, _1742.L, _1742.R, _1742.NoV, _1742.NoL, _1742.NoH, _1742.roughness, _1742.linearRoughness, _1742.diffuseColor, _1742.specularColor, _1742.energyCompensation, _1742.directDiffuse, _1742.directSpecular, _1742.indirectDiffuse, _1742.indirectSpecular, _1742.clearCoatNormal, _1742.clearCoatNoV, _1742.clearCoatNoL, _1742.clearCoatNoH, _1742.clearCoatRoughness, _1742.clearCoatLinearRoughness, _1742.directClearCoat, _1742.indirectClearCoat);
    vec4 _1754 = _f19(param, param_1);
    return _1754;
}

void main()
{
    vec3 _1766 = normalize(v_nDirWS);
    vec2 param = v_uv0;
    float param_1 = u_rotateUV;
    vec2 param_2 = u_offsetUV;
    vec2 param_3 = u_scaleUV;
    vec2 _1794 = _f0(param, param_1, param_2, param_3);
    vec2 param_4 = _1794;
    mediump int param_5 = u_wrapMode;
    vec4 _1802 = _f1(u_inputTex, param_4, param_5);
    vec4 _1811 = vec4(u_baseColor, 1.0) * _1802;
    vec4 _t109;
    if (u_enablePBR == 1)
    {
        float _1925;
        float _1926;
        vec3 _1927;
        vec3 _1928;
        if (u_enableClearCoat == 1)
        {
            _1925 = u_clearCoat;
            _1926 = u_clearCoatRoughness;
            _1928 = u_clearCoatColor;
            vec3 _1869;
            if (length(u_clearCoatNormal) > 0.100000001490116119384765625)
            {
                _1869 = normalize(u_clearCoatNormal);
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
            _1928 = vec3(1.0);
        }
        Material param_6 = Material(_1811, u_emissiveColor * u_emissiveIntensity, v_posWS, _1766, normalize(v_tDirWS), normalize(v_bDirWS), u_roughness, u_metallic, u_reflectance, u_ambientOcclusion, _1925, _1926, _1927, _1928);
        _t109 = mix(_1811, _f20(param_6), vec4(u_pbrBlend));
    }
    else
    {
        _t109 = _1811;
    }
    gl_FragData[0] = _t109;
}

