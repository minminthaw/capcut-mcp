#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_Steps;
    float u_Sample;
    float u_Angle;
    float u_ExpandFlag;
    float4 u_ScreenParams;
};

struct main0_out
{
    float4 gl_FragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_InputTex [[texture(0)]], sampler u_InputTexSmplr [[sampler(0)]])
{
    main0_out out = {};
    float _177 = buffer.u_Angle * 0.01745329238474369049072265625;
    float2 _263 = (float2(cos(_177), sin(_177)) / ((buffer.u_ScreenParams.xy * (fma(buffer.u_ExpandFlag, 0.4000000059604644775390625, 1.0) * 720.0)) / float2(fast::min(buffer.u_ScreenParams.x, buffer.u_ScreenParams.y)))) * buffer.u_Steps;
    float4 _266 = u_InputTex.sample(u_InputTexSmplr, in.uv0);
    float4 _380;
    float _381;
    _381 = 0.099734999239444732666015625;
    _380 = float4(0.0);
    float4 _327;
    float _331;
    for (int _379 = 1; _379 <= 1024; _381 = _331, _380 = _327, _379++)
    {
        float _281 = float(_379);
        if (_281 > buffer.u_Sample)
        {
            break;
        }
        float _308 = _281 / buffer.u_Sample;
        float _375 = exp(((_308 * (-7.5)) * (_308 * 15.0)) * 0.0625);
        float _378 = _375 * 0.099734999239444732666015625;
        _327 = (_380 + (pow(u_InputTex.sample(u_InputTexSmplr, (in.uv0 + (_263 * _281))), float4(2.2000000476837158203125)) * _378)) + (pow(u_InputTex.sample(u_InputTexSmplr, (in.uv0 + (_263 * float(-_379)))), float4(2.2000000476837158203125)) * _378);
        _331 = fma(_375, 0.19946999847888946533203125, _381);
    }
    out.gl_FragColor = fast::clamp(pow((_380 + (pow(_266, float4(2.2000000476837158203125)) * 0.099734999239444732666015625)) / float4(_381), float4(0.454545438289642333984375)), float4(0.0), float4(1.0));
    float4 _222 = out.gl_FragColor;
    float _227 = out.gl_FragColor.w;
    float3 _230 = fast::clamp(_222.xyz, float3(0.0), float3(_227));
    out.gl_FragColor.x = _230.x;
    out.gl_FragColor.y = _230.y;
    out.gl_FragColor.z = _230.z;
    return out;
}

