#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_sampleY;
    float u_sigmaY;
    float u_dy;
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
float _f0(thread const float& _p0, thread const float& _p1)
{
    return exp((((-0.5) * _p0) * _p0) / (_p1 * _p1));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    if (buffer.u_sampleY < 0.001000000047497451305389404296875)
    {
        out.o_fragColor = u_inputTexture.sample(u_inputTextureSmplr, in.uv0);
        return out;
    }
    float param = 0.0;
    float param_1 = buffer.u_sigmaY;
    float _58 = _f0(param, param_1);
    float _t1 = _58;
    float4 _t2 = u_inputTexture.sample(u_inputTextureSmplr, in.uv0) * _58;
    float2 _t3 = in.uv0;
    for (int _t4 = 1; _t4 <= 1024; _t4++)
    {
        float _80 = float(_t4);
        if (_80 > buffer.u_sampleY)
        {
            break;
        }
        float _91 = _80 * buffer.u_dy;
        float param_2 = _91;
        float param_3 = buffer.u_sigmaY;
        float _97 = _f0(param_2, param_3);
        _t3.y = in.uv0.y - _91;
        if (_t3.y >= 0.0)
        {
            _t2 += (u_inputTexture.sample(u_inputTextureSmplr, _t3) * _97);
            _t1 += _97;
        }
        _t3.y = in.uv0.y + _91;
        if (_t3.y <= 1.0)
        {
            _t2 += (u_inputTexture.sample(u_inputTextureSmplr, _t3) * _97);
            _t1 += _97;
        }
    }
    float4 _145 = _t2;
    float4 _147 = _145 / float4(_t1);
    _t2 = _147;
    out.o_fragColor = _147;
    return out;
}

