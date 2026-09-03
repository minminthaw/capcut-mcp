#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_uv [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], texture2d<float> u_maskTex [[texture(0)]], sampler u_maskTexSmplr [[sampler(0)]])
{
    main0_out out = {};
    float _t0 = fast::min(u_maskTex.sample(u_maskTexSmplr, in.v_uv).x, 99.0);
    for (int _t2 = -1; _t2 <= 1; _t2++)
    {
        for (int _t3 = -1; _t3 <= 1; _t3++)
        {
            _t0 = fast::min(u_maskTex.sample(u_maskTexSmplr, (in.v_uv + (float2(float(_t2), float(_t3)) * float2(0.014999999664723873138427734375)))).x, _t0);
        }
    }
    float _79 = _t0;
    float _111 = fast::min(u_maskTex.sample(u_maskTexSmplr, (in.v_uv + float2(0.0, -0.02999999932944774627685546875))).x, fast::min(u_maskTex.sample(u_maskTexSmplr, (in.v_uv + float2(0.0, 0.02999999932944774627685546875))).x, fast::min(u_maskTex.sample(u_maskTexSmplr, (in.v_uv + float2(0.02999999932944774627685546875, 0.0))).x, fast::min(u_maskTex.sample(u_maskTexSmplr, (in.v_uv + float2(-0.02999999932944774627685546875, 0.0))).x, _79))));
    _t0 = _111;
    out.o_fragColor = float4(_111, _111, _111, 1.0);
    return out;
}

