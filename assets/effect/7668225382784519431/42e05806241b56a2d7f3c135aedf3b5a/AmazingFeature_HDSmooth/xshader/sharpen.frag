precision mediump float;
varying highp vec2 textureCoord;

uniform sampler2D inputImageTexture;
uniform sampler2D inputMaskTexture;

uniform sampler2D highPassImageTexture;
uniform sampler2D blurMaskImageTexture;

uniform sampler2D skinTex;
uniform sampler2D oriTex;

// uniform int useMask;
uniform lowp float sharpenAlpha;

void main()
{
    vec4 iColor = texture2D(inputImageTexture, textureCoord).rgba;
    vec3 hColor = texture2D(highPassImageTexture, textureCoord).rgb;
    vec4 maskColor = texture2D(blurMaskImageTexture, textureCoord).rgba;

    // float amount = 2.4;
    // lowp float skinVal = 0.0;                                    //Background
    // if (useMask == 1) {
    //     skinVal = texture2D(inputMaskTexture, textureCoord).g;   //Foreground
    //     // amount = 0.6 * skinVal + amount;
    // }

    // The Green-Channel drawn by "maskPost" is
    // 0 when no face detected
    // faceMask.g when face detected
    
    lowp float skinVal = texture2D(inputMaskTexture, textureCoord).g;
    float amount = 0.6 * skinVal + 2.4;

    // Usm
    vec3 sharpColor = clamp(iColor.rgb + (2.0 * hColor - 1.0) * amount, vec3(0.0), vec3(1.0));
    sharpColor = mix(iColor.rgb, sharpColor, maskColor.rgb);

    // Variance
    mediump float kMin = (1.0 - maskColor.a / (maskColor.a + 0.1));

    // changes with slider
    vec4 res = vec4(mix(iColor.rgb, sharpColor, (1.0-0.5*(kMin-skinVal)*(kMin-skinVal))*sharpenAlpha), iColor.a);

    vec2 uv_ori = textureCoord;
    vec4 ori_col = texture2D(oriTex, uv_ori);
    vec2 uv_skin = textureCoord;
    uv_skin.y = 1.-uv_skin.y;
    vec4 skin_mask = texture2D(skinTex, uv_skin);

    res = mix(ori_col, res, skin_mask.a);

    gl_FragColor = res;

}