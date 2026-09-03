precision highp float;
attribute vec3 position;
attribute vec2 texcoord0;
attribute vec2 texcoord1;

varying vec2 uv0;
varying vec2 maskCoord;
varying vec2 origCoord;

uniform float _surfaceWidth;
uniform float _surfaceHeight;
#define MAX_STEP 40     //max steps
#define MIN_FLOAT 0.001

uniform vec2 uDeformationStartPoint[MAX_STEP];
uniform vec2 uDeformationEndPoint[MAX_STEP];
uniform float uDeformationActionType[MAX_STEP];
uniform float uDeformationIntensity[MAX_STEP];
uniform float uDeformationRadius[MAX_STEP];
uniform float uDeformationRealStep;   //the real used steps
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

vec2 enlargeFun(vec2 curCoord,vec2 circleCenter,float radius,float intensity)
{
    float currentDistance = distance(curCoord,circleCenter);
    //if (currentDistance<=radius)
    {
        float weight = currentDistance/radius;
        weight = 1.0-intensity*(1.0-weight*weight);
        weight = clamp(weight,0.0,1.0);
        curCoord = circleCenter+(curCoord-circleCenter)*weight;
    }
    return curCoord;
}

vec2 narrowFun(vec2 curCoord,vec2 circleCenter,float radius,float intensity)
{
    float currentDistance = distance(curCoord,circleCenter);
    //if (currentDistance<=radius)
    {
        float weight = currentDistance/radius;
        weight = 1.0-intensity*(1.0-weight*weight);
        weight = clamp(weight,0.0001,1.0);
        curCoord = circleCenter+(curCoord-circleCenter)/weight;
        
    }
    return curCoord;
}

void main()
{
    if(uIntensity >= 0.5)
    {
        //this uIntensity is of postive
        gl_Position = vec4(1.0, 1.0, 1.0, 1.0);
        return;
    }

    gl_Position = vec4(position.x, position.y, 0.0, 1.0);
    vec2 x_y = vec2(_surfaceWidth,_surfaceHeight);
    vec2 curCoord = texcoord0 * x_y;
    vec2 srcPoint               = vec2(0.0);
    vec2 dstPoint               = vec2(0.0);
    int n = int(uDeformationRealStep);
    for(int i=0;i<n;i++)
    {
        srcPoint        = uDeformationStartPoint[i];
        dstPoint        = uDeformationEndPoint[i];
        if(abs(uDeformationActionType[i] - 0.0) < MIN_FLOAT)       //stretch
        {
            curCoord        = stretchFun(curCoord,srcPoint,dstPoint, uDeformationRadius[i],uDeformationIntensity[i]);
        }
        else if(abs(uDeformationActionType[i] - 1.0) < MIN_FLOAT)     //enlarge
        {
            curCoord = enlargeFun(curCoord, dstPoint, uDeformationRadius[i],uDeformationIntensity[i]);
        }
        else if(abs(uDeformationActionType[i] - 2.0) < MIN_FLOAT)    //narrow
        {
            curCoord = narrowFun(curCoord, dstPoint, uDeformationRadius[i],uDeformationIntensity[i]);
        }
    }

    //map the intensity [0  0.5] to [0 1]
    float final_intensity;
    if(uIntensity < 0.5){
        final_intensity = 0.5 - uIntensity;
        if(uIntensity > 0.1)
        {
            final_intensity *= 2.0;
        }else
        {
            float gradual = 2.0 + 20.0 * (0.1 - uIntensity);
            final_intensity *= gradual; //origin intensity x3     
        }
    }else{
        final_intensity = 0.0;
    }
    uv0 = texcoord0 + (curCoord / x_y - texcoord0) * final_intensity;

    maskCoord = texcoord1;
    origCoord = texcoord0;
}
