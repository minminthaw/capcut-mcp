precision highp float;
uniform vec4 u_ScreenParams;
uniform sampler2D inputTexture;
uniform sampler2D blurTexture1;
uniform sampler2D blurTexture2;
uniform sampler2D bgTexture;
uniform vec3 GlowColor;
uniform float brightness;
uniform int combine;
uniform float glowUnderSource;
uniform float sourceOpacity;
uniform int hasBgTex;
uniform float lightBackground;
uniform float bgBrightness;
uniform vec2 bgTextureSize;
varying highp vec2 uv0;

#define BlendOverlayf(base, blend)      (base < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend))) 
#define BlendOverlay(base, blend)       vec3(BlendOverlayf(base.r, blend.r), BlendOverlayf(base.g, blend.g), BlendOverlayf(base.b, blend.b))
#define BlendScreen(base, blend)        (1.0 - (1.0 - base) * (1.0 - blend))
#define BlendMultiply(base, blend)      (base * blend)
#define BlendDifference(base, blend)    (abs(blend - base))
#define BlendAdd(base, blend)           (blend + base)

float cut(vec2 u) { return step(0., u.x) * step(u.x, 1.) * step(0., u.y) * step(u.y, 1.); }

vec2 vec4ToVec2(vec4 val)
{
    float a = val.x + val.y / 255.0;
    float b = val.z + val.w / 255.0;
    return vec2(a, b);
}

vec4 vec2ToVec4(vec2 val)
{
    float a = floor(val.x * 255.0) / 255.0;
    float b = fract(val.x * 255.0);
    float c = floor(val.y * 255.0) / 255.0;
    float d = fract(val.y * 255.0);
    return vec4(a, b, c, d);
}

void main()
{
    vec4 inputColor = texture2D(inputTexture, uv0);
    // gl_FragColor = inputColor; return;

    vec4 bgColor = vec4(0.0, 0.0, 0.0, inputColor.a);
    if (hasBgTex > 0)
    {
        vec2 uv = uv0;
        uv.y = 1.0 - uv.y;
        uv -= 0.5;
        uv.x *= u_ScreenParams.x / bgTextureSize.x;
        uv.y *= u_ScreenParams.y / bgTextureSize.y;
        uv += 0.5;
        bgColor = texture2D(bgTexture, uv) * cut(uv);
    }
    bgColor = mix(bgColor, inputColor, sourceOpacity);
    bgColor *= bgBrightness;
    // gl_FragColor = bgColor; return;

    vec4 blurColor = vec4(vec4ToVec2(texture2D(blurTexture1, uv0)),vec4ToVec2(texture2D(blurTexture2, uv0)));
    // gl_FragColor = blurColor; return;
    blurColor.rgb *= GlowColor;
    blurColor.rgba *= brightness;
    // gl_FragColor = blurColor; return;

    vec4 fgBlurColor = blurColor;
    fgBlurColor = mix(fgBlurColor, mix(fgBlurColor, inputColor, sourceOpacity), glowUnderSource);
    fgBlurColor *= (1.0 - lightBackground);

    bgColor = clamp(bgColor, 0.0, 1.0);
    // fgBlurColor = clamp(fgBlurColor, 0.0, 1.0);

    float alpha = blurColor.a + (1.0 - blurColor.a) * inputColor.a;
    vec4 resultColor = inputColor;
    if (combine == 1)      resultColor.rgb = BlendAdd(bgColor.rgb, fgBlurColor.rgb);
    else if (combine == 2) resultColor.rgb = BlendMultiply(bgColor.rgb, fgBlurColor.rgb);
    else if (combine == 3) resultColor.rgb = BlendDifference(bgColor.rgb, fgBlurColor.rgb);
    else if (combine == 4) resultColor.rgb = BlendOverlay(bgColor.rgb, fgBlurColor.rgb);
    else                   resultColor.rgb = BlendScreen(bgColor.rgb, fgBlurColor.rgb);
    resultColor.a = alpha;

    gl_FragColor = resultColor;
}
