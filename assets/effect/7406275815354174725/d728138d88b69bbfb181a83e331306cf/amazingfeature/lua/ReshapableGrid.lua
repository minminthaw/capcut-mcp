
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
    self.bottomY = 0.202
    self.upY = 0.448
    self.intensityUpdated = false
    self.domainUpdated = true
end

function ReshapableGrid:start(comp)
    self.grid = comp.entity:getComponent("ReshapableGridRenderer")
    self.grid.reshapeType = 0
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
    if self.intensityUpdated then
        self.intensityUpdated = false
        self.grid.intensity = self.intensity
    end
    if self.domainUpdated then
        self.domainUpdated = false
        self.grid.stretchBottomY = self.bottomY
        self.grid.stretchUpY = self.upY
        -- stretch/shrink diffs' default values are not synced with Xingtu properly
        -- (which is relative to the input picture instead of stretch domain).
        -- As a result, conversion is needed
        local stretchDomainHeight = self.upY - self.bottomY
        local stretchHeightDiff = 0.05 -- maximum 5% of input height can be stretched
        local shrinkHeightDiff = 0.02 -- maximum 2% of input height can be shrinked
        stretchHeightDiff = stretchHeightDiff / stretchDomainHeight -- relative to stretch domain height
        shrinkHeightDiff = shrinkHeightDiff / stretchDomainHeight -- relative to stretch domain height
        shrinkHeightDiff = math.min(0.5, shrinkHeightDiff) -- should not shrink by more than 50%
        self.grid.stretchHeightDiff = stretchHeightDiff
        self.grid.shrinkHeightDiff = shrinkHeightDiff
        -- TODO: force reinit grid to get around error
        self.grid.cellHorizontal = 250
        self.grid.cellVertical = 250
    end
end

function ReshapableGrid:onEvent(sys, event)
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        local eventName = event.args:get(0)
        if eventName == "effects_adjust_intensity" then
            local intensity = event.args:get(1)
            -- Amaz.LOGE("AE_LUA_TAG", "[ReshapeDebug] got parameter `intensity`, value = "..tostring(intensity))
            if intensity ~= self.intensity then
                self.intensity = intensity
                self.intensityUpdated = true
            end
        elseif eventName == "upper" then
            local upY = event.args:get(1)
            -- Amaz.LOGE("AE_LUA_TAG", "[ReshapeDebug] got parameter `upper`, value = "..tostring(upY))
            if upY ~= self.upY then
                self.upY = upY
                self.domainUpdated = true
            end
        elseif eventName == "bottom" then
            local bottomY = event.args:get(1)
            -- Amaz.LOGE("AE_LUA_TAG", "[ReshapeDebug] got parameter `bottom`, value = "..tostring(bottomY))
            if bottomY ~= self.bottomY then
                self.bottomY = bottomY
                self.domainUpdated = true
            end
        end
    end
end

exports.ReshapableGrid = ReshapableGrid
return exports
