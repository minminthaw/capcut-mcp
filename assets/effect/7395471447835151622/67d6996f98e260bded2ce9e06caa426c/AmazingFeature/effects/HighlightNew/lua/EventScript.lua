-- Use requireFile to include other lua modules within the same folder
function requireFile(comp, fileName)
    local path = comp.assetMgr.rootDir
    local modulePath = path.."lua/"
    package.path = package.path..";"..modulePath.."?.lua"
    return require(fileName)
end

local exports = exports or {}
local EventScript = EventScript or {}

---@class EventScript : ScriptComponent
---@field radius number
EventScript.__index = EventScript

function EventScript.new()
    local self = {}
    setmetatable(self, EventScript)
    self.transform = {}
    self.radius = 0.1
    self.angleOffset = 0.0
    self.number = 10
    self.LightIntensity = 1.0
    self.LightLength = 1.0
    self.HighlightRange = 0.1
    self.motionBlurMat = {}
    self.LightAngle = 20
    self.width = 720
    self.height = 1280
    self.midRTList = {}
    return self
end

---@param comp Component
function EventScript:onStart(comp)
    self.hlMat = comp.entity:getComponent("MeshRenderer").material

    local w = Amaz.BuiltinObject:getInputTextureWidth()
    local h = Amaz.BuiltinObject:getInputTextureHeight()
    local theta = self.angleOffset * math.pi / 180.0
    for i = 0, self.number - 1 do 
        local ofs = Amaz.Vector2f(math.sin(theta) * self.radius, math.cos(theta) * self.radius * w / h)
        self.hlMat:setVec2("u_ofs"..i, ofs)
        theta = theta + math.pi * 2 / self.number
    end
    self.lastRadius = self.radius
end

---@param comp Component
---@param deltaTime number
function EventScript:onUpdate(comp, deltaTime)

    local w = Amaz.BuiltinObject:getInputTextureWidth()
    local h = Amaz.BuiltinObject:getInputTextureHeight()
    if self.width ~= w or self.height ~= h or self.radius ~= self.lastRadius then
        self.lastRadius = self.radius
        self.width = w
        self.height = h
        local theta = self.angleOffset * math.pi / 180.0
        for i = 0, self.number - 1 do 
            local ofs = Amaz.Vector2f(math.sin(theta) * self.radius, math.cos(theta) * self.radius * w / h)
            self.hlMat:setVec2("u_ofs"..i, ofs)
            theta = theta + math.pi * 2 / self.number
            Amaz.LOGI("Qdy", ofs.x)
        end
        Amaz.LOGI("Qdy", self.radius)
    end
end


exports.EventScript = EventScript
return exports
