#pragma clang diagnostic ignored "-Wmissing-prototypes"
#pragma clang diagnostic ignored "-Wmissing-braces"

#include <metal_stdlib>
#include <simd/simd.h>

using namespace metal;

template<typename T, size_t Num>
struct spvUnsafeArray
{
    T elements[Num ? Num : 1];
    
    thread T& operator [] (size_t pos) thread
    {
        return elements[pos];
    }
    constexpr const thread T& operator [] (size_t pos) const thread
    {
        return elements[pos];
    }
    
    device T& operator [] (size_t pos) device
    {
        return elements[pos];
    }
    constexpr const device T& operator [] (size_t pos) const device
    {
        return elements[pos];
    }
    
    constexpr const constant T& operator [] (size_t pos) const constant
    {
        return elements[pos];
    }
    
    threadgroup T& operator [] (size_t pos) threadgroup
    {
        return elements[pos];
    }
    constexpr const threadgroup T& operator [] (size_t pos) const threadgroup
    {
        return elements[pos];
    }
};

struct buffer_t
{
    float uIntensity;
    float _surfaceWidth;
    float _surfaceHeight;
    float uDeformationRealStep;
    spvUnsafeArray<float2, 40> uDeformationStartPoint;
    spvUnsafeArray<float2, 40> uDeformationEndPoint;
    spvUnsafeArray<float, 40> uDeformationActionType;
    spvUnsafeArray<float, 40> uDeformationRadius;
    spvUnsafeArray<float, 40> uDeformationIntensity;
};

struct main0_out
{
    float2 uv0 [[user(uv0)]];
    float2 sucaiTexCoord [[user(sucaiTexCoord)]];
    float2 origCoord [[user(origCoord)]];
    float4 gl_Position [[position]];
};

struct main0_in
{
    float3 position [[attribute(0)]];
    float2 texcoord0 [[attribute(1)]];
    float2 texcoord1 [[attribute(2)]];
};

static inline __attribute__((always_inline))
float2 stretchFun(thread const float2& textureCoord, thread const float2& originPosition, thread const float2& targetPosition, thread const float& radius, thread const float& intensity)
{
    float2 offset = float2(0.0);
    float2 result = float2(0.0);
    float2 direction = targetPosition - originPosition;
    float lengthA = length(direction);
    float infect = distance(textureCoord, originPosition) / radius;
    infect = 1.0 - infect;
    infect = fast::clamp(infect, 0.0, 1.0);
    offset = (direction * infect) * intensity;
    result = textureCoord - offset;
    return result;
}

static inline __attribute__((always_inline))
float2 enlargeFun(thread float2& curCoord, thread const float2& circleCenter, thread const float& radius, thread const float& intensity)
{
    float currentDistance = distance(curCoord, circleCenter);
    float weight = currentDistance / radius;
    weight = 1.0 - (intensity * (1.0 - (weight * weight)));
    weight = fast::clamp(weight, 0.0, 1.0);
    curCoord = circleCenter + ((curCoord - circleCenter) * weight);
    return curCoord;
}

static inline __attribute__((always_inline))
float2 narrowFun(thread float2& curCoord, thread const float2& circleCenter, thread const float& radius, thread const float& intensity)
{
    float currentDistance = distance(curCoord, circleCenter);
    float weight = currentDistance / radius;
    weight = 1.0 - (intensity * (1.0 - (weight * weight)));
    weight = fast::clamp(weight, 9.9999997473787516355514526367188e-05, 1.0);
    curCoord = circleCenter + ((curCoord - circleCenter) / float2(weight));
    return curCoord;
}

vertex main0_out main0(main0_in in [[stage_in]], constant buffer_t& buffer)
{
    main0_out out = {};
    if (buffer.uIntensity >= 0.0)
    {
        out.gl_Position = float4(1.0);
        out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
        return out;
    }
    out.gl_Position = float4(in.position.x, in.position.y, 0.0, 1.0);
    float2 x_y = float2(buffer._surfaceWidth, buffer._surfaceHeight);
    float2 curCoord = in.texcoord0 * x_y;
    float2 srcPoint = float2(0.0);
    float2 dstPoint = float2(0.0);
    int n = int(buffer.uDeformationRealStep);
    for (int i = 0; i < 100; i++)
    {
        if (i >= n)
        {
            break;
        }
        srcPoint = buffer.uDeformationStartPoint[i];
        dstPoint = buffer.uDeformationEndPoint[i];
        if (abs(buffer.uDeformationActionType[i] - 0.0) < 0.001000000047497451305389404296875)
        {
            float2 param = curCoord;
            float2 param_1 = srcPoint;
            float2 param_2 = dstPoint;
            float param_3 = buffer.uDeformationRadius[i];
            float param_4 = buffer.uDeformationIntensity[i];
            curCoord = stretchFun(param, param_1, param_2, param_3, param_4);
        }
        else
        {
            if (abs(buffer.uDeformationActionType[i] - 1.0) < 0.001000000047497451305389404296875)
            {
                float2 param_5 = curCoord;
                float2 param_6 = dstPoint;
                float param_7 = buffer.uDeformationRadius[i];
                float param_8 = buffer.uDeformationIntensity[i];
                float2 _242 = enlargeFun(param_5, param_6, param_7, param_8);
                curCoord = _242;
            }
            else
            {
                if (abs(buffer.uDeformationActionType[i] - 2.0) < 0.001000000047497451305389404296875)
                {
                    float2 param_9 = curCoord;
                    float2 param_10 = dstPoint;
                    float param_11 = buffer.uDeformationRadius[i];
                    float param_12 = buffer.uDeformationIntensity[i];
                    float2 _265 = narrowFun(param_9, param_10, param_11, param_12);
                    curCoord = _265;
                }
            }
        }
    }
    float final_intensity = abs(buffer.uIntensity);
    out.uv0 = in.texcoord0 + ((((curCoord / x_y) - in.texcoord0) * final_intensity) * 0.25);
    out.sucaiTexCoord = in.texcoord1;
    out.origCoord = in.texcoord0;
    out.gl_Position.z = (out.gl_Position.z + out.gl_Position.w) * 0.5;       // Adjust clip-space for Metal
    return out;
}

