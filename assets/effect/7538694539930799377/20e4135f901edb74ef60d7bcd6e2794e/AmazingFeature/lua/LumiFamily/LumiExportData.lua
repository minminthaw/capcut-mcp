local data = {}

local ae_compDurations = {0, 2}
data.ae_compDurations = ae_compDurations

local ae_effectType = 'transition'
data.ae_effectType = ae_effectType

local ae_transitionInputIndex = {
    {'LumiBrightness_4013-effect0', 'InputTex', 0},
    {'LumiBrightness_4015-effect0', 'InputTex', 0},
    {'LumiBrightness_4008-effect0', 'InputTex', 1},
    {'LumiFill_4011-effect0', 'InputTex', 0},
    {'LumiLayer_4009-trs-blend', 'InputTex', 0},
    {'LumiBrightness_4006-effect0', 'InputTex', 1},
    {'LumiLayer_4003-trs-blend', 'InputTex', 1},
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_durations = {
    ['LumiBrightness_4013-effect0'] = {
        ['nodeDuration'] = {{0, 1.26666666666667}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 1.26666666666667}, },
        },
    },
    ['LumiBrightness_4015-effect0'] = {
        ['nodeDuration'] = {{0, 1.26666666666667}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 1.26666666666667}, },
        },
    },
    ['LumiLayer_4014-trs'] = {
        ['nodeDuration'] = {{0, 1.26666666666667}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 1.26666666666667}, },
        },
    },
    ['LumiLayer_4015-trs-matte'] = {
        ['nodeDuration'] = {{0, 1.26666666666667}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 1.26666666666667}, },
            ['maskTex'] = {{0, 1.26666666666667}, },
        },
    },
    ['LumiLayer_4012-trs'] = {
        ['nodeDuration'] = {{0, 1.26666666666667}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 1.26666666666667}, },
        },
    },
    ['LumiLayer_4013-trs-matte-blend'] = {
        ['nodeDuration'] = {{0, 1.26666666666667}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 1.26666666666667}, },
            ['baseTex'] = {{0, 1.26666666666667}, },
            ['maskTex'] = {{0, 1.26666666666667}, },
        },
    },
    ['LumiBrightness_4008-effect0'] = {
        ['nodeDuration'] = {{1, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{1, 2}, },
        },
    },
    ['LumiFill_4011-effect0'] = {
        ['nodeDuration'] = {{0, 1.26666666666667}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 1.26666666666667}, },
        },
    },
    ['LumiGaussianBlur_4011-effect1'] = {
        ['nodeDuration'] = {{0, 1.26666666666667}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 1.26666666666667}, },
        },
    },
    ['LumiLayer_4011-trs-blend'] = {
        ['nodeDuration'] = {{0, 1.26666666666667}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 1.26666666666667}, },
            ['baseTex'] = {{0, 1.26666666666667}, },
        },
    },
    ['LumiGaussianBlur_4010-effect0'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 1.26666666666667}, },
        },
    },
    ['LumiLayer_4010-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['baseTex'] = {{0, 1.26666666666667}, },
        },
    },
    ['LumiLayer_4009-trs-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 1.5}, },
            ['baseTex'] = {{0, 2}, },
        },
    },
    ['LumiLayer_4007-trs'] = {
        ['nodeDuration'] = {{1, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{1, 2}, },
        },
    },
    ['LumiLayer_4008-trs-matte-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{1, 2}, },
            ['baseTex'] = {{0, 2}, },
            ['maskTex'] = {{1, 2}, },
        },
    },
    ['LumiBrightness_4006-effect0'] = {
        ['nodeDuration'] = {{1, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{1, 2}, },
        },
    },
    ['LumiLayer_4005-trs'] = {
        ['nodeDuration'] = {{1, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{1, 2}, },
        },
    },
    ['LumiLayer_4006-trs-matte-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{1, 2}, },
            ['baseTex'] = {{0, 2}, },
            ['maskTex'] = {{1, 2}, },
        },
    },
    ['LumiGaussianBlur_4004-effect0'] = {
        ['nodeDuration'] = {{1.16666666666667, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
        },
    },
    ['LumiExposure_4004-effect1'] = {
        ['nodeDuration'] = {{1.16666666666667, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{1.16666666666667, 2}, },
        },
    },
    ['LumiLayer_4004-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{1.16666666666667, 2}, },
            ['baseTex'] = {{0, 2}, },
        },
    },
    ['LumiLayer_4003-trs-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{1, 2}, },
            ['baseTex'] = {{0, 2}, },
        },
    },
    ['LumiGaussianBlur_4002-effect0'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
        },
    },
    ['LumiRadialBlur_4002-effect1'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
        },
    },
    ['LumiLayer_4002-blend'] = {
        ['nodeDuration'] = {{0, 2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 2}, },
            ['baseTex'] = {{0, 2}, },
        },
    },
}
data.ae_durations = ae_durations

