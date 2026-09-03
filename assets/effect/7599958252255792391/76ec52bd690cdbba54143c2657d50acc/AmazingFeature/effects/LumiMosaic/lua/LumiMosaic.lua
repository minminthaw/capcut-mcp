local isEditor = (Amaz.Macros and Amaz.Macros.EditorSDK) and true or false
local exports = exports or {}
local LumiMosaic = LumiMosaic or {}
LumiMosaic.__index = LumiMosaic
---@class LumiMosaic : ScriptComponent
---@field horizontal int [UI(Range={0, 4000}, Slider)]
---@field vertical int [UI(Range={0, 4000}, Slider)]
---@field sharp boolean
---@field InputTex Texture
---@field OutputTex Texture
---@field lumiSharedRt Vector [UI(Type="Texture")]

function LumiMosaic.new(construct, ...)
    local self = setmetatable({}, LumiMosaic)

    if construct and LumiMosaic.constructor then LumiMosaic.constructor(self, ...) end

    self.InputTex = nil
    self.OutputTex = nil

    self.horizontal = 10
    self.vertical = 10
    self.sharp = false

    return self
end

function LumiMosaic:onStart(comp)
    self.camera =  comp.entity:searchEntity("MosaicCamera"):getComponent("Camera")
    self.material =  comp.entity:searchEntity("MosaicCamera"):searchEntity("MosaicPass"):getComponent("MeshRenderer").material

    self.horzEntity = comp.entity:searchEntity("MosaicHorzCamera")
    self.horzCamera = self.horzEntity:getComponent("Camera")
    self.horzMaterial = self.horzEntity:searchEntity("MosaicHorzPass"):getComponent("MeshRenderer").material
    self.horzCamera.renderTexture = self.lumiSharedRt:get(0)
end

function LumiMosaic:setEffectAttr(key, value, comp)
    local function _setEffectAttr(_key, _value)
        if self[_key] ~= nil then
            self[_key] = _value
            if comp and comp.properties ~= nil then
                comp.properties:set(_key, _value)
            end
        end
    end

    if key == "sharp"
    or key == "horizontal"
    or key == "vertical"
    then
        _setEffectAttr(key, value)
    else
        _setEffectAttr(key, value)
    end
end

function LumiMosaic:onUpdate(comp, deltaTime)
    self.camera.renderTexture = self.OutputTex
    if self.horzCamera.renderTexture.width ~= self.OutputTex.width
    or self.horzCamera.renderTexture.height ~= self.OutputTex.height
    then
        self.horzCamera.renderTexture.width = self.OutputTex.width
        self.horzCamera.renderTexture.height = self.OutputTex.height
    end

    self.material:setInt("u_horz", self.horizontal)
    self.material:setInt("u_vert", self.vertical)

    if self.sharp or (self.horizontal == 0 and self.vertical == 0) then
        self.horzEntity.visible = false

        self.material:setTex("u_inputTexture", self.InputTex)
        self.material:setInt("u_sharp", 1)
    else
        self.horzEntity.visible = true

        self.horzMaterial:setInt("u_horz", self.horizontal)
        self.horzMaterial:setInt("u_vert", self.vertical)
        self.horzMaterial:setTex("u_inputTexture", self.InputTex)
        self.material:setTex("u_inputTexture", self.horzCamera.renderTexture)
        self.material:setInt("u_sharp", 0)
    end
end

exports.LumiMosaic = LumiMosaic
return exports
