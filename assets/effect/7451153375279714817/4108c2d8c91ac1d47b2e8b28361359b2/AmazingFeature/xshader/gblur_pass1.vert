attribute vec3 attPosition;
attribute vec2 attUV;

uniform vec2 u_texelStep;
uniform float u_radius;

varying vec2 uv;
varying vec4 textureShift_1;
varying vec4 textureShift_2;
varying vec4 textureShift_3;
varying vec4 textureShift_4;
varying vec4 textureShift_5;

void main()
{
    gl_Position = vec4(attPosition, 1.0);
    uv = attUV;
    
    vec2 singleStepOffset = vec2(u_texelStep.x * u_radius, u_texelStep.y * u_radius);

	textureShift_1 = vec4(uv.xy - singleStepOffset, uv.xy + singleStepOffset);
	textureShift_2 = vec4(uv.xy - 2.0 * singleStepOffset, uv.xy + 2.0 * singleStepOffset);
	textureShift_3 = vec4(uv.xy - 3.0 * singleStepOffset, uv.xy + 3.0 * singleStepOffset);
	textureShift_4 = vec4(uv.xy - 4.0 * singleStepOffset, uv.xy + 4.0 * singleStepOffset);
	textureShift_5 = vec4(uv.xy - 5.0 * singleStepOffset, uv.xy + 5.0 * singleStepOffset);
}
