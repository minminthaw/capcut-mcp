precision highp float;
varying highp vec2 uv0;

uniform sampler2D u_inputTex;
uniform float u_threshold;
uniform float u_thresholdSmooth;
uniform float u_exposure;

uniform int u_gamma;
uniform float u_gammaValue;

uniform int u_viewMode;
uniform int u_blendMode;

#define YES 1
#define VIEWFINAL 1
const float EPS = 0.0001;

void main()
{
    vec4 color = texture2D(u_inputTex, uv0);
    color.a = 1.;
    color = max(color, vec4(0.));

    float thresholdPct = 0.;
    if (color.r < u_threshold) {
        thresholdPct = color.r / max(u_threshold, EPS);
        color.r = ((thresholdPct * color.r) * u_thresholdSmooth);
    }
    if (color.g < u_threshold) {
        thresholdPct = color.g / max(u_threshold, EPS);
        color.g = ((thresholdPct * color.g) * u_thresholdSmooth);
    }
    if (color.b < u_threshold) {
        thresholdPct = color.b / max(u_threshold, EPS);
        color.b = ((thresholdPct * color.b) * u_thresholdSmooth);
    }

    if (u_viewMode == VIEWFINAL) {
        if (u_gamma == YES) {
            color = pow(color, vec4(u_gammaValue));
        }
    }

    gl_FragColor = color;
    gl_FragColor.a = 1.;
}
