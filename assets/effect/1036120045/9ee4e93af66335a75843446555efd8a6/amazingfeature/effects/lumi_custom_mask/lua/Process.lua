local exports = exports or {}
local Process = Process or {}
Process.__index = Process
---@field InputTex Texture
---@field OutputTex Texture

function Process.new(construct, ...)
    local self = setmetatable({}, Process)
    self.u_inputSize = Amaz.Vector2f(Amaz.BuiltinObject.getOutputTextureWidth(), Amaz.BuiltinObject.getOutputTextureHeight())
    self.u_position = Amaz.Vector2f(0.0, 0.0)
    self.u_aspect = Amaz.BuiltinObject.getOutputTextureWidth() / Amaz.BuiltinObject.getOutputTextureHeight()
    self.u_rotation = 0.0
    self.u_scale = Amaz.Vector2f(1.0, 1.0)
    self.u_diff = 0.0
    self.u_expansion = 0.0
    self.u_invert = 0.0
    self.enableTransformUV = false
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
    self.gaussianBlurXMaterial = comp.entity:searchEntity("gaussianBlurX"):getComponent("MeshRenderer").material
    self.gaussianBlurXMaterial:setFloat("u_diff", self.u_diff)
    -- self.material = comp.entity:searchEntity("customMaskPen"):getComponent("MeshRenderer").material
    self.out_cam = comp.entity:searchEntity("fxaaCamera"):getComponent("Camera")

    self.gaussianBlurYAndBlendMaterial = comp.entity:searchEntity("gaussianBlurYAndBlend"):getComponent("MeshRenderer").material
    self.gaussianBlurYAndBlendMaterial:setFloat("u_diff", self.u_diff)
    self.gaussianBlurYAndBlendMaterial:setFloat("u_invert", self.u_invert)
    self.gaussianBlurYAndBlendMaterial:setVec2("u_position", self.u_position)
    self.gaussianBlurYAndBlendMaterial:setFloat("u_aspect", self.u_aspect)
    self.gaussianBlurYAndBlendMaterial:setFloat("u_rotation", self.u_rotation)
    self.gaussianBlurYAndBlendMaterial:setVec2("u_scale", self.u_scale)

    self.enableTransformUV = self.u_position.x ~= 0.0 or self.u_position.y ~= 0.0 or self.u_scale.x ~= 1.0 or self.u_scale.y ~= 1.0 or self.u_rotation ~= 0.0
    if (self.enableTransformUV) then
        self.gaussianBlurYAndBlendMaterial:setInt("u_enableTransformUV", 1)
    else
        self.gaussianBlurYAndBlendMaterial:setInt("u_enableTransformUV", 0)
    end
end

function Process:getEffectAttr(key, comp)
    if key == "posX" then
        return self.u_position.x
    elseif key == "posY" then
        return self.u_position.y
    elseif key == "scaleX" then
        return self.u_scale.x;
    elseif key == "scaleY" then
        return self.u_scale.y;
    elseif key == "rotationZ" then
        return self.u_rotation;
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
        -- Amaz.LOGI("wjj test setEffectAttr, key: ", key)
        -- Amaz.LOGI("wjj test setEffectAttr, value: ", value)
        local center = Amaz.Vector2f(value, self.u_position.y)
        _setEffectAttr("u_position", center, comp)
    elseif "py" == key or "posY" == key then
        -- Amaz.LOGI("wjj test setEffectAttr, key: ", key)
        -- Amaz.LOGI("wjj test setEffectAttr, value: ", value)
        local center = Amaz.Vector2f(self.u_position.x, -1.0 * value)
        _setEffectAttr("u_position", center, comp)
    elseif "sx" == key or "scaleX" == key then
        -- Amaz.LOGI("wjj test setEffectAttr, key: ", key)
        -- Amaz.LOGI("wjj test setEffectAttr, value: ", value)
        local size = Amaz.Vector2f(value, self.u_scale.y)
        _setEffectAttr("u_scale", size, comp)
    elseif "sy" == key or "scaleY" == key then
        -- Amaz.LOGI("wjj test setEffectAttr, key: ", key)
        -- Amaz.LOGI("wjj test setEffectAttr, value: ", value)
        local size = Amaz.Vector2f(self.u_scale.x, value)
        _setEffectAttr("u_scale", size, comp)
    elseif key == "rz" or key == "rotationZ" then
        -- Amaz.LOGI("wjj test setEffectAttr, key: ", key)
        -- Amaz.LOGI("wjj test setEffectAttr, value: ", value)
        local r = -value
        local rotation = (360.0 - r) * 2.0 * math.pi / 360.0
        _setEffectAttr("u_rotation", rotation, comp)
    elseif key == "feather" then
        local diff = value
        _setEffectAttr("u_diff", diff, comp)
    elseif key == "expansion" then
        local expansion = value
        _setEffectAttr("u_expansion", expansion, comp)
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
    self.u_inputSize = Amaz.Vector2f(Amaz.BuiltinObject.getOutputTextureWidth(), Amaz.BuiltinObject.getOutputTextureHeight())
    self.gaussianBlurXMaterial:setFloat("u_diff", self.u_diff)
    self.gaussianBlurXMaterial:setVec2("u_inputSize", self.u_inputSize)
    
    self.enableTransformUV = self.u_position.x ~= 0.0 or self.u_position.y ~= 0.0 or self.u_scale.x ~= 1.0 or self.u_scale.y ~= 1.0 or self.u_rotation ~= 0.0
    if (self.enableTransformUV) then
        self.gaussianBlurYAndBlendMaterial:setInt("u_enableTransformUV", 1)
    else
        self.gaussianBlurYAndBlendMaterial:setInt("u_enableTransformUV", 0)
    end
    -- TRS
    self.gaussianBlurYAndBlendMaterial:setVec2("u_position", self.u_position)
    self.gaussianBlurYAndBlendMaterial:setFloat("u_rotation", self.u_rotation)
    self.gaussianBlurYAndBlendMaterial:setVec2("u_scale", self.u_scale)
    self.u_aspect = Amaz.BuiltinObject.getOutputTextureWidth() / Amaz.BuiltinObject.getOutputTextureHeight()
    self.gaussianBlurYAndBlendMaterial:setFloat("u_aspect", self.u_aspect)
    self.gaussianBlurYAndBlendMaterial:setFloat("u_diff", self.u_diff)
    self.gaussianBlurYAndBlendMaterial:setFloat("u_invert", self.u_invert)
    self.gaussianBlurYAndBlendMaterial:setVec2("u_inputSize", self.u_inputSize)


    -- self.material:setTex("u_albedo", self.InputTex)
    self.gaussianBlurYAndBlendMaterial:setTex("u_albedo", self.InputTex)
    self.out_cam.renderTexture = self.OutputTex
end

exports.Process = Process
return exports
