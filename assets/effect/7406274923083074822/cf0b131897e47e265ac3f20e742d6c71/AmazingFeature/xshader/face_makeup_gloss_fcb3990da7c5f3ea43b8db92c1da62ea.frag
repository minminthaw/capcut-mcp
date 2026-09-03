
#if defined(AE_FRAMEBUFFER_FETCH)
    #if defined(GL_EXT_shader_framebuffer_fetch)
        #extension GL_EXT_shader_framebuffer_fetch : require
    #elif defined(GL_ARM_shader_framebuffer_fetch)
        #extension GL_ARM_shader_framebuffer_fetch : require
    #endif
#endif
#define ae_insert_flip_uniform // FlipPatch will insert flip uniform here

precision highp float;

#ifdef AE_BASECOLOR_ENABLE
#undef AE_EMISSIVE     // sampler2D limit
#endif

varying vec3 pos0;
varying vec2 uv0;
varying vec2 uv1;
varying vec3 normal0;

uniform vec3 u_WorldSpaceCameraPos;
uniform float uRoughness;
uniform float uMetallic;
uniform float uOpacity;
uniform vec4 uAlbedoColor;
#ifdef AE_ALBEDOTEX_ENABLE
uniform sampler2D uAlbedoTexture;
#endif
#ifdef AE_NORMALTEX_ENABLE
uniform sampler2D uNormalTexture;
uniform float uNormalIntensity;
#endif
uniform mat4 uModel;
#ifdef AE_LIGHT_ENABLE
#ifdef AE_LIGHT_1_ENABLE
uniform vec4 uLight1Color;
uniform vec3 uLight1Dir;
uniform mat4 uLight1Rotate;
#endif
#ifdef AE_LIGHT_2_ENABLE
uniform vec4 uLight2Color;
uniform vec3 uLight2Dir;
uniform mat4 uLight2Rotate;
#endif
#ifdef AE_LIGHT_3_ENABLE
uniform vec4 uLight3Color;
uniform vec3 uLight3Dir;
uniform mat4 uLight3Rotate;
#endif
#ifdef AE_LIGHT_4_ENABLE
uniform vec4 uLight4Color;
uniform vec3 uLight4Dir;
uniform mat4 uLight4Rotate;
#endif
#endif

#ifdef AE_EMISSIVE
uniform vec4 uEmissiveColor;
uniform sampler2D uEmissiveTexture;
#endif

#ifdef AE_ENVIROMENT_ENABLE
uniform sampler2D uEnviroment;
uniform sampler2D uEnviromentMask;
uniform float uRotation;
uniform float uEnvExposure;
uniform float uEnviromentNormalInt;
uniform float uEnvRotate;
#ifdef AE_ENVIROMENT_EXTRA
uniform sampler2D uEnviroment2;
uniform sampler2D uEnviromentMask2;
uniform float uRotation2;
uniform float uEnvExposure2;
uniform float uEnviromentNormalInt2;
uniform float uEnvRotate2;
#endif
#endif

#ifdef AE_BASECOLOR_ENABLE
uniform vec4 uBaseColor;
uniform sampler2D uBaseTexture;
#endif

#ifdef AE_FACESEG_ENABLE
varying vec2 faceUV;
uniform float uFaceSegDetected;
uniform sampler2D uFaceSeg;
#endif

#ifdef AE_TEETHSEG_ENABLE
varying vec2 teethUV;
uniform float uTeethSegDetected;
uniform sampler2D uTeethSeg;
#endif

uniform sampler2D u_FBOTexture;
vec4 TextureFromFBO(vec2 uv)
{
    #if defined(AE_FRAMEBUFFER_FETCH)
        #if defined(GL_EXT_shader_framebuffer_fetch)
            vec4 result = gl_LastFragData[0].rgba;
        #elif defined(GL_ARM_shader_framebuffer_fetch)
            vec4 result = gl_LastFragColorARM;
        #else
            #error AE_FRAMEBUFFER_FETCH but no ext found!
        #endif
    #else
        vec4 result = texture2D(u_FBOTexture, uv);
    #endif
    return result;
}

const float fresnelPow = 5.0;
const float PI = 3.141592653;
const float F0Base = 0.04;

