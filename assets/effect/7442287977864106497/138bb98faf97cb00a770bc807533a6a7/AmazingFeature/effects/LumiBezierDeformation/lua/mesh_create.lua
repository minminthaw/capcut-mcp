local exports = exports or {}
local mesh_create = mesh_create or {}

---@class mesh_create : ScriptComponent
---@field mesh_size number
---@field BottomLeftTangent Vector2f
---@field BottomRightTangent Vector2f
---@field BottomRightVertex Vector2f
---@field LeftBottomTangent Vector2f
---@field LeftBottomVertex Vector2f
---@field LeftTopTangent Vector2f
---@field RightBottomTangent Vector2f
---@field RightTopTangent Vector2f
---@field RightTopVertex Vector2f
---@field TopLeftTangent Vector2f
---@field TopLeftVertex Vector2f
---@field TopRightTangent Vector2f
---@field size number
---@field InputTex Texture
---@field OutputTex Texture
mesh_create.__index = mesh_create

local AE_EFFECT_TAG = 'AE_EFFECT_TAG LumiTag'

function mesh_create.new()
    local self = {}
    setmetatable(self, mesh_create)

    self.InputTex = nil
    self.OutputTex = nil

    self.transform = {}
    self.mesh_size = 32
    self.BottomLeftTangent = Amaz.Vector2f(0.333, 0)
    self.BottomRightTangent = Amaz.Vector2f(0.667, 0)
    self.BottomRightVertex = Amaz.Vector2f(1, 0)
    self.LeftBottomTangent = Amaz.Vector2f(0, 0.333)
    self.LeftBottomVertex = Amaz.Vector2f(0., 0)
    self.LeftTopTangent = Amaz.Vector2f(0, 0.667)
    self.RightBottomTangent = Amaz.Vector2f(1, 0.333)
    self.RightTopTangent = Amaz.Vector2f(1, 0.667)
    self.RightTopVertex = Amaz.Vector2f(1, 1)
    self.TopLeftTangent = Amaz.Vector2f(0.333, 1)
    self.TopLeftVertex = Amaz.Vector2f(0, 1)
    self.TopRightTangent = Amaz.Vector2f(0.667, 1)
    self.opacity = 1
    self.size = 1
    return self
end

local createQuadMesh = function(vertexNumber)
    local customMesh = Amaz.Mesh()
    local customSubMesh = Amaz.SubMesh()
    customSubMesh.primitive = Amaz.Primitive.TRIANGLES
    local pos = Amaz.VertexAttribDesc()
    pos.semantic = Amaz.VertexAttribType.POSITION
    local uv = Amaz.VertexAttribDesc()
    uv.semantic = Amaz.VertexAttribType.TEXCOORD0
    local vads = Amaz.Vector()
    vads:pushBack(pos)
    vads:pushBack(uv)
    customMesh.vertexAttribs = vads
    local vertexData = {}
    local indexData = {}
    for i = 0, vertexNumber - 1 do
        for j = 0, vertexNumber - 1 do
            local x = j / (vertexNumber - 1)
            local y = i / (vertexNumber - 1)
            table.insert(vertexData, #vertexData + 1, x * 2 - 1)
            table.insert(vertexData, #vertexData + 1, y * 2 - 1)
            table.insert(vertexData, #vertexData + 1, 0)
            table.insert(vertexData, #vertexData + 1, x)
            table.insert(vertexData, #vertexData + 1, y)
        end
    end

    for i = 0, vertexNumber - 2 do
        for j = 0, vertexNumber - 2 do
            local k = i * vertexNumber + j
            table.insert(indexData, #indexData + 1, k)
            table.insert(indexData, #indexData + 1, k + 1)
            table.insert(indexData, #indexData + 1, k + vertexNumber)
            table.insert(indexData, #indexData + 1, k + 1)
            table.insert(indexData, #indexData + 1, k + vertexNumber + 1)
            table.insert(indexData, #indexData + 1, k + vertexNumber)
        end
    end
    local fv = Amaz.FloatVector()
    for i = 1, table.getn(vertexData) do
        fv:pushBack(vertexData[i])
    end
    customMesh.vertices = fv
    local indices = Amaz.UInt16Vector()
    for i = 1, table.getn(indexData) do
        indices:pushBack(indexData[i])
    end

    customSubMesh.indices16 = indices
    customSubMesh.mesh = customMesh
    customMesh:addSubMesh(customSubMesh)
    return customMesh
end

---@param comp Component
function mesh_create:onStart(comp)
    self.entity = comp.entity
    self.TAG = AE_EFFECT_TAG .. ' ' .. self.entity.name

    self.camera = self.entity:searchEntity("Camera_Bezier_Deformation"):getComponent("Camera")
    self.meshrenderer = self.entity:searchEntity("Bezier_Deformation"):getComponent("MeshRenderer")
    self.meshrenderer.mesh = createQuadMesh(math.floor(self.mesh_size))
end

---@param comp Component
---@param deltaTime number
function mesh_create:onUpdate(comp, deltaTime)
    self.camera.renderTexture = self.OutputTex
    self.meshrenderer.material:setTex("u_InputTex", self.InputTex)
    self.meshrenderer.material:setVec2("u_BottomLeftTangent", self.BottomLeftTangent)
    self.meshrenderer.material:setVec2("u_BottomRightTangent", self.BottomRightTangent)
    self.meshrenderer.material:setVec2("u_BottomRightVertex", self.BottomRightVertex)
    self.meshrenderer.material:setVec2("u_LeftBottomTangent", self.LeftBottomTangent)
    self.meshrenderer.material:setVec2("u_LeftBottomVertex", self.LeftBottomVertex)
    self.meshrenderer.material:setVec2("u_LeftTopTangent", self.LeftTopTangent)
    self.meshrenderer.material:setVec2("u_RightBottomTangent", self.RightBottomTangent)
    self.meshrenderer.material:setVec2("u_RightTopTangent", self.RightTopTangent)
    self.meshrenderer.material:setVec2("u_RightTopVertex", self.RightTopVertex)
    self.meshrenderer.material:setVec2("u_TopLeftTangent", self.TopLeftTangent)
    self.meshrenderer.material:setVec2("u_TopLeftVertex", self.TopLeftVertex)
    self.meshrenderer.material:setVec2("u_TopRightTangent", self.TopRightTangent)
    self.meshrenderer.material:setFloat("u_size",  self.size)
    self.meshrenderer.material:setFloat("u_ratio",  self.InputTex.width/self.InputTex.height)   
    self.meshrenderer.material:setFloat("u_opacity",  self.opacity)   
    
end

exports.mesh_create = mesh_create
return exports


