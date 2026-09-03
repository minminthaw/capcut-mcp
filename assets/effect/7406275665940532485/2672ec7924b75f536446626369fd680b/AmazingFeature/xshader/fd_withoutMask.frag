precision highp float;
varying vec2 uv0;
uniform sampler2D u_FBOTexture;

void main(void)
{
    gl_FragColor = texture2D(u_FBOTexture, uv0);
}
