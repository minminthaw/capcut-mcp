local exports = exports or {}
local DilateErode = DilateErode or {}
DilateErode.__index = DilateErode
---@class DilateErode: ScriptComponent
---@field kernelSize number
---@field kernelType number
---@field channel number
---@field mode number
---@field textLines int [UI(Range={1, 50}, Slider)]
---@field InputTex Texture
---@field OutputTex Texture
---@field lumiSharedRt Vector [UI(Type="Texture")]

local AE_EFFECT_TAG = 'AE_EFFECT_TAG LumiTag'

function DilateErode.new(construct, ...)
    local self = setmetatable({}, DilateErode)

    self.InputTex = nil
    self.OutputTex = nil

    return self
end

function DilateErode:onStart(comp)
    self.entity = comp.entity
    self.TAG = AE_EFFECT_TAG .. ' ' .. self.entity.name

    self:start(comp)
end

function DilateErode:start(comp)
    self.first = true
    self.properties = comp.properties
    self.cameraH = comp.entity:searchEntity("Camera_entity_convolution")
    self.cameraV = comp.entity:searchEntity("Camera_entity_convolution_2")
    self.cameraR = comp.entity:searchEntity("Camera_entity_convolution_3")
    self.materialH = comp.entity:searchEntity("convolution_renderer"):getComponent("MeshRenderer").material
    self.materialV = comp.entity:searchEntity("convolution_renderer_2"):getComponent("MeshRenderer").material
    self.materialR = comp.entity:searchEntity("convolution_renderer_3"):getComponent("MeshRenderer").material
    self.materialBlur = comp.entity:searchEntity("convolution_blur"):getComponent("MeshRenderer").material
    self.hCamera = self.cameraH:getComponent("Camera")
    self.blurCamera = comp.entity:searchEntity("Camera_entity_blur"):getComponent("Camera")
    self.midTex = self.lumiSharedRt:get(0)
    self.cameraV:getComponent("Camera").renderTexture = self.midTex
    self.cameraR:getComponent("Camera").renderTexture = self.midTex
    self.materialBlur:setTex("inputImageTexture", self.midTex)
end

function DilateErode:updateMaterial()
    if self.first == nil then
        return
    end

    self.materialH:setFloat("kernelSize", self.kernelSize);
    self.materialV:setFloat("kernelSize", self.kernelSize);
    self.materialR:setFloat("kernelSize", self.kernelSize);
    self.materialBlur:setFloat("kernelSize", self.kernelSize);
    self.materialH:setFloat("channel", self.channel);
    self.materialV:setFloat("channel", self.channel);
    self.materialR:setFloat("channel", self.channel);
    self.materialBlur:setFloat("channel", self.channel);
    self.materialH:setTex("inputImageTexture", self.InputTex)
    self.materialV:setTex("inputImageTexture", self.OutputTex)
    self.materialV:setTex("inputImageTexture0", self.InputTex)
    self.materialR:setTex("inputImageTexture", self.InputTex)
    self.materialBlur:setTex("oriImageTexture", self.InputTex)

    local normSize = 240
    if self.mode < 0.5 then
        normSize = 60 * math.max(1, math.floor(self.textLines+0.5))
    end
    self.materialH:setFloat("normSize", normSize);
    self.materialV:setFloat("normSize", normSize);
    self.materialR:setFloat("normSize", normSize);
    self.materialBlur:setFloat("normSize", normSize);

    local radius = 11.125
    -- for i=1, math.min(60, math.max(10, math.abs(self.kernelSize*5)+1)) do
    --     radius = radius + 1.0 / radius;
    -- end
    self.materialR:setFloat("radius", radius-1);

    if self.kernelType > 0.5 then
        self.cameraH.visible = false
        self.cameraV.visible = false
        self.cameraR.visible = true
    else
        self.cameraH.visible = true
        self.cameraV.visible = true
        self.cameraR.visible = false
    end
end

function DilateErode:onUpdate(comp, detalTime)
    if self.midTex.width ~= self.OutputTex.width or self.midTex.height ~= self.OutputTex.height then
        self.midTex.width = self.OutputTex.width
        self.midTex.height = self.OutputTex.height
    end

    if self.first == nil then
        self:start(comp)
    end

    self.hCamera.renderTexture = self.OutputTex
    self.blurCamera.renderTexture = self.OutputTex

    self:updateMaterial()
end

exports.DilateErode = DilateErode
return exports
