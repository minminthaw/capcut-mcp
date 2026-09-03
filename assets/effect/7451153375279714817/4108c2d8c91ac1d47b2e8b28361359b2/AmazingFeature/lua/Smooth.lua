local exports = exports or {}
local Smooth = Smooth or {}
Smooth.__index = Smooth

local AE_EFFECT_TAG = 'AE_EFFECT_TAG Smooth'
local function print(...)
    local arg = { ... }
    local msg = ""
    for k, v in pairs(arg) do
        msg = msg .. tostring(v) .. " "
    end
    Amaz.LOGE(AE_EFFECT_TAG, msg)
end

local MAX_FACE = 5

function Smooth.new(construct, ...)
    local self = setmetatable({}, Smooth)
    self.name = "Smooth"
    return self
end

function Smooth:onStart(comp, script)
    local scene               = script.scene

    self.g_radius             = 2.0
    self.width                = -1
    self.height               = -1

    -- rt
    self.table                = scene:findEntityBy("Table"):getComponent("TableComponent").table
    self.rt1                  = self.table:get("RT1")
    self.rt2                  = self.table:get("RT2")
    self.rt3                  = self.table:get("RT3")
    self.rt4                  = self.table:get("RT4")
    self.rt5                  = self.table:get("RT5")
    self.faceExtraMaskRT      = self.table:get("FaceExtraMaskRT")

    -- materials
    self.facialMaskMaterial   = self.table:get("FacialMaskMaterial")
    self.faceExtraMaterial    = self.table:get("FaceExtraMaterial")
    self.gblur0Material       = self.table:get("GBlurPass0Material")
    self.gblur1Material       = self.table:get("GBlurPass1Material")
    self.substractMaterial    = self.table:get("SubstractMaterial")
    self.blur3Material        = self.table:get("Blur3Material")
    self.highPassMaterial     = self.table:get("HighPassMaterial")

    self.quadMesh             = self.table:get("quadMesh")
    self.makeupMesh           = self.table:get("makeupMesh")
    self.indicesCount         = 768

    self.meshTool             = Amaz.AMGFaceMeshUtils()
    self.meshType             = Amaz.AMGBeautyMeshType.FACE145
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
    self:initPass(self.cmdBuf, self.faceExtraMaskRT, self.quadMesh, self.faceExtraMaterial, false)

    -- downsample to 0.45
    local inputTex = self.table:get("inputTex")
    self.cmdBuf:blit(inputTex, self.rt2)

    self:initPass(self.cmdBuf, self.rt1, self.quadMesh, self.gblur0Material, false)
    self:initPass(self.cmdBuf, self.rt2, self.quadMesh, self.gblur1Material, false)

    self:initPass(self.cmdBuf, self.rt4, self.quadMesh, self.substractMaterial, false)
    self:initPass(self.cmdBuf, self.rt3, self.quadMesh, self.blur3Material, false)
    self:initPass(self.cmdBuf, self.rt5, self.quadMesh, self.highPassMaterial, false)
end

function Smooth:onUpdate(comp, deltaTime)
    local intensity = self.table:get("intensity")
    
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
            local pecent = -0.2 * self.ratio + 0.65
            self.rt1.pecentX = pecent
            self.rt1.pecentY = pecent
            self.rt2.pecentX = pecent
            self.rt2.pecentY = pecent
            self.faceExtraMaskRT.pecentX = pecent
            self.faceExtraMaskRT.pecentY = pecent
        end
    end
    -- print("ratio: ", self.ratio)

    intensity = math.min(intensity, 100.0)
    if intensity > 1.0 then
        if intensity < 70.0 then
            -- [1, 3] linear
            -- https://docs.opencv.org/2.4/modules/imgproc/doc/filtering.html#getgaussiankernel
            -- sigma = 0.3*((ksize-1)*0.5 - 1) + 0.8
            self.high_fq = intensity / 35.0 + 1.0
            self.high_fq_sigma = 0.3 * ((self.high_fq - 1.0) * 0.5 - 1) + 0.8
        else
            -- [3, 4] linear
            self.high_fq = (intensity - 70.0) / 30.0 + 3.0
            self.high_fq_sigma = 0.3 * ((self.high_fq - 1.0) * 0.5 - 1) + 0.8
        end

        -- update matrials
        self:UpdateFaceMaskPass(comp)
        self:onUpdateSmooth(comp)

        outputTex.inputTexture = nil
        -- commitCommandBuffer
        comp.entity.scene:commitCommandBuffer(self.cmdBuf)
    end
