local exports = exports or {}
local LightRays = LightRays or {}
LightRays.__index = LightRays
---@class LightRays: ScriptComponent
---@field light_intensity number [UI(Range={0, 10}, Slider)]
---@field light_color Color
---@field light_coordinate Vector2f [UI(Range={0,1}, Slider)]
---@field light_radius number [UI(Range={0, 400})]
---@field scale_degree number
---@field light_shape string [UI(Option={"round","square"})]
---@field light_warpSoftness number [UI(Range={0, 100}, Slider)]
---@field light_blur int [UI(Range={0, 100}, Slider)]
---@field light_colorSource Bool
---@field light_transferMode [UI(Option={"None","Add","Lighten","Screen"})]
---@field light_enhance Bool
---@field InputTex Texture
---@field OutputTex Texture

function LightRays.new(construct, ...)
    local self = setmetatable({}, LightRays)
    if construct and LightRays.constructor then LightRays.constructor(self, ...) end

    self.InputTex = nil
    self.OutputTex = nil
    self.startTime = 0.0
    self.endTime = 3.0
    self.curTime = 0.0
    
    self.height = 0
    self.progress = 0.0
    self.autoPlay = true
    self.light_shape = "square"
    self.light_colorSource = true
    self.light_enhance = true
    self.light_transferMode = "Add"
    self.light_color = Amaz.Color(1.,1.,1.,1.)
    self.light_coordinate = Amaz.Vector2f(0.5,0.5)
    self.light_radius = 5.
    self.light_intensity = 0.
    self.light_blur = 0.
    self.light_warpSoftness = 50.
    self.scale_degree = 45.0;
    return self
end

function LightRays:constructor()

end

function LightRays:onStart(comp)
    self.cam = comp.entity:searchEntity("CameraDistortion"):getComponent("Camera")
    self.material = comp.entity:searchEntity("passLightRays"):getComponent("MeshRenderer").material
    
    self.materialBlurX = comp.entity:searchEntity("passBlurX"):getComponent("MeshRenderer").material
    self.materialBlurY = comp.entity:searchEntity("passBlurY"):getComponent("MeshRenderer").material
    self.materialBlend = comp.entity:searchEntity("passBlend"):getComponent("MeshRenderer").material
    self.blurX = comp.entity:searchEntity("CameraBlurX")
    self.blurY = comp.entity:searchEntity("CameraBlurY")
    self.blend = comp.entity:searchEntity("CameraBlend")
    self.camBlurX = comp.entity:searchEntity("CameraBlurX"):getComponent("Camera")
    self.camBlurY = comp.entity:searchEntity("CameraBlurY"):getComponent("Camera")
    self.camBlend = comp.entity:searchEntity("CameraBlend"):getComponent("Camera")
end

function LightRays:setEffectAttr(key, value, comp)
    local function _setEffectAttr(_key, _value)
        if self[_key] ~= nil then
            self[_key] = _value
            if comp and comp.properties ~= nil then
                comp.properties:set(_key, _value)
            end
        end
    end

    if key == "light_transferMode" then
        local combine = "None"
        if     value == 1 then combine = "Add"
        elseif value == 2 then combine = "Lighten"
        elseif value == 3 then combine = "Screen"
        end
        _setEffectAttr(key, combine)
    else
        _setEffectAttr(key, value)
    end
end

function LightRays:onUpdate(comp, detalTime)
    local w = self.OutputTex.width
    local h = self.OutputTex.height
    self.scale = w/h

    self.material:setTex("inputTexture", self.InputTex)
    self.cam.renderTexture = self.OutputTex

    local light_shape = 0.
    if (self.light_shape == "round") then
        light_shape = 0
    elseif (self.light_shape == "square") then
        light_shape = 1
    end
    self.material:setFloat("light_shape",light_shape)

    local light_transferMode = 0.
    if (self.light_transferMode == "None") then
        light_transferMode = 0
    elseif (self.light_transferMode == "Add") then
        light_transferMode = 1
    elseif (self.light_transferMode == "Lighten") then
        light_transferMode = 2
    elseif (self.light_transferMode == "Screen") then
        light_transferMode = 3
    end 
    self.material:setFloat("light_intensity", self.light_intensity)
    self.material:setFloat("light_radius", self.light_radius);
    self.material:setFloat("light_warpSoftness", self.light_warpSoftness);
    self.material:setFloat("light_direction", self.light_direction);
    self.material:setFloat("scale",self.scale);
    self.material:setVec3("light_color", Amaz.Vector3f(self.light_color.r, self.light_color.g, self.light_color.b));
    self.material:setVec2("light_coordinate", Amaz.Vector2f(self.light_coordinate.x, self.light_coordinate.y));
    self.material:setFloat("light_colorSource", self.light_colorSource and 1 or 0)
    self.material:setFloat("light_enhance",self.light_enhance and 1 or 0)
    self.material:setFloat("scale_degree",self.scale_degree)
    self.material:setFloat("light_transferMode",light_transferMode)
    self.materialBlend:setFloat("light_transferMode",light_transferMode)

    self.materialBlurX:setFloat("u_Sample", math.floor(math.max(self.light_blur, 0.0)))
    self.materialBlurY:setFloat("u_Sample", math.floor(math.max(self.light_blur, 0.0)))
    if self.light_blur >= 1 then 
        self.camBlurX.renderTexture.width = 0.5 * w
        self.camBlurX.renderTexture.height = 0.5 * h
        self.camBlurY.renderTexture.width = 0.5 * w
        self.camBlurY.renderTexture.height = 0.5 * h
        self.cam.renderTexture = self.camBlurY.renderTexture
        self.materialBlend:setTex("inputTexture", self.InputTex)
        self.material:setFloat("light_transferMode", 0)
        self.blurX.visible = true
        self.blurY.visible = true
        self.blend.visible = true
    else
        self.camBlurX.renderTexture.width = 0.01 * w
        self.camBlurX.renderTexture.height = 0.01 * h
        self.camBlurY.renderTexture.width = 0.01 * w
        self.camBlurY.renderTexture.height = 0.01 * h
        self.cam.renderTexture = self.OutputTex
        self.blurX.visible = false
        self.blurY.visible = false
        self.blend.visible = false
    end

end

exports.LightRays = LightRays
return exports
