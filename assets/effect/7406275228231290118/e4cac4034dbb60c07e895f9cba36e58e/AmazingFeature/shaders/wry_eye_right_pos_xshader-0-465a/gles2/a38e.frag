precision highp float;
varying vec2 uv0;
uniform sampler2D u_FBOTexture;

varying vec2 maskCoord;
varying vec2 origCoord;
uniform sampler2D maskTexture;

void main(void)
{
    vec4 maskColor = texture2D(maskTexture, maskCoord);
    vec2 coord = mix(origCoord, uv0, maskColor.r);
    coord =  mix(origCoord, coord, step(0.5, maskCoord.x));  
    gl_FragColor = texture2D(u_FBOTexture, coord);
}
