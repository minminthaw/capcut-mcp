local data = {}

local ae_durations = {
    ["LumiMotionBlur2D_27-effect0"] = {
        ["nodeDuration"] = {{0, 15},},
        ["texDuration"] = {
            ["InputTex"] = {{0, 15},},
        },
    },
    ["LumiRadialBlur_35-effect0"] = {
        ["nodeDuration"] = {{0, 15},},
        ["texDuration"] = {
            ["InputTex"] = {{0, 15},},
        },
    },
    ["LumiBokehBlur_35-effect1"] = {
        ["nodeDuration"] = {{0, 15},},
        ["texDuration"] = {
            ["InputTex"] = {{0, 15},},
        },
    },
    ["LumiLayer_35-blend"] = {
        ["nodeDuration"] = {{0, 15},},
        ["texDuration"] = {
            ["baseTex"] = {{0, 15},},
            ["InputTex"] = {{0, 15},},
        },
    },
}
data.ae_durations = ae_durations

local ae_compDurations = {0.000000, 1.600000}
data.ae_compDurations = ae_compDurations

local ae_effectType = "effect" 
data.ae_effectType = ae_effectType

local ae_attribute = {
    ["LumiMotionBlur2D_27-effect0"] = {
        ["rotate"] = 0,
        ["ae_pre_rotate"] = 0,
        ["anchor"] = Amaz.Vector2f(0.5, 0.5),
        ["ae_pre_anchor"] = Amaz.Vector2f(0.5, 0.5),
        ["position"] = Amaz.Vector2f(0.5, 0.5),
        ["ae_pre_position"] = Amaz.Vector2f(0.5, 0.5),
        ["unifiedScale"] = false,
        ["scale_x"] = 1,
        ["ae_pre_scale_x"] = 1,
        ["scale_y"] = 1,
        ["ae_pre_scale_y"] = 1,
        ["vIntensity"] = 0.5,
        ["vCenter"] = -0.25,
        ["minSamples"] = 0.12,
        ["maxSamples"] = 0.24,
        ["mirrorEdge"] = true,
        ["dither"] = 1,
    },
    ["LumiRadialBlur_35-effect0"] = {
        ["blurType"] = 2,
        ["amount"] = 0,
        ["quality"] = 0.2,
        ["center"] = Amaz.Vector2f(0.5, 0.5),
        ["weightDecay"] = 0.965,
        ["dither"] = 1,
        ["blurAlpha"] = true,
        ["inverseGammaCorrection"] = false,
        ["borderType"] = 1,
    },
    ["LumiBokehBlur_35-effect1"] = {
        ["bokehMode"] = 0,
        ["sample"] = 0,
        ["scaleX"] = 0.4,
        ["scaleY"] = 1,
        ["regionIns"] = 1,
        ["lightIns"] = 1.5,
        ["quality"] = 1,
        ["angle"] = 0,
        ["lineNum"] = 5,
    },
    ["LumiLayer_35-blend"] = {
        ["hasBlend"] = true,
        ["hasMatte"] = false,
        ["hasTransform"] = false,
        ["layerType"] = "Adjustment",
        ["blendMode"] = "Normal",
    },
}
data.ae_attribute = ae_attribute

local ae_keyframes = {
    ["LumiMotionBlur2D_27-effect0#ae_pre_position#vector"] =
{
	{
		{0.333333, 0, 0.666667, 1, }, 
		{0.04, 0.1, }, 
		{{0.5, 0.5, }, {0.5, 0.55208333333333, }, {0.5, 0.50868055522442, }, {0.5, 0.55208333333333, }, }, 
		{6415, }, 
		{0, }, 
	}, 
	{
		{0.333333, 0, 0.07, 1, }, 
		{0.1, 0.16, }, 
		{{0.5, 0.55208333333333, }, {0.5, 0.5, }, {0.5, 0.55208333333333, }, {0.5, 0.50868055522442, }, }, 
		{6415, }, 
		{0, }, 
	}, 
},
    ["LumiMotionBlur2D_27-effect0#position#vector"] =
{
	{
		{0.333333, 0, 0.666667, 1, }, 
		{0, 0.06, }, 
		{{0.5, 0.5, }, {0.5, 0.55208333333333, }, {0.5, 0.50868055522442, }, {0.5, 0.55208333333333, }, }, 
		{6415, }, 
		{0, }, 
	}, 
	{
		{0.333333, 0, 0.07, 1, }, 
		{0.06, 0.12, }, 
		{{0.5, 0.55208333333333, }, {0.5, 0.5, }, {0.5, 0.55208333333333, }, {0.5, 0.50868055522442, }, }, 
		{6415, }, 
		{0, }, 
	}, 
},
    ["LumiRadialBlur_35-effect0#amount#number"] =
{
	{
		{0.166666667, 0.166666667, 0.75, 1, }, 
		{0, 0.04, }, 
		{{0, }, {177, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.014705882, 0.800187395, 0.12149871, 1, }, 
		{0.04, 0.72, }, 
		{{177, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ["LumiBokehBlur_35-effect1#sample#number"] =
{
	{
		{0.33333333, 0, 0.75, 1, }, 
		{0, 0.04, }, 
		{{0, }, {40, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.0244328, 0.340116763, 0.493160326, 1, }, 
		{0.04, 0.92, }, 
		{{40, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
}
data.ae_keyframes = ae_keyframes

local ae_transitionInputIndex = {
    {"LumiMotionBlur2D_27-effect0", "InputTex", 0},
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_sliderInfos = {
    ["effects_adjust_intensity"] = {{"LumiMotionBlur2D_27-effect0", "position", 'vector', {false, true, }, 1, 2, 0, 1, {0.5, 0.5, }, {0.5, 0.5, }, },},
    ["effects_adjust_blur"] = {{"LumiBokehBlur_35-effect1", "sample", 'number', {true, }, 1, 2, 0, 1, {0.5, }, {0.5, }, },},
    ["effects_adjust_distortion"] = {{"LumiRadialBlur_35-effect0", "amount", 'number', {true, }, 1, 2, 0, 1, {0.6, }, {0.6, }, },},
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
    speedInfo = {1, 0.5, 2, },
}
data.ae_animationInfos = ae_animationInfos


return data
