precision lowp float;
varying highp vec2 uv0;
uniform sampler2D u_inputTexture;
void main()
{
    vec2 uvmask = step(vec2(0.0, 0.0), uv0) - step(vec2(1.0, 1.0), uv0);
    float inside_picture = uvmask.x * uvmask.y;
    vec4 bg_color = vec4(0.0, 0.0, 0.0, 0.0);
    vec4 texture2D_color = texture2D(u_inputTexture, uv0);
    gl_FragColor = mix(bg_color, texture2D_color, inside_picture);
}
