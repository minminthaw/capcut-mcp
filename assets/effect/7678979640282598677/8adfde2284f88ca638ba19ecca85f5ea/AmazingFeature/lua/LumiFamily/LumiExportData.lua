local data = {}

local ae_compDurations = {0, 2}
data.ae_compDurations = ae_compDurations

local ae_effectType = 'transition'
data.ae_effectType = ae_effectType

local ae_transitionInputIndex = {
    {'LumiLayer_41-trs', 'InputTex', 0},
    {'LumiLayer_42-trs-blend', 'InputTex', 1},
    {'LumiLayer_46-trs-blend', 'InputTex', 1},
    {'LumiLayer_47-trs-blend', 'InputTex', 1},
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_durations = {
    ['LumiLayer_41-trs'] = {
        ['nodeDuration'] = {{0, 2.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.03333333333333}, },
        },
    },
    ['LumiLayer_42-trs-blend'] = {
        ['nodeDuration'] = {{0, 2.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.03333333333333}, },
            ['baseTex'] = {{0, 2.03333333333333}, },
        },
    },
    ['LumiLayer_46-trs-blend'] = {
        ['nodeDuration'] = {{0, 2.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.03333333333333}, },
            ['baseTex'] = {{0, 2.03333333333333}, },
        },
    },
    ['LumiLayer_47-trs-blend'] = {
        ['nodeDuration'] = {{0, 2.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.03333333333333}, },
            ['baseTex'] = {{0, 2.03333333333333}, },
        },
    },
    ['LumiRadialBlur_121-effect0'] = {
        ['nodeDuration'] = {{0, 2.06666666666667}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.03333333333333}, },
        },
    },
    ['LumiRadialBlur_121-effect1'] = {
        ['nodeDuration'] = {{0, 2.06666666666667}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.06666666666667}, },
        },
    },
    ['LumiLayer_121-trs-blend'] = {
        ['nodeDuration'] = {{0, 2.06666666666667}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.06666666666667}, },
            ['baseTex'] = {{0, 2.03333333333333}, },
        },
    },
}
data.ae_durations = ae_durations

