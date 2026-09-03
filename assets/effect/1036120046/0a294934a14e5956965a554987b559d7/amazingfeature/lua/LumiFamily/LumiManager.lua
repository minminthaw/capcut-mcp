      
local isEditor = (Amaz.Macros and Amaz.Macros.EditorSDK) and true or false
local exports = exports or {}
local LumiManager = LumiManager or {}
LumiManager.__index = LumiManager
---@class LumiManager : ScriptComponent
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

    self.LumiParamsSetter = includeRelativePath("LumiParamsSetter")
    if self.LumiParamsSetter then
        local ae_tools = includeRelativePath("AETools")
        self.lumi_params_setter = self.LumiParamsSetter.new(ae_tools)
    end
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

function LumiManager:onUpdate(comp, deltaTime)
    if isEditor then
    end

    if self.lumi_obj == nil then
        self:registerLumiObj(self.LumiEffectTrans, 1)
    end

    
    self.curTime = self.curTime + deltaTime
    if self.lumi_obj then
        self.lumi_obj:setEffectAttr("startTime", self.startTime)
        self.lumi_obj:setEffectAttr("endTime", self.endTime)
        self.lumi_obj:setEffectAttr("curTime", self.curTime)
    end

    if self.lumi_params_setter and self.lumi_params_setter.updateKeyFrameData then
        self.lumi_params_setter:updateKeyFrameData(self.lumi_obj, self.startTime, self.endTime, self.curTime)
    end
    if self.lumi_obj and self.lumi_obj.updateMaterials then
        self.lumi_obj:updateMaterials(deltaTime)
    end
end

function LumiManager:onEvent(comp, event)
    if self.lumi_obj == nil then
        self:registerLumiObj(self.LumiEffectTrans, 1)
    end

    if self.lumi_obj == nil then
        Amaz.LOGE('AE_LUA_TAG', 'Failed to find lumi_obj')
        return
    end

    if self.lumi_params_setter and self.lumi_params_setter.onEvent then
        self.lumi_params_setter:onEvent(self.lumi_obj, event)
    end
end

exports.LumiManager = LumiManager
return exports
