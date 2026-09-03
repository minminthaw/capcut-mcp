precision highp float;
varying vec3 pos0;
varying vec2 uv0;
varying vec2 uv1;
varying vec3 normal0;

uniform vec4 uLightPos;
uniform vec4 uLightColor; // color strength

uniform float uRoughness;
uniform float uMetallic;
uniform mat4 u_Model;

uniform sampler2D u_basic;
uniform sampler2D u_albedo;

uniform float intensity;

uniform vec3 extra_col;

uniform float power;

const float PI = 3.141592653;
const vec3 uViewPos = vec3(0.0, 0.0, 2.0);

float Square(float x) { return x * x; }

vec3 Square(vec3 v) { return vec3(v.x * v.x, v.y * v.y, v.z * v.z); }

float rcp(float x) { return 1.0 / x; }

float saturate(float x) { return clamp(x, 0.0, 1.0); }

// GGX / Trowbridge-Reitz
float D_GGX(float roughness, float NoH) {
  float a = roughness * roughness;
  float a2 = a * a;
  float d = (NoH * a2 - NoH) * NoH + 1.0;
  return a2 / (PI * d * d);
}

// Smith term for GGX
float Vis_Smith(float roughness, float NoV, float NoL) {
  float a = Square(roughness);
  float a2 = a * a;

  float Vis_SmithV = NoV + sqrt(NoV * (NoV - NoV * a2) + a2);
  float Vis_SmithL = NoL + sqrt(NoL * (NoL - NoL * a2) + a2);
  return rcp(Vis_SmithV * Vis_SmithL);
}

vec3 F_Fresnel(vec3 SpecularColor, float VoH) {
  vec3 SpecularColorSqrt =
      sqrt(clamp(vec3(0, 0, 0), vec3(0.99, 0.99, 0.99), SpecularColor));
  vec3 n = (1.0 + SpecularColorSqrt) / (1.0 - SpecularColorSqrt);
  vec3 g = sqrt(n * n + VoH * VoH - 1.0);
  return 0.5 * Square((g - VoH) / (g + VoH)) *
         (1.0 + Square(((g + VoH) * VoH - 1.0) / ((g - VoH) * VoH + 1.0)));
}

vec3 CalBRDF(vec3 light, vec3 view, vec3 normal, float roughness,
             vec3 SpecularColor) {
  vec3 h = normalize(view + light);
  float VoH = dot(view, h);
  float NoV = dot(normal, view);
  float NoL = dot(normal, light);
  float NoH = dot(normal, h);

  float D = D_GGX(roughness, NoH);
  vec3 F = F_Fresnel(SpecularColor, VoH);
  float V = Vis_Smith(roughness, NoV, NoL);
  return F * V * D;
}

vec3 BlendScreenf(vec3 base, vec3 blend) {
  return (1.0 - ((1.0 - (base)) * (1.0 - (blend))));
}

vec3 RGBtoHCV(vec3 rgb) {
  vec4 p = (rgb.g < rgb.b) ? vec4(rgb.bg, -1.0, 2.0 / 3.0)
                           : vec4(rgb.gb, 0.0, -1.0 / 3.0);
  vec4 q = (rgb.r < p.x) ? vec4(p.xyw, rgb.r) : vec4(rgb.r, p.yzx);

  float c = q.x - min(q.w, q.y);
  float h = abs((q.w - q.y) / (6.0 * c + 1e-7) + q.z);
  float v = q.x;

  return vec3(h, c, v);
}

vec3 RGBToHSL(vec3 rgb) {
  vec3 hcv = RGBtoHCV(rgb);

  float lum = hcv.z - hcv.y * 0.5;
  float sat = hcv.y / (1.0 - abs(2.0 * lum - 1.0) + 1e-7);

  return vec3(hcv.x, sat, lum);
}

vec3 HUEtoRGB(float hue) {
  float r = abs(6.0 * hue - 3.0) - 1.0;
  float g = 2.0 - abs(6.0 * hue - 2.0);
  float b = 2.0 - abs(6.0 * hue - 4.0);
  return clamp(vec3(r, g, b), 0.0, 1.0);
}

vec3 HSLToRGB(vec3 hsl) {
  vec3 rgb = HUEtoRGB(hsl.x);
  float c = (1.0 - abs(2.0 * hsl.z - 1.0)) * hsl.y;
  rgb = (rgb - 0.5) * c + hsl.z;
  return rgb;
}

// jianruoanguangxiadexiaoguo
vec3 darkOpt(vec3 src, vec3 dst, float xth, float ymin) {
  vec3 shsl = RGBToHSL(src.rgb);
  vec3 dhsl = RGBToHSL(dst.rgb);
  float w = ymin + (1.0 - ymin) * smoothstep(0.0, xth, shsl.b);

  float L = shsl.b * (1.0 - w) + dhsl.b * w;
  vec3 dst2 = HSLToRGB(vec3(dhsl.r, dhsl.g, L));
  return dst2;
}

void main() {
    vec4 orignColor = texture2D(u_basic, uv1);

    if (normal0.x == 0.0 && normal0.y == 0.0 && normal0.z == 0.0) {
        gl_FragColor = orignColor;
    } 
    else 
    {
        vec3 normal = normalize(mat3(u_Model) * normal0);
        vec3 viewDir = -normalize(uViewPos - pos0);
        viewDir = normalize(normal);

        vec3 color = vec3(0.0);

        vec3 DiffuseColor = orignColor.rgb * uLightColor.rgb;
        vec3 SpecularColor = mix(orignColor.rgb, DiffuseColor.rgb, uMetallic);
        vec3 light = normalize(uLightPos.rgb - pos0.rgb);

        vec3 brdf = CalBRDF(light, viewDir, normal, uRoughness, SpecularColor) *
                    uLightColor.a * clamp(dot(light, normal), 0.0, 1.0);
        color += brdf * power;

        float mask = texture2D(u_albedo, uv0).r;
        vec3 res = BlendScreenf(orignColor.rgb, color.rgb);
        // res.rgb *= extra_col;
        res = mix(orignColor.rgb, res.rgb, mask * intensity * 5.0);
        res = darkOpt(orignColor.rgb, res, 0.65, 0.4);

        gl_FragColor = vec4(res, orignColor.a);
    }
}