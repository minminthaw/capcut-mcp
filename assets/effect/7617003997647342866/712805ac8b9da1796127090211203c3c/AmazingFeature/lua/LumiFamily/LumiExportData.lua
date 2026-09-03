local data = {}

local ae_compDurations = {0, 2}
data.ae_compDurations = ae_compDurations

local ae_effectType = 'transition'
data.ae_effectType = ae_effectType

local ae_transitionInputIndex = {
    {'LumiRoundCorner_52-effect0', 'InputTex', 1},
    {'LumiTone_77-effect0', 'InputTex', 0},
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_durations = {
    ['LumiRoundCorner_52-effect0'] = {
        ['nodeDuration'] = {{0, 2.33333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.33333333333333}, },
        },
    },
    ['LumiLayer_52-trs'] = {
        ['nodeDuration'] = {{0, 2.33333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.33333333333333}, },
        },
    },
    ['LumiTone_77-effect0'] = {
        ['nodeDuration'] = {{0, 2.33333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.33333333333333}, },
        },
    },
    ['LumiLayer_53-trs-blend'] = {
        ['nodeDuration'] = {{0, 2.33333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.33333333333333}, },
            ['baseTex'] = {{0, 2.33333333333333}, },
        },
    },
    ['LumiLayer_55-trs-blend'] = {
        ['nodeDuration'] = {{0, 2.33333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.33333333333333}, },
            ['baseTex'] = {{0, 2.33333333333333}, },
        },
    },
    ['LumiLayer_56-trs-blend'] = {
        ['nodeDuration'] = {{0, 2.33333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.33333333333333}, },
            ['baseTex'] = {{0, 2.33333333333333}, },
        },
    },
    ['LumiLayer_57-trs-blend'] = {
        ['nodeDuration'] = {{0, 2.33333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.33333333333333}, },
            ['baseTex'] = {{0, 2.33333333333333}, },
        },
    },
    ['LumiChromaticAberration_60-effect0'] = {
        ['nodeDuration'] = {{0, 2.06666666666667}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.33333333333333}, },
        },
    },
    ['LumiLayer_60-blend'] = {
        ['nodeDuration'] = {{0, 2.33333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.06666666666667}, },
            ['baseTex'] = {{0, 2.33333333333333}, },
        },
    },
}
data.ae_durations = ae_durations

