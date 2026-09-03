---@class ScriptCompBoxBlur: ScriptComponent
---@field blurIntensity number [UI(Range={0., 100.}, Drag)]
---@field iteration int [UI(Range={1, 5}, Slider)]
---@field horizontalStrength number [UI(Range={0., 1.}, Drag)]
---@field verticalStrength number [UI(Range={0., 1.}, Drag)]
---@field steps number [UI(Range={0.1, 10.}, Drag)]
---@field blurDirection string [UI(Option={"Horizontal and Vertical", "Horizontal", "Vertical"})]
---@field borderType string [UI(Option={"Normal", "Replicate", "Black", "Reflect"})]
---@field quality number [UI(Range={0.0, 1.0}, Drag)]
---@field InputTex Texture
---@field OutputTex Texture
---@field lumiSharedRt Vector [UI(Type="Texture")]
local exports = exports or {}
local ScriptCompBoxBlur = ScriptCompBoxBlur or {}
ScriptCompBoxBlur.__index = ScriptCompBoxBlur

------------ util functions ------------
local function clamp(value, min, max)
    --[[
        Description: clamp value between [min, max]
    ]]
    return math.min(math.max(value, min), max)
end

local function round(value)
    --[[
        Description: round value to integer
    ]]
    if value >= 0 then
        return math.floor(value + 0.5)
    else
        return math.ceil(value - 0.5)
    end
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

local function getBorderType(borderType)
    --[[
        Description: convert borderType from string to int
    ]]
    local borderTypeTable = {
        ["Normal"] = 0, -- default
        ["Replicate"] = 1,
        ["Black"] = 2,
        ["Reflect"] = 3
    }
    local flag = borderTypeTable[borderType]
    if flag == nil then
        flag = 0
    end
    return flag
end

------------ class functions for ScriptComponent ------------
function ScriptCompBoxBlur.new(construct, ...)
    local self = setmetatable({}, ScriptCompBoxBlur)

    if construct and ScriptCompBoxBlur.constructor then
        ScriptCompBoxBlur.constructor(self, ...)
    end
    -- user parameters
    self.blurIntensity = 0.
    self.iteration = 3
    self.horizontalStrength = 1.
    self.verticalStrength = 1.
    self.steps = 1.
    self.blurDirection = "Horizontal and Vertical"
    self.borderType = "Normal"

    -- other parameters
    self.normSize = 1000.
    self.maxIntensity = 100.
    self.minIteration = 1
    self.maxIteration = 5
    self.MinSteps = 0.1
    self.MaxSteps = 10.
    self.Gamma = 2.2
    self.Eps = 1e-5
    self.quality = 1.0

    self.InputTex = nil
    self.OutputTex = nil
    return self
end

function ScriptCompBoxBlur:setEffectAttr(key, value, comp)
    local function _setEffectAttr(_key, _value, _comp)
        if self[_key] ~= nil then
            self[_key] = _value
            if _comp and _comp.properties ~= nil then
                _comp.properties:set(_key, _value)
            end
        end
    end

    if key == "blurDirection" then
        local typeTable = {"Horizontal and Vertical", "Horizontal", "Vertical"}
        local blurDirection = typeTable[value + 1]
        if blurDirection == nil then
            blurDirection = "Horizontal and Vertical"
        end
        _setEffectAttr(key, blurDirection, comp)
    elseif key == "borderType" then
        local typeTable = {"Normal", "Replicate", "Black", "Reflect"}
        local borderType = typeTable[value + 1]
        if borderType == nil then
            borderType = "Normal"
        end
        _setEffectAttr(key, borderType, comp)
    else
        _setEffectAttr(key, value, comp)
    end
end

function ScriptCompBoxBlur:downRT(textureWidth, textureHeight, quality)
    local midTexX = self.lumiSharedRt:get(0)
    local midTexY = self.lumiSharedRt:get(1)
    midTexX.width = textureWidth * quality
    midTexX.height = textureHeight * quality
    midTexY.width = textureWidth * quality
    midTexY.height = textureHeight * quality
    self.midTexX = midTexX
    self.midTexY = midTexY
end

