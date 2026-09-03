precision highp float;
varying highp vec2 uv0;
uniform sampler2D _MainTex;
uniform float _inputWidth;
uniform float _inputHeight;

float sinc(float x) {
    if (x == 0.0) return 1.0; 
    return sin(3.14159265359 * x) / (3.14159265359 * x);
}
float lanczosWeight(float x, float a) {
    if (x < -a || x > a) return 0.0; 
    return sinc(x) * sinc(x / a);
}

vec4 lanczosInterpolate2(sampler2D tex, vec2 uv, vec2 texSize, float a) {
    vec2 texelSize = 1.0 / texSize; 

    vec2 pixelCoord = uv * texSize;

    vec2 baseCoord = floor(pixelCoord); 
    vec2 fracCoord = fract(pixelCoord); 

    vec4 color = vec4(0.0); 
    float totalWeight = 0.0; 

    for (int i = -3; i <= 3; i++) { 
        for (int j = -3; j <= 3; j++) {
            vec2 offset = vec2(float(i), float(j)); 
            vec2 sampleUV = (baseCoord + offset+ vec2(0.5,0.5)) / texSize;

            float weightX = lanczosWeight(offset.x - fracCoord.x, a);
            float weightY = lanczosWeight(offset.y - fracCoord.y, a);

            vec4 sampleColor = texture2D(tex, sampleUV);
            float weight = weightX * weightY;

            color += sampleColor * weight;
            totalWeight += weight;
        }
    }

    return color / totalWeight;
}

void main() 
{ 
	// 采样算法对放大效果不大, 考虑双线性
    // vec2 texSize = vec2(_inputWidth, _inputHeight); 
	// vec4 color = lanczosInterpolate2(_MainTex, uv0, texSize, 3.0);
	// gl_FragColor = color;
	gl_FragColor = texture2D(_MainTex, uv0);
}
