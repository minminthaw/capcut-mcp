local exports = exports or {}
local TempScriptLua = TempScriptLua or {}
TempScriptLua.__index = TempScriptLua
---@class TempScriptLua : ScriptComponent
---@field FilterIntensity number [UI(Slider,Range={0,1})]
---
function TempScriptLua.new(construct, ...)
    local self = setmetatable({}, TempScriptLua)
    self.FilterIntensity = 1.0
    if construct and TempScriptLua.constructor then TempScriptLua.constructor(self, ...) end
    return self
end

function TempScriptLua:constructor()
    self.name = "scriptComp"
end

function TempScriptLua:onStart(comp)
    -- self.trans = comp.entity:getComponent("Transform")
    self.FilterMaterial = comp.entity.scene:findEntityBy("SkinSegFilter"):getComponent("MeshRenderer").material
end

function TempScriptLua:onUpdate(comp, deltaTime)
end

function TempScriptLua:onEvent(sys, event)
    if "intensity" == event.args:get(0) then
        local intensity = event.args:get(1)
        self.FilterMaterial:setFloat("intensity", intensity)
    end
end

exports.TempScriptLua = TempScriptLua
return exports
