precision highp float;
varying vec2 texCoord;
#define uv0 texCoord

uniform int inputHeight;
uniform int inputWidth;

// uniform sampler2D cloud;
// uniform sampler2D hill;

uniform float progress;

uniform sampler2D inputImageTexture, inputImageTexture2;
// uniform float progress;

vec2 direction = vec2(-1.0, 0.0);

float easeInOutQuint(float t) 
{ 
    return t<0.5 ? 16.0*t*t*t*t*t : 1.0+16.0*(--t)*t*t*t*t; 
}

void main() {
    float iTime = easeInOutQuint(clamp(progress, 0.0, 1.0));
    vec2 p = uv0 + iTime*sign(direction);
    vec2 f = fract(p);
    vec4 fromTex = texture2D(inputImageTexture, f);
    vec4 toTex = texture2D(inputImageTexture2, f);
    vec3 res = mix(toTex.rgb, fromTex.rgb, step(0.0, p.y)*step(p.y, 1.0)*step(0.0, p.x)*step(p.x, 1.0));

    gl_FragColor = vec4(res, 1.0);
}

// DO_NOT_PATCH_ME