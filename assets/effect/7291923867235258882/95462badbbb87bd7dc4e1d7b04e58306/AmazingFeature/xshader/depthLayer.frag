precision highp float;
varying vec2 uv;

uniform vec2 iResolution;
uniform float iTime;
uniform sampler2D inputTexture;
uniform sampler2D depthTexture;

uniform float dir;
uniform float speed;
uniform float width;
uniform float color;

float blur_ori = 3.0;
const float round_step = 1.0;
const vec3  RGB2GRAY_VEC3 = vec3(0.299, 0.587, 0.114);
const float ASCIIS_WIDTH = 8.0;
const float ASCIIS_HEIGHT = 3.0;
const float GARY_LEVEL = 24.0;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main()
{
    vec3 col = vec3(0.);

    vec3 heightmap = texture2D(depthTexture, vec2(uv.x, 1.0 - uv.y)).rrr;
    if (dir > 0.5){
        heightmap = vec3(1.0) - heightmap;
    }
    float cur_depth = heightmap.x;
    heightmap = vec3(cur_depth);
    float t = mod( iTime * speed, 10.0)/10.0;
	float width_ = width;
	heightmap = heightmap*0.7 + width_;
    vec3 depth_mask1 = smoothstep(t  , t  + width_  , heightmap );
    float cut = 0.5;
    vec3 depth_border1 = smoothstep(0., cut, depth_mask1) - smoothstep(cut, 1.0, depth_mask1);
    vec3 depth_border = clamp(depth_border1 , 0.0, 1.0);

    vec3 color_rgb = vec3(1.0);
    if (color < 0.98){
        color_rgb = hsv2rgb(vec3(color,1.0,1.0));
    }

    vec4 oriRGBA = texture2D(inputTexture, uv);
    float colorInfo = dot(RGB2GRAY_VEC3, oriRGBA.rgb);
	gl_FragColor = vec4( color_rgb * depth_border.xxx, 1.0);
}
