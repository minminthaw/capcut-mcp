local data = {}

local ae_compDurations = {0, 2}
data.ae_compDurations = ae_compDurations

local ae_effectType = 'transition'
data.ae_effectType = ae_effectType

local ae_transitionInputIndex = {
    {'LumiLayer_373-blend', 'InputTex', 0},
    {'LumiLayer_373-blend', 'baseTex', 1},
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_durations = {
    ['LumiLayer_373-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 1}, },
            ['baseTex'] = {{1, 2}, },
        },
    },
    ['LumiAnimSeqLoadAndCrop_1621-effect0'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['seqTex_1_1'] = {{0, 2}, },
        },
    },
    ['LumiLayer_1633-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['baseTex'] = {{0, 2}, },
        },
    },
    ['LumiAnimSeqLayout_1584-effect0'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['seqTex'] = {{0, 2}, },
        },
    },
    ['LumiAnimSeqLayout_1584-effect1'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['seqTex'] = {{0, 2}, },
        },
    },
    ['LumiAnimSeqLayout_1584-effect2'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['seqTex'] = {{0, 2}, },
        },
    },
    ['LumiAnimSeqLayout_1584-effect3'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['seqTex'] = {{0, 2}, },
        },
    },
    ['LumiAnimSeqLayout_1584-effect4'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['seqTex'] = {{0, 2}, },
        },
    },
    ['LumiAnimSeqLayout_1584-effect5'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['seqTex'] = {{0, 2}, },
        },
    },
    ['LumiAnimSeqLayout_1584-effect6'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['seqTex'] = {{0, 2}, },
        },
    },
    ['LumiAnimSeqLayout_1584-effect7'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['seqTex'] = {{0, 2}, },
        },
    },
    ['LumiAnimSeqLayout_1584-effect8'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['seqTex'] = {{0, 2}, },
        },
    },
    ['LumiAnimSeqLayout_1584-effect9'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['seqTex'] = {{0, 2}, },
        },
    },
    ['LumiLayer_1595-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['baseTex'] = {{0, 2}, },
        },
    },
}
data.ae_durations = ae_durations

