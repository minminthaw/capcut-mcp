precision highp float;

varying vec2 uv0;
varying vec2 uv1;

uniform vec4 u_baseColor;

uniform sampler2D inputTexture;
uniform sampler2D maskTexture;

void main() {
    vec4 src = texture2D(inputTexture, uv0);
    vec4 mask = texture2D(maskTexture, uv1);

    float weight = mask.r;
    if (clamp(uv1, 0.0, 1.0) != uv1)
    {
        weight = 0.0;
    }
    gl_FragColor = vec4(u_baseColor.rgb,weight);
    // visualize mask & Original RGB
    // gl_FragColor = vec4(0.5*u_baseColor.rgb*weight + src.rgb, 1.0);
}
