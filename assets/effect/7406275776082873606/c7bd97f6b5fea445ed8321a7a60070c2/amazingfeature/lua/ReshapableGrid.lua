
local exports = exports or {}
local ReshapableGrid = ReshapableGrid or {}
ReshapableGrid.__index = ReshapableGrid

function ReshapableGrid.new(construct, ...)
    local self = setmetatable({}, ReshapableGrid)
    if construct and ReshapableGrid.constructor then ReshapableGrid.constructor(self, ...) end
    return self
end

function ReshapableGrid:constructor()
    self.startTime = 0.0
    self.endTime = 3.0
    self.curTime = 0.0
    self.width = 0
    self.height = 0
    self.intensity = 0.0
    self.circleX = 0.495
    self.circleY = 0.64
    self.circleR = 0.12
    self.intensityUpdated = false
    self.domainUpdated = true
end

function ReshapableGrid:start(comp)
    self.grid = comp.entity:getComponent("ReshapableGridRenderer")
    self.grid.reshapeType = 2
end

function ReshapableGrid:onUpdate(comp, detalTime)
    if self.first == nil then
        self.first = true
        self:start(comp)
    end
    self:seekToTime(comp, self.curTime - self.startTime)
end

function ReshapableGrid:seekToTime(comp, time)
    local w = Amaz.BuiltinObject:getInputTextureWidth()
    local h = Amaz.BuiltinObject:getInputTextureHeight()
    if w ~= self.width or h ~= self.height then
        self.width = w
        self.height = h
    end
    if self.domainUpdated then
        self.domainUpdated = false
        local rightX = self.circleX
        local leftX = self.circleX
        local upY = self.circleY
        local bottomY = self.circleY
        -- Circle region radius is relative to the shorter of width/height
        if (self.width < self.height) then
            rightX = rightX + self.circleR
            leftX = leftX - self.circleR
            local scaledR = self.circleR * self.width / self.height
            upY = upY + scaledR
            bottomY = bottomY - scaledR
        else
            upY = upY + self.circleR
            bottomY = bottomY - self.circleR
            local scaledR = self.circleR * self.height / self.width
            rightX = rightX + scaledR
            leftX = leftX - scaledR
        end
        self.grid.reshapeQuadPointA = Amaz.Vector2f(rightX, upY)
        self.grid.reshapeQuadPointB = Amaz.Vector2f(rightX, bottomY)
        self.grid.reshapeQuadPointC = Amaz.Vector2f(leftX, upY)
        self.grid.reshapeQuadPointD = Amaz.Vector2f(leftX, bottomY)
        -- TODO: force reinit grid to get around error
        self.grid.cellHorizontal = 250
        self.grid.cellVertical = 250
    end
    if self.intensityUpdated then
        self.intensityUpdated = false
        self.grid.intensity = self.intensity
    end
end

function ReshapableGrid:onEvent(sys, event)
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        local eventName = event.args:get(0)
        if eventName == "effects_adjust_intensity" then
            local intensity = event.args:get(1)
            if intensity ~= self.intensity then
                self.intensity = intensity
                self.intensityUpdated = true
            end
        elseif eventName == "x" then
            local circleX = event.args:get(1)
            if circleX ~= self.circleX then
                self.circleX = circleX
                self.domainUpdated = true
            end
        elseif eventName == "y" then
            local circleY = event.args:get(1)
            if circleY ~= self.circleY then
                self.circleY = circleY
                self.domainUpdated = true
            end
        elseif eventName == "r" then
            local circleR = event.args:get(1)
            if circleR ~= self.circleR then
                self.circleR = circleR
                self.domainUpdated = true
            end
        end
    end
end

exports.ReshapableGrid = ReshapableGrid
return exports
