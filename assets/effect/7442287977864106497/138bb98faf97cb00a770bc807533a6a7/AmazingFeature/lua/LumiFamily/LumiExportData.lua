local data = {}

local ae_compDurations = {0, 3}
data.ae_compDurations = ae_compDurations

local ae_effectType = 'effect'
data.ae_effectType = ae_effectType

local ae_transitionInputIndex = {
    {'LumiGaussianBlur_439-effect0', 'InputTex', 0},
    {'LumiRoundCorner_606-effect0', 'InputTex', 0},
    {'LumiRoundCorner_669-effect0', 'InputTex', 0},
    {'LumiRoundCorner_734-effect0', 'InputTex', 0},
    {'LumiRoundCorner_768-effect0', 'InputTex', 0},
    {'LumiRoundCorner_471-effect0', 'InputTex', 0},
}
data.ae_transitionInputIndex = ae_transitionInputIndex

local ae_durations = {
    ['LumiBezierDeformation_606-effect2'] = {
        ['nodeDuration'] = {{0, 5.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 5.03333333333333}, },
        },
    },
    ['LumiBezierDeformation_669-effect2'] = {
        ['nodeDuration'] = {{0.53333333333333, 5.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0.53333333333333, 5.03333333333333}, },
        },
    },
    ['LumiBezierDeformation_734-effect2'] = {
        ['nodeDuration'] = {{0.7, 5.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0.7, 5.03333333333333}, },
        },
    },
    ['LumiBezierDeformation'] = {
        ['nodeDuration'] = {{0.83333333333333, 5.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0.83333333333333, 5.03333333333333}, },
        },
    },
    ['LumiBezierDeformation_471-effect2'] = {
        ['nodeDuration'] = {{0, 5.2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 5.2}, },
        },
    },
    ['LumiGaussianBlur_439-effect0'] = {
        ['nodeDuration'] = {{0, 5.16666666666667}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 5.2}, },
        },
    },
    ['LumiRoundCorner_606-effect0'] = {
        ['nodeDuration'] = {{0, 5.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 5.03333333333333}, },
        },
    },
    ['LumiLayer_606-trs'] = {
        ['nodeDuration'] = {{0, 5.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 5.03333333333333}, },
        },
    },
    ['LumiLayer_607-trs-blend'] = {
        ['nodeDuration'] = {{0, 5.2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 5.2}, },
            ['baseTex'] = {{0, 5.03333333333333}, },
        },
    },
    ['LumiLayer_633-trs-blend'] = {
        ['nodeDuration'] = {{0, 5.2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 5.2}, },
            ['baseTex'] = {{0, 5.16666666666667}, },
        },
    },
    ['LumiRoundCorner_669-effect0'] = {
        ['nodeDuration'] = {{0.53333333333333, 5.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0.53333333333333, 5.03333333333333}, },
        },
    },
    ['LumiLayer_669-trs'] = {
        ['nodeDuration'] = {{0.53333333333333, 5.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0.53333333333333, 5.03333333333333}, },
        },
    },
    ['LumiLayer_670-trs-blend'] = {
        ['nodeDuration'] = {{0.53333333333333, 5.2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0.53333333333333, 5.2}, },
            ['baseTex'] = {{0.53333333333333, 5.03333333333333}, },
        },
    },
    ['LumiLayer_819-trs-blend'] = {
        ['nodeDuration'] = {{0, 5.2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0.53333333333333, 5.2}, },
            ['baseTex'] = {{0, 5.2}, },
        },
    },
    ['LumiRoundCorner_734-effect0'] = {
        ['nodeDuration'] = {{0.7, 5.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0.7, 5.03333333333333}, },
        },
    },
    ['LumiLayer_734-trs'] = {
        ['nodeDuration'] = {{0.7, 5.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0.7, 5.03333333333333}, },
        },
    },
    ['LumiLayer_735-trs-blend'] = {
        ['nodeDuration'] = {{0.7, 5.2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0.7, 5.2}, },
            ['baseTex'] = {{0.7, 5.03333333333333}, },
        },
    },
    ['LumiLayer_820-trs-blend'] = {
        ['nodeDuration'] = {{0, 5.2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0.7, 5.2}, },
            ['baseTex'] = {{0, 5.2}, },
        },
    },
    ['LumiRoundCorner_768-effect0'] = {
        ['nodeDuration'] = {{0.83333333333333, 5.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0.83333333333333, 5.03333333333333}, },
        },
    },
    ['LumiBlit_768-effect1'] = {
        ['nodeDuration'] = {{0.83333333333333, 5.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0.83333333333333, 5.03333333333333}, },
        },
    },
    ['LumiLayer_768-trs'] = {
        ['nodeDuration'] = {{0.83333333333333, 5.03333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0.83333333333333, 5.03333333333333}, },
        },
    },
    ['LumiLayer_769-trs-blend'] = {
        ['nodeDuration'] = {{0.83333333333333, 5.1}, },
        ['texDuration'] = {
            ['InputTex'] = {{0.83333333333333, 5.1}, },
            ['baseTex'] = {{0.83333333333333, 5.03333333333333}, },
        },
    },
    ['LumiLayer_792-trs-blend'] = {
        ['nodeDuration'] = {{0, 5.2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0.83333333333333, 5.1}, },
            ['baseTex'] = {{0, 5.2}, },
        },
    },
    ['LumiGaussianBlur_794-effect0'] = {
        ['nodeDuration'] = {{0, 5.13333333333333}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 5.2}, },
        },
    },
    ['LumiLayer_794-blend'] = {
        ['nodeDuration'] = {{0, 5.2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 5.13333333333333}, },
            ['baseTex'] = {{0, 5.2}, },
        },
    },
    ['LumiRoundCorner_471-effect0'] = {
        ['nodeDuration'] = {{0, 5.2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 5.2}, },
        },
    },
    ['LumiBlit_471-effect1'] = {
        ['nodeDuration'] = {{0, 5.2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 5.2}, },
        },
    },
    ['LumiLayer_471-trs-blend'] = {
        ['nodeDuration'] = {{0, 5.2}, },
        ['texDuration'] = {
            ['InputTex'] = {{0, 5.2}, },
            ['baseTex'] = {{0, 2.4}, },
        },
    },
}
data.ae_durations = ae_durations

