---@class ScriptCompGodRay: ScriptComponent
---@field center Vector2f
---@field intensity number [UI(Range={0., 1.}, Drag)]
---@field weightDecay number [UI(Range={0., 2.}, Drag)]
---@field colorDecay number [UI(Range={0., 1.}, Drag)]
---@field range number [UI(Range={0., 1.}, Drag)]
---@field smoothness number [UI(Range={0., 1.}, Drag)]
---@field brightness number [UI(Range={0., 1.}, Drag)]
---@field grayscaleCorrection number [UI(Range={-1., 1.}, Drag)]
---@field scaleType string string [UI(Option={"100%", "75%", "50%", "25%", "10%", "5%"})]
---@field quality number [UI(Range={10., 100.}, Drag)]
---@field useAngle boolean
---@field angleType string string [UI(Option={"Angle", "Direction Point"})]
---@field angle number [UI(Range={0., 360.}, Drag)]
---@field directionPoint Vector2f
---@field angleRange number [UI(Range={0., 360.}, Drag)]
---@field blendMode string [UI(Option={"Screen", "Add", "Lighten", "Multiply", "Normal"})]
---@field borderType string [UI(Option={"Mirror", "Black"})]
---@field colorType string [UI(Option={"Source", "Light Color"})]
---@field lightColor Color [UI(NoAlpha)]
---@field dither number [UI(Range={0., 1.0}, Drag)]
---@field noiseIntensity number [UI(Range={0., 1.0}, Drag)]
---@field blendMixFactor number [UI(Range={0., 1.0}, Drag)]
---@field displayRayOnly boolean
---@field inverseGammaCorrection boolean
---@field lightSource string [UI(Option={"Source", "Mask"})]
---@field maskTex Texture
---@field InputTex Texture
---@field OutputTex Texture
---@field lumiSharedRt Vector [UI(Type="Texture")]

local exports = exports or {}
local ScriptCompGodRay = ScriptCompGodRay or {}
ScriptCompGodRay.__index = ScriptCompGodRay

------------ util functions ------------
local function createRenderTexture(width, height)
    local rt = Amaz.RenderTexture()
    rt.width = width
    rt.height = height
    rt.depth = 1
    rt.filterMag = Amaz.FilterMode.LINEAR
    rt.filterMin = Amaz.FilterMode.LINEAR
    rt.attachment = Amaz.RenderTextureAttachment.NONE
    return rt
end

local function clamp(value, min, max)
    --[[
        Description: clamp value between [min, max]
    ]]
    return math.min(math.max(value, min), max)
end

local function remap(value, srcMin, srcMax, dstMin, dstMax)
    --[[
        Description: linearly remap value from [srcMin, srcMax] to [dstMin, dstMax]
    ]]
    return dstMin + (value - srcMin) * (dstMax - dstMin) / (srcMax - srcMin)
end

local function getXYScale(width, height)
    --[[
        Description: get XY scale for adjusting width/height ratio.
    ]]
    -- the following computation for baseSize is to avoid too small or too large width/height ratio.
    local size1 = math.min(width, height)
    local size2 = math.max(width, height) / 2.
    local baseSize = math.max(size1, size2)

    local xScale = baseSize / width
    local yScale = baseSize / height
    return xScale, yScale
end

local function boolToInt(flag)
    --[[
        Description: convert flag from bool to int
    ]]
    if flag then return 1 end
    return 0
end

local function getBorderType(borderType)
    --[[
        Description: convert borderType from string to int
    ]]
    local borderTypeTable = {
        ["Mirror"] = 0,  -- default
        ["Black"] = 1,
    }
    local flag = borderTypeTable[borderType]
    if flag == nil then flag = 0 end
    return flag
end

local function getBlendMode(blendMode)
    --[[
        Description: convert colorType from string to int
    ]]
    local blendModeTable = {
        ["Screen"] = 0, -- default
        ["Add"] = 1,
        ["Lighten"] = 2,
        ["Multiply"] = 3,
        ["Normal"] = 4
    }
    local flag = blendModeTable[blendMode]
    if flag == nil then flag = 0 end
    return flag
end

local function getColorType(colorType)
    --[[
        Description: convert colorType from string to int
    ]]
    local colorTypeTable = {
        ["Source"] = 0, -- default
        ["Light Color"] = 1
    }
    local flag = colorTypeTable[colorType]
    if flag == nil then flag = 0 end
    return flag
end

