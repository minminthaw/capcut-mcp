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
    self.effectID = nil
    self.myMatting = nil
    self.enableTransformUV = false
    -- set preview_effect_id and blendMode to control if use previewColor
    self.preview_effect_id = nil
    self.blendMode = false
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
    self.expandMaterial = comp.entity:searchEntity("expandMask"):getComponent("MeshRenderer").material
    self.expandMaterial:setFloat("u_expansion", self.u_expansion)

    self.gaussianBlurXMaterial = comp.entity:searchEntity("gaussianBlurX"):getComponent("MeshRenderer").material
    self.gaussianBlurXMaterial:setFloat("u_diff", self.u_diff)

    self.material = comp.entity:searchEntity("Mask"):getComponent("MeshRenderer").material
    self.material:setFloat("u_diff", self.u_diff)
    self.material:setFloat("u_invert", self.u_invert)
    self.material:setVec2("u_position", self.u_position)
    self.material:setFloat("u_aspect", self.u_aspect)
    self.material:setFloat("u_rotation", self.u_rotation)
    self.material:setVec2("u_scale", self.u_scale)
    self.enableTransformUV = self.u_position.x ~= 0.0 or self.u_position.y ~= 0.0 or self.u_scale.x ~= 1.0 or self.u_scale.y ~= 1.0 or self.u_rotation ~= 0.0
    if (self.enableTransformUV) then
        self.material:setInt("u_enableTransformUV", 1)
    else
        self.material:setInt("u_enableTransformUV", 0)
    end
    if self.effectID ~= nil then
        self.myMatting = Amaz.BuiltinObject.getUserTexture(self.effectID)
        self.expandMaterial:setTex("u_mattingmask", self.myMatting)
    end
    self.out_cam = comp.entity:searchEntity("customMaskCamera"):getComponent("Camera")
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

    if "px" == key then
        local center = Amaz.Vector2f(value, self.u_position.y)
        _setEffectAttr("u_position", center, comp)
    elseif "py" == key then
        local center = Amaz.Vector2f(self.u_position.x, -1.0 * value)
        _setEffectAttr("u_position", center, comp)
    elseif key == "sx" then
        local size = Amaz.Vector2f(value, self.u_scale.y)
        _setEffectAttr("u_scale", size, comp)
    elseif key == "sy" then
        local size = Amaz.Vector2f(self.u_scale.x, value)
        _setEffectAttr("u_scale", size, comp)
    elseif key == "rz" then
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
    elseif key == "effectID" then
        self.effectID = value
    end
end

function Process:onEvent(sys, event)
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        -- tint
        if event.args:get(0) == "preview_effect_id" then
            self.preview_effect_id = event.args:get(1)
        end
        if event.args:get(0) == "blendMode" then
            -- blend with preview color or not
            self.blendMode = event.args:get(1)
        end
    end
end

function Process:onUpdate(comp, delta)
    self.u_inputSize = Amaz.Vector2f(Amaz.BuiltinObject.getOutputTextureWidth(), Amaz.BuiltinObject.getOutputTextureHeight())

    self.gaussianBlurXMaterial:setFloat("u_diff", self.u_diff)
    self.gaussianBlurXMaterial:setVec2("u_inputSize", self.u_inputSize)
    
    if self.effectID ~= nil then
        self.myMatting = Amaz.BuiltinObject.getUserTexture(self.effectID)
        self.expandMaterial:setTex("u_mattingmask", self.myMatting)
        self.expandMaterial:setVec2("u_inputSize", self.u_inputSize)
        self.expandMaterial:setFloat("u_expansion", self.u_expansion)
        if self.effectID == self.preview_effect_id and self.blendMode then
            self.material:setInt("u_usePreviewColor", 1)
        else
            self.material:setInt("u_usePreviewColor", 0)
        end
        if (self.myMatting) then 
            self.material:setInt("u_getValidMask", 1)
        else
            self.material:setInt("u_getValidMask", 0)
        end
    end
    self.enableTransformUV = self.u_position.x ~= 0.0 or self.u_position.y ~= 0.0 or self.u_scale.x ~= 1.0 or self.u_scale.y ~= 1.0 or self.u_rotation ~= 0.0
    if (self.enableTransformUV) then
        self.material:setInt("u_enableTransformUV", 1)
    else
        self.material:setInt("u_enableTransformUV", 0)
    end
    -- TRS
    self.material:setVec2("u_position", self.u_position)
    self.material:setFloat("u_rotation", self.u_rotation)
    self.material:setVec2("u_scale", self.u_scale)
    self.u_aspect = Amaz.BuiltinObject.getOutputTextureWidth() / Amaz.BuiltinObject.getOutputTextureHeight()
    self.material:setFloat("u_aspect", self.u_aspect)
    self.material:setFloat("u_diff", self.u_diff)
    self.material:setFloat("u_invert", self.u_invert)
    self.material:setVec2("u_inputSize", self.u_inputSize)
    self.material:setTex("u_albedo", self.InputTex)
    self.out_cam.renderTexture = self.OutputTex

end

exports.Process = Process
return exports
