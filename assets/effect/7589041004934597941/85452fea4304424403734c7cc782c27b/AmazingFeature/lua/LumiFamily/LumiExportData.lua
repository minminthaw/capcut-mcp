local data = {}

local ae_compDurations = {0, 3.003003003003}
data.ae_compDurations = ae_compDurations

local ae_effectType = 'effect'
data.ae_effectType = ae_effectType

local ae_transitionInputIndex = {
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_durations = {
    ['LumiPageTurn_36-effect0'] = {
        ['nodeDuration'] = {{0, 3.003003003003}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3.003003003003}, },
        },
    },
    ['LumiDropShadow_36-effect1'] = {
        ['nodeDuration'] = {{0, 3.003003003003}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3.003003003003}, },
        },
    },
    ['LumiPageTurn_27-effect0'] = {
        ['nodeDuration'] = {{0, 3.003003003003}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3.003003003003}, },
        },
    },
    ['LumiDropShadow_27-effect1'] = {
        ['nodeDuration'] = {{0, 3.003003003003}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3.003003003003}, },
        },
    },
    ['LumiLayer_39-trs'] = {
        ['nodeDuration'] = {{0, 3.003003003003}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3.003003003003}, },
        },
    },
    ['LumiLayer_27-trs-blend'] = {
        ['nodeDuration'] = {{0, 3.003003003003}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3.003003003003}, },
            ['baseTex'] = {{0, 3.003003003003}, },
        },
    },
    ['LumiLayer_36-trs-blend'] = {
        ['nodeDuration'] = {{0, 3.003003003003}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3.003003003003}, },
            ['baseTex'] = {{0, 3.003003003003}, },
        },
    },
    ['LumiPageTurn_37-effect0'] = {
        ['nodeDuration'] = {{0, 3.003003003003}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3.003003003003}, },
        },
    },
    ['LumiDropShadow_37-effect1'] = {
        ['nodeDuration'] = {{0, 3.003003003003}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3.003003003003}, },
        },
    },
    ['LumiLayer_37-trs-blend'] = {
        ['nodeDuration'] = {{0, 3.003003003003}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3.003003003003}, },
            ['baseTex'] = {{0, 3.003003003003}, },
        },
    },
    ['LumiPageTurn_46-effect0'] = {
        ['nodeDuration'] = {{0, 3.003003003003}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3.003003003003}, },
        },
    },
    ['LumiDropShadow_46-effect1'] = {
        ['nodeDuration'] = {{0, 3.003003003003}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3.003003003003}, },
        },
    },
    ['LumiLayer_46-trs-blend'] = {
        ['nodeDuration'] = {{0, 3.003003003003}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3.003003003003}, },
            ['baseTex'] = {{0, 3.003003003003}, },
        },
    },
    ['LumiPageTurn_38-effect0'] = {
        ['nodeDuration'] = {{0, 3.003003003003}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3.003003003003}, },
        },
    },
    ['LumiDropShadow_38-effect1'] = {
        ['nodeDuration'] = {{0, 3.003003003003}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3.003003003003}, },
        },
    },
    ['LumiLayer_38-trs-blend'] = {
        ['nodeDuration'] = {{0, 3.003003003003}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3.003003003003}, },
            ['baseTex'] = {{0, 3.003003003003}, },
        },
    },
}
data.ae_durations = ae_durations

