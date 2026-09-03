---@class LumiDeepGlow : ScriptComponent
---@field threshold number [UI(Range={0., 2.}, Drag)]
---@field thresholdSmooth number [UI(Range={0., 1.}, Drag)]
---@field radius number [UI(Range={0., 1000.}, Drag)]
---@field exposure number [UI(Range={0., 10.}, Drag)]
---@field blendMode string [UI(Option={"Add","Screen"})]
---@field view string [UI(Option={"Glow Input","Final Render"})]
---@field sourceOpacity number [UI(Range={0., 1.}, Drag)]
---@field gammaCorrect Bool
---@field unmult Bool
---@field gammaValue number [UI(Range={1., 3.}, Drag)]
---@field glowIntensity number [UI(Range={0., 1.}, Drag)]
---@field quality number [UI(Range={0., 1.}, Drag)]
---@field InputTex Texture
---@field ThresholdTex Texture
---@field OutputTex Texture
local exports = exports or {}
local LumiDeepGlow = LumiDeepGlow or {}
LumiDeepGlow.__index = LumiDeepGlow

------------ util functions ------------
local function clamp(val, min, max) return math.max(math.min(val, max), min) end

------------ class functions for ScriptComponent ------------
function LumiDeepGlow.new(construct, ...)
    local self = setmetatable({}, LumiDeepGlow)

    if construct and LumiDeepGlow.constructor then
        LumiDeepGlow.constructor(self, ...)
    end

    self.__lumi_type = "lumi_effect"
    self.__lumi_rt_pingpong_type = "custom"

    self.radius = 0.
    self.exposure = 0.
    self.threshold = 0.
    self.thresholdSmooth = 0.

    self.blendMode = "Screen"
    self.view = "Final Render"

    self.sourceOpacity = 0.

    self.gammaCorrect = true
    self.gammaValue = 2.2
    self.unmult = false

    self.blurWidth = 0
    self.blurHeight = 0
    self.quality = 0.5

    self.InputTex = nil
    self.ThresholdTex = nil
    self.OutputTex = nil

    return self
end

function LumiDeepGlow:constructor() end

function LumiDeepGlow:onStart(comp)
    self.matThreshold = comp.entity:searchEntity("PassThreshold"):getComponent(
                            "MeshRenderer").material

    self.GlowIter1 = comp.entity:searchEntity("GlowIter_1"):getComponent(
                         "ScriptComponent")
    self.GlowIter2 = comp.entity:searchEntity("GlowIter_2"):getComponent(
                         "ScriptComponent")
    self.GlowIter3 = comp.entity:searchEntity("GlowIter_3"):getComponent(
                         "ScriptComponent")
    self.GlowIter4 = comp.entity:searchEntity("GlowIter_4"):getComponent(
                         "ScriptComponent")
    self.GlowIter5 = comp.entity:searchEntity("GlowIter_5"):getComponent(
                         "ScriptComponent")
    self.GlowIter6 = comp.entity:searchEntity("GlowIter_6"):getComponent(
                         "ScriptComponent")
    self.GlowIter7 = comp.entity:searchEntity("GlowIter_7"):getComponent(
                         "ScriptComponent")
    self.GlowIter8 = comp.entity:searchEntity("GlowIter_8"):getComponent(
                         "ScriptComponent")

    self.matBlend = comp.entity:searchEntity("PassBlend"):getComponent(
                        "MeshRenderer").material
    self.camBlend = comp.entity:searchEntity("CameraBlend"):getComponent(
                        "Camera")
end

function LumiDeepGlow:setEffectAttr(key, value, comp)
    local function _setEffectAttr(_key, _value)
        if self[_key] ~= nil then
            self[_key] = _value
            if comp and comp.properties ~= nil then
                comp.properties:set(_key, _value)
            end
        end
    end

    if key == "view" then
        local view = "Final Render"
        if value == 0 then view = "Glow Input" end
        _setEffectAttr(key, view)

    elseif key == "blendMode" then
        local blendMode = "Add"
        if value == 1 then blendMode = "Screen" end
        _setEffectAttr(key, blendMode)
    else
        _setEffectAttr(key, value)
    end
end

