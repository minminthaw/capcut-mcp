#pragma clang diagnostic ignored "-Wmissing-prototypes"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_sampleY;
    float u_sigmaY;
    float u_stepY;
    float u_exposure;
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
float _f0(thread const float& _p0, thread const float& _p1)
{
    return exp((((-0.5) * _p0) * _p0) / (_p1 * _p1));
}

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    if (buffer.u_sampleY < 9.9999997473787516355514526367188e-06)
    {
        out.o_fragColor = u_inputTexture.sample(u_inputTextureSmplr, in.v_uv);
        return out;
    }
    float param = 0.0;
    float param_1 = buffer.u_sigmaY;
    float _58 = _f0(param, param_1);
    float _t1 = _58;
    float4 _t2 = u_inputTexture.sample(u_inputTextureSmplr, in.v_uv) * _58;
    float2 _t3 = in.v_uv;
    for (int _t4 = 1; _t4 <= 1024; _t4++)
    {
        float _80 = float(_t4);
        if (_80 > buffer.u_sampleY)
        {
            break;
        }
        float _91 = _80 * buffer.u_stepY;
        float param_2 = _91;
        float param_3 = buffer.u_sigmaY;
        float _97 = _f0(param_2, param_3);
        _t3.y = in.v_uv.y - _91;
        if (_t3.y >= 0.0)
        {
            _t2 += (u_inputTexture.sample(u_inputTextureSmplr, _t3) * _97);
            _t1 += _97;
        }
        _t3.y = in.v_uv.y + _91;
        if (_t3.y <= 1.0)
        {
            _t2 += (u_inputTexture.sample(u_inputTextureSmplr, _t3) * _97);
            _t1 += _97;
        }
    }
    float4 _145 = _t2;
    float4 _147 = _145 / float4(_t1);
    _t2 = _147;
    float3 _153 = _147.xyz * buffer.u_exposure;
    _t2.x = _153.x;
    _t2.y = _153.y;
    _t2.z = _153.z;
    out.o_fragColor = fast::clamp(_t2, float4(0.0), float4(1.0));
    return out;
}

