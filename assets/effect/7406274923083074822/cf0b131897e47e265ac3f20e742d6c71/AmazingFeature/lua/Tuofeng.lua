local exports = exports or {}

local Tuofeng = Tuofeng or {}
Tuofeng.__index = Tuofeng

local FACE_ADJUST = "face_adjust_TuoFengNose"
local FACE_ID = "id"
local FACE_ADJUST_INTENSITY = "intensity"
local RESET_PARAMS = "reset_params"

local default_weight = 0.8

local opacity2dDefault = "opacity"
local makeupNamesMap = {
    "mask_faceuv22986_entity",
    "mask_faceuv22994_entity"
}

function Tuofeng.new(construct, ...)
    local self = setmetatable({}, Tuofeng)

    self.maxFaceNum = 10
    self.maxDisplayNum = 5
    self.faceAdjustMaps = {}

    --self.faceAdjustMaps[-1] = 1.0

    self.update3DMakeup = true
    self.update3DReshape = true
    self.update2Dmakeup = true
    self.update2DReshape = true

    return self
end

function Tuofeng:onStart(comp)
    local scene = comp.entity.scene

    local curScriptSystem = scene:getSystem("ScriptSystem")
    curScriptSystem:clearAllEventType()
    curScriptSystem:addEventType(Amaz.AppEventType.SetEffectIntensity)

    self.effect3d = {}
    for i = 0, self.maxDisplayNum - 1 do
        local entity = scene:findEntityBy("MakeupAndReshape3D_" .. i)
        self.effect3d[i] = entity
    end

    -- self.reshapeV6Entities = {}
    -- self.reshapeV6Comps = {}

    -- for i = 0, self.maxFaceNum - 1 do

    --     self.reshapeV6Entities[i] = scene:findEntityBy("FaceDistortionV6_" .. i)
    --     if self.reshapeV6Entities[i] then
    --         self.reshapeV6Comps[i] = self.reshapeV6Entities[i]:getComponent("FaceReshapeLiquefy")
    --     else
    --         self.reshapeV6Comps[i] = nil
    --     end
    -- end

    self.makeup2dObjs = {}
    for _, name in ipairs(makeupNamesMap) do
        local entity = scene:findEntityBy(name)

        if entity ~= nil then
            self.makeup2dObjs[name] = {
                entity = entity,
                makeup = entity:getComponent("EffectFaceMakeupFaceU"),
            }
        else
            self.makeup2dObjs[name] = {
                entity = nil,
                makeup = nil,
            }
        end
    end
end

