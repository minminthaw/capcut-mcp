local isEditor = (Amaz.Macros and Amaz.Macros.EditorSDK) and true or false
local exports = exports or {}
local LumiAnimSeqLayout = LumiAnimSeqLayout or {}
LumiAnimSeqLayout.__index = LumiAnimSeqLayout
---@class LumiAnimSeqLayout : ScriptComponent
---@field animSeqType string [UI(Option={"Video", "Image", "Texture"})]
---@field edgeType string [UI(Option={"Tile", "Mirror", "Clamp", "Empty"})]
---@field alignmentType string [UI(Option={"Top Left", "Top Center", "Top Right", "Center Left", "Center", "Center Right", "Bottom Left", "Bottom Center", "Bottom Right"})]
---@field offsetGlobal Vector2f
---@field offsetLocal Vector2f
---@field rotation double [UI(Range={0, 360}, Drag)] 
---@field scale double [UI(Range={0, 5}, Drag)]
---@field opacity double [UI(Range={0, 1}, Drag)]
---@field playMode string [UI(Option={"once", "loop"})]
---@field speed double [UI(Range={0.001, 10}, Drag)]
---@field seqTime number [UI(Range={0, 100}, Drag)]
---@field enableVideoAlphaBlend boolean
---@field enableInputBlend boolean
---@field designRatio string [UI(Option={"5.8", "9_16", "3_4", "1_1", "4_3", "16_9", "1.85_1", "2_1", "2.35_1"})]
---@field enableAdaptiveScale boolean
---@field videoFilename String
---@field animSeq AnimSeq
---@field seqTex Texture
---@field InputTex Texture
---@field OutputTex Texture

local AE_EFFECT_TAG = 'AE_EFFECT_TAG LumiTag'

local animSeqTypeName = {
    "Video", "Image", "Texture",
}
setmetatable(animSeqTypeName, {__index = function(_, _) return animSeqTypeName[1] end})
local animSeqTypeIndex = {}
for index, value in ipairs(animSeqTypeName) do animSeqTypeIndex[value] = index - 1 end
setmetatable(animSeqTypeIndex, {
    __index = function(_, key)
        Amaz.LOGE(AE_EFFECT_TAG, 'Unsupported AnimSeqType: ' .. key)
        return 0
    end
})

