precision mediump float;
varying highp vec2 textureCoord;

varying highp vec2 textureShift_1;
varying highp vec2 textureShift_2;
varying highp vec2 textureShift_3;
varying highp vec2 textureShift_4;

uniform sampler2D preImageTex;
void main()
{
    vec4 iColor = texture2D(preImageTex, textureCoord).rgba;

    vec4 sum = iColor.rgba;
    sum += texture2D(preImageTex, textureShift_1).rgba;
    sum += texture2D(preImageTex, textureShift_2).rgba;
    sum += texture2D(preImageTex, textureShift_3).rgba;
    sum += texture2D(preImageTex, textureShift_4).rgba;
    vec4 average = sum * 0.2;

    gl_FragColor = vec4(average);
}