local isEditor = (Amaz.Macros and Amaz.Macros.EditorSDK) and true or false
local exports = exports or {}
local LumiAnimSeqLoadAndCrop = LumiAnimSeqLoadAndCrop or {}
LumiAnimSeqLoadAndCrop.__index = LumiAnimSeqLoadAndCrop
---@class LumiAnimSeqLoadAndCrop : ScriptComponent
---@field animSeqType string [UI(Option={"Video", "Image", "Texture"})]
---@field cropType string [UI(Option={"Stretch", "Fill", "Fit"})]
---@field edgeType string [UI(Option={"Tile", "Mirror", "Clamp", "Empty"})]
---@field opacity double [UI(Range={0, 1}, Drag)]
---@field speed double [UI(Range={0.001, 10}, Drag)]
---@field scale number [UI(Range={0, 5}, Drag)]
---@field seqTime number [UI(Range={0, 100}, Drag)]
---@field enableVideoAlphaBlend boolean
---@field videoFilename String
---@field animSeq AnimSeq
---@field seqTex Texture
---@field InputTex Texture
---@field OutputTex Texture

local AE_EFFECT_TAG = 'AE_EFFECT_TAG LumiTag'

local cropTypeName = {
    "Stretch", "Fill", "Fit",
}
setmetatable(cropTypeName, {__index = function(_, _) return cropTypeName[1] end})
local cropTypeIndex = {}
for index, value in ipairs(cropTypeName) do cropTypeIndex[value] = index - 1 end
setmetatable(cropTypeIndex, {
    __index = function(_, key)
        Amaz.LOGE(AE_EFFECT_TAG, "Unsupported SeqCrop Type: " .. key)
        return 0
    end
})

local edgeTypeName = {
    "Tile", "Mirror", "Clamp", "Empty",
}
setmetatable(edgeTypeName, {__index = function(_, _) return edgeTypeName[1] end})
local edgeTypeIndex = {}
for index, value in ipairs(edgeTypeName) do edgeTypeIndex[value] = index - 1 end
setmetatable(edgeTypeIndex, {
    __index = function(_, key)
        Amaz.LOGE(AE_EFFECT_TAG, "Unsupported Edge Type: " .. key)
        return 0
    end
})

function LumiAnimSeqLoadAndCrop.new(construct, ...)
    local self = setmetatable({}, LumiAnimSeqLoadAndCrop)

    if construct and LumiAnimSeqLoadAndCrop.constructor then LumiAnimSeqLoadAndCrop.constructor(self, ...) end

    self.animSeqType = "Texture"
    self.cropType = "Stretch"
    self.edgeType = "Empty"
    self.opacity = 1.0
    self.speed = 1.0
    self.scale = 1.0
    self.seqTime = 0.0

    -- Video
    self.videoFilename = ""
    self.enableVideoAlphaBlend = true

    -- Image sequence
    self.animSeq = nil

    -- Texture
    self.seqTex = nil
    self.seqTexName = ""

    self.InputTex = nil
    self.OutputTex = nil
    return self
end

function LumiAnimSeqLoadAndCrop:onStart(comp)
    self.entity = comp.entity
    self.TAG = AE_EFFECT_TAG .. ' ' .. self.entity.name

    self.camera = self.entity:searchEntity("AnimSeqCamera"):getComponent("Camera")
    self.renderer = self.entity:searchEntity("AnimSeqPass"):getComponent("Sprite2DRenderer")
    self.material = self.renderer.material
    self.videoAnim = self.entity:searchEntity("AnimSeqPass"):getComponent("VideoAnimSeq")
    self.seqAnim = self.entity:searchEntity("AnimSeqPass"):getComponent("AnimSeqComponent")
end

function LumiAnimSeqLoadAndCrop:setEffectAttr(key, value, comp)
    local function _setEffectAttr(_key, _value, _comp)
        if self[_key] ~= nil then
            self[_key] = _value
            if _comp and _comp.properties ~= nil then
                _comp.properties:set(_key, _value)
            end
        end
    end

    if key == "cropType" then
        local type = cropTypeName[value + 1]
        _setEffectAttr(key, type, comp)
    elseif key == "edgeType" then
        local type = edgeTypeName[value + 1]
        _setEffectAttr(key, type, comp)
    elseif key == "seqTex" then
        _setEffectAttr(key, value, comp)
        _setEffectAttr("animSeqType", "Texture", comp)
    else
        _setEffectAttr(key, value, comp)
    end
