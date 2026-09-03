precision highp float;
varying highp vec2 uv0;

varying highp vec2 textureShift1[4];
varying highp vec2 textureShift2[4];
varying highp vec2 textureShift3[4];

uniform sampler2D ori_img;
uniform sampler2D face_mask;

uniform float value_factor;

vec4 processing_1pixel(vec4 sum_value, float center_gray, vec2 coor) {
    lowp vec3 tmp_color = texture2D(ori_img, coor).rgb;
    lowp float tmp_value_dis = tmp_color.g - center_gray;
    tmp_value_dis = 1. - min(tmp_value_dis * tmp_value_dis * value_factor, 1.);
    sum_value.xyz += tmp_color * tmp_value_dis;
    sum_value.w += tmp_value_dis;
    return sum_value;
}

void main(void)
{
    lowp vec3 center_color = texture2D(ori_img, uv0).rgb;
    lowp float skinArea = texture2D(face_mask, uv0).a;
    
    lowp vec3 res_color = center_color;

    if (skinArea > 0.1) {

        lowp float center_gray = center_color.g;

        mediump vec4 sum_value = vec4(0., 0., 0., 0.);

        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift1[0].x, textureShift1[0].y));  //5 0
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(-textureShift1[0].x, textureShift1[0].y)); //-5 0
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift1[1].x, textureShift1[1].y));  //0 5
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift1[1].x, -textureShift1[1].y)); //0 -5
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift1[2].x, textureShift1[2].y));  //3 4
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(-textureShift1[2].x, textureShift1[2].y));  //-3 4
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift1[2].x, -textureShift1[2].y));  //3 -4
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(-textureShift1[2].x, -textureShift1[2].y));  //-3 -4
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift1[3].x, textureShift1[3].y));  //4 3
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(-textureShift1[3].x, textureShift1[3].y));  //-4 3
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift1[3].x, -textureShift1[3].y));  //4 -3
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(-textureShift1[3].x, -textureShift1[3].y));  //-4 -3


        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift2[0].x, textureShift2[0].y));  //10 0
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(-textureShift2[0].x, textureShift2[0].y)); //-10 0
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift2[1].x, textureShift2[1].y));  //0 10
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift2[1].x, -textureShift2[1].y)); //0 -10
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift2[2].x, textureShift2[2].y));  //6 8
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(-textureShift2[2].x, textureShift2[2].y));  //-6 8
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift2[2].x, -textureShift2[2].y));  //6 -8
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(-textureShift2[2].x, -textureShift2[2].y));  //-6 -8
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift2[3].x, textureShift2[3].y));  //8 6
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(-textureShift2[3].x, textureShift2[3].y));  //-8 6
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift2[3].x, -textureShift2[3].y));  //8 -6
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(-textureShift2[3].x, -textureShift2[3].y));  //-8 -6


        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift3[0].x, textureShift3[0].y));  //20 0
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(-textureShift3[0].x, textureShift3[0].y)); //-20 0
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift3[1].x, textureShift3[1].y));  //0 20
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift3[1].x, -textureShift3[1].y)); //0 -20
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift3[2].x, textureShift3[2].y));  //12 16
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(-textureShift3[2].x, textureShift3[2].y));  //-12 16
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift3[2].x, -textureShift3[2].y));  //12 -16
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(-textureShift3[2].x, -textureShift3[2].y));  //-12 -16
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift3[3].x, textureShift3[3].y));  //16 12
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(-textureShift3[3].x, textureShift3[3].y));  //-16 12
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(textureShift3[3].x, -textureShift3[3].y));  //16 -12
        sum_value = processing_1pixel(sum_value, center_gray, uv0 + vec2(-textureShift3[3].x, -textureShift3[3].y));  //-16 -12

        sum_value.xyz += center_color;
        sum_value.w += 1.0;

        res_color =  sum_value.xyz / sum_value.w;
    }

    gl_FragColor = vec4(res_color, 1.0);  
}
