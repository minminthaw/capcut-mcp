#version 300 es
precision highp float;
layout(location = 0) out vec4 FragColor;

in vec2 uv0;
uniform sampler2D u_FBOTexture;

in vec2 maskCoord;
in vec2 origCoord;
uniform sampler2D maskTexture;

void main(void)
{
    vec4 maskColor = texture(maskTexture, maskCoord);
    vec2 coord = mix(origCoord, uv0, maskColor.r);
    coord =  mix(origCoord, coord, step(0.5, maskCoord.x));  
    FragColor = texture(u_FBOTexture, coord);
}
