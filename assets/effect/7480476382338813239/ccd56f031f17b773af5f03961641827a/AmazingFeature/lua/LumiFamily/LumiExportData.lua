local data = {}

local ae_compDurations = {0, 3.03333333333333}
data.ae_compDurations = ae_compDurations

local ae_effectType = 'lvFilter'
data.ae_effectType = ae_effectType

local ae_transitionInputIndex = {
    {'LumiCurves_140-effect0', 'InputTex', 0},
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_durations = {
    ['LumiCurves_140-effect0'] = {
        ['nodeDuration'] = {{0, 3.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3.03333333333333}, },
        },
    },
    ['LumiStrongSharpen_140-effect1'] = {
        ['nodeDuration'] = {{0, 3.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3.03333333333333}, },
        },
    },
    ['LumiSurfaceBlur_140-effect2'] = {
        ['nodeDuration'] = {{0, 3.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 3.03333333333333}, },
        },
    },
}
data.ae_durations = ae_durations

local ae_attribute = {
    ['LumiCurves_140-effect0'] = {
        ['intensityY'] = 1,
        ['intensityR'] = 1,
        ['intensityG'] = 0.95,
        ['intensityB'] = 1,
    },
    ['LumiStrongSharpen_140-effect1'] = {
        ['strength'] = 0.3,
        ['range'] = 0.1,
        ['quality'] = 0.20900000298023,
    },
    ['LumiSurfaceBlur_140-effect2'] = {
        ['radius'] = 5,
        ['blurIntensity'] = 8,
    },
    ['LumiSkinFilter'] = {
        ['skinFilterIntensity'] = 1,
        ['bgFilterIntensity'] = 1,
    },
}
data.ae_attribute = ae_attribute

local ae_sliderInfos = {
    ['intensity'] = {
        {'LumiStrongSharpen_140-effect1', 'strength', 'number', {true, }, 1, 1.25, 0, 1, {0, }, {0, }, },
        {'LumiSurfaceBlur_140-effect2', 'blurIntensity', 'number', {true, }, 1, 1.25, 0.01, 1, {0, }, {0, }, },
        {'LumiSkinFilter', 'skinFilterIntensity', 'number', {true, }, 1, 0.375, 0.0, 1, {0, }, {0, }, },
        {'LumiSkinFilter', 'bgFilterIntensity', 'number', {true, }, 1, 0.375, 0.0, 1, {0, }, {0, }, },
    },
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
