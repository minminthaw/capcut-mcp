precision highp float;
varying vec2 uv0;
varying vec2 samp;
uniform sampler2D u_albedo;
uniform float u_aspect;
uniform vec2 u_size;
uniform float u_diff;
uniform float u_invert;

vec3 addBlend(vec3 base, vec3 blend) {
    return min(base + blend, vec3(1.0));
}

void main()
{
    const float mMin = 1.0;
    const float mMax = 11.0;
    float m = u_size.x/u_size.y;
    float factor = u_size.x>u_size.y?(m):(1.0/m);
    factor = clamp(factor, mMin, mMax);
    factor = (factor-mMin)/(mMax-mMin);
    factor = factor*factor*0.05;
    float a = u_size.x * u_aspect;
    float b = u_size.y;
    float alpha = samp.x * samp.x / (a * a) + samp.y * samp.y / (b * b);
    // alpha = sqrt(alpha);
    alpha = clamp(smoothstep(1.00 - u_diff-factor, 1.00 + u_diff+factor, alpha), 0.0, 1.0);// [0.995,1.005]
    if (u_invert < 1.0)
    {
        alpha = 1.0 - alpha;
    }
    
    vec4 color = texture2D(u_albedo, uv0);
    gl_FragColor = vec4(addBlend(color.rgb, vec3(alpha)), 1.0);
}
