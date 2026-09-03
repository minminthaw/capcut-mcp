local data = {}

local ae_compDurations = {0, 1.96666666666667}
data.ae_compDurations = ae_compDurations

local ae_effectType = 'transition'
data.ae_effectType = ae_effectType

local ae_transitionInputIndex = {
    {'LumiLayer_489-trs-blend', 'InputTex', 0},
    {'LumiLayer_494-trs-blend', 'InputTex', 1},
    {'LumiLayer_495-trs-blend', 'InputTex', 0},
    {'LumiLayer_496-trs-blend', 'InputTex', 1},
    {'LumiLayer_502-trs-blend', 'InputTex', 1},
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_durations = {
    ['LumiAnimSeqLoadAndCrop_550-effect0'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['seqTex_1_1'] = {{0, 2}, },
        },
    },
    ['LumiLayer_489-trs-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['baseTex'] = {{0, 2}, },
        },
    },
    ['LumiLayer_494-trs-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['baseTex'] = {{0, 2}, },
        },
    },
    ['LumiLayer_495-trs-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['baseTex'] = {{0, 2}, },
        },
    },
    ['LumiLayer_496-trs-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['baseTex'] = {{0, 2}, },
        },
    },
    ['LumiLayer_502-trs-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{1.53333333333333, 2}, },
            ['baseTex'] = {{0, 2}, },
        },
    },
    ['LumiGaussianBlur_507-effect0'] = {
        ['nodeDuration'] = {{0.5, 1.06666666666667}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
        },
    },
    ['LumiLayer_507-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0.5, 1.06666666666667}, },
            ['baseTex'] = {{0, 2}, },
        },
    },
    ['LumiLayer_575-trs-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0.5, 1.06666666666667}, },
            ['baseTex'] = {{0, 2}, },
        },
    },
}
data.ae_durations = ae_durations

