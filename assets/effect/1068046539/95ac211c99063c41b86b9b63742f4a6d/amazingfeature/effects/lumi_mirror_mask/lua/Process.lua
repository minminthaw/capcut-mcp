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
    self.u_rotate = 0.0
    self.u_orient = Amaz.Vector2f(0.0, 1.0)
    self.u_aspect = Amaz.BuiltinObject.getOutputTextureWidth() / Amaz.BuiltinObject.getOutputTextureHeight()
    self.u_scale = 0.5
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
    self.material:setVec2("u_orient", self.u_orient)
    self.material:setFloat("u_rotate", self.u_rotate)
    self.material:setFloat("u_aspect", self.u_aspect)
    self.material:setFloat("u_scale", self.u_scale)
    self.material:setFloat("u_diff", self.u_diff)
    self.material:setFloat("u_invert", self.u_invert)
    self.out_cam = comp.entity:searchEntity("mirrorMaskCamera"):getComponent("Camera")
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

    if "centerX" == key or "posX" == key then
        local center = Amaz.Vector2f(value, self.u_center.y)
        _setEffectAttr("u_center", center, comp)
    elseif "centerY" == key or "posY" == key then
        local center = Amaz.Vector2f(self.u_center.x, value)
        _setEffectAttr("u_center", center, comp)
    elseif key == "rotation" or key == "rotationZ" then
        self.u_rotate = -value * 2.0 * math.pi / 360.0
        local orient = Amaz.Vector2f(-math.sin(self.u_rotate), math.cos(self.u_rotate))
        _setEffectAttr("u_orient", orient, comp)
    elseif key == "height" or key == "scaleY" then
        _setEffectAttr("u_scale", value, comp)
    elseif key == "feather" then
        _setEffectAttr("u_diff", value, comp)
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
    self.material:setFloat("u_rotate", self.u_rotate)
    self.material:setVec2("u_orient", self.u_orient)
    self.material:setFloat("u_aspect", self.u_aspect)
    self.material:setFloat("u_scale", self.u_scale)
    self.material:setFloat("u_diff", self.u_diff)
    self.material:setFloat("u_invert", self.u_invert)
    self.material:setTex("u_albedo", self.InputTex)
    self.out_cam.renderTexture = self.OutputTex
end

exports.Process = Process
return exports
