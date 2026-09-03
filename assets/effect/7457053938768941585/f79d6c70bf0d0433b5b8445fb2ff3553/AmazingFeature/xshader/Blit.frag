precision mediump float;
uniform sampler2D u_inputTex;
uniform sampler2D u_facialMaskTex;
varying vec2 uv0;

void main()
{
    vec4 oriColor = texture2D(u_inputTex, uv0);
    vec4 facialMask = texture2D(u_facialMaskTex, uv0);

    gl_FragColor = vec4(oriColor.rgb, facialMask.r);
}