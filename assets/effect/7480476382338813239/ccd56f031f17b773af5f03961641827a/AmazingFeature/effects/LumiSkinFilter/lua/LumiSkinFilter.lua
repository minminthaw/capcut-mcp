local exports = exports or {}

---@class LumiSkinFilter : ScriptComponent
---@field skinFilterIntensity number [UI(Range={0., 1.}, Drag)]
---@field bgFilterIntensity number [UI(Range={0., 1.}, Drag)]
---@field bgLut Texture
---@field skinLut Texture
---@field skinMask Texture
---@field InputTex Texture
---@field OutputTex Texture
local LumiSkinFilter = LumiSkinFilter or {}
LumiSkinFilter.__index = LumiSkinFilter

function LumiSkinFilter.new(construct, ...)
    local self = setmetatable({}, LumiSkinFilter)
    self.maskNum = 0
    self.skinFilterIntensity = 0.5
    self.bgFilterIntensity = 0.5
    self.bgLut = nil
    self.skinLut = nil
    self.skinMask = nil
    self.InputTex = nil
    self.OutputTex = nil
    return self
end

function LumiSkinFilter:setEffectAttr(key, value, comp)
    local function _setEffectAttr(_key, _value, _force)
        if _force or self[_key] ~= nil then
            self[_key] = _value
            if comp and comp.properties ~= nil then
                comp.properties:set(_key, _value)
            end
        end
    end

    _setEffectAttr(key, value, true)
end

function LumiSkinFilter:onStart(comp)
    self.entity = comp.entity
    self.filterCamera = self.entity:searchEntity("SkinFilterCamera")
                            :getComponent("Camera")
    self.skinFilter = self.entity:searchEntity("SkinFilter"):getComponent(
                          "MeshRenderer").material

end

function LumiSkinFilter:onUpdate(comp, deltaTime)
    if self.OutputTex then self.filterCamera.renderTexture = self.OutputTex end
    self.skinFilter:setTex("u_inputTexture", self.InputTex)
    self.skinFilter:setTex("u_maskTex", self.skinMask)
    self.skinFilter:setTex("u_bgLut", self.bgLut)
    self.skinFilter:setTex("u_skinLut", self.skinLut)
    self.skinFilter:setFloat("u_bgIntensity", self.bgFilterIntensity)
    self.skinFilter:setFloat("u_skinIntensity", self.skinFilterIntensity)
end

exports.LumiSkinFilter = LumiSkinFilter
return exports
