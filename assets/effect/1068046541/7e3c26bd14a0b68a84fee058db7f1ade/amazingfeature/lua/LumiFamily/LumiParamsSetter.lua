local LumiParamsSetter = {}
LumiParamsSetter.__index = LumiParamsSetter

function LumiParamsSetter.new(ae_tools)
    local self = setmetatable({}, LumiParamsSetter)
    self.ae_tools = ae_tools
    return self
end

local function clamp(val, min, max)
    return math.max(math.min(val, max), min)
end

function LumiParamsSetter:onEvent(lumi_obj, event)
    if lumi_obj == nil or event == nil then return end

    if event.type == Amaz.AppEventType.SetEffectIntensity then
        local key = event.args:get(0)
        local value = event.args:get(1)

        if key == "colorA" or key == "colorB" then
            local color = lumi_obj:getEffectAttr(key)
            if color then
                color.r = value:get(0) / 255.0
                color.g = value:get(1) / 255.0
                color.b = value:get(2) / 255.0
                lumi_obj:setEffectAttr(key, color)
            end
        else
            lumi_obj:setEffectAttr(key, value)
        end
    end
end

function LumiParamsSetter:updateKeyFrameData(lumi_obj, startTime, endTime, curTime)
    if lumi_obj == nil then return end
    if self.ae_tools == nil then return end

    -- TODO update keyframe data
end

return LumiParamsSetter