local ae_attribute = {
    ['LumiLayer_373-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Precomp',
        ['blendMode'] = 0,
    },
    ['LumiAnimSeqLoadAndCrop_1621-effect0'] = {
        ['specify_1_1'] = true,
        ['animSeqType_1_1'] = 0,
        ['cropType_1_1'] = 0,
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
    ['LumiLayer_1633-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Precomp',
        ['blendMode'] = 0,
    },
    ['LumiAnimSeqLayout_1584-effect0'] = {
        ['animSeqType'] = 2,
        ['alignmentType'] = 1,
        ['edgeType'] = 3,
        ['enableVideoAlphaBlend'] = false,
        ['offsetGlobalX'] = 0,
        ['offsetGlobalY'] = 0,
        ['offsetLocalX'] = 0.19872005229569,
        ['offsetLocalY'] = 0.55287988233471,
        ['rotation'] = 60.6096159501843,
        ['scale'] = 1,
        ['opacity'] = 1,
        ['enableInputBlend'] = false,
        ['speed'] = 1,
        ['playMode'] = 0,
        ['enableAdaptiveScale'] = true,
        ['designRatio'] = 3,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiAnimSeqLayout_1584-effect1'] = {
        ['animSeqType'] = 2,
        ['alignmentType'] = 0,
        ['edgeType'] = 3,
        ['enableVideoAlphaBlend'] = false,
        ['offsetGlobalX'] = 0,
        ['offsetGlobalY'] = 0,
        ['offsetLocalX'] = -0.33,
        ['offsetLocalY'] = 0.25480337002958,
        ['rotation'] = 22.8300345989533,
        ['scale'] = 0.71,
        ['opacity'] = 1,
        ['enableInputBlend'] = true,
        ['speed'] = 1,
        ['playMode'] = 0,
        ['enableAdaptiveScale'] = true,
        ['designRatio'] = 3,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiAnimSeqLayout_1584-effect2'] = {
        ['animSeqType'] = 2,
        ['alignmentType'] = 4,
        ['edgeType'] = 3,
        ['enableVideoAlphaBlend'] = false,
        ['offsetGlobalX'] = 0,
        ['offsetGlobalY'] = 0,
        ['offsetLocalX'] = 0.41182368007281,
        ['offsetLocalY'] = 0.25,
        ['rotation'] = -18.8595937991353,
        ['scale'] = 0.5,
        ['opacity'] = 1,
        ['enableInputBlend'] = true,
        ['speed'] = 1,
        ['playMode'] = 0,
        ['enableAdaptiveScale'] = true,
        ['designRatio'] = 3,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiAnimSeqLayout_1584-effect3'] = {
        ['animSeqType'] = 2,
        ['alignmentType'] = 2,
        ['edgeType'] = 3,
        ['enableVideoAlphaBlend'] = false,
        ['offsetGlobalX'] = 0,
        ['offsetGlobalY'] = 0,
        ['offsetLocalX'] = 0.30431455918337,
        ['offsetLocalY'] = 0.20517747102005,
        ['rotation'] = -27.7583846857312,
        ['scale'] = 0.76,
        ['opacity'] = 1,
        ['enableInputBlend'] = true,
        ['speed'] = 1,
        ['playMode'] = 0,
        ['enableAdaptiveScale'] = true,
        ['designRatio'] = 3,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiAnimSeqLayout_1584-effect4'] = {
        ['animSeqType'] = 2,
        ['alignmentType'] = 1,
        ['edgeType'] = 3,
        ['enableVideoAlphaBlend'] = false,
        ['offsetGlobalX'] = 0,
        ['offsetGlobalY'] = 0,
        ['offsetLocalX'] = 0.1,
        ['offsetLocalY'] = 0.50604038285672,
        ['rotation'] = -10.9050796979658,
        ['scale'] = 0.63,
        ['opacity'] = 1,
        ['enableInputBlend'] = true,
        ['speed'] = 1,
        ['playMode'] = 0,
        ['enableAdaptiveScale'] = true,
        ['designRatio'] = 3,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiAnimSeqLayout_1584-effect5'] = {
        ['animSeqType'] = 2,
        ['alignmentType'] = 4,
        ['edgeType'] = 3,
        ['enableVideoAlphaBlend'] = false,
        ['offsetGlobalX'] = 0,
        ['offsetGlobalY'] = 0,
        ['offsetLocalX'] = 0.35374771851725,
        ['offsetLocalY'] = -0.21655850740519,
        ['rotation'] = 7.92504562965496,
        ['scale'] = 1,
        ['opacity'] = 1,
        ['enableInputBlend'] = true,
        ['speed'] = 1,
        ['playMode'] = 0,
        ['enableAdaptiveScale'] = true,
        ['designRatio'] = 3,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiAnimSeqLayout_1584-effect6'] = {
        ['animSeqType'] = 2,
        ['alignmentType'] = 3,
        ['edgeType'] = 3,
        ['enableVideoAlphaBlend'] = false,
        ['offsetGlobalX'] = 0,
        ['offsetGlobalY'] = 0,
        ['offsetLocalX'] = -0.31562157777588,
        ['offsetLocalY'] = 0,
        ['rotation'] = -13.8688298518962,
        ['scale'] = 0.64,
        ['opacity'] = 1,
        ['enableInputBlend'] = true,
        ['speed'] = 1,
        ['playMode'] = 0,
        ['enableAdaptiveScale'] = true,
        ['designRatio'] = 3,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiAnimSeqLayout_1584-effect7'] = {
        ['animSeqType'] = 2,
        ['alignmentType'] = 4,
        ['edgeType'] = 3,
        ['enableVideoAlphaBlend'] = false,
        ['offsetGlobalX'] = 0,
        ['offsetGlobalY'] = 0,
        ['offsetLocalX'] = -0.22680482864926,
        ['offsetLocalY'] = 0.28727742999537,
        ['rotation'] = -44.5783816668091,
        ['scale'] = 0.51,
        ['opacity'] = 1,
        ['enableInputBlend'] = true,
        ['speed'] = 1,
        ['playMode'] = 0,
        ['enableAdaptiveScale'] = true,
        ['designRatio'] = 3,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiAnimSeqLayout_1584-effect8'] = {
        ['animSeqType'] = 2,
        ['alignmentType'] = 7,
        ['edgeType'] = 3,
        ['enableVideoAlphaBlend'] = false,
        ['offsetGlobalX'] = 0,
        ['offsetGlobalY'] = 0,
        ['offsetLocalX'] = 0,
        ['offsetLocalY'] = -0.15639973852157,
        ['rotation'] = 1.98720052295686,
        ['scale'] = 0.73,
        ['opacity'] = 1,
        ['enableInputBlend'] = true,
        ['speed'] = 1,
        ['playMode'] = 0,
        ['enableAdaptiveScale'] = true,
        ['designRatio'] = 3,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiAnimSeqLayout_1584-effect9'] = {
        ['animSeqType'] = 2,
        ['alignmentType'] = 6,
        ['edgeType'] = 3,
        ['enableVideoAlphaBlend'] = false,
        ['offsetGlobalX'] = 0,
        ['offsetGlobalY'] = 0,
        ['offsetLocalX'] = -0.21505579343204,
        ['offsetLocalY'] = -0.21505579343204,
        ['rotation'] = -14.9040039221765,
        ['scale'] = 0.5,
        ['opacity'] = 1,
        ['enableInputBlend'] = true,
        ['speed'] = 1,
        ['playMode'] = 0,
        ['enableAdaptiveScale'] = true,
        ['designRatio'] = 3,
        ['AEDesignSize'] = Amaz.Vector2f(1080, 1080),
    },
    ['LumiLayer_1595-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Precomp',
        ['blendMode'] = 0,
    },
}
data.ae_attribute = ae_attribute

local ae_keyframes = {
    ['LumiAnimSeqLoadAndCrop_1621-effect0#seqTime#number'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0, 2, }, 
		{{0, }, {2, }, }, 
		{6417, }, 
		{1, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect0#offsetLocalX#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0, 1, }, 
		{{0, }, {0.2, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{0.2, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect0#offsetLocalY#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0, 1, }, 
		{{1, }, {0.55, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{0.55, }, {1, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect0#rotation#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0, 1, }, 
		{{0, }, {61, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{61, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect1#offsetLocalX#number'] =
{
	{
		{0.15, 0, 0, 0, }, 
		{0.066667, 1, }, 
		{{-0.33, }, {-0.33, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 0, }, 
		{1, 1.966667, }, 
		{{-0.33, }, {-0.33, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect1#offsetLocalY#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0.066667, 1, }, 
		{{0.9, }, {0.25, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{0.25, }, {0.9, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect1#rotation#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0.066667, 1, }, 
		{{0, }, {23, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{23, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect2#offsetLocalX#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0.066667, 1, }, 
		{{2, }, {0.4, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{0.4, }, {2, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect2#offsetLocalY#number'] =
{
	{
		{0.166666667, 0, 0, 0, }, 
		{0.066667, 1, }, 
		{{0.25, }, {0.25, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 0, }, 
		{1, 1.966667, }, 
		{{0.25, }, {0.25, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect2#rotation#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0.066667, 1, }, 
		{{0, }, {-19, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{-19, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect3#offsetLocalX#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0.133333, 1, }, 
		{{0.8, }, {0.3, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{0.3, }, {0.8, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect3#offsetLocalY#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0.133333, 1, }, 
		{{0.8, }, {0.2, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{0.2, }, {0.8, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect3#rotation#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0.133333, 1, }, 
		{{0, }, {-28, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{-28, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect4#offsetLocalY#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0.133333, 1, }, 
		{{1.2, }, {0.5, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{0.5, }, {1.2, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect4#rotation#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0.133333, 1, }, 
		{{0, }, {-11, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{-11, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect5#offsetLocalX#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0.166667, 1, }, 
		{{0.75, }, {0.35, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{0.35, }, {0.75, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect5#offsetLocalY#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0.166667, 1, }, 
		{{-0.91, }, {-0.21, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{-0.21, }, {-0.91, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect5#rotation#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0.166667, 1, }, 
		{{0, }, {8, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{8, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect6#offsetLocalX#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0.166667, 1, }, 
		{{-0.91, }, {-0.31, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{-0.31, }, {-0.91, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect6#rotation#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0.166667, 1, }, 
		{{0, }, {-14, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{-14, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect7#offsetLocalX#number'] =
{
	{
		{0.166666667, 0, 0, 1, }, 
		{0.166667, 1, }, 
		{{-2, }, {-0.21, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{-0.21, }, {-2, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect7#offsetLocalY#number'] =
{
	{
		{0.166666667, 0, 0, 1, }, 
		{0.166667, 1, }, 
		{{0, }, {0.29, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{0.29, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect7#rotation#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0.166667, 1, }, 
		{{0, }, {-45, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{-45, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect8#offsetLocalX#number'] =
{
	{
		{0.15, 0, 0, 0, }, 
		{0, 1, }, 
		{{0, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 0, }, 
		{1, 1.966667, }, 
		{{0, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect8#offsetLocalY#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0, 1, }, 
		{{-1.15, }, {-0.15, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{-0.15, }, {-1.15, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect8#rotation#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0, 1, }, 
		{{0, }, {2, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{2, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect9#offsetLocalX#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0, 1, }, 
		{{-1, }, {-0.21, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{-0.21, }, {-1, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect9#offsetLocalY#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0, 1, }, 
		{{-1, }, {-0.21, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{-0.21, }, {-1, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiAnimSeqLayout_1584-effect9#rotation#number'] =
{
	{
		{0.15, 0, 0, 1, }, 
		{0, 1, }, 
		{{0, }, {-15, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{1, 0, 0.85, 1, }, 
		{1, 1.966667, }, 
		{{-15, }, {0, }, }, 
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
