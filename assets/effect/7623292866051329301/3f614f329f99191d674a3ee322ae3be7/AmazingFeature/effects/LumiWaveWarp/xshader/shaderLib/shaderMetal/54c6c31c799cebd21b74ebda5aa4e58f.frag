#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int u_type;
    float u_amplitude;
    float4 u_ScreenParams;
    int u_fixedType;
    float u_wavelength;
    float u_phase;
    float2 u_dir;
    int u_aa;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_p [[user(locn0)]];
};

static inline __attribute__((always_inline))
float _f4(thread const float& _p0)
{
    return sin(6.283185482025146484375 * _p0);
}

static inline __attribute__((always_inline))
float _f5(thread const float& _p0)
{
    return step(_p0, 0.5);
}

static inline __attribute__((always_inline))
float _f6(thread const float& _p0)
{
    return mix(-1.0, 1.0, 1.0 - (abs(0.5 - _p0) * 2.0));
}

static inline __attribute__((always_inline))
float _f7(thread const float& _p0)
{
    return mix(-1.0, 1.0, _p0);
}

static inline __attribute__((always_inline))
float _f8(thread const float& _p0)
{
    float _209 = mix(1.0, -1.0, fract(_p0 + _p0));
    float _215 = sqrt(1.0 - (_209 * _209));
    return mix(_215, -_215, step(0.5, _p0));
}

static inline __attribute__((always_inline))
float _f9(thread const float& _p0)
{
    float _228 = mix(1.0, -1.0, _p0);
    return mix(1.0, -1.0, sqrt(1.0 - (_228 * _228)));
}

static inline __attribute__((always_inline))
float _f10(thread const float& _p0)
{
    float _245 = mix(1.0, -1.0, fract(_p0 + _p0));
    float _251 = sqrt(1.0 - (_245 * _245));
    return mix(_251 - 1.0, 1.0 - _251, step(_p0, 0.5));
}

static inline __attribute__((always_inline))
float _f11(thread float& _p0)
{
    _p0 = floor(_p0 * 200.0) / 200.0;
    float _271 = _p0 * 1000.0;
    return (cos(_271 * 0.5) * cos(_271 * 0.12999999523162841796875)) * sin((_271 + 10.0) * 0.300000011920928955078125);
}

static inline __attribute__((always_inline))
float _f12(thread const float& _p0)
{
    float _296 = (3.1415927410125732421875 * _p0) * 30.0;
    return (cos(_296 * 0.5) * cos(_296 * 0.12999999523162841796875)) * sin((_296 + 10.0) * 0.300000011920928955078125);
}

