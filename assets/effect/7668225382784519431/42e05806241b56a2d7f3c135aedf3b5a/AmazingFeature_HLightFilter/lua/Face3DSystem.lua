local exports = exports or {}
local Face3DSystem = Face3DSystem or {}
Face3DSystem.__index = Face3DSystem
local DISABLE_MAKEUP_FACE_MESH = true
function Face3DSystem.new(construct, ...)
    local self = setmetatable({}, Face3DSystem)
    self.faceEntity = {}
    self.faceComp = {}
    self.faceidComp = {}
    self.facemash = {}
    return self
end

-- add composer_param
local HIGH_LIGHT_INTENSITY_NAME = "highLightIntensity"

function Face3DSystem:onComponentAdded(sys, comp)
    if (comp:isInstanceOf("MeshRenderer")) and string.sub(comp.entity.name, 1, 4) == "face" then
        table.insert(self.faceEntity, comp.entity)
        table.insert(self.faceComp, comp)
        self.FaceMashRenderer = comp
    end
end

function Face3DSystem:onComponentRemoved(sys, comp)
    if comp:isInstanceOf("MeshRenderer") and string.sub(comp.entity.name, 1, 4) == "face" then
        table.remove(self.faceEntity)
        table.remove(self.faceComp)
    end
end

local function InitfaceParameter(faceComp)
    for i = 1, #faceComp do
        local face3DMesh = faceComp[i].mesh
        if face3DMesh.clearAfterUpload == true then
            face3DMesh.clearAfterUpload = false
        end
    end
end

function Face3DSystem:onStart(sys)
    -- add composer_param
    if self.FaceMashRenderer ~= nil then
        self.FaceMashRenderer.material:setFloat("intensity", 0.0)
    end
    for i = 1, #self.faceEntity do
        self.faceEntity[i].visible = false
    end
end

function Face3DSystem:onUpdate(sys, deltaTime)
    for i = 1, #self.faceEntity do
        self.faceEntity[i].visible = false
    end
    if DISABLE_MAKEUP_FACE_MESH then
        return
    end
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceCount = result:getFaceCount()
    local facemax = math.min(#self.faceEntity, faceCount)
    for i = 1, facemax do
        local faceComp = self.faceComp[i]
        local face3DMesh = self.faceComp[i].mesh
        local faceMeshInfo = result:getFaceMeshInfo(i - 1)
        if faceMeshInfo == nil then
            return
        end
        local faceMVP = faceMeshInfo.mvp
        local faceModel = faceMeshInfo.modelMatrix
        local facePos = faceMeshInfo.vertexes
        local faceNormals = faceMeshInfo.normals

        self.faceEntity[i].visible = true
        if facePos:size() < 1200 then
            self.faceEntity[i].visible = false
        else
            face3DMesh:setVertexArray(facePos)
            face3DMesh:setNormalArray(faceNormals)

        end
        faceComp.props:setMatrix("u_Model", faceModel)
        faceComp.props:setMatrix("u_MVP", faceMVP)
    end
end

exports.Face3DSystem = Face3DSystem
return exports
