local FACE_ADJUST = "face_adjust_fengchun"
local FACE_ID = "id"
local EPSC = 0.001
local FACE_ADJUST_INTENSITY = "intensity"
local exports = exports or {}
local FaceReshapeLiquefyControl = FaceReshapeLiquefyControl or {}
FaceReshapeLiquefyControl.__index = FaceReshapeLiquefyControl
function FaceReshapeLiquefyControl.new(construct, ...)
    local self = setmetatable({}, FaceReshapeLiquefyControl)
    self.comps = {}
    self.entities = {}
    self.compsdirty = true
    self.intensity = 0
    self.maxFaceNum = 5 -- 
    self.maxDisplayNum = 5 -- 
    return self
end
function FaceReshapeLiquefyControl:constructor()
    
end

function FaceReshapeLiquefyControl:onStart(sys)
end

function FaceReshapeLiquefyControl:onComponentAdded(sys, comp)
    if comp:isInstanceOf("FaceReshapeLiquefy") then
        table.insert(self.comps, comp)
        self.compsdirty = true
    end
end

function  FaceReshapeLiquefyControl:onComponentRemoved(sys, comp)
    local  compCount = #self.comps
    for i = 1, compCount do
        if self.comps[i] == comp then
            table.remove(self.comps, i)
            self.compsdirty = true
        end
    end
end




function FaceReshapeLiquefyControl:onUpdate(sys, deltaTime)
    self:updateFaceInfoBySize()
    local intensity = self.intensity
    local  compCount = #self.comps
    for i = 1, compCount do
        local faceCount = self.comps[i].faceids:size()
        self.comps[i].intensityParams:resize(faceCount)

        for f_id = 1, faceCount do
            local faceInfo = self.faceInfoBySize[f_id]
            local id = faceInfo.id -- 
            local index = faceInfo.index -- 
            local intensity = 0
            if id ~= -1 and i <= self.maxDisplayNum then -- 
                local adjustMap = self.faceAdjustMaps[id]
                if adjustMap == nil then
                    adjustMap = self.faceAdjustMaps[-1]
                end
                intensity = adjustMap:get(FACE_ADJUST_INTENSITY)
            end
            if intensity<0 then
                intensity= intensity*0.45
            end
            self.comps[i].intensityParams:set(index, intensity*2.0)
        end
    end
end
function FaceReshapeLiquefyControl:updateFaceInfoBySize()
    self.faceInfoBySize = {}

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceCount = result:getFaceCount()
    local freidCount = result:getFreidInfoCount()
    for i = 0, self.maxFaceNum - 1 do
        local faceInfo = self.faceInfoBySize[i]
        local trackId = -1
        local faceSize = 0
        if i < faceCount then
            local baseInfo = result:getFaceBaseInfo(i)
            local faceId = baseInfo.ID
            local faceRect = baseInfo.rect
            for j = 0, freidCount - 1 do
                local freidInfo = result:getFreidInfo(j)
                if faceId == freidInfo.faceid then
                    trackId = freidInfo.trackid -- 
                end
            end
            faceSize = faceRect.width * faceRect.height -- 
        end
        table.insert(self.faceInfoBySize, {
            index = i, -- 
            id = trackId,
            size = faceSize
        })
    end
    table.sort(self.faceInfoBySize, function(a, b)
        return a.size > b.size -- 
    end)
end

function FaceReshapeLiquefyControl:onEvent(sys,event)
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        if event.args:get(0) == FACE_ADJUST then
            self.faceAdjustMaps = {}
            local inputVector = event.args:get(1)
            local inputSize = inputVector:size()
            for i = 1, inputSize do
                local inputMap = inputVector:get(i - 1)
                local inputId = inputMap:get(FACE_ID)
                self.faceAdjustMaps[inputId] = inputMap
            end
        end
    end
end
exports.FaceReshapeLiquefyControl = FaceReshapeLiquefyControl
return exports