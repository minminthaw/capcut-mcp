precision highp float;
uniform sampler2D inputTexture;
uniform int inputWidth;
uniform int inputHeight;
varying highp vec2 uv0;
void main()
{
    float dx = 1.0 / float(inputWidth);
    float dy = 1.0 / float(inputHeight);
    vec3 color = texture2D(inputTexture, uv0).rgb;
    vec2 tempTexCoord = uv0 + vec2(0.0, dy);
    color += texture2D(inputTexture, tempTexCoord).rgb;
    tempTexCoord = uv0 + vec2(dx, 0.0);
    color += texture2D(inputTexture, tempTexCoord).rgb;
    tempTexCoord = uv0 + vec2(dx, dy);
    color += texture2D(inputTexture, tempTexCoord).rgb;
    color = 0.25 * color;
    gl_FragColor = vec4(color, 1.);
}