local alignmentTypeName = {
    "Top Left", "Top Center", "Top Right", "Center Left", "Center", "Center Right", "Bottom Left", "Bottom Center", "Bottom Right"
}
setmetatable(alignmentTypeName, {__index = function(_, _) return alignmentTypeName[1] end})
local alignmentTypeIndex = {}
for index, value in ipairs(alignmentTypeName) do alignmentTypeIndex[value] = index - 1 end
setmetatable(alignmentTypeIndex, {
    __index = function(_, key)
        Amaz.LOGE(AE_EFFECT_TAG, "Unsupported Alignment: ".. key)
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

local playModeName = {
    "once", "loop"
}
setmetatable(playModeName, {__index = function(_, _) return playModeName[1] end})
local playModeIndex = {}
for index, value in ipairs(playModeName) do playModeIndex[value] = index - 1 end
setmetatable(playModeIndex, {
    __index = function(_, key)
        Amaz.LOGE(AE_EFFECT_TAG, "Unsupported Play Mode: " .. key)
        return 0
    end
})

local designRatioName = {
    "5.8", "9_16", "3_4", "1_1", "4_3", "16_9", "1.85_1", "2_1", "2.35_1"
}
setmetatable(designRatioName, {__index = function(_, _) return designRatioName[1] end})
local designRatioIndex = {}
for index, value in ipairs(designRatioName) do designRatioIndex[value] = index - 1 end
setmetatable(designRatioIndex, {
    __index = function(_, key)
        Amaz.LOGE(AE_EFFECT_TAG, "Unsupported Design Ratio: ".. key)
        return 0
    end
})

function LumiAnimSeqLayout.new(construct, ...)
    local self = setmetatable({}, LumiAnimSeqLayout)

    self.AEPlugin = false
    self.seqTime = 0.0

    self.animSeqType = 'Texture'
    self.alignmentType = 'Center'
    self.edgeType = 'Empty'
    self.offsetGlobal = Amaz.Vector2f(0, 0)
    self.offsetLocal = Amaz.Vector2f(0, 0)
    self.rotation = 0
    self.scale = 1.0
    self.opacity = 1.0
    self.playMode = 'loop'
    self.speed = 1.0
    self.videoFilename = ''
    self.designRatio = '1_1'
    self.enableAdaptiveScale = false
    self.enableVideoAlphaBlend = false
    self.enableInputBlend = false
    self.animSeq = nil
    self.seqTex = nil

    self.multiAspect = {
        ['5.8'] = 1.125 / 2.436, -- 0.4618
        ['9_16'] = 9 / 16, -- 0.5625
        ['3_4'] = 3 / 4, -- 0.75
        ['1_1'] = 1,
        ['4_3'] = 4 / 3, -- 1.3333
        ['16_9'] = 16 / 9, -- 1.7778
        ['1.85_1'] = 1.85,
        ['2_1'] = 2,
        ['2.35_1'] = 2.35,
    }

    self.needUpdateSize = true
    self.InputTex = nil
    self.OutputTex = nil

    return self
end

function LumiAnimSeqLayout:onStart(comp)
    self.entity = comp.entity
    self.TAG = AE_EFFECT_TAG .. ' ' .. self.entity.name

    self.camera = self.entity:searchEntity("AnimSeqCamera"):getComponent("Camera")
    self.material = self.entity:searchEntity('AnimSeqPass'):getComponent('MeshRenderer').material
    self.videoAnim = self.entity:searchEntity("AnimSeqPass"):getComponent("VideoAnimSeq")
    self.seqAnim = self.entity:searchEntity("AnimSeqPass"):getComponent("AnimSeqComponent")
end

function LumiAnimSeqLayout:setEffectAttr(key, value, comp)
    local function _setEffectAttr(_key, _value, _force)
        if _force or self[_key] ~= nil then
            self[_key] = _value
            if comp and comp.properties ~= nil then
                comp.properties:set(_key, _value)
            end
        end
    end

    local setters = {
        alignmentType = function(v) _setEffectAttr(key, alignmentTypeName[v + 1]) end,
        edgeType = function(v) _setEffectAttr(key, edgeTypeName[v + 1]) end,
        animSeqType = function(v) _setEffectAttr(key, animSeqTypeName[v + 1]) end,
        playMode = function(v) _setEffectAttr(key, playModeName[v + 1]) end,
        designRatio = function(v) _setEffectAttr(key, designRatioName[v + 1]) end,
        seqTex = function(v) _setEffectAttr(key, v, true) end,
        animSeq = function(v) _setEffectAttr(key, v, true) end,
        offsetGlobalX = function(v) 
            local _v = self.offsetGlobal
            _v.x = v
            _setEffectAttr('offsetGlobal', _v)
        end,
        offsetGlobalY = function(v)
            local _v = self.offsetGlobal
            _v.y = v
            _setEffectAttr('offsetGlobal', _v)
        end,
        offsetLocalX = function(v)
            local _v = self.offsetLocal
            _v.x = v
            _setEffectAttr('offsetLocal', _v)
        end,
        offsetLocalY = function(v)
            local _v = self.offsetLocal
            _v.y = v
            _setEffectAttr('offsetLocal', _v)
        end,
        default = function(v) _setEffectAttr(key, v) end
    }

    local setter = setters[key] or setters.default
    setter(value)
end

function LumiAnimSeqLayout:afterAnimSeqSystemUpdate(comp)
    if self.animSeqType == "Image" then
        if self.needUpdateSize and self.material then
            local seqTex = self.material:getTex("u_seqTexture")
            self.material:setVec2("u_seqTexSize", Amaz.Vector2f(seqTex.width, seqTex.height))
            seqTex = nil
            self.needUpdateSize = false
        end
    end
end

function LumiAnimSeqLayout:onUpdate(comp, deltaTime)
    if self.OutputTex then
        self.camera.renderTexture = self.OutputTex
    end

    local w = self.camera.renderTexture.width
    local h = self.camera.renderTexture.height

    local ratio = w / h
    if self.AEPlugin then
        self.animSeqType = 'Texture'
    end

    local adaptedScale = self.scale
    if self.enableAdaptiveScale then
        local designRatio = self.multiAspect[self.designRatio] 
        if designRatio ~= nil then
            adaptedScale = adaptedScale * (1 + math.max(ratio, 1.0/ratio)/math.max(designRatio, 1.0/designRatio)) * 0.5
        end
    end

    local alignment = alignmentTypeIndex[self.alignmentType]
    local alignmentX = alignment % 3
    local alignmentY = math.floor(alignment / 3)

    self.material:setTex("u_inputTexture", self.InputTex)
    self.material:setInt('u_edgeType', edgeTypeIndex[self.edgeType])
    self.material:setInt('u_alignmentX', alignmentX)
    self.material:setInt('u_alignmentY', alignmentY)
    self.material:setFloat('u_opacity', self.opacity)
    self.material:setVec2('u_scale', Amaz.Vector2f(adaptedScale, adaptedScale))
    self.material:setVec2('u_offsetLocal', self.offsetLocal)
    self.material:setVec2('u_offsetGlobal', self.offsetGlobal)
    self.material:setFloat('u_rotation', math.rad(self.rotation))
    self.material:setInt("u_blendInput", self.enableInputBlend and 1 or 0)

    local playMode = Amaz.PlayMode.loop
    if self.playMode == 'once' then
        playMode = Amaz.PlayMode.once
    end

    local speed = self.speed

    if self.animSeqType == "Video" then
        self.videoAnim.enabled = true
        self.seqAnim.enabled = false

        if not isEditor then
            self.videoAnim.enableFixedSeekMode = true
        end
        if self.videoAnim.videoFilename ~= self.videoFilename then
            self.videoAnim.videoFilename = self.videoFilename
        end
        if self.videoAnim.enableAlphaBlend ~= self.enableVideoAlphaBlend then
            self.videoAnim.enableAlphaBlend = self.enableVideoAlphaBlend
        end
        if self.videoAnim.playmode ~= playMode then
            self.videoAnim.playmode = playMode
        end
        if self.videoAnim.speed ~= speed then
            self.videoAnim.speed = speed
        end
        local frames = self.videoAnim:getFrameCount()
        local duration = self.videoAnim:getDuration()
        local videoFps = frames / duration * 1000
        self.videoAnim:seekToTime(self.seqTime + 0.5 / videoFps)
        local videoSize = self.videoAnim:getVideoSize()
        if self.enableVideoAlphaBlend then
            videoSize.x = videoSize.x / 2
        end
        self.material:setVec2("u_seqTexSize", videoSize)
        self.material:setInt("u_convertAlpha", 0)
        -- self.material:setInt("u_convertAlpha", self.enableVideoAlphaBlend and 1 or 0)
        self.material:setInt('u_yFlip', 1)
    elseif self.animSeqType == "Image" then
        self.videoAnim.enabled = false
        self.seqAnim.enabled = true

        if self.seqAnim.animSeq ~= self.animSeq then
            self.seqAnim.animSeq = self.animSeq
            self.needUpdateSize = true
        end
        if self.seqAnim.playmode ~= playMode then
            self.seqAnim.playmode = playMode
        end
        if self.seqAnim.speed ~= speed then
            self.seqAnim.speed = speed
        end
        self.material:setInt("u_convertAlpha", 0)
        self.seqAnim:seekToTime(self.seqTime + 0.5 / self.animSeq.fps)
        self.material:setInt('u_yFlip', 1)
    elseif self.animSeqType == "Texture" then
        self.videoAnim.enabled = false
        self.seqAnim.enabled = false

        if self.seqTex then
            self.material:setTex("u_seqTexture", self.seqTex)
            local videoSize = Amaz.Vector2f(self.seqTex.width, self.seqTex.height)
            if self.enableVideoAlphaBlend then
                videoSize.x = videoSize.x / 2
            end
            self.material:setVec2("u_seqTexSize", videoSize)
            self.material:setInt("u_convertAlpha", self.enableVideoAlphaBlend and 1 or 0)
        else
            self.material:setVec2('u_scale', Amaz.Vector2f(0, 0))
        end
        self.material:setInt('u_yFlip', 0)
    end
end

exports.LumiAnimSeqLayout = LumiAnimSeqLayout
return exports
