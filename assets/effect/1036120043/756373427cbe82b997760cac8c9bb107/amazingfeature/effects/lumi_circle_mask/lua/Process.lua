local exports = exports or {}
local Process = Process or {}
Process.__index = Process
---@field InputTex Texture
---@field OutputTex Texture

function Process.new(construct, ...)
    local self = setmetatable({}, Process)
    if construct and Process.constructor then
        Process.constructor(self, ...)
    end
    self.u_center = Amaz.Vector2f(0.0, 0.0)
    self.u_aspect = Amaz.BuiltinObject.getOutputTextureWidth() / Amaz.BuiltinObject.getOutputTextureHeight()
    self.u_rotate = 0.0
    self.u_size = Amaz.Vector2f(1, 1)
    self.u_diff = 0.0
    self.u_invert = 0.0
    self.InputTex = nil
    self.OutputTex = nil
    return self
end

function Process:constructor()
end

function Process:onStart(comp)
    self.material = comp.entity:searchEntity("Picture"):getComponent("MeshRenderer").material
    self.material:setVec2("u_center", self.u_center)
    self.material:setFloat("u_aspect", self.u_aspect)
    self.material:setFloat("u_rotate", self.u_rotate)
    self.material:setVec2("u_size", self.u_size)
    self.material:setFloat("u_diff", self.u_diff)
    self.material:setFloat("u_invert", self.u_invert)
    self.out_cam = comp.entity:searchEntity("circleMaskCamera"):getComponent("Camera")
end

function Process:getEffectAttr(key, comp)
    if key == "posX" then
        return self.u_center.x
    elseif key == "posY" then
        return self.u_center.y
    elseif key == "scaleX" then
        return self.u_size.x;
    elseif key == "scaleY" then
        return self.u_size.y;
    elseif key == "rotationZ" then
        -- return self.u_rotate;
        return 360.0 * self.u_rotate / (2 * math.pi) - 360.0;
    end
end

function Process:setEffectAttr(key, value, comp)
    local function _setEffectAttr(_key, _value, _comp)
        if self[_key] ~= nil then
            self[_key] = _value
            if _comp and _comp.properties ~= nil then
                _comp.properties:set(_key, _value)
            end
        end
    end

    if "px" == key or "posX" == key then
        Amaz.LOGI("wjj test setEffectAttr key: ", key)
        Amaz.LOGI("wjj test setEffectAttr value: ", value)
        local center = Amaz.Vector2f(value, self.u_center.y)
        _setEffectAttr("u_center", center, comp)
    elseif "py" == key or "posY" == key then
        Amaz.LOGI("wjj test setEffectAttr key: ", key)
        Amaz.LOGI("wjj test setEffectAttr value: ", value)
        local center = Amaz.Vector2f(self.u_center.x, value)
        _setEffectAttr("u_center", center, comp)
    elseif key == "sx" or key == "scaleX" then
        local size = Amaz.Vector2f(value, self.u_size.y)
        _setEffectAttr("u_size", size, comp)
    elseif key == "sy" or key == "scaleY" then
        local size = Amaz.Vector2f(self.u_size.x, value)
        _setEffectAttr("u_size", size, comp)
    elseif key == "rz" or key == "rotationZ" then
        local r = -value
        local rotation = (360.0 - r) * 2.0 * math.pi / 360.0
        _setEffectAttr("u_rotate", rotation, comp)
    elseif key == "feather" then
        local diff = value * 15
        _setEffectAttr("u_diff", diff, comp)
    elseif key == "invert" then
        local invert = 0.0
        if value == true then
            invert = 1.0
        else
            invert = 0.0
        end
        _setEffectAttr("u_invert", invert, comp)
    end
end

function Process:onUpdate(comp, delta)
    self.u_aspect = Amaz.BuiltinObject.getOutputTextureWidth() / Amaz.BuiltinObject.getOutputTextureHeight()
    self.material:setVec2("u_center", self.u_center)
    self.material:setFloat("u_aspect", self.u_aspect)
    self.material:setFloat("u_rotate", self.u_rotate)
    self.material:setVec2("u_size", self.u_size)
    self.material:setFloat("u_diff", self.u_diff)
    self.material:setFloat("u_invert", self.u_invert)
    self.material:setTex("u_albedo", self.InputTex)
    self.out_cam.renderTexture = self.OutputTex
end

exports.Process = Process
return exports
