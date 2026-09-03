local exports = exports or {}
local HSL = HSL or {}
HSL.__index = HSL
---@class HSL : ScriptComponent
---@field Red Vector3f
---@field Orange Vector3f
---@field Yellow Vector3f
---@field Green Vector3f
---@field Cyan Vector3f
---@field Blue Vector3f
---@field Purple Vector3f
---@field Magenta Vector3f
---@field InputTex Texture
---@field OutputTex Texture

function HSL.new(construct, ...)
    local self = setmetatable({}, HSL)
    if construct and HSL.constructor then
        HSL.constructor(self, ...)
    end

    self.slider_max_value = 100

    self.Red     = Amaz.Vector3f(0.0, 0.0, 0.0)
    self.Orange  = Amaz.Vector3f(0.0, 0.0, 0.0)
    self.Yellow  = Amaz.Vector3f(0.0, 0.0, 0.0)
    self.Green   = Amaz.Vector3f(0.0, 0.0, 0.0)
    self.Cyan    = Amaz.Vector3f(0.0, 0.0, 0.0)
    self.Blue    = Amaz.Vector3f(0.0, 0.0, 0.0)
    self.Purple  = Amaz.Vector3f(0.0, 0.0, 0.0)
    self.Magenta = Amaz.Vector3f(0.0, 0.0, 0.0)

    self.InputTex = nil
    self.OutputTex = nil

    return self
end

function HSL:constructor()
end

function HSL:setEffectAttr(key, value, comp)
    local function _setEffectAttr(_key, _value)
        if self[_key] ~= nil then
            self[_key] = _value
            if comp and comp.properties ~= nil then
                comp.properties:set(_key, _value)
            end
        end
    end

    if key == "HSLRed1"
    or key == "HSLOrange1"
    or key == "HSLYellow1"
    or key == "HSLGreen1"
    or key == "HSLCyan1"
    or key == "HSLBlue1"
    or key == "HSLPurple1"
    or key == "HSLMagenta1"
    or key == "HSLRed2"
    or key == "HSLOrange2"
    or key == "HSLYellow2"
    or key == "HSLGreen2"
    or key == "HSLCyan2"
    or key == "HSLBlue2"
    or key == "HSLPurple2"
    or key == "HSLMagenta2"
    or key == "HSLRed3"
    or key == "HSLOrange3"
    or key == "HSLYellow3"
    or key == "HSLGreen3"
    or key == "HSLCyan3"
    or key == "HSLBlue3"
    or key == "HSLPurple3"
    or key == "HSLMagenta3"
    then
        local channelName = string.sub(key, 4, -2)
        local index = key:sub(#key, #key)
        local channel = self[channelName]
        if channel then
            if     index == '1' then channel.x = value
            elseif index == '2' then channel.y = value
            elseif index == '3' then channel.z = value
            end
            _setEffectAttr(channelName, channel)
        end
    elseif key == "reset_params" and value == 1 then
        _setEffectAttr("Red"    , Amaz.Vector3f(0.0, 0.0, 0.0))
        _setEffectAttr("Orange" , Amaz.Vector3f(0.0, 0.0, 0.0))
        _setEffectAttr("Yellow" , Amaz.Vector3f(0.0, 0.0, 0.0))
        _setEffectAttr("Green"  , Amaz.Vector3f(0.0, 0.0, 0.0))
        _setEffectAttr("Cyan"   , Amaz.Vector3f(0.0, 0.0, 0.0))
        _setEffectAttr("Blue"   , Amaz.Vector3f(0.0, 0.0, 0.0))
        _setEffectAttr("Purple" , Amaz.Vector3f(0.0, 0.0, 0.0))
        _setEffectAttr("Magenta", Amaz.Vector3f(0.0, 0.0, 0.0))
    else
        _setEffectAttr(key, value)
    end
end

function HSL:onUpdate(comp, detalTime)
    self:seekToTime(comp, detalTime)
end

function HSL:start(comp)
    self.camera = comp.entity:searchEntity("Camera_entity"):getComponent("Camera")
    self.material = comp.entity:searchEntity("PassEntity"):getComponent("MeshRenderer").material

    for i = 1, 8 do
        self.material:setVec3("hsl_param_" .. (i - 1), Amaz.Vector3f(0.0, 0.0, 0.0))
    end
end

function HSL:seekToTime(comp, time)
    if self.first == nil then
        self.first = true
        self:start(comp)
    end

    self.camera.renderTexture = self.OutputTex
    self.material:setTex("inputImageTexture", self.InputTex)

    self.material:setVec3("hsl_param_0", self.Red * self.slider_max_value)
    self.material:setVec3("hsl_param_1", self.Orange * self.slider_max_value)
    self.material:setVec3("hsl_param_2", self.Yellow * self.slider_max_value)
    self.material:setVec3("hsl_param_3", self.Green * self.slider_max_value)
    self.material:setVec3("hsl_param_4", self.Cyan * self.slider_max_value)
    self.material:setVec3("hsl_param_5", self.Blue * self.slider_max_value)
    self.material:setVec3("hsl_param_6", self.Purple * self.slider_max_value)
    self.material:setVec3("hsl_param_7", self.Magenta * self.slider_max_value)
end

exports.HSL = HSL
return exports
