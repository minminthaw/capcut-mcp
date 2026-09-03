precision highp float;

uniform sampler2D inputImageTexture;
uniform sampler2D depthTexture;
uniform sampler2D blueTex;
uniform sampler2D depth_info;
uniform sampler2D noise_Input;
uniform sampler2D faceMask;

uniform vec4 u_ScreenParams;
uniform float u_Complexity;
uniform float u_Evolution;
uniform float u_Cycle;
uniform float u_Brightness;
uniform float u_Contrast;
uniform float u_Range;

uniform vec2 u_Scale;
uniform vec2 u_Offset;
uniform float u_Rotate;
uniform float u_SubImpact;
uniform float u_SubScale;
uniform float u_SubRotate;
uniform vec2 u_SubOffset;
uniform float u_type;
uniform float u_fix_type;
uniform float motion_tile_type;

uniform float iTime;
uniform float speed;
uniform float width;

uniform float displace_easyOut_ratio;

uniform vec4 u_intensity_x;
uniform vec4 u_intensity_y;

varying vec2 uv0;
varying vec2 uvp;
varying vec2 oriuv;
varying vec2 sucaiUV;

#define PI 3.1415926
#define HASHSCALE3 vec3(.8031, .1030, .3973)
float hash21(vec2 p){
    vec2 p2 = fract(p*1324.518);
    p2+=dot(p2,p2.yx+22.541);
    return fract((p2.x+p2.y)*p2.y);
}

vec2 Mirror(vec2 x) { return abs(mod(x-1., 2.)-1.); }
float cut(vec2 u) {return step(0., u.x)*step(u.x, 1.)*step(0., u.y)*step(u.y, 1.); }

float colorAdjust(float c, float brightness, float contrast)
{
    c += brightness;
    if (contrast>0.0)
    {
        c = (c-0.5)*(contrast*10.0+1.0) + 0.5;
    }
    else
    {
        c = (c-0.5)*(contrast+1.0) + 0.5;
    }
    return c;
}

vec4 texture2Dmirror (sampler2D tex, vec2 uv) {
    uv = mod(uv, 2.0);
    uv = mix(uv, 2.0 - uv, step(vec2(1.0), uv));
    return texture2D(tex, fract(uv));
}

void main() {
    vec4 faceMCol = texture2D(faceMask, uvp);

    // depth scan
    vec3 heightmap = texture2D(depthTexture, vec2(uvp.x, 1.0 - uvp.y)).rrr;
    heightmap = vec3(1.0) - heightmap;
    float cur_depth = heightmap.x;
    heightmap = vec3(cur_depth);
    float t = mod( iTime * speed, 10.0)/10.0;
    float width_ = width;
	heightmap = heightmap*0.7 + width_;
    float curD = heightmap.x;
    float depth_mask1 = smoothstep(t-0.6*1.0* width_  , t  + 0.8*1.0 *width_  , curD);
    float cut = 0.5;
    float scan_weight  = smoothstep(0., cut, depth_mask1) - smoothstep(cut, 1.0, depth_mask1);
    scan_weight   = clamp(scan_weight , 0.0, 1.0);

    // noise as displace source
    vec4 disVal = texture2Dmirror(noise_Input, 2.0*sucaiUV);
    vec4 d_mask = disVal * 2.0 - 1.0;
    float ss = 0.05;
    float u_shift =  ss* d_mask.x;
    float v_shift = 1.0*  u_shift;
    vec2 v_uv = uv0;
    vec2 uvp = vec2(v_uv.x + u_shift, v_uv.y + v_shift);

    // displace for color distortion
    float blue_mask = texture2D(blueTex, uvp).a;
    float blue_weight = smoothstep(0., 0.2, blue_mask) - smoothstep(0.2, 0.4, blue_mask);

    // displace on blue light
    float face_protect = 1.0 - smoothstep(0.0, 0.5, faceMCol.r);
    float dis_weight = scan_weight* displace_easyOut_ratio* face_protect;
    uvp  = mix(v_uv, uvp, dis_weight); // displace after blue light
    vec4 disRGBA = texture2Dmirror(blueTex, uvp);
    // color distortion
    depth_mask1 = smoothstep(t , t  +  width_  , curD);
    scan_weight  = smoothstep(0., cut, depth_mask1) - smoothstep(cut, 1.0, depth_mask1);
    scan_weight   = clamp(scan_weight , 0.0, 1.0);

    float forward_half = step(t+0.4*width_, curD);
    float cc = 0.4;
    float cc_span = 0.4;
    float color_scatter = smoothstep(cc-cc_span, cc, scan_weight) - smoothstep(cc, cc+cc_span, scan_weight); 
    color_scatter = color_scatter* forward_half;
    float ce = 20.1;
    vec2 uv_R = mix(v_uv, v_uv + 0.1*vec2(ce*1.0* u_shift, ce*1.0*v_shift), color_scatter);
    float mR = texture2Dmirror(blueTex, uv_R).b;
    disRGBA.r = mix(disRGBA.r, mR, 0.3*color_scatter);

    vec2 uv_G = mix(v_uv, v_uv - 0.15*vec2(ce*1.0* u_shift, ce*1.0*v_shift), color_scatter);
    float mG = texture2Dmirror(blueTex, uv_G).b;
    disRGBA.g = mix(disRGBA.g, mG, 0.3*color_scatter);
    // direct output
    // gl_FragColor = vec4(disRGBA.xyz, 1.0); 

    // add blur for dis
    gl_FragColor = vec4(disRGBA.xyz, dis_weight); 

    // debug，mask
    // gl_FragColor = vec4(vec3(dis_weight), 1.0); 
    // debug, light & displacement
    // gl_FragColor = vec4(vec3(blue_mask, scan_weight, 0.0), 1.0);
    // gl_FragColor = faceMCol;
}