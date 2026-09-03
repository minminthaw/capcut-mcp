local data = {}

local ae_compDurations = {0, 3}
data.ae_compDurations = ae_compDurations

local ae_effectType = 'effect'
data.ae_effectType = ae_effectType

local ae_transitionInputIndex = {
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_durations = {
    ['LumiFill_31-effect0'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_32-trs-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_43-trs'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_44-trs-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_45-trs-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_46-trs-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
}
data.ae_durations = ae_durations

local ae_attribute = {
    ['LumiFill_31-effect0'] = {
        ['color'] = Amaz.Color(1, 1, 1, 1),
        ['opacity'] = 1,
        ['alpha'] = 1,
        ['reverse'] = false,
        ['blendMode'] = 0,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiLayer_32-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(540, 540, 0),
        ['scale'] = Amaz.Vector3f(95, 95, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_43-trs'] = {
        ['hasBlend'] = false,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(540, 540, 300),
        ['scale'] = Amaz.Vector3f(0, 0, 0),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = -90,
        ['yRotation'] = -90,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527100237,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
    },
    ['LumiLayer_44-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(540, 540, 200),
        ['scale'] = Amaz.Vector3f(0, 0, 0),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = -90,
        ['yRotation'] = -90,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527100237,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_45-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(540, 540, 100),
        ['scale'] = Amaz.Vector3f(0, 0, 0),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = -90,
        ['yRotation'] = -90,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527100237,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_46-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(540, 540, 0),
        ['scale'] = Amaz.Vector3f(0, 0, 0),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = -90,
        ['yRotation'] = -90,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527100237,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
}
data.ae_attribute = ae_attribute

local ae_keyframes = {
    ['LumiLayer_43-trs#scale#vector'] =
{
	{
		{0.33333333,0.33333333,0.33333333, 0,0,0, 0.66666667,0.66666667,0.66666667, 1,1,1, }, 
		{0, 1, }, 
		{{0, 0, 0, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_43-trs#xRotation#number'] =
{
	{
		{0.33333333, 0, 0.100873722, 1.000000093, }, 
		{0, 1, }, 
		{{-90, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_43-trs#yRotation#number'] =
{
	{
		{0.33333333, 0, 0.100873722, 1.000000093, }, 
		{0, 1, }, 
		{{-90, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_44-trs-blend#scale#vector'] =
{
	{
		{0.33333333,0.33333333,0.33333333, 0,0,0, 0.66666667,0.66666667,0.66666667, 1,1,1, }, 
		{0.166667, 1.166667, }, 
		{{0, 0, 0, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_44-trs-blend#xRotation#number'] =
{
	{
		{0.33333333, 0, 0.100873722, 1.000000093, }, 
		{0.166667, 1.166667, }, 
		{{-90, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_44-trs-blend#yRotation#number'] =
{
	{
		{0.33333333, 0, 0.100873722, 1.000000093, }, 
		{0.166667, 1.166667, }, 
		{{-90, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_45-trs-blend#scale#vector'] =
{
	{
		{0.33333333,0.33333333,0.33333333, 0,0,0, 0.66666667,0.66666667,0.66666667, 1,1,1, }, 
		{0.333333, 1.333333, }, 
		{{0, 0, 0, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_45-trs-blend#xRotation#number'] =
{
	{
		{0.33333333, 0, 0.100873722, 1.000000093, }, 
		{0.333333, 1.333333, }, 
		{{-90, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_45-trs-blend#yRotation#number'] =
{
	{
		{0.33333333, 0, 0.100873722, 1.000000093, }, 
		{0.333333, 1.333333, }, 
		{{-90, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_46-trs-blend#scale#vector'] =
{
	{
		{0.33333333,0.33333333,0.33333333, 0,0,0, 0.66666667,0.66666667,0.66666667, 1,1,1, }, 
		{0.5, 1.5, }, 
		{{0, 0, 0, }, {105.5, 105.5, 105.5, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_46-trs-blend#xRotation#number'] =
{
	{
		{0.33333333, 0, 0.100873722, 1.000000093, }, 
		{0.5, 1.5, }, 
		{{-90, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_46-trs-blend#yRotation#number'] =
{
	{
		{0.33333333, 0, 0.100873722, 1.000000093, }, 
		{0.5, 1.5, }, 
		{{-90, }, {0, }, }, 
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
    animationMode = 2,
    loopStart = 0,
    speedInfo = {1, 0.5, 2, },
}
data.ae_animationInfos = ae_animationInfos

return data
