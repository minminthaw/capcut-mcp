precision highp float;
varying highp vec2 uv0;
uniform sampler2D u_mattingmask;
uniform vec2 u_inputSize;
uniform float u_expansion;
uniform sampler2D u_structTex;

float dilate_or_erode_mask(sampler2D tex, vec2 uv, int kernel_size){
    vec2 res = u_inputSize.xy;
    vec2 step = vec2(float(2 * kernel_size + 1) / float(8 * 2 + 1), float(2 * kernel_size + 1) / float(8 * 2 + 1)) / res;     
    vec4 sum = texture2D(tex, uv);

    for(int y = -8; y <= 8; y++){
        for(int x = -8; x <= 8; x++){
            float ux = float(x + 8) / float(8 * 2 + 1);
            float uy = float(y + 8) / float(8 * 2 + 1);
            float structValue = texture2D(u_structTex, vec2(ux, uy)).r;
            if(structValue > 0.0){
                vec4 color = texture2D(tex, uv + vec2(x, y) * step);
                if(kernel_size > 0){
                    sum = max(color, sum);
                }else{
                    sum = min(color, sum);
                }
            }
        }
    }
    return sum.x;
}

void main()
{
    vec2 uv = uv0;
    float alpha = texture2D(u_mattingmask, uv).r;
    float minSize = min(u_inputSize.x, u_inputSize.y);
    int kernel_size = int(u_expansion * 100.0 * minSize) / 288;
    alpha = dilate_or_erode_mask(u_mattingmask, uv, kernel_size);
    gl_FragColor = vec4(alpha, 0.0, 0.0, 1.0);
}