local function getLightSource(lightSource)
    --[[
        Description: convert lightSource from string to int
    ]]
    local lightSourceTable = {
        ["Source"] = 0, -- default
        ["Mask"] = 1
    }
    local flag = lightSourceTable[lightSource]
    if flag == nil then flag = 0 end
    return flag
end

local function getMidTextureScale(scaleType)
    local scaleTypeTable = {
        ["100%"] = 1.,
        ["75%"] = 0.75,
        ["50%"] = 0.5,
        ["25%"] = 0.25,
        ["10%"] = 0.1,  -- default
        ["5%"] = 0.05
    }
    local scale = scaleTypeTable[scaleType]
    if scale == nil then scale = 1. end
    return scale
end

local function getDirectionAngle(centerX, centerY, pointX, pointY, width, height)
    --[[
        Description: get direction angle from `center` to `directionPoint`
    ]]
    if (pointX == centerX) and (pointY == centerY) then
        return 90
    end

    local dirX = pointX - centerX
    local dirY = pointY - centerY
    dirY = dirY * height / width
    local angle = math.deg(math.atan2(dirY, dirX))
    return angle
end

------------ class functions for ScriptComponent ------------
function ScriptCompGodRay.new(construct, ...)
    local self = setmetatable({}, ScriptCompGodRay)

    if construct and ScriptCompGodRay.constructor then ScriptCompGodRay.constructor(self, ...) end
    -- user parameters
    self.intensity = 1.
    self.range = 0.5
    self.brightness = 0.1
    self.smoothness = 0.
    self.weightDecay = 1.
    self.colorDecay = 1.
    self.scaleType = "50%"
    self.quality = 50.
    self.grayscaleCorrection = 0.
    self.center = Amaz.Vector2f(0.5, 0.5)
    self.borderType = "Mirror"
    self.blendMode = "Screen"
    self.colorType = "Source"
    self.lightColor = Amaz.Color(1., 1., 1.)
    self.displayRayOnly = false
    self.dither = 0.
    self.noiseIntensity = 0.
    self.blendMixFactor = 0.5
    self.inverseGammaCorrection = false
    self.lightSource = "Source"
    self.angleType = "Angle"
    self.directionPoint = Amaz.Vector2f(0.5, 0.5)
    self.useAngle = false
    self.angle = 0.
    self.angleRange = 360.

    -- other parameters
    self.MaxIntensity = 1.
    self.MinQuality = 10.
    self.MaxQuality = 100.
    self.MinGrayscaleCorrection = -1.
    self.MaxGrayscaleCorrection = 1.
    self.MinCenter = -1.
    self.MaxCenter = 2.
    self.MinWeightDecay = 0.0
    self.MaxWeightDecay = 2.0
    self.MaxDither = 0.5
    self.Gamma = 2.2
    self.MaxGaussianBlurSample = 30
    self.RadiusOverSigma = 2.5
    self.Eps = 1e-5

    -- finetuned parameters for some GodRay uniform variables
    self.NormalizationSize = 1000.
    self.NormalizationSample = 50.
    self.SampleScale = 15.
    self.SampleBias = 20.

    self.InputTex = nil
    self.OutputTex = nil
    self.maskTex = nil
    return self
end

function ScriptCompGodRay:setEffectAttr(key, value, comp)
    local function _setEffectAttr(_key, _value, _forceState)
        if self[_key] ~= nil or _forceState then
            self[_key] = _value
            if comp and comp.properties ~= nil then
                comp.properties:set(_key, _value)
            end
        end
    end

    if key == "colorType" then
        local typeTable = {"Source", "Light Color"}
        local colorType = typeTable[value + 1]
        if colorType == nil then colorType = "Source" end
        _setEffectAttr(key, colorType)
    elseif key == "borderType" then
        local typeTable = {"Mirror", "Black"}
        local borderType = typeTable[value + 1]
        if borderType == nil then borderType = "Mirror" end
        _setEffectAttr(key, borderType)
    elseif key == "blendMode" then
        local typeTable = {"Screen", "Add", "Lighten", "Multiply", "Normal"}
        local blendMode = typeTable[value + 1]
        if blendMode == nil then blendMode = "Screen" end
        _setEffectAttr(key, blendMode)
    elseif key == "scaleType" then
        local typeTable = {"100%", "75%", "50%", "25%", "10%", "5%"}
        local scaleType = typeTable[value + 1]
        if scaleType == nil then scaleType = "50%" end
        _setEffectAttr(key, scaleType)
    elseif key == "lightSource" then
        local typeTable = {"Source", "Mask", "Source and Mask"}
        local lightSource = typeTable[value + 1]
        if lightSource == nil then lightSource = "Source" end
        _setEffectAttr(key, lightSource)
    elseif key == "angleType" then
        local typeTable = {"Angle", "Direction Point"}
        local angleType = typeTable[value + 1]
        if angleType == nil then angleType = "Angle" end
        _setEffectAttr(key, angleType)
    elseif key == "maskTex" then
        _setEffectAttr(key, value, true)
    else
        _setEffectAttr(key, value)
    end
