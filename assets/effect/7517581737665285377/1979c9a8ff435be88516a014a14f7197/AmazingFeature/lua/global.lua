local exports = exports or {}
local global = global or {}
global.__index = global

-- global print function
local function print(...)
    local arg = { ... }
    local msg = ""
    for k, v in pairs(arg) do
        msg = msg .. tostring(v) .. " "
    end
    Amaz.LOGE("GAN LUA", msg)
end

local GRAPH_NAME = "BCE-DEMO-3FAAA9BA-D2A0-47B9-88EC-C839056A8C23"
local FACE_ID = "id";                 -- face id
local INTENSITY_TAG = "intensity";
local FACE_ADJUST_TAG = "face_adjust" -- default loki key
local GAN_TEX_NAME = "ganTexture";
local FLOW_TEX_NAME = "flowTexture";
local MVP_MAT_NAME = "mvpMat";
local INTENSITY_NAME = "u_intensity";
local INTENSITY_EPSC = 0.001


function global.new(construct, ...)
    local self = setmetatable({}, global)
    self.comps = {}
    self.compsdirty = true

    self.maxFaceNum = 10
    self.maxDisplayNum = 5
    self.faceAdjustMaps = {}
    self.faceInfoBySize = {}
    self.intensityKeys = { FACE_ADJUST_TAG }
    -- scriptInfo from Bach.AlgorithmResultKey, not all of them are used.
    self.scriptInfo = {
        ["algoType"] = nil,
        ["subAlgoType"] = nil,
        ["isOutputTextures"] = nil,
        ["groupTexNumList"] = nil,
        ["globalTexNum"] = nil,
        ["groupNum"] = nil,
    }
    self.groupTexNumList = {}
    self.globalTexNum = 0
    self.groupNum = 0
    return self
end

