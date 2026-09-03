local data = {}

local ae_compDurations = {0, 2}
data.ae_compDurations = ae_compDurations

local ae_effectType = 'transition'
data.ae_effectType = ae_effectType

local ae_transitionInputIndex = {
    {'LumiExposure_77-effect0', 'InputTex', 0},
    {'LumiMotionBlur2D_76-effect0', 'InputTex', 1},
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_durations = {
    ['LumiExposure_77-effect0'] = {
        ['nodeDuration'] = {{0, 2.33333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.33333333333333}, },
        },
    },
    ['LumiGaussianBlur_77-effect1'] = {
        ['nodeDuration'] = {{0, 2.33333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.33333333333333}, },
        },
    },
    ['LumiSaturation_77-effect2'] = {
        ['nodeDuration'] = {{0, 2.33333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.33333333333333}, },
        },
    },
    ['LumiAnimSeqLoadAndCrop_95-effect0'] = {
        ['nodeDuration'] = {{0, 2.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.03333333333333}, },
            ['seqTex_1_1'] = {{0, 2.33333333333333}, },
            ['seqTex_9_16'] = {{0, 2.33333333333333}, },
            ['seqTex_16_9'] = {{0, 2.33333333333333}, },
        },
    },
    ['LumiMotionBlur2D_76-effect0'] = {
        ['nodeDuration'] = {{0, 2.33333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.33333333333333}, },
        },
    },
    ['LumiLayer_76-matte'] = {
        ['nodeDuration'] = {{0, 2.33333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.33333333333333}, },
            ['maskTex'] = {{0, 2.03333333333333}, },
        },
    },
    ['LumiLayer_77-matte-blend'] = {
        ['nodeDuration'] = {{0, 2.33333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2.33333333333333}, },
            ['baseTex'] = {{0, 2.33333333333333}, },
            ['maskTex'] = {{0, 2.03333333333333}, },
        },
    },
}
data.ae_durations = ae_durations

local ae_attribute = {
    ['LumiExposure_77-effect0'] = {
        ['channelType'] = 0,
        ['exposure'] = -2,
        ['offset'] = 0,
        ['grayscaleCorrection'] = 1,
        ['redExposure'] = 0,
        ['redOffset'] = 0,
        ['redGrayscaleCorrection'] = 1,
        ['greenExposure'] = 0,
        ['greenOffset'] = 0,
        ['greenGrayscaleCorrection'] = 1,
        ['blueExposure'] = 0,
        ['blueOffset'] = 0,
        ['blueGrayscaleCorrection'] = 1,
        ['noUseLinearLight'] = false,
        ['AEDesignSize'] = Amaz.Vector2f(1920, 1080),
    },
    ['LumiGaussianBlur_77-effect1'] = {
        ['blurIntensity'] = 20,
        ['quality'] = 0.1,
        ['spaceDither'] = 0,
        ['horizontalStrength'] = 1,
        ['verticalStrength'] = 1,
        ['blurDirection'] = 0,
        ['borderType'] = 0,
        ['blurAlpha'] = true,
        ['inverseGammaCorrection'] = true,
        ['AEDesignSize'] = Amaz.Vector2f(1920, 1080),
    },
    ['LumiSaturation_77-effect2'] = {
        ['saturationIntensity'] = -1,
        ['AEDesignSize'] = Amaz.Vector2f(1920, 1080),
    },
    ['LumiAnimSeqLoadAndCrop_95-effect0'] = {
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
        ['scale_1_1'] = 1,
        ['opacity_1_1'] = 1,
        ['speed_1_1'] = 1,
        ['playMode_1_1'] = 0,
        ['specify_9_16'] = true,
        ['animSeqType_9_16'] = 0,
        ['cropType_9_16'] = 1,
        ['edgeType_9_16'] = 0,
        ['enableVideoAlphaBlend_9_16'] = true,
        ['pivot_9_16'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_pivot_9_16'] = Amaz.Vector2f(0.5, 0.5),
        ['position_9_16'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_position_9_16'] = Amaz.Vector2f(0.5, 0.5),
        ['rotation_9_16'] = 0,
        ['scale_9_16'] = 1,
        ['opacity_9_16'] = 1,
        ['speed_9_16'] = 1,
        ['playMode_9_16'] = 0,
        ['specify_16_9'] = true,
        ['animSeqType_16_9'] = 0,
        ['cropType_16_9'] = 1,
        ['edgeType_16_9'] = 0,
        ['enableVideoAlphaBlend_16_9'] = true,
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
        ['lite_mode'] = false,
        ['AEDesignSize'] = Amaz.Vector2f(1920, 1080),
    },
    ['LumiMotionBlur2D_76-effect0'] = {
        ['rotate'] = 0,
        ['ae_pre_rotate'] = 0,
        ['anchor'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_anchor'] = Amaz.Vector2f(0.5, 0.5),
        ['position'] = Amaz.Vector2f(0.5, 0.5),
        ['ae_pre_position'] = Amaz.Vector2f(0.5, 0.5),
        ['unifiedScale'] = true,
        ['scale_x'] = 0.8,
        ['ae_pre_scale_x'] = 0.8,
        ['scale_y'] = 1,
        ['ae_pre_scale_y'] = 1,
        ['vIntensity'] = 0.5,
        ['vCenter'] = -0.25,
        ['minSamples'] = 0.12,
        ['maxSamples'] = 0.24,
        ['mirrorEdge'] = true,
        ['dither'] = 1,
        ['AEDesignSize'] = Amaz.Vector2f(1920, 1080),
    },
    ['LumiLayer_76-matte'] = {
        ['hasBlend'] = false,
        ['hasMatte'] = true,
        ['hasTransform'] = false,
        ['layerType'] = 'Precomp',
        ['matteMode'] = 0,
    },
    ['LumiLayer_77-matte-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = true,
        ['hasTransform'] = false,
        ['layerType'] = 'Precomp',
        ['matteMode'] = 2,
        ['blendMode'] = 0,
    },
}
data.ae_attribute = ae_attribute

local ae_keyframes = {
    ['LumiExposure_77-effect0#exposure#number'] =
{
	{
		{0.001, 0, 0, 1, }, 
		{0, 0.333333, }, 
		{{0, }, {-2, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiGaussianBlur_77-effect1#blurIntensity#number'] =
{
	{
		{0.001, 0, 0, 1, }, 
		{0, 0.333333, }, 
		{{0, }, {20, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiSaturation_77-effect2#saturationIntensity#number'] =
{
	{
		{0.001, 0, 0, 1, }, 
		{0, 0.333333, }, 
		{{0, }, {-1, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLoadAndCrop_95-effect0#seqTime#number'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0, 2.03333333333333, }, 
		{{0, }, {2.03333333333333, }, }, 
		{6417, }, 
		{1, }, 
	}, 
},
    ['LumiMotionBlur2D_76-effect0#ae_pre_scale_x#number'] =
{
	{
		{0.86, 0, 0.14, 1, }, 
		{1.26666633333333, 1.96666633333333, }, 
		{{0.8, }, {1, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiMotionBlur2D_76-effect0#scale_x#number'] =
{
	{
		{0.86, 0, 0.14, 1, }, 
		{1.233333, 1.933333, }, 
		{{0.8, }, {1, }, }, 
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
