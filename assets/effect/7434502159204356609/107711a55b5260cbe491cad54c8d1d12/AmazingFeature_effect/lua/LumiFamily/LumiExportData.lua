local data = {}

local ae_durations = {
    ["LumiAnimSeqLoadAndCrop_110-effect0"] = {
        ["nodeDuration"] = { { 0, 63 }, },
        ["texDuration"] = {
            ["seqTex"] = { { 0, 63 }, },
            ["InputTex"] = { { 0, 63 }, },
        },
    },
    ["LumiLayer_110-blend"] = {
        ["nodeDuration"] = { { 0, 63 }, },
        ["texDuration"] = {
            ["baseTex"] = { { 0, 63 }, },
            ["InputTex"] = { { 0, 63 }, },
        },
    },
    ["LumiAnimSeqLoadAndCrop_115-effect0"] = {
        ["nodeDuration"] = { { 0, 63 }, },
        ["texDuration"] = {
            ["seqTex"] = { { 0, 63 }, },
            ["InputTex"] = { { 0, 63 }, },
        },
    },
    ["LumiLayer_115-blend"] = {
        ["nodeDuration"] = { { 0, 63 }, },
        ["texDuration"] = {
            ["baseTex"] = { { 0, 63 }, },
            ["InputTex"] = { { 0, 63 }, },
        },
    },
    ["LumiSGlow_96-effect0"] = {
        ["nodeDuration"] = { { 0, 63 }, },
        ["texDuration"] = {
            ["InputTex"] = { { 0, 63 }, },
        },
    },
    ["LumiLayer_96-blend"] = {
        ["nodeDuration"] = { { 0, 63 }, },
        ["texDuration"] = {
            ["baseTex"] = { { 0, 63 }, },
            ["InputTex"] = { { 0, 63 }, },
        },
    },
    ["LumiSGlow_102-effect0"] = {
        ["nodeDuration"] = { { 0, 63 }, },
        ["texDuration"] = {
            ["InputTex"] = { { 0, 63 }, },
        },
    },
    ["LumiLayer_102-blend"] = {
        ["nodeDuration"] = { { 0, 63 }, },
        ["texDuration"] = {
            ["baseTex"] = { { 0, 63 }, },
            ["InputTex"] = { { 0, 63 }, },
        },
    },
}
data.ae_durations = ae_durations

local ae_compDurations = { 0.000000, 63.000000 }
data.ae_compDurations = ae_compDurations

local ae_effectType = "xtEffect"
data.ae_effectType = ae_effectType

local ae_attribute = {
    ["LumiAnimSeqLoadAndCrop_110-effect0"] = {
        ["cropType"] = 0,
        ["edgeType"] = 0,
        ["enableVideoAlphaBlend"] = false,
        ["opacity"] = 1,
        ["scale"] = 1,
        ["speed"] = 1,
    },
    ["LumiLayer_110-blend"] = {
        ["hasBlend"] = true,
        ["hasMatte"] = false,
        ["hasTransform"] = false,
        ["layerType"] = "Solid",
        ["blendMode"] = "Multiply",
    },
    ["LumiAnimSeqLoadAndCrop_115-effect0"] = {
        ["cropType"] = 0,
        ["edgeType"] = 0,
        ["enableVideoAlphaBlend"] = false,
        ["opacity"] = 1,
        ["scale"] = 1,
        ["speed"] = 1,
    },
    ["LumiLayer_115-blend"] = {
        ["hasBlend"] = true,
        ["hasMatte"] = false,
        ["hasTransform"] = false,
        ["layerType"] = "Solid",
        ["blendMode"] = "Overlay",
    },
    ["LumiSGlow_96-effect0"] = {
        ["brightness"] = 0.6,
        ["glowColor"] = Amaz.Color(1, 1, 1, 1),
        ["threshold"] = 0.34,
        ["thresholdAddColor"] = Amaz.Color(0, 0, 0, 1),
        ["glowWidth"] = 0.06,
        ["widthX"] = 1,
        ["widthY"] = 1,
        ["widthRed"] = 1,
        ["widthGreen"] = 1,
        ["widthBlue"] = 1,
        ["show"] = 0,
        ["combine"] = 0,
        ["edgeMode"] = 1,
        ["glowFromAlpha"] = 0,
        ["glowUnderSource"] = 0,
        ["sourceOpacity"] = 1,
        ["dither"] = 1,
        ["quality"] = 0.2,
    },
    ["LumiLayer_96-blend"] = {
        ["hasBlend"] = true,
        ["hasMatte"] = false,
        ["hasTransform"] = false,
        ["layerType"] = "Adjustment",
        ["blendMode"] = "Normal",
    },
    ["LumiSGlow_102-effect0"] = {
        ["brightness"] = 0.6,
        ["glowColor"] = Amaz.Color(1, 1, 1, 1),
        ["threshold"] = 0.34,
        ["thresholdAddColor"] = Amaz.Color(0, 0, 0, 1),
        ["glowWidth"] = 0.13,
        ["widthX"] = 1,
        ["widthY"] = 1,
        ["widthRed"] = 1,
        ["widthGreen"] = 1,
        ["widthBlue"] = 1,
        ["show"] = 0,
        ["combine"] = 0,
        ["edgeMode"] = 1,
        ["glowFromAlpha"] = 0,
        ["glowUnderSource"] = 0,
        ["sourceOpacity"] = 1,
        ["dither"] = 1,
        ["quality"] = 0.2,
    },
    ["LumiLayer_102-blend"] = {
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
    { "LumiLayer_110-blend", "baseTex", 0 },
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_sliderInfos = {
    -- ["effects_adjust_filter"] = 
    -- { 
    --     { "LumiAnimSeqLoadAndCrop_110-effect0", "opacity", 'number', { true, }, 1, 1, 0, 1, { 0, }, { 0, }, }, 
    --     { "LumiAnimSeqLoadAndCrop_115-effect0", "opacity", 'number', { true, }, 1, 1, 0, 1, { 0, }, { 0, }, },
    --     { "LumiSGlow_102-effect0", "brightness", 'number', { true, }, 1, 0.7, 0, 0.7, { 0, }, { 0, }, }, 
    --     { "LumiSGlow_96-effect0", "brightness", 'number', { true, }, 1, 0.7, 0, 0.7, { 0, }, { 0, }, }, 
    -- },
    -- ["Internal_Filter"] = {{"LumiSGlow_102-effect0", "brightness", 'number', {true, }, 1, 0.7, 0, 0.7, {0, }, {0, }, },{"LumiSGlow_96-effect0", "brightness", 'number', {true, }, 1, 0.7, 0, 0.7, {0, }, {0, }, },},
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
    speedInfo = { 1, 0, 1, },
}
data.ae_animationInfos = ae_animationInfos


return data