local ae_attribute = {
    ['LumiLayer_41-trs'] = {
        ['hasBlend'] = false,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(540, 540, 0),
        ['scale'] = Amaz.Vector3f(64.9999999999999, 64.9999999999999, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 90.0000000000002,
        ['opacity'] = 50,
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
    },
    ['LumiLayer_42-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(324.698766079274, -724.067827985124, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 149.883887169446,
        ['opacity'] = 50,
        ['active_cam_fovx'] = 39.6,
        ['p0_anchorPoint'] = Amaz.Vector3f(50, 50, 0),
        ['p0_position'] = Amaz.Vector3f(0, 750, 0),
        ['p0_scale'] = Amaz.Vector3f(100, 100, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = -8,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.6,
        ['p1_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p1_position'] = Amaz.Vector3f(540, 540, 0),
        ['p1_scale'] = Amaz.Vector3f(69.9999999999999, 69.9999999999999, 100),
        ['p1_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p1_xRotation'] = 0,
        ['p1_yRotation'] = 0,
        ['p1_rotation'] = 0,
        ['p1_opacity'] = 100,
        ['p1_active_cam_fovx'] = 39.6,
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
        ['position'] = Amaz.Vector3f(-0.6951349493562, -769.798866620872, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 150.76011964831,
        ['opacity'] = 50,
        ['active_cam_fovx'] = 39.6,
        ['p0_anchorPoint'] = Amaz.Vector3f(50, 50, 0),
        ['p0_position'] = Amaz.Vector3f(0, 750, 0),
        ['p0_scale'] = Amaz.Vector3f(100, 100, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = -8,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.6,
        ['p1_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p1_position'] = Amaz.Vector3f(540, 540, 0),
        ['p1_scale'] = Amaz.Vector3f(69.9999999999999, 69.9999999999999, 100),
        ['p1_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p1_xRotation'] = 0,
        ['p1_yRotation'] = 0,
        ['p1_rotation'] = 0,
        ['p1_opacity'] = 100,
        ['p1_active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_47-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(131.514280362645, -530.004242434304, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 76.5323042678492,
        ['opacity'] = 50,
        ['active_cam_fovx'] = 39.6,
        ['p0_anchorPoint'] = Amaz.Vector3f(50, 50, 0),
        ['p0_position'] = Amaz.Vector3f(0, 750, 0),
        ['p0_scale'] = Amaz.Vector3f(100, 100, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = -8,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.6,
        ['p1_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p1_position'] = Amaz.Vector3f(540, 540, 0),
        ['p1_scale'] = Amaz.Vector3f(69.9999999999999, 69.9999999999999, 100),
        ['p1_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p1_xRotation'] = 0,
        ['p1_yRotation'] = 0,
        ['p1_rotation'] = 0,
        ['p1_opacity'] = 100,
        ['p1_active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiRadialBlur_121-effect0'] = {
        ['blurType'] = 0,
        ['amount'] = 10,
        ['quality'] = 0.20000000298023,
        ['center'] = Amaz.Vector2f(0.5, 0.5),
        ['weightDecay'] = 0.965,
        ['dither'] = 1,
        ['blurAlpha'] = true,
        ['inverseGammaCorrection'] = false,
        ['borderType'] = 0,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiRadialBlur_121-effect1'] = {
        ['blurType'] = 5,
        ['amount'] = 5,
        ['quality'] = 0.20000000298023,
        ['center'] = Amaz.Vector2f(0.5, 0.5),
        ['weightDecay'] = 0.965,
        ['dither'] = 1,
        ['blurAlpha'] = true,
        ['inverseGammaCorrection'] = false,
        ['borderType'] = 0,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiLayer_121-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Adjustment',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(540, 540, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
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
}
data.ae_attribute = ae_attribute

local ae_keyframes = {
    ['LumiLayer_41-trs#scale#vector'] =
{
	{
		{0.74,0.74,0.74, 0,0,0.74, 0.26,0.26,0.26, 1,1,0.26, }, 
		{0, 1, }, 
		{{100, 100, 100, }, {30, 30, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_41-trs#rotation#number'] =
{
	{
		{0.74, 0, 0.26, 1, }, 
		{0, 1, }, 
		{{0, }, {180, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_41-trs#opacity#number'] =
{
	{
		{1, 0, 0, 1, }, 
		{0.233333, 0.766667, }, 
		{{100, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_42-trs-blend#position#vector'] =
{
	{
		{0.61, 0, 0.19, 1, }, 
		{0, 1.5, }, 
		{{154.37982572, -692.701051556, 0, }, {931.874152516, -835.888243022, 0, }, {283.962207922148, -716.565584026703, 0, }, {802.291770313852, -812.023710551297, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_42-trs-blend#rotation#number'] =
{
	{
		{0.61, 0, 0.19, 1, }, 
		{0, 1.5, }, 
		{{188, }, {14, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_42-trs-blend#opacity#number'] =
{
	{
		{1, 0, 0, 1, }, 
		{0.233333, 0.766667, }, 
		{{0, }, {100, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_42-trs-blend#p0_position#vector'] =
{
	{
		{0.65, 0, 0.35, 1, }, 
		{1.166667, 1.966667, }, 
		{{0, 750, 0, }, {0, 0, 0, }, {0, 625, 0, }, {0, 125, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_42-trs-blend#p0_scale#vector'] =
{
	{
		{0.65,0.65,0.65, 0,0,0.65, 0.35,0.35,0.35, 1,1,0.35, }, 
		{1.166667, 1.966667, }, 
		{{100, 100, 100, }, {250, 250, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_42-trs-blend#p0_rotation#number'] =
{
	{
		{0.65, 0, 0.35, 1, }, 
		{1.166667, 1.966667, }, 
		{{-8, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_42-trs-blend#p1_scale#vector'] =
{
	{
		{0.74,0.74,0.74, 0,0,0.74, 0.26,0.26,0.26, 1,1,0.26, }, 
		{0, 1, }, 
		{{100, 100, 100, }, {40, 40, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_46-trs-blend#position#vector'] =
{
	{
		{0.61, 0, 0.19, 1, }, 
		{0, 1.5, }, 
		{{154.37982572, -692.701051556, 0, }, {-553.527950596, -1044.647894462, 0, }, {36.3951989499805, -751.358857952484, 0, }, {-435.54332382598, -985.990088065516, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_46-trs-blend#rotation#number'] =
{
	{
		{0.61, 0, 0.19, 1, }, 
		{0, 1.5, }, 
		{{188, }, {18, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_46-trs-blend#opacity#number'] =
{
	{
		{1, 0, 0, 1, }, 
		{0.233333, 0.766667, }, 
		{{0, }, {100, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_46-trs-blend#p0_position#vector'] =
{
	{
		{0.65, 0, 0.35, 1, }, 
		{1.166667, 1.966667, }, 
		{{0, 750, 0, }, {0, 0, 0, }, {0, 625, 0, }, {0, 125, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_46-trs-blend#p0_scale#vector'] =
{
	{
		{0.65,0.65,0.65, 0,0,0.65, 0.35,0.35,0.35, 1,1,0.35, }, 
		{1.166667, 1.966667, }, 
		{{100, 100, 100, }, {250, 250, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_46-trs-blend#p0_rotation#number'] =
{
	{
		{0.65, 0, 0.35, 1, }, 
		{1.166667, 1.966667, }, 
		{{-8, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_46-trs-blend#p1_scale#vector'] =
{
	{
		{0.74,0.74,0.74, 0,0,0.74, 0.26,0.26,0.26, 1,1,0.26, }, 
		{0, 1, }, 
		{{100, 100, 100, }, {40, 40, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_47-trs-blend#position#vector'] =
{
	{
		{0.61, 0, 0.19, 1, }, 
		{0, 1.5, }, 
		{{154.37982572, -692.701051556, 0, }, {50, 50, 0, }, {136.983188757109, -568.917543255219, 0, }, {67.3966369628906, -73.7835083007812, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_47-trs-blend#rotation#number'] =
{
	{
		{0.61, 0, 0.19, 1, }, 
		{0, 1.5, }, 
		{{98, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_47-trs-blend#opacity#number'] =
{
	{
		{1, 0, 0, 1, }, 
		{0.233333, 0.766667, }, 
		{{0, }, {100, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_47-trs-blend#p0_position#vector'] =
{
	{
		{0.65, 0, 0.35, 1, }, 
		{1.166667, 1.966667, }, 
		{{0, 750, 0, }, {0, 0, 0, }, {0, 625, 0, }, {0, 125, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_47-trs-blend#p0_scale#vector'] =
{
	{
		{0.65,0.65,0.65, 0,0,0.65, 0.35,0.35,0.35, 1,1,0.35, }, 
		{1.166667, 1.966667, }, 
		{{100, 100, 100, }, {250, 250, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_47-trs-blend#p0_rotation#number'] =
{
	{
		{0.65, 0, 0.35, 1, }, 
		{1.166667, 1.966667, }, 
		{{-8, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_47-trs-blend#p1_scale#vector'] =
{
	{
		{0.74,0.74,0.74, 0,0,0.74, 0.26,0.26,0.26, 1,1,0.26, }, 
		{0, 1, }, 
		{{100, 100, 100, }, {40, 40, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiRadialBlur_121-effect0#amount#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0, 0.5, }, 
		{{0, }, {10, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.5, 1, }, 
		{{10, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiRadialBlur_121-effect1#amount#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0, 0.5, }, 
		{{0, }, {5, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.5, 1, }, 
		{{5, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_121-trs-blend#opacity#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{1, 1.5, }, 
		{{100, }, {0, }, }, 
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
