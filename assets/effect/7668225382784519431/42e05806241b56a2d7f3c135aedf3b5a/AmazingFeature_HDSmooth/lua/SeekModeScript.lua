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
    self.rt1 = scene.assetMgr:SyncLoad("rt/rt1.rt")
    self.rt2 = scene.assetMgr:SyncLoad("rt/rt2.rt")
    self.rt3 = scene.assetMgr:SyncLoad("rt/rt3.rt")
    self.rt4 = scene.assetMgr:SyncLoad("rt/rt4.rt")
    self.mask = scene:findEntityBy("mask"):getComponent("MeshRenderer").material
    self.maskPost = scene:findEntityBy("maskPost"):getComponent("MeshRenderer").material
    self.blur1 = scene:findEntityBy("blur1"):getComponent("MeshRenderer").material
    self.blur2 = scene:findEntityBy("blur2"):getComponent("MeshRenderer").material
    self.blend1 = scene:findEntityBy("blend1"):getComponent("MeshRenderer").material
    self.blur3 = scene:findEntityBy("blur3"):getComponent("MeshRenderer").material
    self.blur4 = scene:findEntityBy("blur4"):getComponent("MeshRenderer").material
    self.blend2 = scene:findEntityBy("blend2"):getComponent("MeshRenderer").material
    self.sharp1 = scene:findEntityBy("sharp1"):getComponent("MeshRenderer").material
    self.sharp2 = scene:findEntityBy("sharp2"):getComponent("MeshRenderer").material
    self.sharp3 = scene:findEntityBy("sharp3"):getComponent("MeshRenderer").material
    self.sharp4 = scene:findEntityBy("sharp4"):getComponent("MeshRenderer").material
end

function SeekModeScript:layout (w, h)
    local w1 = w * 0.45
    local h1 = h * 0.45
    self.rts1.width = w1
    self.rts1.height = h1
    self.rts2.width = w1
    self.rts2.height = h1
    self.rts3.width = w1
    self.rts3.height = h1
    self.rt1.width = w
    self.rt1.height = h
    self.rt2.width = w
    self.rt2.height = h
    self.rt3.width = w
    self.rt3.height = h
    self.rt4.width = w
    self.rt4.height = h

    local s = math.min(w, h) / 720
    w = w / s
    h = h / s
    w1 = w1 / s
    h1 = h1 / s

    local _w1 = 1 / w1
    local _h1 = 1 / h1
    self.blur1:setFloat("texBlurWidthOffset", _w1)
    self.blur2:setFloat("texBlurHeightOffset", _h1)
    self.blur3:setFloat("widthOffset", _w1)
    self.blur3:setFloat("heightOffset", _h1)
    self.blur4:setFloat("widthOffset", _w1)
    self.blur4:setFloat("heightOffset", _h1)
    self.blur4:setFloat("widthOffset", _w1)
    self.blur4:setFloat("heightOffset", _h1)
    self.blur4:setFloat("widthOffset", _w1)
    self.blur4:setFloat("heightOffset", _h1)
    self.sharp1:setFloat("widthOffset", _w1)
    self.sharp1:setFloat("heightOffset", _h1)
    self.sharp3:setFloat("widthOffset", _w1)
    self.sharp3:setFloat("heightOffset", _h1)
end

function SeekModeScript:update (data, elapsed, duration)
    self.blend2:setFloat("smoothIntensity", data.intensity)
    self.sharp4:setFloat("sharpenAlpha", (0.32 + 0.42 * data.intensity * 0.25)*0.7*0.8)
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
        self.data.intensity = event.args:get(1)*0.8*0.5
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
