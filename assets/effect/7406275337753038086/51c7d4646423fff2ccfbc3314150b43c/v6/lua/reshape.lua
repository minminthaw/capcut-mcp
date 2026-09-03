local exports = exports or {}
local reshape = reshape or {}
reshape.__index = reshape


local RESET_PARAMS = "reset_params"
local KEY_PARAMS = "face_adjust_XiaoQiaoBi"

local FACE_ID = "id"
local INTENSITY_TAG = "intensity"

function reshape.new(construct, ...)
    local self = setmetatable({}, reshape)

    self.maxFaceNum = 10
    self.maxDisplayNum = 5
    self.faceAdjustMaps = {}

    return self
end

function reshape:onStart(comp)
    local scene = comp.entity.scene

    local curScriptSystem = scene:getSystem("ScriptSystem")
    curScriptSystem:clearAllEventType()
    curScriptSystem:addEventType(Amaz.AppEventType.SetEffectIntensity)

    self.reshapeV6Entities = {}
    self.reshapeV6Comps = {}

    for i = 0, self.maxFaceNum - 1 do

        self.reshapeV6Entities[i] = scene:findEntityBy("FaceDistortionV6_" .. i)
        if self.reshapeV6Entities[i] then
            self.reshapeV6Comps[i] = self.reshapeV6Entities[i]:getComponent("FaceReshapeLiquefy")
        else
            self.reshapeV6Comps[i] = nil
        end
    end
end

function reshape:getValue(id, key, default)
    local vec = self.faceAdjustMaps[key]
    if vec == nil then
        return default
    end
    local intensity = default
    local inputSize = vec:size()
    local hit = false
    local val = default
    for i = 0, inputSize - 1 do
        local inputMap = vec:get(i)
        if id == inputMap:get(FACE_ID) and inputMap:has(INTENSITY_TAG) then
            intensity = inputMap:get(INTENSITY_TAG)
            hit = true
        elseif -1 == inputMap:get(FACE_ID) and inputMap:has(INTENSITY_TAG) then
            val = inputMap:get(INTENSITY_TAG)
        end
    end

    if hit == false then
        intensity = val
    end

    return intensity
end

function reshape:onUpdate(comp, deltaTime)
    -- get face info by size order
    self:updateFaceInfoBySize()

    -- reset all v6 entity
    for i = 0, self.maxFaceNum - 1 do
        if self.reshapeV6Entities[i] ~= nil then self.reshapeV6Entities[i].visible = false end
    end

    local inputEvent = self.faceAdjustMaps[KEY_PARAMS]
    if inputEvent == nil then return end

    local inputEventSize = inputEvent:size()
    if inputEventSize <= 0 then return end

    local result = Amaz.Algorithm.getAEAlgorithmResult()

    -- update face with valid track id
    for i = 1, self.maxDisplayNum do
        local faceInfo = self.faceInfoBySize[i]
        local id = faceInfo.id   --tracking id daibiaoshishui
        local index = faceInfo.index -- n-th of the faces, daibiaodijigerenlianjieguo

        --ranhouquzhaotracking idduiyingdeliandeqiangdushiduoshao
        local intensity = 0
        if id ~= -1 then intensity = self:getValue(id, KEY_PARAMS, 0.0) end

        intensity = intensity * 0.7  -- we want the slider show 100, but 70 as the actual value used

        --ruguoqiangdubushi0, shuomingshixuyaoshengxiaode
        if intensity ~= 0.0 and result:getFaceBaseInfo(index) then

            local oneV6intensity = Amaz.FloatVector()
            oneV6intensity:pushBack(intensity)

            if self.reshapeV6Entities[index] ~= nil then self.reshapeV6Entities[index].visible = true end
            if self.reshapeV6Comps[index] ~= nil then self.reshapeV6Comps[index].intensityParams = oneV6intensity end
        end
    end
end

function reshape:onEvent(comp, event)
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        local key = event.args:get(0)

        if key == RESET_PARAMS then
            self.faceAdjustMaps = {}
        elseif key == KEY_PARAMS then
            self.faceAdjustMaps[key] = event.args:get(1)
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
