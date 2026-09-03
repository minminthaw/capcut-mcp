local data = {}

local ae_durations = {
    ["LumiExtract_83-effect0"] = {{0, 15},},
    ["LuaRadialBlur_83-effect1"] = {{0, 15},},
    ["LumiLayerBlend_83-blend"] = {{0, 15},},
    ["LumiLayerMatte_96-matte"] = {{0, 15},},
    ["LuaRadialBlur_59-effect0"] = {{0, 15},},
    ["LumiLayerBlend_59-blend"] = {{0, 15},},
    ["LumiAnimSeqLoadAndCrop_216-effect0"] = {{0, 15},},
    ["LumiAnimSeqLoadAndCrop_212-effect0"] = {{0, 15},},
    ["LumiLayerBlend_212-blend"] = {{0, 15},},
    ["LumiLayerBlend_216-blend"] = {{0, 15},},
    ["lumi_lv_filter_191-effect0"] = {{0, 15},},
}
data.ae_durations = ae_durations

local ae_compDurations = {0.000000, 3.000000}
data.ae_compDurations = ae_compDurations

local ae_durationMode = 1 
data.ae_durationMode = ae_durationMode

local ae_disappearTime = 0.000000 
data.ae_disappearTime = ae_disappearTime

local ae_effectType = "effect" 
data.ae_effectType = ae_effectType

local ae_attribute = {
    ["LumiExtract_83-effect0"] = {
        ["blackField"] = 200,
        ["blackSoft"] = 20,
        ["whiteField"] = 255,
        ["whiteSoft"] = 0,
        ["reverse"] = false,
    },
    ["LuaRadialBlur_83-effect1"] = {
        ["blurType"] = 1,
        ["amount"] = 55,
        ["quality"] = 15,
        ["center"] = Amaz.Vector2f(0.9, 0.922222),
        ["weightDecay"] = 0.98,
        ["dither"] = 1,
        ["blurAlpha"] = true,
        ["inverseGammaCorrection"] = false,
        ["borderType"] = 0,
    },
    ["LumiLayerBlend_83-blend"] = {
        ["blendMode"] = "Normal",
        ["layerType"] = "Precomp",
    },
    ["LumiLayerMatte_96-matte"] = {
        ["matteMode"] = "Luma",
    },
    ["LuaRadialBlur_59-effect0"] = {
        ["blurType"] = 3,
        ["amount"] = 2,
        ["quality"] = 10,
        ["center"] = Amaz.Vector2f(0.5, 0.5),
        ["weightDecay"] = 0.965,
        ["dither"] = 1,
        ["blurAlpha"] = false,
        ["inverseGammaCorrection"] = false,
        ["borderType"] = 1,
    },
    ["LumiLayerBlend_59-blend"] = {
        ["blendMode"] = "Normal",
        ["layerType"] = "Solid",
    },
    ["LumiAnimSeqLoadAndCrop_216-effect0"] = {
        ["cropType"] = 1,
        ["edgeType"] = 0,
        ["enableVideoAlphaBlend"] = false,
        ["opacity"] = 1,
        ["scale"] = 1,
        ["speed"] = 1,
    },
    ["LumiAnimSeqLoadAndCrop_212-effect0"] = {
        ["cropType"] = 0,
        ["edgeType"] = 0,
        ["enableVideoAlphaBlend"] = false,
        ["opacity"] = 0.2,
        ["scale"] = 1,
        ["speed"] = 1,
    },
    ["LumiLayerBlend_212-blend"] = {
        ["blendMode"] = "SoftLight",
        ["layerType"] = "Solid",
    },
    ["LumiLayerBlend_216-blend"] = {
        ["blendMode"] = "Screen",
        ["layerType"] = "Solid",
    },
    ["lumi_lv_filter_191-effect0"] = {
        ["uniAlpha"] = 0.3,
    },
}
data.ae_attribute = ae_attribute

local ae_keyframes = {
    ["LumiAnimSeqLoadAndCrop_216-effect0#seqTime#number"] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0, 3, }, 
		{{0, }, {3, }, }, 
		{6417, }, 
		{1, }, 
	}, 
},
}
data.ae_keyframes = ae_keyframes

local ae_transitionInputIndex = {
    {"LumiExtract_83-effect0", "InputTex", 0},
    {"LumiLayerBlend_83-blend", "InputTex", 0},
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_sliderInfos = {
    ["effects_adjust_range"] = {{"LumiExtract_83-effect0", "blackField", 1, 3, 0, 0.5, 0, 0,}, },
    ["effects_adjust_blur"] = {{"LuaRadialBlur_59-effect0", "amount", 1, 2, 0, 0.5, 0, 0,}, },
    ["effects_adjust_luminance"] = {{"LuaRadialBlur_83-effect1", "amount", 1, 2, 0, 0.5, 0, 0,}, },
    ["effects_adjust_filter"] = {
        {"lumi_lv_filter_191-effect0", "uniAlpha", 1, 3, 0, 0.4, 0, 0,},
        {"LumiAnimSeqLoadAndCrop_212-effect0", "opacity", 1, 1, 0, 0.4, 0, 0,},

    },
    ["effects_adjust_texture"] = {{"LumiAnimSeqLoadAndCrop_216-effect0", "opacity", 1, 1, 0, 1, 0, 0,}, },
    ["effects_adjust_size"] = {{"LumiAnimSeqLoadAndCrop_216-effect0", "scale", 1, 1, 0, 0.25, 0, 0,}, },
}
data.ae_sliderInfos = ae_sliderInfos


return data
