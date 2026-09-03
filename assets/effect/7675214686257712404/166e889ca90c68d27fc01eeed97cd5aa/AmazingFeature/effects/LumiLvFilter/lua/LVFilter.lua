--@input float curTime = 0.0{"widget":"slider","min":0,"max":3.0}
local exports = exports or {}
local LVFilter = LVFilter or {}
LVFilter.__index = LVFilter
---@class LVFilter : ScriptComponent
---@field lutImage Texture
---@field uniAlpha double [UI(Range={0, 1}, Drag)]
---@field InputTex Texture
---@field OutputTex Texture

function LVFilter.new(construct, ...)
    local self = setmetatable({}, LVFilter)
    if construct and LVFilter.constructor then LVFilter.constructor(self, ...) end
    self.InputTex = nil
    self.OutputTex = nil
    self.lutImage = nil
    self.uniAlpha = 1
    self.startTime = 0.0
    self.endTime = 3.0
    self.curTime = 0.0

    return self
end

function LVFilter:constructor()
end

function LVFilter:onUpdate(comp, detalTime)
    self:seekToTime(comp, detalTime)
end

function LVFilter:onStart(comp, sys)
    self.inited = true
    self.camera = comp.entity:searchEntity("Camera_entity"):getComponent("Camera")
    self.pass6Material = comp.entity:searchEntity("PassEntity"):getComponent("MeshRenderer").material
end

function LVFilter:seekToTime(comp, time)
    if self.inited == nil then
        return
    end

    self.camera.renderTexture = self.OutputTex
    self.pass6Material:setTex("inputImageTexture", self.InputTex)
    self.pass6Material:setTex("inputImageTexture2", self.lutImage)
    self.pass6Material:setFloat("uniAlpha", self.lutImage ~= nil and self.uniAlpha or 0)
end

exports.LVFilter = LVFilter
return exports