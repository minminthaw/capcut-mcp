local function Log (fmt, ...)
    Amaz.LOGW("jorgen", string.format(fmt, ...))
end
local function clamp (value, min, max)
    return math.min(math.max(min, value), max)
end
local function mix (x, y, a)
    return x + (y - x) * a
end
local function step (edge0, edge1, value)
    return math.min(math.max(0, (value - edge0) / (edge1 - edge0)), 1)
end
local function smoothstep (edge0, edge1, value)
    local t = math.min(math.max(0, (value - edge0) / (edge1 - edge0)), 1)
    return t * t * (3 - t - t)
end
local function mirror (range, value)
    local round = value / range
    local roundF = 1 - math.abs(round % 2 - 1)
    local roundI = math.floor(round)
    return roundF, roundI
end


local SeekModeScript = SeekModeScript or {}
SeekModeScript.__index = SeekModeScript
local DISABLE_MAKEUP_INTENSITY = 0.0


function SeekModeScript:create (data, scene)
    self.face1 = scene:findEntityBy("face1"):getComponent("MeshRenderer").material
    self.face2 = scene:findEntityBy("face2"):getComponent("MeshRenderer").material
    self.face3 = scene:findEntityBy("face3"):getComponent("MeshRenderer").material
    self.filter = scene:findEntityBy("SkinSeg_main"):getComponent("MeshRenderer").material
    self.rt0 = scene.assetMgr:SyncLoad("rt/midTex.rt")
end

function SeekModeScript:layout (w, h)
    self.rt0.width = w
    self.rt0.height = h
end

function SeekModeScript:update (data, elapsed, duration)
    self.face1:setFloat("intensity", DISABLE_MAKEUP_INTENSITY)
    self.face2:setFloat("intensity", DISABLE_MAKEUP_INTENSITY)
    self.face3:setFloat("intensity", DISABLE_MAKEUP_INTENSITY)
    self.filter:setFloat("intensity", data.intensity)
end



function SeekModeScript.new (construct, ...)
    local self = setmetatable({}, SeekModeScript)
    self.w = 0
    self.h = 0
    self.startTime = 0.0
    self.endTime = 10.0
    self.curTime = 0.0
    self.data = {
        intensity = 1
    }
    return self
end

function SeekModeScript:onStart (comp)
    self.w = Amaz.BuiltinObject.getInputTextureWidth()
    self.h = Amaz.BuiltinObject.getInputTextureHeight()
    self:create(self.data, comp.entity.scene)
    self:layout(self.w, self.h)
    self:update(self.data, 0, 1)
end

function SeekModeScript:onUpdate (comp, dt)
    local w = Amaz.BuiltinObject.getInputTextureWidth()
    local h = Amaz.BuiltinObject.getInputTextureHeight()
    if w ~= self.w or h ~= self.h then
        self.w = w
        self.h = h
        self:layout(w, h)
    end
    local t = self.curTime - self.startTime
    local T = self.endTime - self.startTime
    self:update(self.data, t, T)
    if Editor then
        self.curTime = self.curTime + dt
    end
end

function SeekModeScript:onEvent (comp, event)
    local data = event.args:get(0)
    if data == "intensity" then
        self.data.intensity = event.args:get(1) * 0.8
        return
    end
    ---#ifdef DEV
--//    if event.type == Amaz.EventType.TOUCH then
--//        if data.type == Amaz.TouchType.TOUCH_BEGAN or data.type == Amaz.TouchType.TOUCH_MOVED then
--//            self.data.intensity = data.x
--//        end
--//    end
    ---#endif
end


local exports = exports or {}
exports.SeekModeScript = SeekModeScript
return exports
