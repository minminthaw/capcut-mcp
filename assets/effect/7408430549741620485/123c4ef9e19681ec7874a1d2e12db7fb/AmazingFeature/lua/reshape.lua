local exports = exports or {}
local reshape = reshape or {}
reshape.__index = reshape

-- output
local FACE_ADJUST = "face_adjust"
local FACE_ID = "id"
local FACE_ADJUST_INTENSITY = "intensity"

-- runtime
local EPSC = 0.001
local SEGMENT_ID = "segmentId"
local LOG_TAG = "AE_EFFECT_TAG reshape.lua"

function reshape.new(construct, ...)
    local self = setmetatable({}, reshape)

    -- param
    self.maxFaceNum = 10
    self.maxDisplayNum = 5
    self.organParams = {
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        2,
        0,
        0,
    }
    self.faceAdjustMaps = {}

    -- init
    local defaultMap = Amaz.Map()
    defaultMap:set(FACE_ID, -1)
    defaultMap:set(FACE_ADJUST_INTENSITY, 0)
    self.faceAdjustMaps[-1] = defaultMap

    return self
end

function reshape:onStart(comp, script)
    local scene = comp.entity.scene
    self.scriptProps = comp.properties
    self.reshapeEntities = {}
    self.reshapeComps = {}
    for i = 0, self.maxFaceNum - 1 do
        self.reshapeEntities[i] = scene:findEntityBy("reshape_" .. i + 1)
        self.reshapeComps[i] = self.reshapeEntities[i]:getComponent("FaceReshape")
    end
end

function reshape:onUpdate(comp, deltaTime)
    -- get face info by size order
    self:updateFaceInfoBySize()

    -- update face with valid track id
    for i = 1, self.maxFaceNum do
        local faceInfo = self.faceInfoBySize[i]
        local id = faceInfo.id
        local index = faceInfo.index
        local intensity = 0
        if id ~= -1 and i <= self.maxDisplayNum then
            local adjustMap = self.faceAdjustMaps[id]
            if adjustMap == nil then
                adjustMap = self.faceAdjustMaps[-1]
            end
            intensity = adjustMap:get(FACE_ADJUST_INTENSITY)
        end
        if intensity > EPSC then
            self.reshapeEntities[index].visible = true
            local degrees = self.reshapeComps[index].params.degrees
            degrees:set(4, self.organParams[5] - 0.14 * intensity)
        else
            self.reshapeEntities[index].visible = false
        end
    end
end

function reshape:onEvent(comp, event)
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        self:handleIntensityEvent(comp, event)
    end
end

function reshape:handleIntensityEvent(comp, event)
    if event.args:get(0) == FACE_ADJUST then
        self.faceAdjustMaps = {}
        local inputVector = event.args:get(1)
        local inputSize = inputVector:size()
        for i = 0, inputSize - 1 do
            local inputMap = inputVector:get(i)
            local inputId = inputMap:get(FACE_ID)
            self.faceAdjustMaps[inputId] = inputMap
        end
    end
end

function reshape:updateFaceInfoBySize()
    self.faceInfoBySize = {}

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceCount = result:getFaceCount()
    local freidCount = result:getFreidInfoCount()
    for i = 0, self.maxFaceNum - 1 do
        local trackId = -1
        local faceSize = 0
        if i < faceCount then
            local baseInfo = result:getFaceBaseInfo(i)
            local faceId = baseInfo.ID
            local faceRect = baseInfo.rect
            for j = 0, freidCount - 1 do
                local freidInfo = result:getFreidInfo(j)
                if faceId == freidInfo.faceid then
                    trackId = freidInfo.trackid
                end
            end
            faceSize = faceRect.width * faceRect.height
        end
        table.insert(self.faceInfoBySize, {
            index = i,
            id = trackId,
            size = faceSize
        })
    end
    table.sort(self.faceInfoBySize, function(a, b)
        return a.size > b.size
    end)
end

exports.reshape = reshape
return exports