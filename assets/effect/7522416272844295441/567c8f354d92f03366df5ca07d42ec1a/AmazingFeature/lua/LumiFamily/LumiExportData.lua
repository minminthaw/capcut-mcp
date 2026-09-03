local data = {}

local ae_compDurations = {0, 1.53333333333333}
data.ae_compDurations = ae_compDurations

local ae_effectType = 'transition'
data.ae_effectType = ae_effectType

local ae_transitionInputIndex = {
    {'LumiLayer_123-trs', 'InputTex', 0},
    {'LumiLayer_124-trs-blend', 'InputTex', 1},
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_durations = {
    ['LumiLayer_123-trs'] = {
        ['nodeDuration'] = {{0, 0.83333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 0.83333333333333}, },
        },
    },
    ['LumiLayer_124-trs-blend'] = {
        ['nodeDuration'] = {{0, 1.53333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0.83333333333333, 1.53333333333333}, },
            ['baseTex'] = {{0, 0.83333333333333}, },
        },
    },
    ['LumiContrast_125-effect0'] = {
        ['nodeDuration'] = {{0, 1.53333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 1.53333333333333}, },
        },
    },
    ['LumiLayer_125-blend'] = {
        ['nodeDuration'] = {{0, 1.53333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 1.53333333333333}, },
            ['baseTex'] = {{0, 1.53333333333333}, },
        },
    },
    ['LumiBokehBlur_126-effect0'] = {
        ['nodeDuration'] = {{0, 1.53333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 1.53333333333333}, },
        },
    },
    ['LumiLayer_126-blend'] = {
        ['nodeDuration'] = {{0, 1.53333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 1.53333333333333}, },
            ['baseTex'] = {{0, 1.53333333333333}, },
        },
    },
}
data.ae_durations = ae_durations

local ae_attribute = {
    ['LumiLayer_123-trs'] = {
        ['hasBlend'] = false,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(252, 336, 0),
        ['position'] = Amaz.Vector3f(257.912400247713, 341.463089150363, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = -2,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(504, 672),
        ['layerSize'] = Amaz.Vector2f(504, 672),
        ['mirrorEdge'] = true,
    },
    ['LumiLayer_124-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(252, 336, 0),
        ['position'] = Amaz.Vector3f(245.702093039966, 331.591465127976, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = -0.63102998658309,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(504, 672),
        ['layerSize'] = Amaz.Vector2f(504, 672),
        ['mirrorEdge'] = true,
        ['blendMode'] = 0,
    },
    ['LumiContrast_125-effect0'] = {
        ['contrastIntensity'] = 1.14666666666667,
        ['pivot'] = 0.43000000715256,
        ['AEDesignSize'] = Amaz.Vector2f(504, 672),
    },
    ['LumiLayer_125-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Adjustment',
        ['blendMode'] = 0,
    },
    ['LumiBokehBlur_126-effect0'] = {
        ['bokehMode'] = 2,
        ['sample'] = 14.5380473221596,
        ['scaleX'] = 1,
        ['scaleY'] = 1,
        ['regionIns'] = 1,
        ['lightIns'] = 6,
        ['darkIns'] = 4,
        ['quality'] = 1,
        ['angle'] = 29,
        ['lineNum'] = 6,
        ['starShapeIns'] = 0.60000002384186,
        ['AEDesignSize'] = Amaz.Vector2f(504, 672),
    },
    ['LumiLayer_126-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Adjustment',
        ['blendMode'] = 0,
    },
}
data.ae_attribute = ae_attribute

local ae_keyframes = {
    ['LumiLayer_123-trs#position#vector'] =
{
	{
		{0.606799, 0, 0.413044, 1, }, 
		{0, 0.333333, }, 
		{{252, 336, 0, }, {249.575928892, 332.969911115, 0, }, {252, 336, 0, }, {249.575928892, 332.969911115, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
	{
		{0.913043, 0, 0.9999, 0.999734, }, 
		{0.333333, 0.833333, }, 
		{{249.575928892, 332.969911115, 0, }, {257.912400248, 341.46308915, 0, }, {249.575928892, 332.969911115, 0, }, {257.912400248, 341.46308915, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_123-trs#rotation#number'] =
{
	{
		{0.530434816, 3.55e-7, 0.9999, 1, }, 
		{0, 0.833333, }, 
		{{0, }, {-2, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_124-trs-blend#position#vector'] =
{
	{
		{0.0001, 0, 0.470252, 1, }, 
		{0.833333, 1.466667, }, 
		{{242, 329, 0, }, {252, 336, 0, }, {242, 329, 0, }, {252, 336, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_124-trs-blend#rotation#number'] =
{
	{
		{0.0001, 0, 0.470251599, 0.99999994, }, 
		{0.833333, 1.466667, }, 
		{{-1, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiContrast_125-effect0#contrastIntensity#number'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0.333333, 0.833333, }, 
		{{1, }, {1.2, }, }, 
		{6417, }, 
		{1, }, 
	}, 
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0.833333, 1.333333, }, 
		{{1.2, }, {1, }, }, 
		{6417, }, 
		{1, }, 
	}, 
},
    ['LumiBokehBlur_126-effect0#sample#number'] =
{
	{
		{1, 4.3e-8, 0.9999, 1, }, 
		{0, 0.833333, }, 
		{{0, }, {40, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.0001, 0, 0.006864887, 0.999999998, }, 
		{0.833333, 1.466667, }, 
		{{40, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
}
data.ae_keyframes = ae_keyframes

local ae_reverseKeyframes = false
data.ae_reverseKeyframes = ae_reverseKeyframes

local ae_sliderInfos = {
}
data.ae_sliderInfos = ae_sliderInfos

local ae_fadeinInfos = {
    time = 0,
    infos = {
    }
}
data.ae_fadeinInfos = ae_fadeinInfos

local ae_fadeoutInfos = {
    time = 0,
    infos = {
    }
}
data.ae_fadeoutInfos = ae_fadeoutInfos

local ae_animationInfos = {
    animationMode = 0,
    loopStart = 0,
    speedInfo = {1, 0, 1, },
}
data.ae_animationInfos = ae_animationInfos

return data
