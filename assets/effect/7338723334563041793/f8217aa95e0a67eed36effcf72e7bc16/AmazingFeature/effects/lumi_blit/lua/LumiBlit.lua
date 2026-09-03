local isEditor = (Amaz.Macros and Amaz.Macros.EditorSDK) and true or false
local exports = exports or {}
local LumiBlit = LumiBlit or {}
LumiBlit.__index = LumiBlit
---@class LumiBlit : ScriptComponent
---@field InputTex Texture
---@field OutputTex Texture

function LumiBlit.new(construct, ...)
    local self = setmetatable({}, LumiBlit)

    if construct and LumiBlit.constructor then LumiBlit.constructor(self, ...) end

    self.InputTex = nil
    self.OutputTex = nil

    return self
end

function LumiBlit:constructor()
end

function LumiBlit:onStart(comp)
    self.camera = comp.entity:searchEntity("BlitCamera"):getComponent("Camera")
    self.material = comp.entity:searchEntity("BlitPass"):getComponent("MeshRenderer").material
end

function LumiBlit:onUpdate(comp, deltaTime)
    if self.OutputTex then
        self.camera.renderTexture = self.OutputTex
    end
    self.material:setTex("u_InputTexture", self.InputTex)
end

exports.LumiBlit = LumiBlit
return exports
