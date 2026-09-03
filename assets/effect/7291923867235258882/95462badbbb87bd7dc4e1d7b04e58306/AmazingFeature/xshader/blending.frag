precision highp float;
varying vec2 uv;

uniform vec2 iResolution;
uniform float iTime;
uniform sampler2D inputTexture1_in1;
uniform sampler2D inputTexture1_in2;
uniform sampler2D depthTexture;

uniform sampler2D inputTexture2;
uniform sampler2D filterTexture;
uniform sampler2D blurTexture;

uniform float easyOut_ratio;

uniform float scan_glow_shiness;
uniform float filter_alpha;
uniform float brightness;
uniform float brightness_mosaic;
uniform float mosaicRadius; 

uniform float amp; 
uniform float color_amp; 
uniform float width;

uniform float color;

float radius = 1.0;
int blur_rate = 15;

uniform float speed;

const vec3  RGB2GRAY_VEC3 = vec3(0.299, 0.587, 0.114);

float Gaussian(float sigma, float x)
{
	return exp(-(x*x) / (2.0 * sigma*sigma));
}

vec3 Gaussian_BlurredPixel(in vec2 uv,in int blurSize, in sampler2D Texture)
{
	int  c_samplesX    = blurSize;  // must be odd
	int  c_samplesY    = blurSize;  // must be odd
	float c_textureSize = 512.0;
	int   c_halfSamplesX = c_samplesX / 2;
	int   c_halfSamplesY = c_samplesY / 2;
	float c_pixelSize = (1.0 / c_textureSize);
	
	float c_sigmaX      =  5.0;
	float c_sigmaY      =  c_sigmaX;
	float total = 0.0;
	vec3 ret = vec3(0);
		
	for (int iy = 0; iy < c_samplesY; ++iy)
	{
		float fy = Gaussian(c_sigmaY, float(iy) - float(c_halfSamplesY));
		float offsety = float(iy-c_halfSamplesY) * c_pixelSize;
		for (int ix = 0; ix < c_samplesX; ++ix)
		{
			float fx = Gaussian(c_sigmaX, float(ix) - float(c_halfSamplesX));
			float offsetx = float(ix-c_halfSamplesX) * c_pixelSize;
			total += fx * fy;            
			ret += texture2D(Texture, uv + vec2(offsetx, offsety)).rgb * fx*fy;
		}
	}
	return ret / total;
}

vec3 Box_BlurredPixel (in vec2 uv,in float blurSize, in sampler2D Texture)
{
	// const float blurSize = 35.0;
    int range = int(floor(blurSize/2.0));
    vec4 colors = vec4(0);
    for (int x = -range; x <= range; x++) {
        for (int y = -range; y <= range; y++) {
            vec4 color = texture2D(Texture, uv+vec2(float(x)/iResolution.x,
                                                             float(y)/iResolution.y));
            colors += color;
        }
    }
    vec4 finalColor = colors/pow(blurSize,2.);
    return  finalColor.xyz;
}

float Random(float n,float factor ){
   return fract(sin(n)*factor)*fract(cos(n)*factor);
}

vec3 rgb2hsv(vec3 c) {
	float cMax=max(max(c.r,c.g),c.b),
	      cMin=min(min(c.r,c.g),c.b),
	      delta=cMax-cMin;
	vec3 hsv=vec3(0.,0.,cMax);
	if(cMax>cMin){
		hsv.y=delta/cMax;
		if(c.r==cMax){
			hsv.x=(c.g-c.b)/delta;
		}else if(c.g==cMax){
			hsv.x=2.+(c.b-c.r)/delta;
		}else{
			hsv.x=4.+(c.r-c.g)/delta;
		}
		hsv.x=fract(hsv.x/6.);
	}
	return hsv;
}


