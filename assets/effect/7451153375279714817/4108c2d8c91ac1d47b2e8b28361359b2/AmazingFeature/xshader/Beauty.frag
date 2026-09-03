precision highp float;
varying vec2 uv0;
varying vec2 uv1;

uniform int uUseRT;
uniform sampler2D uHistoryStrokeTexure;
uniform sampler2D uCurrentStrokeTexture;


uniform sampler2D uInputTexture;
uniform sampler2D uExpendFaceTexture;

uniform float u_intensity;

uniform sampler2D u_highPassTex;
uniform sampler2D u_faceExtraMaskTex;
uniform sampler2D u_blurTex;
uniform float u_faceFactor;

uniform float uPhase;
uniform int brushMode;
uniform int uFlipX;

vec3 Smooth(vec4 oriColor, float intensity)
{
    vec4 highPassColor = texture2D(u_highPassTex, uv1);
    vec4 faceMask = texture2D(u_faceExtraMaskTex, uv1);
    vec4 blurColor = texture2D(u_blurTex, uv1);

    // intensity = 1.0;
    vec3 meanColor = blurColor.rgb;
    // if(u_faceFactor < 0.02)
    // {
    //     // small face
    //     const float theta = 0.3;
    //     float p = clamp((min(oriColor.r, meanColor.r - 0.1) - 0.2) * 4.0, 0.0, 1.0);
    //     p = (1.0 - highPassColor.a / (highPassColor.a + theta)) * p;
    //     intensity = intensity * p;
    // }
    
    vec3 finalColor = mix(oriColor.rgb, highPassColor.rgb, intensity * faceMask.g);
    return finalColor;
}

void main()
{    
    if(uPhase > 1.5) {
        vec4 inputColor = texture2D(uInputTexture, uv1);

        vec2 historyUV = vec2(uv0.x, uv0.y);
        if (uUseRT == 1)
        {
            historyUV = vec2(uv0.x, 1.0 - uv0.y);
        }
        if( uFlipX == 1)
        {
            historyUV = vec2(1.0 - historyUV.x, historyUV.y);
        }

        vec4 phase1Color = texture2D(uExpendFaceTexture, historyUV);
        // vec4 highPassColor = texture2D(u_highPassTex, uv1);
        // gl_FragColor = vec4(phase1Color.r * highPassColor.r, 0.0, 0.0, 1.0);

        // float intensity = phase1Color.r;
        // gl_FragColor = vec4(mix(inputColor.rgb, phase1Color.rgb, intensity), inputColor.a);
        // gl_FragColor = vec4(1.0);

        float brushIntensity = phase1Color.r;
        float intensity = clamp(u_intensity, 0.0, 1.0);
        vec3 finalColor = Smooth(inputColor, brushIntensity * intensity);
        vec4 historyColor = vec4(finalColor, inputColor.a);
        gl_FragColor = historyColor;
        
    }
    else if(uPhase > 0.5) {
        vec2 currentStrokeUv = uv1;
        if( uFlipX == 1)
        {
            currentStrokeUv = vec2(1.0 - currentStrokeUv.x, currentStrokeUv.y);
        }
        
        vec4 currentStokeColor = texture2D(uCurrentStrokeTexture, currentStrokeUv);

        vec2 historyUV = vec2(uv0.x, uv0.y);
        if (uUseRT == 1)
        {
            historyUV = vec2(uv0.x, 1.0 - uv0.y);
        }
        vec4 historyStokeColor = texture2D(uHistoryStrokeTexure,  historyUV);
        // gl_FragColor = vec4(currentStokeColor.a, 0.0, 0.0, currentStokeColor.a);

        float alpha = historyStokeColor.r;
        if (currentStokeColor.a > 0.001)
        {
            if (brushMode == 1)
            {
                alpha = 0.0;
            }
            else
            {
                // float blendAlpha = currentStokeColor.a + historyStokeColor.r - currentStokeColor.a * historyStokeColor.r;
                // alpha = clamp(blendAlpha, 0.0, 1.0);
                alpha = clamp(alpha + 0.1, 0.8, 1.0);
            }
        }
        gl_FragColor = vec4(alpha, 0.0, 0.0, 1.0);

    }
    else
    {
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    } 
    
}