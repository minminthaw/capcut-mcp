#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int u_unmult;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_uv [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTex [[texture(0)]], sampler u_inputTexSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _19 = u_inputTex.sample(u_inputTexSmplr, in.v_uv);
    float4 _t0 = _19;
    if (buffer.u_unmult == 1)
    {
        float _42 = fast::max(fast::max(_t0.x, _t0.y), _t0.z);
        if (_42 > 0.0)
        {
            out.o_fragColor = float4(_19.xyz, _42);
        }
        else
        {
            out.o_fragColor = float4(0.0);
        }
    }
    else
    {
        out.o_fragColor = _19;
    }
    return out;
}

