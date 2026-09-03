precision mediump float;

uniform sampler2D srcImageTex;

varying highp vec2 textureCoord;
varying highp vec2 textureShift_1;
varying highp vec2 textureShift_2;
varying highp vec2 textureShift_3;
varying highp vec2 textureShift_4;

void main()
{
    vec3 iColor = texture2D(srcImageTex, textureCoord).rgb;

    vec3 sum = iColor.rgb;
    sum += texture2D(srcImageTex, textureShift_1).rgb;
    sum += texture2D(srcImageTex, textureShift_2).rgb;
    sum += texture2D(srcImageTex, textureShift_3).rgb;
    sum += texture2D(srcImageTex, textureShift_4).rgb;
    vec3 average = sum * 0.2;

    // co-variance
    highp vec3 varColor = (iColor - average) * 7.07;
    varColor = min(varColor * varColor, 1.0);

    vec3 diff = clamp(iColor - average + 0.5, 0.0, 1.0);
    gl_FragColor = vec4(diff, (varColor.r + varColor.g + varColor.b) * 0.3333);
}