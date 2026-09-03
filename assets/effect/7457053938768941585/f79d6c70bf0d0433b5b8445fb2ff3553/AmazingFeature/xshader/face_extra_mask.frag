precision mediump float;

varying vec2 uv;

varying vec2 uv0;
varying vec2 uv1;
varying vec2 uv2;
varying vec2 uv3;
varying vec2 uv4;

uniform sampler2D u_maskTexture0;
uniform sampler2D u_maskTexture1;
uniform sampler2D u_maskTexture2;
uniform sampler2D u_maskTexture3;
uniform sampler2D u_maskTexture4;

void main()
{
    vec4 mask0 = texture2D(u_maskTexture0, uv0);
    vec4 mask1 = texture2D(u_maskTexture1, uv1);
    vec4 mask2 = texture2D(u_maskTexture2, uv2);
    vec4 mask3 = texture2D(u_maskTexture3, uv3);
    vec4 mask4 = texture2D(u_maskTexture4, uv4);

    float r0 = mask0.r;
    float r1 = mask1.r;
    float r2 = mask2.r;
    float r3 = mask3.r;
    float r4 = mask4.r;

    if (clamp(uv0, 0.0, 1.0) != uv0)
    {
        r0 = 0.0;
    }

    if (clamp(uv1, 0.0, 1.0) != uv1)
    {
        r1 = 0.0;
    }

    if (clamp(uv2, 0.0, 1.0) != uv2)
    {
        r2 = 0.0;
    }

    if (clamp(uv3, 0.0, 1.0) != uv3)
    {
        r3 = 0.0;
    }

    if (clamp(uv4, 0.0, 1.0) != uv4)
    {
        r4 = 0.0;
    }

    float weight = max(r0, max(r1, max(r2, max(r3, r4))));

    gl_FragColor = vec4(weight, 0, 0, 1.0);
}
