precision highp float;

attribute vec3 attPosition;
attribute vec2 attUV;

varying vec2 uv0;
varying vec2 uvp;
varying vec2 oriuv;
varying vec2 sucaiUV;

uniform float picture_scale;
uniform vec4 u_ScreenParams;
uniform float iTime;

mat2 rot2(float angle){
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c,-s,s,c);
}

vec2 rotUV(vec2 uv,float angle){
    vec2 tempUV = uv-0.5;
    tempUV/=1.3;
    tempUV*=rot2(angle);
    return tempUV+0.5;
}

void main() {

    // for texture
    vec2 uv = attUV;
    vec2 baseTextureSize=vec2(u_ScreenParams.xy);
    vec2 sucaiSize=vec2(1000,1000);
    vec2 fullBlendAnchor=baseTextureSize*.5;
    float scale=1.;
    float baseAspectRatio=baseTextureSize.y/baseTextureSize.x;
    float blendAspectRatio=sucaiSize.y/sucaiSize.x;
    if(baseAspectRatio>=blendAspectRatio){
        scale=baseTextureSize.y/sucaiSize.y;
    }else{
        scale=baseTextureSize.x/sucaiSize.x;
    }
    vec2 baseTextureCoord=uv*baseTextureSize;
    vec2 tempSucaiUV=(baseTextureCoord-fullBlendAnchor)/(sucaiSize*scale)+vec2(.5);
    tempSucaiUV.y = 1.0-tempSucaiUV.y;
    tempSucaiUV = rotUV(tempSucaiUV, 3.0*iTime*0.785);
    sucaiUV = tempSucaiUV;


    uv0 = attUV.xy;
    uv0 -= 0.5;
    uv0 /= picture_scale;
    uv0 += 0.5;

    uvp = attUV;
    oriuv = attUV;
    gl_Position = vec4(attPosition,1.0);
}
