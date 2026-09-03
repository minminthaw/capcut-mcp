local exports = exports or {}
local slimbody = slimbody or {}
slimbody.__index = slimbody

local function printSlimbodyLog(...)
    local arg = { ... }
    local msg = "huang_jin_bi_li:"
    for k, v in pairs(arg) do
        msg = msg .. tostring(v) .. " "
    end
    Amaz.LOGE("slimbody-log", msg)
end
-- input
local BODY_ID = "id"
local BODY_ADJUST_INTENSITY = "proportion_correct_intensity"
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
    SmallHead = {
        -- 小头
        type = Amaz.NsItemType.SMALL_HEAD,
        --- ori 0.2, 负向 35, 0.2 * 0.35（02.28）
        min_ratio = -0.07,
        --- ori 0.2, 正向 50, 0.2 * 0.5（02.28）
        max_ratio = 0.1
    },
    LongLeg = {
        type = Amaz.NsItemType.STRETCH_LEG,
        --- ori 0.35, 负向 0 , 0.35 * 0
        min_ratio = 0.0,
        --- ori 0.35, 正向 20, 0.35 * 0.2 （02.28）
        max_ratio = 0.07
    },
    SwanNeck = {
        -- 天鹅颈
        type = Amaz.NsItemType.SWAN_NECK,
        --- ori 0.55, 负向 40, 0.55 * 0.4
        min_ratio = -0.22,
        --- ori 0.55, 正向 80, 0.55 * 0.8 （02.28）
        max_ratio = 0.44
    },
    SlimBody = {
        type = Amaz.NsItemType.SLIM_BODY,
        --- ori 0.6, 负向 35, 0.6 * 0.35 (02.28)
        min_ratio = -0.21,
        --- ori 0.6, 正向 35, 0.6 * 0.35 (02.28）
        max_ratio = 0.21
    },
}
local SlimbodySourceVideoType = {
    NORMAL = 0,
    IMAGE = 1
}
function slimbody.new(construct, ...)
    local self = setmetatable({}, slimbody)
    self.inputWidth = -1
    self.inputHeight = -1
    self.currTime = -1
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
    curScriptSystem:addEventType(Amaz.AppEventType.COMPAT_BEF)
    

    self.scriptProps = comp.properties
    local segmentId = self.scriptProps:get(SEGMENT_ID)
    if segmentId ~= nil then
        self.logTag = string.format('%s %s', LOG_TAG, segmentId)
    else
        self.logTag = LOG_TAG
    end

    self.slimbodyEntity = comp.entity
    self.slimbodyComp = self.slimbodyEntity:getComponent("NsComponent")

    -- 初始化的时候设定策略版本, effect 1860 版本支持
    self.slimbodyComp.xtStrategy = Amaz.NsAutoBodyStrategy.ORIGIN_JY
    self.slimbodyComp.inputType = Amaz.NsInputType.VEDIO
    -- 设置平滑开关
    local items = self.slimbodyComp.items
    local itemsCount = items:size()
    for i = 0, itemsCount - 1 do
        local item = items:get(i)
        item.needSmooth = true
        items:set(i, item)
    end
    self.slimbodyComp.items = items
end

function slimbody:onUpdate(comp, deltaTime)

    -- 设置输入类型
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
    if event.type == Amaz.AppEventType.SetEffectIntensity or event.type == Amaz.AppEventType.COMPAT_BEF  then
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
    printSlimbodyLog(self.logTag .. " [cxy debug][handleIntensityEvent] inputKey: " .. tostring(inputKey))
    if inputKey == RESET_PARAMS then
        self.intensityDirty = true
        for key, _ in pairs(self.intensityMap) do
            self.intensityMap[key] = 0
        end
    elseif inputKey == VIDEO_FLIP_X or inputKey == VIDEO_FLIP_Y then
        self.inputWidth = -1
        self.inputHeight = -1
    elseif inputKey == BODY_ADJUST_INTENSITY then
        local inputIntensity = 0
        local inputMap = inputValue:get(0)
        if inputMap then
                inputIntensity = inputMap:get("intensity")
        end
        printSlimbodyLog(self.logTag .. " [cxy debug][handleIntensityEvent] inputValue: " .. tostring(inputIntensity))
        for key, _ in pairs(self.intensityMap) do
            self.intensityMap[key] = inputIntensity
            self.intensityDirty = true
        end
    end
end

exports.slimbody = slimbody
return exports