
precision highp float;
attribute vec3 attPosition;
attribute vec2 attTexcoord0;
attribute vec3 attPositionOffset;
attribute vec3 attNormal;

uniform mat4 u_Model;
uniform mat4 u_MVP;
uniform mat4 u_TransposeInvModel;

varying vec2 g_vary_uv0;
varying vec4 v_sampling_pos;
varying vec4 v_background_pos;
varying vec3 v_worldPos;
varying vec3 v_Normal;

void main() {
  vec3 modelPostiton = attPosition;
  vec4 homogeneous_modelPostiton = vec4(modelPostiton, 1.0);

  vec4 homogeneous_pos = vec4(attPosition + attPositionOffset, 1.0); // + vec4(0.0, 0.0, 10.0, 0.0); 
  // homogeneous_pos.xyz *= vec3(u_Scale);
  // float cosAngle = cos(u_RotateZ);
  // float sinAngle = sin(u_RotateZ);
  // mat3 rotation = mat3(cosAngle, 0.0, -sinAngle, 0.0, 1.0, 0.0, sinAngle, 0.0, cosAngle);
  // homogeneous_pos.xyz *= rotation;

  g_vary_uv0 = attTexcoord0;

  gl_Position = u_MVP * homogeneous_pos;

  v_worldPos = homogeneous_pos.xyz;
  v_Normal = mat3(u_TransposeInvModel) * attNormal; // * rotation;

  v_sampling_pos = u_MVP * homogeneous_modelPostiton;
  v_background_pos = u_MVP * homogeneous_pos;
}