function ScriptCompBoxBlur:onStart(comp)
    local textureWidth = self.OutputTex.width
    local textureHeight = self.OutputTex.height
    self:downRT(textureWidth, textureHeight, self.quality)

    self.camDownScale = comp.entity:searchEntity("CameraDownScale"):getComponent("Camera")
    self.camUpScale = comp.entity:searchEntity("CameraUpScale"):getComponent("Camera")

    self.midTexX = self.lumiSharedRt:get(0)
    self.matBoxBlurXs = {}
    self.matBoxBlurYs = {}
    for i = 1, self.maxIteration, 1 do
        self.matBoxBlurXs[i] = comp.entity:searchEntity("EntityBoxBlurX_" .. i):getComponent("MeshRenderer").material
        self.matBoxBlurYs[i] = comp.entity:searchEntity("EntityBoxBlurY_" .. i):getComponent("MeshRenderer").material
        self.matBoxBlurYs[i]:setTex("u_inputTexture", self.midTexX)
    end

    self.camBoxBlurXs = {}
    self.camBoxBlurYs = {}
    for i = 1, self.maxIteration, 1 do
        self.camBoxBlurXs[i] = comp.entity:searchEntity("CameraBoxBlurX_" .. i):getComponent("Camera")
        self.camBoxBlurYs[i] = comp.entity:searchEntity("CameraBoxBlurY_" .. i):getComponent("Camera")
        self.camBoxBlurXs[i].renderTexture = self.midTexX
    end

    -- set Textures
    self.camDownScale.inputTexture = self.InputTex
    self.camDownScale.renderTexture = self.midTexY
    self.camUpScale.renderTexture = self.OutputTex
    self.camUpScale.inputTexture = self.midTexY
end

function ScriptCompBoxBlur:onUpdate(comp, deltaTime)
    local textureWidth = self.OutputTex.width
    local textureHeight = self.OutputTex.height
    self:downRT(textureWidth, textureHeight, math.max(self.quality, 0.1))

    -- prepare parameters
    self.blurIntensity = clamp(self.blurIntensity, 0., self.maxIntensity)
    self.iteration = clamp(self.iteration, self.minIteration, self.maxIteration)
    local iteration = round(self.iteration)
    local horizontalStrength = clamp(self.horizontalStrength, 0., 1.)
    local verticalStrength = clamp(self.verticalStrength, 0., 1.)

    if self.blurDirection == "Horizontal" then
        verticalStrength = 0.
    elseif self.blurDirection == "Vertical" then
        horizontalStrength = 0.
    end

    local sampleX = self.blurIntensity * horizontalStrength * 0.64
    local sampleY = self.blurIntensity * verticalStrength * 0.64
    self.steps = clamp(self.steps, self.MinSteps, self.MaxSteps)
    local borderType = getBorderType(self.borderType)

    -- compute dx, dy
    local textureWidth = self.OutputTex.width
    local textureHeight = self.OutputTex.height
    local xScale, yScale = getXYScale(textureWidth, textureHeight)
    local dx = self.steps * xScale / self.normSize
    local dy = self.steps * yScale / self.normSize

    -- set visible property of camera entities, according to iteration parameter
    for i = 1, self.maxIteration, 1 do
        if i <= iteration then
            self.camBoxBlurXs[i].entity.visible = true
            self.camBoxBlurYs[i].entity.visible = true
        else
            self.camBoxBlurXs[i].entity.visible = false
            self.camBoxBlurYs[i].entity.visible = false
        end
    end

    -- set InputTex and OutputTex
    self.matBoxBlurXs[1]:setTex("u_inputTexture", self.InputTex)
    for i = 2, self.maxIteration, 1 do
        self.matBoxBlurXs[i]:setTex("u_inputTexture", self.midTexY)
    end
    for i = 1, self.maxIteration, 1 do
        self.camBoxBlurYs[i].renderTexture = self.midTexY
    end

    -- set material parameters
    for i = 1, self.maxIteration, 1 do
        self.matBoxBlurXs[i]:setFloat("u_sampleX", sampleX)
        self.matBoxBlurXs[i]:setFloat("u_stepX", dx)
        self.matBoxBlurXs[i]:setInt("u_borderType", borderType)

        self.matBoxBlurYs[i]:setFloat("u_sampleY", sampleY)
        self.matBoxBlurYs[i]:setFloat("u_stepY", dy)
        self.matBoxBlurYs[i]:setInt("u_borderType", borderType)
    end

end

exports.ScriptCompBoxBlur = ScriptCompBoxBlur
return exports
