precision highp float;

uniform float u_OutputWidth;
uniform float u_OutputHeight;

uniform sampler2D _MainTex;
uniform sampler2D _MainTex2;

uniform vec3 param;
uniform vec2 blurDirection;
uniform float blurStep;
uniform float alpha;
uniform vec4 _MainTex_ST;
uniform float u_percent;
uniform float u_transition;
uniform float u_offsetx;

uniform vec4 u_ScreenParams;

varying vec2 uv0;
#define BLUR_MOTION 0x1
#define BLUR_SCALE  0x2

#if defined(BLUR_TYPE) && BLUR_TYPE == BLUR_SCALE
#define num 25
#else
#define num 7
#endif

float random(in vec3 scale, in float seed) {
    /* use the fragment position for randomness */
    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

vec4 directionBlur(sampler2D tex, vec2 resolution, vec2 uv, vec2 directionOfBlur, float intensity)
{
    vec2 pixelStep = 1.0/resolution * intensity;
    float dircLength = max(length(directionOfBlur), .000001);
    pixelStep.x = directionOfBlur.x * 1.0 / dircLength * pixelStep.x;
    pixelStep.y = directionOfBlur.y * 1.0 / dircLength * pixelStep.y;

    vec4 color = vec4(0);
    for(int i = -num; i <= num; i++)
    {
        vec2 blurCoord = uv + pixelStep * float(i);
        #if defined(ANIMSEQ) && ANIMSEQ == 1
        blurCoord.x = clamp(blurCoord.x, 0., 1.);
        blurCoord.y = clamp(blurCoord.y, 0., 1.);
        blurCoord = blurCoord * _MainTex_ST.xy + _MainTex_ST.zw;
        #endif
        color += texture2D(tex, blurCoord);
    }
    color /= float(2 * num + 1);
    return color;
}

vec4 scaleBlur(vec2 uv) {
    vec4 color = vec4(0.0);
    float total = 0.0;
    vec2 toCenter = vec2(0.5, 0.5) - uv;
    float dissolve = 0.5;
    /* randomize the lookup values to hide the fixed number of samples */
    float offset3 = random(vec3(12.9898, 78.233, 151.7182), 0.0);
    for (int t = 0; t <= num; t++) {
        float percent = (float(t) + offset3 - .5) / float(num);
        float weight = 4.0 * (percent - percent * percent);

        vec2 curUV = uv + toCenter * percent * blurStep;
        #if defined(ANIMSEQ) && ANIMSEQ == 1
        curUV.x = clamp(curUV.x, 0., 1.);
        curUV.y = clamp(curUV.y, 0., 1.);
        curUV = curUV * _MainTex_ST.xy + _MainTex_ST.zw;
        #endif
        color += texture2D(_MainTex, curUV) * weight;
        total += weight;
    }
    return color / total;
}

float calAlpha(float percent, float transition, vec2 uvInput, int angle, int appear){
    float result = 1.0;
    vec2 range = vec2(percent * (1.0 + transition) - transition * 0.5);
    range.x = range.x - transition * 0.5;
    range.y = range.y + transition * 0.5;

    vec2 alphaRange = vec2(0.0);
    if(appear == 1){ // disappear
        alphaRange.x = 1.0;
    }else{ // appear
        alphaRange.y = 1.0;
    }
    float pos = 0.0;
    if (angle == 0){ // left->right
        pos = uvInput.x;
    }else if(angle == 1){ // right <- left
        pos = 1.0 - uvInput.x;
    }else if(angle == 2){ // top -> bottom
        pos = uvInput.y;
    }else if(angle == 3){// bottom -> top
        pos = 1.0 - uvInput.y;
    }

    if(pos < range.x){
        result = alphaRange.x;
    }else if(pos < range.y){
        if(appear == 1){
            result = 1.0 - (pos - range.x) / transition;
        }else{
            result = (pos - range.x) / transition;
        }
        result = smoothstep(0.0, 1.0, result);
    }else{
        result = alphaRange.y;
    }
    return result;
}

// Fixed rotation alpha calculation function
float calRotationAlpha(float percent, float transition, vec2 uvInput, int clockwise, int appear){
    float PI = 3.14159265359;
    vec2 center = vec2(0.5, 0.5);
    vec2 dir = uvInput - center;
    
    // Avoid division by zero or NaN
    if (length(dir) == 0.0) return appear == 1 ? 0.0 : 1.0;
    
    // 1. Calculate angle (-PI to PI)
    // atan(y, x) calculates angle relative to positive X axis
    float angle = atan(dir.y, dir.x);
    
    // 2. Map angle to 0-1 range, with 12 o'clock (Top) as starting point 0.0
    // Original atan: right=0, up=PI/2, left=PI, down=-PI/2
    // We want: up=0, right=0.25 (for clockwise)
    // Formula: (PI/2 - angle) / 2PI achieves correct mapping for counterclockwise increase, then fract ensures 0-1
    float normalizedAngle = (PI * 0.5 - angle) / (2.0 * PI);
    normalizedAngle = fract(normalizedAngle); 
    
    // 3. Handle clockwise/counterclockwise
    // The above formula defaults to clockwise increase (since angle increases counterclockwise, subtracting it makes it clockwise)
    // If counterclockwise is needed (clockwise == 0), invert it
    if (clockwise == 0) {
        normalizedAngle = 1.0 - normalizedAngle;
    }
    
    // 4. Calculate current progress threshold
    // To make transition smooth, we expand the progress range a bit
    // When percent=1, cutOff should cover the range up to 1.0 + transition
    float cutOff = percent * (1.0 + transition);
    
    // 5. Calculate alpha mask using smoothstep
    // We want to transition from 1 to 0 in the interval [cutOff - transition, cutOff] (for Appear)
    // lower edge: fully visible boundary
    // upper edge: fully invisible boundary
    
    float lower = cutOff - transition;
    float upper = cutOff;
    
    // smoothstep(low, high, x) -> returns 0 when x < low, 1 when x > high
    // We want x < low to return 1 (visible), so use 1.0 - smoothstep
    float alpha = 1.0 - smoothstep(lower, upper, normalizedAngle);
    
    // 6. Handle appear(0) or disappear(1)
    if (appear == 1) {
        // If it's a disappear effect, reverse the logic:
        // Swept areas become transparent(0), unswept areas remain(1)
        alpha = 1.0 - alpha;
    }
    
    return clamp(alpha, 0.0, 1.0);
}

vec4 texture2Dmirror(sampler2D tex, vec2 uv)
{
    // return texture(tex, fract(uv));
    uv = mod(uv, 2.0);
    uv = mix(uv, 2.0 - uv, step(vec2(1.0), uv));
    return texture2D(tex, fract(uv));
}

float getDis(vec4 color)
{
    // if (type < 0.5) {
        return color.r;
    // } else if (type < 1.5) {
        // return color.g;
    // } else if (type < 2.5) {
        // return color.b;
    // }
    return color.a;
}

void main()
{
    vec4 color = vec4(0);
    vec4 color2 = vec4(0);

    vec2 uvF = vec2(uv0);
    #if defined(BLUR_TYPE) && BLUR_TYPE == BLUR_MOTION
    color = directionBlur(_MainTex, vec2(u_OutputWidth, u_OutputHeight), uvF, blurDirection, blurStep);
    color2 = directionBlur(_MainTex2, vec2(u_OutputWidth, u_OutputHeight), uvF, blurDirection, blurStep);

    #elif defined(BLUR_TYPE) && BLUR_TYPE == BLUR_SCALE
    color = scaleBlur(uvF);
    color2 = scaleBlur(uvF);
    #else
    uvF = vec2(uv0);
    #if defined(ANIMSEQ) && ANIMSEQ == 1
    uvF.x = clamp(uvF.x, 0., 1.);
    uvF.y = clamp(uvF.y, 0., 1.);
    uvF = uvF * _MainTex_ST.xy + _MainTex_ST.zw;
    #endif
    color = texture2D(_MainTex, uvF);

    
    #endif
    // Get texture color
    color2 = texture2D(_MainTex2, uvF);
    float horizontal = (getDis(color2) ) * 2.0 * 0.002 * u_ScreenParams.x / u_ScreenParams.y;
    float vertical = (getDis(color2) ) * 2.0 * 0.002;
    // float vertical = (getDis(verticalColor, u_verticalType) - 0.5) * 2.0 * color2 * u_ScreenParams.x / u_ScreenParams.y;

    vec2 new_uv = vec2(uvF.x + horizontal, uvF.y + vertical);
    // Calculate rotation appear/disappear effect alpha value
    // Parameter explanation:
    // u_percent: current progress [0, 1]
    // u_transition: transition area size [0, 1]
    // uv0: current UV coordinate
    // 1: clockwise direction (0 for counterclockwise)
    // 0: appear effect (1 for disappear effect)
    float rotationAlpha = calRotationAlpha(u_percent, u_transition, vec2(uv0.x, 1.0 - uv0.y), 1, 0);
    
    // Apply alpha value
    color *= rotationAlpha;
    vec4 finalColor_r = texture2Dmirror(_MainTex, vec2(new_uv.x + u_offsetx, new_uv.y + u_offsetx *0.3) );
    vec4 finalColor_g = texture2Dmirror(_MainTex, new_uv);
    vec4 finalColor_b = texture2Dmirror(_MainTex, vec2(new_uv.x - u_offsetx, new_uv.y - u_offsetx *0.3) );  

    vec4 finalColor = vec4(finalColor_r.r, finalColor_g.g, finalColor_b.b, finalColor_r.a);
    
    gl_FragColor = finalColor;
    // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);

}