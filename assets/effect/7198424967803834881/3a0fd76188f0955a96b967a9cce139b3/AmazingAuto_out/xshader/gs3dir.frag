precision highp float;

uniform sampler2D u_src;

varying vec2 v_uv[9];

const vec4 c_weights = vec4(0.233308, 0.135928, 0.051383, 0.012595);


void main () {
    vec4 sum = texture2D(u_src, v_uv[0]) * 0.133571;
	for (int i = 0; i < 4; ++i) {
		sum += texture2D(u_src, v_uv[i * 2 + 1]) * c_weights[i];
		sum += texture2D(u_src, v_uv[i * 2 + 2]) * c_weights[i];
	}
	gl_FragColor = sum;
}
// DO_NOT_PATCH_ME