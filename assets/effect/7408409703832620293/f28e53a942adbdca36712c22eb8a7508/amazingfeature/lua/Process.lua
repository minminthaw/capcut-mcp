local exports = exports or {}
local Process = Process or {}
Process.__index = Process
function Process.new(construct, ...)
    local self = setmetatable({}, Process)
    if construct and Process.constructor then Process.constructor(self, ...) end
    return self
end

function Process:constructor()

end

function Process:onStart(comp)
    self.reshapeComp = comp.entity:getComponent("FaceReshape")

    self.ffareye = self.reshapeComp.params.degrees:get(0)
    self.fzoomeye = self.reshapeComp.params.degrees:get(1)
    self.frotateeye = self.reshapeComp.params.degrees:get(2)
    self.fmoveye = self.reshapeComp.params.degrees:get(3)
    self.fzoomnose = self.reshapeComp.params.degrees:get(4)
    self.fmovnose = self.reshapeComp.params.degrees:get(5)
    self.fmovmouth = self.reshapeComp.params.degrees:get(6)
    self.fzoommouth = self.reshapeComp.params.degrees:get(7)
    self.fmovchin = self.reshapeComp.params.degrees:get(8)
    self.fzoomforehead = self.reshapeComp.params.degrees:get(9)
    self.fzoomface = self.reshapeComp.params.degrees:get(10)
    self.fcutface = self.reshapeComp.params.degrees:get(11)
    self.fsmallface = self.reshapeComp.params.degrees:get(12)
    self.fzoomjawbone = self.reshapeComp.params.degrees:get(13)
    self.fzoomcheekbone = self.reshapeComp.params.degrees:get(14)
    self.fdraglips = self.reshapeComp.params.degrees:get(15)
    self.fcornereye = self.reshapeComp.params.degrees:get(16)
    self.flipenhance = self.reshapeComp.params.degrees:get(17)
    self.fpointychin = self.reshapeComp.params.degrees:get(18)
    self.ftemple = self.reshapeComp.params.degrees:get(19)
    self.fvface = self.reshapeComp.params.degrees:get(21)
    -- self.fjumpeyebrow = self.reshapeComp.params.degrees:get(22)
    self.intensity = 0.0
    self.reshapeComp.params.degrees:set(0, 0.0)
    self.reshapeComp.params.degrees:set(1, 0.0)
    self.reshapeComp.params.degrees:set(2, 0.0)
    self.reshapeComp.params.degrees:set(3, 0.0)
    self.reshapeComp.params.degrees:set(4, 0.0)
    self.reshapeComp.params.degrees:set(5, 0.0)
    self.reshapeComp.params.degrees:set(6, 0.0)
    self.reshapeComp.params.degrees:set(7, 0.0)
    self.reshapeComp.params.degrees:set(8, 0.0)
    self.reshapeComp.params.degrees:set(9, 0.0)
    self.reshapeComp.params.degrees:set(10, 0.0)
    self.reshapeComp.params.degrees:set(11, 0.0)
    self.reshapeComp.params.degrees:set(12, 0.0)
    self.reshapeComp.params.degrees:set(13, 0.0)
    self.reshapeComp.params.degrees:set(14, 0.0)
    self.reshapeComp.params.degrees:set(15, 0.0)
    self.reshapeComp.params.degrees:set(16, 0.0)
    self.reshapeComp.params.degrees:set(17, 0.0)
    self.reshapeComp.params.degrees:set(18, 0.0)
    self.reshapeComp.params.degrees:set(19, 0.0)
    self.reshapeComp.params.degrees:set(21, 0.0)
end

function Process:onEvent(comp, event)
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        if event.args:get(0) == "intensity" then
            self.intensity = event.args:get(1)
            self.reshapeComp.params.degrees:set(0, self.ffareye * self.intensity)
            self.reshapeComp.params.degrees:set(1, self.fzoomeye * self.intensity)
            self.reshapeComp.params.degrees:set(2, self.frotateeye * self.intensity)
            self.reshapeComp.params.degrees:set(3, self.fmoveye * self.intensity)
            self.reshapeComp.params.degrees:set(4, self.fzoomnose * self.intensity)
            self.reshapeComp.params.degrees:set(5, self.fmovnose * self.intensity)
            self.reshapeComp.params.degrees:set(6, self.fmovmouth * self.intensity)
            self.reshapeComp.params.degrees:set(7, self.fzoommouth * self.intensity)
            self.reshapeComp.params.degrees:set(8, self.fmovchin * self.intensity)
            self.reshapeComp.params.degrees:set(9, self.fzoomforehead * self.intensity)
            self.reshapeComp.params.degrees:set(10, self.fzoomface * self.intensity)
            self.reshapeComp.params.degrees:set(11, self.fcutface * self.intensity)
            self.reshapeComp.params.degrees:set(12, self.fsmallface * self.intensity)
            self.reshapeComp.params.degrees:set(13, self.fzoomjawbone * self.intensity)
            self.reshapeComp.params.degrees:set(14, self.fzoomcheekbone * self.intensity)
            self.reshapeComp.params.degrees:set(15, self.fdraglips * self.intensity)
            self.reshapeComp.params.degrees:set(16, self.fcornereye * self.intensity)
            self.reshapeComp.params.degrees:set(17, self.flipenhance * self.intensity)
            self.reshapeComp.params.degrees:set(18, self.fpointychin * self.intensity)
            self.reshapeComp.params.degrees:set(19, self.ftemple * self.intensity)
            self.reshapeComp.params.degrees:set(21, self.fvface * self.intensity)
        end
    end
end

exports.Process = Process
return exports
