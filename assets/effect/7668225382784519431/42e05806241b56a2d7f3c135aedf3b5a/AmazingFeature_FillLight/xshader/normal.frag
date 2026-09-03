precision highp float;

varying vec2 textureCoordinate;
uniform sampler2D inputImageTexture;

void main() {
    gl_FragColor = texture2D(inputImageTexture, vec2(textureCoordinate.x, 1.0 - textureCoordinate.y));
}