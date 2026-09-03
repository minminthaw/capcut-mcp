precision highp float;

attribute vec3 attPosition;
attribute vec2 attUV;

varying vec2 uv;
varying vec4 textureShift_1; 
varying vec4 textureShift_2; 
varying vec4 textureShift_3; 
varying vec4 textureShift_4; 

uniform int inputWidth; 
uniform int inputHeight;
uniform float blurPixelStep;
uniform float inputAspectRatio;

void main() {
	float texelWidthOffset = 1.0/float(inputWidth); 
	float texelHeightOffset = 1.0/float(inputHeight);
    gl_Position = vec4(attPosition,1.0);
    uv = attUV;
	vec2 singleStepOffset = vec2(0.0, texelHeightOffset * blurPixelStep * 1.0/inputAspectRatio); 
	textureShift_1 = vec4(uv.st - singleStepOffset, uv.st + singleStepOffset); 
	textureShift_2 = vec4(uv.st - 2.0 * singleStepOffset, uv.st + 2.0 * singleStepOffset); 
	textureShift_3 = vec4(uv.st - 3.0 * singleStepOffset, uv.st + 3.0 * singleStepOffset); 
	textureShift_4 = vec4(uv.st - 4.0 * singleStepOffset, uv.st + 4.0 * singleStepOffset); 
}
