#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_size;
    float u_ratio;
    float u_opacity;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_uv [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_InputTex [[texture(0)]], sampler u_InputTexSmplr [[sampler(0)]])
{
    main0_out out = {};
    float2 _t0 = in.v_uv;
    float _22 = 0.00999999977648258209228515625 * buffer.u_size;
    _t0.x -= _22;
    _t0.y -= (_22 * buffer.u_ratio);
    float _40 = 0.0199999995529651641845703125 * buffer.u_size;
    _t0.x *= (1.0 + _40);
    _t0.y *= (1.0 + (_40 * buffer.u_ratio));
    float4 _t1 = float4(0.0, 0.0, 0.0, 1.0);
    bool _61 = _t0.x > 0.0;
    bool _67;
    if (_61)
    {
        _67 = _t0.x < 1.0;
    }
    else
    {
        _67 = _61;
    }
    if (_67)
    {
        _t1 = float4(1.0);
        bool _73 = _t0.y > 0.0;
        bool _79;
        if (_73)
        {
            _79 = _t0.y < 1.0;
        }
        else
        {
            _79 = _73;
        }
        if (_79)
        {
            _t1 = float4(1.0);
        }
        else
        {
            _t1 = float4(0.0, 0.0, 0.0, 1.0);
        }
    }
    else
    {
        _t1 = float4(0.0, 0.0, 0.0, 1.0);
    }
    float4 _t2 = u_InputTex.sample(u_InputTexSmplr, in.v_uv);
    _t2.x = 1.0;
    _t2.y = 1.0;
    _t2.z = 1.0;
    float4 _t3 = u_InputTex.sample(u_InputTexSmplr, _t0) * _t1.x;
    _t2 *= (1.0 - _t3.w);
    if (buffer.u_size > 0.00999999977648258209228515625)
    {
        _t3 = fast::clamp(_t3 + _t2, float4(0.0), float4(1.0));
    }
    out.o_fragColor = _t3 * buffer.u_opacity;
    return out;
}

