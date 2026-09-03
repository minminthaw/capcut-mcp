local data = {}

local ae_durations = {
    ["LumiDeepGlow_118-effect0"] = {
        ["nodeDuration"] = {{0, 42.4758},},
        ["texDuration"] = {
            ["InputTex"] = {{0, 42.4758},},
        },
    },
    ["LumiLayer_118-blend"] = {
        ["nodeDuration"] = {{0, 42.4758},},
        ["texDuration"] = {
            ["baseTex"] = {{0, 42.4758},},
            ["InputTex"] = {{0, 42.4758},},
        },
    },
}
data.ae_durations = ae_durations

local ae_compDurations = {0.000000, 42.475811}
data.ae_compDurations = ae_compDurations

local ae_durationMode = 2 
data.ae_durationMode = ae_durationMode

local ae_effectType = "effect" 
data.ae_effectType = ae_effectType

local ae_attribute = {
    ["LumiDeepGlow_118-effect0"] = {
        ["radius"] = 200,
        ["exposure"] = 0.11,
        ["threshold"] = 0,
        ["thresholdSmooth"] = 0,
        ["blendMode"] = 1,
        ["view"] = 1,
        ["sourceOpacity"] = 1,
        ["gammaCorrect"] = true,
        ["unmult"] = true,
        ["gammaValue"] = 2.2222,
        ["glowIntensity"] = 0.35,
        ["quality"] = 0.8,
    },
    ["LumiLayer_118-blend"] = {
        ["hasBlend"] = true,
        ["hasMatte"] = false,
        ["hasTransform"] = false,
        ["layerType"] = "Adjustment",
        ["blendMode"] = "Normal",
    },
}
data.ae_attribute = ae_attribute

local ae_keyframes = {
}
data.ae_keyframes = ae_keyframes

local ae_transitionInputIndex = {
    {"LumiDeepGlow_118-effect0", "InputTex", 0},
    {"LumiLayer_118-blend", "baseTex", 0},
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_sliderInfos = {
    ["effects_adjust_size"] = {{"LumiDeepGlow_118-effect0", "radius", 'number', {true, }, 1, 2, 0, 1, {0, }, {0, }, },},
    ["effects_adjust_luminance"] = {{"LumiDeepGlow_118-effect0", "exposure", 'number', {true, }, 1, 2, 0, 1, {0, }, {0, }, },},
}
data.ae_sliderInfos = ae_sliderInfos

local ae_fadeoutInfos = {
    time = 0,
    infos = {
    }
}
data.ae_fadeoutInfos = ae_fadeoutInfos


return data
