      
local isEditor = (Amaz.Macros and Amaz.Macros.EditorSDK) and true or false
local exports = exports or {}
local LumiManager = LumiManager or {}
LumiManager.__index = LumiManager
---@class LumiManager : ScriptComponent
---@field debugTime number [UI(Range={0, 6}, Drag)]
---@field autoPlay boolean
---@field LumiEffectTrans Transform
---@field start_render_layer int
---@field start_render_order int
---@field InputTex Texture
---@field OutputTex Texture
---@field PingPongTex Texture

local function handleAllEntityBySingleParent(_trans, func, ...)
    if _trans.children:size() > 0 then
        for i = 1, _trans.children:size() do
            local child = _trans.children:get(i-1)
            handleAllEntityBySingleParent(child, func, ...)
        end
    end
    func(_trans, ...)
end


function LumiManager.new(construct, ...)
    local self = setmetatable({}, LumiManager)

    self.LumiEffectTrans = nil
    self.start_render_layer = 1
    self.start_render_order = 1

    self.InputTex = nil
    self.OutputTex = nil
    self.PingPongTex = nil

    self.startTime = 0.0
    self.endTime = 6.0
    self.curTime = 0.0

    self.speed = 1.0
    self.autoPlay = true
    self.debugTime = 0.0

    self.shift_x = 0.5
    self.shift_y = 0.5
    self.scale = 0.16

    if construct and LumiManager.constructor then LumiManager.constructor(self, ...) end
    return self
end


function LumiManager:onStart(comp)
    self.entity = comp.entity
    self.trans = self.entity:getComponent("Transform")

    -- self.input = comp.entity.scene.assetMgr:SyncLoad("share://input.texture")
    -- self.output = comp.entity.scene.assetMgr:SyncLoad("rt/outputTex.rt")
    self.lumi_obj_extension = includeRelativePath("LumiObjectExtension")
    self.lumi_obj = nil

    self.keyframes = nil
    self.durations = nil
    self.params = nil
    self.compDurations = {0, 6}
    self.durationMode = 0
    self.disappearTime = 0
    self.sliderInfos = {}
    self.effectType = "effect"
    self.transitionInputIndex = {}

    self.LumiParamsSetter = includeRelativePath("LumiParamsSetter")
    local ae_export_data = includeRelativePath("LumiExportData")
    if ae_export_data then
        if ae_export_data.ae_keyframes then
            local ae_tools = includeRelativePath("AETools")
            if ae_tools then
                self.keyframes = ae_tools.new(ae_export_data.ae_keyframes)
            end
        end
        if ae_export_data.ae_durations ~= nil then
            self.durations = ae_export_data.ae_durations
        end
        if ae_export_data.ae_attribute ~= nil then
            self.params = ae_export_data.ae_attribute
        end
        if ae_export_data.ae_compDurations ~= nil then
            self.compDurations = ae_export_data.ae_compDurations
        end
        if ae_export_data.ae_durationMode ~= nil then
            self.durationMode = ae_export_data.ae_durationMode
        end
        if ae_export_data.ae_disappearTime ~= nil then
            self.disappearTime = ae_export_data.ae_disappearTime
        end
        if ae_export_data.ae_sliderInfos ~= nil then
            self.sliderInfos = ae_export_data.ae_sliderInfos
        end
        if ae_export_data.ae_effectType ~= nil then
            self.effectType = ae_export_data.ae_effectType
        end
        if ae_export_data.ae_transitionInputIndex ~= nil then
            self.transitionInputIndex = ae_export_data.ae_transitionInputIndex
        end
    end
    if self.LumiParamsSetter then
        self.lumi_params_setter = self.LumiParamsSetter.new(self.params, self.keyframes, self.sliderInfos, self.effectType)
    end
    self.masking = comp.entity.scene:findEntityBy("masking"):getComponent("MeshRenderer").material
end

function LumiManager:onDestroy(comp)
    if self.LumiEffectTrans and self.lumi_obj_extension then
        self.lumi_obj_extension.deregister(self.LumiEffectTrans.entity)
    end
    self.lumi_obj = nil
end

---@function [UI(Button="ReRender")]
function LumiManager:getCameraCount()
    if self.LumiEffectTrans == nil then
        return 0
    end

    self.lumi_obj = nil
    self:ReRender()

    local cam_count = 0
    if self.lumi_obj then
        cam_count = self.lumi_obj:getCameraCount()
        Amaz.LOGI("AE_LUA_TAG", self.lumi_obj.entity.name .. " camera_count: " .. tostring(cam_count))
    end
    return cam_count
end

