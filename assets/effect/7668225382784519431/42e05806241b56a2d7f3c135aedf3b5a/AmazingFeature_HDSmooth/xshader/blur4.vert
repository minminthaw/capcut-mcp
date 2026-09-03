precision highp float;

uniform float widthOffset;
uniform float heightOffset;

attribute vec4 a_position;
attribute vec2 a_texcoord0;

varying highp vec2 uv0;
varying highp vec2 textureShift1[4];
varying highp vec2 textureShift2[4];
varying highp vec2 textureShift3[4];


void main()
{
    gl_Position = a_position;
    uv0 = a_texcoord0;

    vec2 unit_uv = 0.45 * vec2(widthOffset, heightOffset);      // 0.45 * (1/324, 1/576) = (1/720, 1/1280)

    float scale = 0.6;
    vec2 offset = scale * unit_uv;

    // circle 1
    textureShift1[0] = offset * vec2(5, 0);
    textureShift1[1] = offset * vec2(0, 5);
    textureShift1[2] = offset * vec2(3, 4);
    textureShift1[3] = offset * vec2(4, 3);

    // circle 2
    textureShift2[0] = offset * vec2(10, 0);
    textureShift2[1] = offset * vec2(0, 10);
    textureShift2[2] = offset * vec2(6, 8);
    textureShift2[3] = offset * vec2(8, 6);

    scale = 1.0;
    offset = scale * unit_uv; 

    // circle 3
    textureShift3[0] = offset * vec2(20, 0);
    textureShift3[1] = offset * vec2(0, 20);
    textureShift3[2] = offset * vec2(12, 16);
    textureShift3[3] = offset * vec2(16, 12);
}
