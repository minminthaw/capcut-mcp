local data = {}

local ae_compDurations = {0, 3}
data.ae_compDurations = ae_compDurations

local ae_effectType = 'effect'
data.ae_effectType = ae_effectType

local ae_transitionInputIndex = {
    {'LumiFill_522-effect0', 'InputTex', 0},
    {'LumiLayer_523-trs-blend', 'InputTex', 0},
    {'LumiLayer_534-trs-blend', 'baseTex', 0},
    {'LumiLayer_567-blend', 'InputTex', 0},
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_durations = {
    ['LumiFill_522-effect0'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_522-trs'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_523-trs-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_534-trs-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.8}, },
            ['baseTex'] = {{0, 2.93333333333333}, },
        },
    },
    ['LumiLayer_535-trs-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.8}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_536-trs-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.8}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_537-trs-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.8}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_538-trs-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_567-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{2.9, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
}
data.ae_durations = ae_durations

local ae_attribute = {
    ['LumiFill_522-effect0'] = {
        ['color'] = Amaz.Color(1, 1, 1, 1),
        ['opacity'] = 1,
        ['alpha'] = 1,
        ['reverse'] = false,
        ['blendMode'] = 0,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiLayer_522-trs'] = {
        ['hasBlend'] = false,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(540, 540, 0),
        ['scale'] = Amaz.Vector3f(91.3500000000001, 95.7, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
    },
    ['LumiLayer_523-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(540, 526, 0),
        ['scale'] = Amaz.Vector3f(87, 87, 100),
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
    ['LumiLayer_534-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(186.018110662496, 227.003276299353, 82.0452771086359),
        ['scale'] = Amaz.Vector3f(55, 55, 55),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = -11.1085119865457,
        ['rotation'] = -4,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527100237,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_535-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(994.224810043514, 200.952620266594, 82.1140706614637),
        ['scale'] = Amaz.Vector3f(55, 55, 55),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 15.9951701288429,
        ['rotation'] = 4,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527100237,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_536-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(145.261051958418, 1004.11281998739, 82.1777451930251),
        ['scale'] = Amaz.Vector3f(55, 55, 55),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = -23.5727216021772,
        ['rotation'] = 7,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527100237,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_537-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(1074.84464500869, 1063.17562887907, 82.3403250961411),
        ['scale'] = Amaz.Vector3f(55, 55, 55),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 48.9225855635219,
        ['rotation'] = -6,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527100237,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_538-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(540, 540, -340),
        ['scale'] = Amaz.Vector3f(2.73252545510836, 2.73252545510836, 2.73252545510836),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = -182.577302127084,
        ['rotation'] = -8,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527100237,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_567-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Precomp',
        ['blendMode'] = 0,
    },
}
data.ae_attribute = ae_attribute

local ae_keyframes = {
    ['LumiLayer_534-trs-blend#position#vector'] =
{
	{
		{0.333333, 0, 0, 1, }, 
		{0, 1.4, }, 
		{{-331.269191364, -75.062301523, 84, }, {198, 234, 82, }, {-331.269191364, -75.062301523, 84, }, {198, 234, 82, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_534-trs-blend#yRotation#number'] =
{
	{
		{0.33333333, 0, 0, 0.999999723, }, 
		{0.266667, 1.666667, }, 
		{{-125, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_535-trs-blend#position#vector'] =
{
	{
		{0.333333, 0, 0, 1, }, 
		{0.166667, 1.566667, }, 
		{{1427.799385872, -147.023541432, 84, }, {968, 222, 82, }, {1427.799385872, -147.023541432, 84, }, {968, 222, 82, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_535-trs-blend#yRotation#number'] =
{
	{
		{0.33333333, 0, 0, 1.000000368, }, 
		{0.433333, 1.833333, }, 
		{{94, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_536-trs-blend#position#vector'] =
{
	{
		{0.333333, 0, 0, 1, }, 
		{0.266667, 1.666667, }, 
		{{-374.917808555, 1148.798330882, 84, }, {196, 990, 82, }, {-374.917808555, 1148.798330882, 84, }, {196, 990, 82, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_536-trs-blend#yRotation#number'] =
{
	{
		{0.33333333, 0, 0, 0.999999639, }, 
		{0.533333, 1.933333, }, 
		{{-96, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_537-trs-blend#position#vector'] =
{
	{
		{0.333333, 0, 0, 1, }, 
		{0.433333, 1.833333, }, 
		{{1410.581653186, 1400.526757288, 84, }, {1006, 994, 82, }, {1410.581653186, 1400.526757288, 84, }, {1006, 994, 82, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_537-trs-blend#yRotation#number'] =
{
	{
		{0.33333333, 0, 0, 1.00000033, }, 
		{0.7, 2.1, }, 
		{{105, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_538-trs-blend#position#vector'] =
{
	{
		{0.333333, 0, 0, 1, }, 
		{2.466667, 2.966667, }, 
		{{540, 540, -340, }, {540, 552, -268, }, {540, 540, -340, }, {540, 552, -268, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_538-trs-blend#scale#vector'] =
{
	{
		{0.33333333,0.33333333,0.33333333, 0,0,0, 0,0,0, 0.654865224,0.654865224,0.654865224, }, 
		{0.966667, 1.8, }, 
		{{0, 0, 0, }, {55, 55, 55, }, }, 
		{6414, }, 
		{0, }, 
	}, 
	{
		{0.33333333,0.33333333,0.33333333, 0.297763333,0.297763333,0.297763333, 0.66666667,0.66666667,0.66666667, 0.875999342,0.875999342,0.875999342, }, 
		{1.8, 2.466667, }, 
		{{55, 55, 55, }, {72, 72, 72, }, }, 
		{6414, }, 
		{0, }, 
	}, 
	{
		{0.33333333,0.33333333,0.33333333, 0.068739495,0.068739495,0.068739495, 0,0,0, 0.999999654,0.999999654,0.999999654, }, 
		{2.466667, 2.966667, }, 
		{{72, 72, 72, }, {95, 95, 95, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_538-trs-blend#yRotation#number'] =
{
	{
		{0.33333333, 0, 0, 0.91371619, }, 
		{0.966667, 1.8, }, 
		{{-195, }, {-11, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.33333333, 0.384878083, 0.66666667, 1, }, 
		{1.8, 2.466667, }, 
		{{-11, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_538-trs-blend#rotation#number'] =
{
	{
		{0.271351736, 1.9e-8, 0.709352937, 1.032851188, }, 
		{1.866667, 2.533333, }, 
		{{-8, }, {-2, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.33333333, -0.073468047, 0, 0.999996552, }, 
		{2.533333, 2.966667, }, 
		{{-2, }, {0, }, }, 
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
    animationMode = 1,
    loopStart = 0,
    speedInfo = {1, 0.5, 2, },
}
data.ae_animationInfos = ae_animationInfos

return data
