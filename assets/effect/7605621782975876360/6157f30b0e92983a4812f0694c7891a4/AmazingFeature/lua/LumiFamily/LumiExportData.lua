local data = {}

local ae_compDurations = {0, 3}
data.ae_compDurations = ae_compDurations

local ae_effectType = 'effect'
data.ae_effectType = ae_effectType

local ae_transitionInputIndex = {
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_durations = {
    ['LumiSaturation_45-effect0'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_45-trs'] = {
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
    ['LumiLayer_55-trs-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_71-trs-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_28-trs-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_29-trs-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_35-trs-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_76-trs-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
    ['LumiLayer_74-blend'] = {
        ['nodeDuration'] = {{0, 3}, },
        ['texDuration'] = {
            ['InputTex'] = {{2.63333333333333, 3}, },
            ['baseTex'] = {{0, 3}, },
        },
    },
}
data.ae_durations = ae_durations

local ae_attribute = {
    ['LumiSaturation_45-effect0'] = {
        ['saturationIntensity'] = -1,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiLayer_45-trs'] = {
        ['hasBlend'] = false,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(540, 540, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
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
        ['layerType'] = 'Solid',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(540, 540, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527100237,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_55-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Solid',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(540, 1631, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 45,
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_71-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(2.27373675443232e-13, 3.41060513164848e-13, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527100237,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(-4.54747350886464e-13, -4.54747350886464e-13, 0),
        ['p0_scale'] = Amaz.Vector3f(222.222222222222, 222.222222222222, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = 0,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.5977527100237,
        ['p1_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p1_position'] = Amaz.Vector3f(540, 540, 0),
        ['p1_scale'] = Amaz.Vector3f(45, 45, 100),
        ['p1_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p1_xRotation'] = 0,
        ['p1_yRotation'] = 0,
        ['p1_rotation'] = 0,
        ['p1_opacity'] = 100,
        ['p1_active_cam_fovx'] = 39.5977527100237,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_28-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(1126.32171630859, 0, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 180,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527100237,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(-4.54747350886464e-13, -4.54747350886464e-13, 0),
        ['p0_scale'] = Amaz.Vector3f(222.222222222222, 222.222222222222, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = 0,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.5977527100237,
        ['p1_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p1_position'] = Amaz.Vector3f(540, 540, 0),
        ['p1_scale'] = Amaz.Vector3f(45, 45, 100),
        ['p1_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p1_xRotation'] = 0,
        ['p1_yRotation'] = 0,
        ['p1_rotation'] = 0,
        ['p1_opacity'] = 100,
        ['p1_active_cam_fovx'] = 39.5977527100237,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_29-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(-1119.65710449219, 0, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 180,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527100237,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(-4.54747350886464e-13, -4.54747350886464e-13, 0),
        ['p0_scale'] = Amaz.Vector3f(222.222222222222, 222.222222222222, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = 0,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.5977527100237,
        ['p1_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p1_position'] = Amaz.Vector3f(540, 540, 0),
        ['p1_scale'] = Amaz.Vector3f(45, 45, 100),
        ['p1_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p1_xRotation'] = 0,
        ['p1_yRotation'] = 0,
        ['p1_rotation'] = 0,
        ['p1_opacity'] = 100,
        ['p1_active_cam_fovx'] = 39.5977527100237,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_35-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(-2237.80833435059, 0, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527100237,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(-4.54747350886464e-13, -4.54747350886464e-13, 0),
        ['p0_scale'] = Amaz.Vector3f(222.222222222222, 222.222222222222, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = 0,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.5977527100237,
        ['p1_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p1_position'] = Amaz.Vector3f(540, 540, 0),
        ['p1_scale'] = Amaz.Vector3f(45, 45, 100),
        ['p1_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p1_xRotation'] = 0,
        ['p1_yRotation'] = 0,
        ['p1_rotation'] = 0,
        ['p1_opacity'] = 100,
        ['p1_active_cam_fovx'] = 39.5977527100237,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_76-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(-3356.54599365761, 0, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 180,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527100237,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(-4.54747350886464e-13, -4.54747350886464e-13, 0),
        ['p0_scale'] = Amaz.Vector3f(222.222222222222, 222.222222222222, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = 0,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.5977527100237,
        ['p1_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p1_position'] = Amaz.Vector3f(540, 540, 0),
        ['p1_scale'] = Amaz.Vector3f(45, 45, 100),
        ['p1_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p1_xRotation'] = 0,
        ['p1_yRotation'] = 0,
        ['p1_rotation'] = 0,
        ['p1_opacity'] = 100,
        ['p1_active_cam_fovx'] = 39.5977527100237,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_74-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Precomp',
        ['blendMode'] = 0,
    },
}
data.ae_attribute = ae_attribute

local ae_keyframes = {
    ['LumiLayer_45-trs#scale#vector'] =
{
	{
		{0.33333333,0.33333333,0.33333333, 0,0,0.33333333, 0,0,0.66666667, 0.999999983,0.999999983,0.66666667, }, 
		{0.433333, 0.933333, }, 
		{{100, 100, 100, }, {120, 120, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
	{
		{0.33333333,0.33333333,0.33333333, 0.33333333,0.33333333,0.33333333, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0.933333, 2.033333, }, 
		{{120, 120, 100, }, {120, 120, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0,0,0.166666667, 0.833333333,0.833333333,0.833333333, 1,1,0.833333333, }, 
		{2.033333, 2.666667, }, 
		{{120, 120, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_44-trs-blend#scale#vector'] =
{
	{
		{0.33333333,0.33333333,0.33333333, 0.33333333,0,0.33333333, 0.2,0.2,0.1, 0.2,1,0.1, }, 
		{0.433333, 0.933333, }, 
		{{100, 100, 100, }, {100, 50, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
	{
		{0.33333333,0.33333333,0.33333333, 0.33333333,0.33333333,0.33333333, 0.66666667,0.66666667,0.66666667, 0.66666667,0.66666667,0.66666667, }, 
		{0.933333, 2.033333, }, 
		{{100, 50, 100, }, {100, 50, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
	{
		{0.85,0.85,0.85, 0.85,0,0.85, 0.66666667,0.66666667,0.66666667, 0.66666667,1,0.66666667, }, 
		{2.033333, 2.666667, }, 
		{{100, 50, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_55-trs-blend#position#vector'] =
{
	{
		{0.333333, 0, 0.666667, 1, }, 
		{0.6, 1.333333, }, 
		{{540, 1631, 0, }, {540, 540, 0, }, {540, 1631, 0, }, {540, 540, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_71-trs-blend#p0_position#vector'] =
{
	{
		{0.333333, 0, 0.666667, 1, }, 
		{1.666667, 2.2, }, 
		{{0, 0, 0, }, {2238.208567643, 0, 0, }, {373.034759521484, 7.57912274064985e-14, 0, }, {1865.17380812152, -7.57912274064985e-14, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_71-trs-blend#p0_scale#vector'] =
{
	{
		{0.33333333,0.33333333,0.33333333, 0,0,0.33333333, 0.2,0.2,0.2, 1,1,0.2, }, 
		{0.433333, 0.933333, }, 
		{{222.222222222, 222.222222222, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_71-trs-blend#p1_scale#vector'] =
{
	{
		{0.85,0.85,0.85, 0,0,0.85, 0.66666667,0.66666667,0.66666667, 1,1,0.66666667, }, 
		{2.066667, 2.666667, }, 
		{{45, 45, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_28-trs-blend#p0_position#vector'] =
{
	{
		{0.333333, 0, 0.666667, 1, }, 
		{1.666667, 2.2, }, 
		{{0, 0, 0, }, {2238.208567643, 0, 0, }, {373.034759521484, 7.57912274064985e-14, 0, }, {1865.17380812152, -7.57912274064985e-14, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_28-trs-blend#p0_scale#vector'] =
{
	{
		{0.33333333,0.33333333,0.33333333, 0,0,0.33333333, 0.2,0.2,0.2, 1,1,0.2, }, 
		{0.433333, 0.933333, }, 
		{{222.222222222, 222.222222222, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_28-trs-blend#p1_scale#vector'] =
{
	{
		{0.85,0.85,0.85, 0,0,0.85, 0.66666667,0.66666667,0.66666667, 1,1,0.66666667, }, 
		{2.066667, 2.666667, }, 
		{{45, 45, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_29-trs-blend#p0_position#vector'] =
{
	{
		{0.333333, 0, 0.666667, 1, }, 
		{1.666667, 2.2, }, 
		{{0, 0, 0, }, {2238.208567643, 0, 0, }, {373.034759521484, 7.57912274064985e-14, 0, }, {1865.17380812152, -7.57912274064985e-14, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_29-trs-blend#p0_scale#vector'] =
{
	{
		{0.33333333,0.33333333,0.33333333, 0,0,0.33333333, 0.2,0.2,0.2, 1,1,0.2, }, 
		{0.433333, 0.933333, }, 
		{{222.222222222, 222.222222222, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_29-trs-blend#p1_scale#vector'] =
{
	{
		{0.85,0.85,0.85, 0,0,0.85, 0.66666667,0.66666667,0.66666667, 1,1,0.66666667, }, 
		{2.066667, 2.666667, }, 
		{{45, 45, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_35-trs-blend#p0_position#vector'] =
{
	{
		{0.333333, 0, 0.666667, 1, }, 
		{1.666667, 2.2, }, 
		{{0, 0, 0, }, {2238.208567643, 0, 0, }, {373.034759521484, 7.57912274064985e-14, 0, }, {1865.17380812152, -7.57912274064985e-14, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_35-trs-blend#p0_scale#vector'] =
{
	{
		{0.33333333,0.33333333,0.33333333, 0,0,0.33333333, 0.2,0.2,0.2, 1,1,0.2, }, 
		{0.433333, 0.933333, }, 
		{{222.222222222, 222.222222222, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_35-trs-blend#p1_scale#vector'] =
{
	{
		{0.85,0.85,0.85, 0,0,0.85, 0.66666667,0.66666667,0.66666667, 1,1,0.66666667, }, 
		{2.066667, 2.666667, }, 
		{{45, 45, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_76-trs-blend#p0_position#vector'] =
{
	{
		{0.333333, 0, 0.666667, 1, }, 
		{1.666667, 2.2, }, 
		{{0, 0, 0, }, {2238.208567643, 0, 0, }, {373.034759521484, 7.57912274064985e-14, 0, }, {1865.17380812152, -7.57912274064985e-14, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_76-trs-blend#p0_scale#vector'] =
{
	{
		{0.33333333,0.33333333,0.33333333, 0,0,0.33333333, 0.2,0.2,0.2, 1,1,0.2, }, 
		{0.433333, 0.933333, }, 
		{{222.222222222, 222.222222222, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_76-trs-blend#p1_scale#vector'] =
{
	{
		{0.85,0.85,0.85, 0,0,0.85, 0.66666667,0.66666667,0.66666667, 1,1,0.66666667, }, 
		{2.066667, 2.666667, }, 
		{{45, 45, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
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
