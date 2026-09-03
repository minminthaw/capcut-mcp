precision highp float;

attribute vec4 a_position;
attribute vec2 a_texcoord0;

uniform float texelWidthOffset;
uniform float texelHeightOffset;

varying vec2 blurCoordinates[15];

void main()
{
    gl_Position = a_position;
    
    vec2 singleStepOffset = vec2(texelWidthOffset, texelHeightOffset);
    blurCoordinates[0] = a_texcoord0;
    blurCoordinates[1] = a_texcoord0.xy + singleStepOffset * 1.489585;
    blurCoordinates[2] = a_texcoord0.xy - singleStepOffset * 1.489585;
    blurCoordinates[3] = a_texcoord0.xy + singleStepOffset * 3.475713;
    blurCoordinates[4] = a_texcoord0.xy - singleStepOffset * 3.475713;
    blurCoordinates[5] = a_texcoord0.xy + singleStepOffset * 5.461879;
    blurCoordinates[6] = a_texcoord0.xy - singleStepOffset * 5.461879;
    blurCoordinates[7] = a_texcoord0.xy + singleStepOffset * 7.448104;
    blurCoordinates[8] = a_texcoord0.xy - singleStepOffset * 7.448104;
    blurCoordinates[9] = a_texcoord0.xy + singleStepOffset * 9.434408;
    blurCoordinates[10] = a_texcoord0.xy - singleStepOffset * 9.434408;
    blurCoordinates[11] = a_texcoord0.xy + singleStepOffset * 11.420812;
    blurCoordinates[12] = a_texcoord0.xy - singleStepOffset * 11.420812;
    blurCoordinates[13] = a_texcoord0.xy + singleStepOffset * 13.407332;
    blurCoordinates[14] = a_texcoord0.xy - singleStepOffset * 13.407332;
}
