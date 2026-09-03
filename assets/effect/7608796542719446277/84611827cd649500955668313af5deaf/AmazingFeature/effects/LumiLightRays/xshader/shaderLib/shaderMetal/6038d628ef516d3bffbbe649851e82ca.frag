#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

// Implementation of the GLSL mod() function, which is slightly different than Metal fmod()
template<typename Tx, typename Ty>
inline Tx mod(Tx x, Ty y)
{
    return x - y * floor(x / y);
}

struct buffer_t
{
    float scale;
    float light_warpSoftness;
    float light_intensity;
    float light_shape;
    float2 light_coordinate;
    float light_radius;
    float scale_degree;
    float light_enhance;
    float light_colorSource;
    float3 light_color;
    float light_transferMode;
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
float2 _f1(thread float2& _p0, thread const float2& _p1, thread const float& _p2, constant float& scale)
{
    float2 _70 = float2(scale, 1.0);
    for (int _t1 = 0; _t1 < 16; _t1++)
    {
        _p0 = (_p0 - _p1) * _70;
        _p0 *= pow(pow(length(_p0 * 2.0), 1.2000000476837158203125) + 1.0, -pow(_p2 * 0.00593749992549419403076171875, 3.0));
        _p0 /= _70;
        _p0 += _p1;
    }
    return _p0;
}

static inline __attribute__((always_inline))
float2 _f2(thread const float2& _p0, thread const float2& _p1, thread const float& _p2, constant float& scale, constant float& light_warpSoftness)
{
    float2 _130 = ((_p0 - _p1) * float2(scale, 1.0)) / float2(0.569999992847442626953125);
    float2 _t4 = _130;
    float _144 = (_t4.x * _t4.x) + (_t4.y * _t4.y);
    float _148 = _144 * _144;
    float _165 = ((1.0 + (0.84899997711181640625 * _144)) + (0.268999993801116943359375 * _148)) + ((-0.12800000607967376708984375) * (_144 * _148));
    if (_p2 < 220.0)
    {
        float2 param = ((((_130 / float2(_165)) * 0.569999992847442626953125) * 2.5) * (_p2 * pow(1.0 - (light_warpSoftness / 100.0), 5.0))) + _p1;
        float2 param_1 = _p1;
        float param_2 = 220.0 - _p2;
        float2 _200 = _f1(param, param_1, param_2, scale);
        return _200;
    }
    else
    {
        return ((((_130 / float2(_165)) * 0.569999992847442626953125) * 2.5) * (1.0 + ((_p2 - 220.0) / 500.0))) + _p1;
    }
}

static inline __attribute__((always_inline))
float _f3(thread const float& _p0, thread const float& _p1, thread const float2& _p2)
{
    if (((_p2.y - (_p0 * _p2.x)) - _p1) <= 0.0)
    {
        return -1.0;
    }
    else
    {
        return 1.0;
    }
}

static inline __attribute__((always_inline))
float2 _f4(thread const float2& _p0, thread const float2& _p1, thread float& _p2, thread const float& _p3, constant float& scale)
{
    _p2 = 90.0 - mod(_p2, 90.0);
    float _t14;
    if (_p2 == 45.0)
    {
        bool _251 = _p0.x <= _p1.x;
        bool _259;
        if (_251)
        {
            _259 = _p0.y >= _p1.y;
        }
        else
        {
            _259 = _251;
        }
        if (_259)
        {
            _t14 = 1.0;
        }
        else
        {
            bool _268 = _p0.x <= _p1.x;
            bool _276;
            if (_268)
            {
                _276 = _p0.y <= _p1.y;
            }
            else
            {
                _276 = _268;
            }
            if (_276)
            {
                _t14 = 2.0;
            }
            else
            {
                bool _284 = _p0.x >= _p1.x;
                bool _292;
                if (_284)
                {
                    _292 = _p0.y <= _p1.y;
                }
                else
                {
                    _292 = _284;
                }
                if (_292)
                {
                    _t14 = 3.0;
                }
                else
                {
                    _t14 = 4.0;
                }
            }
        }
    }
    else
    {
        float _305 = tan(((_p2 + 45.0) / 180.0) * 3.141592502593994140625);
        float _314 = (_305 < 0.0) ? _305 : ((-1.0) / _305);
        float _317 = (-1.0) / _314;
        float param = _314;
        float param_1 = _p1.y - (_314 * _p1.x);
        float2 param_2 = _p0;
        float _341 = _f3(param, param_1, param_2);
        float param_3 = _317;
        float param_4 = _p1.y - (_317 * _p1.x);
        float2 param_5 = _p0;
        float _349 = _f3(param_3, param_4, param_5);
        bool _353 = _349 >= 0.0;
        if ((_341 >= 0.0) && _353)
        {
            _t14 = 1.0;
        }
        else
        {
            bool _361 = _341 <= 0.0;
            if (_353 && _361)
            {
                _t14 = 2.0;
            }
            else
            {
                if ((_349 <= 0.0) && _361)
                {
                    _t14 = 3.0;
                }
                else
                {
                    _t14 = 4.0;
                }
            }
        }
    }
    float _t23;
    if (_p2 == 0.0)
    {
        if (_t14 == 1.0)
        {
            _t23 = _p0.y - _p1.y;
        }
        else
        {
            if (_t14 == 2.0)
            {
                _t23 = _p1.x - _p0.x;
            }
            else
            {
                if (_t14 == 3.0)
                {
                    _t23 = _p1.y - _p0.y;
                }
                else
                {
                    _t23 = _p0.x - _p1.x;
                }
            }
        }
    }
    else
    {
        float _418 = tan((_p2 / 180.0) * 3.141592502593994140625);
        float _420 = (-1.0) / _418;
        float _432 = _p1.y - (_418 * _p1.x);
        float _440 = _p1.y - (_420 * _p1.x);
        if (_p2 <= 45.0)
        {
            if ((_t14 == 1.0) || (_t14 == 3.0))
            {
                _t23 = abs((_p0.y - (_418 * _p0.x)) - _432) / sqrt(1.0 + (_418 * _418));
            }
            else
            {
                _t23 = abs((_p0.y - (_420 * _p0.x)) - _440) / sqrt(1.0 + (_420 * _420));
            }
        }
        else
        {
            if ((45.0 < _p2) && (_p2 <= 90.0))
            {
                if ((_t14 == 2.0) || (_t14 == 4.0))
                {
                    _t23 = abs((_p0.y - (_418 * _p0.x)) - _432) / sqrt(1.0 + (_418 * _418));
                }
                else
                {
                    _t23 = abs((_p0.y - (_420 * _p0.x)) - _440) / sqrt(1.0 + (_420 * _420));
                }
            }
        }
    }
    float2 _535 = float2(scale, 1.0);
    float2 param_6 = ((((_p0 - _p1) * _535) * (3.0 / (1.0 + (2.0 * _t23)))) / _535) + _p1;
    float2 param_7 = _p1;
    float param_8 = 220.0 - _p3;
    float2 _561 = _f1(param_6, param_7, param_8, scale);
    return _561;
}

static inline __attribute__((always_inline))
float _f0(thread const float2& _p0)
{
    return ((step(0.0, _p0.x) * step(_p0.x, 1.0)) * step(0.0, _p0.y)) * step(_p0.y, 1.0);
}

static inline __attribute__((always_inline))
float _f5(thread const float2& _p0, thread const float& _p1, thread const float& _p2, constant float& scale, thread float2& uv0, constant float& light_intensity)
{
    float _582 = _p1 / 2000.0;
    return fast::clamp(((1.0 / fast::max(1.0 + (fast::max(length((uv0 - _p0) * float2(scale, 1.0)) - _582, -0.980000019073486328125) * (0.5 / fast::max(_582, 9.9999997473787516355514526367188e-05))), 9.9999997473787516355514526367188e-05)) * (1.0 - (_p2 / 120.0))) * light_intensity, -255.0, 255.0);
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> inputTexture [[texture(0)]], sampler inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _626 = inputTexture.sample(inputTextureSmplr, in.uv0);
    float2 _t40 = in.uv0;
    if (buffer.light_shape < 0.5)
    {
        float2 param = in.uv0;
        float2 param_1 = buffer.light_coordinate;
        float param_2 = buffer.light_radius;
        _t40 = _f2(param, param_1, param_2, buffer.scale, buffer.light_warpSoftness);
    }
    else
    {
        float2 param_3 = in.uv0;
        float2 param_4 = buffer.light_coordinate;
        float param_5 = buffer.scale_degree;
        float param_6 = buffer.light_radius;
        float2 _657 = _f4(param_3, param_4, param_5, param_6, buffer.scale);
        _t40 = _657;
    }
    float2 param_7 = _t40;
    float4 _t41 = inputTexture.sample(inputTextureSmplr, _t40) * _f0(param_7);
    float2 param_8 = buffer.light_coordinate;
    float param_9 = buffer.light_radius;
    float param_10 = buffer.light_warpSoftness;
    float _t42 = _f5(param_8, param_9, param_10, buffer.scale, in.uv0, buffer.light_intensity);
    if (buffer.light_enhance < 0.5)
    {
        _t42 = fast::clamp(_t42, 0.0, 1.0);
    }
    if (buffer.light_colorSource < 0.5)
    {
        float3 _691 = buffer.light_color * _t42;
        _t41.x = _691.x;
        _t41.y = _691.y;
        _t41.z = _691.z;
    }
    else
    {
        _t41 *= _t42;
    }
    if (buffer.light_transferMode < 0.5)
    {
        out.o_fragColor = _t41;
    }
    else
    {
        if (buffer.light_transferMode < 1.5)
        {
            out.o_fragColor = _t41 + _626;
        }
        else
        {
            if (buffer.light_transferMode < 2.5)
            {
                out.o_fragColor = fast::max(_t41, _626);
            }
            else
            {
                if (buffer.light_transferMode < 3.5)
                {
                    out.o_fragColor = float4(1.0) - ((float4(1.0) - _t41) * (float4(1.0) - _626));
                }
                else
                {
                    out.o_fragColor = _t41;
                }
            }
        }
    }
    return out;
}

