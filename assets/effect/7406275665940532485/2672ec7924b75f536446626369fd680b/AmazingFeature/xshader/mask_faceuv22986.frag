#if defined(AE_FRAMEBUFFER_FETCH)
    #if defined(GL_EXT_shader_framebuffer_fetch)
        #extension GL_EXT_shader_framebuffer_fetch : require
    #elif defined(GL_ARM_shader_framebuffer_fetch)
        #extension GL_ARM_shader_framebuffer_fetch : require
    #endif
#endif
#define ae_insert_flip_uniform // FlipPatch will insert flip uniform here

precision highp float;
varying vec2 texCoord;
varying vec2 sucaiTexCoord;
uniform float opacity;

uniform sampler2D u_FBOTexture;
uniform sampler2D videoImageTexture;
uniform sampler2D sucaiImageTexture;

uniform float intensity;

#ifdef USE_SEG
 varying vec2 segCoord;
 uniform sampler2D segMaskTexture;
#endif

vec3 blendMultiply(vec3 base, vec3 blend) {
    return base * blend;
}

vec3 blendMultiply(vec3 base, vec3 blend, float opacity) {
    return (blendMultiply(base, blend) * opacity + blend * (1.0 - opacity));
}

lowp vec4 textureFromInput()
{
    #if defined(AE_FRAMEBUFFER_FETCH)
        #if defined(GL_EXT_shader_framebuffer_fetch)
            lowp vec4 result = gl_LastFragData[0].rgba;
        #elif defined(GL_ARM_shader_framebuffer_fetch)
            lowp vec4 result = gl_LastFragColorARM;
        #else
            #error AE_FRAMEBUFFER_FETCH but no ext found!
        #endif
    #else
        lowp vec4 result = texture2D(u_FBOTexture, texCoord);
    #endif
    return result;
}

void main(void)
{
    vec4 src = textureFromInput();
    vec4 sucai = texture2D(sucaiImageTexture, sucaiTexCoord);
    vec4 inputimage = textureFromInput();

    // PIfangan
    vec3 color = blendMultiply(src.rgb, clamp(sucai.rgb * (1.0 / sucai.a), 0.0, 1.0));
#ifdef USE_SEG
    float seg_opacity = (texture2D(segMaskTexture, segCoord)).x;
    if(clamp(segCoord, 0.0, 1.0) != segCoord) seg_opacity = 1.0;
    color = mix(inputimage.rgb, color, seg_opacity);
#endif

#ifdef BLENDFUN_USEABLE
    float alpha = sucai.a * intensity * opacity;
    color *= alpha;
    gl_FragColor = vec4(color, alpha);
#else 
    // Effectfangan
    float alpha = sucai.a * intensity;
    color = mix(inputimage.rgb, color, sucai.a);
    color = mix(inputimage.rgb, color, intensity* opacity);
    gl_FragColor = vec4(color, 1.0);
#endif
}