vec4 lm_take_effect_filter(sampler2D filterTex,vec4 inputColor,float uniAlpha)
{
  highp vec4 textureColor= inputColor;	//texture2D(inputTex,textureCoordinate);
  highp float blueColor=textureColor.b*63.;
  
  highp vec2 quad1;
  quad1.y=floor(floor(blueColor)/8.);
  quad1.x=floor(blueColor)-(quad1.y*8.);
  
  highp vec2 quad2;
  quad2.y=floor(ceil(blueColor)/8.);
  quad2.x=ceil(blueColor)-(quad2.y*8.);
  
  highp vec2 texPos1;
  texPos1.x=(quad1.x*1./8.)+.5/512.+((1./8.-1./512.)*textureColor.r);
  texPos1.y=(quad1.y*1./8.)+.5/512.+((1./8.-1./512.)*textureColor.g);
  
  highp vec2 texPos2;
  texPos2.x=(quad2.x*1./8.)+.5/512.+((1./8.-1./512.)*textureColor.r);
  texPos2.y=(quad2.y*1./8.)+.5/512.+((1./8.-1./512.)*textureColor.g);
  
  vec4 newColor1=texture2D(filterTex,texPos1);
  vec4 newColor2=texture2D(filterTex,texPos2);
  vec4 newColor=mix(newColor1,newColor2,fract(blueColor));
  newColor = mix(textureColor,vec4(newColor.rgb,textureColor.w),uniAlpha);

  return newColor;
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main()
{

    // depth scan
    vec3 heightmap = texture2D(depthTexture, vec2(uv.x, 1.0 - uv.y)).rrr;
    heightmap = vec3(1.0) - heightmap;
    float cur_depth = heightmap.x;
    heightmap = vec3(cur_depth);
    float t = mod( iTime * speed, 10.0)/10.0;
	float width_ = width;
	heightmap = heightmap*0.7 + width_;
    float depth_mask1 = smoothstep(t  , t  + width_  , heightmap ).x;
    float cut = 0.5;
    float depth_border1 = smoothstep(0., cut, depth_mask1) - smoothstep(cut, 1.0, depth_mask1);
    float depth_border = clamp(depth_border1 , 0.0, 1.0);
    vec4 depthInfo = vec4(0.0, heightmap.x, depth_border, depth_mask1);

    // depth shake
    // vec4 depthInfo = texture2D(inputTexture2, uv);
    float curD = depthInfo.y;
    depth_border = depthInfo.z;
    float depth_shake = (curD + 0.2)/1.2;

    // control range of depth shake
    width_ = 0.5;
    float depth_mask2 = smoothstep(t-0.4*2.0*width_  , t  + 0.6*2.0*width_  , curD);
    float scan_gradient  = smoothstep(0., cut, depth_mask2) - smoothstep(cut, 1.0, depth_mask2);
    scan_gradient   = clamp(scan_gradient , 0.0, 1.0);

    vec2 d_shift = 4.0* vec2(depth_shake, -depth_shake)* amp* scan_gradient;
    vec4 ori_img1 = texture2D(inputTexture1_in1, uv + d_shift);
    vec4 ori_img2 = texture2D(inputTexture1_in2, uv + d_shift);

    // filter for AB image
    vec3 filter_im1 = lm_take_effect_filter(filterTexture,ori_img1,filter_alpha).xyz;
    vec3 filter_im2 = lm_take_effect_filter(filterTexture,ori_img2,filter_alpha).xyz;
    float w = depthInfo.a;
    vec3 trans_12 = mix(filter_im1, filter_im2, w);

    // blue and glow
	vec3 lines = texture2D(inputTexture2, uv).xyz + scan_glow_shiness * texture2D(blurTexture, uv).xyz;
    vec3 blueTmp = rgb2hsv(lines);
    blueTmp =  hsv2rgb(vec3(blueTmp.r+4.0/360.0, blueTmp.g+0.22, blueTmp.b));
    lines = 1.6* blueTmp; 

    // RGB distortion for blue light
    float ce = 0.6;
    vec2 c_shift = 2.0* vec2(depth_shake, -depth_shake)* abs(color_amp)* scan_gradient;
    lines.r = 0.2*(texture2D(inputTexture2, uv+ ce* 1.0*c_shift).b + scan_glow_shiness * texture2D(blurTexture, uv+ ce* 1.0*c_shift).b);
    float oriB = (texture2D(inputTexture2,  uv+ ce* 1.5*c_shift).b + scan_glow_shiness * texture2D(blurTexture, uv+ ce* 1.5*c_shift).b);
    lines.g = mix(lines.g, oriB, 0.2);

    // blend: ADD
    vec3 col1 = trans_12 + 1.2*lines;
    float blue_mask = lines.r + lines.g + lines.b;
	gl_FragColor = vec4(col1, blue_mask); 

    // // debug，
	// gl_FragColor = vec4(col1, 1.0); 
    // vec3 blurCol = texture2D(inputTexture2, uv).xyz + scan_glow_shiness * texture2D(blurTexture, uv).xyz;
    // blueTmp = rgb2hsv(blurCol);
    // blueTmp =  hsv2rgb(vec3(blueTmp.r+4.0/360.0, blueTmp.g+0.22, blueTmp.b));
    // blurCol = 1.6* blueTmp;
    // gl_FragColor = vec4(1.5*blurCol, 1.0);
    // gl_FragColor = vec4(trans_12, 1.0);
}
