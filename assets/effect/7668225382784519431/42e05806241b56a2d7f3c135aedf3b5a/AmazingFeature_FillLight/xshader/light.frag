precision highp float;

uniform sampler2D inputImageTexture; // camera image
uniform sampler2D transferNormal; // predicted scene normal
uniform sampler2D transferMask;   // human mask
uniform sampler2D face_mask;  //face mask

uniform vec3 lightingDir_key;
uniform vec3 lightingDir_fill;
uniform vec3 lightingDir_back;

uniform vec3 highlight_color_key;
uniform vec3 highlight_color_fill;
uniform vec3 highlight_color_back;

uniform vec3 intensity;
uniform float shiness;
uniform float light_intensity;
varying highp vec2 textureCoordinate;

void main()
{

    vec4 colorCamera = texture2D(inputImageTexture, textureCoordinate).rgba;
    vec3 normal = texture2D(transferNormal, textureCoordinate).rgb;
    float mask = texture2D(transferMask, vec2(textureCoordinate.x, 1.0 - textureCoordinate.y)).a;
    float facemask = texture2D(face_mask, textureCoordinate).r;

    normal = (normal * 2.0) - vec3(1.0, 1.0, 1.0);
    normal = normal / sqrt(normal.r*normal.r + normal.g*normal.g + normal.b*normal.b);

    float ln_dot = (normal.r * lightingDir_key.r) + (normal.g * lightingDir_key.g) + (normal.b * lightingDir_key.b);    
    ln_dot = max(ln_dot, 0.0);
    vec3 radiance1 = (highlight_color_key * 0.8 * pow(ln_dot, shiness));
    

    ln_dot = (normal.r * lightingDir_fill.r) + (normal.g * lightingDir_fill.g) + (normal.b * lightingDir_fill.b);
    ln_dot = max(ln_dot, 0.0);
    vec3 radiance2 = (highlight_color_fill * 0.8 * pow(ln_dot, shiness));
    

    ln_dot = (normal.r * lightingDir_back.r) + (normal.g * lightingDir_back.g) + (normal.b * lightingDir_back.b);
    ln_dot = max(ln_dot, 0.0);
    vec3 radiance3 = (highlight_color_back * 0.3 * pow(ln_dot, shiness));
    
    vec3 radiance = vec3( (radiance1.r * intensity.x + radiance2.r * intensity.y + radiance3.r * intensity.z),
                          (radiance1.g * intensity.x + radiance2.g * intensity.y + radiance3.g * intensity.z),
                          (radiance1.b * intensity.x + radiance2.b * intensity.y + radiance3.b * intensity.z)) + 1.0;

    gl_FragColor = mix(
        vec4(colorCamera.r, colorCamera.g, colorCamera.b, colorCamera.a), 
        vec4(colorCamera.r * radiance.r, colorCamera.g * radiance.g, colorCamera.b * radiance.b, colorCamera.a), 
        mask * facemask * light_intensity);
}