function LumiDeepGlow:onUpdate(comp, detalTime)
    -- Prepare Parms
    local toggle = (self.radius > 0)
    self.matBlend:setInt("u_toggle", toggle and 1 or 0)

    -- Texture settings
    self.matThreshold:setTex("u_inputTex", self.InputTex)
    self.matThreshold:setFloat("u_threshold", self.threshold)
    self.matThreshold:setFloat("u_thresholdSmooth", self.thresholdSmooth)
    self.matThreshold:setFloat("u_exposure", self.exposure)
    self.matThreshold:setInt("u_gamma", self.gammaCorrect and 1 or 0)
    self.matThreshold:setFloat("u_gammaValue", self.gammaValue)

    -- Glow Settings
    local GlowIter1 = Amaz.ScriptUtils.getLuaObj(self.GlowIter1:getScript())
    local GlowIter2 = Amaz.ScriptUtils.getLuaObj(self.GlowIter2:getScript())
    local GlowIter3 = Amaz.ScriptUtils.getLuaObj(self.GlowIter3:getScript())
    local GlowIter4 = Amaz.ScriptUtils.getLuaObj(self.GlowIter4:getScript())
    local GlowIter5 = Amaz.ScriptUtils.getLuaObj(self.GlowIter5:getScript())
    local GlowIter6 = Amaz.ScriptUtils.getLuaObj(self.GlowIter6:getScript())
    local GlowIter7 = Amaz.ScriptUtils.getLuaObj(self.GlowIter7:getScript())
    local GlowIter8 = Amaz.ScriptUtils.getLuaObj(self.GlowIter8:getScript())

    local w = self.OutputTex.width * 0.5 * self.quality
    local h = self.OutputTex.height * 0.5 * self.quality
    if self.blurWidth ~= w or self.blurHeight ~= h then
        self.blurWidth = w
        self.blurHeight = h
        self.ThresholdTex.width = w
        self.ThresholdTex.height = h
        GlowIter1.BlurX.width = w
        GlowIter1.BlurX.height = h
        GlowIter1.OutputTex.width = w
        GlowIter1.OutputTex.height = h
        GlowIter2.OutputTex.width = w
        GlowIter2.OutputTex.height = h
        GlowIter3.OutputTex.width = w
        GlowIter3.OutputTex.height = h
        GlowIter4.OutputTex.width = w
        GlowIter4.OutputTex.height = h
        GlowIter5.OutputTex.width = w
        GlowIter5.OutputTex.height = h
        GlowIter6.OutputTex.width = w
        GlowIter6.OutputTex.height = h
        GlowIter7.OutputTex.width = w
        GlowIter7.OutputTex.height = h
        GlowIter8.OutputTex.width = w
        GlowIter8.OutputTex.height = h
    end

    local downSample1 = 1
    local downSample2 = 1
    local downSample3 = math.max(math.min(self.radius / 128, 2.0), 1.0)
    local downSample4 = math.max(math.min(self.radius / 64, 4.0), 1.0)
    local downSample5 = math.max(self.radius / 32, 1.0)
    local downSample6 = math.max(self.radius / 16, 1.0)
    local downSample7 = math.max(self.radius / 8, 1.0)
    local downSample8 = math.max(self.radius / 4, 1.0)

    GlowIter1.intensity = self.radius / 16 * 0.125
    GlowIter2.intensity = self.radius / 16 * 0.25
    GlowIter3.intensity = self.radius / 16 / downSample3 * 0.5
    GlowIter4.intensity = self.radius / 16 / downSample4
    GlowIter5.intensity = self.radius / downSample5 * 0.125
    GlowIter6.intensity = self.radius / downSample6 * 0.25
    GlowIter7.intensity = self.radius / downSample7 * 0.5
    GlowIter8.intensity = self.radius / downSample8

    GlowIter1.downSample = downSample1
    GlowIter2.downSample = downSample2
    GlowIter3.downSample = downSample3
    GlowIter4.downSample = downSample4
    GlowIter5.downSample = downSample5
    GlowIter6.downSample = downSample6
    GlowIter7.downSample = downSample7
    GlowIter8.downSample = downSample8

    GlowIter1.gammaValue = self.gammaValue
    GlowIter2.gammaValue = self.gammaValue
    GlowIter3.gammaValue = self.gammaValue
    GlowIter4.gammaValue = self.gammaValue
    GlowIter5.gammaValue = self.gammaValue
    GlowIter6.gammaValue = self.gammaValue
    GlowIter7.gammaValue = self.gammaValue
    GlowIter8.gammaValue = self.gammaValue

    -- Blending Options
    if self.OutputTex then self.camBlend.renderTexture = self.OutputTex end

    self.matBlend:setTex("u_inputTex", self.InputTex)
    self.matBlend:setTex("u_thresholdTex", self.ThresholdTex)
    self.matBlend:setTex("u_blurTex", self.BlurTex)
    self.matBlend:setFloat("u_srcOpacity", self.sourceOpacity)
    self.matBlend:setFloat("u_exposure", self.exposure)
    self.matBlend:setInt("u_gamma", self.gammaCorrect and 1 or 0)
    self.matBlend:setInt("u_unmult", self.unmult and 1 or 0)
    self.matBlend:setFloat("u_gammaValue", self.gammaValue)
    self.matBlend:setFloat("u_glowIntensity", self.glowIntensity)

    -- View Options
    if self.view == "Glow Input" then
        self.matThreshold:setInt("u_viewMode", 0)
        self.matBlend:setInt("u_viewMode", 0)

    elseif self.view == "Final Render" then
        self.matThreshold:setInt("u_viewMode", 1)
        self.matBlend:setInt("u_viewMode", 1)

        if self.blendMode == "Add" then
            self.matThreshold:setInt("u_blendMode", 0)
            self.matBlend:setInt("u_blendMode", 0)
        elseif self.blendMode == "Screen" then
            self.matThreshold:setInt("u_blendMode", 1)
            self.matBlend:setInt("u_blendMode", 1)
        end
    end
end

function LumiDeepGlow:onDestroy(comp) end

function LumiDeepGlow:updateMaterials(comp, detalTime) end

exports.LumiDeepGlow = LumiDeepGlow
return exports
