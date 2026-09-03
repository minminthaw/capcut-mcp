precision highp float;

varying vec2 uv;
varying vec4 textureShift_1; 
varying vec4 textureShift_2; 
varying vec4 textureShift_3; 
varying vec4 textureShift_4; 
uniform sampler2D inputImageTexture;
uniform float centerGaussianWeight;
uniform vec4 neighbourGaussianWeight;

void main() 
{
    mediump vec3 sum = texture2D(inputImageTexture, uv).rgb * centerGaussianWeight; 
    sum += texture2D(inputImageTexture, textureShift_1.xy).rgb * neighbourGaussianWeight.x; 
    sum += texture2D(inputImageTexture, textureShift_1.zw).rgb * neighbourGaussianWeight.x; 
    sum += texture2D(inputImageTexture, textureShift_2.xy).rgb * neighbourGaussianWeight.y; 
    sum += texture2D(inputImageTexture, textureShift_2.zw).rgb * neighbourGaussianWeight.y; 
    sum += texture2D(inputImageTexture, textureShift_3.xy).rgb * neighbourGaussianWeight.z; 
    sum += texture2D(inputImageTexture, textureShift_3.zw).rgb * neighbourGaussianWeight.z; 
    sum += texture2D(inputImageTexture, textureShift_4.xy).rgb * neighbourGaussianWeight.w; 
    sum += texture2D(inputImageTexture, textureShift_4.zw).rgb * neighbourGaussianWeight.w; 
    gl_FragColor = vec4(sum, 1.0); 
}

