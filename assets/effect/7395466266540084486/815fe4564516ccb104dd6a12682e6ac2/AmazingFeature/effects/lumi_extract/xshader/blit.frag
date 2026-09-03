precision lowp float;
varying highp vec2 uv0;
uniform sampler2D u_InputTexture;
uniform float u_BlackField;
uniform float u_BlackSoft;
uniform float u_WhiteField;
uniform float u_WhiteSoft;
uniform float u_Reverse;

highp vec3 grayFactor = vec3(76.5/255.0, 150.0/255.0, 28.5/255.0);
float remap01(float a, float b, float x)
{
    float res = (x-a)/(b-a + 0.00001);
    return clamp(res, 0., 1.);
}

void main()
{
    vec4 oriColor = texture2D(u_InputTexture, uv0);
    oriColor.rgb = oriColor.rgb / (oriColor.a+0.0001);

    float gray = dot(oriColor.rgb, grayFactor);
    highp float mask = remap01(u_BlackField - u_BlackSoft, u_BlackField, gray) * (1. - remap01(u_WhiteField, u_WhiteField + u_WhiteSoft, gray));
    mask = abs(u_Reverse-mask);
    gl_FragColor = oriColor * mask;
    // gl_FragColor = vec4(mask);
}
