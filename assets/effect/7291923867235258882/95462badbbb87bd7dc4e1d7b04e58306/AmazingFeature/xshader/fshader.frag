precision highp float; 

varying highp vec2 textureCoord;

uniform sampler2D inputTexture;
uniform sampler2D mattingTexture;

void main() {
    vec4 originColor = texture2D(inputTexture, textureCoord);
    vec4 bgColor = vec4(0.0, 1.0, 0.0, 1.0);
    
    // vec2 textureCoordinate_matting = vec2(textureCoord.x, 1.0 - textureCoord.y);
    vec4 maskColor = texture2D(mattingTexture, textureCoord);

    gl_FragColor = vec4(vec3(maskColor.rgb), 1.0);
    //gl_FragColor = vec4(maskColor.r, maskColor.r, maskColor.r, 1.0);
}