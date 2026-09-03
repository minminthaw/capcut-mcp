precision highp float;
varying vec2 uv;
uniform sampler2D u_inputTex;

void main()
{
    vec4 curColor = texture2D(u_inputTex, uv);
    gl_FragColor = curColor;
}
