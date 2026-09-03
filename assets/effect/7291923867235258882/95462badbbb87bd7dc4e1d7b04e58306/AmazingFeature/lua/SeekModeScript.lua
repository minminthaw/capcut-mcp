--@input float curTime = 0.0{"widget":"slider","min":0,"max":1}

local exports = exports or {}
local SeekModeScript = SeekModeScript or {}
SeekModeScript.__index = SeekModeScript

function print(...)
    local arg = { ... }
    local msg = "effect_lua:"
    for k, v in pairs(arg) do
        msg = msg .. tostring(v) .. " "
    end
    -- Amaz.LOGE("nxs_sticker_dianguang", msg)
end

function SeekModeScript.new(construct, ...)
    local self = setmetatable({}, SeekModeScript)
    if construct and SeekModeScript.constructor then SeekModeScript.constructor(self, ...) end
    self.startTime = 0.0
    self.endTime = 3.0
    self.curTime = 0.0

    self.comps = {}
    self.compsdirty = true
    self.width = 0
    self.height = 0
    
    self.scan_dir = 1.0
    self.scan_speed = 4.0 
    self.scan_width = 0.30 
    self.color = 0.6

    self.brightness = 0.4
    self.size = 8.0
    self.brightness_mosaic = 0.3
    self.filter_alpha = 1.0 
    self.scan_glow_shiness = 2.0 
   
    self.blur = 3.0
    
    self.frame_count = 0
    self.totalTime = 0
    return self
end

function SeekModeScript:constructor()
    print('running: SeekModeScript:constructor')
end

function SeekModeScript:onStart(comp)
    print('running: SeekModeScript:onStart')
    local scanEntity = comp.entity
    print("enetity name: " .. scanEntity.name)
    local scanResource = nil
    scanResource = scanEntity:getComponent("TableComponent").table
    
    self.depthLayer_material = scanResource:get("depthLayer_m")
    self.depthLayer1_material = scanResource:get("depthLayer1")
    
    self.blending_material = scanResource:get("blending")
    self.gaussianHor_material = scanResource:get("gaussianHor")
    self.gaussianVer_material = scanResource:get("gaussianVer")
    self.gaussianHor1_material = scanResource:get("gaussianHor1")
    self.gaussianVer1_material = scanResource:get("gaussianVer1")
    self.gaussianInputV_material = scanResource:get("gaussInputV")
    self.gaussianInputH_material = scanResource:get("gaussInputH")
    self.gauss2V_material = scanResource:get("gauss2V")
    self.gauss2H_material = scanResource:get("gauss2H")
    self.gaussDV_material = scanResource:get("gaussDV")
    self.gaussDH_material = scanResource:get("gaussDH")
    self.displace_mat = scanResource:get("displace_mat")
    self.rotate_mat = scanResource:get("rotate_mat")
    self.face_material = scanResource:get("face_mat")

    self.faceRT = scanResource:get("face_rt")
    self.face2RT = scanResource:get("face2_rt")
    self.depthLayerRT = scanResource:get("depth_layer_rt")
    self.outputRT = scanResource:get("output_rt")
    self.inputTexture = scanResource:get("input_texture")
    self.filterRT = scanResource:get("filter_rt")
    self.noiseRT = scanResource:get("noise_png")
    self.blurRT = scanResource:get("blur_rt")
    self.blurAuxRT = scanResource:get("blurAux")
    self.scanRT = scanResource:get("scan_rt")

    self.quadMesh = scanResource:get("quad_mesh")
    self.noise_maps = {}
    for i = 0, 29 do
        local ci = string.char(i)
        local source_name = "noise_a" .. i
        local keyname     = "ind" .. i
        self.noise_maps[keyname] = scanResource:get(source_name)
    end
    self.noiseMapInd = 0
   
    -- self.compnent.enabled = false

    self.input1 = comp.entity.scene.assetMgr:SyncLoad("image/input1.jpg")
    self.input2 = comp.entity.scene.assetMgr:SyncLoad("image/input2.jpg")
    self:initCommandBuffer()
end

