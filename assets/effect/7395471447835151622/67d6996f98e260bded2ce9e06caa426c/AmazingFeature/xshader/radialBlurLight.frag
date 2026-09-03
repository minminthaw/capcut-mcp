precision highp float;
varying highp vec2 uv0;
uniform sampler2D u_LastRT;
uniform sampler2D u_albedo;
uniform vec2 u_CenterPoint;
uniform vec2 u_Range;
uniform float u_Radius;
uniform int u_Sample;
uniform vec4 u_ScreenParams;
uniform float u_Delay;
uniform float u_Strength;
uniform float u_nowStrength;
uniform vec4 u_Time;
varying highp vec2 uv1;
varying highp vec2 m;
varying highp vec2 n;
uniform float u_RS;
uniform float u_GS;
uniform float u_BS;
uniform float u_Partical;
uniform float u_S1;
uniform float u_S23;
uniform float u_tt;
uniform vec3 u_ColorS;
uniform vec3 u_ColorChange;
uniform float angle;
uniform float u_Lines;
const float PI = 3.1415926;


mat2 rotate(float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main() {
  // zhe kuai bu yong dong, shi pei yong//
  vec2 uv = uv0;
  vec2 x = vec2(0.0);
  vec2 y = vec2(0.0);
  x = (m + n) / (2.0 * (uv1));
  y = (m - n) / (2.0 * (1. - uv1));
  float width = x.x - y.x;
  float height = x.y - y.y;
  uv.x -= (x.x + y.x) * 0.5;
  uv.y += (x.y + y.y) * 0.5;
  uv.x /= (width * 0.5);
  uv.y /= (height * 0.5);
  uv = uv0 * 0.5 + 0.5;
  //----------------------------//

  float lm = floor(uv.y * u_Lines) + 1.0;
  float l1 = 1. / u_Lines * lm;
  float l2 = 1. / u_Lines * (lm - 1.);
  lm = (1.0 + 1.0) * 0.5 - 0.5;
  vec2 dir = (uv - u_CenterPoint);
  vec2 nd = normalize((dir));
  float kk = length(uv - u_CenterPoint);
  float strength = u_nowStrength * u_Strength;
  dir = dir / 720.0 * (strength)*2.0;
  float s = (1.0 + abs(strength) * kk);
  vec2 d = dir / floor(s);
  // vec2 dir = vec2(min(uv.x - u_CenterPoint.x - u_Range.x, max(0.0, uv.x -
  // u_CenterPoint.x - u_Range.y)), uv.y - (u_CenterPoint.y + 0.0)); vec2 dir1 =
  // vec2(min(uv.x - u_CenterPoint.x - u_Range.x, max(0.0, uv.x -
  // u_CenterPoint.x - u_Range.y)), uv.y - (u_CenterPoint.y + 0.0 - 1. / 1.0));
  vec2 reScreenSize = 1. / vec2(720.0);
  // float radius = pow(dot(dir, dir), u_Radius);
  // dir = normalize(dir);
  // dir1 = normalize(dir1);

  vec4 retColor = texture2D(u_albedo, uv);
  vec4 r = vec4(0.0);
  float weight = 1.0;
  float sumWeight = 0.0;
  float alpha = 0.0;

  float l = 1. - u_Partical;
  for (int i = 1; i < int(s); ++i) {

    vec2 v = uv - d * float(i);
    vec4 x = texture2D(u_albedo, v);
    x.r *= clamp(1. - (pow(float(i + 1) / float(s), u_ColorChange.x * l) * 1.0), 0.0, 1.0);
    x.g *= clamp(1. - (pow(float(i + 1) / float(s), u_ColorChange.y * l) * 1.0), 0.0, 1.0);
    x.b *= clamp(1. - (pow(float(i + 1) / float(s), u_ColorChange.z * l) * 1.0), 0.0, 1.0);
    x.a = max(max(x.r, x.g), x.b);
    // x.g *= clamp(1.0 - (pow(float(i + 1) / float(u_Sample), 3.0) * 0.6),
    // 0.0, 1.0);

    alpha += weight * x.a;
    r = max(r, x);
    sumWeight += weight;
    weight *= u_Delay;
  }
//   alpha = alpha / sumWeight;
  vec4 a = r;
  // for (int i = u_Sample - 12; i < u_Sample + 8; ++i)
  // {
  //     r += texture2D(u_albedo, uv - Step * float(i) * (hash22(uv) * 0.1 +
  //     0.9)) * weight; sumWeight += weight; weight *= u_Delay;
  // }
  // a /= 14.0;
  vec4 ret = a;
  // ret.b += r.b * 0.9137254902;
  // ret.g += r.g * 0.3;
  // ret.r += r.r * 0.08;
  ret *=
      smoothstep(u_Partical - 0.3, u_Partical - 0.1, 1. - (dir.x * 0.5 + 0.5));
  // ret *= smoothstep(u_Partical - 0.01, u_Partical + 0.01, hash21(floor(dir
  // * 24.0)) * 0.5 + 0.5) * n1 + u_S23; ret *= n1;
  ret = clamp(ret, 0.0, 1.0);
  retColor += ret;
  // retColor.a = 1.0;
  // float mask = texture2D(u_albedo, uv).a - texture2D(u_albedo, uv -
  // vec2(0.002, -0.003)).a;
  gl_FragColor = (clamp(ret * u_nowStrength * 10., 0.0, 1.0));
  // gl_FragColor.r = 0.0;
  // gl_FragColor = clamp(fract(Step), 0.0, 1.0);

  // gl_FragColor = vec4(texture2D(u_albedo, fract(uv)));
  // gl_FragColor = vec4(ret);
  gl_FragColor.a = alpha;
  // gl_FragColor = vec4(smoothstep(u_Partical - 0.23, u_Partical - 0.2, 1. -
  // (dir.x * 0.5 + 0.5)), 0.0, 0.0, 1.0);
}
