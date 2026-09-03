precision highp float;
precision highp int;

uniform mediump sampler2D inputTexture;
uniform mediump sampler2D lightTexture;
uniform float light_transferMode;

varying vec2 uv0;

void main()
{
    mediump vec4 _19 = texture2D(inputTexture, uv0);
    mediump vec4 _24 = texture2D(lightTexture, uv0);
    if (light_transferMode < 0.5)
    {
        gl_FragData[0] = _24;
    }
    else
    {
        if (light_transferMode < 1.5)
        {
            gl_FragData[0] = _24 + _19;
        }
        else
        {
            if (light_transferMode < 2.5)
            {
                gl_FragData[0] = max(_24, _19);
            }
            else
            {
                if (light_transferMode < 3.5)
                {
                    gl_FragData[0] = vec4(1.0) - ((vec4(1.0) - _24) * (vec4(1.0) - _19));
                }
                else
                {
                    gl_FragData[0] = _24;
                }
            }
        }
    }
}