function LumiManager:ReRender()
    if self.LumiEffectTrans == nil then
        return
    end

    -- re register
    self.lumi_obj = nil
    self:registerLumiObj(self.LumiEffectTrans, 1)

    if self.lumi_obj == nil then
        Amaz.LOGE('AE_LUA_TAG', 'No lumi_obj register')
        return
    end

    -- change layer & order
    self:updateCameraLayerAndOrder()

    -- change rt pingpong
    self:updateRtPingpong()
end

function LumiManager:registerLumiObj(_trans, _idx)
    if _trans == nil then return end
    -- Amaz.LOGI("lrc ".._idx, _trans.entity.name)
    local script_comp = _trans.entity:getComponent("ScriptComponent")
    if script_comp then
        local lua_obj = Amaz.ScriptUtils.getLuaObj(script_comp:getScript())
        if lua_obj then
            self.lumi_obj_extension.deregister(_trans.entity)
            self.lumi_obj = self.lumi_obj_extension.register(_trans.entity)
        end
    end
end

function LumiManager:updateCameraLayerAndOrder()
    if self.lumi_obj then
        self.lumi_obj:updateCameraLayerAndOrder(self.start_render_layer, self.start_render_order)
    end
end

function LumiManager:updateRtPingpong()
    if self.lumi_obj then
        self.lumi_obj:updateRt(self.InputTex, self.OutputTex, self.PingPongTex)
    end
end

function LumiManager:initVideoAnimationLua(comp)
    local modelEntity = comp.entity:searchEntity("model")
    if modelEntity then 
        local scriptComp = modelEntity:getComponent("ScriptComponent")
        if scriptComp then 
            self.videoAnimationLua = Amaz.ScriptUtils.getLuaObj(scriptComp:getScript())
        end
    end
end

