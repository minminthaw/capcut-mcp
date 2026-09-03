local exports = exports or {}
local Utils = Utils or {}
Utils.__index = Utils

function Utils.new(construct, ...)
    local self = setmetatable({}, Utils)
    if construct and Utils.constructor then
        Utils.constructor(self, ...)
    end

    return self
end

function Utils:constructor()
end

function Utils:createRenderTexture(width, height, is2D)
    local rt = nil
    if is2D then
        rt = Amaz.Texture2D()
    else
        rt = Amaz.RenderTexture()
        rt.depth = 1
        rt.attachment = Amaz.RenderTextureAttachment.DEPTH
    end
    rt.width = width
    rt.height = height
    rt.filterMag = Amaz.FilterMode.LINEAR
    rt.filterMin = Amaz.FilterMode.LINEAR
    rt.filterMipmap = Amaz.FilterMipmapMode.NONE
    return rt
end

function Utils:updateTexSize(rt, width, height)
    if rt == nil or width <= 0 or height <= 0 then
        return
    end
    if rt.width ~= width or rt.height ~= height then
        rt.width = width
        rt.height = height
    end
end

function Utils:setRenderTexture(camera, rt)
    if rt then
        camera.renderTexture = rt
    end
end

function Utils:remap(value, min, max, newMin, newMax)
    return newMin + (value - min) * (newMax - newMin) / (max - min)
end

function Utils:rotateByAxis(_trans, _matchAxis, _euler_angle)
    -- ae xyz, editor yxz
    local right = Amaz.Vector3f(1.0, 0.0, 0.0)
    local up = Amaz.Vector3f(0.0, 1.0, 0.0)
    local forward = Amaz.Vector3f(0.0, 0.0, 1.0)

    local cur_orientation = Amaz.Quaternionf.axisAngleToQuaternion(right, math.rad(_matchAxis.x)) *
                                Amaz.Quaternionf.axisAngleToQuaternion(up, math.rad(_matchAxis.y)) *
                                Amaz.Quaternionf.axisAngleToQuaternion(forward, math.rad(_matchAxis.z))

    up = Amaz.Quaternionf.rotateVectorByQuat(cur_orientation, up)
    right = Amaz.Quaternionf.rotateVectorByQuat(cur_orientation, right)
    forward = Amaz.Quaternionf.rotateVectorByQuat(cur_orientation, forward)

    cur_orientation = Amaz.Quaternionf.axisAngleToQuaternion(right, math.rad(_euler_angle.y)) *
                          Amaz.Quaternionf.axisAngleToQuaternion(up, -math.rad(_euler_angle.x)) *
                          Amaz.Quaternionf.axisAngleToQuaternion(forward, -math.rad(_euler_angle.z)) * cur_orientation

    _trans.localOrientation = cur_orientation
end

function Utils:calculateQuarternion(rotation)
    local quatX = Amaz.Quaternionf.axisAngleToQuaternion(Amaz.Vector3f(1, 0, 0), math.rad(rotation.x))
    local quatY = Amaz.Quaternionf.axisAngleToQuaternion(Amaz.Vector3f(0, 1, 0), math.rad(rotation.y))
    local quatZ = Amaz.Quaternionf.axisAngleToQuaternion(Amaz.Vector3f(0, 0, -1), math.rad(rotation.z))
    return quatX * quatY * quatZ
end

function Utils:updateCamera(camXform, camera, pos, rot, fov, orthoScale)
    local quat = self:calculateQuarternion(rot)
    camXform.localOrientation = quat
    camXform.localPosition = pos
    camXform.localScale = Amaz.Vector3f(1, 1, 1)
    camera.fovy = fov
    camera.orthoScale = orthoScale
end

