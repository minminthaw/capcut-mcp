local exports = exports or {}
local SadGE = SadGE or {}
local json = cjson.new()
SadGE.__index = SadGE

function SadGE.new(construct, ...)
    local self = setmetatable({}, SadGE)
    self.comps = {}
    self.compsdirty = true
    return self
end

local curP = 0
local p = 0
local duration = 1
local tmp1 = true

local lastFrame = 0
--[replaceChinese]pas[replaceChinese]
local hasSeqPass = false

-- buffer
local passTmpRt = nil
local prevPassRt = nil
local passRt = nil
local bufferInit = 0
-- protocol list

--region
local GEProtocolList = {}
GEProtocolList.init = function(sys)
    local width = Amaz.BuiltinObject:getInputTextureWidth()
    local height = Amaz.BuiltinObject:getInputTextureHeight()
    GEProtocolList[200] = math.floor(width)
    GEProtocolList[201] = math.floor(height)
    GEProtocolList[300] = 1 / width
    GEProtocolList[301] = 1 / height
    GEProtocolList[3007] = 0
    GEProtocolList["frame"] = 0
end
GEProtocolList.update = function(deltaTime)
    if isDebug == true then
        curP = (curP + deltaTime) % duration
        p = curP / duration
        GEProtocolList[3007] = p
    else
        curP = 0
        GEProtocolList[3007] = Amaz.Input.frameTimestamp
    end

    if #stringK > 0 then
        GEProtocolList["frame"] = math.floor((GEProtocolList[3007]) * frameCnt) + startFrame
        if GEProtocolList["frame"] > frameCnt - 1 then
            GEProtocolList["frame"] = frameCnt - 1
        end
        if GEProtocolList["frame"] < 0 then
            GEProtocolList["frame"] = 0
        end
    end
end
--endregion

function SadGE:constructor()
end

function SadGE:onComponentAdded(sys, comp)
    if comp:isInstanceOf("Camera") and self.cameraComp == nil and comp.entity.name == "Camera_entity" then
        self.cameraComp = comp
    elseif comp:isInstanceOf("Camera") and self.animCamComp == nil and comp.entity.name ~= "Camera_entity" then
        self.animCamComp = comp
        printAmazing("animCamComp")
    end
end

local meshRenderer
function SadGE:checkOnStart(sys, index, effect, key, uniform)
    local t = uniform.type
    if t == 1 then
        if stringK[uniform.name] == nil then
            self.filterTex = sys.scene.assetMgr:SyncLoad("xshader/" .. uniform.data[1])
            self.mats[index]:setTex(uniform.name, self.filterTex)
        else
            if self.animRT[effect.name] == nil then
                self.animRT[effect.name] = renderTexture(effect.name .. "_AnimRt", self.width, self.height)
                self.meshRenderers[effect.name] =
                    animCamera(sys, effect.name, self.animRT[effect.name], self.mats[index])
            end
            self.animSeq[uniform.name] = animSequence(sys, uniform.name)
            hasSeqPass = true
        end
    elseif t == 2 then
        if GEProtocolList[uniform.name] == nil then
            self.mats[index]:setInt(uniform.name, uniform.data[1])
        end
    elseif t == 3 then
        if GEProtocolList[uniform.name] == nil then
            self.mats[index]:setFloat(uniform.name, uniform.data[1])
        end
    elseif t == 4 then
        self.mats[index]:setVec2(uniform.name, Amaz.Vector2f(uniform.data[1], uniform.data[2]))
    elseif t >= 200 and t < 300 then
        self.mats[index]:setInt(uniform.name, GEProtocolList[t])
    elseif t == 1000 then
        if effect.passId ~= 1 then
            local rtFromPassName = effect.inputEffect[uniform.inputEffectIndex + 1]
            local prePass = self.geInfo.effect[rtFromPassName]
            if prePass.passId ~= effect.passId - 1 then
                prePass.needRt = true
                prePass.rt = renderTexture(rtFromPassName .. "exclusive", self.width, self.height)
            end
        else
            printAmazing("ERROR! passId == 1, but use tex 1000")
        end
    end
