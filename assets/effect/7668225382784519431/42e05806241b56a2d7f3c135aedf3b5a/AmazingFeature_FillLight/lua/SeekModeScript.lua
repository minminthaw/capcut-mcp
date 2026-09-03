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


function SeekModeScript:create (data, scene)
    self.rts1 = scene.assetMgr:SyncLoad("rt/rts1.rt")
    self.rts2 = scene.assetMgr:SyncLoad("rt/rts2.rt")
    self.rts3 = scene.assetMgr:SyncLoad("rt/rts3.rt")
    self.mask = scene:findEntityBy("mask"):getComponent("MeshRenderer").material
    self.normal = scene:findEntityBy("normal"):getComponent("MeshRenderer").material
    self.blur1 = scene:findEntityBy("blur1"):getComponent("MeshRenderer").material
    self.blur2 = scene:findEntityBy("blur2"):getComponent("MeshRenderer").material
    self.mean1 = scene:findEntityBy("mean1"):getComponent("MeshRenderer").material
    self.mean2 = scene:findEntityBy("mean2"):getComponent("MeshRenderer").material
    self.light = scene:findEntityBy("light"):getComponent("MeshRenderer").material
end

function SeekModeScript:layout (w, h)
    local w1 = w * 0.45
    local h1 = h * 0.45
    local w2 = w * 0.5
    local h2 = h * 0.5
    self.rts1.width = w1
    self.rts1.height = h1
    self.rts2.width = w2
    self.rts2.height = h2
    self.rts3.width = w2
    self.rts3.height = h2

    local s = math.min(w, h) / 720
    w = w / s
    h = h / s
    w1 = w1 / s
    h1 = h1 / s
    w2 = w2 / s
    h2 = h2 / s


    local _w2 = 1 / w2
    local _h2 = 1 / h2
    self.blur1:setFloat("texelHeightOffset", _h2)
    self.blur2:setFloat("texelWidthOffset", _w2)
    self.mean1:setFloat("texelHeightOffset", _h2)
    self.mean2:setFloat("texelWidthOffset", _w2)
end

function SeekModeScript:update (data, elapsed, duration)
    self.light:setFloat("shiness", -14.0 * (data.intensity * 0.9*0.8) + 15.0)
    self.light:setFloat("light_intensity", data.intensity)

    local res = Amaz.Algorithm.getAEAlgorithmResult()
    local normal = res:getSceneNormalInfo()
    if normal then
        self.normal:getTex("inputImageTexture"):storage(normal.mask)
    end
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
    local scene = comp.entity.scene
    local order = 0
    local layer = 1
    local function setLayerRecursion (node)
        node.entity.layer = order
        for i = 0, node.children:size() - 1 do
            setLayerRecursion(node.children:get(i))
        end
    end
    local nodes = scene:findEntityBy("@Pipeline"):getComponent("Transform").children
    for i = 0, nodes:size() - 1 do
        local node = nodes:get(i)
        local entity = node.entity
        local camera = entity:getComponent("Camera")
        if camera then
            order = order + 1
            layer = layer * 2
            entity.layer = 0
            camera.renderOrder = order
            camera.layerVisibleMask = Amaz.DynamicBitset.new(64, string.format("%#x", layer))
        end
        setLayerRecursion(node)
    end
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
        self.data.intensity = event.args:get(1)
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
