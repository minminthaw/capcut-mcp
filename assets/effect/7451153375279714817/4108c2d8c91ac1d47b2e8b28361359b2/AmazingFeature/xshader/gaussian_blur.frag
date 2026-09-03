precision mediump float; 

uniform sampler2D u_inputTex;
varying highp vec2 uv;

varying highp vec4 textureShift_1; 
varying highp vec4 textureShift_2; 
varying highp vec4 textureShift_3; 
varying highp vec4 textureShift_4; 
varying highp vec4 textureShift_5; 

void main() 
{
    mediump float sum_weight; 
    mediump vec4 sum; 
    mediump vec4 neighborColor; 
    mediump float color_dist; 
    mediump float sample_weight;

    lowp vec4 curColor = texture2D(u_inputTex, uv);
    sum_weight = 0.18; 
    sum = curColor * sum_weight; 

    neighborColor = texture2D(u_inputTex, textureShift_1.xy); 
    sample_weight = 0.15; 
    sum_weight += sample_weight; 
    sum += neighborColor * sample_weight; 
        
    neighborColor = texture2D(u_inputTex, textureShift_1.zw); 
    sample_weight = 0.15;
    sum_weight += sample_weight; 
    sum += neighborColor * sample_weight; 
        
    neighborColor = texture2D(u_inputTex, textureShift_2.xy); 
    sample_weight = 0.12;
    sum_weight += sample_weight; 
    sum += neighborColor * sample_weight; 
        
    neighborColor = texture2D(u_inputTex, textureShift_2.zw); 
    sample_weight = 0.12;
    sum_weight += sample_weight; 
    sum += neighborColor * sample_weight; 

    neighborColor = texture2D(u_inputTex, textureShift_3.xy);
    sample_weight = 0.09;
    sum_weight += sample_weight;
    sum += neighborColor * sample_weight;
        
    neighborColor = texture2D(u_inputTex, textureShift_3.zw); 
    sample_weight = 0.09;
    sum_weight += sample_weight; 
    sum += neighborColor * sample_weight; 

    neighborColor = texture2D(u_inputTex, textureShift_3.xy); 
    sample_weight = 0.05;
    sum_weight += sample_weight;  
    sum += neighborColor * sample_weight; 
        
    neighborColor = texture2D(u_inputTex, textureShift_4.zw); 
    sample_weight = 0.05;
    sum_weight += sample_weight; 
    sum += neighborColor * sample_weight; 

    vec4 res = sum / sum_weight;
    gl_FragColor = res;
}