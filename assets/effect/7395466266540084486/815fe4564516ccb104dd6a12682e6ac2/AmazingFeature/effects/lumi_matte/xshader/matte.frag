precision highp float;
varying highp vec2 uv0;
uniform sampler2D u_InputTexture;
uniform sampler2D u_MaskTexture;
uniform int u_MatteMode;

float getLuminosity(vec3 color)
{
    return dot(color, vec3(0.299, 0.587, 0.114));
}

void main()
{
    vec4 inputColor = texture2D(u_InputTexture, uv0);
    vec4 maskColor = texture2D(u_MaskTexture, uv0);

    float factor = maskColor.a;
    if (u_MatteMode == 1)
    {
        factor = getLuminosity(maskColor.rgb);
    }
    else if (u_MatteMode == 2)
    {
        factor = 1.0 - maskColor.a;
    }
    else if (u_MatteMode == 3)
    {
        factor = 1.0 - getLuminosity(maskColor.rgb);
    }

    gl_FragColor = inputColor*factor;
}