function SeekModeScript:initCommandBuffer()
    self.commandBufStatic = Amaz.CommandBuffer()
    self.commandBufDynamic = Amaz.CommandBuffer()
    self.commandBufDynamic1 = Amaz.CommandBuffer()
    self.identityMatrix = Amaz.Matrix4x4f():SetIdentity()
    self.clearColor = Amaz.Color(0, 0, 0, 0)


    local depthText = Amaz.Texture2D()
    depthText.filterMin = Amaz.FilterMode.LINEAR
    depthText.filterMag = Amaz.FilterMode.LINEAR

    self.depthLayer_material:setTex("depthTexture", depthText)
    self.depthLayer_material:setTex("inputTexture", self.inputTexture)
    self:initPass(self.commandBufStatic, self.outputRT, self.quadMesh, self.depthLayer_material)

    self.depthLayer1_material:setTex("inputTexture", self.outputRT)
    self:initPass(self.commandBufStatic, self.depthLayerRT , self.quadMesh, self.depthLayer1_material)

    -- glow
    self.gaussianHor_material:setTex("inputTexture", self.depthLayerRT)
    self:initPass(self.commandBufStatic, self.blurAuxRT, self.quadMesh, self.gaussianHor_material)

    self.gaussianVer_material:setTex("inputTexture", self.blurAuxRT)
    self:initPass(self.commandBufStatic, self.blurRT, self.quadMesh, self.gaussianVer_material)

    self.gaussianHor1_material:setTex("inputTexture", self.blurRT)
    self:initPass(self.commandBufStatic, self.blurAuxRT, self.quadMesh, self.gaussianHor1_material)
    self.gaussianVer1_material:setTex("inputTexture", self.blurAuxRT)
    self:initPass(self.commandBufStatic, self.blurRT, self.quadMesh, self.gaussianVer1_material)
    
    -- blend
    self.blending_material:setTex("depthTexture",  depthText) 
    self.blending_material:setTex("filterTexture", self.filterRT) 
    self.blending_material:setTex("inputTexture1", self.inputTexture)
    self.blending_material:setTex("inputTexture2", self.depthLayerRT)
    self.blending_material:setTex("blurTexture",   self.blurRT)
    self:initPass(self.commandBufStatic, self.scanRT, self.quadMesh, self.blending_material)

    -- face
    local ftex = Amaz.Texture2D()
    ftex.filterMin = Amaz.FilterMode.LINEAR
    ftex.filterMag = Amaz.FilterMode.LINEAR
    self.face_material:setTex("maskTexture",  ftex) 
    self:initPass(self.commandBufStatic, self.faceRT, self.quadMesh, self.face_material)
    -- face blur
    self.gauss2V_material:setTex("inputTexture", self.faceRT)
    self:initPass(self.commandBufStatic, self.face2RT, self.quadMesh, self.gauss2V_material)
    self.gauss2H_material:setTex("inputTexture", self.face2RT)
    self:initPass(self.commandBufStatic, self.faceRT, self.quadMesh, self.gauss2H_material)

    -- displacement
    self.displace_mat:setTex("depth_info", self.depthLayerRT) 
    self.displace_mat:setTex("faceMask",   self.faceRT) 
    self.displace_mat:setTex("inputImageTexture", self.inputTexture) 
    self.displace_mat:setTex("depthTexture",  depthText) 
    self.displace_mat:setTex("noise_Input", self.noiseRT)  
    self.displace_mat:setTex("blueTex",    self.scanRT) 
    -- direct outptu
    self:initPass(self.commandBufStatic, self.outputRT, self.quadMesh, self.displace_mat)
    -- add blur
    -- self:initPass(self.commandBufStatic, self.blurRT, self.quadMesh, self.displace_mat)

    -- blur for displacement
    self.gaussDV_material:setTex("inputTexture", self.outputRT)
    self:initPass(self.commandBufStatic, self.scanRT, self.quadMesh, self.gaussDV_material)
    self.gaussDH_material:setTex("inputTexture", self.scanRT)
    self.gaussDH_material:setTex("inputTexture_in2", self.input2)
    self:initPass(self.commandBufStatic, self.outputRT, self.quadMesh, self.gaussDH_material)
end

function SeekModeScript:initPass(cmdbuf, rt, mesh, material)
    cmdbuf:setRenderTexture(rt)
    cmdbuf:clearRenderTexture(true, true, self.clearColor)
    cmdbuf:drawMesh(mesh, self.identityMatrix, material, 0, 0, nil, true)
end


-- local graphName = "Editor_Sticker_Config_TAG_wd20230612nxs_dianguang"
-- local resNodeName = "nh_script_0"

