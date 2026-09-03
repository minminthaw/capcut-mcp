local exports = exports or {}
local graffiti_pen = graffiti_pen or {}
graffiti_pen.__index = graffiti_pen


local SELECTED_ENTITY_INDEX = "selectedEntityIndex"
local AE_EFFECT_TAG = 'AE_EFFECT_TAG graffiti_pen'

function graffiti_pen:new(construct, ...)
    local self = setmetatable({}, graffiti_pen)

    return self
end

function graffiti_pen:onStart(comp,sys)
    self.comp = comp
    self.pen_name = comp.entity.name
    self.entity = comp.entity
    self.brushCanvas = comp.entity:getComponent("Brush2DCanvas")
    self.brushlayer = comp.entity.scene:findEntityBy("GraffitiPen"):getComponent("Layer2DRenderer")

    local inputTex = comp.entity.scene:getInputTexture(Amaz.BuiltInTextureType.INPUT0)
    local resolution = Amaz.Vector2f(inputTex.width/2, inputTex.height/2)
    self.brushlayer.resolution = resolution

    self.logTag = AE_EFFECT_TAG
    self.scriptProps = comp.properties


    local tempLua = comp.entity.scene:findEntityBy("SeekModeScript"):getComponent("ScriptComponent")
    self.seekLua = Amaz.ScriptUtils.getLuaObj(tempLua:getScript())

end

function graffiti_pen:onTouchEvent(sys, event)

    local selectedEntityIndex = self.seekLua.selectedEntityIndex
    -- Amaz.LOGE(self.logTag, "onTouchEvent() selectedEntityIndex:".. tostring(selectedEntityIndex))   
    if selectedEntityIndex < 0 then
        return
    end

    local isTouchBegin  = false
    local isTouchMove   = false
    local isTouchEnd    = false
    local isTouchCancel = false

    local point = Amaz.Vector2f( 0, 0)
    if event.type == Amaz.EventType.TOUCH_MANIPULATE then
        local eventCode = event.args:get(0)
        if eventCode == 0 then
            isTouchBegin = true
        elseif eventCode == 4 then 
            isTouchMove = true
        elseif eventCode == 2 then
            isTouchEnd = true
        elseif eventCode == 3 then
            isTouchCancel = true
        end
        point = Amaz.Vector2f(event.args:get(1), event.args:get(2))
    end
    if event.type == Amaz.EventType.TOUCH then
        local touch = event.args:get(0)
        if touch.type == Amaz.TouchType.TOUCH_BEGAN then
            isTouchBegin = true
        elseif touch.type == Amaz.TouchType.TOUCH_MOVED then
            isTouchMove = true
        elseif touch.type == Amaz.TouchType.TOUCH_ENDED then
            isTouchEnd = true
        else
            Amaz.LOGD("AE_EFFECT_TAG", "onEvent() no valid touchEvent.")
            return
        end
        point = Amaz.Vector2f(touch.x, touch.y)
    end
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        local inputKey = event.args:get(0)
        local inputValue = event.args:get(1)
        if inputKey ~= "touch_begin" and inputKey ~= "touch_move" and inputKey ~= "touch_end" then
            return
        end

        if inputKey == "touch_begin" then
            isTouchBegin = true
        elseif inputKey == "touch_move" then
            isTouchMove = true
        elseif inputKey == "touch_end" then
            isTouchEnd = true
        end

        pt = cjson.decode(inputValue)
        point = Amaz.Vector2f(pt.x, pt.y)
    end

    if Amaz.Macros.EditorSDK then
        point.y =  (1.0 - point.y)
    end
    
    Amaz.LOGE(self.logTag, "graffiti: onTouchEvent() point: ".. tostring(point.x).. " ".. tostring(point.y))
    point.x = point.x * 2.0 - 1.0
    point.y = point.y * 2.0 - 1.0
 
    if self.brushCanvas == nil or self.brushCanvas.enabled == false then
        Amaz.LOGE(AE_EFFECT_TAG, self.pen_name .. " onTouchEvent() canvas is invalid or disabled.")
        return;
    end

    self:handleStrokeAdd(point, isTouchBegin, isTouchMove, isTouchEnd, isTouchCancel)
    if isTouchBegin then
        self:handleStrokeAdd(point, false, true, isTouchEnd, isTouchCancel)
    end 

end

function graffiti_pen:handleStrokeAdd(point, isTouchBegin, isTouchMove, isTouchEnd, isTouchCancel)
    if isTouchBegin then
        Amaz.LOGS(AE_EFFECT_TAG, "onTouchEvent() add stroke")
        local entity = self.entity.scene:createEntity("")
        entity:addComponent("Transform")
        entity:addComponent("ScriptComponent")
        self.brushStroke = entity:addComponent("Stroke2DRenderer")
        self.brushProcessor = entity:addComponent("Brush2DInputProcessor")
        entity:addComponent("Brush2DMeshGenerator")
        self.brushCanvas:add(self.brushStroke)
    end
    if self.brushStroke == nil or self.brushProcessor == nil then
        Amaz.LOGE(AE_EFFECT_TAG, self.pen_name .. " onTouchEvent() no active stroke in system.")
        return
    end
    if self.brushStroke.enabled and not self.brushStroke.finished and not isTouchCancel then
        self.brushStroke.dirtyFlag = Amaz.Brush2DDirtyFlag.Increase
        self.brushStroke.finished = isTouchEnd
        self.brushProcessor:addRawPoint(point, isTouchEnd)
    end
end

function graffiti_pen:onUpdate(sys, dt)
    
    if self.brushlayer == nil then
        Amaz.LOGE(AE_EFFECT_TAG, self.pen_name.. " onUpdate() no active layer in system.")
        return
    end
end

function graffiti_pen:onEvent(sys, event)

    if event.type == Amaz.EventType.TOUCH_MANIPULATE or event.type == Amaz.EventType.TOUCH then
        self:onTouchEvent(sys, event)
        return;
    end

    local inputKey = event.args:get(0)
    -- Amaz.LOGE(self.logTag, "onEvent() inputKey:".. (inputKey))
    if event.type == Amaz.AppEventType.SetEffectIntensity and (inputKey == "touch_begin" or inputKey == "touch_move" or inputKey == "touch_end") then
        self:onTouchEvent(sys, event);
        return;
    end

    
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        self:handleIntensityEvent(sys, event)
    end
end

function graffiti_pen:handleIntensityEvent(sys, event)
end


exports.graffiti_pen = graffiti_pen
return exports