// blend----------------------------------------------------------------------------------------------
#if defined(AE_BLENDMODE_SCREEN) || defined(AE_BASE_BLENDMODE_SCREEN) || defined(AE_ENV_BLENDMODE_SCREEN)
vec3 BlendScreen(vec3 base, vec3 blend)
{
    return (1.0 - ((1.0 - base) * (1.0 - blend)));
}

vec3 BlendScreen(vec3 base, vec3 blend, float opacity)
{
    return (BlendScreen(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

#if defined(AE_BLENDMODE_ADD) || defined(AE_BASE_BLENDMODE_ADD) || defined(AE_ENV_BLENDMODE_ADD)
vec3 BlendAdd(vec3 base, vec3 blend)
{
    return min(base + blend, vec3(1.0));
}

vec3 BlendAdd(vec3 base, vec3 blend, float opacity)
{
    return (BlendAdd(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

#if defined(AE_BLENDMODE_MULTIPLAY) || defined(AE_BASE_BLENDMODE_MULTIPLAY) || defined(AE_ENV_BLENDMODE_MULTIPLAY)
vec3 BlendMultiply(vec3 base, vec3 blend)
{
    return base * blend;
}

vec3 BlendMultiply(vec3 base, vec3 blend, float opacity)
{
    return (BlendMultiply(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

#if defined(AE_BLENDMODE_OVERLAY) || defined(AE_BASE_BLENDMODE_OVERLAY) || defined(AE_ENV_BLENDMODE_OVERLAY)
float BlendOverlay(float base, float blend)
{
    return base < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend));
}

vec3 BlendOverlay(vec3 base, vec3 blend)
{
    return vec3(BlendOverlay(base.r, blend.r), BlendOverlay(base.g, blend.g), BlendOverlay(base.b, blend.b));
}

vec3 BlendOverlay(vec3 base, vec3 blend, float opacity)
{
    return (BlendOverlay(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

#if defined(AE_BLENDMODE_SOFTLIGHT) || defined(AE_BASE_BLENDMODE_SOFTLIGHT) || defined(AE_ENV_BLENDMODE_SOFTLIGHT)
float BlendSoftLight(float base, float blend)
{
    return (blend < 0.5) ? (2.0 * base * blend + base * base * (1.0 - 2.0 * blend)):(sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend));
}

vec3 BlendSoftLight(vec3 base, vec3 blend)
{
    return vec3(BlendSoftLight(base.r, blend.r), BlendSoftLight(base.g, blend.g), BlendSoftLight(base.b, blend.b));
}

vec3 BlendSoftLight(vec3 base, vec3 blend, float opacity)
{
    return (BlendSoftLight(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

#if defined(AE_BLENDMODE_AVERAGE) || defined(AE_BASE_BLENDMODE_AVERAGE) || defined(AE_ENV_BLENDMODE_AVERAGE)
vec3 BlendAverage(vec3 base, vec3 blend)
{
    return (base + blend) / 2.0;
}

vec3 BlendAverage(vec3 base, vec3 blend, float opacity)
{
    return (BlendAverage(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

#if defined(AE_BLENDMODE_COLORBURN) || defined(AE_BASE_BLENDMODE_COLORBURN) || defined(AE_ENV_BLENDMODE_COLORBURN)
float BlendColorBurn(float base, float blend)
{
    return (blend == 0.0) ? blend : max((1.0 - ((1.0 - base) / blend)),0.0);
}

vec3 BlendColorBurn(vec3 base, vec3 blend)
{
    return vec3(BlendColorBurn(base.r, blend.r), BlendColorBurn(base.g, blend.g), BlendColorBurn(base.b, blend.b));
}

vec3 BlendColorBurn(vec3 base, vec3 blend, float opacity)
{
    return (BlendColorBurn(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

#if defined(AE_BLENDMODE_COLORDODGE) || defined(AE_BASE_BLENDMODE_COLORDODGE) || defined(AE_ENV_BLENDMODE_COLORDODGE)
float BlendColorDodge(float base, float blend)
{
    return (blend == 1.0) ? blend : min(base / (1.0 - blend), 1.0);
}

vec3 BlendColorDodge(vec3 base, vec3 blend)
{
    return vec3(BlendColorDodge(base.r, blend.r), BlendColorDodge(base.g, blend.g), BlendColorDodge(base.b, blend.b));
}

vec3 BlendColorDodge(vec3 base, vec3 blend, float opacity)
{
    return (BlendColorDodge(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

#if defined(AE_BLENDMODE_DARKEN) || defined(AE_BASE_BLENDMODE_DARKEN) || defined(AE_ENV_BLENDMODE_DARKEN)
float BlendDarken(float base, float blend)
{
    return min(blend,base);
}

vec3 BlendDarken(vec3 base, vec3 blend)
{
    return vec3(BlendDarken(base.r,blend.r), BlendDarken(base.g,blend.g), BlendDarken(base.b,blend.b));
}

vec3 BlendDarken(vec3 base, vec3 blend, float opacity)
{
    return (BlendDarken(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

#if defined(AE_BLENDMODE_DIFFERENCE) || defined(AE_BASE_BLENDMODE_DIFFERENCE) || defined(AE_ENV_BLENDMODE_DIFFERENCE)
vec3 BlendDifference(vec3 base, vec3 blend)
{
    return abs(base - blend);
}

vec3 BlendDifference(vec3 base, vec3 blend, float opacity)
{
    return (BlendDifference(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

#if defined(AE_BLENDMODE_EXCLUSION) || defined(AE_BASE_BLENDMODE_EXCLUSION) || defined(AE_ENV_BLENDMODE_EXCLUSION)
vec3 BlendExclusion(vec3 base, vec3 blend)
{
    return base + blend - 2.0 * base * blend;
}

vec3 BlendExclusion(vec3 base, vec3 blend, float opacity)
{
	return (BlendExclusion(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

#if defined(AE_BLENDMODE_LIGHTEN) || defined(AE_BASE_BLENDMODE_LIGHTEN) || defined(AE_ENV_BLENDMODE_LIGHTEN)
float BlendLighten(float base, float blend)
{
    return max(blend,base);
}

vec3 BlendLighten(vec3 base, vec3 blend)
{
    return vec3(BlendLighten(base.r,blend.r), BlendLighten(base.g,blend.g), BlendLighten(base.b,blend.b));
}

vec3 BlendLighten(vec3 base, vec3 blend, float opacity)
{
    return (BlendLighten(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

#if defined(AE_BLENDMODE_LINEARDODGE) || defined(AE_BASE_BLENDMODE_LINEARDODGE) || defined(AE_ENV_BLENDMODE_LINEARDODGE)
float BlendLinearDodge(float base, float blend)
{
    return min(base + blend, 1.0);
}

vec3 BlendLinearDodge(vec3 base, vec3 blend)
{
    return min(base + blend, vec3(1.0));
}

vec3 BlendLinearDodge(vec3 base, vec3 blend, float opacity)
{
    return (BlendLinearDodge(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

// blend mode of light color
vec3 Blend(vec3 base, vec3 blend, float alpha)
{
    blend = clamp(blend, 0.0, 1.0);
    vec3 color = base * (1.0 - alpha) + blend * alpha;
#ifdef AE_BLENDMODE_SCREEN
    color = BlendScreen(base, blend, alpha);
#endif
#ifdef AE_BLENDMODE_ADD
    color = BlendAdd(base, blend, alpha);
#endif
#ifdef AE_BLENDMODE_MULTIPLAY
    color = BlendMultiply(base, blend, alpha);
#endif
#ifdef AE_BLENDMODE_OVERLAY
    color = BlendOverlay(base, blend, alpha);
#endif
#ifdef AE_BLENDMODE_SOFTLIGHT
    color = BlendSoftLight(base, blend, alpha);
#endif
#ifdef AE_BLENDMODE_AVERAGE
    color = BlendAverage(base, blend, alpha);
#endif
#ifdef AE_BLENDMODE_COLORBURN
    color = BlendColorBurn(base, blend, alpha);
#endif
#ifdef AE_BLENDMODE_COLORDODGE
    color = BlendColorDodge(base, blend, alpha);
#endif
#ifdef AE_BLENDMODE_DARKEN
    color = BlendDarken(base, blend, alpha);
#endif
#ifdef AE_BLENDMODE_DIFFERENCE
    color = BlendDifference(base, blend, alpha);
#endif
#ifdef AE_BLENDMODE_EXCLUSION
    color = BlendExclusion(base, blend, alpha);
#endif
#ifdef AE_BLENDMODE_LIGHTEN
    color = BlendLighten(base, blend, alpha);
#endif
#ifdef AE_BLENDMODE_LINEARDODGE
    color = BlendLinearDodge(base, blend, alpha);
#endif
    return color;
}

// blend mode of base color --------------------------------------------------------------
#ifdef AE_BASECOLOR_ENABLE
vec3 BaseBlend(vec3 base, vec3 blend, float alpha)
{
    float nonZeroAlpha = step(0.0, -alpha) * 0.000001 + alpha;
    blend = clamp(blend / nonZeroAlpha, 0.0, 1.0);
    vec3 color = base * (1.0 - alpha) + blend * alpha;
#ifdef AE_BASE_BLENDMODE_SCREEN
    color = BlendScreen(base, blend, alpha);
#endif
#ifdef AE_BASE_BLENDMODE_ADD
    color = BlendAdd(base, blend, alpha);
#endif
#ifdef AE_BASE_BLENDMODE_MULTIPLAY
    color = BlendMultiply(base, blend, alpha);
#endif
#ifdef AE_BASE_BLENDMODE_OVERLAY
    color = BlendOverlay(base, blend, alpha);
#endif
#ifdef AE_BASE_BLENDMODE_SOFTLIGHT
    color = BlendSoftLight(base, blend, alpha);
#endif
#ifdef AE_BASE_BLENDMODE_AVERAGE
    color = BlendAverage(base, blend, alpha);
#endif
#ifdef AE_BASE_BLENDMODE_COLORBURN
    color = BlendColorBurn(base, blend, alpha);
#endif
#ifdef AE_BASE_BLENDMODE_COLORDODGE
    color = BlendColorDodge(base, blend, alpha);
#endif
#ifdef AE_BASE_BLENDMODE_DARKEN
    color = BlendDarken(base, blend, alpha);
#endif
#ifdef AE_BASE_BLENDMODE_DIFFERENCE
    color = BlendDifference(base, blend, alpha);
#endif
#ifdef AE_BASE_BLENDMODE_EXCLUSION
    color = BlendExclusion(base, blend, alpha);
#endif
#ifdef AE_BASE_BLENDMODE_LIGHTEN
    color = BlendLighten(base, blend, alpha);
#endif
#ifdef AE_BASE_BLENDMODE_LINEARDODGE
    color = BlendLinearDodge(base, blend, alpha);
#endif
    return color;
}
#endif

#ifdef AE_ENVIROMENT_ENABLE
// blend mode of enviroment
vec3 EnviromentBlend(vec3 base, vec3 blend, float alpha)
{
    blend = clamp(blend, 0.0, 1.0);
    vec3 color = base * (1.0 - alpha) + blend * alpha;
#ifdef AE_ENV_BLENDMODE_SCREEN
    color = BlendScreen(base, blend, alpha);
#endif
#ifdef AE_ENV_BLENDMODE_ADD
    color = BlendAdd(base, blend, alpha);
#endif
#ifdef AE_ENV_BLENDMODE_MULTIPLAY
    color = BlendMultiply(base, blend, alpha);
#endif
#ifdef AE_ENV_BLENDMODE_OVERLAY
    color = BlendOverlay(base, blend, alpha);
#endif
#ifdef AE_ENV_BLENDMODE_SOFTLIGHT
    color = BlendSoftLight(base, blend, alpha);
#endif
#ifdef AE_ENV_BLENDMODE_AVERAGE
    color = BlendAverage(base, blend, alpha);
#endif
#ifdef AE_ENV_BLENDMODE_COLORBURN
    color = BlendColorBurn(base, blend, alpha);
#endif
#ifdef AE_ENV_BLENDMODE_COLORDODGE
    color = BlendColorDodge(base, blend, alpha);
#endif
#ifdef AE_ENV_BLENDMODE_DARKEN
    color = BlendDarken(base, blend, alpha);
#endif
#ifdef AE_ENV_BLENDMODE_DIFFERENCE
    color = BlendDifference(base, blend, alpha);
#endif
#ifdef AE_ENV_BLENDMODE_EXCLUSION
    color = BlendExclusion(base, blend, alpha);
#endif
#ifdef AE_ENV_BLENDMODE_LIGHTEN
    color = BlendLighten(base, blend, alpha);
#endif
#ifdef AE_ENV_BLENDMODE_LINEARDODGE
    color = BlendLinearDodge(base, blend, alpha);
#endif
    return color;
}
#endif

#ifdef AE_NORMALTEX_ENABLE
mat3 GetRotation(vec3 vecAft)
{
    // vecBef = vec3(0.0, 0.0, 1.0)
    vec3 rotateAxis = normalize(vec3(-vecAft.y, vecAft.x, 0.0));
    float cosAngle = vecAft.z;
    float sinAngle = sin(acos(cosAngle));
    mat3 rotate;
    // Rodrigues' rotation formula
    rotate[0][0] = cosAngle + (1.0 - cosAngle) * rotateAxis.x * rotateAxis.x;
    rotate[0][1] = (1.0 - cosAngle) * rotateAxis.x * rotateAxis.y - sinAngle * rotateAxis.z;
    rotate[0][2] = (1.0 - cosAngle) * rotateAxis.x * rotateAxis.z + sinAngle * rotateAxis.y;
    rotate[1][0] = (1.0 - cosAngle) * rotateAxis.x * rotateAxis.y + sinAngle * rotateAxis.z;
    rotate[1][1] = cosAngle + (1.0 - cosAngle) * rotateAxis.y * rotateAxis.y;
    rotate[1][2] = (1.0 - cosAngle) * rotateAxis.y * rotateAxis.z - sinAngle * rotateAxis.x;
    rotate[2][0] = (1.0 - cosAngle) * rotateAxis.z * rotateAxis.x - sinAngle * rotateAxis.y;
    rotate[2][1] = (1.0 - cosAngle) * rotateAxis.y * rotateAxis.z + sinAngle * rotateAxis.x;
    rotate[2][2] = cosAngle + (1.0 - cosAngle) * rotateAxis.z * rotateAxis.z;
    return rotate;
}

vec3 GetNormal(vec3 normalBase, vec3 normalTex)
{
    mat3 rotate = GetRotation(normalBase);
    return normalize(mix(vec3(0.0, 0.0, 1.0), normalTex, uNormalIntensity) * rotate);
}
#endif

vec3 GetFresnel(float hov, vec3 F0)
{
    vec3 fresnel = F0 + (vec3(1.0) - F0) * pow((1.0 - hov), fresnelPow);
    return fresnel;
}

float GetDGGX(float noh, float roughness)
{
    float r2 = roughness * roughness;
    float r4 = r2 * r2;
    float nhGGX = noh * noh * (r4 - 1.0) + 1.0;
    nhGGX = max(nhGGX, 0.001);
    float D = r4 / (PI * nhGGX * nhGGX);
    return D;
}

float GetGSmith(float nov, float nol, float roughness)
{
    float r2 = roughness + 1.0;
    float r4 = r2 * r2 / 8.0;
    float nvSmith = nov / (nov * (1.0 - r4) + r4 + 0.001);
    float nlSmith = nol / (nol * (1.0 - r4) + r4 + 0.001);
    float G = nvSmith * nlSmith;
    return G;
}

vec3 GetDiffuse(vec3 diffuseColor)
{
    diffuseColor = diffuseColor / PI; 
    return diffuseColor;
}

vec3 GetBRDF(vec3 normal, vec3 viewDir, vec3 albedo)
{
    vec3 colorRes = vec3(0.0);
#ifdef AE_LIGHT_ENABLE
    float nov = max(0.0, dot(normal, viewDir));
    int lightNum = 0;
    mat4 lightColor;
    mat4 lightDir;
#ifdef AE_LIGHT_1_ENABLE
    lightColor[lightNum] = uLight1Color;
    lightDir[lightNum] = vec4(uLight1Dir, 0.0) * uLight1Rotate;
    lightNum++;
#endif
#ifdef AE_LIGHT_2_ENABLE
    lightColor[lightNum] = uLight2Color;
    lightDir[lightNum] = vec4(uLight2Dir, 0.0) * uLight2Rotate;
    lightNum++;
#endif
#ifdef AE_LIGHT_3_ENABLE
    lightColor[lightNum] = uLight3Color;
    lightDir[lightNum] = vec4(uLight3Dir, 0.0) * uLight3Rotate;
    lightNum++;
#endif
#ifdef AE_LIGHT_4_ENABLE
    lightColor[lightNum] = uLight4Color;
    lightDir[lightNum] = vec4(uLight4Dir, 0.0) * uLight4Rotate;
    lightNum++;
#endif
    vec3 F0 = mix(vec3(F0Base), albedo, uMetallic);
    for (int i = 0; i < lightNum; i++)
    {
        vec3 lightDir = normalize(-lightDir[i].xyz);
        vec3 h = normalize(lightDir + viewDir);
        float nol = max(0.0, dot(normal, lightDir));
        float noh = max(0.0, dot(normal, h));
        float hov = max(0.0, dot(h, viewDir));
        float D = GetDGGX(noh, uRoughness);
        float G = GetGSmith(nov, nol, uRoughness);
        vec3 fresnel = GetFresnel(hov, F0);
        vec3 ks = fresnel;
        vec3 kd = (vec3(1.0) - uMetallic) * (1.0 - uMetallic);
        vec3 diffuse = GetDiffuse(albedo) * nol * kd;
        vec3 specular = D * G * fresnel;
        vec3 color = (specular + diffuse) * lightColor[i].rgb * lightColor[i].a;
        colorRes += color;
    }
#endif
    return colorRes;
}

// Enviroment-------------------------------------------------------------------
#ifdef AE_ENVIROMENT_ENABLE
float Atan2(float x, float y)
{
    float signx = x < 0.0 ? -1.0 : 1.0;
    return signx * acos(clamp(y / length(vec2(x, y)), -1.0, 1.0));
}

vec2 DirToPanoramicTexCoords(vec3 reflDir, float rotation)
{
    vec2 uv;
    uv.x = Atan2(reflDir.x, -reflDir.z) - PI / 2.0;
    uv.y = acos(reflDir.y);
    uv = uv / vec2(2.0 * PI, PI);
    uv.x += rotation;
    uv.x = fract(uv.x + floor(uv.x) + 1.0);
    return uv;
}

vec3 IBLShading(vec3 normalBase, vec3 normal, float enviromentNormalInt, sampler2D envTexture, float rotation)
{
    vec3 viewDir = normalize(u_WorldSpaceCameraPos - pos0);
    vec3 normalEnv = normalBase;
#ifdef AE_NORMALTEX_ENABLE
    normalEnv = mix(vec3(0.0, 0.0, 1.0), normal, enviromentNormalInt);
    normalEnv = GetNormal(normalBase, normalEnv);
#endif
    vec3 reflectDir = normalize(reflect(pos0 - u_WorldSpaceCameraPos, normalEnv));
    vec2 uv = DirToPanoramicTexCoords(reflectDir, rotation);
    vec3 radiance = texture2D(envTexture, uv).rgb;
    return radiance;
}

vec3 EnviromentColor(vec3 normalBase, vec3 normal)
{
    vec3 color = vec3(0.0);
    float alpha = texture2D(uEnviromentMask, uv0).r;
    vec3 enviromentColor = IBLShading(normalBase, normal, uEnviromentNormalInt, uEnviroment, uRotation + uEnvRotate);
    enviromentColor *= alpha * uEnvExposure;
    color += enviromentColor.rgb;
#ifdef AE_ENVIROMENT_EXTRA
    alpha = texture2D(uEnviromentMask2, uv0).r;
    enviromentColor = IBLShading(normalBase, normal, uEnviromentNormalInt2, uEnviroment2, uRotation2 + uEnvRotate2);
    enviromentColor *= alpha * uEnvExposure2;
    color += enviromentColor.rgb;
#endif
    return color;
}
#endif    // Enviroment----------------------------------------------------------------

float GetFaceSeg()
{
    float weight = 1.0;
#ifdef AE_FACESEG_ENABLE
    vec4 maskFace = texture2D(uFaceSeg, faceUV);
    float weightFace = maskFace.r;
    // 0.1, to avoid some basecase at the edge
    float uvFlagFace = 1.0 - step(0.1, faceUV.y);
    weightFace = max(uvFlagFace, weightFace);
    uvFlagFace = step(0.0, faceUV.x);
    float uvFlagFace2 = 1.0 - step(1.0, faceUV.x);
    weightFace = weightFace * uvFlagFace * uvFlagFace2;
    weightFace = max(weightFace, 1.0 - uFaceSegDetected);
    weight = min(weight, weightFace);
#endif
#ifdef AE_TEETHSEG_ENABLE
    vec4 maskTeeth = texture2D(uTeethSeg, teethUV);
    float weightTeeth = maskTeeth.r;
    float uvFlagTeeth = step(0.0, teethUV.x);
    float uvFlagTeeth2 = 1.0 - step(1.0, teethUV.x);
    weightTeeth = 1.0 - weightTeeth * uvFlagTeeth * uvFlagTeeth2;
    weightTeeth = max(weightTeeth, 1.0 - uTeethSegDetected);
    weight = min(weight, weightTeeth);
#endif
    return weight;
}

void main()
{
    vec4 srcColor = texture2D(u_FBOTexture, uv1);
    if (normal0.x == 0.0 && normal0.y == 0.0 && normal0.z == 0.0) {
        gl_FragColor = srcColor;
    } else {
        vec4 baseColor = srcColor;
#ifdef AE_BASECOLOR_ENABLE
        vec4 colorTex = texture2D(uBaseTexture, uv0);
#ifdef AE_BASETEX_COLORMODE
        colorTex.rgb = colorTex.rgb * uBaseColor.rgb * uBaseColor.a;
#else
        colorTex.a = colorTex.r;
        colorTex.rgb = uBaseColor.rgb * uBaseColor.a;
#endif
        baseColor.rgb = BaseBlend(srcColor.rgb, colorTex.rgb, colorTex.a);
#endif
        vec3 normalBase = normalize(mat3(uModel) * normal0);
        vec3 normal = normalBase;
        vec3 normalTex = vec3(0.0, 0.0, 1.0);
#ifdef AE_NORMALTEX_ENABLE
        normalTex = normalize((texture2D(uNormalTexture, uv0) * 2.0 - 1.0).rgb);
        normal = GetNormal(normalBase, normalTex);
#endif
        vec3 viewDir = normalize(u_WorldSpaceCameraPos - pos0);
        vec3 albedo = baseColor.rgb * uAlbedoColor.rgb * uAlbedoColor.a;
        vec4 alphaAlbedo = vec4(0.0, 0.0, 0.0, 1.0);
#ifdef AE_ALBEDOTEX_ENABLE
        alphaAlbedo = texture2D(uAlbedoTexture, uv0);
#ifdef AE_ALBEDO_COLORMODE
        albedo = albedo * alphaAlbedo.rgb;
#else
        alphaAlbedo.a = alphaAlbedo.r;
#endif
#endif
        vec3 lightColor = GetBRDF(normal, viewDir, albedo);
        vec3 color = lightColor;
#ifdef AE_EMISSIVE
        vec4 alphaEmission = texture2D(uEmissiveTexture, uv0);
#ifdef AE_EMISSIVE_COLORMODE
        color += uEmissiveColor.rgb * uEmissiveColor.a * alphaEmission.rgb * alphaEmission.a;
#else
        color += uEmissiveColor.rgb * uEmissiveColor.a * alphaEmission.r;
#endif
#endif
        color = Blend(baseColor.rgb, color.rgb, alphaAlbedo.r);
#ifdef AE_ENVIROMENT_ENABLE
        vec3 envColor = EnviromentColor(normalBase, normalTex);
        color = EnviromentBlend(color, envColor, 1.0);
#endif
        float segWeight = GetFaceSeg();
        color = mix(srcColor.rgb, color, uOpacity * segWeight);
        color = clamp(color, 0.0, 1.0);
        gl_FragColor = vec4(color, 1.0); 
    }
}
