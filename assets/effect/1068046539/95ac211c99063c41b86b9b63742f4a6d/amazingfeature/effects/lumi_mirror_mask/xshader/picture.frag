precision highp float;
varying vec2 uv0;
varying vec2 samp;
uniform sampler2D u_albedo;
uniform vec2 u_orient;
uniform float u_scale;
uniform float u_diff;
uniform float u_invert;
uniform float u_rotate;

vec3 addBlend(vec3 base, vec3 blend) {
    return min(base + blend, vec3(1.0));
}

void main()
{
    vec2 unitOrient = normalize(u_orient);
    vec2 unitSamp = normalize(samp);
    float alpha = abs(dot(unitOrient, unitSamp)) * length(samp);
    if (u_scale <= 0.0) 
    {
        alpha = 1.0;
    }
    else 
    {
        float decay = sqrt(1.0 - pow((mod(u_rotate, 3.1415926/2.0) / (3.1415926/4.0) - 1.0), 2.0));
        decay = sqrt(sqrt(decay));
        alpha = clamp(smoothstep(u_scale - 0.005 * decay - u_diff, u_scale + 0.005 * decay + u_diff, alpha), 0.0, 1.0);
    }
    if (u_invert < 1.0)
    {
        alpha = 1.0 - alpha;
    }

    vec4 color = texture2D(u_albedo, uv0);
    gl_FragColor = vec4(addBlend(color.rgb, vec3(alpha)), 1.0);
}
