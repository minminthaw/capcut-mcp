attribute vec3 position;
attribute vec2 texcoord0;
varying vec2 uv0;

uniform mat4 u_MVP;
uniform float _surfaceWidth;
uniform float _surfaceHeight;
#define MAX_STEP 40     //max steps
#define MIN_FLOAT 0.001

uniform vec2 uDeformationStartPoint[MAX_STEP];
uniform vec2 uDeformationEndPoint[MAX_STEP];
uniform float uDeformationActionType[MAX_STEP];
uniform float uDeformationIntensity[MAX_STEP];
uniform float uDeformationRadius[MAX_STEP];
uniform float uDeformationRealStep;   //the real steps used
uniform float uIntensity; //default [0.0~1.0]
vec2 stretchFun(vec2 textureCoord, vec2 originPosition, vec2 targetPosition, float radius, float intensity)
{
    vec2 offset = vec2(0.0);
    vec2 result = vec2(0.0);
    vec2 direction = targetPosition - originPosition;
    float lengthA = length(direction);
    //if(lengthA<0.0001)   return (textureCoord-direction);
    float infect = distance(textureCoord, originPosition)/radius;
    infect = 1.0-infect;
    infect = clamp(infect,0.0,1.0);
    offset = direction * infect * intensity;
    result = textureCoord - offset;
    return result;
    
}

void main()
{
    gl_Position = vec4(position.x, position.y, 0.0, 1.0);
    vec2 x_y = vec2(_surfaceWidth,_surfaceHeight);
    vec2 curCoord = texcoord0 * x_y;
    vec2 srcPoint               = vec2(0.0);
    vec2 dstPoint               = vec2(0.0);
    int n = int(uDeformationRealStep);
    for(int i=0;i<100;i++)
    {
        if(i>=n) break;

        srcPoint        = uDeformationStartPoint[i];
        dstPoint        = uDeformationEndPoint[i];
        curCoord        = stretchFun(curCoord,srcPoint,dstPoint, uDeformationRadius[i],uDeformationIntensity[i]);
    }

    uv0 = texcoord0 + (curCoord / x_y - texcoord0) * uIntensity;
}