end

function SadGE:onStart(sys)
    self.duration = duration
    self.passCnt = 0

    local output_rt = sys.scene:getOutputRenderTexture()
    output_rt.attachment = Amaz.RenderTextureAttachment.NONE

    self.cmdBuf1 = Amaz.CommandBuffer()
    self.cmdBuf2 = Amaz.CommandBuffer()
    self.useBuf = self.cmdBuf1

    GEProtocolList.init(sys)

    local geTable = file(sys, "generalEffect.json")
    self.geInfo = json.decode(geTable)

    local viewport = self.geInfo.effect[1].viewport
    self.outputTex = self.cameraComp.renderTexture
    if viewport == nil then
        viewport = {0, 0, 1, 1}
    end
    self.width = self.outputTex.width * viewport[3]
    self.height = self.outputTex.height * viewport[4]

    self.mixMat = material(myV, blitMeRev, "mixMat")
    self.mats = {}
    self.input = {}
    self.animRT = {}
    self.meshRenderers = {}
    self.animSeq = {}
    self.block = {}
    if isDebug == true then
        self.input[0] = sys.scene.assetMgr:SyncLoad("image/1.png")
        self.input[1] = sys.scene.assetMgr:SyncLoad("image/2.png")
    else
        local input1 = Amaz.BuiltinObject.getUserTexture("#TransitionInput0")
        local input2 = Amaz.BuiltinObject.getUserTexture("#TransitionInput1")
        self.input[0] = input1
        self.input[1] = input2
    end

    self.passCnt = #self.geInfo.effect
    for index, effect in ipairs(self.geInfo.effect) do
        self.geInfo.effect[effect.name] = effect
        effect.passId = index
        printAmazing("add", effect.name)
        local vert = file(sys, effect.vertexShader)
        local frag = file(sys, effect.fragmentShader)
        self.mats[index] = material(vert, frag, effect.name)

        hasSeqPass = false
        for key, uniform in pairs(effect.vUniforms) do
            self:checkOnStart(sys, index, effect, key, uniform)
        end
        for key, uniform in pairs(effect.fUniforms) do
            self:checkOnStart(sys, index, effect, key, uniform)
        end
        effect.hasSeq = hasSeqPass
    end
    if self.passCnt > 2 then
        self.tmpTex1 = renderTexture("tmp", self.width, self.height)
        self.tmpTex2 = renderTexture("tmp2", self.width, self.height)
    elseif self.passCnt > 1 then
        self.tmpTex1 = nil
        self.tmpTex2 = renderTexture("tmp2", self.width, self.height)
    end
    self.normMesh = createRectMesh2()
    self.model = Amaz.Matrix4x4f()
    self.model:setIdentity()
end
local f = false
function SadGE:onUpdate(sys, deltaTime)
    GEProtocolList.update(deltaTime)
    if f == false then
        f = true
        sys:addScriptListener(self.animCamComp, Amaz.CameraEvent.BEFORE_RENDER, "cameraCallBack", sys)
        sys:addScriptListener(self.cameraComp, Amaz.CameraEvent.AFTER_RENDER, "commitBuf", sys)
    end
    for i, v in pairs(self.animSeq) do
        v.frameIndex = GEProtocolList["frame"]
    end
end