local ae_attribute = {
    ['LumiRoundCorner_52-effect0'] = {
        ['radius'] = 50,
        ['fade'] = 0,
        ['fadeType'] = 0,
        ['AEDesignSize'] = Amaz.Vector2f(1920, 1080),
    },
    ['LumiLayer_52-trs'] = {
        ['hasBlend'] = false,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(960, 540, 0),
        ['position'] = Amaz.Vector3f(960, 540, 0),
        ['scale'] = Amaz.Vector3f(60, 60, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1920, 1080),
        ['layerSize'] = Amaz.Vector2f(1920, 1080),
        ['mirrorEdge'] = false,
    },
    ['LumiTone_77-effect0'] = {
        ['amount'] = 1,
        ['whiteColor'] = Amaz.Color(0.33725491166115, 0.33725491166115, 0.33725491166115, 1),
        ['blackColor'] = Amaz.Color(0, 0, 0, 1),
        ['AEDesignSize'] = Amaz.Vector2f(1920, 1080),
    },
    ['LumiLayer_53-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(960, 540, 0),
        ['position'] = Amaz.Vector3f(881.248576938904, 540, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 85.7142857142857,
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1920, 1080),
        ['layerSize'] = Amaz.Vector2f(1920, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_55-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(960, 540, 0),
        ['position'] = Amaz.Vector3f(634.102025702302, 540, 0),
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
    ['LumiLayer_56-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(960, 540, 0),
        ['position'] = Amaz.Vector3f(9.30385299674879, 540, 0),
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
    ['LumiLayer_57-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(960, 540, 0),
        ['position'] = Amaz.Vector3f(-771, 540, 0),
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
    ['LumiChromaticAberration_60-effect0'] = {
        ['offsetX'] = 0.10000000112888,
        ['offsetY'] = 0.10000000112888,
        ['AEDesignSize'] = Amaz.Vector2f(1920, 1080),
    },
    ['LumiLayer_60-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Adjustment',
        ['blendMode'] = 0,
    },
}
data.ae_attribute = ae_attribute

local ae_keyframes = {
    ['LumiRoundCorner_52-effect0#radius#number'] =
{
	{
		{0.74, 0, 0.26, 1, }, 
		{1.266667, 1.666667, }, 
		{{50, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_52-trs#scale#vector'] =
{
	{
		{0.74,0.74,0.74, 0,0,0.74, 0.26,0.26,0.26, 1,1,0.26, }, 
		{1, 1.666667, }, 
		{{60, 60, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiTone_77-effect0#amount#number'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0, 0.233333, }, 
		{{0, }, {1, }, }, 
		{6417, }, 
		{1, }, 
	}, 
},
    ['LumiTone_77-effect0#whiteColor#color'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{1.266667, 1.533333, }, 
		{{0.337255, 0.337255, 0.337255, 1, }, {0, 0, 0, 1, }, }, 
		{6418, }, 
		{1, }, 
	}, 
},
    ['LumiLayer_53-trs-blend#position#vector'] =
{
	{
		{0.15, 0, 0.11, 1, }, 
		{0, 0.666667, }, 
		{{-771, 540, 0, }, {960, 540, 0, }, {-771, 540, 0, }, {960, 540, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_53-trs-blend#opacity#number'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0.433333, 0.666667, }, 
		{{100, }, {0, }, }, 
		{6417, }, 
		{1, }, 
	}, 
},
    ['LumiLayer_55-trs-blend#position#vector'] =
{
	{
		{0.15, 0, 0.11, 1, }, 
		{0.166667, 0.833333, }, 
		{{-771, 540, 0, }, {960, 540, 0, }, {-771, 540, 0, }, {960, 540, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_55-trs-blend#opacity#number'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0.6, 0.833333, }, 
		{{100, }, {0, }, }, 
		{6417, }, 
		{1, }, 
	}, 
},
    ['LumiLayer_56-trs-blend#position#vector'] =
{
	{
		{0.15, 0, 0.11, 1, }, 
		{0.333333, 1, }, 
		{{-771, 540, 0, }, {960, 540, 0, }, {-771, 540, 0, }, {960, 540, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_56-trs-blend#opacity#number'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0.766667, 1, }, 
		{{100, }, {0, }, }, 
		{6417, }, 
		{1, }, 
	}, 
},
    ['LumiLayer_57-trs-blend#position#vector'] =
{
	{
		{0.15, 0, 0.11, 1, }, 
		{0.5, 1.166667, }, 
		{{-771, 540, 0, }, {960, 540, 0, }, {-771, 540, 0, }, {960, 540, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiChromaticAberration_60-effect0#offsetX#number'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0, 0.2, }, 
		{{0, }, {0.1, }, }, 
		{6417, }, 
		{1, }, 
	}, 
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0.2, 1.3, }, 
		{{0.1, }, {0.1, }, }, 
		{6417, }, 
		{1, }, 
	}, 
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{1.3, 1.5, }, 
		{{0.1, }, {0, }, }, 
		{6417, }, 
		{1, }, 
	}, 
},
    ['LumiChromaticAberration_60-effect0#offsetY#number'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0, 0.2, }, 
		{{0, }, {0.1, }, }, 
		{6417, }, 
		{1, }, 
	}, 
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0.2, 1.3, }, 
		{{0.1, }, {0.1, }, }, 
		{6417, }, 
		{1, }, 
	}, 
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{1.3, 1.5, }, 
		{{0.1, }, {0, }, }, 
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