end

function ScriptCompGodRay:onStart(comp)
    self.newmidTex = self.lumiSharedRt:get(0)
    
    self.matInputThreshold = comp.entity:searchEntity("EntityInputThreshold"):getComponent("MeshRenderer").material
    self.matInputGaussianBlurX = comp.entity:searchEntity("EntityInputGaussianBlurX"):getComponent("MeshRenderer").material
    self.matInputGaussianBlurY = comp.entity:searchEntity("EntityInputGaussianBlurY"):getComponent("MeshRenderer").material
    self.matMaskThreshold = comp.entity:searchEntity("EntityMaskThreshold"):getComponent("MeshRenderer").material
    self.matMaskGaussianBlurX = comp.entity:searchEntity("EntityMaskGaussianBlurX"):getComponent("MeshRenderer").material
    self.matMaskGaussianBlurY = comp.entity:searchEntity("EntityMaskGaussianBlurY"):getComponent("MeshRenderer").material

    self.camInputThreshold = comp.entity:searchEntity("CameraInputThreshold"):getComponent("Camera")
    self.camInputGaussianBlurX = comp.entity:searchEntity("CameraInputGaussianBlurX"):getComponent("Camera")
    self.camInputGaussianBlurY = comp.entity:searchEntity("CameraInputGaussianBlurY"):getComponent("Camera")
    self.camMaskThreshold = comp.entity:searchEntity("CameraMaskThreshold"):getComponent("Camera")
    self.camMaskGaussianBlurX = comp.entity:searchEntity("CameraMaskGaussianBlurX"):getComponent("Camera")
    self.camMaskGaussianBlurY = comp.entity:searchEntity("CameraMaskGaussianBlurY"):getComponent("Camera")

    self.matGodRay = comp.entity:searchEntity("EntityGodRay"):getComponent("MeshRenderer").material
    self.camGodRay = comp.entity:searchEntity("CameraGodRay"):getComponent("Camera")

    self.mix = comp.entity:searchEntity("mix"):getComponent("MeshRenderer").material
    self.Camera_mix = comp.entity:searchEntity("Camera_mix"):getComponent("Camera")
    -- Tex1 for input texture, Tex2 for mask texture
    self.midTex1 = createRenderTexture(1, 1)
    self.blurMidTex1 = createRenderTexture(1, 1)
    self.midTex2 = createRenderTexture(1, 1)
    self.blurMidTex2 = createRenderTexture(1, 1)
end

