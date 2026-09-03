precision highp float;
varying highp vec2 uv0;
uniform sampler2D u_albedo;
uniform sampler2D u_GrayLine;
uniform sampler2D u_mattingTexture;
uniform float u_Intensity;
uniform float u_Threshold1;
uniform float u_Range;
uniform float u_nowStrength;
uniform float u_Threshold2;
uniform float u_Strength;
uniform vec2 ext;
uniform vec2 u_ofs0;
uniform vec2 u_ofs1;
uniform vec2 u_ofs2;
uniform vec2 u_ofs3;
uniform vec2 u_ofs4;
uniform vec2 u_ofs5;
uniform vec2 u_ofs6;
uniform vec2 u_ofs7;
uniform vec2 u_ofs8;
uniform vec2 u_ofs9;
const vec3 grayFactor = vec3(0.33333333);
float getGrayColor(vec2 uv, vec2 offset)
{
    vec3 color = texture2D(u_albedo, uv + offset).rgb;
    return dot(color, grayFactor);
}

float uvProtect(vec2 uv)
{
    return step(0.0, uv.x) * step(0.0, uv.y) * step(uv.x, 1.0) * step(uv.y, 1.0);
}
float grayFilter(vec2 uv, vec2 offset, float threshold, float strength)
{
    float grayColor = getGrayColor(uv, offset);
    float ret = clamp((grayColor - threshold) * strength, 0.0, 1.0);
    return ret ;
}
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main()
{
    vec4 ori = texture2D(u_albedo, uv0);
    float c = dot(ori.rgb, grayFactor);
    c = clamp((c - u_Threshold2 + u_Range * u_nowStrength ) * u_Strength, 0.0, 1.0);
    float highlight = c;
    highlight *= 1. - grayFilter(uv0, vec2(u_ofs0), u_Threshold2, u_Strength);
    highlight *= 1. - grayFilter(uv0, vec2(u_ofs1), u_Threshold2, u_Strength);
    highlight *= 1. - grayFilter(uv0, vec2(u_ofs2), u_Threshold2, u_Strength);
    highlight *= 1. - grayFilter(uv0, vec2(u_ofs3), u_Threshold2, u_Strength);
    highlight *= 1. - grayFilter(uv0, vec2(u_ofs4), u_Threshold2, u_Strength);
    highlight *= 1. - grayFilter(uv0, vec2(u_ofs5), u_Threshold2, u_Strength);
    highlight *= 1. - grayFilter(uv0, vec2(u_ofs6), u_Threshold2, u_Strength);
    highlight *= 1. - grayFilter(uv0, vec2(u_ofs7), u_Threshold2, u_Strength);   
    highlight *= 1. - grayFilter(uv0, vec2(u_ofs8), u_Threshold2, u_Strength);
    highlight *= 1. - grayFilter(uv0, vec2(u_ofs9), u_Threshold2, u_Strength);
    gl_FragColor = vec4(highlight)*(1.-texture2D(u_mattingTexture,vec2(uv0.x,1.-uv0.y)).r);
    // gl_FragColor = vec4(1,0,0,1);
}
