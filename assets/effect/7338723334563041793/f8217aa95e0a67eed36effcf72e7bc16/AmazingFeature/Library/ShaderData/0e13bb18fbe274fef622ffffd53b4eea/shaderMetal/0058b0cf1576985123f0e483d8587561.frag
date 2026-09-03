#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int hasBgTex;
    float4 u_ScreenParams;
    float2 bgTextureSize;
    float sourceOpacity;
    float bgBrightness;
    float3 GlowColor;
    float brightness;
    float glowUnderSource;
    float lightBackground;
    int combine;
};

struct main0_out
{
    float4 gl_FragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> inputTexture [[texture(0)]], texture2d<float> bgTexture [[texture(1)]], texture2d<float> blurTexture1 [[texture(2)]], texture2d<float> blurTexture2 [[texture(3)]], sampler inputTextureSmplr [[sampler(0)]], sampler bgTextureSmplr [[sampler(1)]], sampler blurTexture1Smplr [[sampler(2)]], sampler blurTexture2Smplr [[sampler(3)]])
{
    main0_out out = {};
    float4 _73 = inputTexture.sample(inputTextureSmplr, in.uv0);
    float _76 = _73.w;
    float4 _500;
    if (buffer.hasBgTex > 0)
    {
        float2 _425 = in.uv0;
        _425.y = 1.0 - in.uv0.y;
        float2 _96 = _425 - float2(0.5);
        float2 _122 = float2(_96.x * (buffer.u_ScreenParams.x / buffer.bgTextureSize.x), _96.y * (buffer.u_ScreenParams.y / buffer.bgTextureSize.y)) + float2(0.5);
        float _370 = _122.x;
        float _377 = _122.y;
        _500 = bgTexture.sample(bgTextureSmplr, _122) * (((step(0.0, _370) * step(_370, 1.0)) * step(0.0, _377)) * step(_377, 1.0));
    }
    else
    {
        _500 = float4(0.0, 0.0, 0.0, _76);
    }
    float4 _135 = float4(buffer.sourceOpacity);
    float4 _145 = blurTexture1.sample(blurTexture1Smplr, in.uv0);
    float4 _151 = blurTexture2.sample(blurTexture2Smplr, in.uv0);
    float4 _158 = float4(fma(_145.y, 0.0039215688593685626983642578125, _145.x), fma(_145.w, 0.0039215688593685626983642578125, _145.z), fma(_151.y, 0.0039215688593685626983642578125, _151.x), fma(_151.w, 0.0039215688593685626983642578125, _151.z));
    float3 _165 = _158.xyz * buffer.GlowColor;
    float4 _445 = _158;
    _445.x = _165.x;
    float4 _447 = _445;
    _447.y = _165.y;
    float4 _449 = _447;
    _449.z = _165.z;
    float4 _175 = _449 * buffer.brightness;
    float4 _192 = mix(_175, mix(_175, _73, _135), float4(buffer.glowUnderSource)) * (1.0 - buffer.lightBackground);
    float4 _196 = fast::clamp(mix(_500, _73, _135) * buffer.bgBrightness, float4(0.0), float4(1.0));
    float _199 = _175.w;
    float4 _509;
    if (buffer.combine == 1)
    {
        float3 _219 = _192.xyz + _196.xyz;
        float4 _454 = _73;
        _454.x = _219.x;
        float4 _456 = _454;
        _456.y = _219.y;
        float4 _458 = _456;
        _458.z = _219.z;
        _509 = _458;
    }
    else
    {
        float4 _510;
        if (buffer.combine == 2)
        {
            float3 _236 = _196.xyz * _192.xyz;
            float4 _460 = _73;
            _460.x = _236.x;
            float4 _462 = _460;
            _462.y = _236.y;
            float4 _464 = _462;
            _464.z = _236.z;
            _510 = _464;
        }
        else
        {
            float4 _511;
            if (buffer.combine == 3)
            {
                float3 _254 = abs(_192.xyz - _196.xyz);
                float4 _466 = _73;
                _466.x = _254.x;
                float4 _468 = _466;
                _468.y = _254.y;
                float4 _470 = _468;
                _470.z = _254.z;
                _511 = _470;
            }
            else
            {
                float4 _512;
                if (buffer.combine == 4)
                {
                    float _268 = _196.x;
                    float _501;
                    if (_268 < 0.5)
                    {
                        _501 = (2.0 * _268) * _192.x;
                    }
                    else
                    {
                        _501 = fma((1.0 - _268) * (-2.0), 1.0 - _192.x, 1.0);
                    }
                    float _292 = _196.y;
                    float _503;
                    if (_292 < 0.5)
                    {
                        _503 = (2.0 * _292) * _192.y;
                    }
                    else
                    {
                        _503 = fma((1.0 - _292) * (-2.0), 1.0 - _192.y, 1.0);
                    }
                    float _315 = _196.z;
                    float _505;
                    if (_315 < 0.5)
                    {
                        _505 = (2.0 * _315) * _192.z;
                    }
                    else
                    {
                        _505 = fma((1.0 - _315) * (-2.0), 1.0 - _192.z, 1.0);
                    }
                    float4 _487 = _73;
                    _487.x = _501;
                    float4 _489 = _487;
                    _489.y = _503;
                    float4 _491 = _489;
                    _491.z = _505;
                    _512 = _491;
                }
                else
                {
                    float3 _355 = fma(_196.xyz - float3(1.0), float3(1.0) - _192.xyz, float3(1.0));
                    float4 _493 = _73;
                    _493.x = _355.x;
                    float4 _495 = _493;
                    _495.y = _355.y;
                    float4 _497 = _495;
                    _497.z = _355.z;
                    _512 = _497;
                }
                _511 = _512;
            }
            _510 = _511;
        }
        _509 = _510;
    }
    float4 _499 = _509;
    _499.w = fma(1.0 - _199, _76, _199);
    out.gl_FragColor = _499;
    return out;
}

