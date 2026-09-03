local data = {}

local ae_compDurations = {0, 2}
data.ae_compDurations = ae_compDurations

local ae_effectType = 'transition'
data.ae_effectType = ae_effectType

local ae_transitionInputIndex = {
    {'LumiLayer_40-blend', 'InputTex', 0},
    {'LumiLayer_40-blend', 'baseTex', 1},
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_durations = {
    ['LumiLayer_40-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 0.93333333333333}, },
            ['baseTex'] = {{0.93333333333333, 2}, },
        },
    },
    ['LumiMotionBlur2D_48-effect0'] = {
        ['nodeDuration'] = {{0, 0.93333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
        },
    },
    ['LumiLayer_48-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 0.93333333333333}, },
            ['baseTex'] = {{0, 2}, },
        },
    },
    ['LumiMotionBlur2D_52-effect0'] = {
        ['nodeDuration'] = {{0.93333333333333, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
        },
    },
    ['LumiLayer_52-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0.93333333333333, 2}, },
            ['baseTex'] = {{0, 2}, },
        },
    },
    ['LumiFill_56-effect0'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
        },
    },
    ['LumiLayer_56-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['baseTex'] = {{0, 2}, },
        },
    },
}
data.ae_durations = ae_durations

local ae_attribute = {
    ['LumiLayer_40-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Precomp',
        ['blendMode'] = 0,
    },
    ['LumiMotionBlur2D_48-effect0'] = {
        ['rotate'] = 0,
        ['ae_pre_rotate'] = 0,
        ['anchor'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_anchor'] = Amaz.Vector2f(0.5, 0.5),
        ['position'] = Amaz.Vector2f(0.65277777777778, 0.5),
        ['ae_pre_position'] = Amaz.Vector2f(0.65277777777778, 0.5),
        ['unifiedScale'] = false,
        ['scale_x'] = 1,
        ['ae_pre_scale_x'] = 1,
        ['scale_y'] = 1,
        ['ae_pre_scale_y'] = 1,
        ['vIntensity'] = 0.5,
        ['vCenter'] = -0.25,
        ['minSamples'] = 0.12,
        ['maxSamples'] = 0.24,
        ['mirrorEdge'] = true,
        ['dither'] = 1,
    },
    ['LumiLayer_48-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Adjustment',
        ['blendMode'] = 0,
    },
    ['LumiMotionBlur2D_52-effect0'] = {
        ['rotate'] = 0,
        ['ae_pre_rotate'] = 0,
        ['anchor'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_anchor'] = Amaz.Vector2f(0.5, 0.5),
        ['position'] = Amaz.Vector2f(0.49006750237237, 0.5),
        ['ae_pre_position'] = Amaz.Vector2f(0.49006750237237, 0.5),
        ['unifiedScale'] = false,
        ['scale_x'] = 1,
        ['ae_pre_scale_x'] = 1,
        ['scale_y'] = 1,
        ['ae_pre_scale_y'] = 1,
        ['vIntensity'] = 0.5,
        ['vCenter'] = -0.25,
        ['minSamples'] = 0.12,
        ['maxSamples'] = 0.24,
        ['mirrorEdge'] = true,
        ['dither'] = 1,
    },
    ['LumiLayer_52-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Adjustment',
        ['blendMode'] = 0,
    },
    ['LumiFill_56-effect0'] = {
        ['color'] = Amaz.Color(0, 0, 0, 1),
        ['opacity'] = 0,
        ['alpha'] = 1,
        ['reverse'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_56-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Adjustment',
        ['blendMode'] = 0,
    },
}
data.ae_attribute = ae_attribute

local ae_keyframes = {
    ['LumiMotionBlur2D_48-effect0#ae_pre_position#vector'] =
{
	{
		{0.947839, 0, 0.98947, 1, }, 
		{0.43333333333333, 0.94212233333333, }, 
		{{0.5, 0.5, }, {0.65277777777778, 0.5, }, {0.5, 0.5, }, {0.65277777777778, 0.5, }, }, 
		{6415, }, 
		{0, }, 
	}, 
},
    ['LumiMotionBlur2D_48-effect0#position#vector'] =
{
	{
		{0.947839, 0, 0.98947, 1, }, 
		{0.4, 0.908789, }, 
		{{0.5, 0.5, }, {0.65277777777778, 0.5, }, {0.5, 0.5, }, {0.65277777777778, 0.5, }, }, 
		{6415, }, 
		{0, }, 
	}, 
},
    ['LumiMotionBlur2D_52-effect0#ae_pre_position#vector'] =
{
	{
		{0.0001, 0, 0.070376, 1, }, 
		{0.94560533333333, 1.46666633333333, }, 
		{{0.35555555555556, 0.5, }, {0.5, 0.5, }, {0.35555555555556, 0.5, }, {0.5, 0.5, }, }, 
		{6415, }, 
		{0, }, 
	}, 
},
    ['LumiMotionBlur2D_52-effect0#position#vector'] =
{
	{
		{0.0001, 0, 0.070376, 1, }, 
		{0.912272, 1.433333, }, 
		{{0.35555555555556, 0.5, }, {0.5, 0.5, }, {0.35555555555556, 0.5, }, {0.5, 0.5, }, }, 
		{6415, }, 
		{0, }, 
	}, 
},
    ['LumiFill_56-effect0#opacity#number'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0.716667, 0.933333, }, 
		{{0, }, {0.69, }, }, 
		{6417, }, 
		{1, }, 
	}, 
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0.933333, 1.15, }, 
		{{0.69, }, {0, }, }, 
		{6417, }, 
		{1, }, 
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
