---@class GlowIter : ScriptComponent
---@field intensity number
---@field downSample number
---@field gammaValue number
---@field InputTex Texture
---@field BlurX Texture
---@field OutputTex Texture
local exports = exports or {}
local GlowIter = GlowIter or {}
GlowIter.__index = GlowIter

------------ class functions for ScriptComponent ------------
function GlowIter.new(construct, ...)
    local self = setmetatable({}, GlowIter)

    if construct and GlowIter.constructor then
        GlowIter.constructor(self, ...)
    end

    self.__lumi_type = "lumi_obj"
    self.__lumi_rt_pingpong_type = "custom"

    self.intensity = 0.0
    self.downSample = 1
    self.gammaValue = 2.2

    self.InputTex = nil
    self.BlurX = nil
    self.OutputTex = nil

    return self
end

function GlowIter:constructor() end

function GlowIter:onStart(comp)
    self.camBlurX = comp.entity:searchEntity("CameraBlurX"):getComponent("Camera")
    self.matBlurX = comp.entity:searchEntity("PassBlurX"):getComponent("MeshRenderer").material
    self.camBlurY = comp.entity:searchEntity("CameraBlurY"):getComponent("Camera")
    self.matBlurY = comp.entity:searchEntity("PassBlurY"):getComponent("MeshRenderer").material
end

function GlowIter:onUpdate(comp, detalTime)
    if self.BlurX then self.camBlurX.renderTexture = self.BlurX end
    if self.OutputTex then self.camBlurY.renderTexture = self.OutputTex end

    self.matBlurX:setTex("u_inputTex", self.InputTex)
    self.matBlurY:setTex("u_inputTex", self.BlurX)

    local intensity = math.max(self.intensity, 0.0)
    self.matBlurX:enableMacro("GLOWSAMPLE", math.floor(intensity))
    self.matBlurY:enableMacro("GLOWSAMPLE", math.floor(intensity))
    self.matBlurX:setFloat("u_downSample", self.downSample)
    self.matBlurY:setFloat("u_downSample", self.downSample)
    self.matBlurX:setFloat("u_gammaValue", self.gammaValue)
    self.matBlurY:setFloat("u_gammaValue", self.gammaValue)
end

function GlowIter:onDestroy(comp) end

function GlowIter:updateMaterials(comp, detalTime) end

exports.GlowIter = GlowIter
return exports
