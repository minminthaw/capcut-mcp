precision highp float;
varying vec2 v_texcoord;
uniform sampler2D strokeTexture;
uniform sampler2D layerTexture;
uniform vec3 colorRGB;
uniform int brushMode;

void main()
{
    vec4 simpleMask = texture2D(strokeTexture, v_texcoord);
    vec4 layerColor = texture2D(layerTexture, v_texcoord);
    
    float alpha = max(layerColor.r, simpleMask.r);
    // gl_FragColor = vec4(alpha, 0.0, 0.0, alpha);

    if ( alpha > 0.001)
    {
        if (brushMode == 1)
        {
            gl_FragColor = vec4(0.682, 0.110, 0.110, 0.2);
        }
        else
        {
            gl_FragColor = vec4(0.0, 0.757, 0.804, 0.2);

        }
    }
    else
    {
        gl_FragColor = vec4(0.0);
    }
    
}
