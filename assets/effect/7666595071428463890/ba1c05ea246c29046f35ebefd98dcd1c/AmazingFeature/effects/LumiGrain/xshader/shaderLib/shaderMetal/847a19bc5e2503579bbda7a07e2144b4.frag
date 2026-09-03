#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    int u_combine;
    float u_intensity;
    float u_intensityR;
    float u_intensityG;
    float u_intensityB;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 v_uv [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_noiseTexture [[texture(0)]], texture2d<float> u_inputTexture [[texture(1)]], sampler u_noiseTextureSmplr [[sampler(0)]], sampler u_inputTextureSmplr [[sampler(1)]])
{
    main0_out out = {};
    float4 _19 = u_noiseTexture.sample(u_noiseTextureSmplr, in.v_uv);
    float4 _t0 = _19;
    float4 _24 = u_inputTexture.sample(u_inputTextureSmplr, in.v_uv);
    float4 _t1 = _24;
    float4 _t2;
    if (buffer.u_combine == 1)
    {
        _t2 = float4(_19.xyz + _24.xyz, _t1.w);
    }
    else
    {
        if (buffer.u_combine == 2)
        {
            _t2 = float4(_24.xyz * _19.xyz, _t1.w);
        }
        else
        {
            if (buffer.u_combine == 3)
            {
                float _78;
                if (_t1.x < 0.5)
                {
                    _78 = (2.0 * _t1.x) * _t0.x;
                }
                else
                {
                    _78 = 1.0 - ((2.0 * (1.0 - _t1.x)) * (1.0 - _t0.x));
                }
                float _104;
                if (_t1.y < 0.5)
                {
                    _104 = (2.0 * _t1.y) * _t0.y;
                }
                else
                {
                    _104 = 1.0 - ((2.0 * (1.0 - _t1.y)) * (1.0 - _t0.y));
                }
                float _128;
                if (_t1.z < 0.5)
                {
                    _128 = (2.0 * _t1.z) * _t0.z;
                }
                else
                {
                    _128 = 1.0 - ((2.0 * (1.0 - _t1.z)) * (1.0 - _t0.z));
                }
                _t2 = float4(float3(_78, _104, _128), _t1.w);
            }
            else
            {
                if (buffer.u_combine == 4)
                {
                    float _203;
                    if (_t1.x < 0.5)
                    {
                        _203 = (2.0 * _t1.x) * _t0.x;
                    }
                    else
                    {
                        _203 = 1.0 - ((2.0 * (1.0 - _t1.x)) * (1.0 - _t0.x));
                    }
                    float _226;
                    if (_t1.y < 0.5)
                    {
                        _226 = (2.0 * _t1.y) * _t0.y;
                    }
                    else
                    {
                        _226 = 1.0 - ((2.0 * (1.0 - _t1.y)) * (1.0 - _t0.y));
                    }
                    float _249;
                    if (_t1.z < 0.5)
                    {
                        _249 = (2.0 * _t1.z) * _t0.z;
                    }
                    else
                    {
                        _249 = 1.0 - ((2.0 * (1.0 - _t1.z)) * (1.0 - _t0.z));
                    }
                    float3 _269 = float3(_203, _226, _249);
                    _t2 = float4(mix(_269, float3(1.0) - ((float3(1.0) - _269) * (float3(1.0) - float3(fast::max(1.0 - ((1.0 - _t0.x) / 0.5), 0.0), fast::max(1.0 - ((1.0 - _t0.y) / 0.5), 0.0), fast::max(1.0 - ((1.0 - _t0.z) / 0.5), 0.0)))), float3(0.5 * smoothstep(0.588235318660736083984375, 0.509803950786590576171875, dot(_24.xyz, float3(0.2989999949932098388671875, 0.58700001239776611328125, 0.114000000059604644775390625))))), _t1.w);
                }
                else
                {
                    if (buffer.u_combine == 5)
                    {
                        _t2 = float4(abs(_19.xyz - _24.xyz), _t1.w);
                    }
                    else
                    {
                        _t2 = float4(float3(1.0) - ((float3(1.0) - _24.xyz) * (float3(1.0) - _19.xyz)), _t1.w);
                    }
                }
            }
        }
    }
    if (buffer.u_combine == 2)
    {
        _t2.x = _t1.x + ((_t2.x * buffer.u_intensity) * buffer.u_intensityR);
        _t2.y = _t1.y + ((_t2.y * buffer.u_intensity) * buffer.u_intensityG);
        _t2.z = _t1.z + ((_t2.z * buffer.u_intensity) * buffer.u_intensityB);
    }
    else
    {
        _t2.x = mix(_t1.x, _t2.x, buffer.u_intensity * buffer.u_intensityR);
        _t2.y = mix(_t1.y, _t2.y, buffer.u_intensity * buffer.u_intensityG);
        _t2.z = mix(_t1.z, _t2.z, buffer.u_intensity * buffer.u_intensityB);
    }
    out.o_fragColor = _t2;
    return out;
}

