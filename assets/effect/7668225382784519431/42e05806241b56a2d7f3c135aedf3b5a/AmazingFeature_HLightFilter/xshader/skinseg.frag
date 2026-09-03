precision highp float;

uniform sampler2D inputTexture;
uniform sampler2D ganTexture;
uniform sampler2D filterBgTexture;
uniform sampler2D filterSkinTexture;
uniform float reflector;

varying vec2 texcoord1;

uniform float intensity;

void main() {
    highp vec4 textureColor1 = texture2D(inputTexture, texcoord1);
    textureColor1 = clamp(textureColor1, 0.0, 1.0);
    
    highp float blueColor = textureColor1.b * 63.0;
    
    highp vec2 quad1;
    quad1.y = floor(floor(blueColor) / 8.0);
    quad1.x = floor(blueColor) - (quad1.y * 8.0);

    highp vec2 texPos1 = (quad1.xy * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor1.rg);

    lowp vec4 newColor12 = texture2D(filterBgTexture, texPos1);
    lowp vec4 newColor22 = texture2D(filterSkinTexture, texPos1);

    vec2 maskCoord = vec2(texcoord1.x, 1.0 - texcoord1.y);
    float mask = texture2D(ganTexture, maskCoord).a;

    vec4 final = mix(newColor12.rgba, newColor22.rgba, mask);

    gl_FragColor = vec4(mix(textureColor1.rgb, final.rgb, intensity), textureColor1.a); 

    // gl_FragColor = vec4(mask, 0.0, 0.0, 1.0);
}