end

function LumiAnimSeqLoadAndCrop:afterAnimSeqSystemUpdate(comp)
    if self.animSeqType == "Image" then
        if self.material then
            local seqTex = self.material:getTex("u_seqTexture")
            self.material:setVec2("u_seqTexSize", Amaz.Vector2f(seqTex.width, seqTex.height))
        end
    end
end

function LumiAnimSeqLoadAndCrop:onUpdate(comp, deltaTime)
    if self.OutputTex then
        self.camera.renderTexture = self.OutputTex
    end
    self.material:setTex("u_inputTexture", self.InputTex)
    self.material:setInt('u_cropType', cropTypeIndex[self.cropType])
    self.material:setInt('u_edgeType', edgeTypeIndex[self.edgeType])
    self.material:setFloat('u_opacity', self.opacity)
    self.material:setVec2('u_scale', Amaz.Vector2f(self.scale, self.scale))

    local w = self.camera.renderTexture.width
    local h = self.camera.renderTexture.height

    if self.animSeqType == "Video" then
        self.videoAnim.enabled = true
        self.seqAnim.enabled = false
        self.renderer.flip = true

        if not isEditor then
            self.videoAnim.enableFixedSeekMode = true
        end
        if self.animSeqs then
            local diff = math.huge
            local videoFilename = self.videoFilename
            for i = 0, self.animSeqs:size() - 1 do
                local seqInfo = self.animSeqs:get(i)
                local seqW = seqInfo:get("width")
                local seqH = seqInfo:get("height")
                local diff_ = math.abs(seqW / seqH - (w / h))
                if diff_ < diff then
                    diff = diff_
                    videoFilename = seqInfo:get("seq")
                end
            end
            self.videoFilename = videoFilename
        end
        self.videoAnim.videoFilename = self.videoFilename
        self.videoAnim.enableAlphaBlend = self.enableVideoAlphaBlend
        self.videoAnim.speed = self.speed
        local frames = self.videoAnim:getFrameCount()
        local duration = self.videoAnim:getDuration()
        local videoFps = frames / duration * 1000
        self.videoAnim:seekToTime(self.seqTime + 0.5 / videoFps)
        local videoSize = self.videoAnim:getVideoSize()
        if self.videoAnim.enableAlphaBlend then
            videoSize.x = videoSize.x / 2
        end
        self.material:setVec2("u_seqTexSize", videoSize)
        self.material:setInt("u_convertAlpha", 0)
    elseif self.animSeqType == "Image" then
        self.videoAnim.enabled = false
        self.seqAnim.enabled = true
        if self.animSeqs then
            local diff = math.huge
            local animSeq = nil
            for i = 0, self.animSeqs:size() - 1 do
                local seqInfo = self.animSeqs:get(i)
                local seqW = seqInfo:get("width")
                local seqH = seqInfo:get("height")
                local diff_ = math.abs(seqW / seqH - (w / h))
                if diff_ < diff then
                    diff = diff_
                    animSeq = seqInfo:get("seq")
                end
            end
            self.animSeq = animSeq
        end
        self.seqAnim.animSeq = self.animSeq
        self.renderer.flip = true
        self.seqAnim.speed = self.speed
        self.seqAnim:seekToTime(self.seqTime + 0.5 / self.animSeq.fps)
    elseif self.animSeqType == "Texture" then
        self.videoAnim.enabled = false
        self.seqAnim.enabled = false
        self.renderer.flip = false

        if self.seqTex then
            self.material:setTex("u_seqTexture", self.seqTex)
            local videoSize = Amaz.Vector2f(self.seqTex.width, self.seqTex.height)
            if self.enableVideoAlphaBlend then
                videoSize.x = videoSize.x / 2
            end
            self.material:setVec2("u_seqTexSize", videoSize)
            self.material:setInt("u_convertAlpha", self.enableVideoAlphaBlend and 1 or 0)
        end
    end
end

exports.LumiAnimSeqLoadAndCrop = LumiAnimSeqLoadAndCrop
return exports
