precision highp float;

#define MAX_STEP 2.5
#define MAX_SAMPLES 48
#define Texture2D texture2Dmirror

uniform sampler2D u_tex;
uniform vec2 u_size;
uniform vec2 u_center;
uniform float u_amount;

varying vec2 v_uv;


vec4 texture2DclampToEdge (sampler2D tex, vec2 uv) {
	return texture2D(tex, uv);
}
vec4 texture2Dclamp (sampler2D tex, vec2 uv) {
	vec4 color = texture2D(tex, uv);
	uv = step(vec2(0.0), uv) * step(uv, vec2(1.0));
	return color * uv[0] * uv[1];
}
vec4 texture2Dmirror (sampler2D tex, vec2 uv) {
    uv = mod(uv, 2.0);
    uv = mix(uv, 2.0 - uv, step(vec2(1.0), uv));
    return texture2D(tex, fract(uv));
}

vec4 RadialBlur (sampler2D tex, vec2 size, vec2 center, vec2 uv, float amount) {
	float aW = 1.0;
	vec4 aC = texture2D(tex, uv);

	vec2 rSize = 1.0 / size;
	vec2 vec = size * uv - center;
	float len = length(vec);
	vec2 dir = vec / len;
	float minLen = len / amount;
	float maxLen = len * amount;

	float radiusI = len - minLen;
	float samplesI = min(ceil(radiusI / float(MAX_STEP)), float(MAX_SAMPLES));
	float stepI = radiusI / samplesI;
	vec2 dUVI = dir * stepI * rSize;
	vec2 aUVI = dUVI;
	for (int i = 0; i < MAX_SAMPLES; ++i) {
		if (i >= int(samplesI)) {
			break;
		}
		aC += Texture2D(tex, uv - aUVI);
		aW += 1.0;
		aUVI += dUVI;
	}

	float radiusO = maxLen - len;
	float samplesO = min(ceil(radiusO / float(MAX_STEP)), float(MAX_SAMPLES));
	float stepO = radiusO / samplesO;
	vec2 dUVO = dir * stepO * rSize;
	vec2 aUVO = dUVO;
	for (int i = 0; i < MAX_SAMPLES; ++i) {
		if (i >= int(samplesO)) {
			break;
		}
		aC += Texture2D(tex, uv + aUVO);
		aW += 1.0;
		aUVO += dUVO;
	}
	return aC / aW;
}

void main () {
	gl_FragColor = RadialBlur(u_tex, u_size, u_center, v_uv, u_amount);
}