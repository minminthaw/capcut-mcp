precision mediump float;
varying highp vec2 uv0;
uniform sampler2D u_inputTexture;
uniform vec4 u_ScreenParams;
uniform int u_horz;
uniform int u_vert;
uniform int u_sharp;

#define SHARP_COLOR 1
#define MAX_SAMPLE 4.0

vec4 getNeighborColor(float i, vec2 uv, vec2 unit)
{
    vec2 uv1 = uv + unit * vec2(0.0, i);
    vec2 uv2 = uv - unit * vec2(0.0, i);
    return texture2D(u_inputTexture, uv1) + texture2D(u_inputTexture, uv2);
}

void main()
{
    if (u_horz == 0 && u_vert == 0) {
        gl_FragColor = texture2D(u_inputTexture, uv0);
        return;
    }

    vec2 size = vec2(u_horz, u_vert);
    if (u_horz == 0) {
        size.x = size.y * u_ScreenParams.x / u_ScreenParams.y;
    } else if (u_vert == 0) {
        size.y = size.x * u_ScreenParams.y / u_ScreenParams.x;
    }

    vec4 color;
    if (u_sharp == SHARP_COLOR) {
        vec2 uv = floor(size * uv0) / size;
        color = texture2D(u_inputTexture, uv);
    } else {
        vec2 uv = (floor(size * uv0) + 0.5) / size;
        color = texture2D(u_inputTexture, uv);

        vec2 unit = 1.0 / size / MAX_SAMPLE / 2.;
        float count = 1.0;
        for (float i = 1.0; i <= MAX_SAMPLE; i += 1.0) {
            color.rgb += getNeighborColor(i, uv, unit).rgb;
            count += 2.0;
        }
        color.rgb /= count;
    }

    gl_FragColor = color;
}
