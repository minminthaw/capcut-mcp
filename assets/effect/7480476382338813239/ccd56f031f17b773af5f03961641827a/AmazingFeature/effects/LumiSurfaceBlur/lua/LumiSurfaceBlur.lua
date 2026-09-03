local isEditor = (Amaz.Macros and Amaz.Macros.EditorSDK) and true or false
local exports = exports or {}
local LumiSurfaceBlur = LumiSurfaceBlur or {}
LumiSurfaceBlur.__index = LumiSurfaceBlur
---@class LumiSurfaceBlur : ScriptComponent
---@field radius double [UI(Range={0.001, 8}, Slider)]
---@field blurIntensity double [UI(Range={0.001, 25}, Slider)]
---@field InputTex Texture
---@field OutputTex Texture

local AE_EFFECT_TAG = 'AE_EFFECT_TAG LumiTag'

function LumiSurfaceBlur.new(construct, ...)
    local self = setmetatable({}, LumiSurfaceBlur)

    self.__lumi_type = "lumi_obj"
    self.__lumi_rt_pingpong_type = "custom"

    self.radius = 10
    self.blurIntensity = 24
    self.InputTex = nil
    self.OutputTex = nil

    return self
end

function LumiSurfaceBlur:setEffectAttr(key, value, comp)
    local function _setEffectAttr(_key, _value, _force)
        if _force or self[_key] ~= nil then
            self[_key] = _value
            if comp and comp.properties ~= nil then
                comp.properties:set(_key, _value)
            end
        end
    end

    _setEffectAttr(key, value)
end

function LumiSurfaceBlur:onStart(comp)
    self.entity = comp.entity
    self.TAG = AE_EFFECT_TAG .. ' ' .. self.entity.name
    Amaz.LOGI(self.TAG, 'onStart')

    -- Use entity instead of scene 
    self.camera = self.entity:searchEntity("CameraSurfaceBlur"):getComponent("Camera")
    self.material = self.entity:searchEntity("EntitySurfaceBlur"):getComponent("MeshRenderer").material
end

function LumiSurfaceBlur:onUpdate(comp, deltaTime)
    -- set the input and output textures to be displayed
    if self.OutputTex then
        self.camera.renderTexture = self.OutputTex
    end
    self.material:setTex("u_inputTexture", self.InputTex)
    self.material:setFloat("u_intensity", self.blurIntensity  / 255.0)
    self.material:setFloat("u_radius", self.radius)
end

exports.LumiSurfaceBlur = LumiSurfaceBlur
return exports