end

function Smooth:onUpdateSmooth(comp)
    if self.faceFactor < 0.2 then
        self.low_fq = 20.0
        self.low_fq_sigma = 3.5
    else
        self.low_fq = 30.0
        self.low_fq_sigma = 5.0
    end

    local widthOffset = 1.0 / (self.rt1.width)
    local heightOffset = 1.0 / (self.rt1.height)

    self.gblur0Material:setVec2("u_texelStep", Amaz.Vector2f(widthOffset, 0.0))
    self.gblur0Material:setFloat("u_radius", self.g_radius)
    self.gblur0Material:setTex("u_faceMaskTex", self.faceExtraMaskRT)

    self.gblur1Material:setVec2("u_texelStep", Amaz.Vector2f(0.0, heightOffset))
    self.gblur1Material:setFloat("u_radius", self.g_radius)

    self.blur3Material:setVec2("u_texelStep", Amaz.Vector2f(1.0 / self.width, 0.0))
    self.highPassMaterial:setVec2("u_texelStep", Amaz.Vector2f(0.0, 1.0 / self.height))
end

function Smooth:UpdateFaceMaskPass(comp)
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceCount = result:getFaceCount()

    for i = 0, faceCount - 1 do
        local points_array = result:getFaceBaseInfo(i).points_array
        self.meshTool:updateMeshWithFaceData106(self.meshType, points_array, i)
        -- print("mesh point array size: ", points_array:size())
    end
    self.makeupMesh:getSubMesh(0).indicesCount = faceCount * self.indicesCount

    self:updateFaceMask(result)
    self:updateFaceInfoBySize()

    if self.faceInfoBySize[1] == nil then
        self.faceFactor = 0.0
    else
        self.faceFactor = self.faceInfoBySize[1].size
    end
    self.table:set("u_faceFactor", self.faceFactor)

    local facialMaskMVP = Amaz.Matrix4x4f()
    facialMaskMVP:SetTranslate(Amaz.Vector3f(-1, -1, 0))
    facialMaskMVP:Scale(Amaz.Vector3f(2, 2, 1))
    facialMaskMVP:Translate(Amaz.Vector3f(0, 1, 0))
    facialMaskMVP:Scale(Amaz.Vector3f(1, -1, 1))
    facialMaskMVP:Scale(Amaz.Vector3f(1 / self.width, 1 / self.height, 1))

    local screenSize = Amaz.Vector2f(self.rt1.width, self.rt1.height)
    -- out rt1
    self.facialMaskMaterial:setMat4("uMVPMatrix", facialMaskMVP)
    --out faceExtraMaskRT
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
end

function Smooth:updateFaceInfoBySize()
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

function Smooth:updateFaceMaskIndexed(result, index)
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

function Smooth:updateFaceMask(result)
    for i = 0, MAX_FACE - 1 do
        local info = self.faceMaskInfo[i + 1]
        local image, mvp = self:updateFaceMaskIndexed(result, i)
        info.texture:storage(image)
        info.mvp = mvp
    end
end

function Smooth:initPass(cmdbuf, rt, mesh, material, clear)
    cmdbuf:setRenderTexture(rt)
    cmdbuf:clearRenderTexture(clear, clear, self.clearColor)
    cmdbuf:drawMesh(mesh, self.identityMatrix, material, 0, 0, nil, true)
end

exports.Smooth = Smooth
return exports