local function uvTransform (screenSize, layers)
    local matrix = Amaz.Matrix4x4f()
    if screenSize then
        local last = layers[#layers]
        matrix:setScale(Amaz.Vector3f(1/last.w, 1/last.h, 1))
    else
        matrix:setIdentity()
    end
    for i = #layers, 1, -1 do
        local layer = layers[i]
        if layer.ax or layer.ay then
            local dx = layer.ax and layer.ax * layer.w or 0
            local dy = layer.ay and layer.ay * layer.h or 0
            matrix:translate(Amaz.Vector3f(dx, dy, 0))
        end
        if layer.r then
            local rotate = Amaz.Matrix4x4f()
            rotate:setTR(Amaz.Vector3f(0, 0, 0), Amaz.Quaternionf.eulerToQuaternion(Amaz.Vector3f(0, 0, -math.rad(layer.r))))
            matrix = matrix * rotate
        end
        if layer.s then
            matrix:scale(Amaz.Vector3f(1/layer.s, 1/layer.s, 1))
        elseif layer.sx or layer.sy then
            matrix:scale(Amaz.Vector3f(1/layer.sx, 1/layer.sy, 1))
        end
        if layer.x or layer.y then
            local x = layer.x and -layer.x or 0
            local y = layer.y and -layer.y or 0
            matrix:translate(Amaz.Vector3f(x, y, 0))
        end
    end
    if screenSize then
        matrix:scale(Amaz.Vector3f(screenSize.x, screenSize.y, 1))
    end
    return matrix
end

local function mix (x, y, a)
    return x + (y - x) * a
end

function LumiManager:onUpdate(comp, deltaTime)
    if isEditor then
    end

    if self.lumi_obj == nil then
        self:registerLumiObj(self.LumiEffectTrans, 1)
        self:updateCameraLayerAndOrder()
    end

    collectgarbage("collect")

    self.curTime = self.curTime + deltaTime
    local curTime = (self.curTime - self.startTime) * self.speed + self.startTime
    local startTime = self.startTime
    local endTime = (self.endTime - self.startTime) * self.speed + self.startTime
    
    local aeTime = curTime;
    if endTime - curTime < self.disappearTime then
        aeTime = math.max(self.compDurations[1], self.compDurations[2] - (self.endTime - self.curTime))
    else
        local aeDuration = math.max(0.001, self.compDurations[2]-self.compDurations[1]-self.disappearTime)
        local lvDuration =  math.max(0.001, endTime-startTime-self.disappearTime)
        if self.durationMode == 0 then
            aeTime = curTime - startTime + self.compDurations[1]
        elseif self.durationMode == 1 then
            aeTime = (curTime - startTime) % aeDuration + self.compDurations[1]
        elseif self.durationMode == 2 then
            aeTime = (curTime - startTime)*aeDuration/lvDuration + self.compDurations[1]
        end
    end

    if self.effectType == "transition" then
        local input1 = Amaz.BuiltinObject.getUserTexture("#TransitionInput0")
        local input2 = Amaz.BuiltinObject.getUserTexture("#TransitionInput1")
        if input1 and input2 then
            for index, transitionInputInfo in ipairs(self.transitionInputIndex) do
                local entityName = transitionInputInfo[1]
                local texName = transitionInputInfo[2]
                local inputIndex = transitionInputInfo[3]
                if inputIndex == 0 then
                    self.lumi_obj:setSubEffectAttr(entityName, texName, input1)
                else
                    self.lumi_obj:setSubEffectAttr(entityName, texName, input2)
                end
            end
            aeTime = Amaz.Input.frameTimestamp * (self.compDurations[2]-self.compDurations[1]) + self.compDurations[1]
        end
    elseif self.effectType == "videoAnimation" then
        if self.videoAnimationLua == nil then
            self:initVideoAnimationLua(comp)
        end
        if self.videoAnimationLua ~= nil then
            aeTime = self.videoAnimationLua.progress * (self.compDurations[2]-self.compDurations[1]) + self.compDurations[1]
        end
    end

    if isEditor then
        if self.autoPlay then
            self.debugTime = curTime % (self.compDurations[2]-self.compDurations[1]) + self.compDurations[1]
            aeTime = self.debugTime
        else
            aeTime = self.debugTime
        end
    end

    if self.lumi_obj then
        self.lumi_obj:setEffectAttrRecursively("startTime", self.startTime)
        self.lumi_obj:setEffectAttrRecursively("endTime", self.endTime)
        self.lumi_obj:setEffectAttrRecursively("curTime", self.curTime)
    end

    if self.lumi_params_setter and self.lumi_params_setter.initParams then
        self.lumi_params_setter:initParams(self.lumi_obj)
    end
    if self.lumi_params_setter and self.lumi_params_setter.updateKeyFrameData then
        self.lumi_params_setter:updateKeyFrameData(self.lumi_obj, self.startTime, self.endTime, self.curTime, aeTime)
    end
    if self.lumi_params_setter and self.lumi_params_setter.updateSlider then
        self.lumi_params_setter:updateSlider(self.lumi_obj, self.startTime, self.endTime, self.curTime, aeTime)
    end
    
    if self.durations~= nil and aeTime >= self.compDurations[1] and aeTime <= self.compDurations[2] then
        if self.lumi_obj and self.lumi_obj.setVisible then
            for entityName, durations in pairs(self.durations) do
                local visible = false
                for j = 1, #durations do
                    if durations[j][1] <= aeTime and aeTime <= durations[j][2] then
                        visible = true
                        break
                    end
                end
                self.lumi_obj:setVisible(entityName, visible)
            end
        end
    end
    if self.lumi_obj and self.lumi_obj.updateMaterials then
        self.lumi_obj:updateMaterials(deltaTime)
    end

    local w = Amaz.BuiltinObject.getInputTextureWidth()
    local h = Amaz.BuiltinObject.getInputTextureHeight()
    self.screenSize = Amaz.Vector2f(w, h)
    local aw = math.max(w,h)

    self.masking:setMat4("u_mat", uvTransform(self.screenSize, {
        {
            w = aw,
            h = aw,
            ax = 0.5,
            ay = 0.5,
            x = mix(-aw / 2, w + aw / 2, 0.5),
            y = mix(-aw / 2, h + aw / 2, 0.5),
            s = mix(0,3, self.scale)
        },
    }))

    --self.masking:setVec2("mask_uv", Amaz.Vector2f(self.shift_x, self.shift_x))
    --self.masking:setVec2("mask_uv", Amaz.Vector2f(data.shift_x, data.shift_y))
    --self.masking:setVec2("mask_uv", Amaz.Vector2f(0.5, 0.5))
end




function LumiManager:onEvent(comp, event)
    if self.lumi_obj == nil then
        self:registerLumiObj(self.LumiEffectTrans, 1)
        self:updateCameraLayerAndOrder()
    end

    if self.lumi_obj == nil then
        Amaz.LOGE('AE_LUA_TAG', 'Failed to find lumi_obj')
        return
    end

    --[[if event.args:get(0) == "effects_adjust_horizontal_shift" then
        --local shift_x = event.args:get(0)
        self.shift_x = event.args:get(1)
        --self.speed = value*1.5 + 0.5
    end

    if event.args:get(0) == "effects_adjust_vertical_shift" then
        --local shift_x = event.args:get(0)
        self.shift_y = event.args:get(1)
        --self.speed = value*1.5 + 0.5
    end
]]
    if event.args:get(0) == "effects_adjust_background_animation" then
        --local shift_x = event.args:get(0)
        self.scale = event.args:get(1)
        --self.speed = value*1.5 + 0.5
    end

    if self.lumi_params_setter and self.lumi_params_setter.onEvent then
        self.lumi_params_setter:onEvent(self.lumi_obj, event)
    end
end

exports.LumiManager = LumiManager
return exports