local ae_attribute = {
    ['LumiBezierDeformation_606-effect2'] = {
        ['BottomLeftTangent'] = Amaz.Vector2f(0.33299987792969, 0),
        ['BottomRightTangent'] = Amaz.Vector2f(0.66699996948242, 0),
        ['BottomRightVertex'] = Amaz.Vector2f(1.23675664265951, -0.01751755475998),
        ['LeftBottomTangent'] = Amaz.Vector2f(0, 0.33300003051758),
        ['LeftBottomVertex'] = Amaz.Vector2f(-0.2792513317532, -0.0140140414238),
        ['LeftTopTangent'] = Amaz.Vector2f(0.04856552547879, 0.66669998168945),
        ['RightBottomTangent'] = Amaz.Vector2f(1, 0.33300003051758),
        ['RightTopTangent'] = Amaz.Vector2f(0.95750524732802, 0.66319646835327),
        ['RightTopVertex'] = Amaz.Vector2f(0.92833444807265, 1),
        ['TopLeftTangent'] = Amaz.Vector2f(0.33299987792969, 1),
        ['TopLeftVertex'] = Amaz.Vector2f(0.06477461920844, 0.99920380115509),
        ['TopRightTangent'] = Amaz.Vector2f(0.66699996948242, 1),
        ['size'] = 1
    },
    ['LumiBezierDeformation_669-effect2'] = {
        ['BottomLeftTangent'] = Amaz.Vector2f(0.33299987792969, 0),
        ['BottomRightTangent'] = Amaz.Vector2f(0.66699996948242, 0),
        ['BottomRightVertex'] = Amaz.Vector2f(1.23675664265951, -0.01751755475998),
        ['LeftBottomTangent'] = Amaz.Vector2f(0, 0.33300003051758),
        ['LeftBottomVertex'] = Amaz.Vector2f(-0.2792513317532, -0.0140140414238),
        ['LeftTopTangent'] = Amaz.Vector2f(0.04856552547879, 0.66669998168945),
        ['RightBottomTangent'] = Amaz.Vector2f(1, 0.33300003051758),
        ['RightTopTangent'] = Amaz.Vector2f(0.95750524732802, 0.66319646835327),
        ['RightTopVertex'] = Amaz.Vector2f(0.92833444807265, 1),
        ['TopLeftTangent'] = Amaz.Vector2f(0.33299987792969, 1),
        ['TopLeftVertex'] = Amaz.Vector2f(0.06477461920844, 0.99920380115509),
        ['TopRightTangent'] = Amaz.Vector2f(0.66699996948242, 1),
        ['size'] = 1
    },
    ['LumiBezierDeformation_734-effect2'] = {
        ['BottomLeftTangent'] = Amaz.Vector2f(0.33299987792969, 0),
        ['BottomRightTangent'] = Amaz.Vector2f(0.66699996948242, 0),
        ['BottomRightVertex'] = Amaz.Vector2f(1.23675664265951, -0.01751755475998),
        ['LeftBottomTangent'] = Amaz.Vector2f(0, 0.33300003051758),
        ['LeftBottomVertex'] = Amaz.Vector2f(-0.2792513317532, -0.0140140414238),
        ['LeftTopTangent'] = Amaz.Vector2f(0.04856552547879, 0.66669998168945),
        ['RightBottomTangent'] = Amaz.Vector2f(1, 0.33300003051758),
        ['RightTopTangent'] = Amaz.Vector2f(0.95750524732802, 0.66319646835327),
        ['RightTopVertex'] = Amaz.Vector2f(0.92833444807265, 1),
        ['TopLeftTangent'] = Amaz.Vector2f(0.33299987792969, 1),
        ['TopLeftVertex'] = Amaz.Vector2f(0.06477461920844, 0.99920380115509),
        ['TopRightTangent'] = Amaz.Vector2f(0.66699996948242, 1),
        ['size'] = 1
    },
    ['LumiBezierDeformation'] = {
        ['BottomLeftTangent'] = Amaz.Vector2f(0.33299987792969, 0),
        ['BottomRightTangent'] = Amaz.Vector2f(0.66699996948242, 0),
        ['BottomRightVertex'] = Amaz.Vector2f(1.23675664265951, -0.01751755475998),
        ['LeftBottomTangent'] = Amaz.Vector2f(0, 0.33300003051758),
        ['LeftBottomVertex'] = Amaz.Vector2f(-0.2792513317532, -0.0140140414238),
        ['LeftTopTangent'] = Amaz.Vector2f(0.04856552547879, 0.66669998168945),
        ['RightBottomTangent'] = Amaz.Vector2f(1, 0.33300003051758),
        ['RightTopTangent'] = Amaz.Vector2f(0.95750524732802, 0.66319646835327),
        ['RightTopVertex'] = Amaz.Vector2f(0.92833444807265, 1),
        ['TopLeftTangent'] = Amaz.Vector2f(0.33299987792969, 1),
        ['TopLeftVertex'] = Amaz.Vector2f(0.06477461920844, 0.99920380115509),
        ['TopRightTangent'] = Amaz.Vector2f(0.66699996948242, 1),
        ['size'] = 1
    },
    ['LumiBezierDeformation_471-effect2'] = {
        ['BottomLeftTangent'] = Amaz.Vector2f(0.33299987792969, 0),
        ['BottomRightTangent'] = Amaz.Vector2f(0.66699996948242, 0),
        ['BottomRightVertex'] = Amaz.Vector2f(1.23675664265951, -0.01751755475998),
        ['LeftBottomTangent'] = Amaz.Vector2f(0, 0.33300003051758),
        ['LeftBottomVertex'] = Amaz.Vector2f(-0.2792513317532, -0.0140140414238),
        ['LeftTopTangent'] = Amaz.Vector2f(0.04856552547879, 0.66669998168945),
        ['RightBottomTangent'] = Amaz.Vector2f(1, 0.33300003051758),
        ['RightTopTangent'] = Amaz.Vector2f(0.95750524732802, 0.66319646835327),
        ['RightTopVertex'] = Amaz.Vector2f(0.92833444807265, 1),
        ['TopLeftTangent'] = Amaz.Vector2f(0.33299987792969, 1),
        ['TopLeftVertex'] = Amaz.Vector2f(0.06477461920844, 0.99920380115509),
        ['TopRightTangent'] = Amaz.Vector2f(0.66699996948242, 1),
        ['size'] = 1
    },
    ['LumiGaussianBlur_439-effect0'] = {
        ['intensity'] = 100,
        ['quality'] = 0.3,
        ['spaceDither'] = 0,
        ['horizontalStrength'] = 1,
        ['verticalStrength'] = 1,
        ['blurDirection'] = 0,
        ['borderType'] = 0,
        ['blurAlpha'] = true,
        ['inverseGammaCorrection'] = true,
    },
    ['LumiRoundCorner_606-effect0'] = {
        ['radius'] = 35,
        ['fade'] = 5,
        ['fadeType'] = 0,
    },
    ['LumiLayer_606-trs'] = {
        ['hasBlend'] = false,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(360, 640, 0),
        ['position'] = Amaz.Vector3f(360, 640.372893257445, 0),
        ['scale'] = Amaz.Vector3f(37.330160488297, 37.330160488297, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = -6,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(720, 1280),
        ['layerSize'] = Amaz.Vector2f(720, 1280),
        ['mirrorEdge'] = false,
    },
    ['LumiLayer_607-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Solid',
        ['anchorPoint'] = Amaz.Vector3f(360, 640, 0),
        ['position'] = Amaz.Vector3f(360, 640, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 9.03049617319378,
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(720, 1280),
        ['layerSize'] = Amaz.Vector2f(720, 1280),
        ['mirrorEdge'] = false,
        ['blendMode'] = 'Normal',
        ['yuChengFloat'] =  1,
    },
    ['LumiLayer_633-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(360, 640, 0),
        ['position'] = Amaz.Vector3f(49.9999999999999, 50, 0),
        ['scale'] = Amaz.Vector3f(126.582278481013, 126.582278481013, 126.582278481013),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = -9.65056987823391,
        ['yRotation'] = 10.0892321454264,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527101455,
        ['p0_anchorPoint'] = Amaz.Vector3f(50, 50, 0),
        ['p0_position'] = Amaz.Vector3f(360, 640, 0),
        ['p0_scale'] = Amaz.Vector3f(89.7567246533699, 89.7567246533699, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = 0,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.5977527101455,
        ['compositeSize'] = Amaz.Vector2f(720, 1280),
        ['layerSize'] = Amaz.Vector2f(720, 1280),
        ['mirrorEdge'] = false,
        ['blendMode'] = 'Normal',
    },
    ['LumiRoundCorner_669-effect0'] = {
        ['radius'] = 35,
        ['fade'] = 5,
        ['fadeType'] = 0,
    },
    ['LumiLayer_669-trs'] = {
        ['hasBlend'] = false,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(360, 640, 0),
        ['position'] = Amaz.Vector3f(330.774084995924, 778.384559976612, 0),
        ['scale'] = Amaz.Vector3f(37.3172134557523, 37.3172134557523, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 10,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(720, 1280),
        ['layerSize'] = Amaz.Vector2f(720, 1280),
        ['mirrorEdge'] = false,
    },
    ['LumiLayer_670-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Solid',
        ['anchorPoint'] = Amaz.Vector3f(360, 640, 0),
        ['position'] = Amaz.Vector3f(360, 640, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 1.31503248246048,
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(720, 1280),
        ['layerSize'] = Amaz.Vector2f(720, 1280),
        ['mirrorEdge'] = false,
        ['blendMode'] = 'Normal',
        ['yuChengFloat'] =  1,
    },
    ['LumiLayer_819-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(360, 640, 0),
        ['position'] = Amaz.Vector3f(50, 50, 0),
        ['scale'] = Amaz.Vector3f(123.912030950169, 123.912030950169, 123.912030950169),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = -14.851527903503,
        ['yRotation'] = -1.71514955330722,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527101455,
        ['p0_anchorPoint'] = Amaz.Vector3f(50, 50, 0),
        ['p0_position'] = Amaz.Vector3f(360, 640, 0),
        ['p0_scale'] = Amaz.Vector3f(89.7567246533699, 89.7567246533699, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = 0,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.5977527101455,
        ['compositeSize'] = Amaz.Vector2f(720, 1280),
        ['layerSize'] = Amaz.Vector2f(720, 1280),
        ['mirrorEdge'] = false,
        ['blendMode'] = 'Normal',
    },
    ['LumiRoundCorner_734-effect0'] = {
        ['radius'] = 35,
        ['fade'] = 5,
        ['fadeType'] = 0,
    },
    ['LumiLayer_734-trs'] = {
        ['hasBlend'] = false,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(360, 640, 0),
        ['position'] = Amaz.Vector3f(436.643941483234, 927.988462758857, 0),
        ['scale'] = Amaz.Vector3f(37.0993397594329, 37.0993397594329, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = -14.3688888727918,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(720, 1280),
        ['layerSize'] = Amaz.Vector2f(720, 1280),
        ['mirrorEdge'] = false,
    },
    ['LumiLayer_735-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Solid',
        ['anchorPoint'] = Amaz.Vector3f(360, 640, 0),
        ['position'] = Amaz.Vector3f(360, 640, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 0.29000000485811,
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(720, 1280),
        ['layerSize'] = Amaz.Vector2f(720, 1280),
        ['mirrorEdge'] = false,
        ['blendMode'] = 'Normal',
        ['yuChengFloat'] =  1,
    },
    ['LumiLayer_820-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(360, 640, 0),
        ['position'] = Amaz.Vector3f(49.9999999999999, 50, 0),
        ['scale'] = Amaz.Vector3f(120.552687365138, 120.552687365138, 120.552687365138),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = -54.9591237522457,
        ['yRotation'] = 4.01696771203711,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527101455,
        ['p0_anchorPoint'] = Amaz.Vector3f(50, 50, 0),
        ['p0_position'] = Amaz.Vector3f(360, 640, 0),
        ['p0_scale'] = Amaz.Vector3f(89.7567246533699, 89.7567246533699, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = 0,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.5977527101455,
        ['compositeSize'] = Amaz.Vector2f(720, 1280),
        ['layerSize'] = Amaz.Vector2f(720, 1280),
        ['mirrorEdge'] = false,
        ['blendMode'] = 'Normal',
    },
    ['LumiRoundCorner_768-effect0'] = {
        ['radius'] = 35,
        ['fade'] = 5,
        ['fadeType'] = 0,
    },

    ['LumiLayer_768-trs'] = {
        ['hasBlend'] = false,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(360, 640, 0),
        ['position'] = Amaz.Vector3f(327.514520562056, 1119.63854934846, 0),
        ['scale'] = Amaz.Vector3f(37.1241082202324, 37.1241082202324, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 8.27111110228403,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(720, 1280),
        ['layerSize'] = Amaz.Vector2f(720, 1280),
        ['mirrorEdge'] = false,
    },
    ['LumiLayer_769-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Solid',
        ['anchorPoint'] = Amaz.Vector3f(360, 640, 0),
        ['position'] = Amaz.Vector3f(360, 640, 0),
        ['scale'] = Amaz.Vector3f(100, 100, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = 0,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 0,
        ['active_cam_fovx'] = 39.6,
        ['compositeSize'] = Amaz.Vector2f(720, 1280),
        ['layerSize'] = Amaz.Vector2f(720, 1280),
        ['mirrorEdge'] = false,
        ['blendMode'] = 'Normal',
        ['yuChengFloat'] =  1,
    },
    ['LumiLayer_792-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(360, 640, 0),
        ['position'] = Amaz.Vector3f(50, 49.9999999999999, 0),
        ['scale'] = Amaz.Vector3f(115.575448214255, 115.575448214255, 115.575448214255),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = -44.0107876916833,
        ['yRotation'] = -3.83471078110727,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527101455,
        ['p0_anchorPoint'] = Amaz.Vector3f(50, 50, 0),
        ['p0_position'] = Amaz.Vector3f(360, 640, 0),
        ['p0_scale'] = Amaz.Vector3f(89.7567246533699, 89.7567246533699, 100),
        ['p0_orientation'] = Amaz.Vector3f(0, 0, 0),
        ['p0_xRotation'] = 0,
        ['p0_yRotation'] = 0,
        ['p0_rotation'] = 0,
        ['p0_opacity'] = 100,
        ['p0_active_cam_fovx'] = 39.5977527101455,
        ['compositeSize'] = Amaz.Vector2f(720, 1280),
        ['layerSize'] = Amaz.Vector2f(720, 1280),
        ['mirrorEdge'] = false,
        ['blendMode'] = 'Normal',
    },
    ['LumiGaussianBlur_794-effect0'] = {
        ['intensity'] = 0,
        ['quality'] = 0.3,
        ['spaceDither'] = 0,
        ['horizontalStrength'] = 1,
        ['verticalStrength'] = 1,
        ['blurDirection'] = 0,
        ['borderType'] = 0,
        ['blurAlpha'] = true,
        ['inverseGammaCorrection'] = true,
    },
    ['LumiLayer_794-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = false,
        ['layerType'] = 'Adjustment',
        ['blendMode'] = 'Normal',
    },
    ['LumiRoundCorner_471-effect0'] = {
        ['radius'] = 35,
        ['fade'] = 5,
        ['fadeType'] = 0,
    },
    ['LumiBlit_471-effect1'] = {
        ['param0'] = Amaz.Vector2f(46.6377258300781, 1.01913452148438),
        ['param1'] = Amaz.Vector2f(239.976013183594, 0),
        ['param2'] = Amaz.Vector2f(479.952026367188, 0),
        ['param3'] = Amaz.Vector2f(668.400802612305, 0),
        ['param4'] = Amaz.Vector2f(689.403778076172, 431.108520507812),
        ['param5'] = Amaz.Vector2f(720, 853.248046875),
        ['param6'] = Amaz.Vector2f(890.464782714844, 1302.42247009277),
        ['param7'] = Amaz.Vector2f(479.952026367188, 1280),
        ['param8'] = Amaz.Vector2f(239.976013183594, 1280),
        ['param9'] = Amaz.Vector2f(-201.060958862305, 1297.93797302246),
        ['param10'] = Amaz.Vector2f(0, 853.248046875),
        ['param11'] = Amaz.Vector2f(34.9671783447266, 426.6240234375),
        ['param12'] = 8,
    },
    ['LumiLayer_471-trs-blend'] = {
        ['hasBlend'] = true,
        ['hasMatte'] = false,
        ['hasTransform'] = true,
        ['layerType'] = 'Precomp',
        ['anchorPoint'] = Amaz.Vector3f(360, 640, 0),
        ['position'] = Amaz.Vector3f(411.35, 1631.45, 0),
        ['scale'] = Amaz.Vector3f(37, 37, 100),
        ['orientation'] = Amaz.Vector3f(0, 0, 0),
        ['xRotation'] = -36,
        ['yRotation'] = 0,
        ['rotation'] = 0,
        ['opacity'] = 100,
        ['active_cam_fovx'] = 39.5977527101455,
        ['compositeSize'] = Amaz.Vector2f(720, 1280),
        ['layerSize'] = Amaz.Vector2f(720, 1280),
        ['mirrorEdge'] = false,
        ['blendMode'] = 'Normal',
        ['yuChengFloat'] =  1,
    },
}
data.ae_attribute = ae_attribute

local ae_keyframes = {
    ['LumiBezierDeformation_606-effect2#BottomRightVertex#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0, 1, }, 
            {{1.23675664265972, -0.01751755476016, }, {1, 0, }, {1.23675664265972, -0.01751755476016, }, {1, 0, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation_606-effect2#LeftBottomVertex#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0, 1, }, 
            {{-0.27925133175278, -0.01401404142344, }, {0, 0, }, {-0.27925133175278, -0.01401404142344, }, {0, 0, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation_606-effect2#LeftTopTangent#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0, 1, }, 
            {{0.04856552547917, 0.66669998168906, }, {0, 0.66669998168906, }, {0.04856552547917, 0.66669998168906, }, {0, 0.66669998168906, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation_606-effect2#RightTopTangent#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0, 1, }, 
            {{0.95750524732778, 0.66319646835312, }, {1, 0.66669998168906, }, {0.95750524732778, 0.66319646835312, }, {1, 0.66669998168906, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation_606-effect2#RightTopVertex#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0, 1, }, 
            {{0.92833444807222, 1, }, {1, 1, }, {0.92833444807222, 1, }, {1, 1, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation_606-effect2#TopLeftVertex#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0, 1, }, 
            {{0.06477461920833, 0.99920380115547, }, {0, 1, }, {0.06477461920833, 0.99920380115547, }, {0, 1, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
    ['LumiBezierDeformation_669-effect2#BottomRightVertex#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0.533333, 1.533333, }, 
            {{1.23675664265972, -0.01751755476016, }, {1, 0, }, {1.23675664265972, -0.01751755476016, }, {1, 0, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation_669-effect2#LeftBottomVertex#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0.533333, 1.533333, }, 
            {{-0.27925133175278, -0.01401404142344, }, {0, 0, }, {-0.27925133175278, -0.01401404142344, }, {0, 0, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation_669-effect2#LeftTopTangent#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0.533333, 1.533333, }, 
            {{0.04856552547917, 0.66669998168906, }, {0, 0.66669998168906, }, {0.04856552547917, 0.66669998168906, }, {0, 0.66669998168906, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation_669-effect2#RightTopTangent#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0.533333, 1.533333, }, 
            {{0.95750524732778, 0.66319646835312, }, {1, 0.66669998168906, }, {0.95750524732778, 0.66319646835312, }, {1, 0.66669998168906, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation_669-effect2#RightTopVertex#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0.533333, 1.533333, }, 
            {{0.92833444807222, 1, }, {1, 1, }, {0.92833444807222, 1, }, {1, 1, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation_669-effect2#TopLeftVertex#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0.533333, 1.533333, }, 
            {{0.06477461920833, 0.99920380115547, }, {0, 1, }, {0.06477461920833, 0.99920380115547, }, {0, 1, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation#BottomRightVertex#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0.833333, 1.833333, }, 
            {{1.23675664265972, -0.01751755476016, }, {1, 0, }, {1.23675664265972, -0.01751755476016, }, {1, 0, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation#LeftBottomVertex#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0.833333, 1.833333, }, 
            {{-0.27925133175278, -0.01401404142344, }, {0, 0, }, {-0.27925133175278, -0.01401404142344, }, {0, 0, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation#LeftTopTangent#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0.833333, 1.833333, }, 
            {{0.04856552547917, 0.66669998168906, }, {0, 0.66669998168906, }, {0.04856552547917, 0.66669998168906, }, {0, 0.66669998168906, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation#RightTopTangent#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0.833333, 1.833333, }, 
            {{0.95750524732778, 0.66319646835312, }, {1, 0.66669998168906, }, {0.95750524732778, 0.66319646835312, }, {1, 0.66669998168906, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation#RightTopVertex#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0.833333, 1.833333, }, 
            {{0.92833444807222, 1, }, {1, 1, }, {0.92833444807222, 1, }, {1, 1, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation#TopLeftVertex#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0.833333, 1.833333, }, 
            {{0.06477461920833, 0.99920380115547, }, {0, 1, }, {0.06477461920833, 0.99920380115547, }, {0, 1, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },


    ['LumiBezierDeformation_734-effect2#BottomRightVertex#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0.7, 1.7, }, 
            {{1.23675664265972, -0.01751755476016, }, {1, 0, }, {1.23675664265972, -0.01751755476016, }, {1, 0, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation_734-effect2#LeftBottomVertex#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0.7, 1.7, }, 
            {{-0.27925133175278, -0.01401404142344, }, {0, 0, }, {-0.27925133175278, -0.01401404142344, }, {0, 0, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation_734-effect2#LeftTopTangent#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0.7, 1.7, }, 
            {{0.04856552547917, 0.66669998168906, }, {0, 0.66669998168906, }, {0.04856552547917, 0.66669998168906, }, {0, 0.66669998168906, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation_734-effect2#RightTopTangent#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0.7, 1.7, }, 
            {{0.95750524732778, 0.66319646835312, }, {1, 0.66669998168906, }, {0.95750524732778, 0.66319646835312, }, {1, 0.66669998168906, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation_734-effect2#RightTopVertex#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0.7, 1.7, }, 
            {{0.92833444807222, 1, }, {1, 1, }, {0.92833444807222, 1, }, {1, 1, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation_734-effect2#TopLeftVertex#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {0.7, 1.7, }, 
            {{0.06477461920833, 0.99920380115547, }, {0, 1, }, {0.06477461920833, 0.99920380115547, }, {0, 1, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
    ['LumiBezierDeformation_471-effect2#BottomRightVertex#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {1.066667, 2.066667, }, 
            {{1.23675664265972, -0.01751755476016, }, {1, 0, }, {1.23675664265972, -0.01751755476016, }, {1, 0, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation_471-effect2#LeftBottomVertex#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {1.066667, 2.066667, }, 
            {{-0.27925133175278, -0.01401404142344, }, {0, 0, }, {-0.27925133175278, -0.01401404142344, }, {0, 0, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation_471-effect2#LeftTopTangent#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {1.066667, 2.066667, }, 
            {{0.04856552547917, 0.66669998168906, }, {0, 0.66669998168906, }, {0.04856552547917, 0.66669998168906, }, {0, 0.66669998168906, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation_471-effect2#RightTopTangent#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {1.066667, 2.066667, }, 
            {{0.95750524732778, 0.66319646835312, }, {1, 0.66669998168906, }, {0.95750524732778, 0.66319646835312, }, {1, 0.66669998168906, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation_471-effect2#RightTopVertex#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {1.066667, 2.066667, }, 
            {{0.92833444807222, 1, }, {1, 1, }, {0.92833444807222, 1, }, {1, 1, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
        ['LumiBezierDeformation_471-effect2#TopLeftVertex#vector'] =
    {
        {
            {0.197817, 0, 0.109971, 1, }, 
            {1.066667, 2.066667, }, 
            {{0.06477461920833, 0.99920380115547, }, {0, 1, }, {0.06477461920833, 0.99920380115547, }, {0, 1, }, }, 
            {6415, }, 
            {0, }, 
        }, 
    },
    



   
    ['LumiLayer_606-trs#position#vector'] =
{
	{
		{0.0001, 0, 0, 1, }, 
		{0, 1, }, 
		{{360, 1631.45, 0, }, {360, 640, 0, }, {360, 1631.45, 0, }, {360, 640, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_606-trs#scale#vector'] =
{
	{
		{1,1,0.33333333, -2.07e-7,-2.07e-7,0.33333333, 0.9999,0.9999,0.66666667, 1,1,0.66666667, }, 
		{0, 2.166667, }, 
		{{37, 37, 100, }, {39.5, 39.5, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_607-trs-blend#opacity#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.433333, 2.166667, }, 
		{{0, }, {40, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_633-trs-blend#xRotation#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.033333, 2.066667, }, 
		{{0, }, {-22, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_633-trs-blend#yRotation#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.033333, 2.066667, }, 
		{{0, }, {23, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_633-trs-blend#p0_scale#vector'] =
{
	{
		{1,1,0.33333333, -1.04e-7,-1.04e-7,0.33333333, 0.841215939,0.841215939,0.66666667, 1.000000052,1.000000052,0.66666667, }, 
		{0, 2.166667, }, 
		{{79, 79, 100, }, {198, 198, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},

    ['LumiLayer_669-trs#position#vector'] =
{
	{
		{0.104692, 0.499114, 0.362921, 1, }, 
		{0.533333, 1.533333, }, 
		{{200.42, 1395.610494248, 0, }, {360, 640, 0, }, {200.42, 1395.610494248, 0, }, {360, 640, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_669-trs#scale#vector'] =
{
	{
		{1,1,0.33333333, -9.6e-8,-9.6e-8,0.33333333, 0.9999,0.9999,0.66666667, 1,1,0.66666667, }, 
		{0.533333, 1.533333, }, 
		{{37, 37, 100, }, {39.5, 39.5, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_670-trs-blend#opacity#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.8, 2.333333, }, 
		{{0, }, {40, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_819-trs-blend#xRotation#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.333333, 1.733333, }, 
		{{-26, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_819-trs-blend#yRotation#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.333333, 1.733333, }, 
		{{0, }, {-4, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_819-trs-blend#p0_scale#vector'] =
{
	{
		{1,1,0.33333333, -1.04e-7,-1.04e-7,0.33333333, 0.841215939,0.841215939,0.66666667, 1.000000052,1.000000052,0.66666667, }, 
		{0, 2.166667, }, 
		{{79, 79, 100, }, {198, 198, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_734-trs#position#vector'] =
{
	{
		{0.0001, 0, 0, 1, }, 
		{0.7, 1.7, }, 
		{{623.86, 1631.45, 0, }, {360, 640, 0, }, {623.86, 1631.45, 0, }, {360, 640, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_734-trs#scale#vector'] =
{
	{
		{1,1,0.33333333, 0,0,0.33333333, 0.984863517,0.984863517,0.66666667, 1,1,0.66666667, }, 
		{0.7, 1.7, }, 
		{{37, 37, 100, }, {36, 36, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_734-trs#rotation#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.7, 1.7, }, 
		{{-17, }, {-2, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_735-trs-blend#opacity#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.9, 2.233333, }, 
		{{0, }, {40, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_820-trs-blend#xRotation#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.8, 2.266667, }, 
		{{-57, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_820-trs-blend#yRotation#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.6, 2.266667, }, 
		{{0, }, {32.42, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_820-trs-blend#p0_scale#vector'] =
{
	{
		{1,1,0.33333333, -1.04e-7,-1.04e-7,0.33333333, 0.841215939,0.841215939,0.66666667, 1.000000052,1.000000052,0.66666667, }, 
		{0, 2.166667, }, 
		{{79, 79, 100, }, {198, 198, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_768-trs#position#vector'] =
{
	{
		{0.0001, 0, 0, 1, }, 
		{0.833333, 1.833333, }, 
		{{292.85, 1631.45, 0, }, {360, 640, 0, }, {292.85, 1631.45, 0, }, {360, 640, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_768-trs#scale#vector'] =
{
	{
		{1,1,0.33333333, 0,-1e-9,0.33333333, 0.953831527,0.953831527,0.66666667, 1,1,0.66666667, }, 
		{0.833333, 1.833333, }, 
		{{37, 37, 100, }, {36.2, 36.2, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_768-trs#rotation#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.833333, 1.833333, }, 
		{{9, }, {-6, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_769-trs-blend#opacity#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{1.066667, 2.166667, }, 
		{{0, }, {40, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_792-trs-blend#xRotation#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.866667, 2, }, 
		{{-45, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_792-trs-blend#yRotation#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{0.833333, 1.566667, }, 
		{{0, }, {-44, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.166666667, 0, 0.833333333, 1, }, 
		{1.566667, 2, }, 
		{{-44, }, {-18, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_792-trs-blend#p0_scale#vector'] =
{
	{
		{1,1,0.33333333, -1.04e-7,-1.04e-7,0.33333333, 0.841215939,0.841215939,0.66666667, 1.000000052,1.000000052,0.66666667, }, 
		{0, 2.166667, }, 
		{{79, 79, 100, }, {198, 198, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiGaussianBlur_794-effect0#intensity#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{1.4, 2.166667, }, 
		{{0, }, {5, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiRoundCorner_471-effect0#radius#number'] =
{
	{
		{1, -1e-9, 0.8515286, 1.000000002, }, 
		{1.733333, 2.333333, }, 
		{{35, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_471-trs-blend#position#vector'] =
{
	{
		{0.0001, 0, 0, 1, }, 
		{1.066667, 2.066667, }, 
		{{411.35, 1631.45, 0, }, {360, 640, 0, }, {411.35, 1631.45, 0, }, {360, 640, 0, }, }, 
		{6413, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_471-trs-blend#scale#vector'] =
{
	{
		{1,1,0.510431076, -1.87e-7,-1.87e-7,0.510431076, 0.430317718,0.430317718,0.771124378, 0.999999975,0.999999975,0.771124378, }, 
		{1.066667, 2.4, }, 
		{{37, 37, 100, }, {100, 100, 100, }, }, 
		{6414, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_471-trs-blend#xRotation#number'] =
{
	{
		{0.805598823, -5.3e-8, 0.45282521, 1.000000096, }, 
		{1.3, 2.233333, }, 
		{{-36, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
    ['LumiLayer_471-trs-blend#yRotation#number'] =
{
	{
		{0.166666667, 0.166666667, 0.66666667, 1, }, 
		{1.066667, 1.566667, }, 
		{{0, }, {19, }, }, 
		{6417, }, 
		{0, }, 
	}, 
	{
		{0.33333333, 0, 0.348409476, 1.000000069, }, 
		{1.566667, 2.4, }, 
		{{19, }, {0, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
['LumiLayer_471-trs-blend#yuChengFloat2#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{1.8, 2.1, }, 
		{{1, }, {0.1, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
['LumiBezierDeformation#size#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{1.8, 2.1, }, 
		{{1, }, {0.1, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
['LumiBezierDeformation_471-effect2#size#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{1.8, 2.1, }, 
		{{1, }, {0.1, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
['LumiGaussianBlur_794-effect0#opacity#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{2.3, 2.4, }, 
		{{1, }, {0.1, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
['LumiBezierDeformation_734-effect2#size#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{1.8, 2.1, }, 
		{{1, }, {0.1, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
['LumiBezierDeformation_669-effect2#size#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{1.8, 2.1, }, 
		{{1, }, {0.1, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
['LumiBezierDeformation_606-effect2#size#number'] =
{
	{
		{0.33333333, 0, 0.66666667, 1, }, 
		{1.8, 2.1, }, 
		{{1, }, {0.1, }, }, 
		{6417, }, 
		{0, }, 
	}, 
},
}
data.ae_keyframes = ae_keyframes

local ae_reverseKeyframes = false
data.ae_reverseKeyframes = ae_reverseKeyframes

local ae_sliderInfos = {
    ['effects_adjust_color'] = {
        {'LumiLayer_607-trs-blend', 'opacity', 'number', {true, }, 1, 0, 2, 1, {0, }, {0, }, },
        {'LumiLayer_670-trs-blend', 'opacity', 'number', {true, }, 1, 0, 2, 1, {0, }, {0, }, },
        {'LumiLayer_735-trs-blend', 'opacity', 'number', {true, }, 1, 0, 2, 1, {0, }, {0, }, },
        {'LumiLayer_769-trs-blend', 'opacity', 'number', {true, }, 1, 0, 2, 1, {0, }, {0, }, },
    },
    ['effects_adjust_size'] = {
        {'LumiRoundCorner_606-effect0', 'radius', 'number', {true, }, 1, 2, 0, 1, {0, }, {0, }, },
        {'LumiRoundCorner_669-effect0', 'radius', 'number', {true, }, 1, 2, 0, 1, {0, }, {0, }, },
        {'LumiRoundCorner_734-effect0', 'radius', 'number', {true, }, 1, 2, 0, 1, {0, }, {0, }, },
        {'LumiRoundCorner_768-effect0', 'radius', 'number', {true, }, 1, 2, 0, 1, {0, }, {0, }, },
        {'LumiRoundCorner_471-effect0', 'radius', 'number', {true, }, 1, 2, 0, 1, {0, }, {0, }, },
    },
    ['effects_adjust_intensity'] = {
        {'LumiBezierDeformation_471-effect2', 'size', 'number', {true, }, 1, 2, 0, 1, {0, }, {0, }, },
        {'LumiBezierDeformation_734-effect2', 'size', 'number', {true, }, 1, 2, 0, 1, {0, }, {0, }, },
        {'LumiBezierDeformation_669-effect2', 'size', 'number', {true, }, 1, 2, 0, 1, {0, }, {0, }, },
        {'LumiBezierDeformation_606-effect2', 'size', 'number', {true, }, 1, 2, 0, 1, {0, }, {0, }, },
        {'LumiBezierDeformation', 'size', 'number', {true, }, 1, 2, 0, 1, {0, }, {0, }, },
        {'LumiLayer_607-trs-blend', 'yuChengFloat', 'number', {true, }, 1, 2, 0, 1, {0, }, {0, }, },
        {'LumiLayer_670-trs-blend', 'yuChengFloat', 'number', {true, }, 1, 2, 0, 1, {0, }, {0, }, },
        {'LumiLayer_735-trs-blend', 'yuChengFloat', 'number', {true, }, 1, 2, 0, 1, {0, }, {0, }, },
        {'LumiLayer_769-trs-blend', 'yuChengFloat', 'number', {true, }, 1, 2, 0, 1, {0, }, {0, }, },
        {'LumiLayer_471-trs-blend', 'yuChengFloat', 'number', {true, }, 1, 2, 0, 1, {0, }, {0, }, },

    },
    ['effects_adjust_blur'] = {
        {'LumiGaussianBlur_439-effect0', 'intensity', 'number', {true, }, 1, 2, 0, 1, {0, }, {0, }, },
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
    speedInfo = {1, 0.5, 2, },
}
data.ae_animationInfos = ae_animationInfos

return data
