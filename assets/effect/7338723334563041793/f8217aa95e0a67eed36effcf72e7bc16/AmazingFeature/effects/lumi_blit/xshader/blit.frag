precision lowp float;
varying highp vec2 uv0;
uniform sampler2D u_InputTexture;

void main()
{
    gl_FragColor = texture2D(u_InputTexture, uv0);
}
