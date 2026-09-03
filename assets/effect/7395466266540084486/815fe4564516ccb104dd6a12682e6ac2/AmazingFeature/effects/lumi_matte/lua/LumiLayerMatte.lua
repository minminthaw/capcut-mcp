local exports = exports or {}
local LumiLayerMatte = LumiLayerMatte or {}
LumiLayerMatte.__index = LumiLayerMatte
---@class LumiLayerMatte: ScriptComponent
---@field matteMode string [UI(Option={"Alpha", "Luma", "AlphaInverted", "LumaInverted"})]
---@field MaskTex Texture
---@field InputTex Texture
---@field OutputTex Texture

local MatteMode = {
    "Alpha", "Luma", "AlphaInverted", "LumaInverted"
}
setmetatable(MatteMode, {__index = function(_, _) return MatteMode[1] end})

local MatteModeIndex = {}
for index, value in ipairs(MatteMode) do MatteModeIndex[value] = index - 1 end
setmetatable(MatteModeIndex, {
    __index = function(_, key)
        Amaz.LOGE("AE_LUA_TAG", "Unsupported matte mode: " .. key)
        return 0
    end
})

function LumiLayerMatte.new(construct, ...)
    local self = setmetatable({}, LumiLayerMatte)

    if construct and LumiLayerMatte.constructor then LumiLayerMatte.constructor(self, ...) end

    self.InputTex = nil
    self.OutputTex = nil
    self.MaskTex = nil
    self.matteMode = "Alpha"

    return self
end

function LumiLayerMatte:constructor()
end

function LumiLayerMatte:onStart(comp)
    self.camera = comp.entity:searchEntity("MatteCamera"):getComponent("Camera")
    self.material = comp.entity:searchEntity("MattePass"):getComponent("MeshRenderer").material
end

function LumiLayerMatte:onUpdate(comp, deltaTime)
    self.camera.renderTexture = self.OutputTex
    self.material:setTex("u_InputTexture", self.InputTex)
    self.material:setTex("u_MaskTexture", self.MaskTex)
    self.material:setInt("u_MatteMode", MatteModeIndex[self.matteMode])
end

exports.LumiLayerMatte = LumiLayerMatte
return exports
