precision highp float;
uniform sampler2D inputTexture;
// in vec2 blurCoords[21];
varying vec2 uv;
// out vec4 fragColor;
uniform float texWOffset;
uniform float texHOffset;

uniform float thresh;

// // kernel 21
// const float gaussianKernel[11] = float[11](
//         0.135335,
//         0.197899,
//         0.278037,
//         0.375311,
//         0.486752,
//         0.606531,
//         0.726149,
//         0.835270,
//         0.923116,
//         0.980199,
//         1.000000
// 	);
// const float total = 12.089198;

// void main()
// {
//     // vec4 sum = vec4(0.0);
//     // for (int i = 0; i < 21; i++) {
//     //     sum += texture(inputTexture, blurCoords[0]) * gaussianKernel[i];
//     // }

//     vec4 sum = texture(inputTexture, uv);
//     vec2 singleOffset = vec2(texWOffset, texHOffset);

//     for (int i = 1; i < 11; i++) {
//          sum += texture(inputTexture, uv - float(i) * singleOffset) * gaussianKernel[10 - i];
//          sum += texture(inputTexture, uv + float(i) * singleOffset) * gaussianKernel[10 - i];
//     }

//     sum = sum / total;
//     fragColor = vec4(sum.rgb, 1.0);
// }


// // kernel 15
// const float gaussianKernel[8] = float[8](
//         0.375311,
//         0.486752,
//         0.606530,
//         0.726149,
//         0.835270,
//         0.923116,
//         0.980198,
//         1.000000
// 	);
// const float total = 10.866652;

// void main()
// {
//     // vec4 sum = vec4(0.0);
//     // for (int i = 0; i < 21; i++) {
//     //     sum += texture(inputTexture, blurCoords[0]) * gaussianKernel[i];
//     // }

//     vec4 sum = texture(inputTexture, uv);
//     vec2 singleOffset = vec2(texWOffset, texHOffset);

//     for (int i = 1; i < 8; i++) {
//          sum += texture(inputTexture, uv - float(i) * singleOffset) * gaussianKernel[7 - i];
//          sum += texture(inputTexture, uv + float(i) * singleOffset) * gaussianKernel[7 - i];
//     }

//     sum = sum / total;
//     fragColor = vec4(sum.rgb, 1.0);
// }


// // kernel 11
// const float gaussianKernel[6] = float[6](
//         0.606530,
//         0.726149,
//         0.835270,
//         0.923116,
//         0.980198,
//         1.000000
// 	);
// const float total = 9.142526;

// void main()
// {
//     // vec4 sum = vec4(0.0);
//     // for (int i = 0; i < 21; i++) {
//     //     sum += texture(inputTexture, blurCoords[0]) * gaussianKernel[i];
//     // }

//     vec4 sum = texture(inputTexture, uv);
//     vec2 singleOffset = vec2(texWOffset, texHOffset);

//     for (int i = 1; i < 6; i++) {
//          sum += texture(inputTexture, uv - float(i) * singleOffset) * gaussianKernel[5 - i];
//          sum += texture(inputTexture, uv + float(i) * singleOffset) * gaussianKernel[5 - i];
//     }

//     sum = sum / total;
//     fragColor = vec4(sum.rgb, 1.0);
// }


// // kernel 9
// const float gaussianKernel[5] = float[5](
//         0.726149,
//         0.835270,
//         0.923116,
//         0.980198,
//         1.000000
// 	);
// const float total = 7.929466;

// void main()
// {
//     // vec4 sum = vec4(0.0);
//     // for (int i = 0; i < 21; i++) {
//     //     sum += texture(inputTexture, blurCoords[0]) * gaussianKernel[i];
//     // }

//     vec4 sum = texture(inputTexture, uv);
//     vec2 singleOffset = vec2(texWOffset, texHOffset);

//     for (int i = 1; i < 5; i++) {
//          sum += texture(inputTexture, uv - float(i) * singleOffset) * gaussianKernel[4 - i];
//          sum += texture(inputTexture, uv + float(i) * singleOffset) * gaussianKernel[4 - i];
//     }

