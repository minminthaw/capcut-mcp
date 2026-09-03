precision mediump float;

uniform sampler2D u_inputTex;
uniform sampler2D u_blurTex;

varying vec2 uv0;

vec3 substract(vec3 base, vec3 blend, float scale, float bias)
{
    return 1.0 / scale * (base - blend) + vec3(bias);
}

void main()
{
    vec4 inColor = texture2D(u_inputTex, uv0);
    vec4 blurColor = texture2D(u_blurTex, uv0);

    vec4 diffColor = (inColor - blurColor) * 7.07;
    diffColor = min(diffColor * diffColor, 1.0);

    gl_FragColor = vec4(clamp(0.5 * (inColor.rgb - blurColor.rgb) + vec3(0.5), 0.0, 1.0), (diffColor.r + diffColor.g + diffColor.b) * 0.3333);
}