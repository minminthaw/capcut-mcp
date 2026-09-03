

local exports = exports or {}
local SeekModeScript = SeekModeScript or {}
SeekModeScript.__index = SeekModeScript
function SeekModeScript.new(construct, ...)
    local self = setmetatable({}, SeekModeScript)
    if construct and SeekModeScript.constructor then SeekModeScript.constructor(self, ...) end
    self.startTime = 0.0
    self.endTime = 3.0
    self.curTime = 0.0
    self.width = 0
    self.height = 0
    self.speed =1
    return self
end

function SeekModeScript:constructor()

end

function SeekModeScript:onUpdate(comp, detalTime)
    --
    -- local props = comp.entity:getComponent("ScriptComponent").properties
    -- if props:has("curTime") then
    --     self:seekToTime(comp, props:get("curTime") - self.startTime)
    -- end
    --
    if Editor ~= nil then
        self.curTime=self.curTime+detalTime
    end
    self:seekToTime(comp, self.curTime - self.startTime)
end

function SeekModeScript:onStart(comp)
    self.animSeqCom = comp.entity.scene:findEntityBy("seqPass"):getComponent("AnimSeqComponent")
    self.material = comp.entity.scene:findEntityBy("seqPass"):getComponent("MeshRenderer").material
end

function SeekModeScript:seekToTime(comp, time)
    self.speed = self.material:getFloat("speed")
    self.animSeqCom:seekToTime(time*self.speed)
end
exports.SeekModeScript = SeekModeScript
return exports