function SadGE:checkOnCallback(sys, index, effect, key, uniform)
    local t = uniform.type
    local mat = effect.hasSeq == true and self.meshRenderers[effect.name].material or self.mats[index]
    if t == 1 then
    elseif t == 2 then
        if GEProtocolList[uniform.name] ~= nil then
            mat:setInt(uniform.name, GEProtocolList[uniform.name])
        end
    elseif t == 3 then
        if GEProtocolList[uniform.name] ~= nil then
            mat:setFloat(uniform.name, GEProtocolList[uniform.name])
        end
    elseif t == 4 then
        if GEProtocolList[uniform.name] ~= nil then
            mat:setVec2(uniform.name, Amaz.Vector2f(GEProtocolList[uniform.name][1], GEProtocolList[uniform.name][2]))
        end
    elseif t == 100 then
        local tex
        if considerTemplate == true then
            if GEProtocolList[3007] > templateDividingTime then
                tex = self.input[1]
            else
                tex = self.input[0]
            end
        else
            tex = self.input[0]
        end
        mat:setTex(uniform.name, tex)
    elseif t == 103 then
        local tex
        if considerTemplate == true then
            if GEProtocolList[3007] > templateDividingTime then
                tex = self.input[1]
            else
                tex = self.input[0]
            end
        else
            tex = self.input[uniform.inputTextureIndex]
        end
        mat:setTex(uniform.name, tex)
    elseif t == 1000 then
        local rtFromPassName = effect.inputEffect[uniform.inputEffectIndex + 1]
        local prevRt
        if self.geInfo.effect[rtFromPassName].needRt == nil then
            prevRt = tmp1 == true and self.tmpTex1 or self.tmpTex2
        else
            prevRt = self.geInfo.effect[rtFromPassName].rt
        end
        mat:setTex(uniform.name, prevRt)
    elseif t == 3007 then
        mat:setFloat(uniform.name, GEProtocolList[t])
    end
end
function SadGE:cameraCallBack(sys, camera, eventType)
    -- if eventType == Amaz.CameraEvent.BEFORE_RENDER then
    printAmazing(camera.entity.name)
    tmp1 = true
    local input1 = Amaz.BuiltinObject.getUserTexture("#TransitionInput0")
    local input2 = Amaz.BuiltinObject.getUserTexture("#TransitionInput1")

    if input1 and input2 then
        self.input[0] = input1
        self.input[1] = input2
    end

    for index, effect in ipairs(self.geInfo.effect) do
        for key, uniform in pairs(effect.vUniforms) do
            self:checkOnCallback(sys, index, effect, key, uniform)
        end
        for key, uniform in pairs(effect.fUniforms) do
            self:checkOnCallback(sys, index, effect, key, uniform)
        end

        if effect.hasSeq == true then
            if index == 1 then
                if considerTemplate == true then
                    if GEProtocolList[3007] > templateDividingTime then
                        printAmazing(1)
                        prevPassRt = self.input[1]
                    else
                        printAmazing(0)
                        prevPassRt = self.input[0]
                    end
                else
                    prevPassRt = self.input[0]
                end
            else
                local prevPass = self.geInfo.effect[index - 1]
                prevPassRt = (prevPass.needRt == nil and (tmp1 == true and self.tmpTex1 or self.tmpTex2) or effect.rt)
            end
            if self.block[effect.name] == nil then
                self.block[effect.name] = Amaz.MaterialPropertyBlock()
            end
            self.mixMat:setTex("_PassTex", self.animRT[effect.name])
            self.mixMat:setTex("_BaseTex", prevPassRt)
        end

        if bufferInit == 0 then
            if effect.passId == self.passCnt then
                printAmazing("lastPass")
                passRt = self.outputTex
            else
                passRt = (effect.needRt == nil and (tmp1 == true and self.tmpTex2 or self.tmpTex1) or effect.rt)
            end

            if effect.hasSeq == false then
                self.useBuf:blitWithMaterial(self.outputTex, passRt, self.mats[index])
            else
                self.useBuf = self.cmdBuf2
                self.useBuf:blitWithMaterial(self.outputTex, passRt, self.mixMat)
            end
        end
        tmp1 = not tmp1
    end
    if bufferInit == 0 then
        bufferInit = 1
    end
    -- end
    sys.scene:commitCommandBuffer(self.cmdBuf1)
end
function SadGE:commitBuf(sys, camera, eventType)
    sys.scene:commitCommandBuffer(self.cmdBuf2)
end
exports.SadGE = SadGE
return exports
