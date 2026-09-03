local isEditor = (Amaz.Macros and Amaz.Macros.EditorSDK) and true or false
local exports = exports or {}
local LumiBlit = LumiBlit or {}
LumiBlit.__index = LumiBlit
---@class LumiBlit : ScriptComponent
---@field InputTex Texture
---@field OutputTex Texture
---@field lumiSharedRt Vector [UI(Type="Texture")]

local AE_EFFECT_TAG = 'AE_EFFECT_TAG LumiTag'

local function createRenderTexture(width, height, filterMag, filterMin)
    local rt = Amaz.RenderTexture()
    rt.width = width
    rt.height = height
    rt.depth = 1
    rt.filterMag = filterMag or Amaz.FilterMode.LINEAR
    rt.filterMin = filterMin or Amaz.FilterMode.LINEAR
    rt.filterMipmap = Amaz.FilterMipmapMode.NONE
    rt.attachment = Amaz.RenderTextureAttachment.NONE
    return rt
end

local function updateTexSize(rt, width, height)
    if rt == nil or width <= 0 or height <= 0 then
        return
    end
    if rt.width ~= width or rt.height ~= height then
        rt.width = width
        rt.height = height
    end
end

function LumiBlit.new(construct, ...)
    local self = setmetatable({}, LumiBlit)

    self.__lumi_type = "lumi_obj"
    self.__lumi_rt_pingpong_type = "custom"

    self.InputTex = nil
    self.OutputTex = nil

    return self
end

function LumiBlit:setEffectAttr(key, value, comp)
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

function LumiBlit:onStart(comp)
    self.entity = comp.entity
    self.TAG = AE_EFFECT_TAG .. ' ' .. self.entity.name
    Amaz.LOGI(self.TAG, 'onStart')

    -- Use entity instead of scene 
    self.camera = self.entity:searchEntity("BlitCamera"):getComponent("Camera")
    self.material = self.entity:searchEntity("BlitPass"):getComponent("MeshRenderer").material

    -- if temporary texture has the same dimensions as self.OutputTex, and need not persist, advised to used sharedRT
    if self.lumiSharedRt and self.lumiSharedRt:size() > 0 then
        self.midTex = self.lumiSharedRt:get(0)
    end

    -- if render texture needs to persist, or dimensions are exposed to be modified, then .rt files cannot be used, create the texture using the code below
    -- self.myTex = createRenderTexture(w, h)
end

function LumiBlit:onUpdate(comp, deltaTime)
    -- set the input and output textures to be displayed
    if self.OutputTex then
        self.camera.renderTexture = self.OutputTex
    end
    self.material:setTex("u_inputTexture", self.InputTex)

    -- if using sharedRT, dimensions need to be consistent with self.InputTex or self.OutputTex
    if self.midTex then
        if self.midTex.width ~= self.OutputTex.width or self.midTex.height ~= self.OutputTex.height then
            self.midTex.width = self.OutputTex.width
            self.midTex.height = self.OutputTex.height
        end
    end

    -- temporary texture's dimensions need to be based on self.InputTex or self.OutputTex's dimensions
    if self.myTex then
        local scale = 1.0 -- the necessary scale factor
        local realW = self.OutputTex.width * scale
        local realH = self.OutputTex.height * scale

        -- when temporary texture type is RenderTexture
        self.myTex.width = realW
        self.myTex.height = realH

        -- when temporary texture type is ScreenRenderTexture
        self.myTex.pecentX = realW / Amaz.BuiltinObject.getOutputTextureWidth()
        self.myTex.pecentY = realH / Amaz.BuiltinObject.getOutputTextureHeight()
    end
end

exports.LumiBlit = LumiBlit
return exports
