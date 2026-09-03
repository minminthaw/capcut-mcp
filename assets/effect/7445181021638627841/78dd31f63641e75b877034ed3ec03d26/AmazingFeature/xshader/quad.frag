precision highp float;
varying vec2 uv;
varying vec2 uv_screen;
uniform sampler2D ganTexture;
uniform sampler2D inputTexture;
uniform sampler2D u_blurmask;
uniform float u_intensity;

void main() 
{
  // do not remove this `mask * src.a`, otherwise there will be an opaque border in portrait matting
  float mask = texture2D(u_blurmask, uv).r;
  vec4 gan_color = texture2D(ganTexture, uv);
  vec4 input_color = texture2D(inputTexture, uv_screen);
  gl_FragColor = vec4(mix(input_color.rgb, gan_color.rgb, gan_color.a * u_intensity), input_color.a * mask);
}