function global:onStart(sys)
    -- self.graph_name = self.scene.getEffectName();
    self.graph_name = GRAPH_NAME;

    self.sys = sys
    self.state = -1

    self.camera_entity = { e = self.sys.scene:findEntityBy("Camera_entity") }
    self.camera_entity.cam = self.camera_entity.e:getComponent("Camera")
    self.camera_entity.trans = self.camera_entity.e:getComponent("Transform")

    -- get face_gan
    self.face_gan = { e = self.sys.scene:findEntityBy("face_gan") }
    self.face_gan.mr = self.face_gan.e:getComponent("MeshRenderer")

    self.fg_list = { self.face_gan }

    for i = 1, self.maxFaceNum - 1 do
        -- get target
        local ct = { e = self.sys.scene:cloneEntityFrom(self.face_gan.e) }
        ct.e.name = string.format("%s_cloned[%d]", self.face_gan.e.name, i)
        ct.mr = ct.e:getComponent("MeshRenderer")
        ct.trans = ct.e:getComponent("Transform")
        -- set corrent parent
        ct.trans.parent = self.camera_entity.trans
        self.camera_entity.trans.children:pushBack(ct.trans)
        -- set mesh and material
        ct.mr.mesh = self.face_gan.mr.mesh
        ct.mr.sharedMaterials = self.face_gan.mr.sharedMaterials
        -- add to list
        self.fg_list[#self.fg_list + 1] = ct
    end

    for i = 1, #self.fg_list do
        self.fg_list[i].e.visible = false
        self.fg_list[i].mr.enabled = false
    end
end

function global:onUpdate(sys, deltaTime)
    for i = 1, #self.fg_list do
        self.fg_list[i].e.visible = false
        self.fg_list[i].mr.enabled = false
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    if (result == nil) then
        print("bach result is null, graph_name: ", self.graph_name)
        return
    end

    local faceCount = result:getFaceCount()
    if faceCount == 0 then
        print("bach face count is 0, graph_name: ", self.graph_name)
        return
    end

    local outputMap = nil
    local scriptInfo = result:getAlgorithmInfo(self.graph_name, "script_0")

    if scriptInfo ~= nil then
        outputMap = scriptInfo.outputMap
        self:parseGANInfo(outputMap)
    else
        print("bach scriptInfo is null, graph_name: ", self.graph_name)
        return
    end

    self:updateFaceInfoBySize()

    local faceSelectIndex = 0

    local applyAll = self:checkApplyAll()

    for i = 1, math.min(faceCount, self.maxFaceNum) do
        local intensity = 0
        local faceInfo = self.faceInfoBySize[i]

        local id = faceInfo.id
        local index = faceInfo.index

        intensity = self:getValue(id, FACE_ADJUST_TAG, 0)

        if math.abs(intensity) > INTENSITY_EPSC then
            print("index: ", index, "intensity: ", intensity, "id: ", id)
            print("faceSelectIndex: ", faceSelectIndex, self.groupNum)

            local groupTexNum = self.groupTexNumList[faceSelectIndex + 1]

            local ganTex = self:getGanTexture(result, self.graph_name, "script_0",
                faceSelectIndex * groupTexNum + self.globalTexNum)

            local flowTex = self:getGanTexture(result, self.graph_name, "script_0",
                faceSelectIndex * groupTexNum + self.globalTexNum + 1)

            local tfmInfo = result:getNHImageTfmInfo(self.graph_name, "FaceAlign", faceSelectIndex)

            faceSelectIndex = faceSelectIndex + 1

            if ganTex and flowTex and tfmInfo then
                self.fg_list[index + 1].mr.material:setMat4(MVP_MAT_NAME, tfmInfo.mvp)
                self.fg_list[index + 1].mr.material:setTex(GAN_TEX_NAME, ganTex)
                self.fg_list[index + 1].mr.material:setTex(FLOW_TEX_NAME, flowTex)
                self.fg_list[index + 1].mr.material:setFloat(INTENSITY_NAME, intensity)

                self.fg_list[index + 1].e.visible = true
                self.fg_list[index + 1].mr.enabled = true
            end
        else
            if applyAll then
                faceSelectIndex = faceSelectIndex + 1
            end
        end
    end
end

function global:onEvent(sys, event)
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        self:handleIntensityEvent(sys, event)
    end
end

function global:hitKey(key)
    for i = 1, #self.intensityKeys do
        if key == self.intensityKeys[i] then
            return true
        end
    end
    return false
end

function global:handleIntensityEvent(sys, event)
    local key = event.args:get(0)
    if self:hitKey(key) then
        self.faceAdjustMaps[key] = event.args:get(1)
    end
end

function global:getValue(id, key, default)
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
        -- print("hit == false, graph_name: ", self.graph_name)
        intensity = val
    end

    return intensity
end

function global:updateFaceInfoBySize()
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

    -- table.sort(self.faceInfoBySize, function(a, b)
    --     return a.size > b.size
    -- end)
end

function global:parseGANInfo(algoInfoMap)
    local vectorKeys = algoInfoMap:getVectorKeys()
    for i = 0, vectorKeys:size() - 1 do
        local key = vectorKeys:get(i)
        local val = algoInfoMap:get(key)
        self.scriptInfo[key] = val
    end

    local groupTexNumList = self.scriptInfo["groupTexNumList"]
    if groupTexNumList == nil then
        self.globalTexNum = 0
        self.groupNum = 0
        print("groupTexNumList is null, graph_name: ", self.graph_name)
        return
    end

    local groupTexNumSize = groupTexNumList:size();
    self.groupTexNumList = {}
    for i = 0, groupTexNumSize - 1 do
        self.groupTexNumList[i + 1] = groupTexNumList:get(i)
    end
    self.globalTexNum = self.scriptInfo["globalTexNum"]
    self.groupNum = self.scriptInfo["groupNum"]
end

function global:getGanTexture(algoResult, graphName, nodeName, index)
    if algoResult == nil then
        print("bach algoResult is null, graph_name: ", self.graph_name)
        return nil
    end
    local info = algoResult:getOutputTexture(graphName, nodeName, index, 1)
    if info == nil then
        print("bach info is null, graph_name: ", self.graph_name)
        return nil
    end
    local ganTex = info.texture
    local ganTexId = info.texId

    if ganTex == nil or ganTexId <= 0 then
        print("ganTex is invalid, graph_name: ", self.graph_name)
        return nil
    end

    return ganTex
end

function global:checkApplyAll()
    local vec = self.faceAdjustMaps[FACE_ADJUST_TAG]
    local inputSize = vec:size()
    for i = 0, inputSize - 1 do
        local inputMap = vec:get(i)
        if -1 == inputMap:get(FACE_ID) and inputMap:has(INTENSITY_TAG) then
            if inputMap:get(INTENSITY_TAG) > INTENSITY_EPSC then
                return true
            end
        end
    end
    return false
end

exports.global = global
return exports
