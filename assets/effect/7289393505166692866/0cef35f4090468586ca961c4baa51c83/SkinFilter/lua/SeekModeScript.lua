--@input float curTime = 0.0{"widget":"slider","min":0,"max":3.0}
local exports = exports or {}
local SeekModeScript = SeekModeScript or {}
SeekModeScript.__index = SeekModeScript
function SeekModeScript.new(construct, ...)
    local self = setmetatable({}, SeekModeScript)
    if construct and SeekModeScript.constructor then SeekModeScript.constructor(self, ...) end
    self.startTime = 0.0
    self.endTime = 3.0
    self.curTime = 0.0
    self.first = nil
    return self
end

function SeekModeScript:constructor()
end

-- function SeekModeScript:onUpdate(comp, detalTime)

-- end

function SeekModeScript:onStart(comp, sys)

    self.SkinMaterial = comp.entity.scene:findEntityBy("SeekModeScript"):getComponent("MeshRenderer").material
end

-- function SeekModeScript:seekToTime(comp, time)
   

-- end

function SeekModeScript:onEvent(sys, event)
    
    if "intensity" == event.args:get(0) then
        local intensity = event.args:get(1)
        self.SkinMaterial:setFloat("intensity",intensity)
    end
    
end

exports.SeekModeScript = SeekModeScript
return exports