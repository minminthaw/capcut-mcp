
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
    self.rectX = 0.504
    self.rectY = 0.422
    self.rectWidth = 0.284
    self.rectHeight = 0.308
    self.rectRotation = 0.0;
    self.intensityUpdated = false
    self.domainUpdated = true
end

function ReshapableGrid:start(comp)
    self.grid = comp.entity:getComponent("ReshapableGridRenderer")
    self.grid.reshapeType = 1
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
        local rotationRad = math.rad(self.rectRotation)
        local sinRot = math.sin(rotationRad)
        local cosRot = math.cos(rotationRad)

        local halfWidthPixels = self.rectWidth / 2.0 * self.width
        local halfHeightPixels = self.rectHeight / 2.0 * self.height
        local centerXPixels = self.rectX * self.width
        local centerYPixels = self.rectY * self.height
        local xcos = halfWidthPixels * cosRot
        local xsin = halfWidthPixels * sinRot
        local ycos = halfHeightPixels * cosRot
        local ysin = halfHeightPixels * sinRot

        local AX = (centerXPixels + xcos + ysin) / self.width
        local AY = (centerYPixels - xsin + ycos) / self.height
        local BX = (centerXPixels + xcos - ysin) / self.width
        local BY = (centerYPixels - xsin - ycos) / self.height
        local CX = (centerXPixels - xcos + ysin) / self.width
        local CY = (centerYPixels + xsin + ycos) / self.height
        local DX = (centerXPixels - xcos - ysin) / self.width
        local DY = (centerYPixels + xsin - ycos) / self.height
        
        self.grid.reshapeQuadPointA = Amaz.Vector2f(AX, AY)
        self.grid.reshapeQuadPointB = Amaz.Vector2f(BX, BY)
        self.grid.reshapeQuadPointC = Amaz.Vector2f(CX, CY)
        self.grid.reshapeQuadPointD = Amaz.Vector2f(DX, DY)

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
            local rectX = event.args:get(1)
            if rectX ~= self.rectX then
                self.rectX = rectX
                self.domainUpdated = true
            end
        elseif eventName == "y" then
            local rectY = event.args:get(1)
            if rectY ~= self.rectY then
                self.rectY = rectY
                self.domainUpdated = true
            end
        elseif eventName == "width" then
            local rectWidth = event.args:get(1)
            if rectWidth ~= self.rectWidth then
                self.rectWidth = rectWidth
                self.domainUpdated = true
            end
        elseif eventName == "height" then
            local rectHeight = event.args:get(1)
            if rectHeight ~= self.rectHeight then
                self.rectHeight = rectHeight
                self.domainUpdated = true
            end
        elseif eventName == "rotation" then
            local rectRotation = event.args:get(1)
            if rectRotation ~= self.rectRotation then
                self.rectRotation = rectRotation
                self.domainUpdated = true
            end
        end
    end
end

exports.ReshapableGrid = ReshapableGrid
return exports
