precision highp float;
varying vec2 uv;

uniform vec2 iResolution;
uniform float iTime;
uniform sampler2D inputTexture;

uniform float brightness;
uniform float brightness_mosaic;
uniform float mosaicRadius; 

float radius = 1.0;

void main()
{

    // vec4 depthInfo = texture2D(inputTexture, uv);
    vec3 lines =  texture2D(inputTexture, uv).xyz;
//    vec3 lines =  vec3(depthInfo.x);
	
    // add paticle
    float mosaicRadius_ = floor(mosaicRadius/2.)* 2.;
    vec2 mosaicCoord = floor(vec2(uv.x * iResolution.x, uv.y * iResolution.y) / mosaicRadius_) * mosaicRadius_;
    vec2 uv1 = mosaicCoord/iResolution.xy;
    // vec4 cur = texture(inputTexture, uv1);
    vec3 cur = vec3(texture2D(inputTexture, uv1).x);
    vec2 pixelOffset = (vec2(uv.x * iResolution.x, uv.y * iResolution.y) - mosaicCoord) ;
    vec2 center = vec2(mosaicRadius_ / 2.0);
    float len = length(center - pixelOffset * radius) ;
    // float circle = smoothstep(-2.0, 0.0, len - center.x) ;
    float circle = len - center.x;
    
    lines =  brightness * lines + brightness_mosaic * clamp(cur.xyz * ( 1.0- circle ),0.0,1.0);

    // float t_mask = depthInfo.a;
    // float curD = depthInfo.y;
    // float render_region = depthInfo.x;
    // gl_FragColor = vec4(lines.x, curD, render_region, t_mask);

    gl_FragColor = vec4(lines, 1.0);
}
