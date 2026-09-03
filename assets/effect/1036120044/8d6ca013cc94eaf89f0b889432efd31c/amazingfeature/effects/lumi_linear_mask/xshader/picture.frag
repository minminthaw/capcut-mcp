precision highp float;
varying vec2 uv0;
varying vec2 samp;
uniform sampler2D u_albedo;
uniform vec2 u_orient;
uniform float u_diff;
uniform float u_invert;

vec3 addBlend(vec3 base, vec3 blend) {
    return min(base + blend, vec3(1.0));
}

void main()
{
    vec2 unitOrient = normalize(u_orient);
    vec2 unitSamp = normalize(samp);
    float alpha = dot(unitOrient, unitSamp) * length(samp);
    alpha = clamp(smoothstep(-0.000 - u_diff, 0.000 + u_diff, alpha), 0.0, 1.0);
    if (u_invert > 0.0)
    {
        alpha = 1.0 - alpha;
    }

    vec4 color = texture2D(u_albedo, uv0);
    gl_FragColor = vec4(addBlend(color.rgb, vec3(alpha)), 1.0);
}