function SeekModeScript:onUpdate(comp, detalTime)

    self.gaussianHor_material:setFloat( "thresh", 0.5)
    self.gaussianVer_material:setFloat( "thresh", 0.2)
    self.gaussianHor1_material:setFloat("thresh", 0.0)
    self.gaussianVer1_material:setFloat("thresh", 0.0)

    -- Amaz.LOGI("XUDDLOG onUpdate input1 width=", self.input1.width)
    local input1 = Amaz.BuiltinObject.getUserTexture("#TransitionInput0")
    local input2 = Amaz.BuiltinObject.getUserTexture("#TransitionInput1")
    if input1 and input2 then
        -- Amaz.LOGI("XUDDLOG we are in Mobile APP!", 3.0)
        self.input1 = input1
        self.input2 = input2

        self.curTime = Amaz.Input.frameTimestamp;
        self.progress = Amaz.Input.frameTimestamp;
        -- Amaz.LOGI("XUDDLOG self.input1 width=" , self.input1.width)
    else
        self.curTime = self.curTime + detalTime
        self.progress = (self.curTime-self.startTime)%1.0
    end

    self.width = self.input2.width
    self.height = self.input2.height
    local screenParams = Amaz.Vector4f(self.width, self.height, 0.0, 1.0)
    self.displace_mat:setVec4("u_ScreenParams", screenParams)
    self.rotate_mat:setFloat("minHW", math.min(self.width, self.height))

    local timeBgAni = self.curTime - self.startTime

    -- noise sequence
    self.noiseMapInd = self.noiseMapInd + 1
    local imgIdx = self.noiseMapInd % 30
    local keyname = "ind" .. imgIdx
    self.displace_mat:setTex("noise_Input", self.noise_maps[keyname])  
    self.displace_mat:setTex("inputImageTexture", self.input2) 
    
    local shift_amp = 0.01*math.sin(timeBgAni* 3.1415926*15)
    local wiggle_amp = shift_amp
    local ease_in_out_ratio = 0.0
    local TH = 0.2
    if self.progress < TH then
        local t = self.progress/TH
        ease_in_out_ratio =t*t*(3.0-2.0*t) 
    else
        local t = (1.0-self.progress)/(1.0-TH)
        t = t*t -- decay faster
        ease_in_out_ratio =t*t*(3.0-2.0*t) 
    end

    local easeOut_gauss2H = 1.0
    local g2H_TH = 0.6
    if self.progress > g2H_TH then
        local t = (1.0-self.progress)/(1.0-g2H_TH)
        easeOut_gauss2H  = t*t*(3.0-2.0*t) 
    end
    -- self.gauss2H_material:setFloat("easyOut_ratio", easeOut_gauss2H)
    -- self.gauss2H_material:setFloat("angle_offset", 0.0)
    -- self.gauss2H_material:setFloat("steps", 200.0)
    self.blending_material:setFloat("easyOut_ratio", easeOut_gauss2H)

    local easeOut_displace = 1.0
    local dis_TH = 0.5
    if self.progress > dis_TH then
        local t = (1.0-self.progress)/(1.0-dis_TH)
        easeOut_displace  = t*t*(3.0-2.0*t) 
        if self.progress > 0.8 then
            easeOut_displace = easeOut_displace* easeOut_displace
        end
        if self.progress > 0.95 then
            easeOut_displace = 0.0
        end
    end
    self.displace_mat:setFloat("displace_easyOut_ratio", easeOut_displace)

    local p = 0.8* self.progress + 0.1
    local radial_center = Amaz.Vector2f(p, p)
    self.rotate_mat:setVec2("u_Center", radial_center)
    self.rotate_mat:setFloat("u_Amount", 7.5)
    self.rotate_mat:setFloat("u_Quality", 20.0)
    
    self.blending_material:setTex("inputTexture1_in1",  self.input2)
    self.blending_material:setTex("inputTexture1_in2",  self.input1)
    local shake_ratio = wiggle_amp* ease_in_out_ratio
    -- Amaz.LOGI("XUDDLOG shake ratio=", ease_in_out_ratio)
    self.blending_material:setFloat("amp",  shake_ratio)

    local color_shake_ratio = 0.010*math.sin(timeBgAni* 3.1415926*5)* ease_in_out_ratio
    self.blending_material:setFloat("color_amp",  color_shake_ratio)

    local displace2x = -0.18
    local tspare = 1.0*math.sin(self.progress* 6.28)* (0.5+0.5*ease_in_out_ratio)
    self.displace_mat:setVec4("u_intensity_x", Amaz.Vector4f(displace2x* tspare, 0.05* tspare, 0.0, 0.0))
    local displace2y = -0.18
    self.displace_mat:setVec4("u_intensity_y", Amaz.Vector4f(0.05* tspare, displace2y* tspare, 0.0, 0.0))

    self.gaussianInputV_material:setTex("inputTexture", self.input2)
    self.gaussDH_material:setTex("inputTexture_in2", self.input2)

    self.graph_name = 'Editor_Sticker_Config_TAG_wd20230612nxs_dianguang'
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local sceneRecog = result:getAlgorithmInfo(self.graph_name, "depth_1", "depth")
    if (sceneRecog ~= nil) then
        local tex = self.depthLayer_material:getTex("depthTexture")
        depthEst = sceneRecog:get("depthEstimation")
        local depthImage = depthEst.image
        if depthImage and tex then
            tex:storage(depthImage)
        end
    end

    local faceCount = result:getFaceCount()
    -- Amaz.LOGI("XUDDLOG faceC=", faceCount)
    for i = 0, faceCount - 1 do
        -- self.face_material.mesh.clearAfterUpload = false
        self.face_material:setTex("inputTexture", self.inputTexture)

        local faceMask = result:getFaceFaceMask(i)
        if faceMask then
            local warp_mat = faceMask.warp_mat
            local W = faceMask.face_mask_size
            local H = faceMask.face_mask_size

            local modelMatrix = Amaz.Matrix4x4f()
            modelMatrix:SetRow(0, Amaz.Vector4f(warp_mat:get(0) / W, warp_mat:get(1) / W, 0.0, warp_mat:get(2) / W))
            modelMatrix:SetRow(1, Amaz.Vector4f(warp_mat:get(3) / H, warp_mat:get(4) / H, 0.0, warp_mat:get(5) / H))
            modelMatrix:SetRow(2, Amaz.Vector4f(0.0, 0.0, 1.0, 0.0))
            modelMatrix:SetRow(3, Amaz.Vector4f(0.0, 0.0, 0.0, 1.0))
            self.face_material:setMat4("u_MVP", modelMatrix)
            local screen_w = self.width
            local screen_h = self.height
            screen_w = 1920.0
            screen_h = 1080.0
            input1 = Amaz.BuiltinObject.getUserTexture("#TransitionInput0")
            input2 = Amaz.BuiltinObject.getUserTexture("#TransitionInput1")
            if input1 and input2 then
                screen_w = input2.width
                screen_h = input2.height
            end
            self.face_material:setVec4("u_ScreenParams", Amaz.Vector4f(screen_w, screen_h, 0.0, 0.0))
            local baseColor = Amaz.Vector4f(1.0, 1.0, 1.0, 1.0)
            self.face_material:setVec4("u_baseColor", baseColor)

            local maskTextureUniform = "maskTexture" 
            local tex = self.face_material:getTex(maskTextureUniform)
            if tex == nil then
                tex = Amaz.Texture2D()
                tex.filterMin = Amaz.FilterMode.LINEAR
                tex.filterMag = Amaz.FilterMode.LINEAR
                self.face_material:setTex(maskTextureUniform, tex)
            end
            tex:storage(faceMask.image)
            -- Amaz.LOGI("XUDDLOG image H=", faceMask.image.height)
            -- Amaz.LOGI("XUDDLOG image W=", faceMask.image.width)
        end
    end


    self.depthLayer_material:setFloat("dir", self.scan_dir)
    self.depthLayer_material:setFloat("speed", 10.0)
    self.blending_material:setFloat("speed", 10.0)

    self.displace_mat:setFloat("speed", 10.0)
    self.displace_mat:setFloat("iTime", timeBgAni)

    self.rotate_mat:setFloat("speed", 10.0)
    self.rotate_mat:setFloat("iTime", timeBgAni)
    
    self.depthLayer_material:setFloat("width", self.scan_width)
    self.displace_mat:setFloat("width", self.scan_width)
    self.blending_material:setFloat("width", self.scan_width)
    self.depthLayer_material:setFloat("color", self.color)
    self.blending_material:setFloat("color", self.color)

    self.depthLayer1_material:setFloat("mosaicRadius", self.size)
    self.depthLayer1_material:setFloat("brightness_mosaic", self.brightness_mosaic)
    self.depthLayer1_material:setFloat("brightness", self.brightness)

    
    -- self.blending_material:setFloat("brightness", self.brightness)
    self.blending_material:setFloat("filter_alpha", self.filter_alpha)
    self.blending_material:setFloat("scan_glow_shiness", self.scan_glow_shiness)
   
    -- self.gaussianInputH_material:setFloat("texWOffset", 2.0 / self.blurRT.width)
    self.gaussianInputH_material:setFloat("texWOffset", 2.0 / 720.0)
    self.gaussianInputH_material:setFloat("texHOffset", 0.0)
    self.gaussianInputV_material:setFloat("texWOffset", 0.0)
    -- self.gaussianInputV_material:setFloat("texHOffset", 2.0 / self.blurRT.height)
    self.gaussianInputV_material:setFloat("texHOffset", 2.0 / 720.0)
    self.gauss2V_material:setFloat("texWOffset",        10.75 / 720.0)
    self.gauss2V_material:setFloat("texHOffset",        0.0)
    self.gauss2H_material:setFloat("texWOffset",        0.0)
    self.gauss2H_material:setFloat("texHOffset",        10.75 / 720.0)
    self.gauss2H_material:setVec2("iResolution", Amaz.Vector2f(self.inputTexture.width, self.inputTexture.height))

    self.gaussDV_material:setFloat("texWOffset",        0.5 / 720.0)
    self.gaussDV_material:setFloat("texHOffset",        0.0)
    self.gaussDH_material:setFloat("texWOffset",        0.0)
    self.gaussDH_material:setFloat("texHOffset",        0.5 / 720.0)


    self.depthLayer_material:setVec2("iResolution", Amaz.Vector2f(self.inputTexture.width, self.inputTexture.height))
    self.depthLayer_material:setFloat("iTime", timeBgAni)

    self.depthLayer1_material:setVec2("iResolution", Amaz.Vector2f(self.inputTexture.width, self.inputTexture.height))
    self.depthLayer1_material:setFloat("iTime", timeBgAni)

    self.blending_material:setVec2("iResolution", Amaz.Vector2f(self.inputTexture.width, self.inputTexture.height))
    self.blending_material:setFloat("iTime", timeBgAni)

    local glow_r = 10.0
    self.gaussianHor_material:setFloat("texWOffset", glow_r / 720.0)
    self.gaussianHor_material:setFloat("texHOffset", 0)

    self.gaussianVer_material:setFloat("texWOffset", 0)
    self.gaussianVer_material:setFloat("texHOffset", glow_r / 720.0)

    self.gaussianHor1_material:setFloat("texWOffset", glow_r / 720.0)
    self.gaussianHor1_material:setFloat("texHOffset", 0)

    self.gaussianVer1_material:setFloat("texWOffset", 0)
    self.gaussianVer1_material:setFloat("texHOffset", glow_r / 720.0)

    -- from AE 
    self.dis_size             = -0.7
    self.dis_quantity         = 2.55
    self.dis_complexity       = 1.0
    self.dis_evolution        = -57.0
    self.dis_cycle            = 100.0 
    self.dis_offset_x         = 0.0
    self.dis_offset_y         = 0.0
    self.dis_type             = 0.0
    self.dis_fix_type         = 8.0
    self.dis_motion_tile_type = 2.0
    self.dis_picture_scale    = 1.0
    self.displace_mat:setFloat("u_Contrast", self.dis_size)
    self.displace_mat:setVec2("u_Scale", Amaz.Vector2f(self.dis_quantity, self.dis_quantity))
    self.displace_mat:setFloat("u_Complexity", self.dis_complexity)
    self.displace_mat:setFloat("u_Evolution", math.abs(self.dis_evolution)/36.0)
    self.displace_mat:setFloat("u_Cycle", math.max(2, math.floor(self.dis_cycle+0.5)))
    self.displace_mat:setVec2("u_Offset", Amaz.Vector2f(self.dis_offset_x, self.dis_offset_y))
    self.displace_mat:setFloat("u_type", self.dis_type)
    self.displace_mat:setFloat("u_fix_type", self.dis_fix_type)
    self.displace_mat:setFloat("motion_tile_type", self.dis_motion_tile_type)
    self.displace_mat:setFloat("picture_scale", self.dis_picture_scale)

    comp.entity.scene:commitCommandBuffer(self.commandBufStatic)
    self.frame_count = self.frame_count + 1
end


function SeekModeScript:seekToTime(comp, time)
    self.animSeqCom:seekToTime(time*self.effects_adjust_speed)
    local w = Amaz.BuiltinObject:getInputTextureWidth()
    local h = Amaz.BuiltinObject:getInputTextureHeight()
    if w ~= self.width or h ~= self.height then
        self.width = w
        self.height = h
    end
    self.frame_count = 0;
end

exports.SeekModeScript = SeekModeScript
return exports
