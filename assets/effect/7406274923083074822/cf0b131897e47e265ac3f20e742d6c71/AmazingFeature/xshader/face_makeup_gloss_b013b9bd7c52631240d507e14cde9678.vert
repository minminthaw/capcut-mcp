
precision highp float;

attribute vec3 attPosition;
attribute vec2 attTexcoord0;
attribute vec3 attPositionOffset;
attribute vec3 attNormal;

uniform mat4 uMVP;
uniform mat4 uModel;

varying vec3 pos0;
varying vec2 uv0;
varying vec2 uv1;
varying vec3 normal0;

#ifdef AE_FACESEG_ENABLE
uniform mat4 uFaceSegMVP;
varying vec2 faceUV;
#define AE_SEG_ENABLE
#endif
#ifdef AE_TEETHSEG_ENABLE
uniform mat4 uTeethSegMVP;
varying vec2 teethUV;
#define AE_SEG_ENABLE
#endif

uniform vec4 u_ScreenParams; // built-in uniform

float GetRatio(vec2 texcoord)
{
   float min_x = 0.421875;
   float max_x = 0.578125;
   float min_y = 0.304688;
   float max_y = 0.578125;

   float r = 0.0;
   if(texcoord.x > min_x && texcoord.x < max_x
   && texcoord.y > min_y && texcoord.y < max_y)
   {
      r = 1.2;
   }

   return r;
}

void main()
{
    vec4 v_sampling_pos = uMVP * vec4(attPosition, 1.0);
    pos0 = (uModel * vec4(attPosition, 1.0)).xyz;
    uv0 = attTexcoord0.xy;
    normal0 = attNormal.xyz;
    uv1 = v_sampling_pos.xy / v_sampling_pos.w * 0.5 + 0.5;

    float offset_ratio = GetRatio(attTexcoord0);
    vec4 homogeneous_pos = vec4(attPosition + attPositionOffset * offset_ratio, 1.0);
    gl_Position = uMVP * homogeneous_pos;

#ifdef AE_SEG_ENABLE
    vec2 screenPosition = vec2(uv1.x, 1.0 - uv1.y);
    screenPosition = screenPosition * u_ScreenParams.xy;
#endif
#ifdef AE_FACESEG_ENABLE
    faceUV = (uFaceSegMVP * vec4(screenPosition.xy, 0.0, 1.0)).xy;
#endif
#ifdef AE_TEETHSEG_ENABLE
    teethUV = (uTeethSegMVP * vec4(screenPosition.xy, 0.0, 1.0)).xy;
#endif
}
