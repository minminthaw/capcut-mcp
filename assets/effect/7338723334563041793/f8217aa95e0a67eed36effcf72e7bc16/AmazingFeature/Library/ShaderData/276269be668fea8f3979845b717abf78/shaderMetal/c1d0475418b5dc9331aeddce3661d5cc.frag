#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int edgeMode;
    float4 u_ScreenParams;
    float4 ColorRadius;
    float MaxRadius;
    float4 ColorSigma;
};

constant float _743 = {};
constant float4 _747 = {};

struct main0_out
{
    float4 gl_FragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> inputTexture [[texture(0)]], sampler inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    float4 _334 = inputTexture.sample(inputTextureSmplr, in.uv0);
    float4 _678 = _747;
    _678.z = fma(_334.y, 0.0039215688593685626983642578125, _334.x);
    float4 _680 = _678;
    _680.w = fma(_334.w, 0.0039215688593685626983642578125, _334.z);
    float _397 = fast::max(1.0, fast::max(fast::max(buffer.ColorRadius.x, buffer.ColorRadius.y), buffer.ColorRadius.z) / buffer.MaxRadius);
    float4 _721;
    float4 _725;
    _725 = float4(1.0);
    _721 = _680;
    float4 _482;
    float4 _486;
    float _489;
    for (float _709 = 1.0, _710 = 1.0; _709 <= 1024.0; _725 = _486, _721 = _482, _710 = _489, _709 += 1.0)
    {
        if (_710 > 1024.0)
        {
            break;
        }
        bool _410 = _710 <= buffer.ColorRadius.x;
        bool _418;
        if (!_410)
        {
            _418 = _710 <= buffer.ColorRadius.y;
        }
        else
        {
            _418 = _410;
        }
        bool _426;
        if (!_418)
        {
            _426 = _710 <= buffer.ColorRadius.z;
        }
        else
        {
            _426 = _418;
        }
        if ((_710 > (buffer.MaxRadius * _397)) || (!_426))
        {
            break;
        }
        float _503 = -(_710 * _710);
        float4 _737 = float4(_743, _743, step(_710, buffer.ColorRadius.z) * exp(_503 / buffer.ColorSigma.z), step(_710, buffer.ColorRadius.w) * exp(_503 / buffer.ColorSigma.w));
        float2 _551 = float2(0.0, _710);
        float2 _553 = fma(float2(1.0) / buffer.u_ScreenParams.xy, _551, in.uv0);
        float2 _559 = fma(float2(-1.0) / buffer.u_ScreenParams.xy, _551, in.uv0);
        float _561 = _553.y;
        float _563 = _559.y;
        float2 _716;
        if (buffer.edgeMode == 0)
        {
            _716 = float2(step(0.0, _561) * step(_561, 1.0), step(0.0, _563) * step(_563, 1.0));
        }
        else
        {
            _716 = float2(1.0);
        }
        float4 _567 = inputTexture.sample(inputTextureSmplr, _553);
        float4 _577 = inputTexture.sample(inputTextureSmplr, _559);
        _482 = fma((float4(0.0, 0.0, fma(_567.y, 0.0039215688593685626983642578125, _567.x), fma(_567.w, 0.0039215688593685626983642578125, _567.z)) * _716.x) + (float4(0.0, 0.0, fma(_577.y, 0.0039215688593685626983642578125, _577.x), fma(_577.w, 0.0039215688593685626983642578125, _577.z)) * _716.y), _737, _721);
        _486 = _725 + (_737 * 2.0);
        _489 = _710 + _397;
    }
    float4 _496 = _721 / _725;
    float _652 = _496.z * 255.0;
    float _661 = _496.w * 255.0;
    out.gl_FragColor = float4(floor(_652) * 0.0039215688593685626983642578125, fract(_652), floor(_661) * 0.0039215688593685626983642578125, fract(_661));
    return out;
}

