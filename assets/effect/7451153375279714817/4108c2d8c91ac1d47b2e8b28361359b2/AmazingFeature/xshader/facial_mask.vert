attribute vec3 attPosition;
attribute vec2 attUV;
varying vec2 texCoord;

uniform mat4 uMVPMatrix;

void main(void)
{
    gl_Position = uMVPMatrix * vec4(attPosition, 1.0);
    texCoord = attUV;
}
 