local exports = exports or {}
local slimbody = slimbody or {}
slimbody.__index = slimbody

-- input
local BODY_ID = "id"
local BODY_ADJUST_INTENSITY = "intensity"
local RESET_PARAMS = "reset_params"

-- runtime
local ABS = math.abs
local EPSC_MIN = 0.01
local EPSC_MAX = 0.1
local CURRENT_TIME = "curTime"
local VIDEO_FLIP_X = "video_flip_x"
local VIDEO_FLIP_Y = "video_flip_y"
local SEGMENT_ID = "segmentId"
local LOG_TAG = "AE_EFFECT_TAG slimbody.lua"

local SlimBodyMap = {
    body_adjust_SlimBreast = {
        type = Amaz.NsItemType.SLIM_BREAST,
        min_ratio = 0.6,
        max_ratio = 1.1
    },
    body_adjust_SlimHip = {
        type = Amaz.NsItemType.SLIM_HIP,
        min_ratio = 0.84,
        max_ratio = 1.4
    },
    body_adjust_SwanNeck = {
        type = Amaz.NsItemType.SWAN_NECK,
        min_ratio = 0.0,
        max_ratio = 0.55
    },
    body_adjust_SlimArm = {
        type = Amaz.NsItemType.SLIM_ARM,
        min_ratio = 0.0,
        max_ratio = 1.0
    },
    body_adjust_WidenShoulderTest = {
        type = Amaz.NsItemType.WIDEN_SHOULDER,
        min_ratio = 2.0,
        max_ratio = 2.0
    },
    body_adjust_OrthoShoulder = {
        type = Amaz.NsItemType.ORTHO_SHOULDER,
        min_ratio = 1.0,
        max_ratio = 1.0
    },
    body_adjust_SlimBody = {
        type = Amaz.NsItemType.SLIM_BODY,
        min_ratio = 0.0,
        max_ratio = 0.3
    },
    body_adjust_SlimWaist = {
        type = Amaz.NsItemType.SLIM_WAIST,
        min_ratio = 0.0,
        max_ratio = 0.25
    },
    body_adjust_StretchLeg = {
        type = Amaz.NsItemType.STRETCH_LEG,
        min_ratio = 0.0,
        max_ratio = 0.35
    },
    body_adjust_SmallHead = {
        type = Amaz.NsItemType.SMALL_HEAD,
        min_ratio = 0.0,
        max_ratio = 0.2
    },
    body_adjust_SlimLeg = {
        type = Amaz.NsItemType.SLIM_LEG,
        min_ratio = 0.0,
        max_ratio = 1.0
    },
}

function slimbody.new(construct, ...)
    local self = setmetatable({}, slimbody)

    self.currTime = -1
    self.inputWidth = -1
    self.inputHeight = -1
    self.intensityDirty = true
    self.intensityMap = {}
    for key, _ in pairs(SlimBodyMap) do
        self.intensityMap[key] = 0
    end

    return self
end

function slimbody:onStart(comp, script)
    local scene = comp.entity.scene
    local curScriptSystem = scene:getSystem("ScriptSystem")
    curScriptSystem:clearAllEventType()
    curScriptSystem:addEventType(Amaz.AppEventType.SetEffectIntensity)

    self.scriptProps = comp.properties
    local segmentId = self.scriptProps:get(SEGMENT_ID)
    if segmentId ~= nil then
        self.logTag = string.format('%s %s', LOG_TAG, segmentId)
    else
        self.logTag = LOG_TAG
    end

    self.slimbodyEntity = comp.entity
    self.slimbodyComp = self.slimbodyEntity:getComponent("NsComponent")
end

function slimbody:onUpdate(comp, deltaTime)
    local currTime = self.scriptProps:get(CURRENT_TIME)
    local deltaTime = ABS(currTime - self.currTime)
    self.currTime = currTime

    local currWidth = Amaz.BuiltinObject:getInputTextureWidth()
    local currHeight = Amaz.BuiltinObject:getInputTextureHeight()
    local deltaWidth = ABS(currWidth - self.inputWidth)
    local deltaHeight = ABS(currHeight - self.inputHeight)
    self.inputWidth = currWidth
    self.inputHeight = currHeight

    if deltaTime > EPSC_MAX or deltaWidth > 0 or deltaHeight > 0 then
        self.slimbodyComp.inputType = Amaz.NsInputType.IMAGE
    elseif deltaTime > EPSC_MIN then
        self.slimbodyComp.inputType = Amaz.NsInputType.VIDEO
    else
        self.slimbodyComp.inputType = Amaz.NsInputType.NOCHANGE
    end

    if self.intensityDirty then
        self:updateItems(comp, deltaTime)
        self.intensityDirty = false
    end
end

function slimbody:onEvent(comp, event)
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        self:handleIntensityEvent(comp, event.args)
    end
end

function slimbody:updateItems(comp, deltaTime)
    local items = self.slimbodyComp.items
    local itemsCount = items:size()
    for key, info in pairs(SlimBodyMap) do
        local itemType = info.type
        local itemIntensity = self.intensityMap[key]
        for i = 0, itemsCount - 1 do
            local item = items:get(i)
            if item.type == itemType then
                if itemIntensity > 0 then
                    item.intensity = info.max_ratio * itemIntensity
                else
                    item.intensity = info.min_ratio * itemIntensity
                end
                items:set(i, item)
            end
        end
    end
    self.slimbodyComp.items = items
end

function slimbody:handleIntensityEvent(comp, args)
    local inputKey = args:get(0)
    local inputValue = args:get(1)
    Amaz.LOGS(self.logTag, "handleIntensityEvent set " .. inputKey)

    if inputKey == RESET_PARAMS then
        self.currTime = -1
        self.intensityDirty = true
        for key, _ in pairs(self.intensityMap) do
            self.intensityMap[key] = 0
        end
    elseif inputKey == VIDEO_FLIP_X or inputKey == VIDEO_FLIP_Y then
        self.inputWidth = -1
        self.inputHeight = -1
    elseif self.intensityMap[inputKey] ~= nil then
        local inputMap = inputValue:get(0)
        if inputMap then
            local inputIntensity = inputMap:get(BODY_ADJUST_INTENSITY)
            self.intensityMap[inputKey] = inputIntensity
        end
        self.intensityDirty = true
    end
end

exports.slimbody = slimbody
return exports