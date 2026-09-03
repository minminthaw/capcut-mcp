precision highp float;
uniform sampler2D inputTexture;
uniform sampler2D inputTexture_in2;
varying vec2 uv;
uniform float texWOffset;
uniform float texHOffset;



const float total = 7.929466;
void main()
{
    float gaussianKernel[5];   
    gaussianKernel[0] = 0.726149;
    gaussianKernel[1] = 0.835270;
    gaussianKernel[2] = 0.923116;
    gaussianKernel[3] = 0.980198;
    gaussianKernel[3] = 1.000000;
    // kernel 9

    vec4 oriRGBA = texture2D(inputTexture, uv);
    float dis_mask = oriRGBA.a;
    vec4 sum = oriRGBA;
    vec2 singleOffset = vec2(texWOffset, texHOffset);

    for (int i = 1; i < 5; i++) {
         sum += texture2D(inputTexture, uv - float(i) * singleOffset) * gaussianKernel[4 - i];
         sum += texture2D(inputTexture, uv + float(i) * singleOffset) * gaussianKernel[4 - i];
    }

    vec4 blurRBGA = sum / total;
    vec4 result = mix(oriRGBA, blurRBGA, dis_mask);
    float alpha = texture2D(inputTexture_in2, uv).a;
    gl_FragColor = vec4(alpha* result.rgb, alpha);
}