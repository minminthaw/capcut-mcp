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
    self.width = 0
    self.height = 0
    return self
end

function SeekModeScript:constructor()

end

local function calcGaussianWeight(radius,sigma)
    local gaussianWeights = {}
    local arraySize = radius + 1
    local sumWeight = 0
    for i = 0, radius do 
        local weight = (1.0 / math.sqrt(2.0 * math.pi * math.pow(sigma, 2.0))) * 
        math.exp(-math.pow(i, 2.0) / (2.0 * math.pow(sigma, 2.0)));
        gaussianWeights[i+1] = weight
        if (i == 0) then
            sumWeight = sumWeight +  weight
        else
            sumWeight = sumWeight + 2.0 * weight
        end
    end    

    for i = 0,radius do
        local oldValue = gaussianWeights[i+1]
        local newWeight = oldValue / sumWeight
        gaussianWeights[i+1] = newWeight
    end   
    return gaussianWeights
end

function SeekModeScript:onUpdate(comp, detalTime)
    ---2787038086085111358-79500442448962578038740474249214672607
    -- local props = comp.entity:getComponent("ScriptComponent").properties
    -- if props:has("curTime") then
    --     self:seekToTime(comp, props:get("curTime") - self.startTime)
    -- end
    ---161275440519917640567922740006313600218740474249214672607
    self:seekToTime(comp, self.curTime - self.startTime)
end

function SeekModeScript:onStart(comp)
    self.EASpeed = 1.0
    self.pass0Material = comp.entity.scene:findEntityBy("Pass0"):getComponent("MeshRenderer").material
    self.pass1Material = comp.entity.scene:findEntityBy("Pass1"):getComponent("MeshRenderer").material
    self.pass2Material = comp.entity:getComponent("MeshRenderer").material

    -- calculate standard gaussian weights
    local radius = 4
    local sigma = 2.5 --2.5
    local standardGaussianWeights = calcGaussianWeight(radius,sigma)
    local neighbourGaussianWeight = Amaz.Vector4f(standardGaussianWeights[2],standardGaussianWeights[3],standardGaussianWeights[4],standardGaussianWeights[5])
    self.pass0Material:setFloat("centerGaussianWeight",standardGaussianWeights[1])
    self.pass0Material:setVec4("neighbourGaussianWeight",neighbourGaussianWeight)
    self.pass1Material:setFloat("centerGaussianWeight", standardGaussianWeights[1])
    self.pass1Material:setVec4("neighbourGaussianWeight",neighbourGaussianWeight)
end

function SeekModeScript:seekToTime(comp, time)


    local w = Amaz.BuiltinObject:getInputTextureWidth()
    local h = Amaz.BuiltinObject:getInputTextureHeight()
    -- if w ~= self.width or h ~= self.height then
    --     self.width = w
    --     self.height = h
    --     -- self.pass0Material:setInt("inputWidth", self.width)
    --     -- self.pass0Material:setInt("inputHeight", self.height)
    -- end
    self.pass2Material:setFloat("elapsedTime", time * self.EASpeed)
    local aspectRatio = h/w
    self.pass1Material:setFloat("inputAspectRatio", aspectRatio)
end




function SeekModeScript:onEvent(sys, event)
    --speed【0，0.5，1】【0.5，1，1.5】
    if "effects_adjust_speed" == event.args:get(0) then
        local intensity = event.args:get(1)
        self.EASpeed = 1.5*intensity+0.5
    end
end


exports.SeekModeScript = SeekModeScript
return exports