local ae_attribute = {
    ['LumiAnimSeqLoadAndCrop_550-effect0'] = {
        ['specify_1_1'] = true,
        ['animSeqType_1_1'] = 0,
        ['cropType_1_1'] = 1,
        ['edgeType_1_1'] = 0,
        ['enableVideoAlphaBlend_1_1'] = true,
        ['pivot_1_1'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_pivot_1_1'] = Amaz.Vector2f(0.5, 0.5),
        ['position_1_1'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_position_1_1'] = Amaz.Vector2f(0.5, 0.5),
        ['rotation_1_1'] = 0,
        ['scale_1_1'] = 1.1,
        ['opacity_1_1'] = 1,
        ['speed_1_1'] = 1,
        ['playMode_1_1'] = 0,
        ['specify_9_16'] = false,
        ['animSeqType_9_16'] = 2,
        ['cropType_9_16'] = 1,
        ['edgeType_9_16'] = 0,
        ['enableVideoAlphaBlend_9_16'] = false,
        ['pivot_9_16'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_pivot_9_16'] = Amaz.Vector2f(0.5, 0.5),
        ['position_9_16'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_position_9_16'] = Amaz.Vector2f(0.5, 0.5),
        ['rotation_9_16'] = 0,
        ['scale_9_16'] = 1,
        ['opacity_9_16'] = 1,
        ['speed_9_16'] = 1,
        ['playMode_9_16'] = 0,
        ['specify_16_9'] = false,
        ['animSeqType_16_9'] = 2,
        ['cropType_16_9'] = 1,
        ['edgeType_16_9'] = 0,
        ['enableVideoAlphaBlend_16_9'] = false,
        ['pivot_16_9'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_pivot_16_9'] = Amaz.Vector2f(0.5, 0.5),
        ['position_16_9'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_position_16_9'] = Amaz.Vector2f(0.5, 0.5),
        ['rotation_16_9'] = 0,
        ['scale_16_9'] = 1,
        ['opacity_16_9'] = 1,
        ['speed_16_9'] = 1,
        ['playMode_16_9'] = 0,
        ['specify_5.8'] = false,
        ['animSeqType_5.8'] = 2,
        ['cropType_5.8'] = 1,
        ['edgeType_5.8'] = 0,
        ['enableVideoAlphaBlend_5.8'] = false,
        ['pivot_5.8'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_pivot_5.8'] = Amaz.Vector2f(0.5, 0.5),
        ['position_5.8'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_position_5.8'] = Amaz.Vector2f(0.5, 0.5),
        ['rotation_5.8'] = 0,
        ['scale_5.8'] = 1,
        ['opacity_5.8'] = 1,
        ['speed_5.8'] = 1,
        ['playMode_5.8'] = 0,
        ['specify_2_1'] = false,
        ['animSeqType_2_1'] = 2,
        ['cropType_2_1'] = 1,
        ['edgeType_2_1'] = 0,
        ['enableVideoAlphaBlend_2_1'] = false,
        ['pivot_2_1'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_pivot_2_1'] = Amaz.Vector2f(0.5, 0.5),
        ['position_2_1'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_position_2_1'] = Amaz.Vector2f(0.5, 0.5),
        ['rotation_2_1'] = 0,
        ['scale_2_1'] = 1,
        ['opacity_2_1'] = 1,
        ['speed_2_1'] = 1,
        ['playMode_2_1'] = 0,
        ['specify_3_4'] = false,
        ['animSeqType_3_4'] = 2,
        ['cropType_3_4'] = 1,
        ['edgeType_3_4'] = 0,
        ['enableVideoAlphaBlend_3_4'] = false,
        ['pivot_3_4'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_pivot_3_4'] = Amaz.Vector2f(0.5, 0.5),
        ['position_3_4'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_position_3_4'] = Amaz.Vector2f(0.5, 0.5),
        ['rotation_3_4'] = 0,
        ['scale_3_4'] = 1,
        ['opacity_3_4'] = 1,
        ['speed_3_4'] = 1,
        ['playMode_3_4'] = 0,
        ['specify_4_3'] = false,
        ['animSeqType_4_3'] = 2,
        ['cropType_4_3'] = 1,
        ['edgeType_4_3'] = 0,
        ['enableVideoAlphaBlend_4_3'] = false,
        ['pivot_4_3'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_pivot_4_3'] = Amaz.Vector2f(0.5, 0.5),
        ['position_4_3'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_position_4_3'] = Amaz.Vector2f(0.5, 0.5),
        ['rotation_4_3'] = 0,
        ['scale_4_3'] = 1,
        ['opacity_4_3'] = 1,
        ['speed_4_3'] = 1,
        ['playMode_4_3'] = 0,
        ['specify_1.85_1'] = false,
        ['animSeqType_1.85_1'] = 2,
        ['cropType_1.85_1'] = 1,
        ['edgeType_1.85_1'] = 0,
        ['enableVideoAlphaBlend_1.85_1'] = false,
        ['pivot_1.85_1'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_pivot_1.85_1'] = Amaz.Vector2f(0.5, 0.5),
        ['position_1.85_1'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_position_1.85_1'] = Amaz.Vector2f(0.5, 0.5),
        ['rotation_1.85_1'] = 0,
        ['scale_1.85_1'] = 1,
        ['opacity_1.85_1'] = 1,
        ['speed_1.85_1'] = 1,
        ['playMode_1.85_1'] = 0,
        ['specify_2.35_1'] = false,
        ['animSeqType_2.35_1'] = 2,
        ['cropType_2.35_1'] = 1,
        ['edgeType_2.35_1'] = 0,
        ['enableVideoAlphaBlend_2.35_1'] = false,
        ['pivot_2.35_1'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_pivot_2.35_1'] = Amaz.Vector2f(0.5, 0.5),
        ['position_2.35_1'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_position_2.35_1'] = Amaz.Vector2f(0.5, 0.5),
        ['rotation_2.35_1'] = 0,
        ['scale_2.35_1'] = 1,
        ['opacity_2.35_1'] = 1,
        ['speed_2.35_1'] = 1,
        ['playMode_2.35_1'] = 0,
        ['globalRotation'] = 0,
        ['globalScale'] = 1,
        ['globalOpacity'] = 1,
        ['globalSpeed'] = 1,
        ['lite_mode'] = true,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiLayer_489-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(-984, 50, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.6,
        ['p0_anchorPoint'] = Amaz.Vector3f(50, 50, 0),
        ['p0_position'] = Amaz.Vector3f(1574, 540, 0),
        ['p0_scale'] = Amaz.Vector3f(100, 100, 100),
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
    ['LumiLayer_494-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(1080, 1080, 0),
        ['position'] = Amaz.Vector3f(-103.161919227419, -166.874071506245, 0),
        ['scale'] = Amaz.Vector3f(25, 25, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 70,
        ['opacity'] = 0,
        ['active_cam_fovx'] = 39.6,
        ['p0_anchorPoint'] = Amaz.Vector3f(50, 50, 0),
        ['p0_position'] = Amaz.Vector3f(1030, 540, 0),
        ['p0_scale'] = Amaz.Vector3f(100, 100, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = -150,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_495-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(1080, 1080, 0),
        ['position'] = Amaz.Vector3f(-174.955358824561, 97.2056372379423, 0),
        ['scale'] = Amaz.Vector3f(25, 25, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 35,
        ['opacity'] = 0,
        ['active_cam_fovx'] = 39.6,
        ['p0_anchorPoint'] = Amaz.Vector3f(50, 50, 0),
        ['p0_position'] = Amaz.Vector3f(1030, 540, 0),
        ['p0_scale'] = Amaz.Vector3f(100, 100, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = -150,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_496-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(-440, 160, 0),
        ['scale'] = Amaz.Vector3f(25, 25, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 0,
        ['active_cam_fovx'] = 39.6,
        ['p0_anchorPoint'] = Amaz.Vector3f(50, 50, 0),
        ['p0_position'] = Amaz.Vector3f(1030, 540, 0),
        ['p0_scale'] = Amaz.Vector3f(100, 100, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = -150,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_502-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(540, 540, 0),
        ['position'] = Amaz.Vector3f(540, 650, 0),
        ['scale'] = Amaz.Vector3f(25, 25, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 0,
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiGaussianBlur_507-effect0'] = {
        ['blurIntensity'] = 0,
        ['quality'] = 0.5,
        ['spaceDither'] = 0,
        ['horizontalStrength'] = 1,
        ['verticalStrength'] = 1,
        ['blurDirection'] = 0,
        ['borderType'] = 0,
        ['blurAlpha'] = true,
        ['inverseGammaCorrection'] = true,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiLayer_507-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Adjustment',
        ['blendMode'] = 0,
    },
    ['LumiLayer_575-trs-blend'] = {
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
        ['opacity'] = 0,
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(1080, 1080),
        ['layerSize'] = Amaz.Vector2f(1080, 1080),
        ['mirrorEdge'] = false,
        ['blendMode'] = 4,
    },
}
data.ae_attribute = ae_attribute

local ae_keyframes = {
    ['LumiAnimSeqLoadAndCrop_550-effect0#seqTime#number'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0, 2, }, 
		{{0, }, {2, }, }, 
		{6417, }, 
		{1, }, 
	}, 
},
    ['LumiLayer_489-trs-blend#scale#vector'] =
{
	{
		{0.6,0.6,0.6, 0,0,0.6, 0.42,0.42,0.42, 1,1,0.42, }, 
		{0, 0.366667, }, 
		{{100, 100, 100, }, {50, 50, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
	{
		{0.373864997,0.373864997,0.373864997, 0.373864997,0.373864997,0.373864997, 0.705020956,0.705020956,0.705020956, 0.705020956,0.705020956,0.705020956, }, 
		{0.366667, 0.6, }, 
		{{50, 50, 100, }, {50, 50, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
	{
		{0.37,0.37,0.37, 0,0,0.37, 0.66,0.66,0.66, 1,1,0.66, }, 
		{0.6, 1, }, 
		{{50, 50, 100, }, {25, 25, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_489-trs-blend#opacity#number'] =
{
	{
		{0.37, 0, 0.201927218, 1, }, 
		{0.5, 1, }, 
		{{100, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_489-trs-blend#p0_rotation#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.333333, 1.3, }, 
		{{0, }, {90, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_494-trs-blend#scale#vector'] =
{
	{
		{0.28,0.28,0.28, 0,0,0.28, 0.66,0.66,0.66, 1,1,0.66, }, 
		{0.466667, 0.9, }, 
		{{25, 25, 100, }, {50, 50, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
	{
		{0.28,0.28,0.28, 0.28,0.28,0.28, 0.705020956,0.705020956,0.705020956, 0.705020956,0.705020956,0.705020956, }, 
		{0.9, 1.1, }, 
		{{50, 50, 100, }, {50, 50, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
	{
		{0.37,0.37,0.37, 0,0,0.37, 0.66,0.66,0.66, 1,1,0.66, }, 
		{1.1, 1.4, }, 
		{{50, 50, 100, }, {25, 25, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_494-trs-blend#opacity#number'] =
{
	{
		{0.28, 0, 0.66, 1, }, 
		{0.466667, 0.9, }, 
		{{0, }, {100, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.28, 0, 0.833333333, 0, }, 
		{0.9, 1.1, }, 
		{{100, }, {100, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.37, 0, 0.66, 1, }, 
		{1.1, 1.4, }, 
		{{100, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_494-trs-blend#p0_rotation#number'] =
{
	{
		{0.28, 0, 0.66, 1, }, 
		{0.5, 1.533333, }, 
		{{-150, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_495-trs-blend#scale#vector'] =
{
	{
		{0.28,0.28,0.28, -0.45,-0.45,0.28, 0.66,0.66,0.66, 1,1,0.66, }, 
		{0.633333, 1.066667, }, 
		{{25, 25, 100, }, {50, 50, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
	{
		{0.28,0.28,0.28, 0.28,0.28,0.28, 0.705020956,0.705020956,0.705020956, 0.705020956,0.705020956,0.705020956, }, 
		{1.066667, 1.266667, }, 
		{{50, 50, 100, }, {50, 50, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
	{
		{0.37,0.37,0.37, 0,0,0.37, 0.66,0.66,0.66, 1,1,0.66, }, 
		{1.266667, 1.566667, }, 
		{{50, 50, 100, }, {25, 25, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_495-trs-blend#opacity#number'] =
{
	{
		{0.28, -0.45, 0.66, 1, }, 
		{0.633333, 1.066667, }, 
		{{0, }, {100, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.28, 0, 0.833333333, 0, }, 
		{1.066667, 1.266667, }, 
		{{100, }, {100, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.37, 0, 0.66, 1, }, 
		{1.266667, 1.566667, }, 
		{{100, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_495-trs-blend#p0_rotation#number'] =
{
	{
		{0.28, 0, 0.66, 1, }, 
		{0.5, 1.533333, }, 
		{{-150, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_496-trs-blend#scale#vector'] =
{
	{
		{0.28,0.28,0.28, -0.45,-0.45,0.28, 0.66,0.66,0.66, 1,1,0.66, }, 
		{0.8, 1.233333, }, 
		{{25, 25, 100, }, {50, 50, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_496-trs-blend#opacity#number'] =
{
	{
		{0.28, -0.45, 0.66, 1, }, 
		{0.8, 1.233333, }, 
		{{0, }, {100, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_496-trs-blend#p0_rotation#number'] =
{
	{
		{0.28, 0, 0.66, 1, }, 
		{0.5, 1.533333, }, 
		{{-150, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_502-trs-blend#position#vector'] =
{
	{
		{0.24, 0, 0.23, 1, }, 
		{1.533333, 2, }, 
		{{540, 650, 0, }, {540, 540, 0, }, {540, 631.666666030884, 0, }, {540, 558.333333969116, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_502-trs-blend#scale#vector'] =
{
	{
		{0.945166051,0.945166051,0.86, 0,0,0.86, 0.675772288,0.675772288,0.42, 1,1,0.42, }, 
		{0.666667, 1.1, }, 
		{{25, 25, 100, }, {50, 50, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{1.1, 1.533333, }, 
		{{50, 50, 100, }, {50, 50, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
	{
		{0.24,0.24,0.24, 0,0,0.24, 0.23,0.23,0.23, 1,1,0.23, }, 
		{1.533333, 2, }, 
		{{50, 50, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_502-trs-blend#rotation#number'] =
{
	{
		{0.24, 0, 0.23, 0, }, 
		{1.533333, 2, }, 
		{{0, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_502-trs-blend#opacity#number'] =
{
	{
		{0.923275506, 0, 0.513294932, 1, }, 
		{0.666667, 1.1, }, 
		{{0, }, {100, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiGaussianBlur_507-effect0#blurIntensity#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.5, 0.8, }, 
		{{0, }, {25, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.8, 1.066667, }, 
		{{25, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_575-trs-blend#opacity#number'] =
{
	{
		{0.602078951, 0, 0.66666667, 1, }, 
		{0.5, 0.8, }, 
		{{0, }, {64, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.33333333, 0, 0.464731647, 1, }, 
		{0.8, 1.066667, }, 
		{{64, }, {0, }, }, 
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
