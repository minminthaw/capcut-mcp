precision mediump float;
varying highp vec2 textureCoord;

uniform sampler2D preImageTex;
uniform sampler2D inputMaskTexture;
// uniform int useMask;

void main()
{
    vec4 diff = texture2D(preImageTex, textureCoord).rgba;

    // float scale = 3.0;
    // highp float thresh = 0.0157;
    // if (useMask == 1) {
    //     lowp float skinVal = texture2D(inputMaskTexture, textureCoord).g;
    //     scale = 1.1 * skinVal + scale;
    //     thresh = -0.00785 * skinVal + thresh;
    // }

    // The Green-Channel drawn by "maskPost" is
    // 0 when no face detected
    // faceMask.g when face detected

    lowp float skinVal = texture2D(inputMaskTexture, textureCoord).g;
    float scale = 1.1 * skinVal + 3.0;
    highp float thresh = -0.00785 * skinVal + 0.0157;

    
    vec3 tmp = scale * abs(diff.rgb-0.5);
    tmp = clamp(tmp, vec3(0.0), vec3(1.0));

    vec3 res = step(vec3(thresh), tmp);

    gl_FragColor = vec4(vec3(res), diff.a);     //rgb: highColor, a: variace
}