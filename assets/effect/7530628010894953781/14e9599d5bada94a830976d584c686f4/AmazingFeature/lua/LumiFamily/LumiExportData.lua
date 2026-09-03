local data = {}

local ae_compDurations = {0, 2}
data.ae_compDurations = ae_compDurations

local ae_effectType = 'transition'
data.ae_effectType = ae_effectType

local ae_transitionInputIndex = {
    {'LumiChromaticAberration_38-effect0', 'InputTex', 1},
    {'LumiChromaticAberration_37-effect0', 'InputTex', 0},
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_durations = {
    ['LumiChromaticAberration_38-effect0'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
        },
    },
    ['LumiTwirl_38-effect1'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
        },
    },
    ['LumiLayer_38-trs'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
        },
    },
    ['LumiChromaticAberration_37-effect0'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
        },
    },
    ['LumiTwirl_37-effect1'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
        },
    },
    ['LumiLayer_37-trs-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['baseTex'] = {{0, 2}, },
        },
    },
    ['LumiCCLens_47-effect1'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
        },
    },
    ['LumiLayer_47-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['baseTex'] = {{0, 2}, },
        },
    },
}
data.ae_durations = ae_durations

local ae_attribute = {
    ['LumiChromaticAberration_38-effect0'] = {
        ['offsetX'] = 1,
        ['offsetY'] = 1,
        ['AEDesignSize'] = Amaz.Vector2f(1920, 1080),
    },
    ['LumiTwirl_38-effect1'] = {
        ['angle'] = 90,
        ['radius'] = 30,
        ['center'] = Amaz.Vector2f(0.5, 0.5),
        ['AEDesignSize'] = Amaz.Vector2f(1920, 1080),
    },
    ['LumiLayer_38-trs'] = {
        ['hasBlend'] = false,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(960, 540, 0),
        ['position'] = Amaz.Vector3f(960, 540, 0),
        ['scale'] = Amaz.Vector3f(1000, 999.999999999999, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 90,
        ['opacity'] = 0,
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1920, 1080),
        ['layerSize'] = Amaz.Vector2f(1920, 1080),
        ['mirrorEdge'] = false,
    },
    ['LumiChromaticAberration_37-effect0'] = {
        ['offsetX'] = 0,
        ['offsetY'] = 0,
        ['AEDesignSize'] = Amaz.Vector2f(1920, 1080),
    },
    ['LumiTwirl_37-effect1'] = {
        ['angle'] = 0,
        ['radius'] = 30,
        ['center'] = Amaz.Vector2f(0.5, 0.5),
        ['AEDesignSize'] = Amaz.Vector2f(1920, 1080),
    },
    ['LumiLayer_37-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(960, 540, 0),
        ['position'] = Amaz.Vector3f(960, 540, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1920, 1080),
        ['layerSize'] = Amaz.Vector2f(1920, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiCCLens_47-effect1'] = {
        ['convergence'] = 0,
        ['radius'] = 100,
        ['center'] = Amaz.Vector2f(0.5, 0.5),
        ['AEDesignSize'] = Amaz.Vector2f(1920, 1080),
    },
    ['LumiLayer_47-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Adjustment',
        ['blendMode'] = 0,
    },
}
data.ae_attribute = ae_attribute

local ae_keyframes = {
    ['LumiChromaticAberration_38-effect0#offsetX#number'] =
{
	{
		{0.100480477, 0, 0.005374749, 1, }, 
		{1, 1.666667, }, 
		{{1, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiChromaticAberration_38-effect0#offsetY#number'] =
{
	{
		{0.100293795, 0, 0, 1, }, 
		{1, 1.666667, }, 
		{{1, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiTwirl_38-effect1#angle#number'] =
{
	{
		{0.33333333, 0, 0.299497647, 1, }, 
		{1, 1.666667, }, 
		{{90, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_38-trs#scale#vector'] =
{
	{
		{0.064315038,0.064315038,0.33333333, 0.765812518,0.765812518,0.33333333, 0,0,0.833333333, 1,1,0.833333333, }, 
		{1, 2, }, 
		{{1000, 1000, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_38-trs#rotation#number'] =
{
	{
		{0.201359706, 0.875114917, 0.005374749, 1, }, 
		{1, 1.666667, }, 
		{{90, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_38-trs#opacity#number'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0.966667, 1.033333, }, 
		{{0, }, {100, }, }, 
		{6417, }, 
		{1, }, 
	}, 
},
    ['LumiChromaticAberration_37-effect0#offsetX#number'] =
{
	{
		{1, 0, 0.66666667, 1, }, 
		{0.666667, 1, }, 
		{{0, }, {0.75, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiChromaticAberration_37-effect0#offsetY#number'] =
{
	{
		{1, 0, 0.66666667, 1, }, 
		{0.666667, 1, }, 
		{{0, }, {0.75, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiTwirl_37-effect1#angle#number'] =
{
	{
		{0.795686619, 0, 0.66666667, 1, }, 
		{0.666667, 1, }, 
		{{0, }, {-90, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_37-trs-blend#scale#vector'] =
{
	{
		{0.90641433,0.90641433,0.33333333, 0,0,0.33333333, 0.800117834,0.800117834,0.66666667, 0.611325808,0.611325808,0.66666667, }, 
		{0.666667, 1, }, 
		{{100, 100, 100, }, {1000, 1000, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_37-trs-blend#rotation#number'] =
{
	{
		{0.90659225, 0, 0.801021369, 0.082699516, }, 
		{0.666667, 1, }, 
		{{0, }, {-60, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_37-trs-blend#opacity#number'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0.966667, 1.033333, }, 
		{{100, }, {0, }, }, 
		{6417, }, 
		{1, }, 
	}, 
},
    ['LumiCCLens_47-effect1#convergence#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.666667, 1, }, 
		{{0, }, {80, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.33333333, 0, 0, 1, }, 
		{1, 1.833333, }, 
		{{80, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiCCLens_47-effect1#radius#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.666667, 1, }, 
		{{100, }, {110, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.33333333, 0, 0, 1, }, 
		{1, 1.833333, }, 
		{{110, }, {100, }, }, 
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
