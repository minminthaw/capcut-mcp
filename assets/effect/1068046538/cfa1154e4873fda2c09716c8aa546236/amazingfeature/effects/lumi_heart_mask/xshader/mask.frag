precision highp float;
varying vec2 uv0;
uniform sampler2D u_maskTex;
uniform float u_diff;
uniform float u_invert;
void main()
{
    vec2 col = texture2D(u_maskTex, uv0).rg;
    float alpha = (col.r * 4.0 * 256.0 + col.g * 255.0) / 701.0;
    alpha = clamp(smoothstep(0.49 - u_diff, 0.51 + u_diff, alpha), 0.0, 1.0);
    if (u_invert > 0.0)
    {
        alpha = 1.0 - alpha;
    }
    gl_FragColor = vec4(alpha);
}
