#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int u_inverseGammaCorrection;
    float u_gamma;
    float u_intensity;
    int u_blurType;
    float2 u_center;
    float u_quality;
    float u_sampleScale;
    float u_sampleBias;
    float u_weightDecay;
    float u_normalizationSample;
    float u_dither;
    int u_borderType;
    int u_blurAlpha;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(locn0)]];
};

static inline __attribute__((always_inline))
float4 _f1(texture2d<float> _p0, sampler _p0Smplr, thread const float2& _p1, constant int& u_inverseGammaCorrection, constant float& u_gamma)
{
    float4 _t0 = _p0.sample(_p0Smplr, _p1);
    if (u_inverseGammaCorrection == 1)
    {
        float4 _68 = _t0;
        float3 _74 = pow(_68.xyz, float3(u_gamma));
        _t0.x = _74.x;
        _t0.y = _74.y;
        _t0.z = _74.z;
    }
    return _t0;
}

static inline __attribute__((always_inline))
float _f2(thread const float& _p0, thread float& _p1, thread const float& _p2, thread const float& _p3)
{
    _p1 = sign(_p1) * ((0.89999997615814208984375 * abs(_p1)) + 0.100000001490116119384765625);
    return ((_p2 * _p0) * _p1) + _p3;
}

static inline __attribute__((always_inline))
float _f3(thread const float& _p0, thread const float& _p1, thread const float& _p2)
{
    return pow(pow(_p0, _p1), 1.0 / _p2);
}

static inline __attribute__((always_inline))
float _f4(thread const float2& _p0)
{
    float2 _119 = fract(_p0 * 13.5170001983642578125);
    float2 _t1 = _119 + float2(dot(_119, _119.yx + float2(22.5410003662109375)));
    return fract((_t1.x + _t1.y) * _t1.y);
}

static inline __attribute__((always_inline))
float _f0(thread float& _p0)
{
    _p0 = abs(_p0);
    return abs((floor(ceil(_p0) / 2.0) * 2.0) - _p0);
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float _t2 = buffer.u_intensity;
    bool _147 = buffer.u_blurType == 2;
    if (_147)
    {
        _t2 *= 0.5;
    }
    float2 param = in.uv0;
    float4 _159 = _f1(u_inputTexture, u_inputTextureSmplr, param, buffer.u_inverseGammaCorrection, buffer.u_gamma);
    float4 _t3 = _159;
    float _t4 = 1.0;
    float _t5 = 1.0;
    float4 _t6 = _159 * 1.0;
    float2 _t7 = in.uv0;
    float2 _176 = (in.uv0 - buffer.u_center) * _t2;
    float param_1 = buffer.u_quality;
    float param_2 = length(_176);
    float param_3 = buffer.u_sampleScale;
    float param_4 = buffer.u_sampleBias;
    float _192 = _f2(param_1, param_2, param_3, param_4);
    float _195 = fast::min(_192, 128.0);
    float2 _200 = _176 / float2(_195);
    float param_5 = buffer.u_weightDecay;
    float param_6 = buffer.u_normalizationSample;
    float param_7 = _195;
    float _210 = _f3(param_5, param_6, param_7);
    if (buffer.u_dither > 9.9999997473787516355514526367188e-06)
    {
        float2 param_8 = float2(in.uv0);
        _t7 += (_200 * (buffer.u_dither * ((_f4(param_8) * 2.0) - 1.0)));
    }
    for (int _t14 = 1; _t14 <= 128; _t14++)
    {
        float _245 = float(_t14);
        if (_245 > _195)
        {
            break;
        }
        _t4 *= _210;
        float2 _259 = _200 * _245;
        float2 _t16 = _t7 - _259;
        bool _264 = _t16.x < 0.0;
        bool _271;
        if (!_264)
        {
            _271 = _t16.y < 0.0;
        }
        else
        {
            _271 = _264;
        }
        bool _278;
        if (!_271)
        {
            _278 = _t16.x > 1.0;
        }
        else
        {
            _278 = _271;
        }
        bool _285;
        if (!_278)
        {
            _285 = _t16.y > 1.0;
        }
        else
        {
            _285 = _278;
        }
        if (_285)
        {
            if (buffer.u_borderType == 0)
            {
                _t5 += _t4;
            }
            else
            {
                float param_9 = _t16.x;
                float _301 = _f0(param_9);
                _t16.x = _301;
                float param_10 = _t16.y;
                float _306 = _f0(param_10);
                _t16.y = _306;
                float2 param_11 = _t16;
                _t6 += (_f1(u_inputTexture, u_inputTextureSmplr, param_11, buffer.u_inverseGammaCorrection, buffer.u_gamma) * _t4);
                _t5 += _t4;
            }
        }
        else
        {
            float2 param_12 = _t16;
            _t6 += (_f1(u_inputTexture, u_inputTextureSmplr, param_12, buffer.u_inverseGammaCorrection, buffer.u_gamma) * _t4);
            _t5 += _t4;
        }
        if (_147)
        {
            _t16 = _t7 + _259;
            bool _340 = _t16.x < 0.0;
            bool _347;
            if (!_340)
            {
                _347 = _t16.y < 0.0;
            }
            else
            {
                _347 = _340;
            }
            bool _354;
            if (!_347)
            {
                _354 = _t16.x > 1.0;
            }
            else
            {
                _354 = _347;
            }
            bool _361;
            if (!_354)
            {
                _361 = _t16.y > 1.0;
            }
            else
            {
                _361 = _354;
            }
            if (_361)
            {
                if (buffer.u_borderType == 0)
                {
                    _t5 += _t4;
                }
                else
                {
                    float param_13 = _t16.x;
                    float _375 = _f0(param_13);
                    _t16.x = _375;
                    float param_14 = _t16.y;
                    float _380 = _f0(param_14);
                    _t16.y = _380;
                    float2 param_15 = _t16;
                    _t6 += (_f1(u_inputTexture, u_inputTextureSmplr, param_15, buffer.u_inverseGammaCorrection, buffer.u_gamma) * _t4);
                    _t5 += _t4;
                }
            }
            else
            {
                float2 param_16 = _t16;
                _t6 += (_f1(u_inputTexture, u_inputTextureSmplr, param_16, buffer.u_inverseGammaCorrection, buffer.u_gamma) * _t4);
                _t5 += _t4;
            }
        }
    }
    _t6 /= float4(_t5);
    if (buffer.u_inverseGammaCorrection == 1)
    {
        float4 _413 = _t6;
        float3 _418 = pow(_413.xyz, float3(1.0 / buffer.u_gamma));
        _t6.x = _418.x;
        _t6.y = _418.y;
        _t6.z = _418.z;
    }
    if (buffer.u_blurAlpha == 0)
    {
        _t6.w = _t3.w;
    }
    out.o_fragColor = _t6;
    return out;
}

