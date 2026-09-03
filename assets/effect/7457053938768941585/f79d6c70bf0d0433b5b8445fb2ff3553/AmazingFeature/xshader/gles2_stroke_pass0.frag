precision highp float;
varying vec2 v_texcoord;
varying vec4 v_opacity;
uniform float colorA;
uniform float hardness;
uniform float strokeSize;
uniform int brushMode;

void main()
{
    float dist = distance(v_texcoord, vec2(0.5));
    // feather version 1.0
    float shapeMask = 1.0 - smoothstep(0.5 * hardness - 3.0 / strokeSize, 0.5, dist);
    
    vec4 v_opacity_old = vec4(0.4, 0., 0., 0.);
    
    gl_FragColor = v_opacity_old * (shapeMask * colorA);
    
}
