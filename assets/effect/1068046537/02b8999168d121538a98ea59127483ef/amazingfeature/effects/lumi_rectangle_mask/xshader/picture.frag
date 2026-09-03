precision highp float;
varying vec2 uv0;
varying vec2 sampIn;
uniform sampler2D u_albedo;
uniform float u_aspect;
uniform vec2 u_size;
uniform vec2 u_rightTop;
uniform vec2 u_circleCenter;
uniform float u_circleRadius;
uniform float u_diff;
uniform float u_invert;
varying float decay;

vec3 addBlend(vec3 base, vec3 blend) {
    return min(base + blend, vec3(1.0));
}

void main()
{
    vec2 samp = abs(sampIn);
    float alpha = 0.0;
    if (samp.y * u_circleCenter.x >= u_rightTop.y * samp.x)
    {
        alpha = samp.y / u_size.y;
    }
    else if (samp.y * u_rightTop.x <= u_circleCenter.y * samp.x)
    {
        alpha = samp.x / (u_aspect * u_size.x);
    }
    else
    {
        float a = dot(u_circleCenter, u_circleCenter) - u_circleRadius * u_circleRadius;
        float b = -2.0 * dot(samp, u_circleCenter);
        float c = dot(samp, samp);
        if (abs(a) < 0.00000001)
        {
            if (abs(b) < 0.00000001)
            {
                alpha = 100.0;
            }
            else
            {
                alpha = -c / b;
            }
        }
        else
        {
            alpha = (-b - sqrt(b * b - 4.0 * a * c)) / (2.0 * a);
        }
    }
    alpha = clamp(smoothstep((1.0 - decay * 0.005) - u_diff, (1.0 + decay * 0.005) + u_diff, alpha), 0.0, 1.0);
    if (u_invert < 1.0)
    {
        alpha = 1.0 - alpha;
    }
    vec4 color = texture2D(u_albedo, uv0);
    gl_FragColor = vec4(addBlend(color.rgb, vec3(alpha)), 1.0);
}
