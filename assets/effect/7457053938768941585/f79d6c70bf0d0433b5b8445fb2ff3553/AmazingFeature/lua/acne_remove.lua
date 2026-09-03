local exports = exports or {}
local acne_remove = acne_remove or {}
acne_remove.__index = acne_remove

local MAX_FACE = 5
local AE_EFFECT_TAG = 'AE_EFFECT_TAG AcneRemove'
local function print(...)
    local arg = { ... }
    local msg = ""
    for k, v in pairs(arg) do
        msg = msg .. tostring(v) .. " "
    end
    Amaz.LOGE(AE_EFFECT_TAG, msg)
end

function acne_remove.new(construct, ...)
    local self = setmetatable({}, acne_remove)

    if construct and acne_remove.constructor then acne_remove.constructor(self, ...) end
    return self
end

function acne_remove:constructor()
end

function acne_remove:onStart(comp)
    local scene = comp.entity.scene
    self.table = scene:findEntityBy("Table"):getComponent("TableComponent").table
    self.faceMaskRT = self.table:get("FaceMaskRT")
    self.rt1 = self.table:get("RT1")
    self.rt2 = self.table:get("RT2")
    self.rt3 = self.table:get("RT3")
    self.rt4 = self.table:get("RT4")

    -- materials
    self.facialMaskMaterial     = self.table:get("FacialMaskMaterial")
    self.faceExtraMaterial      = self.table:get("FaceExtraMaterial")
    self.erodeDilateHMaterial   = self.table:get("ErodeDilateHMaterial")
    self.erodeDilateVMaterial   = self.table:get("ErodeDilateVMaterial")
    self.blitMaterial           = self.table:get("blitMaterial")
    self.medianFilterMaterial   = self.table:get("MedianFilterMaterial")
    self.gaussianBlurMaterial   = self.table:get("GaussianBlurMaterial")
    self.highPassFilterMaterial = self.table:get("HighPassFilterMaterial")
    
    self.makeupMesh = self.table:get("makeupMesh")
    self.quadMesh = self.table:get("quadMesh")
    self.indicesCount = 768

    self.meshTool = Amaz.AMGFaceMeshUtils()
    self.meshType = Amaz.AMGBeautyMeshType.FACE145
    self.meshTool:setMesh(self.makeupMesh, self.meshType)

    self.faceMaskInfo = {}
    for i = 0, MAX_FACE - 1 do
        local info = { texture = Amaz.Texture2D(), mvp = Amaz.Matrix4x4f() }
        self.faceMaskInfo[#self.faceMaskInfo + 1] = info
    end

    self.cmdBuf = Amaz.CommandBuffer()
    self.clearColor = Amaz.Color(0, 0, 0, 0)
    self.identityMatrix = Amaz.Matrix4x4f():SetIdentity()

    -- subpass
    self:initPass(self.cmdBuf, self.rt1, self.makeupMesh, self.facialMaskMaterial, true)
    self:initPass(self.cmdBuf, self.faceMaskRT, self.quadMesh, self.faceExtraMaterial, false)
    self:initPass(self.cmdBuf, self.rt2, self.quadMesh, self.erodeDilateHMaterial, false)
    self:initPass(self.cmdBuf, self.faceMaskRT, self.quadMesh, self.erodeDilateVMaterial, false)
    self:initPass(self.cmdBuf, self.rt1, self.quadMesh, self.blitMaterial, false)
    self:initPass(self.cmdBuf, self.rt2, self.quadMesh, self.medianFilterMaterial, false)
    self:initPass(self.cmdBuf, self.rt3, self.quadMesh, self.gaussianBlurMaterial, false)
    self:initPass(self.cmdBuf, self.rt4, self.quadMesh, self.highPassFilterMaterial, false)

    self.width = -1
    self.height = -1
end

function acne_remove:onUpdate(comp, deltaTime)
    local outputTex = comp.entity.scene:getOutputRenderTexture()
    if self.width ~= outputTex.width or self.height ~= outputTex.height then
        self.width = outputTex.width
        self.height = outputTex.height
        self.ratio  = (self.width * self.height) / (720 * 1280)
        if self.ratio < 1.0 then
            self.ratio = 1.0
        else
            if self.ratio > 2.25 then
                self.ratio = 2.25
            end
        end
        local pecent =  -0.16 * self.ratio + 0.56
        self.rt1.pecentX = pecent
        self.rt1.pecentY = pecent
        self.rt2.pecentX = pecent
        self.rt2.pecentY = pecent
        self.faceMaskRT.pecentX = pecent
        self.faceMaskRT.pecentY = pecent
    end

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceCount = result:getFaceCount()
    for i = 0, faceCount - 1 do
        local points_array = result:getFaceBaseInfo(i).points_array
        self.meshTool:updateMeshWithFaceData106(self.meshType, points_array, i)
        -- print("mesh point array size: ", points_array:size())
    end
    self.makeupMesh:getSubMesh(0).indicesCount = faceCount * self.indicesCount

    self:updateFaceMask()
    self:updateFaceInfoBySize()

    if self.faceInfoBySize[1] == nil then
        self.faceFactor = 0.0
    else
        self.faceFactor = self.faceInfoBySize[1].size
    end

    local radius = 6.0
    local threshold = 5.0

    if self.faceFactor < 0.025 then
        radius = 1.0
        threshold = 5.0
    elseif self.faceFactor < 0.2 then
        radius = 5.0
        threshold = 6.0
    else
        radius = 6.0
        threshold = 5.0
    end
    
    local mvpMatrix = Amaz.Matrix4x4f()
    mvpMatrix:SetTranslate(Amaz.Vector3f(-1, -1, 0))
    mvpMatrix:Scale(Amaz.Vector3f(2, 2, 1))
    mvpMatrix:Translate(Amaz.Vector3f(0, 1, 0))
    mvpMatrix:Scale(Amaz.Vector3f(1, -1, 1))
    mvpMatrix:Scale(Amaz.Vector3f(1 / self.width, 1 / self.height, 1))

    self.facialMaskMaterial:setMat4("uMVPMatrix", mvpMatrix)

    self.faceExtraMaterial:setTex("u_maskTexture0", self.faceMaskInfo[1].texture)
    self.faceExtraMaterial:setTex("u_maskTexture1", self.faceMaskInfo[2].texture)
    self.faceExtraMaterial:setTex("u_maskTexture2", self.faceMaskInfo[3].texture)
    self.faceExtraMaterial:setTex("u_maskTexture3", self.faceMaskInfo[4].texture)
    self.faceExtraMaterial:setTex("u_maskTexture4", self.faceMaskInfo[5].texture)
    self.faceExtraMaterial:setMat4("u_MVP0", self.faceMaskInfo[1].mvp)
    self.faceExtraMaterial:setMat4("u_MVP1", self.faceMaskInfo[2].mvp)
    self.faceExtraMaterial:setMat4("u_MVP2", self.faceMaskInfo[3].mvp)
    self.faceExtraMaterial:setMat4("u_MVP3", self.faceMaskInfo[4].mvp)
    self.faceExtraMaterial:setMat4("u_MVP4", self.faceMaskInfo[5].mvp)
    self.faceExtraMaterial:setVec2("u_ScreenSize", Amaz.Vector2f(self.width, self.height))

    self.erodeDilateHMaterial:setVec2("u_ScreenSize", Amaz.Vector2f(self.faceMaskRT.width, self.faceMaskRT.height))
    self.erodeDilateVMaterial:setVec2("u_ScreenSize", Amaz.Vector2f(self.rt2.width, self.rt2.height))

    self.medianFilterMaterial:setVec2("u_texelStep", Amaz.Vector2f(1.0 / (self.rt2.width), 1.0 / (self.rt2.height)))
    self.medianFilterMaterial:setFloat("u_threshold", threshold / 255.0)
    self.medianFilterMaterial:setFloat("u_radius", radius)

    self.gaussianBlurMaterial:setVec2("u_texelStep", Amaz.Vector2f(1.0 / self.width, 0.0))
    self.highPassFilterMaterial:setVec2("u_texelStep", Amaz.Vector2f(0.0, 1.0 / self.height))

    comp.entity.scene:commitCommandBuffer(self.cmdBuf)
end

function acne_remove:updateFaceInfoBySize()
    self.faceInfoBySize = {}

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceCount = result:getFaceCount()
    for i = 0, faceCount - 1 do
        local faceSize = 0
        local baseInfo = result:getFaceBaseInfo(i)
        local faceId = baseInfo.ID
        local faceRect = baseInfo.rect
        faceSize = faceRect.width * faceRect.height
        table.insert(self.faceInfoBySize, {
            index = i,
            id = faceId,
            size = faceSize
        })
    end

    table.sort(self.faceInfoBySize, function(a, b)
        return a.size > b.size
    end)
end

function acne_remove:updateFaceMaskIndexed(result, index)
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceExtraModelMatrix = Amaz.Matrix4x4f()
    local faceMask = result:getFaceFaceMask(index)
    if faceMask == nil then
        -- print("nil", index)
        return nil, faceExtraModelMatrix
    end
    local warp_mat = faceMask.warp_mat
    local W = faceMask.face_mask_size
    local H = faceMask.face_mask_size

    faceExtraModelMatrix:SetRow(0,
        Amaz.Vector4f(warp_mat:get(0) / W, warp_mat:get(1) / W, 0.0, warp_mat:get(2) / W))
    faceExtraModelMatrix:SetRow(1,
        Amaz.Vector4f(warp_mat:get(3) / H, warp_mat:get(4) / H, 0.0, warp_mat:get(5) / H))
    faceExtraModelMatrix:SetRow(2, Amaz.Vector4f(0.0, 0.0, 1.0, 0.0))
    faceExtraModelMatrix:SetRow(3, Amaz.Vector4f(0.0, 0.0, 0.0, 1.0))

    return faceMask.image, faceExtraModelMatrix
end

function acne_remove:updateFaceMask(result)
    for i = 0, MAX_FACE - 1 do
        local info = self.faceMaskInfo[i + 1]
        local image, mvp = self:updateFaceMaskIndexed(result, i)
        info.texture:storage(image)
        info.mvp = mvp
    end
end

function acne_remove:initPass(cmdbuf, rt, mesh, material, clear)
    cmdbuf:setRenderTexture(rt)
    cmdbuf:clearRenderTexture(clear, clear, self.clearColor)
    cmdbuf:drawMesh(mesh, self.identityMatrix, material, 0, 0, nil, true)
end

exports.acne_remove = acne_remove
return exports