local ae_attribute = {
    ['LumiBrightness_4013-effect0'] = {
        ['brightnessIntensity'] = -1,
        ['AEDesignSize'] = Amaz.Vector2f(672, 504),
    },
    ['LumiBrightness_4015-effect0'] = {
        ['brightnessIntensity'] = -1,
        ['AEDesignSize'] = Amaz.Vector2f(672, 504),
    },
    ['LumiLayer_4014-trs'] = {
        ['hasBlend'] = false,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Solid',
        ['anchorPoint'] = Amaz.Vector3f(336, 252, 0),
        ['position'] = Amaz.Vector3f(-376.454876109774, -160.68677543723, 82.6079857336417),
        ['scale'] = Amaz.Vector3f(105, 184.5, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = -34,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527099629,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(336, 252, 0),
        ['p0_scale'] = Amaz.Vector3f(60, 60, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = -12.154696870285,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.5977527099629,
        ['compositeSize'] = Amaz.Vector2f(672, 504),
        ['layerSize'] = Amaz.Vector2f(672, 504),
        ['mirrorEdge'] = false,
    },
    ['LumiLayer_4015-trs-matte'] = {
        ['hasBlend'] = false,
        ['hasMatte'] = true,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(336, 252, 0),
        ['position'] = Amaz.Vector3f(-368.113798061379, -159.770954242278, 82.6079857336417),
        ['scale'] = Amaz.Vector3f(168.8, 188, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = -34,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527099629,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(336, 252, 0),
        ['p0_scale'] = Amaz.Vector3f(60, 60, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = -12.154696870285,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.5977527099629,
        ['compositeSize'] = Amaz.Vector2f(672, 504),
        ['layerSize'] = Amaz.Vector2f(672, 504),
        ['mirrorEdge'] = false,
        ['matteMode'] = 0,
    },
    ['LumiLayer_4012-trs'] = {
        ['hasBlend'] = false,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Solid',
        ['anchorPoint'] = Amaz.Vector3f(336, 252, 0),
        ['position'] = Amaz.Vector3f(378.249906453521, 58.9434648236815, 88),
        ['scale'] = Amaz.Vector3f(105, 184.5, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 20,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527099629,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(336, 252, 0),
        ['p0_scale'] = Amaz.Vector3f(60, 60, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = -12.154696870285,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.5977527099629,
        ['compositeSize'] = Amaz.Vector2f(672, 504),
        ['layerSize'] = Amaz.Vector2f(672, 504),
        ['mirrorEdge'] = false,
    },
    ['LumiLayer_4013-trs-matte-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = true,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(336, 252, 0),
        ['position'] = Amaz.Vector3f(339.125575252179, 58.5493148391311, 88),
        ['scale'] = Amaz.Vector3f(168.8, 188, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 20,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527099629,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(336, 252, 0),
        ['p0_scale'] = Amaz.Vector3f(60, 60, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = -12.154696870285,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.5977527099629,
        ['compositeSize'] = Amaz.Vector2f(672, 504),
        ['layerSize'] = Amaz.Vector2f(672, 504),
        ['mirrorEdge'] = false,
        ['matteMode'] = 0,
        ['blendMode'] = 0,
    },
    ['LumiBrightness_4008-effect0'] = {
        ['brightnessIntensity'] = -1,
        ['AEDesignSize'] = Amaz.Vector2f(672, 504),
    },
    ['LumiFill_4011-effect0'] = {
        ['color'] = Amaz.Color(0, 0, 0, 1),
        ['opacity'] = 1,
        ['alpha'] = 1,
        ['reverse'] = false,
        ['blendMode'] = 0,
        ['AEDesignSize'] = Amaz.Vector2f(672, 504),
    },
    ['LumiGaussianBlur_4011-effect1'] = {
        ['blurIntensity'] = 20,
        ['quality'] = 0.5,
        ['spaceDither'] = 0,
        ['horizontalStrength'] = 1,
        ['verticalStrength'] = 1,
        ['blurDirection'] = 0,
        ['borderType'] = 0,
        ['blurAlpha'] = true,
        ['inverseGammaCorrection'] = true,
        ['AEDesignSize'] = Amaz.Vector2f(672, 504),
    },
    ['LumiLayer_4011-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(336, 252, 0),
        ['position'] = Amaz.Vector3f(21.9491182833652, 24.6399085930068, -42),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 9.76526002209883,
        ['rotation'] = 0,
        ['opacity'] = 37.2079285226533,
        ['active_cam_fovx'] = 39.5977527099629,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(336, 252, 0),
        ['p0_scale'] = Amaz.Vector3f(60, 60, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = -12.154696870285,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.5977527099629,
        ['compositeSize'] = Amaz.Vector2f(672, 504),
        ['layerSize'] = Amaz.Vector2f(672, 504),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiGaussianBlur_4010-effect0'] = {
        ['blurIntensity'] = 20,
        ['quality'] = 0.5,
        ['spaceDither'] = 0,
        ['horizontalStrength'] = 1,
        ['verticalStrength'] = 1,
        ['blurDirection'] = 0,
        ['borderType'] = 0,
        ['blurAlpha'] = true,
        ['inverseGammaCorrection'] = true,
        ['AEDesignSize'] = Amaz.Vector2f(672, 504),
    },
    ['LumiLayer_4010-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Adjustment',
        ['blendMode'] = 0,
    },
    ['LumiLayer_4009-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(336, 252, 0),
        ['position'] = Amaz.Vector3f(0, 0, -42),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 9.76526002209883,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527099629,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(336, 252, 0),
        ['p0_scale'] = Amaz.Vector3f(60, 60, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = -12.154696870285,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.5977527099629,
        ['compositeSize'] = Amaz.Vector2f(672, 504),
        ['layerSize'] = Amaz.Vector2f(672, 504),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiLayer_4007-trs'] = {
        ['hasBlend'] = false,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Solid',
        ['anchorPoint'] = Amaz.Vector3f(64.9972899729264, 252, 0),
        ['position'] = Amaz.Vector3f(11.0137028582221, 51.0546478007016, 0),
        ['scale'] = Amaz.Vector3f(106.8, 267, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 90,
        ['opacity'] = 5,
        ['active_cam_fovx'] = 39.5977527099629,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(336, 252, 0),
        ['p0_scale'] = Amaz.Vector3f(60, 60, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = -12.154696870285,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.5977527099629,
        ['compositeSize'] = Amaz.Vector2f(672, 504),
        ['layerSize'] = Amaz.Vector2f(672, 504),
        ['mirrorEdge'] = false,
    },
    ['LumiLayer_4008-trs-matte-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = true,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(336, 252, 0),
        ['position'] = Amaz.Vector3f(9.02722643755338, 179.954050412137, 0),
        ['scale'] = Amaz.Vector3f(178, 178, 178),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = -17,
        ['rotation'] = 180,
        ['opacity'] = 5,
        ['active_cam_fovx'] = 39.5977527099629,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(336, 252, 0),
        ['p0_scale'] = Amaz.Vector3f(60, 60, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = -12.154696870285,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.5977527099629,
        ['compositeSize'] = Amaz.Vector2f(672, 504),
        ['layerSize'] = Amaz.Vector2f(672, 504),
        ['mirrorEdge'] = false,
        ['matteMode'] = 0,
        ['blendMode'] = 0,
    },
    ['LumiBrightness_4006-effect0'] = {
        ['brightnessIntensity'] = -1,
        ['AEDesignSize'] = Amaz.Vector2f(672, 504),
    },
    ['LumiLayer_4005-trs'] = {
        ['hasBlend'] = false,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Solid',
        ['anchorPoint'] = Amaz.Vector3f(607.002710027096, 252, 0),
        ['position'] = Amaz.Vector3f(8.98629714177798, -51.0546478006848, 0),
        ['scale'] = Amaz.Vector3f(106.8, 267, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 90,
        ['opacity'] = 5,
        ['active_cam_fovx'] = 39.5977527099629,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(336, 252, 0),
        ['p0_scale'] = Amaz.Vector3f(60, 60, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = -12.154696870285,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.5977527099629,
        ['compositeSize'] = Amaz.Vector2f(672, 504),
        ['layerSize'] = Amaz.Vector2f(672, 504),
        ['mirrorEdge'] = false,
    },
    ['LumiLayer_4006-trs-matte-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = true,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(336, 252, 0),
        ['position'] = Amaz.Vector3f(10.5407550453667, -180.454685713075, 0),
        ['scale'] = Amaz.Vector3f(178, 178, 178),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 19,
        ['rotation'] = 180,
        ['opacity'] = 5,
        ['active_cam_fovx'] = 39.5977527099629,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(336, 252, 0),
        ['p0_scale'] = Amaz.Vector3f(60, 60, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = -12.154696870285,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.5977527099629,
        ['compositeSize'] = Amaz.Vector2f(672, 504),
        ['layerSize'] = Amaz.Vector2f(672, 504),
        ['mirrorEdge'] = false,
        ['matteMode'] = 0,
        ['blendMode'] = 0,
    },
    ['LumiGaussianBlur_4004-effect0'] = {
        ['blurIntensity'] = 35,
        ['quality'] = 0.5,
        ['spaceDither'] = 0,
        ['horizontalStrength'] = 1,
        ['verticalStrength'] = 1,
        ['blurDirection'] = 0,
        ['borderType'] = 0,
        ['blurAlpha'] = true,
        ['inverseGammaCorrection'] = true,
        ['AEDesignSize'] = Amaz.Vector2f(672, 504),
    },
    ['LumiExposure_4004-effect1'] = {
        ['channelType'] = 0,
        ['exposure'] = 0,
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
        ['AEDesignSize'] = Amaz.Vector2f(672, 504),
    },
    ['LumiLayer_4004-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Adjustment',
        ['blendMode'] = 0,
    },
    ['LumiLayer_4003-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(336, 252, 0),
        ['position'] = Amaz.Vector3f(0, 0, -110.735996154642),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = -20,
        ['rotation'] = 180,
        ['opacity'] = 5,
        ['active_cam_fovx'] = 39.5977527099629,
        ['p0_anchorPoint'] = Amaz.Vector3f(0, 0, 0),
        ['p0_position'] = Amaz.Vector3f(336, 252, 0),
        ['p0_scale'] = Amaz.Vector3f(60, 60, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = -12.154696870285,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.5977527099629,
        ['compositeSize'] = Amaz.Vector2f(672, 504),
        ['layerSize'] = Amaz.Vector2f(672, 504),
        ['mirrorEdge'] = false,
        ['blendMode'] = 0,
    },
    ['LumiGaussianBlur_4002-effect0'] = {
        ['blurIntensity'] = 11.1111111111111,
        ['quality'] = 1,
        ['spaceDither'] = 0,
        ['horizontalStrength'] = 1,
        ['verticalStrength'] = 1,
        ['blurDirection'] = 0,
        ['borderType'] = 0,
        ['blurAlpha'] = true,
        ['inverseGammaCorrection'] = true,
        ['AEDesignSize'] = Amaz.Vector2f(672, 504),
    },
    ['LumiRadialBlur_4002-effect1'] = {
        ['blurType'] = 3,
        ['amount'] = -7.03289368127945,
        ['quality'] = 1,
        ['center'] = Amaz.Vector2f(0.5, 0.5),
        ['weightDecay'] = 0.965,
        ['dither'] = 1,
        ['blurAlpha'] = true,
        ['inverseGammaCorrection'] = false,
        ['borderType'] = 1,
        ['AEDesignSize'] = Amaz.Vector2f(672, 504),
    },
    ['LumiLayer_4002-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Adjustment',
        ['blendMode'] = 0,
    },
}
data.ae_attribute = ae_attribute

local ae_keyframes = {
    ['LumiLayer_4014-trs#position#vector'] =
{
	{
		{0.166667, 0.166667, 0.4, 1, }, 
		{0, 1.366667, }, 
		{{-378.4, -580, 0, }, {-376.327913375, -133.317231575, 88, }, {-378.054652237892, -505.552871704102, 14.6666669845581, }, {-376.673261137108, -207.764359870898, 73.3333330154419, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4014-trs#yRotation#number'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0, 0.9, }, 
		{{0, }, {-34, }, }, 
		{6417, }, 
		{1, }, 
	}, 
},
    ['LumiLayer_4014-trs#opacity#number'] =
{
	{
		{0.9, 0, 0.833333333, 0.833333333, }, 
		{1.166667, 1.266667, }, 
		{{100, }, {5, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4014-trs#p0_scale#vector'] =
{
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0, 0.5, }, 
		{{100, 100, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0.5, 1.133333, }, 
		{{60, 60, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.35,0.35,0.35, 1,1,0.35, }, 
		{1.133333, 1.966667, }, 
		{{60, 60, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4014-trs#p0_rotation#number'] =
{
	{
		{1, 0, 0, 1, }, 
		{0.5, 1.966667, }, 
		{{0, }, {-180, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4015-trs-matte#position#vector'] =
{
	{
		{0.166667, 0.166667, 0.4, 1, }, 
		{0, 1.366667, }, 
		{{-370.058921952, -579.084178805, 0, }, {-367.986835327, -132.40141038, 88, }, {-369.713574189892, -504.637050509102, 14.6666669845581, }, {-368.332183089108, -206.848538675898, 73.3333330154419, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4015-trs-matte#yRotation#number'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0, 0.9, }, 
		{{0, }, {-34, }, }, 
		{6417, }, 
		{1, }, 
	}, 
},
    ['LumiLayer_4015-trs-matte#opacity#number'] =
{
	{
		{0.9, 0, 0.833333333, 0.833333333, }, 
		{1.166667, 1.266667, }, 
		{{100, }, {5, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4015-trs-matte#p0_scale#vector'] =
{
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0, 0.5, }, 
		{{100, 100, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0.5, 1.133333, }, 
		{{60, 60, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.35,0.35,0.35, 1,1,0.35, }, 
		{1.133333, 1.966667, }, 
		{{60, 60, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4015-trs-matte#p0_rotation#number'] =
{
	{
		{1, 0, 0, 1, }, 
		{0.5, 1.966667, }, 
		{{0, }, {-180, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4012-trs#position#vector'] =
{
	{
		{0.166667, 0.166667, 0.4, 1, }, 
		{0, 0.8, }, 
		{{378.4, 540, 0, }, {378.249906454, 58.943464824, 88, }, {378.374984409288, 459.823913574219, 14.6666669845581, }, {378.274922044712, 139.119551249781, 73.3333330154419, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4012-trs#yRotation#number'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0, 0.933333, }, 
		{{0, }, {20, }, }, 
		{6417, }, 
		{1, }, 
	}, 
},
    ['LumiLayer_4012-trs#opacity#number'] =
{
	{
		{0.9, 0, 0.833333333, 0.833333333, }, 
		{1.166667, 1.266667, }, 
		{{100, }, {5, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4012-trs#p0_scale#vector'] =
{
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0, 0.5, }, 
		{{100, 100, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0.5, 1.133333, }, 
		{{60, 60, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.35,0.35,0.35, 1,1,0.35, }, 
		{1.133333, 1.966667, }, 
		{{60, 60, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4012-trs#p0_rotation#number'] =
{
	{
		{1, 0, 0, 1, }, 
		{0.5, 1.966667, }, 
		{{0, }, {-180, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4013-trs-matte-blend#position#vector'] =
{
	{
		{0.166667, 0.166667, 0.4, 1, }, 
		{0, 0.8, }, 
		{{337.203582174, 540.92308159, 0, }, {339.125575252, 58.549314839, 88, }, {337.523914343533, 460.527451707188, 14.6666669845581, }, {338.805243082467, 138.944944721813, 73.3333330154419, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4013-trs-matte-blend#yRotation#number'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{0, 0.933333, }, 
		{{0, }, {20, }, }, 
		{6417, }, 
		{1, }, 
	}, 
},
    ['LumiLayer_4013-trs-matte-blend#opacity#number'] =
{
	{
		{0.9, 0, 0.833333333, 0.833333333, }, 
		{1.166667, 1.266667, }, 
		{{100, }, {5, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4013-trs-matte-blend#p0_scale#vector'] =
{
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0, 0.5, }, 
		{{100, 100, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0.5, 1.133333, }, 
		{{60, 60, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.35,0.35,0.35, 1,1,0.35, }, 
		{1.133333, 1.966667, }, 
		{{60, 60, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4013-trs-matte-blend#p0_rotation#number'] =
{
	{
		{1, 0, 0, 1, }, 
		{0.5, 1.966667, }, 
		{{0, }, {-180, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4011-trs-blend#position#vector'] =
{
	{
		{0.166667, 0.166667, 0.48, 1, }, 
		{0, 0.8, }, 
		{{0, 0, 0, }, {21.949118283, 24.639908593, -42, }, {3.65818643569946, 4.10665130615234, -7, }, {18.2909318473005, 20.5332572868477, -35, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4011-trs-blend#yRotation#number'] =
{
	{
		{0.166666667, 0.166666667, 0.28, 1, }, 
		{0, 0.5, }, 
		{{0, }, {20, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.72, 0, 0.833333333, 0.833333333, }, 
		{0.5, 1.166667, }, 
		{{20, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4011-trs-blend#opacity#number'] =
{
	{
		{0.166666667, 0, 0.833333333, 1, }, 
		{0.666667, 1.166667, }, 
		{{40, }, {36, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.166666667, 0, 0.833333333, 0.833333333, }, 
		{1.166667, 1.266667, }, 
		{{36, }, {5, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4011-trs-blend#p0_scale#vector'] =
{
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0, 0.5, }, 
		{{100, 100, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0.5, 1.133333, }, 
		{{60, 60, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.35,0.35,0.35, 1,1,0.35, }, 
		{1.133333, 1.966667, }, 
		{{60, 60, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4011-trs-blend#p0_rotation#number'] =
{
	{
		{1, 0, 0, 1, }, 
		{0.5, 1.966667, }, 
		{{0, }, {-180, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4009-trs-blend#position#vector'] =
{
	{
		{0.166667, 0.166667, 0.48, 1, }, 
		{0, 0.8, }, 
		{{0, 0, 0, }, {0, 0, -42, }, {0, 0, -7, }, {0, 0, -35, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4009-trs-blend#yRotation#number'] =
{
	{
		{0.166666667, 0.166666667, 0.28, 1, }, 
		{0, 0.5, }, 
		{{0, }, {20, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.72, 0, 0.833333333, 0.833333333, }, 
		{0.5, 1.166667, }, 
		{{20, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4009-trs-blend#opacity#number'] =
{
	{
		{0.9, 0, 0.833333333, 0.833333333, }, 
		{1.166667, 1.366667, }, 
		{{100, }, {5, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4009-trs-blend#p0_scale#vector'] =
{
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0, 0.5, }, 
		{{100, 100, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0.5, 1.133333, }, 
		{{60, 60, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.35,0.35,0.35, 1,1,0.35, }, 
		{1.133333, 1.966667, }, 
		{{60, 60, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4009-trs-blend#p0_rotation#number'] =
{
	{
		{1, 0, 0, 1, }, 
		{0.5, 1.966667, }, 
		{{0, }, {-180, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4007-trs#position#vector'] =
{
	{
		{0.166667, 0.166667, 0.833333, 0.833333, }, 
		{1, 1.966667, }, 
		{{11.013702858, 51.054647801, 0, }, {1.013702858, 51.054647801, 220, }, {9.34703623106976, 51.054647801, 36.6666679382324, }, {2.68036948493024, 51.054647801, 183.333332061768, }, }, 
		{6413, }, 
		{1, }, 
	}, 
},
    ['LumiLayer_4007-trs#opacity#number'] =
{
	{
		{0.61, 0, 0.833333333, 0.833333333, }, 
		{1, 1.133333, }, 
		{{5, }, {100, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4007-trs#p0_scale#vector'] =
{
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0, 0.5, }, 
		{{100, 100, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0.5, 1.133333, }, 
		{{60, 60, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.35,0.35,0.35, 1,1,0.35, }, 
		{1.133333, 1.966667, }, 
		{{60, 60, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4007-trs#p0_rotation#number'] =
{
	{
		{1, 0, 0, 1, }, 
		{0.5, 1.966667, }, 
		{{0, }, {-180, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4008-trs-matte-blend#position#vector'] =
{
	{
		{0.166667, 0.166667, 0.833333, 0.833333, }, 
		{1, 1.966667, }, 
		{{9.027226438, 179.954050412, 0, }, {-0.972773562, 179.954050412, 220, }, {7.36055981106976, 179.954050412, 36.6666679382324, }, {0.69389306493024, 179.954050412, 183.333332061768, }, }, 
		{6413, }, 
		{1, }, 
	}, 
},
    ['LumiLayer_4008-trs-matte-blend#yRotation#number'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{1.166667, 1.666667, }, 
		{{-17, }, {0, }, }, 
		{6417, }, 
		{1, }, 
	}, 
},
    ['LumiLayer_4008-trs-matte-blend#opacity#number'] =
{
	{
		{0.61, 0, 0.833333333, 0.833333333, }, 
		{1, 1.233333, }, 
		{{5, }, {100, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4008-trs-matte-blend#p0_scale#vector'] =
{
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0, 0.5, }, 
		{{100, 100, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0.5, 1.133333, }, 
		{{60, 60, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.35,0.35,0.35, 1,1,0.35, }, 
		{1.133333, 1.966667, }, 
		{{60, 60, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4008-trs-matte-blend#p0_rotation#number'] =
{
	{
		{1, 0, 0, 1, }, 
		{0.5, 1.966667, }, 
		{{0, }, {-180, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4005-trs#position#vector'] =
{
	{
		{0.166667, 0.166667, 0.833333, 0.833333, }, 
		{1, 1.966667, }, 
		{{8.986297142, -51.054647801, 0, }, {-1.013702858, -51.054647801, 220, }, {7.31963051506976, -51.054647801, 36.6666679382324, }, {0.65296376893024, -51.054647801, 183.333332061768, }, }, 
		{6413, }, 
		{1, }, 
	}, 
},
    ['LumiLayer_4005-trs#opacity#number'] =
{
	{
		{0.61, 0, 0.833333333, 0.833333333, }, 
		{1, 1.133333, }, 
		{{5, }, {100, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4005-trs#p0_scale#vector'] =
{
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0, 0.5, }, 
		{{100, 100, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0.5, 1.133333, }, 
		{{60, 60, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.35,0.35,0.35, 1,1,0.35, }, 
		{1.133333, 1.966667, }, 
		{{60, 60, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4005-trs#p0_rotation#number'] =
{
	{
		{1, 0, 0, 1, }, 
		{0.5, 1.966667, }, 
		{{0, }, {-180, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4006-trs-matte-blend#position#vector'] =
{
	{
		{0.166667, 0.166667, 0.833333, 0.833333, }, 
		{1, 1.966667, }, 
		{{10.540755045, -180.454685713, 0, }, {0.540755045, -180.454685713, 220, }, {8.87408841806976, -180.454685713, 36.6666679382324, }, {2.20742167193024, -180.454685713, 183.333332061768, }, }, 
		{6413, }, 
		{1, }, 
	}, 
},
    ['LumiLayer_4006-trs-matte-blend#yRotation#number'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{1.166667, 1.666667, }, 
		{{19, }, {0, }, }, 
		{6417, }, 
		{1, }, 
	}, 
},
    ['LumiLayer_4006-trs-matte-blend#opacity#number'] =
{
	{
		{0.61, 0, 0.833333333, 0.833333333, }, 
		{1, 1.233333, }, 
		{{5, }, {100, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4006-trs-matte-blend#p0_scale#vector'] =
{
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0, 0.5, }, 
		{{100, 100, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0.5, 1.133333, }, 
		{{60, 60, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.35,0.35,0.35, 1,1,0.35, }, 
		{1.133333, 1.966667, }, 
		{{60, 60, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4006-trs-matte-blend#p0_rotation#number'] =
{
	{
		{1, 0, 0, 1, }, 
		{0.5, 1.966667, }, 
		{{0, }, {-180, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiExposure_4004-effect1#exposure#number'] =
{
	{
		{0.166666667, 0.166666667, 0.833333333, 0.833333333, }, 
		{1.166667, 1.4, }, 
		{{0, }, {-1.6, }, }, 
		{6417, }, 
		{1, }, 
	}, 
},
    ['LumiLayer_4003-trs-blend#position#vector'] =
{
	{
		{0.166667, 0.166667, 0.582693, 1, }, 
		{1, 1.966667, }, 
		{{0, 0, -110.735996155, }, {0, 0, 0, }, {0, 0, -97.5050486604932, }, {0, 0, -5.92771625518799, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4003-trs-blend#yRotation#number'] =
{
	{
		{0.35, 0, 0.37, 1, }, 
		{1.166667, 1.966667, }, 
		{{-20, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4003-trs-blend#opacity#number'] =
{
	{
		{0.61, 0, 0.833333333, 0.833333333, }, 
		{1, 1.233333, }, 
		{{5, }, {100, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4003-trs-blend#p0_scale#vector'] =
{
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0, 0.5, }, 
		{{100, 100, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.833333333,0.833333333,0.833333333, 0.833333333,0.833333333,0.833333333, }, 
		{0.5, 1.133333, }, 
		{{60, 60, 100, }, {60, 60, 100, }, }, 
		{6414, }, 
		{1, }, 
	}, 
	{
		{0.166666667,0.166666667,0.166666667, 0.166666667,0.166666667,0.166666667, 0.35,0.35,0.35, 1,1,0.35, }, 
		{1.133333, 1.966667, }, 
		{{60, 60, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_4003-trs-blend#p0_rotation#number'] =
{
	{
		{1, 0, 0, 1, }, 
		{0.5, 1.966667, }, 
		{{0, }, {-180, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiGaussianBlur_4002-effect0#blurIntensity#number'] =
{
	{
		{1, 0, 0.833333333, 0.833333333, }, 
		{0.666667, 1.166667, }, 
		{{0, }, {50, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.166666667, 0.166666667, 0, 1, }, 
		{1.166667, 1.5, }, 
		{{50, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiRadialBlur_4002-effect1#amount#number'] =
{
	{
		{0.33333333, 0, 0.833333333, 0.833333333, }, 
		{0.9, 1.166667, }, 
		{{0, }, {-31, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.166666667, 0.166666667, 0.66666667, 1, }, 
		{1.166667, 1.333333, }, 
		{{-31, }, {0, }, }, 
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
