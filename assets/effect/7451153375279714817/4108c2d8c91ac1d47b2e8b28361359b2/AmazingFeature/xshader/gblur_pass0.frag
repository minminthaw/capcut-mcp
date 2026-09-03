precision mediump float; 

uniform sampler2D u_inputTex;
uniform sampler2D u_faceMaskTex;
varying highp vec2 uv; 

varying highp vec4 textureShift_1; 
varying highp vec4 textureShift_2; 
varying highp vec4 textureShift_3; 
varying highp vec4 textureShift_4; 
varying highp vec4 textureShift_5;

void main() {
    mediump float sum_weight;
    mediump float face_mask_sum_weight;
    mediump vec4 sum; 
    mediump vec4 neighborColor; 
    mediump float color_dist; 
    mediump float sample_weight;
    
    mediump vec4 maskNeighborColor;

    lowp vec4 curColor = texture2D(u_inputTex, uv);
    lowp vec4 maskColor = texture2D(u_faceMaskTex, uv).rgba;
    sum_weight = 0.18 * maskColor.g; 
    sum = curColor * sum_weight;
    face_mask_sum_weight = maskColor.g;

    neighborColor = texture2D(u_inputTex, textureShift_1.xy);
    maskNeighborColor = texture2D(u_faceMaskTex, textureShift_1.xy);
    sample_weight = 0.15 * maskNeighborColor.g; 
    sum_weight += sample_weight; 
    sum += neighborColor * sample_weight;
    face_mask_sum_weight += maskNeighborColor.g;
        
    neighborColor = texture2D(u_inputTex, textureShift_1.zw); 
    maskNeighborColor = texture2D(u_faceMaskTex, textureShift_1.zw); 
    sample_weight = 0.15 * maskNeighborColor.g; 
    sum_weight += sample_weight; 
    sum += neighborColor * sample_weight;
    face_mask_sum_weight += maskNeighborColor.g;
        
    neighborColor = texture2D(u_inputTex, textureShift_2.xy); 
    maskNeighborColor = texture2D(u_faceMaskTex, textureShift_2.xy);
    sample_weight = 0.12 * maskNeighborColor.g;
    sum_weight += sample_weight; 
    sum += neighborColor * sample_weight;
    face_mask_sum_weight += maskNeighborColor.g;
        
    neighborColor = texture2D(u_inputTex, textureShift_2.zw);
    maskNeighborColor = texture2D(u_faceMaskTex, textureShift_2.zw);
    sample_weight = 0.12 * maskNeighborColor.g;
    sum_weight += sample_weight; 
    sum += neighborColor * sample_weight; 
    face_mask_sum_weight += maskNeighborColor.g;

    neighborColor = texture2D(u_inputTex, textureShift_3.xy); 
    maskNeighborColor = texture2D(u_faceMaskTex, textureShift_3.xy);
    sample_weight = 0.09 * maskNeighborColor.g; 
    sum_weight += sample_weight; 
    sum += neighborColor * sample_weight; 
    face_mask_sum_weight += maskNeighborColor.g;

    neighborColor = texture2D(u_inputTex, textureShift_3.zw); 
    maskNeighborColor = texture2D(u_faceMaskTex, textureShift_3.zw);
    sample_weight = 0.09 * maskNeighborColor.g; 
    sum_weight += sample_weight; 
    sum += neighborColor * sample_weight;
    face_mask_sum_weight += maskNeighborColor.g;

    neighborColor = texture2D(u_inputTex, textureShift_3.xy);
    maskNeighborColor = texture2D(u_faceMaskTex, textureShift_3.xy);
    sample_weight = 0.05 * maskNeighborColor.g;
    sum_weight += sample_weight;
    sum += neighborColor * sample_weight; 
    face_mask_sum_weight += maskNeighborColor.g;

    neighborColor = texture2D(u_inputTex, textureShift_4.zw);
    maskNeighborColor = texture2D(u_faceMaskTex, textureShift_4.zw);
    sample_weight = 0.05 * maskNeighborColor.g;
    sum_weight += sample_weight;
    sum += neighborColor * sample_weight; 
    face_mask_sum_weight += maskNeighborColor.g;

    vec4 res = sum / sum_weight;
    gl_FragColor = vec4(res.xyz, face_mask_sum_weight / 9.0);
}