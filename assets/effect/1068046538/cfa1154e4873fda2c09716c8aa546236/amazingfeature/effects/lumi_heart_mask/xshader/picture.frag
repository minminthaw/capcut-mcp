precision highp float;
varying vec2 uv0;
uniform sampler2D u_albedo;
uniform sampler2D u_maskTex;

vec3 addBlend(vec3 base, vec3 blend) {
    return min(base + blend, vec3(1.0));
}

void main()
{
    vec4 color = texture2D(u_albedo, uv0);
    vec4 mask = texture2D(u_maskTex, uv0);
    gl_FragColor = vec4(addBlend(color.rgb, mask.rgb), 1.0);
}
