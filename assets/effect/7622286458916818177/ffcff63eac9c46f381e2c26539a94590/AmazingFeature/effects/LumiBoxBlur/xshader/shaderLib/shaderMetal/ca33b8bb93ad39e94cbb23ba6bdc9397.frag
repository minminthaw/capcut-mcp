#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

struct buffer_t
{
    float u_sampleY;
    float u_stepY;
    int u_borderType;
};

struct main0_out
{
    float4 o_fragColor [[color(0)]];
};

struct main0_in
{
    float2 uv0 [[user(locn0)]];
};

fragment main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer, texture2d<float> u_inputTexture [[texture(0)]], sampler u_inputTextureSmplr [[sampler(0)]])
{
    main0_out out = {};
    if (buffer.u_sampleY < 9.9999997473787516355514526367188e-06)
    {
        out.o_fragColor = u_inputTexture.sample(u_inputTextureSmplr, in.uv0);
        return out;
    }
    float _t1 = 1.0;
    float4 _t2 = u_inputTexture.sample(u_inputTextureSmplr, in.uv0) * 1.0;
    float2 _t3 = in.uv0;
    int _48 = int(buffer.u_sampleY);
    int _t4 = _48;
    if (_48 > 64)
    {
        _t4 = 64;
    }
    for (int _t5 = 1; _t5 <= _t4; _t5 += 2)
    {
        float _73 = (float(_t5) * buffer.u_stepY) * 2.0;
        _t3.y = in.uv0.y - _73;
        if (_t3.y < 0.0)
        {
            if (buffer.u_borderType == 1)
            {
                _t3.y = 0.0;
                _t2 += u_inputTexture.sample(u_inputTextureSmplr, _t3);
                _t1 += 1.0;
            }
            else
            {
                if (buffer.u_borderType == 2)
                {
                    _t1 += 1.0;
                }
                else
                {
                    if (buffer.u_borderType == 3)
                    {
                        _t3.y = -_t3.y;
                        _t2 += u_inputTexture.sample(u_inputTextureSmplr, _t3);
                        _t1 += 1.0;
                    }
                }
            }
        }
        else
        {
            _t2 += u_inputTexture.sample(u_inputTextureSmplr, _t3);
            _t1 += 1.0;
        }
        _t3.y = in.uv0.y + _73;
        if (_t3.y > 1.0)
        {
            if (buffer.u_borderType == 1)
            {
                _t3.y = 1.0;
                _t2 += u_inputTexture.sample(u_inputTextureSmplr, _t3);
                _t1 += 1.0;
            }
            else
            {
                if (buffer.u_borderType == 2)
                {
                    _t1 += 1.0;
                }
                else
                {
                    if (buffer.u_borderType == 3)
                    {
                        _t3.y = 2.0 - _t3.y;
                        _t2 += u_inputTexture.sample(u_inputTextureSmplr, _t3);
                        _t1 += 1.0;
                    }
                }
            }
        }
        else
        {
            _t2 += u_inputTexture.sample(u_inputTextureSmplr, _t3);
            _t1 += 1.0;
        }
    }
    float4 _191 = _t2;
    float4 _193 = _191 / float4(_t1);
    _t2 = _193;
    out.o_fragColor = _193;
    return out;
}

