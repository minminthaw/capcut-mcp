
precision highp float;
uniform sampler2D u_InputTexture;
uniform vec3 u_WorldSpaceCameraPos;

varying vec2 g_vary_uv0;
varying vec4 v_sampling_pos;
varying vec4 v_background_pos;

varying vec3 v_Normal;
varying vec3 v_worldPos;

void main() {
  vec2 sampling_uv = (v_sampling_pos.xy / v_sampling_pos.w) * 0.5 + 0.5;
  vec4 inputColor = texture2D(u_InputTexture, sampling_uv);

  vec2 background_uv = (v_background_pos.xy / v_background_pos.w) * vec2(0.5, -0.5) + 0.5;
  vec3 normal = normalize(v_Normal);
  gl_FragColor = inputColor;
}
