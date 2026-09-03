precision highp float;

varying vec2 uv;
uniform sampler2D inputImageTexture;
uniform sampler2D blurImageTexture;

uniform float elapsedTime;
uniform float duration;

#define PI 3.14159265

void main() 
{
    lowp vec3 bgColor = texture2D(inputImageTexture,uv).rgb;
    lowp vec3 blurColor = texture2D(blurImageTexture,uv).rgb;
  
    float stageDuration1 = 0.57 * duration;
    float stageDuration2 = 0.43 * duration;
    float progress = clamp(elapsedTime,0.0,stageDuration1)/stageDuration1;

    lowp vec3 fadeColor = bgColor;
    if(elapsedTime < stageDuration1)
    {
        // vec2 realCoord = (uv - 0.5) * resolution;

        //6136590646370520297477065417553420927
        // float a = resolution.x * 0.5 + progress * resolution.x * 0.6;
        // float b = resolution.y * 0.5 + progress * resolution.y * 0.6;
        // vec2 ellipse = pow(realCoord,vec2(2.0))/pow(vec2(a,b),vec2(2.0));
        // float result = ellipse.x + ellipse.y;
        // float positiveCyCle = 0.5;
        // float mixture = smoothstep(1.0 - positiveCyCle,1.0 + positiveCyCle,result);    
        // fadeColor = mix(bgColor * progress,vec3(0.0),mixture); 

        //7477065417553420927
        // float maxRadius = length(resolution)/2.0;
        // float radius = resolution.x * 0.25 + progress * (maxRadius - resolution.x * 0.25);
        // vec2 circleEquation = pow(realCoord,vec2(2.0))/pow(radius,2.0);
        // float result = circleEquation.x + circleEquation.y;
        // float positiveCyCle = 0.5;
        // float mixture = smoothstep(1.0 - positiveCyCle,1.0 + positiveCyCle,result);    
        // fadeColor = mix(bgColor * progress,vec3(0.0),mixture);  

        float mixture = 1.0 - progress; 
        fadeColor = mix(bgColor * progress,vec3(0.0),mixture);      

    }
    else if(elapsedTime < stageDuration1 + stageDuration2)
    {
        float progress2 = elapsedTime - stageDuration1;
        if(progress2 > stageDuration2 * 0.1 && progress2 <= stageDuration2 * 0.2)
        {
            float mixFactor = smoothstep(0.35,0.75, uv.y);
            fadeColor = mix(bgColor,blurColor,mixFactor);
        }
        else if(progress2 > stageDuration2 * 0.2 && progress2 <= stageDuration2 * 0.8)
        {
            float mixFactor = abs(progress2 - stageDuration2 * 0.5)/(stageDuration2 * 0.3);
            fadeColor = mix(bgColor,blurColor,mixFactor);
        }
        else if(progress2 > stageDuration2 * 0.8 && progress2 > stageDuration2 * 0.9)
        {
            float mixFactor = smoothstep(0.35,0.75, 1.0 - uv.y);
            fadeColor = mix(bgColor,blurColor,mixFactor);            
        }
    }
    gl_FragColor = vec4(fadeColor,1.0);
}