local ae_attribute = {
    ['LumiPageTurn_36-effect0'] = {
        ['classic_ui'] = 2,
        ['inFoldPosition'] = Amaz.Vector2f(-0.24722222222222, -1.27962962962963),
        ['inFoldDirection'] = 0,
        ['foldRadius'] = 0.31,
        ['renderFace'] = 0,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiDropShadow_36-effect1'] = {
        ['shadowColor'] = Amaz.Color(0, 0, 0, 1),
        ['shadowOpacity'] = 0.2,
        ['shadowAngle'] = -139,
        ['shadowDistance'] = 5,
        ['width'] = 5,
        ['onlyShadow'] = false,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiPageTurn_27-effect0'] = {
        ['classic_ui'] = 2,
        ['inFoldPosition'] = Amaz.Vector2f(-0.24722222222222, -1.27962962962963),
        ['inFoldDirection'] = 0,
        ['foldRadius'] = 0.31,
        ['renderFace'] = 0,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiDropShadow_27-effect1'] = {
        ['shadowColor'] = Amaz.Color(0, 0, 0, 1),
        ['shadowOpacity'] = 0.2,
        ['shadowAngle'] = -139,
        ['shadowDistance'] = 5,
        ['width'] = 5,
        ['onlyShadow'] = false,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiLayer_39-trs'] = {
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
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = true,
    },
    ['LumiLayer_27-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(0, 360, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.6,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(540, 660, 0),
        ['p0_scale'] = Amaz.Vector3f(150, 150, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = 0,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_36-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(0, 360, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.6,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(540, 660, 0),
        ['p0_scale'] = Amaz.Vector3f(150, 150, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = 0,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiPageTurn_37-effect0'] = {
        ['classic_ui'] = 2,
        ['inFoldPosition'] = Amaz.Vector2f(-0.24722222222222, -1.27962962962963),
        ['inFoldDirection'] = 0,
        ['foldRadius'] = 0.31,
        ['renderFace'] = 0,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiDropShadow_37-effect1'] = {
        ['shadowColor'] = Amaz.Color(0, 0, 0, 1),
        ['shadowOpacity'] = 0.2,
        ['shadowAngle'] = -139,
        ['shadowDistance'] = 5,
        ['width'] = 5,
        ['onlyShadow'] = false,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiLayer_37-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(0, 360, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.6,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(540, 660, 0),
        ['p0_scale'] = Amaz.Vector3f(150, 150, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = 0,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiPageTurn_46-effect0'] = {
        ['classic_ui'] = 2,
        ['inFoldPosition'] = Amaz.Vector2f(-0.24722222222222, -1.27962962962963),
        ['inFoldDirection'] = 0,
        ['foldRadius'] = 0.31,
        ['renderFace'] = 0,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiDropShadow_46-effect1'] = {
        ['shadowColor'] = Amaz.Color(0, 0, 0, 1),
        ['shadowOpacity'] = 0.2,
        ['shadowAngle'] = -139,
        ['shadowDistance'] = 5,
        ['width'] = 5,
        ['onlyShadow'] = false,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiLayer_46-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(0, 360, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.6,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(540, 660, 0),
        ['p0_scale'] = Amaz.Vector3f(150, 150, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = 0,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiPageTurn_38-effect0'] = {
        ['classic_ui'] = 2,
        ['inFoldPosition'] = Amaz.Vector2f(-0.24722222222222, -1.27962962962963),
        ['inFoldDirection'] = 0,
        ['foldRadius'] = 0.31,
        ['renderFace'] = 0,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiDropShadow_38-effect1'] = {
        ['shadowColor'] = Amaz.Color(0, 0, 0, 1),
        ['shadowOpacity'] = 0.2,
        ['shadowAngle'] = -139,
        ['shadowDistance'] = 5,
        ['width'] = 10,
        ['onlyShadow'] = false,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiLayer_38-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(0, 360, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.6,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(540, 660, 0),
        ['p0_scale'] = Amaz.Vector3f(150, 150, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = 0,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
}
data.ae_attribute = ae_attribute

local ae_keyframes = {
    ['LumiPageTurn_36-effect0#inFoldPosition#vector'] =
{
	{
		{0.16, 0, 0.42, 1, }, 
		{0.233567, 2.068735, }, 
		{{-0.24722222222222, -1.27962962962963, }, {1, 1, }, {-0.03935185185185, -0.89969134860569, }, {0.79212962962963, 0.62006171897606, }, }, 
		{6415, }, 
		{0, }, 
	}, 
},
    ['LumiPageTurn_27-effect0#inFoldPosition#vector'] =
{
	{
		{0.16, 0, 0.42, 1, }, 
		{0, 1.835169, }, 
		{{-0.24722222222222, -1.27962962962963, }, {1, 1, }, {-0.03935185185185, -0.89969134860569, }, {0.79212962962963, 0.62006171897606, }, }, 
		{6415, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_39-trs#position#vector'] =
{
	{
		{0.22, 0, 0.38, 1, }, 
		{0, 1.801802, }, 
		{{540, 540, 0, }, {540, 384, 0, }, {540, 514, 0, }, {540, 410, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_39-trs#scale#vector'] =
{
	{
		{0.22,0.22,0.22, 0,0,0.22, 0.38,0.38,0.38, 1,1,0.38, }, 
		{0, 1.801802, }, 
		{{100, 100, 100, }, {90, 90, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_27-trs-blend#position#vector'] =
{
	{
		{0.13, 0, 0.37, 1, }, 
		{0, 1.835169, }, 
		{{0, 360, 0, }, {0, 0, 0, }, {0, 300, 0, }, {0, 60, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_27-trs-blend#p0_position#vector'] =
{
	{
		{0.16, 0, 0.29, 1, }, 
		{0, 2.802803, }, 
		{{540, 660, 0, }, {540, 540, 0, }, {540, 640, 0, }, {540, 560, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_27-trs-blend#p0_scale#vector'] =
{
	{
		{0.16,0.16,0.16, 0,0,0.16, 0.29,0.29,0.29, 1,1,0.29, }, 
		{0, 2.802803, }, 
		{{150, 150, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_36-trs-blend#position#vector'] =
{
	{
		{0.13, 0, 0.37, 1, }, 
		{0.233567, 2.068735, }, 
		{{0, 360, 0, }, {0, 0, 0, }, {0, 300, 0, }, {0, 60, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_36-trs-blend#p0_position#vector'] =
{
	{
		{0.16, 0, 0.29, 1, }, 
		{0, 2.802803, }, 
		{{540, 660, 0, }, {540, 540, 0, }, {540, 640, 0, }, {540, 560, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_36-trs-blend#p0_scale#vector'] =
{
	{
		{0.16,0.16,0.16, 0,0,0.16, 0.29,0.29,0.29, 1,1,0.29, }, 
		{0, 2.802803, }, 
		{{150, 150, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiPageTurn_37-effect0#inFoldPosition#vector'] =
{
	{
		{0.16, 0, 0.42, 1, }, 
		{0.467134, 2.302302, }, 
		{{-0.24722222222222, -1.27962962962963, }, {1, 1, }, {-0.03935185185185, -0.89969134860569, }, {0.79212962962963, 0.62006171897606, }, }, 
		{6415, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_37-trs-blend#position#vector'] =
{
	{
		{0.13, 0, 0.37, 1, }, 
		{0.467134, 2.302302, }, 
		{{0, 360, 0, }, {0, 0, 0, }, {0, 300, 0, }, {0, 60, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_37-trs-blend#p0_position#vector'] =
{
	{
		{0.16, 0, 0.29, 1, }, 
		{0, 2.802803, }, 
		{{540, 660, 0, }, {540, 540, 0, }, {540, 640, 0, }, {540, 560, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_37-trs-blend#p0_scale#vector'] =
{
	{
		{0.16,0.16,0.16, 0,0,0.16, 0.29,0.29,0.29, 1,1,0.29, }, 
		{0, 2.802803, }, 
		{{150, 150, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiPageTurn_46-effect0#inFoldPosition#vector'] =
{
	{
		{0.16, 0, 0.42, 1, }, 
		{0.700701, 2.535869, }, 
		{{-0.24722222222222, -1.27962962962963, }, {1, 1, }, {-0.03935185185185, -0.89969134860569, }, {0.79212962962963, 0.62006171897606, }, }, 
		{6415, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_46-trs-blend#position#vector'] =
{
	{
		{0.13, 0, 0.37, 1, }, 
		{0.700701, 2.535869, }, 
		{{0, 360, 0, }, {0, 0, 0, }, {0, 300, 0, }, {0, 60, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_46-trs-blend#p0_position#vector'] =
{
	{
		{0.16, 0, 0.29, 1, }, 
		{0, 2.802803, }, 
		{{540, 660, 0, }, {540, 540, 0, }, {540, 640, 0, }, {540, 560, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_46-trs-blend#p0_scale#vector'] =
{
	{
		{0.16,0.16,0.16, 0,0,0.16, 0.29,0.29,0.29, 1,1,0.29, }, 
		{0, 2.802803, }, 
		{{150, 150, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiPageTurn_38-effect0#inFoldPosition#vector'] =
{
	{
		{0.16, 0, 0.42, 1, }, 
		{0.934268, 2.769436, }, 
		{{-0.24722222222222, -1.27962962962963, }, {1, 1, }, {-0.03935185185185, -0.89969134860569, }, {0.79212962962963, 0.62006171897606, }, }, 
		{6415, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_38-trs-blend#position#vector'] =
{
	{
		{0.13, 0, 0.37, 1, }, 
		{0.934268, 2.569236, }, 
		{{0, 360, 0, }, {0, 0, 0, }, {0, 300, 0, }, {0, 60, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_38-trs-blend#p0_position#vector'] =
{
	{
		{0.16, 0, 0.29, 1, }, 
		{0, 2.802803, }, 
		{{540, 660, 0, }, {540, 540, 0, }, {540, 640, 0, }, {540, 560, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_38-trs-blend#p0_scale#vector'] =
{
	{
		{0.16,0.16,0.16, 0,0,0.16, 0.29,0.29,0.29, 1,1,0.29, }, 
		{0, 2.802803, }, 
		{{150, 150, 100, }, {100, 100, 100, }, }, 
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
    animationMode = 0,
    loopStart = 0,
    speedInfo = {1, 0.5, 2, },
}
data.ae_animationInfos = ae_animationInfos

return data
