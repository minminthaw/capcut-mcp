precision highp float;
varying highp vec2 uv0;
uniform sampler2D u_inputTexture;

uniform float u_intensity;
uniform float u_quality;
uniform vec2 u_center;
uniform float u_weightDecay;
uniform float u_dither;
uniform int u_blurType;
uniform int u_borderType;
uniform int u_blurAlpha;
uniform int u_inverseGammaCorrection;
uniform float u_gamma;

// finetuned parameters
uniform float u_normalizationSample;
uniform float u_sampleScale;
uniform float u_sampleBias;

#define FALSE 0
#define TRUE 1
#define BLUR_TYPE_CENTERED_ZOOM 2
#define BORDER_TYPE_BLACK 0
#define MAX_SAMPLE 4096

const float Eps = 1e-5;


vec4 getColor(sampler2D tex, vec2 uv)
{
    vec4 color = texture2D(tex, uv);
    if (u_inverseGammaCorrection == TRUE) {
        // inverse gamma correction is not applied for alpha channel.
        color.rgb = pow(color.rgb, vec3(u_gamma));
    }
    return color;
}


float adjustSample(float quality, float dist, float scale, float bias)
{
    // use a linear function whose slope is slightly less than 1.0 to map distance (dist).
    // the purpose is to compensate sample for small distance.
    // If dist<0, use abs(dist) and preserve its sign.
    dist = sign(dist) * (0.9 * abs(dist) + 0.1);

    return scale * quality * dist + bias;
}


float adjustWeightDecay(float baseWeightDecay, float normalizationSample, float sampleNum)
{
    // this adjustment is to guarantee `scale invariant` for weight decay.
    // the adjusted weight decay should satisfy: pow(wd0, s0) = pow(wd1, s1).
    return pow(pow(baseWeightDecay, normalizationSample), 1. / sampleNum);
}


float randomNumber(vec2 uv)
{
    // generate a pseudo random number between [0, 1]
    return fract(sin(dot(uv, vec2(41., 289.))) * 45758.5453);
}


void main()
{
    float intensity = u_intensity;
    if (u_blurType == BLUR_TYPE_CENTERED_ZOOM) {
        // `Centered Zoom` will blur in dual direction,
        // so intensity should be halved to keep blur range same as other types.
        intensity *= 0.5;
    }

    // init sumColor and sumWeight using current pixel.
    vec4 oriColor = getColor(u_inputTexture, uv0);
    float weight = 1.;
    float sumWeight = weight;
    vec4 sumColor = weight * oriColor;

    // compute sample, which should be related with distantce(uv0, u_center).
    // Larger distance requires larger sample to avoid `layer effect`, whick is a kind of badcase.
    vec2 baseUV = uv0;
    vec2 dirUV = (baseUV - u_center) * intensity; // direction * blurIntensity
    float dist = length(dirUV);
    float sampleNum = adjustSample(u_quality, dist, u_sampleScale, u_sampleBias);
    sampleNum = min(sampleNum, float(MAX_SAMPLE));
    vec2 unitUV = dirUV / sampleNum;

    float weightDecay = adjustWeightDecay(u_weightDecay, u_normalizationSample, sampleNum);

    // dither baseUV
    if (u_dither > Eps) {
        vec2 jitterUV = u_dither * (randomNumber(uv0) * 2. - 1.) * dirUV / u_normalizationSample;
        baseUV += jitterUV;
    }

    for (int i = 1; i <= MAX_SAMPLE; i++) {
        float k = float(i);
        if (k > sampleNum) {
            break;
        }
        weight *= weightDecay;

        // towards the center
        vec2 uv = baseUV - k * unitUV;
        if (uv.x < 0. || uv.y < 0. || uv.x > 1. || uv.y > 1.) {
            // borderType: Black, Normal.
            // Black does NOT accumulate color. Normal does NOT accumulate weight and color (do nothing).
            if (u_borderType == BORDER_TYPE_BLACK) {
                sumWeight += weight;
            }
        } else {
            sumColor += weight * getColor(u_inputTexture, uv);
            sumWeight += weight;
        }

        // towards the outer, only work for `Centered Zoom`.
        if (u_blurType == BLUR_TYPE_CENTERED_ZOOM) {
            uv = baseUV + k * unitUV;
            if (uv.x < 0. || uv.y < 0. || uv.x > 1. || uv.y > 1.) {
                // process border conditions. Descriptions refer preceding codes, several lines ahead.
                if (u_borderType == BORDER_TYPE_BLACK) {
                    sumWeight += weight;
                }
            } else {
                sumColor += weight * getColor(u_inputTexture, uv);
                sumWeight += weight;
            }
        }
    }
    sumColor /= sumWeight;

    if (u_inverseGammaCorrection == TRUE) {
        // re-apply gamma correction for rgb.
        sumColor.rgb = pow(sumColor.rgb, vec3(1. / u_gamma));
    }

    if (u_blurAlpha == FALSE) {
        sumColor.a = oriColor.a;
    }

    gl_FragColor = sumColor;
}
