precision highp float;
varying vec2 uv;
varying vec2 uv_screen;
uniform sampler2D ganTexture;
uniform sampler2D flowTexture;
uniform sampler2D inputTexture;
uniform sampler2D u_blurmask;
uniform float u_intensity;
uniform mat4 mvpMat;

void main() {
  float mask = texture2D(u_blurmask, uv).r;
  vec4 flow = texture2D(flowTexture, uv);
  flow = (flow - 0.5) * 0.25 * mask * u_intensity;
  vec2 uv_f = uv + flow.xy;
  vec2 uv_sf = uv_screen + (mvpMat * vec4(flow.x, -flow.y, 0.0, 0.0)).xy;
  vec4 gan_color = texture2D(ganTexture, uv_f);
  //gan_color.a *= mask;
  vec4 input_color = texture2D(inputTexture, uv_sf);
  input_color.rgb /= input_color.a;
  gl_FragColor = vec4(mix(input_color.rgb, gan_color.rgb, gan_color.a * u_intensity), input_color.a * mask);

}
