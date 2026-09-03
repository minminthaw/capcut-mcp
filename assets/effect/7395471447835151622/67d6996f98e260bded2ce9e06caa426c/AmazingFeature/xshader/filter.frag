precision highp float;

uniform sampler2D u_src;
uniform sampler2D u_lut;
uniform float u_intensity;

varying vec2 v_uv;

vec3 unpremultiply (vec3 color, float alpha) {
    return color / (alpha + 0.0001);
}

vec3 lut8x8 (sampler2D lut, vec3 src) {
    src *= 63.0;
    float b = src.b;

    vec2 i01 = vec2(floor(b), ceil(b));
    vec2 r01 = floor(i01 * 0.125);
    vec2 c01 = i01 - r01 * 8.0;

    vec4 uv0 = vec4(c01, r01).xzyw * 0.125;
    vec2 uv1 = (src.rg + 0.5) * 0.001953125;
    uv0 += vec4(uv1, uv1);

    vec3 c0 = texture2D(lut, uv0.xy).rgb;
    vec3 c1 = texture2D(lut, uv0.zw).rgb;
    return mix(c0, c1, b - i01.x);
}

vec4 mapping (vec4 color, sampler2D lut, float intensity) {
    vec3 dst = unpremultiply(color.rgb, color.a);
    vec3 src = lut8x8(lut, dst);
    dst = mix(dst, src, intensity);
    return vec4(dst, 1.0) * color.a;
}

void main () {
    vec4 base = texture2D(u_src, v_uv);
    base = mapping(base, u_lut, u_intensity);
    gl_FragColor = base;
}