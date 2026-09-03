precision highp float;
uniform sampler2D inputImageTexture;
uniform highp float texelWidthOffset;
uniform highp float texelHeightOffset;

varying highp vec2 blurCoordinates[15];

void main()
{
    float gc[8];
    gc[0] = 0.067540;
    gc[1] = 0.130499;
    gc[2] = 0.113686;
    gc[3] = 0.088692;
    gc[4] = 0.061965;
    gc[5] = 0.038768;
    gc[6] = 0.021721;
    gc[7] = 0.010898;

    vec4 color = texture2D(inputImageTexture, blurCoordinates[0]);
    for (int i = 1; i < 15; ++i) {
        color = color + texture2D(inputImageTexture, blurCoordinates[i]);
    }

    gl_FragColor = color / 15.0;
}