function Tuofeng:onUpdate(comp, deltaTime)
    -- get face info by size order
    self:updateFaceInfoBySize()

    -- reset all v6 entity
    -- for i = 0, self.maxFaceNum - 1 do
    --     if self.reshapeV6Entities[i] ~= nil then self.reshapeV6Entities[i].visible = false end
    -- end


    --dandugengxinmeizhuang
    for i = 1, self.maxFaceNum do
        local faceInfo = self.faceInfoBySize[i]
        local id = faceInfo.id
        local index = faceInfo.index
        
        local intensity = 0.0
        if id ~= -1 and i <= self.maxDisplayNum then
            if self.faceAdjustMaps[id] ~= nil then
                intensity = self.faceAdjustMaps[id]
            elseif self.faceAdjustMaps[-1] ~= nil then
                intensity = self.faceAdjustMaps[-1]
            end
        end

        for name, makeup2dObj in pairs(self.makeup2dObjs) do
            if makeup2dObj.entity and makeup2dObj.makeup then
                if self.update2Dmakeup then
                    makeup2dObj.makeup:setFaceUniform(opacity2dDefault, index, intensity)
                else
                    makeup2dObj.makeup:setFaceUniform(opacity2dDefault, index, 0.0)
                end
            end
        end
    end


    --gengxin3dhe2dxingbian
    for i = 1, self.maxDisplayNum do
        local faceInfo = self.faceInfoBySize[i]
        local id = faceInfo.id
        local index = faceInfo.index
        local meshInfo = faceInfo.mesh

        local intensity = 0.0

        if id ~= -1 then
            if self.faceAdjustMaps[id] ~= nil then
                intensity = self.faceAdjustMaps[id]
            elseif self.faceAdjustMaps[-1] ~= nil then
                intensity = self.faceAdjustMaps[-1]
            end
        end

        if intensity == 0.0 then
            if self.effect3d[i - 1] then self.effect3d[i - 1].visible = false end
        else
            if self.effect3d[i - 1] then
                self.effect3d[i - 1].visible = true

                local meshrender = self.effect3d[i - 1]:getComponent("MeshRenderer")
                if meshrender and meshInfo then
                    local faceMVP = meshInfo.mvp
                    local faceModel = meshInfo.modelMatrix
                    local facePos = meshInfo.vertexes
                    local faceNormals = meshInfo.normals
                    if facePos:size() >= 1200 then
                        meshrender.mesh:setVertexArray(facePos)
                        meshrender.mesh:setNormalArray(faceNormals)
                        meshrender.props:setMatrix("uModel", faceModel)
                        meshrender.props:setMatrix("uMVP", faceMVP)
                    end

                    if self.update3DMakeup then
                        meshrender.props:setFloat("uOpacity", intensity)
                    else
                        meshrender.props:setFloat("uOpacity", 0.0)
                    end
                end

                local morpher = self.effect3d[i - 1]:getComponent("MorpherComponent")
                if morpher then
                    morpher.basemesh = meshrender.mesh
                    if self.update3DReshape then 
                        morpher:setChannelWeight("key1", default_weight * intensity)
                    else
                        morpher:setChannelWeight("key1", 0.0)
                    end
                end
            end

            -- if self.update2DReshape then
            --     local oneV6intensity = Amaz.FloatVector()
            --     oneV6intensity:pushBack(intensity)

            --     if self.reshapeV6Entities[index] ~= nil then self.reshapeV6Entities[index].visible = true end
            --     if self.reshapeV6Comps[index] ~= nil then self.reshapeV6Comps[index].intensityParams = oneV6intensity end
            -- end
        end
    end


end

function Tuofeng:onEvent(comp, event)
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        local inputKey = event.args:get(0)

        if inputKey == RESET_PARAMS then
            self.faceAdjustMaps = {}
        elseif inputKey == FACE_ADJUST then
            self.faceAdjustMaps = {}

            local inputValue = event.args:get(1)
            local inputSize = inputValue:size()
            for i = 0, inputSize - 1 do
                local inputMap = inputValue:get(i)

                local inputId = inputMap:get(FACE_ID)
                local inputIntensity = inputMap:get(FACE_ADJUST_INTENSITY)
                self.faceAdjustMaps[inputId] = inputIntensity * 0.5  -- we want the slider show 100, but 50 as the actual value used
            end
        end
    end
end

function Tuofeng:updateFaceInfoBySize()
    self.faceInfoBySize = {}

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceCount = result:getFaceCount()
    local freidCount = result:getFreidInfoCount()
    local face3dCount = result:getFaceFittingCount1256()
    -- Amaz.LOGS(self.logTag, "updateFaceInfoBySize faceCount " .. faceCount .. " freidCount " .. freidCount)
    for i = 0, self.maxFaceNum - 1 do
        local trackId = -1
        local meshInfo = nil
        local faceSize = 0
        if i < faceCount then
            local baseInfo = result:getFaceBaseInfo(i)
            local faceId = baseInfo.ID
            local faceRect = baseInfo.rect
            for j = 0, face3dCount - 1 do
                local face3dInfo = result:getFaceMeshInfo1256(j)
                if faceId == face3dInfo.ID then
                    meshInfo = face3dInfo
                end
            end
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
            mesh = meshInfo,
            size = faceSize
        })
        -- Amaz.LOGS(self.logTag, "updateFaceInfoBySize add face info index " .. i .. " id " .. trackId .. " size " .. faceSize)
    end
    table.sort(self.faceInfoBySize, function(a, b)
        return a.size > b.size or (a.size == b.size and a.index < b.index)
    end)
end

exports.Tuofeng = Tuofeng

return exports