static inline __attribute__((always_inline))
float _f13(thread const float& _p0, constant int& u_type)
{
    if (u_type == 0)
    {
        float param = _p0;
        return _f4(param);
    }
    else
    {
        if (u_type == 1)
        {
            float param_1 = _p0;
            return _f5(param_1);
        }
        else
        {
            if (u_type == 2)
            {
                float param_2 = _p0;
                return _f6(param_2);
            }
            else
            {
                if (u_type == 3)
                {
                    float param_3 = _p0;
                    return _f7(param_3);
                }
                else
                {
                    if (u_type == 4)
                    {
                        float param_4 = _p0;
                        return _f8(param_4);
                    }
                    else
                    {
                        if (u_type == 5)
                        {
                            float param_5 = _p0;
                            return _f9(param_5);
                        }
                        else
                        {
                            if (u_type == 6)
                            {
                                float param_6 = _p0;
                                return _f10(param_6);
                            }
                            else
                            {
                                if (u_type == 7)
                                {
                                    float param_7 = _p0;
                                    float _394 = _f11(param_7);
                                    return _394;
                                }
                                else
                                {
                                    if (u_type == 8)
                                    {
                                        float param_8 = _p0;
                                        return _f12(param_8);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return 0.0;
}

static inline __attribute__((always_inline))
float2 _f2(thread const float2& _p0, thread const float2& _p1, thread const float2& _p2)
{
    return fast::clamp((_p2 - _p0) / (_p1 - _p0), float2(0.0), float2(1.0));
}

static inline __attribute__((always_inline))
float2 _f14(thread const float2& _p0, thread const float2& _p1, constant float& u_amplitude, constant float4& u_ScreenParams)
{
    float2 _414 = float2(u_amplitude * 1.2000000476837158203125);
    float2 param = float2(0.0);
    float2 param_1 = _414;
    float2 param_2 = _p0;
    float2 param_3 = u_ScreenParams.xy;
    float2 param_4 = u_ScreenParams.xy - _414;
    float2 param_5 = _p0;
    float2 _t17 = fast::min(_f2(param, param_1, param_2), _f2(param_3, param_4, param_5));
    return mix(_p0, _p1, float2(fast::min(_t17.x, _t17.y)));
}

static inline __attribute__((always_inline))
float _f1(thread const float& _p0, thread const float& _p1, thread const float& _p2)
{
    return fast::clamp((_p2 - _p0) / (_p1 - _p0), 0.0, 1.0);
}

static inline __attribute__((always_inline))
float _f3(thread const float& _p0)
{
    return _p0 * _p0;
}

static inline __attribute__((always_inline))
float2 _f15(thread const float2& _p0, thread const float2& _p1, constant float4& u_ScreenParams)
{
    float2 _t18 = u_ScreenParams.xy;
    float param = 0.0;
    float param_1 = fast::min(_t18.x, _t18.y) * 0.4000000059604644775390625;
    float param_2 = length(_p0 - (u_ScreenParams.xy * 0.5));
    float param_3 = _f1(param, param_1, param_2);
    return mix(_p0, _p1, float2(_f3(param_3)));
}

static inline __attribute__((always_inline))
float2 _f16(thread const float2& _p0, thread const float2& _p1, constant float& u_amplitude)
{
    float param = 0.0;
    float param_1 = u_amplitude * 1.2000000476837158203125;
    float param_2 = _p0.x;
    return mix(_p0, _p1, float2(_f1(param, param_1, param_2)));
}

static inline __attribute__((always_inline))
float2 _f17(thread const float2& _p0, thread const float2& _p1, constant float& u_amplitude)
{
    float param = 0.0;
    float param_1 = u_amplitude * 1.2000000476837158203125;
    float param_2 = _p0.y;
    return mix(_p0, _p1, float2(_f1(param, param_1, param_2)));
}

static inline __attribute__((always_inline))
float2 _f18(thread const float2& _p0, thread const float2& _p1, constant float& u_amplitude, constant float4& u_ScreenParams)
{
    float param = u_ScreenParams.x;
    float param_1 = u_ScreenParams.x - (u_amplitude * 1.2000000476837158203125);
    float param_2 = _p0.x;
    return mix(_p0, _p1, float2(_f1(param, param_1, param_2)));
}

static inline __attribute__((always_inline))
float2 _f19(thread const float2& _p0, thread const float2& _p1, constant float& u_amplitude, constant float4& u_ScreenParams)
{
    float param = u_ScreenParams.y;
    float param_1 = u_ScreenParams.y - (u_amplitude * 1.2000000476837158203125);
    float param_2 = _p0.y;
    return mix(_p0, _p1, float2(_f1(param, param_1, param_2)));
}

static inline __attribute__((always_inline))
float2 _f20(thread const float2& _p0, thread const float2& _p1, constant float& u_amplitude, constant float4& u_ScreenParams)
{
    float _564 = u_amplitude * 1.2000000476837158203125;
    float param = 0.0;
    float param_1 = _564;
    float param_2 = _p0.x;
    float param_3 = u_ScreenParams.x;
    float param_4 = u_ScreenParams.x - _564;
    float param_5 = _p0.x;
    return mix(_p0, _p1, float2(fast::min(_f1(param, param_1, param_2), _f1(param_3, param_4, param_5))));
}

static inline __attribute__((always_inline))
float2 _f21(thread const float2& _p0, thread const float2& _p1, constant float& u_amplitude, constant float4& u_ScreenParams)
{
    float _596 = u_amplitude * 1.2000000476837158203125;
    float param = 0.0;
    float param_1 = _596;
    float param_2 = _p0.y;
    float param_3 = u_ScreenParams.y;
    float param_4 = u_ScreenParams.y - _596;
    float param_5 = _p0.y;
    return mix(_p0, _p1, float2(fast::min(_f1(param, param_1, param_2), _f1(param_3, param_4, param_5))));
}

static inline __attribute__((always_inline))
float2 _f22(thread const float2& _p0, thread const float2& _p1, constant float& u_amplitude, constant float4& u_ScreenParams, constant int& u_fixedType)
{
    if (u_fixedType == 0)
    {
        return _p1;
    }
    else
    {
        if (u_fixedType == 1)
        {
            float2 param = _p0;
            float2 param_1 = _p1;
            return _f14(param, param_1, u_amplitude, u_ScreenParams);
        }
        else
        {
            if (u_fixedType == 2)
            {
                float2 param_2 = _p0;
                float2 param_3 = _p1;
                return _f15(param_2, param_3, u_ScreenParams);
            }
            else
            {
                if (u_fixedType == 3)
                {
                    float2 param_4 = _p0;
                    float2 param_5 = _p1;
                    return _f16(param_4, param_5, u_amplitude);
                }
                else
                {
                    if (u_fixedType == 4)
                    {
                        float2 param_6 = _p0;
                        float2 param_7 = _p1;
                        return _f17(param_6, param_7, u_amplitude);
                    }
                    else
                    {
                        if (u_fixedType == 5)
                        {
                            float2 param_8 = _p0;
                            float2 param_9 = _p1;
                            return _f18(param_8, param_9, u_amplitude, u_ScreenParams);
                        }
                        else
                        {
                            if (u_fixedType == 6)
                            {
                                float2 param_10 = _p0;
                                float2 param_11 = _p1;
                                return _f19(param_10, param_11, u_amplitude, u_ScreenParams);
                            }
                            else
                            {
                                if (u_fixedType == 7)
                                {
                                    float2 param_12 = _p0;
                                    float2 param_13 = _p1;
                                    return _f20(param_12, param_13, u_amplitude, u_ScreenParams);
                                }
                                else
                                {
                                    if (u_fixedType == 8)
                                    {
                                        float2 param_14 = _p0;
                                        float2 param_15 = _p1;
                                        return _f21(param_14, param_15, u_amplitude, u_ScreenParams);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return _p0;
}

static inline __attribute__((always_inline))
float4 _f0(texture2d<float> _p0, sampler _p0Smplr, thread float2& _p1)
{
    float2 _124 = _p1;
    _p1 = step(float2(0.0), _p1) * step(_p1, float2(1.0));
    return (_p0.sample(_p0Smplr, _124) * _p1.x) * _p1.y;
}

static inline __attribute__((always_inline))
float4 _f24(texture2d<float> _p0, sampler _p0Smplr, thread const float2& _p1, thread const float2& _p2, thread const float2& _p3, constant int& u_type, constant float& u_amplitude, constant float4& u_ScreenParams, constant int& u_fixedType, constant float& u_wavelength, constant float& u_phase)
{
    float param = fract((dot(_p1, _p2) / u_wavelength) + u_phase);
    float2 param_1 = _p1;
    float2 param_2 = _p1 - (_p3 * (_f13(param, u_type) * u_amplitude));
    float2 _t39 = _f22(param_1, param_2, u_amplitude, u_ScreenParams, u_fixedType) / u_ScreenParams.xy;
    float2 param_3 = float2(_t39.x, 1.0 - _t39.y);
    float4 _804 = _f0(_p0, _p0Smplr, param_3);
    float4 _t40 = _804;
    float2 _t41 = float2(0.4000000059604644775390625, 0.300000011920928955078125);
    for (int _t42 = 0; _t42 < 4; _t42++)
    {
        float2 _819 = _p1 + _t41;
        float param_4 = fract((dot(_819, _p2) / u_wavelength) + u_phase);
        float2 param_5 = _819;
        float2 param_6 = _819 - (_p3 * (_f13(param_4, u_type) * u_amplitude));
        float2 _t44 = _f22(param_5, param_6, u_amplitude, u_ScreenParams, u_fixedType) / u_ScreenParams.xy;
        float2 param_7 = float2(_t44.x, 1.0 - _t44.y);
        float4 _854 = _f0(_p0, _p0Smplr, param_7);
        _t40 += _854;
        _t41 = float2(-_t41.y, _t41.x);
    }
    return _t40 / float4(5.0);
}

static inline __attribute__((always_inline))
float4 _f25(texture2d<float> _p0, sampler _p0Smplr, thread const float2& _p1, thread const float2& _p2, thread const float2& _p3, constant int& u_type, constant float& u_amplitude, constant float4& u_ScreenParams, constant int& u_fixedType, constant float& u_wavelength, constant float& u_phase)
{
    float param = fract((dot(_p1, _p2) / u_wavelength) + u_phase);
    float2 param_1 = _p1;
    float2 param_2 = _p1 - (_p3 * (_f13(param, u_type) * u_amplitude));
    float2 _t48 = _f22(param_1, param_2, u_amplitude, u_ScreenParams, u_fixedType) / u_ScreenParams.xy;
    float2 param_3 = float2(_t48.x, 1.0 - _t48.y);
    float4 _909 = _f0(_p0, _p0Smplr, param_3);
    float4 _t49 = _909;
    float2 _t50 = float2(0.319999992847442626953125, 0.23999999463558197021484375);
    for (int _t51 = 0; _t51 < 4; _t51++)
    {
        float2 _925 = _p1 + _t50;
        float param_4 = fract((dot(_925, _p2) / u_wavelength) + u_phase);
        float2 param_5 = _925;
        float2 param_6 = _925 - (_p3 * (_f13(param_4, u_type) * u_amplitude));
        float2 _t53 = _f22(param_5, param_6, u_amplitude, u_ScreenParams, u_fixedType) / u_ScreenParams.xy;
        float2 param_7 = float2(_t53.x, 1.0 - _t53.y);
        float4 _960 = _f0(_p0, _p0Smplr, param_7);
        _t49 += _960;
        _t50 = float2(-_t50.y, _t50.x);
    }
    _t50 = float2(0.38999998569488525390625, 0.519999980926513671875);
    for (int _t54 = 0; _t54 < 4; _t54++)
    {
        float2 _985 = _p1 + _t50;
        float param_8 = fract((dot(_985, _p2) / u_wavelength) + u_phase);
        float2 param_9 = _985;
        float2 param_10 = _985 - (_p3 * (_f13(param_8, u_type) * u_amplitude));
        float2 _t56 = _f22(param_9, param_10, u_amplitude, u_ScreenParams, u_fixedType) / u_ScreenParams.xy;
        float2 param_11 = float2(_t56.x, 1.0 - _t56.y);
        float4 _1020 = _f0(_p0, _p0Smplr, param_11);
        _t49 += _1020;
        _t50 = float2(-_t50.y, _t50.x);
    }
    return _t49 / float4(9.0);
}

static inline __attribute__((always_inline))
float4 _f23(texture2d<float> _p0, sampler _p0Smplr, thread const float2& _p1, thread const float2& _p2, thread const float2& _p3, constant int& u_type, constant float& u_amplitude, constant float4& u_ScreenParams, constant int& u_fixedType, constant float& u_wavelength, constant float& u_phase)
{
    float param = fract((dot(_p1, _p2) / u_wavelength) + u_phase);
    float2 param_1 = _p1;
    float2 param_2 = _p1 - (_p3 * (_f13(param, u_type) * u_amplitude));
    float2 _t35 = _f22(param_1, param_2, u_amplitude, u_ScreenParams, u_fixedType) / u_ScreenParams.xy;
    float2 param_3 = float2(_t35.x, 1.0 - _t35.y);
    float4 _763 = _f0(_p0, _p0Smplr, param_3);
    return _763;
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 _t57 = buffer.u_dir;
    float2 _1047 = float2(-_t57.y, _t57.x);
    if (buffer.u_aa == 1)
    {
        float2 param = in.v_p;
        float2 param_1 = buffer.u_dir;
        float2 param_2 = _1047;
        out.o_fragColor = _f24(u_inputTexture, u_inputTextureSmplr, param, param_1, param_2, buffer.u_type, buffer.u_amplitude, buffer.u_ScreenParams, buffer.u_fixedType, buffer.u_wavelength, buffer.u_phase);
    }
    else
    {
        if (buffer.u_aa == 2)
        {
            float2 param_3 = in.v_p;
            float2 param_4 = buffer.u_dir;
            float2 param_5 = _1047;
            out.o_fragColor = _f25(u_inputTexture, u_inputTextureSmplr, param_3, param_4, param_5, buffer.u_type, buffer.u_amplitude, buffer.u_ScreenParams, buffer.u_fixedType, buffer.u_wavelength, buffer.u_phase);
        }
        else
        {
            float2 param_6 = in.v_p;
            float2 param_7 = buffer.u_dir;
            float2 param_8 = _1047;
            out.o_fragColor = _f23(u_inputTexture, u_inputTextureSmplr, param_6, param_7, param_8, buffer.u_type, buffer.u_amplitude, buffer.u_ScreenParams, buffer.u_fixedType, buffer.u_wavelength, buffer.u_phase);
        }
    }
    return out;
}

