precision highp float;
attribute vec3 attPosition;
attribute vec2 attTexcoord0;

uniform mat4 uMVP;

uniform int uIsGlitterPenSkip;
uniform float uPhase;

varying vec2 uv0;
varying vec2 uv1;


float rand() {
  return fract(sin(dot(attTexcoord0, vec2(12.9898, 78.233))) * 43758.5453);
}


void main() {
  vec4 model_postiton = uMVP * vec4(attPosition, 1.0);
  uv0 = attTexcoord0;
  uv1 = (model_postiton.xy / model_postiton.w) * 0.5 + 0.5;
  
  if(uPhase > 1.5) {
    gl_Position = model_postiton;
  }
  else if(uPhase > 0.5) {
    gl_Position = vec4(uv0.x *2.0 - 1.0, (1.0 - uv0.y)*2.0 - 1.0 ,  0.0, 1.0);
  }
  else
  {
    gl_Position = vec4(0.0, 0.0, 0.0, 0.0);
  } 
}