function ScriptCompGodRay:onUpdate(comp, deltaTime)
    local textureWidth = self.OutputTex.width
    local textureHeight = self.OutputTex.height
    
    local downscale = getMidTextureScale(self.scaleType)
    local downscaleWidth = textureWidth * downscale
    local downscaleHeight = textureHeight * downscale
    -- if self.midTex.width ~= self.OutputTex.width or self.midTex.height ~= self.OutputTex.height then
    --     self.midTex.width = self.OutputTex.width
    --     self.midTex.height = self.OutputTex.height
    -- end
    
    -- prepare parameters for Threshold material
    self.range = clamp(self.range, 0., 1.)
    local colorType = getColorType(self.colorType)

    -- prepare parameters for GaussianBlur material
    self.smoothness = clamp(self.smoothness, 0., 1.)
    local sample = remap(self.smoothness, 0., 1., 0., self.MaxGaussianBlurSample)
    local xScale, yScale = getXYScale(textureWidth, textureHeight)
    local dx = xScale / self.NormalizationSize
    local dy = yScale / self.NormalizationSize
    local sigmaX = sample * dx / self.RadiusOverSigma
    local sigmaY = sample * dy / self.RadiusOverSigma

    -- prepare parameters for GodRay material
    self.intensity = clamp(self.intensity, 0., self.MaxIntensity)
    self.brightness = clamp(self.brightness, 0., 1.)
    self.quality = clamp(self.quality, self.MinQuality, self.MaxQuality)
    local quality = self.quality * downscale ^ 0.5

    self.newmidTex.width = self.InputTex.width * (self.quality/200 + 0.1)
    self.newmidTex.height = self.InputTex.height * (self.quality/200 + 0.1)

    self.grayscaleCorrection = clamp(self.grayscaleCorrection, self.MinGrayscaleCorrection, self.MaxGrayscaleCorrection)
    self.center.x = clamp(self.center.x, self.MinCenter, self.MaxCenter)
    self.center.y = clamp(self.center.y, self.MinCenter, self.MaxCenter)
    self.dither = clamp(self.dither, 0., 1.)
    self.weightDecay = clamp(self.weightDecay, self.MinWeightDecay, self.MaxWeightDecay)
    self.colorDecay = clamp(self.colorDecay, 0., 1.)
    local borderType = getBorderType(self.borderType)
    local blendMode = getBlendMode(self.blendMode)
    local dither = remap(self.dither, 0., 1., 0., self.MaxDither) * 5.
    local noiseIntensity = remap(self.noiseIntensity, 0., 1., 0., 2.)
    local displayRayOnly = boolToInt(self.displayRayOnly)
    local inverseGammaCorrection = boolToInt(self.inverseGammaCorrection)
    local grayscaleCorrection = 10 ^ (-self.grayscaleCorrection)
    local lightSource = getLightSource(self.lightSource)
    self.blendMixFactor = clamp(self.blendMixFactor, 0., 1.)

    local angle = 0
    if self.angleType == "Angle" then
        angle = (90. - self.angle) % 360.     -- start angle is north, and rotate direction is clockwise
    else
        angle = getDirectionAngle(self.center.x, self.center.y, self.directionPoint.x, self.directionPoint.y, textureWidth, textureHeight)
        angle = angle % 360
    end
    self.angleRange = clamp(self.angleRange, 0., 360.)
    local useAngle = boolToInt(self.useAngle)
    local halfAngleRange = self.angleRange / 2.
    local minAngle = math.rad(angle - halfAngleRange)
    local maxAngle = math.rad(angle + halfAngleRange)

    -- process lightColor
    local lightColorRed = self.lightColor.r
    local lightColorGreen = self.lightColor.g
    local lightColorBlue = self.lightColor.b
    if self.inverseGammaCorrection then
        lightColorRed = lightColorRed ^ self.Gamma
        lightColorGreen = lightColorGreen ^ self.Gamma
        lightColorBlue = lightColorBlue ^ self.Gamma
    end

    -- set texture size, Tex1 for input texture, Tex2 for mask texture
    if self.lightSource == "Source" then
        self.midTex1.width = downscaleWidth
        self.midTex1.height = downscaleHeight
        self.midTex2.width = 1
        self.midTex2.height = 1
    elseif self.lightSource == "Mask" then
        self.midTex1.width = 1
        self.midTex1.height = 1
        self.midTex2.width = downscaleWidth
        self.midTex2.height = downscaleHeight
    end

    if self.smoothness > self.Eps then
        if self.lightSource == "Source" then
            self.blurMidTex1.width = downscaleWidth
            self.blurMidTex1.height = downscaleHeight
            self.blurMidTex2.width = 1
            self.blurMidTex2.height = 1
        elseif self.lightSource == "Mask" then
            self.blurMidTex1.width = 1
            self.blurMidTex1.height = 1
            self.blurMidTex2.width = downscaleWidth
            self.blurMidTex2.height = downscaleHeight
        end
    else
        self.blurMidTex1.width = 1
        self.blurMidTex1.height = 1
        self.blurMidTex2.width = 1
        self.blurMidTex2.height = 1
    end

    -- set InputTex, OutputTex
    self.matInputThreshold:setTex("u_inputTexture", self.InputTex)
    self.camInputThreshold.renderTexture = self.midTex1
    self.matInputGaussianBlurX:setTex("u_inputTexture", self.midTex1)
    self.camInputGaussianBlurX.renderTexture = self.blurMidTex1
    self.matInputGaussianBlurY:setTex("u_inputTexture", self.blurMidTex1)
    self.camInputGaussianBlurY.renderTexture = self.midTex1

    self.matMaskThreshold:setTex("u_inputTexture", self.maskTex)
    self.camMaskThreshold.renderTexture = self.midTex2
    self.matMaskGaussianBlurX:setTex("u_inputTexture", self.midTex2)
    self.camMaskGaussianBlurX.renderTexture = self.blurMidTex2
    self.matMaskGaussianBlurY:setTex("u_inputTexture", self.blurMidTex2)
    self.camMaskGaussianBlurY.renderTexture = self.midTex2

    self.matGodRay:setTex("u_godRayTexture1", self.midTex1)
    self.matGodRay:setTex("u_godRayTexture2", self.midTex2)
    self.Camera_mix.renderTexture = self.OutputTex
    self.camGodRay.renderTexture = self.newmidTex

    self.mix:setTex("u_intexture", self.newmidTex)
    self.mix:setTex("u_mixTexture", self.InputTex)
    -- set visibility
    self.camInputThreshold.entity.visible = true
    self.camMaskThreshold.entity.visible = true
    if self.lightSource == "Source" then
        self.camMaskThreshold.entity.visible = false
    elseif self.lightSource == "Mask" then
        self.camInputThreshold.entity.visible = false
    end

    self.camInputGaussianBlurX.entity.visible = false
    self.camInputGaussianBlurY.entity.visible = false
    self.camMaskGaussianBlurX.entity.visible = false
    self.camMaskGaussianBlurY.entity.visible = false
    if self.smoothness > self.Eps then
        if self.lightSource == "Source" then
            self.camInputGaussianBlurX.entity.visible = true
            self.camInputGaussianBlurY.entity.visible = true
        end
        if self.lightSource == "Mask" then
            self.camMaskGaussianBlurX.entity.visible = true
            self.camMaskGaussianBlurY.entity.visible = true
        end
    end

    -- set material parameters
    self.matInputThreshold:setFloat("u_threshold", 1. - self.range)
    self.matInputThreshold:setInt("u_colorType", colorType)
    self.matMaskThreshold:setFloat("u_threshold", 1. - self.range)
    self.matMaskThreshold:setInt("u_colorType", colorType)

    self.matInputGaussianBlurX:setFloat("u_sampleX", sample)
    self.matInputGaussianBlurX:setFloat("u_sigmaX", sigmaX)
    self.matInputGaussianBlurX:setFloat("u_dx", dx)
    self.matInputGaussianBlurY:setFloat("u_sampleY", sample)
    self.matInputGaussianBlurY:setFloat("u_sigmaY", sigmaY)
    self.matInputGaussianBlurY:setFloat("u_dy", dy)

    self.matMaskGaussianBlurX:setFloat("u_sampleX", sample)
    self.matMaskGaussianBlurX:setFloat("u_sigmaX", sigmaX)
    self.matMaskGaussianBlurX:setFloat("u_dx", dx)
    self.matMaskGaussianBlurY:setFloat("u_sampleY", sample)
    self.matMaskGaussianBlurY:setFloat("u_sigmaY", sigmaY)
    self.matMaskGaussianBlurY:setFloat("u_dy", dy)

    self.matGodRay:setFloat("u_intensity", self.intensity)
    self.matGodRay:setFloat("u_brightness", self.brightness)
    self.matGodRay:setFloat("u_quality", quality)
    self.matGodRay:setFloat("u_grayscaleCorrection", grayscaleCorrection)
    self.matGodRay:setVec2("u_center", self.center)
    self.matGodRay:setInt("u_borderType", borderType)
    self.matGodRay:setInt("u_blendMode", blendMode)
    self.mix:setInt("u_blendMode", blendMode)
    self.mix:setInt("u_displayRayOnly", displayRayOnly)

    self.matGodRay:setInt("u_colorType", colorType)
    self.matGodRay:setInt("u_lightSource", lightSource)
    self.matGodRay:setVec3("u_lightColor", Amaz.Vector3f(lightColorRed, lightColorGreen, lightColorBlue))
    self.matGodRay:setFloat("u_dither", dither)
    self.matGodRay:setFloat("u_noiseIntensity", noiseIntensity)
    self.matGodRay:setFloat("u_blendMixFactor", self.blendMixFactor)
    self.matGodRay:setFloat("u_weightDecay", self.weightDecay)
    self.matGodRay:setFloat("u_colorDecay", self.colorDecay)
    self.matGodRay:setInt("u_displayRayOnly", displayRayOnly)
    self.matGodRay:setInt("u_inverseGammaCorrection", inverseGammaCorrection)
    self.matGodRay:setFloat("u_gamma", self.Gamma)
    self.matGodRay:setFloat("u_normalizationSample", self.NormalizationSample)
    self.matGodRay:setFloat("u_sampleScale", self.SampleScale)
    self.matGodRay:setFloat("u_sampleBias", self.SampleBias)
    self.matGodRay:setInt("u_useAngle", useAngle)
    self.matGodRay:setFloat("u_minAngle", minAngle)
    self.matGodRay:setFloat("u_maxAngle", maxAngle)
end

exports.ScriptCompGodRay = ScriptCompGodRay
return exports
