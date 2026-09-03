precision highp float;
varying vec2 texCoord;
varying vec2 sucaiTexCoord;

uniform sampler2D u_FBOTexture;
uniform sampler2D blendmodeMultiplyTexture;
uniform sampler2D blendmodeColorTexture;
uniform sampler2D blendmodeNormalTexture;
uniform float opacity;
uniform float intensity;

#ifdef USE_SEG
varying vec2 segCoord;
uniform sampler2D segMaskTexture;
#endif

#if defined(AMAZING_USE_BLENDMODE_MUTIPLAY) || defined(AMAZING_USE_BLENDMODE_MUTIPLAY_FORREFLECT)
vec3 BlendMultiply(vec3 base, vec3 blend)
{
    return base * blend;
}
vec3 BlendMultiply(vec3 base, vec3 blend, float opacity)
{
    return (BlendMultiply(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

#if defined(AMAZING_USE_BLENDMODE_OVERLAY) || defined(AMAZING_USE_BLENDMODE_OVERLAY_FORREFLECT)
float BlendOverlay(float base, float blend)
{
    return base < 0.5 ? (2.0 * base * blend) :(1.0 - 2.0 * (1.0 - base) * (1.0 - blend));
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

#if defined(AMAZING_USE_BLENDMODE_ADD) || defined(AMAZING_USE_BLENDMODE_ADD_FORREFLECT)
vec3 BlendAdd(vec3 base, vec3 blend)
{
    return min(base + blend,vec3(1.0));
}
vec3 BlendAdd(vec3 base, vec3 blend, float opacity)
{
    return (BlendAdd(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

#if defined(AMAZING_USE_BLENDMODE_SCREEN) || defined(AMAZING_USE_BLENDMODE_SCREEN_FORREFLECT)
vec3 BlendScreen(vec3 base, vec3 blend)
{
    return vec3(1.0) - ((vec3(1.0) - base) * (vec3(1.0) - blend));
}
vec3 BlendScreen(vec3 base, vec3 blend, float opacity)
{
    return (BlendScreen(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

#if defined(AMAZING_USE_BLENDMODE_SOFTLIGHT) || defined(AMAZING_USE_BLENDMODE_SOFTLIGHT_FORREFLECT)
float BlendSoftLight(float base, float blend)
{
    return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
}
vec3 BlendSoftLight(vec3 base, vec3 blend)
{
    return vec3(BlendSoftLight(base.r,blend.r),BlendSoftLight(base.g,blend.g),BlendSoftLight(base.b,blend.b));
}
vec3 BlendSoftLight(vec3 base, vec3 blend, float opacity)
{
    return (BlendSoftLight(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

#if defined(AMAZING_USE_BLENDMODE_AVERAGE) || defined(AMAZING_USE_BLENDMODE_AVERAGE_FORREFLECT)
vec3 BlendAverage(vec3 base, vec3 blend)
{
    return (base + blend) / 2.0;
}
vec3 BlendAverage(vec3 base, vec3 blend, float opacity)
{
    return (BlendAverage(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

#if defined(AMAZING_USE_BLENDMODE_COLORBURN) || defined(AMAZING_USE_BLENDMODE_COLORBURN_FORREFLECT)
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

#if defined(AMAZING_USE_BLENDMODE_COLORDODGE) || defined(AMAZING_USE_BLENDMODE_COLORDODGE_FORREFLECT)
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

#if defined(AMAZING_USE_BLENDMODE_DARKEN) || defined(AMAZING_USE_BLENDMODE_DARKEN_FORREFLECT)
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

#if defined(AMAZING_USE_BLENDMODE_DIFFERENCE) || defined(AMAZING_USE_BLENDMODE_DIFFERENCE_FORREFLECT)
vec3 BlendDifference(vec3 base, vec3 blend)
{
    return abs(base - blend);
}
vec3 BlendDifference(vec3 base, vec3 blend, float opacity)
{
    return (BlendDifference(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

#if defined(AMAZING_USE_BLENDMODE_EXCLUSION) || defined(AMAZING_USE_BLENDMODE_EXCLUSION_FORREFLECT)
vec3 BlendExclusion(vec3 base, vec3 blend)
{
    return base + blend - 2.0 * base * blend;
}
vec3 BlendExclusion(vec3 base, vec3 blend, float opacity)
{
    return (BlendExclusion(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

#if defined(AMAZING_USE_BLENDMODE_LIGHTEN) || defined(AMAZING_USE_BLENDMODE_LIGHTEN_FORREFLECT)
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

#if defined(AMAZING_USE_BLENDMODE_LINEARDODGE) || defined(AMAZING_USE_BLENDMODE_LINEARDODGE_FORREFLECT)
float BlendLinearDodge(float base, float blend)
{
    return min(base + blend, 1.0);
}
vec3 BlendLinearDodge(vec3 base, vec3 blend)
{
    return min(base + blend,vec3(1.0));
}
vec3 BlendLinearDodge(vec3 base, vec3 blend, float opacity)
{
    return (BlendLinearDodge(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

#if defined(AMAZING_USE_BLENDMODE_COLOR)
vec3 rgb2hsl(vec3 c)
{
    float h = 0.0;
    float s = 0.0;
    float l = 0.0;
    float r = c.r;
    float g = c.g;
    float b = c.b;
    float cMin = min(r, min(g,b));
    float cMax = max(r, max(g,b));
    l = (cMax + cMin) / 2.0;
    if (cMax > cMin) {
        float cDelta = cMax - cMin;
        s = l < 0.0 ? cDelta / (cMax + cMin) : cDelta / (2.0 - (cMax + cMin));
        if (r == cMax) {
            h = (g - b) / cDelta;
        } else if (g == cMax) {
            h = 2.0 + (b - r) / cDelta;
        } else {
            h = 4.0 + (r - g) / cDelta;
        }
        if (h < 0.0) {
            h += 6.0;
        }
        h = h / 6.0;
    }
    return vec3(h, s, l);
}
vec3 hsl2rgb(vec3 c)
{
    vec3 rgb = clamp(abs(mod(vec3(c.x*6.0)+vec3(0.0,4.0,2.0), 6.0)-vec3(3.0))-vec3(1.0), 0.0, 1.0);
    return vec3(c.z) + c.y * (rgb-vec3(0.5)) * (1.0-abs(2.0*c.z-1.0));
}

float getgray(vec3 col){
    return dot(col,vec3(.299,.587,.114));
}

vec3 BlendColor(vec3 base, vec3 blend){
    // vec4 result = vec4(0., 0., 0., 1.);
    vec3 resultCol=vec3(0., 0., 0.);
    float blendGray = getgray(blend.rgb);
    float baseGray = getgray(base.rgb);
    if(blendGray>baseGray){
        resultCol = baseGray/blendGray*blend.rgb;
    }else{
        vec3 overcol = vec3(1.)*(baseGray-blendGray)+blend.rgb;
        if(overcol.r>1.||overcol.g>1.||overcol.b>1.){
            // overcol = vec3(1.)*(baseGray-blendGray)/(1.-blendGray)+blend.rgb;
            // overcol += (max(max(overcol.r,overcol.g),overcol.b)-1.0)*2.0*blend.rgb;
            // overcol=vec3(0.);
        }
        resultCol = overcol;
    }
    return resultCol;
}

vec3 BlendColor2(vec3 base, vec3 blend)
{
    vec3 baseHsl = rgb2hsl(blend);
    return hsl2rgb(vec3(baseHsl.r, baseHsl.g, rgb2hsl(base).b));
}

vec3 BlendColor(vec3 base, vec3 blend, float opacity)
{
    return (BlendColor(base, blend) * opacity + base * (1.0 - opacity));
}
#endif

vec3 ApplyBlendModeColor(vec3 base, vec3 blend, float opacity)
{
    vec3 ret = blend;
#ifdef AMAZING_USE_BLENDMODE_COLOR
    ret = BlendColor(base, blend, opacity);
#endif
    return ret;
}

vec3 ApplyBlendModeMultiply(vec3 base, vec3 blend, float opacity)
{
    vec3 ret = blend;
#ifdef AMAZING_USE_BLENDMODE_MUTIPLAY
    ret = BlendMultiply(base, blend, opacity);
#endif
    return ret;
}

vec3 ApplyBlendModeNormal(vec3 base, vec3 blend, float opacity)
{
    vec3 ret = blend;
    return ret;
}

vec3 ApplyReflectBlendMode(vec3 base, vec3 blend, float opacity)
{
    vec3 ret = blend;
#ifdef AMAZING_USE_BLENDMODE_MUTIPLAY_FORREFLECT
    ret = BlendMultiply(base, blend, opacity);
#endif

#ifdef AMAZING_USE_BLENDMODE_OVERLAY_FORREFLECT
    ret = BlendOverlay(base, blend, opacity);
#endif

#ifdef AMAZING_USE_BLENDMODE_ADD_FORREFLECT
    ret = BlendAdd(base, blend, opacity);
#endif

#ifdef AMAZING_USE_BLENDMODE_SCREEN_FORREFLECT
    ret = BlendScreen(base, blend, opacity);
#endif

#ifdef AMAZING_USE_BLENDMODE_SOFTLIGHT_FORREFLECT
    ret = BlendSoftLight(base, blend, opacity);
#endif

#ifdef AMAZING_USE_BLENDMODE_AVERAGE_FORREFLECT
    ret = BlendAverage(base, blend, opacity);
#endif

#ifdef AMAZING_USE_BLENDMODE_COLORBURN_FORREFLECT
    ret = BlendColorBurn(base, blend, opacity);
#endif

#ifdef AMAZING_USE_BLENDMODE_COLORDODGE_FORREFLECT
    ret = BlendColorDodge(base, blend, opacity);
#endif

#ifdef AMAZING_USE_BLENDMODE_DARKEN_FORREFLECT
    ret = BlendDarken(base, blend, opacity);
#endif

#ifdef AMAZING_USE_BLENDMODE_DIFFERENCE_FORREFLECT
    ret = BlendDifference(base, blend, opacity);
#endif

#ifdef AMAZING_USE_BLENDMODE_EXCLUSION_FORREFLECT
    ret = BlendExclusion(base, blend, opacity);
#endif

#ifdef AMAZING_USE_BLENDMODE_LIGHTEN_FORREFLECT
    ret = BlendLighten(base, blend, opacity);
#endif

#ifdef AMAZING_USE_BLENDMODE_LINEARDODGE_FORREFLECT
    ret = BlendLinearDodge(base, blend, opacity);
#endif
    return ret;
}

void main(void)
{
    lowp vec4 src = texture2D(u_FBOTexture, texCoord);
    float nonZeroSrcAlpha = step(0.0, -src.a) * 0.000001 + src.a;
    vec3 srcColor = clamp(src.rgb / nonZeroSrcAlpha, 0.0, 1.0);
    vec3 blendColor = srcColor;

#ifdef AMAZING_USE_BLENDMODE_COLOR_TEXTURE
    vec4 color_sucai = texture2D(blendmodeColorTexture, sucaiTexCoord) * clamp(intensity * opacity, 0.0, 1.0);
    float nonZeroColorSucaiAlpha = step(0.0, -color_sucai.a) * 0.000001 + color_sucai.a;
    color_sucai.rgb = ApplyBlendModeColor(blendColor, clamp(color_sucai.rgb / nonZeroColorSucaiAlpha, 0.0, 1.0), 1.0);
    blendColor = mix(blendColor, color_sucai.rgb, color_sucai.a);
#endif

#ifdef AMAZING_USE_BLENDMODE_MUTIPLAY_TEXTURE
    vec4 multiply_sucai = texture2D(blendmodeMultiplyTexture, sucaiTexCoord) * clamp(intensity * opacity, 0.0, 1.0);
    float nonZeroMultiplySucaiAlpha = step(0.0, -multiply_sucai.a) * 0.000001 + multiply_sucai.a;
    multiply_sucai.rgb = ApplyBlendModeMultiply(blendColor, clamp(multiply_sucai.rgb / nonZeroMultiplySucaiAlpha, 0.0, 1.0), 1.0);
    blendColor = mix(blendColor, multiply_sucai.rgb, multiply_sucai.a);
#endif

    //Normal
#ifdef AMAZING_USE_BLENDMODE_NORMAL_TEXTURE
    vec4 normal_sucai = texture2D(blendmodeNormalTexture, sucaiTexCoord) * clamp(intensity * opacity, 0.0, 1.0);
    float nonZeroNormalSucaiAlpha = step(0.0, -normal_sucai.a) * 0.000001 + normal_sucai.a;
    normal_sucai.rgb = ApplyBlendModeNormal(blendColor, clamp(normal_sucai.rgb / nonZeroNormalSucaiAlpha, 0.0, 1.0), 1.0);
    blendColor = mix(blendColor, normal_sucai.rgb, normal_sucai.a);
#endif

#ifdef USE_SEG
    float seg_opacity = (texture2D(segMaskTexture, segCoord)).x;
    if(clamp(segCoord, 0.0, 1.0) != segCoord) seg_opacity = 1.;
    blendColor = mix(srcColor, blendColor, seg_opacity);
#endif
    gl_FragColor = vec4(blendColor, 1.0) * src.a;
}