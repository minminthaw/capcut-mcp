precision mediump float;

uniform sampler2D u_substractTex;
uniform sampler2D u_inputTex;
uniform sampler2D u_lowFqTex;

varying highp vec2 uv;

varying highp vec4 textureShift_1; 
varying highp vec4 textureShift_2; 
varying highp vec4 textureShift_3; 
varying highp vec4 textureShift_4; 
varying highp vec4 textureShift_5; 

vec4 GaussianBlur() 
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
    return res;
}

// https://stackoverflow.com/questions/50508452/implementing-photoshop-high-pass-filter-hpf-in-opencv
vec4 highPassFilter(vec4 substractColor)
{
    vec4 blurredColor = GaussianBlur();
    vec3 color = clamp(substractColor.rgb - blurredColor.rgb + vec3(0.5), 0.0, 1.0);
    return vec4(color, blurredColor.a);
}

vec4 blendLinearLight(vec4 a, vec4 b)
{
    return clamp(b + 2.0 * a - vec4(1.0), 0.0, 1.0);
}

void main()
{    
    vec4 substractColor = texture2D(u_substractTex, uv);
    vec4 lowFqColor = texture2D(u_lowFqTex, uv);

    vec4 highPass = highPassFilter(substractColor);
    vec4 blendColor = blendLinearLight(highPass, lowFqColor);
    
    gl_FragColor = vec4(blendColor.rgb, highPass.a);
}