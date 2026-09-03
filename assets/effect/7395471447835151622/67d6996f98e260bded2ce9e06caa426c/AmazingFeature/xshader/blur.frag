precision highp float;
varying highp vec2 uv0;
uniform sampler2D inputTex;
uniform float u_blurSize;
uniform vec4 u_ScreenParams;
uniform vec2 u_Dir;
#ifdef blur_Num
#else
#define blur_Num 8
#endif

const vec2 dir = vec2(0., 1.);


uniform float sigma;

float Gaussian (float x)
{
    return exp(-(x*x) / (2.0 * sigma*sigma));
}
vec4 gauss_blur(sampler2D inputTexture, vec2 uv, float blurSize)
{
    
	vec2 ratio = vec2(720.0) * u_ScreenParams.xy / min(u_ScreenParams.x, u_ScreenParams.y);

    vec4 result         = vec4(0.0);
    vec2 unit_uv        = vec2(blurSize)/ratio;
    // vec2 unit_uv        = vec2(0., 0.);
    vec4 centerPixel    = texture2D(inputTexture, uv);
    float sum_weight    = 1.;

    vec2 curPositiveCoordinate = uv;
    vec2 curNegativeCoordinate = uv;

    for(int i=1; i<=blur_Num; i++)
    {
        curPositiveCoordinate    += u_Dir * unit_uv;
        curNegativeCoordinate    -= u_Dir * unit_uv;
        float fX = Gaussian(float(i));
        centerPixel += texture2D(inputTexture, curPositiveCoordinate) * fX;
        centerPixel += texture2D(inputTexture, curNegativeCoordinate) * fX;
        sum_weight += fX * 2.0;
    }
    result = centerPixel / sum_weight;
    return result;
}




void main(void)
{
    gl_FragColor = gauss_blur(inputTex, uv0, u_blurSize);
    // gl_FragColor = vec4(float(blur_Num)/64.,0,0,1);
}
