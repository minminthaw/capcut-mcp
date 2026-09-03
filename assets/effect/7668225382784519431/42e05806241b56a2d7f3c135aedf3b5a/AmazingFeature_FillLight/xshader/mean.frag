precision highp float;

uniform sampler2D inputImageTexture;
uniform float texelWidthOffset;
uniform float texelHeightOffset;
uniform float radius;

varying vec2 textureCoordinate;


vec4 blur(vec2 pos, vec2 offset, int r) 
{
    float w = 1.0;
    vec4 color = texture2D(inputImageTexture, pos);

    for(int i = 1; i < r + 1; i++) {
        float w1 = 1.0;
        float w2 = 1.0;
        color = color + texture2D(inputImageTexture, pos + float(i) * offset) * w1;
        color = color + texture2D(inputImageTexture, pos - float(i) * offset) * w2;
        w = w + w1 + w2;
    }
    color = color / (w + 1e-5);
    return color;
}

void main() {
    vec4 color = blur(textureCoordinate, vec2(texelWidthOffset, texelHeightOffset), int(radius + 0.5));
    gl_FragColor = color;
}
