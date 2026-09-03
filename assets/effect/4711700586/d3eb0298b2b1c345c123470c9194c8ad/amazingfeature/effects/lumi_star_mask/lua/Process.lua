local exports = exports or {}
local Process = Process or {}
Process.__index = Process
---@field InputTex Texture
---@field OutputTex Texture

function Process.new(construct, ...)
    -- Amaz.LOGI("wjj test Process:new", 1)
    local self = setmetatable({}, Process)
    self.u_center = Amaz.Vector2f(0.0, 0.0)
    self.u_aspect = Amaz.BuiltinObject.getOutputTextureWidth() / Amaz.BuiltinObject.getOutputTextureHeight()
    self.u_rotate = 0.0
    self.u_size = Amaz.Vector2f(1.0, 1.0)
    self.u_diff = 0.0
    self.u_invert = 0.0
    self.boundaryScaleX = 1.77
    self.boundaryScaleY = 1.77
    self.enableMetal = 0
    self.InputTex = nil
    self.OutputTex = nil
    if construct and Process.constructor then
        Process.constructor(self, ...)
    end
    return self
end

function Process:constructor()
end

function Process:onStart(comp)
    -- Amaz.LOGI("wjj test Process:onStart", 1)
    self.material = comp.entity:searchEntity("Mask"):getComponent("MeshRenderer").material
    self.material:setVec2("u_center", self.u_center)
    self.material:setFloat("u_aspect", self.u_aspect)
    self.material:setFloat("u_rotate", self.u_rotate)
    self.material:setVec2("u_size", self.u_size)
    self.material:setFloat("u_diff", self.u_diff)
    self.material:setFloat("u_invert", self.u_invert)
    self.material:setInt("u_useMetal", self.enableMetal)
    self.mat = comp.entity:searchEntity("Blend"):getComponent("MeshRenderer").material
    self.out_cam = comp.entity:searchEntity("starBlendCamera"):getComponent("Camera")

end

function Process:getEffectAttr(key, comp)
    Amaz.LOGI("wjj test getEffectAttr key: ", key)
    if key == "posX" then
        return self.u_center.x
    elseif key == "posY" then
        return self.u_center.y
    elseif key == "scaleX" then
        return self.u_size.x / self.boundaryScaleX;
    elseif key == "scaleY" then
        return self.u_size.y / self.boundaryScaleY;
    elseif key == "rotationZ" then
        return 360.0 * self.u_rotate / (2 * math.pi) - 360.0;
        -- return self.u_rotate;
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
        local center = Amaz.Vector2f(value, self.u_center.y)
        _setEffectAttr("u_center", center, comp)
    elseif "py" == key or "posY" == key then
        local center = Amaz.Vector2f(self.u_center.x, value)
        _setEffectAttr("u_center", center, comp)
    elseif "sx" == key or "scaleX" == key then
        local size = Amaz.Vector2f(value * self.boundaryScaleX, self.u_size.y)
        _setEffectAttr("u_size", size, comp)
    elseif "sy" == key or "scaleY" == key then
        local size = Amaz.Vector2f(self.u_size.x, value * self.boundaryScaleY)
        _setEffectAttr("u_size", size, comp)
    elseif key == "rz" or key == "rotationZ" then
        local rotation = (360.0 - value) * 2.0 * math.pi / 360.0
        _setEffectAttr("u_rotate", rotation, comp)
    elseif key == "feather" then
        local diff = value * 0.5
        _setEffectAttr("u_diff", diff, comp)
    elseif key == "invert" then
        local invert = 0.0
        if value == true then
            invert = 1.0
        else
            invert = 0.0
        end
        _setEffectAttr("u_invert", invert, comp)
    elseif key == "enableMetal" then
        self.enableMetal = value
    end
end

function Process:onUpdate(comp, delta)
    -- Amaz.LOGI("wjj test Process:onUpdate", 1)
    self.u_aspect = Amaz.BuiltinObject.getOutputTextureWidth() / Amaz.BuiltinObject.getOutputTextureHeight()
    self.material:setVec2("u_center", self.u_center)
    self.material:setFloat("u_aspect", self.u_aspect)
    self.material:setFloat("u_rotate", self.u_rotate)
    self.material:setVec2("u_size", self.u_size)
    self.material:setFloat("u_diff", self.u_diff)
    self.material:setFloat("u_invert", self.u_invert)
    self.material:setInt("u_useMetal", self.enableMetal)
    self.mat:setTex("u_albedo", self.InputTex)
    self.out_cam.renderTexture = self.OutputTex
end

exports.Process = Process
return exports