-- Transform calculation utilities
function Utils:calculateTransformParams(aspect, isLandscape, rotateMeshOnLandscape, landscapeRotationDirection,
    rotateUVWithMesh, offsetUV, mode, landscapeSizeScale)
    local params = {
        pivotRotZ = 0,
        rotateUV = 0,
        offsetUV = {
            x = offsetUV.x,
            y = offsetUV.y
        },
        aspectX = 1.0,
        aspectY = 1.0,
        scaleUVX = 1.0,
        scaleUVY = 1.0
    }

    if isLandscape and rotateMeshOnLandscape then
        local rotationAngle = (landscapeRotationDirection == "Left") and -90 or 90
        params.pivotRotZ = rotationAngle
        params.offsetUV.x = 0.5
        params.offsetUV.y = 0.5

        if rotateUVWithMesh then
            params.rotateUV = -rotationAngle
            params.aspectX, params.aspectY, params.scaleUVX, params.scaleUVY =
                self:getScaleValues(aspect, mode, "rotated")
        else
            params.aspectX, params.aspectY, params.scaleUVX, params.scaleUVY =
                self:getScaleValues(aspect, mode, "landscape")
        end
        local baseScale = (mode == 2) and aspect or 1.0
        local scale = (landscapeSizeScale or 1.0) * baseScale
        params.aspectX = params.aspectX * scale
        params.aspectY = params.aspectY * scale
    elseif isLandscape then
        params.aspectX, params.aspectY, params.scaleUVX, params.scaleUVY =
            self:getScaleValues(aspect, mode, "landscape")
        local baseScale = (mode == 2) and aspect or 1.0
        local scale = (landscapeSizeScale or 1.0) * baseScale
        params.aspectX = params.aspectX * scale
        params.aspectY = params.aspectY * scale
    else
        params.aspectX, params.aspectY, params.scaleUVX, params.scaleUVY = self:getScaleValues(aspect, mode, "default")
    end

    return params
end

function Utils:getScaleValues(aspect, mode, scaleType)
    local STRETCH_MODE = 0
    local KEEP_ASPECT_FIT = 1
    local KEEP_ASPECT_FILL = 2
    local INVERT_MODE = 3

    local scaleConfigs = {
        rotated = {
            [STRETCH_MODE] = {aspect, 1.0, 1.0 / aspect, aspect},
            [KEEP_ASPECT_FIT] = {1.0, 1.0, 1.0, aspect},
            [KEEP_ASPECT_FILL] = {1.0, 1.0, 1.0 / aspect, 1.0},
            [INVERT_MODE] = {aspect, 1.0, 1.0 / aspect, aspect}
        },
        landscape = {
            [STRETCH_MODE] = {aspect, 1.0, 1.0, 1.0},
            [KEEP_ASPECT_FIT] = {1.0, 1.0, aspect, 1.0},
            [KEEP_ASPECT_FILL] = {1.0, 1.0, 1.0, 1.0 / aspect},
            [INVERT_MODE] = {aspect, 1.0, 1.0, 1.0}
        },
        default = {
            [STRETCH_MODE] = {aspect, 1.0, 1.0, 1.0},
            [KEEP_ASPECT_FIT] = {1.0, 1.0, aspect, 1.0},
            [KEEP_ASPECT_FILL] = {1.0, 1.0, 1.0, 1.0 / aspect},
            [INVERT_MODE] = {aspect, 1.0, 1.0, 1.0}
        }
    }

    local config = scaleConfigs[scaleType][mode] or scaleConfigs[scaleType][KEEP_ASPECT_FIT]
    return config[1], config[2], config[3], config[4]
end

function Utils:determineMultiRatioMode(useOrientationSpecificRatio, isLandscape, landscapeMultiRatioMode,
    portraitMultiRatioMode)
    return useOrientationSpecificRatio and (isLandscape and landscapeMultiRatioMode or portraitMultiRatioMode) or
               portraitMultiRatioMode
end

-- Lighting helper functions
function Utils:updateDirLight(lightEntity, lightComp, xform, enabled, dir, intensity, color)
    lightEntity.visible = enabled
    local dir1 = Amaz.Vector3f(-dir.y, dir.x, dir.z)
    if enabled then
        xform.localOrientation = self:calculateQuarternion(dir1)
        lightComp.intensiy = intensity
        lightComp.color = Amaz.Vector3f(color.r, color.g, color.b)
    end
end

function Utils:updatePointLight(lightEntity, lightComp, xform, enabled, pos, intensity, range, color)
    lightEntity.visible = enabled
    if enabled then
        xform.localPosition = pos
        lightComp.intensiy = intensity
        lightComp.attenuationRange = range
        lightComp.color = Amaz.Vector3f(color.r, color.g, color.b)
    end
end

function Utils:updateSpotLight(lightEntity, lightComp, xform, enabled, pos, dir, intensity, range, innerAngle, coneSize,
    color)
    lightEntity.visible = enabled
    local dir1 = Amaz.Vector3f(dir.y, -dir.x, dir.z)
    if enabled then
        xform.localPosition = pos
        xform.localOrientation = self:calculateQuarternion(dir1)
        lightComp.intensiy = intensity
        lightComp.attenuationRange = 1.0 / range
        lightComp.innerAngle = innerAngle
        lightComp.outerAngle = innerAngle + coneSize
        lightComp.color = Amaz.Vector3f(color.r, color.g, color.b)
    end
end

exports.Utils = Utils
return exports