//     sum = sum / total;
//     fragColor = vec4(sum.rgb, 1.0);
// }


// kernel 7
// float gaussianKernel[4] = {0.835270, 0.923116, 0.980198, 1.000000};
const float total = 6.477168;
const vec3  RGB2GRAY_VEC3 = vec3(0.299, 0.587, 0.114);

void main() {
    // vec4 sum = vec4(0.0);
    // for (int i = 0; i < 21; i++) {
    //     sum += texture(inputTexture, blurCoords[0]) * gaussianKernel[i];
    // }

    float gaussianKernel[11];   
    gaussianKernel[0] = 0.0111;
    gaussianKernel[1] = 0.0163;
    gaussianKernel[2] = 0.0230;
    gaussianKernel[3] = 0.031;
    gaussianKernel[4] = 0.040;
    gaussianKernel[5] = 0.050;
    gaussianKernel[6] = 0.060;
    gaussianKernel[7] = 0.069;
    gaussianKernel[8] = 0.076;
    gaussianKernel[9] = 0.0811;
    gaussianKernel[10] = 0.0827;

    vec4 sum = texture2D(inputTexture, uv);
    float thresh_mask = dot(sum.rgb, RGB2GRAY_VEC3);
    vec2 singleOffset = vec2(texWOffset, texHOffset);

    for (int i = 1; i < 11; i++) {
         sum += texture2D(inputTexture, uv - float(i) * singleOffset) * gaussianKernel[10 - i];
         sum += texture2D(inputTexture, uv + float(i) * singleOffset) * gaussianKernel[10 - i];
    }

    // sum = sum / total;
    // sum = sum* smoothstep(0.0, thresh, thresh_mask);
    sum = sum* smoothstep(thresh-0.5, thresh, thresh_mask);
    gl_FragColor = vec4(sum.rgb, 1.0);
}

// void main()
// {
//     // vec4 sum = vec4(0.0);
//     // for (int i = 0; i < 21; i++) {
//     //     sum += texture(inputTexture, blurCoords[0]) * gaussianKernel[i];
//     // }
//     float gaussianKernel[4];   
//     gaussianKernel[0] = 0.835270;
//     gaussianKernel[1] = 0.923116;
//     gaussianKernel[2] = 0.980198;
//     gaussianKernel[3] = 1.000000;

//     vec4 sum = texture2D(inputTexture, uv);
//     float thresh_mask = dot(sum.rgb, RGB2GRAY_VEC3);
//     vec2 singleOffset = vec2(texWOffset, texHOffset);

//     for (int i = 1; i < 4; i++) {
//          sum += texture2D(inputTexture, uv - float(i) * singleOffset) * gaussianKernel[3 - i];
//          sum += texture2D(inputTexture, uv + float(i) * singleOffset) * gaussianKernel[3 - i];
//     }

//     sum = sum / total;
//     // sum = sum* smoothstep(0.0, thresh, thresh_mask);
//     // sum = sum* smoothstep(thresh-0.2, thresh, thresh_mask);
//     gl_FragColor = vec4(sum.rgb, 1.0);
// }

// // kernel 5
// const float gaussianKernel[3] = float[3](
//         0.923116,
//         0.980198,
//         1.000000
// 	);
// const float total = 4.806628;

// void main()
// {
//     // vec4 sum = vec4(0.0);
//     // for (int i = 0; i < 21; i++) {
//     //     sum += texture(inputTexture, blurCoords[0]) * gaussianKernel[i];
//     // }

//     vec4 sum = texture(inputTexture, uv);
//     vec2 singleOffset = vec2(texWOffset, texHOffset);

//     for (int i = 1; i < 3; i++) {
//          sum += texture(inputTexture, uv - float(i) * singleOffset) * gaussianKernel[2 - i];
//          sum += texture(inputTexture, uv + float(i) * singleOffset) * gaussianKernel[2 - i];
//     }

//     sum = sum / total;
//     fragColor = vec4(sum.rgb, 1.0);
// }
