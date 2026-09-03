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
    self.u_size = Amaz.Vector2f(1.0, 1.0)
    self.u_roundCorner = 0.0
    self.u_rightTop = Amaz.Vector2f(1.0, 1.0)
    self.u_circleCenter = Amaz.Vector2f(1.0, 1.0)
    self.u_circleRadius = 0.0
    self.u_diff = 0.0
    self.u_invert = 0.0
    self.InputTex = nil
    self.OutputTex = nil
    return self
end

function Process:constructor()
end

function Process:onStart(comp)
    self.u_aspect = Amaz.BuiltinObject.getOutputTextureWidth() / Amaz.BuiltinObject.getOutputTextureHeight()
    if self.u_size.x * self.u_aspect >= self.u_size.y then
        self.u_circleRadius = self.u_size.y * self.u_roundCorner
    else
        self.u_circleRadius = self.u_size.x * self.u_aspect * self.u_roundCorner
    end
    self.u_rightTop:Set(self.u_size.x * self.u_aspect, self.u_size.y)
    self.u_circleCenter:Set(self.u_rightTop.x - self.u_circleRadius, self.u_rightTop.y - self.u_circleRadius)

    self.material = comp.entity:searchEntity("Picture"):getComponent("MeshRenderer").material
    self.material:setVec2("u_center", self.u_center)
    self.material:setFloat("u_aspect", self.u_aspect)
    self.material:setFloat("u_rotate", self.u_rotate)
    self.material:setVec2("u_size", self.u_size)
    self.material:setVec2("u_rightTop", self.u_rightTop)
    self.material:setVec2("u_circleCenter", self.u_circleCenter)
    self.material:setFloat("u_circleRadius", self.u_circleRadius)
    self.material:setFloat("u_diff", self.u_diff)
    self.material:setFloat("u_invert", self.u_invert)
    self.out_cam = comp.entity:searchEntity("rectangleMaskCamera"):getComponent("Camera")
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
        local size = Amaz.Vector2f(value, self.u_size.y)
        _setEffectAttr("u_size", size, comp)
    elseif "sy" == key or "scaleY" == key then
        local size = Amaz.Vector2f(self.u_size.x, value)
        _setEffectAttr("u_size", size, comp)
    elseif key == "rz" or key == "rotationZ" then
        local r = -value
        local rotate = (360.0 - r) * 2.0 * math.pi / 360.0
        _setEffectAttr("u_rotate", rotate, comp)
    elseif key == "roundCorner" then
        _setEffectAttr("u_roundCorner", value, comp)
    elseif key == "feather" then
        local feather = value * 6
        _setEffectAttr("u_diff", feather, comp)
    elseif key == "invert" then
        local invert = 0.0
        if value == true then
            invert = 1.0
        else
            invert = 0.0
        end
        _setEffectAttr("u_invert", invert, comp)
    end

    if self.u_size.x * self.u_aspect >= self.u_size.y then
        self.u_circleRadius = self.u_size.y * self.u_roundCorner
    else
        self.u_circleRadius = self.u_size.x * self.u_aspect * self.u_roundCorner
    end
    self.u_rightTop:Set(self.u_size.x * self.u_aspect, self.u_size.y)
    self.u_circleCenter:Set(self.u_rightTop.x - self.u_circleRadius, self.u_rightTop.y - self.u_circleRadius)
end

function Process:onUpdate(comp, delta)
    self.u_aspect = Amaz.BuiltinObject.getOutputTextureWidth() / Amaz.BuiltinObject.getOutputTextureHeight()
    if self.u_size.x * self.u_aspect >= self.u_size.y then
        self.u_circleRadius = self.u_size.y * self.u_roundCorner
    else
        self.u_circleRadius = self.u_size.x * self.u_aspect * self.u_roundCorner
    end
    self.u_rightTop:Set(self.u_size.x * self.u_aspect, self.u_size.y)
    self.u_circleCenter:Set(self.u_rightTop.x - self.u_circleRadius, self.u_rightTop.y - self.u_circleRadius)

    self.material:setVec2("u_center", self.u_center)
    self.material:setFloat("u_aspect", self.u_aspect)
    self.material:setFloat("u_rotate", self.u_rotate)
    self.material:setVec2("u_size", self.u_size)
    self.material:setVec2("u_rightTop", self.u_rightTop)
    self.material:setVec2("u_circleCenter", self.u_circleCenter)
    self.material:setFloat("u_circleRadius", self.u_circleRadius)
    self.material:setFloat("u_diff", self.u_diff)
    self.material:setFloat("u_invert", self.u_invert)
    self.material:setTex("u_albedo", self.InputTex)
    self.out_cam.renderTexture = self.OutputTex
end

exports.Process = Process
return exports
