#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int hasBgTex;
    float4 u_ScreenParams;
    float2 bgTextureSize;
    float sourceOpacity;
    float bgBrightness;
    float3 GlowColor;
    float brightness;
    float glowUnderSource;
    float lightBackground;
    int combine;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_uv [[user(locn0)]];
};

static inline __attribute__((always_inline))
float _f0(thread const float2& _p0)
{
    return ((step(0.0, _p0.x) * step(_p0.x, 1.0)) * step(0.0, _p0.y)) * step(_p0.y, 1.0);
}

static inline __attribute__((always_inline))
float2 _f1(thread const float4& _p0)
{
    return float2(_p0.x + (_p0.y / 255.0), _p0.z + (_p0.w / 255.0));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> inputTexture [[texture(0)]], texture2d<float> bgTexture [[texture(1)]], texture2d<float> blurTexture1 [[texture(2)]], texture2d<float> blurTexture2 [[texture(3)]], sampler inputTextureSmplr [[sampler(0)]], sampler bgTextureSmplr [[sampler(1)]], sampler blurTexture1Smplr [[sampler(2)]], sampler blurTexture2Smplr [[sampler(3)]])
{
    main0_out out = {};
    float4 _73 = inputTexture.sample(inputTextureSmplr, in.v_uv);
    float4 _t2 = _73;
    float4 _t3 = float4(0.0, 0.0, 0.0, _t2.w);
    if (buffer.hasBgTex > 0)
    {
        float2 _t4 = in.v_uv;
        _t4.y = 1.0 - _t4.y;
        _t4 -= float2(0.5);
        _t4.x *= (buffer.u_ScreenParams.x / buffer.bgTextureSize.x);
        _t4.y *= (buffer.u_ScreenParams.y / buffer.bgTextureSize.y);
        float2 _120 = _t4;
        float2 _122 = _120 + float2(0.5);
        _t4 = _122;
        float2 param = _122;
        _t3 = bgTexture.sample(bgTextureSmplr, _122) * _f0(param);
    }
    float4 _135 = float4(buffer.sourceOpacity);
    _t3 = mix(_t3, _73, _135) * buffer.bgBrightness;
    float4 param_1 = blurTexture1.sample(blurTexture1Smplr, in.v_uv);
    float4 param_2 = blurTexture2.sample(blurTexture2Smplr, in.v_uv);
    float4 _158 = float4(_f1(param_1), _f1(param_2));
    float4 _t5 = _158;
    float3 _165 = _158.xyz * buffer.GlowColor;
    _t5.x = _165.x;
    _t5.y = _165.y;
    _t5.z = _165.z;
    float4 _174 = _t5;
    float4 _175 = _174 * buffer.brightness;
    _t5 = _175;
    float4 _192 = mix(_175, mix(_175, _73, _135), float4(buffer.glowUnderSource)) * (1.0 - buffer.lightBackground);
    float4 _t6 = _192;
    _t3 = fast::clamp(_t3, float4(0.0), float4(1.0));
    float4 _t8 = _73;
    if (buffer.combine == 1)
    {
        float3 _219 = _192.xyz + _t3.xyz;
        _t8.x = _219.x;
        _t8.y = _219.y;
        _t8.z = _219.z;
    }
    else
    {
        if (buffer.combine == 2)
        {
            float3 _236 = _t3.xyz * _192.xyz;
            _t8.x = _236.x;
            _t8.y = _236.y;
            _t8.z = _236.z;
        }
        else
        {
            if (buffer.combine == 3)
            {
                float3 _254 = abs(_192.xyz - _t3.xyz);
                _t8.x = _254.x;
                _t8.y = _254.y;
                _t8.z = _254.z;
            }
            else
            {
                if (buffer.combine == 4)
                {
                    float _270;
                    if (_t3.x < 0.5)
                    {
                        _270 = (2.0 * _t3.x) * _t6.x;
                    }
                    else
                    {
                        _270 = 1.0 - ((2.0 * (1.0 - _t3.x)) * (1.0 - _t6.x));
                    }
                    float _294;
                    if (_t3.y < 0.5)
                    {
                        _294 = (2.0 * _t3.y) * _t6.y;
                    }
                    else
                    {
                        _294 = 1.0 - ((2.0 * (1.0 - _t3.y)) * (1.0 - _t6.y));
                    }
                    float _317;
                    if (_t3.z < 0.5)
                    {
                        _317 = (2.0 * _t3.z) * _t6.z;
                    }
                    else
                    {
                        _317 = 1.0 - ((2.0 * (1.0 - _t3.z)) * (1.0 - _t6.z));
                    }
                    float3 _337 = float3(_270, _294, _317);
                    _t8.x = _337.x;
                    _t8.y = _337.y;
                    _t8.z = _337.z;
                }
                else
                {
                    float3 _355 = float3(1.0) - ((float3(1.0) - _t3.xyz) * (float3(1.0) - _192.xyz));
                    _t8.x = _355.x;
                    _t8.y = _355.y;
                    _t8.z = _355.z;
                }
            }
        }
    }
    _t8.w = _t5.w + ((1.0 - _t5.w) * _t2.w);
    out.o_fragColor = _t8;
    return out;
}

