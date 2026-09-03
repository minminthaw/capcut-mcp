precision mediump float;
varying vec2 texCoord;

uniform sampler2D facialMaskTexture;

void main(void)
{
    vec4 mask = texture2D(facialMaskTexture, texCoord);
    gl_FragColor = vec4(mask.rgb, 1.0);
}
 