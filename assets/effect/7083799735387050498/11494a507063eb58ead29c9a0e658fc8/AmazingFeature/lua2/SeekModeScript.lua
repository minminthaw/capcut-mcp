--@input float curTime = 0.0{"widget":"slider","min":0,"max":10}

-- order: 1-1, 3-4, 4-3, 9-16, 16-9, 2.35-1

local leftupPos     = {{115.100, 114.700},  {143.100, 101.100},  {114.00, 95.800}, {114.00, -2.300},   {99.100, 121.400},    {134.400, -56.400}}

local leftupScale       = {0.800, 0.800, 0.600, 0.700, 0.500, 0.300}


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
    self.ratioList={1.000,0.7500,1.3333,0.5625,1.77777, 2.35}
    return self
end

function SeekModeScript:constructor()

end

function SeekModeScript:onUpdate(comp, detalTime)
    --ceshiyong
    -- local props = comp.entity:getComponent("ScriptComponent").properties
    -- if props:has("curTime") then
    --     self:seekToTime(comp, props:get("curTime"))
    -- end
    --shijiyong
    -- self.curTime= self.curTime+detalTime
    self:seekToTime(comp, self.curTime - self.startTime)
end

function SeekModeScript:onStart(comp)
    self.ani1 = comp.entity:getComponent("AnimSeqComponent")
    self.passQMaterial = comp.entity:getComponent("MeshRenderer").material
end

function SeekModeScript:seekToTime(comp, time)
    if self.first == nil then
        self.first = true
        -- self:start(comp)
    end
    self.ani1:seekToTime(time)

    local w = Amaz.BuiltinObject:getOutputTextureWidth()
    local h = Amaz.BuiltinObject:getOutputTextureHeight()
    if w ~= self.width or h ~= self.height then
        self.width = w
        self.height = h
    
        self.passQMaterial:setInt("baseTexWidth",self.width)
        self.passQMaterial:setInt("baseTexHeight",self.height)
        local lastflag = 5
        local currentRatio = w / h
        local min = 100
        local flag = 1
        for i = 1, #self.ratioList do
            local result = math.abs(currentRatio - self.ratioList[i])
            if (result < min) then
                min = result
                flag = i
            end
        end
        lastflag = flag


        self.passQMaterial:setFloat("leftupScale",       leftupScale[lastflag])
        self.passQMaterial:setVec2("leftupPosOffset", Amaz.Vector2f(leftupPos[lastflag][1], leftupPos[lastflag][2]))
     
    end
end

exports.SeekModeScript = SeekModeScript
return exports
