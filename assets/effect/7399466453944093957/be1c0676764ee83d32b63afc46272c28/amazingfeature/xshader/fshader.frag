precision highp float;

varying vec2 uv;
varying vec2 uRenderSize;
uniform sampler2D inputImageTexture;
uniform float timer;
uniform float duration;

#define TWO_PI (3.141592653*2.0)
#define lumCoeff vec3(0.299,0.587,0.114)

vec4 adjust_exposure(float exposure_intensity)
{
	vec4 resultColor = texture2D(inputImageTexture,uv);
    if (exposure_intensity>=0.001)
    {
        float lumBlur = 1.0-dot(resultColor.rgb,lumCoeff);
        resultColor.rgb = resultColor.rgb * (pow(2.0,exposure_intensity/2.0*lumBlur));
        resultColor.rgb = clamp(resultColor.rgb,0.0,1.0);
    }
    else
    {
        float lumBlur = dot(resultColor.rgb,lumCoeff);
        resultColor.rgb = resultColor.rgb * (pow(16.0,exposure_intensity/2.0));
        resultColor.rgb = clamp(resultColor.rgb,0.0,1.0);
    }

	return resultColor;
}


void main()
{
	float intensity = clamp(timer,0.0,duration)/duration;
	vec4 resultColor = adjust_exposure(-intensity);
    // resultColor.a = 1.0;
    resultColor.a = texture2D(inputImageTexture,uv).a;
	gl_FragColor = resultColor;
}
