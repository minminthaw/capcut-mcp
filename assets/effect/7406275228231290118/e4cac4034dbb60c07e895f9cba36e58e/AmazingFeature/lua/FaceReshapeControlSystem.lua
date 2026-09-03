local exports = exports or {}
local FaceReshapeControlSystem = FaceReshapeControlSystem or {}
FaceReshapeControlSystem.__index = FaceReshapeControlSystem

local maxFaceCount = 10
local currentIndex = -1
local tempIntensity = {}

local FACE_ID = "id"
local INTENSITY_TAG = "intensity"
local EPSC = 0.001
local FACE_ADJUST = "face_adjust"

local nameMap = 
{
    eyebrow_adjust_BiaoZhun = "eyebrow_adjust_BiaoZhun",
    eyebrow_adjust_JianMei = "eyebrow_adjust_JianMei",
    eyebrow_adjust_LiuYe = "eyebrow_adjust_LiuYe",
    eyebrow_adjust_OuShi = "eyebrow_adjust_OuShi",
}

local RESET_PARAMS = "reset_params"
-- runtime

local tmpOrder = 1
local renderOrderDict = {}


function FaceReshapeControlSystem.new(construct, ...)
    local self = setmetatable({}, FaceReshapeControlSystem)
    -- param
    self.maxFaceNum = 10
    self.maxDisplayNum = 5
    self.faceAdjustMaps = {}
    self.tmpOrder = 1

    self.comps = {}
    self.entities = {}
    self.compsdirty = true
    local defaultMap = Amaz.Map()
    defaultMap:set(FACE_ID, -1)
    self.faceAdjustMaps[-1] = defaultMap
    return self
end
function FaceReshapeControlSystem:constructor()
end

function FaceReshapeControlSystem:onStart(sys)

    local entities = sys.scene.entities
    for i = 0, entities:size() - 1 do

        local entity = entities:get(i)
        self.entities[entity.name] = entity
        -- table.insert(self.entities, entity)
    end
end

function FaceReshapeControlSystem:onComponentAdded(sys, comp)
    -- if comp:isInstanceOf("FaceReshapeLiquefy") then
    --     table.insert(self.comps, comp)
    --     self.compsdirty = true
    -- end
end

function FaceReshapeControlSystem:onComponentRemoved(sys, comp)
    -- local  compCount = #self.comps
    -- for i = 1, compCount do
    --     if self.comps[i] == comp then
    --         table.remove(self.comps, i)
    --         self.compsdirty = true
    --     end
    -- end
end

function FaceReshapeControlSystem:onUpdate(sys,deltaTime)
    self:updateFaceInfoBySize()
    -- init tempIntensity
    local tempIntensity = {}
    for tagName, entityName in pairs(nameMap) do
        tempIntensity[entityName] = {}
        for i = 0, self.maxFaceNum-1 do
            tempIntensity[entityName][i] = 0.0
        end
    end
    -- Amaz.LOGE("hmlog", "entityName = "..deltaTime)
    -- update face with valid track id
    for i = 1, self.maxFaceNum do
        local faceInfo = self.faceInfoBySize[i]
        local id = faceInfo.id
        local index = faceInfo.index

        if id ~= -1 and i <= self.maxDisplayNum then
            for adjustName, entityName in pairs(nameMap) do
                local adjustIntensity = self:getValue(id, adjustName, 0.0)
                if(entityName ~= nil) then
                    -- control order
                    -- if(self.renderOrderDict[entityName] == nil) then
                    --     self.renderOrderDict[entityName] = self.tmpOrder
                    --     -- if self.entities[entityName..'_Neg_entity'] ~= nil then 
                    --     --     local renderer = self.entities[entityName..'_Neg_entity']:getComponent("MeshRenderer")
                    --     --     renderer.sortingOrder = self.tmpOrder
                    --     -- end
                    --     -- if self.entities[entityName..'_Pos_entity'] ~= nil then 
                    --     --     local renderer = self.entities[entityName..'_Pos_entity']:getComponent("MeshRenderer")
                    --     --     renderer.sortingOrder = self.tmpOrder
                    --     -- end
                    --     self.tmpOrder = self.tmpOrder + 1
                    -- end
                    tempIntensity[entityName][index] = adjustIntensity
                end
            end
        end
    end
    -- Amaz.LOGE("hmlog", "entityName = 111111"..deltaTime)

    for tagName, entityName in pairs(nameMap) do
        local entity = self.entities[entityName]
        local comp = entity:getComponent("FaceReshapeLiquefy")
        local renderer = entity:getComponent("MeshRenderer")
        if renderer.mesh ~= nil and renderer.mesh.submeshes ~= nil then
            renderer.mesh.submeshes:clear()
        end
        local faceNum = 0
        local faceids = {}
        local intensityParams = {}
        for faceid=0, self.maxFaceNum-1 do
            local intensity = tempIntensity[entityName][faceid]
            if intensity > EPSC then
                faceids[faceNum] = faceid
                intensityParams[faceNum] = intensity
                faceNum = faceNum + 1
            end
        end
        if faceNum==0 then
            entity.visible = false
        else
            entity.visible = true
            comp.intensityParams:resize(faceNum)
            comp.faceids:resize(self.maxFaceNum)
            for i=0, faceNum-1 do
                comp.faceids:set(i, faceids[i])
                comp.intensityParams:set(i, intensityParams[i])
            end
            for i=faceNum, self.maxFaceNum-1 do
                comp.faceids:set(i, self.maxFaceNum)
            end
        end
    end
end


local function getSmallItemValueBy(percentage, index)
    if percentage < 0 then
        return -percentage * organParamRange[index][1]
    else
        return percentage * organParamRange[index][2]
    end
end

function FaceReshapeControlSystem:handleIntensityEvent(comp, event)
    local key = event.args:get(0)
    if key == RESET_PARAMS then
        self.faceAdjustMaps = {}
    else
        for tagName, entityName in pairs(nameMap) do
            if key == tagName then
                self.faceAdjustMaps[key] = event.args:get(1)
            end
        end
    end
end

function FaceReshapeControlSystem:onEvent(sys, event)
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        self:handleIntensityEvent(comp, event)
    end
end


function FaceReshapeControlSystem:getValue(id, key, default)
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

function FaceReshapeControlSystem:updateFaceInfoBySize()
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


exports.FaceReshapeControlSystem = FaceReshapeControlSystem
return exports


