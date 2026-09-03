local exports = exports or {}
local SeekModeScript = SeekModeScript or {}

local BRUSH_STATE = "brush_state"
local CACHE_INFO = "cache_info"
local FACE_MESH = "makeupMesh"


local RETOUCH_CONFIG_JSON = "retouch_config.json"


local texture_index = 0

---@class SeekModeScript: ScriptComponent
----@field blitMesh Mesh [UI(Order=0, Display="blit Mesh")]
----@field blitWithBlendMaterial Material [UI(Order=1, Display="blit With Blend Material")]
----@field emptyTexture Texture [UI(Order=2, Display="empty Texture")]

SeekModeScript.__index = SeekModeScript

Stack = {}
Stack.__index = Stack

function Stack:new()
    local instance = setmetatable({}, Stack)
    instance.items = {}
    return instance
end

function Stack:push(item)
    table.insert(self.items, item)
end

function Stack:pop()
    if self:isEmpty() then
        Amaz.LOGE(AE_EFFECT_TAG, "stack is nil")
    end
    return table.remove(self.items)
end

function Stack:peek()
    if self:isEmpty() then
        Amaz.LOGE(AE_EFFECT_TAG, "stack is nil")
    end
    return self.items[#self.items]
end

function Stack:isEmpty()
    return #self.items == 0
end

function Stack:size()
    return #self.items
end

function Stack:clear()
    self.items = {}
end

function Stack:iterate()
    return function()
        local index = 0
        return function()
            index = index + 1
            if index <= #self.items then
                return self.items[index]
            end
        end
    end
end


function SeekModeScript.new(construct, ...)
    local self = setmetatable({}, SeekModeScript)
    self.name = "SeekModeScript"
    self.faceEntities = {}
    self.FaceCount = 3
    self.moveFinished = false

    self.blitHistoryCommandBuffer = Amaz.CommandBuffer()
    self.blitCamera2Buffer = Amaz.CommandBuffer()

    self.logTag = "ManualBeauty3D"

    self.currentSelectedFace = 0
    
    if Amaz.Macros.EditorSDK then
        self.draft_path = "/Users/bytedance/Desktop/"
    else
        self.draft_path = ""
    end
    
    self.load_manual_retouch_cache = true
    self.brush_type = "smooth"
    self.brush_mode = 0
    self.intensity = 1.0
    self.brush_size = 100.0
    self.real_brush_size = 100.0

    self.config_data = {}
    self.first_frame = true

    self.cacheTextureMap = {}

    self.undoStack = Stack:new()
    self.redoStack = Stack:new()

    self.selectedEntityIndex = -1
    self.faceInfoBySize = {}
    self.originalTexturePath = {}
    self.canvasSize = nil
    self.materials = {}
    return self
end

function SeekModeScript:onStart(comp, sys)

    self.comp = comp
    self.scriptProps = comp.properties
    -- init entities
    self.faces = {}
    self:initFaceEntities(comp)
    self.meshTool = Amaz.AMGFaceMeshUtils()
    self.meshType = Amaz.AMGBeautyMeshType.FACE145
    self.meshTemplate = self.scriptProps:get(FACE_MESH)
    self.meshTool:setMesh(self.meshTemplate, self.meshType)
    local inputTex = comp.entity.scene:getInputTexture(Amaz.BuiltInTextureType.INPUT0)
    self.inputWidth = inputTex.width
    self.inputHeight = inputTex.height


    self.brushlayer = comp.entity.scene:findEntityBy("GraffitiPen"):getComponent("Layer2DRenderer")
    self.brushCanvas = comp.entity.scene:findEntityBy("GraffitiPen"):getComponent("Brush2DCanvas")      
    self.brushMaterial = comp.entity.scene:findEntityBy("GraffitiPen"):getComponent("Brush2DComponent").brushMaterial
    self.brushMaterial:setInt("brushMode", self.brush_mode)

    self.blitMaterial = self.brushCanvas.blitMaterial

    self.scene = comp.entity.scene

    self.camera1 = comp.entity.scene:findEntityBy("CameraPhase1"):getComponent("Camera")
    sys:addScriptListener(self.camera1, Amaz.CameraEvent.BEFORE_RENDER, "cmdBufExec1", sys)
    sys:addScriptListener(self.camera1, Amaz.CameraEvent.AFTER_RENDER, "cmdBufAfterExec1", sys)

    self.camera2 = comp.entity.scene:findEntityBy("CameraPhase2"):getComponent("Camera")
    sys:addScriptListener(self.camera2, Amaz.CameraEvent.BEFORE_RENDER, "cmdBufExec2", sys)
    sys:addScriptListener(self.camera2, Amaz.CameraEvent.AFTER_RENDER, "cmdBufAfterExec2", sys)

    local model = Amaz.Matrix4x4f():SetIdentity()

    self.blitCamera2Buffer:setRenderTexture(self.camera2.renderTexture);
    self.blitCamera2Buffer:drawMesh(self.blitMesh, model, self.blitWithBlendMaterial, 0, 0, nil)

    Amaz.LOGE(self.logTag, "SeekModeScript:onStart() onStart finished")

end

function SeekModeScript:onUpdate(sys, deltaTime)
    
    -- Amaz.LOGE(self.logTag, "SeekModeScript:onUpdate() ")
    self:updateBrushCanvas()
    self:saveTextureNextFrame()
    self:updateFaceInfoBySize()
    if self.first_frame then
        if #self.faceInfoBySize == 0 then 
            Amaz.LOGE(self.logTag, "SeekModeScript:onUpdate() no face data, skip")
            return
        end
    
        if self.load_manual_retouch_cache and self.draft_path ~= "" then
            self:loadManualRetouchCache()
        end 
    end

    
    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceCount = result:getFaceCount()
    local facefittingCount = result:getAlgorithmInfoCount('Editor_Sticker_Config_TAG_xbtpH2f', 'facefitting_3d_0', 'facefitting_3d') 
    
    for i = 0, self.FaceCount - 1 do
        local face = self.faces[i]
        face.entity.visible = false
    end
    
    --clear invailid face
    for i = 0, self.FaceCount - 1 do
        local face = self.faces[i]
        if face.track_id >= 0 then
            local faceInfo = self:findFaceInfoByTrackId(face.track_id)
            if (faceInfo == nil) then
                Amaz.LOGE(self.logTag, "SeekModeScript:onUpdate() expired face detected, track_id:" .. tostring(face.track_id))
                face.entity.visible = false
                face.size = 0
                face.track_id = -1
                face.externalFaceTexture = nil
                face.historyFaceTexture = nil
            end
        end
    end
    

    --  bind TrackId
    for i = 1, #self.faceInfoBySize do
        local faceInfo = self.faceInfoBySize[i]
        local face = self:findFaceByTrackId(faceInfo.track_id)
        if (face == nil) then
            Amaz.LOGE(self.logTag, "SeekModeScript:onUpdate() new face detected ")
            face = self:findFaceByTrackId(-1)
            if (face ~= nil) then
                -- clear history texture
                face.externalFaceTexture = nil
                face.historyFaceTexture = nil
                face.size = faceInfo.size
                face.track_id = faceInfo.track_id
                Amaz.LOGE(self.logTag, "SeekModeScript:onUpdate() set up new face data")
                self:loadExternalTexture(face)
            end
        end

        face.size = faceInfo.size
        face.track_id = faceInfo.track_id
        face.entity.visible = true
    end

    -- update Mesh
    for i = 1, #self.faceInfoBySize do
        local faceInfo = self.faceInfoBySize[i]
        local face = self:findFaceByTrackId(faceInfo.track_id)
        if face ~= nil then
            face.entity.visible = true
            local faceEntity = face.entity
            local faceMeshInfo = result:getAlgorithmInfo('Editor_Sticker_Config_TAG_xbtpH2f', 'facefitting_3d_0', 'facefitting_3d', faceInfo.index) 
            if (not faceMeshInfo) then
                Amaz.LOGE(self.logTag, "SeekModeScript:onUpdate() algorithm result of id " .. i .. " is empty.")
            else
                local renderer = faceEntity:getComponent("MeshRenderer")
                self:updateMatrix(renderer.props, faceMeshInfo)
                self:updateMesh(renderer.mesh, faceMeshInfo)
            end
        end
    end
    
end

function SeekModeScript:findFaceByTrackId(track_id)
    for i = 0, self.FaceCount - 1 do
        local face = self.faces[i]
        if face.track_id == track_id then
            return face
        end
    end
    return nil
end


function SeekModeScript:caculateBrushLayerSize()

    local inputTex = self.comp.entity.scene:getInputTexture(Amaz.BuiltInTextureType.INPUT0)
    local maxLength = math.max(inputTex.width, inputTex.height)
    local scale = maxLength / 512.0
    local size = Amaz.Vector2f(inputTex.width/scale, inputTex.height/scale)
    return size
end

function SeekModeScript:updateBrushCanvas()

    local inputTex = self.comp.entity.scene:getInputTexture(Amaz.BuiltInTextureType.INPUT0)
    local resolution = Amaz.Vector2f(inputTex.width, inputTex.height)
    
    local maxScale = 1.0
    if self.canvasSize ~= nil then
        resolution = self:caculateBrushLayerSize()
        Amaz.LOGE(self.logTag, "onUpdate() input Size:".. tostring(inputTex.width).. " ".. tostring(inputTex.height))
        Amaz.LOGE(self.logTag, "onUpdate() canvasSize:".. tostring(self.canvasSize.width).. " ".. tostring(self.canvasSize.height))
        Amaz.LOGE(self.logTag, "onUpdate() resolution Size:".. tostring(resolution.x).. " ".. tostring(resolution.y))
        maxScale = math.min(self.canvasSize.width/resolution.x, self.canvasSize.height/resolution.y)

        Amaz.LOGE(self.logTag, "onUpdate() maxScale:".. tostring(maxScale))
    end

    self.brushlayer.resolution = resolution
    self.real_brush_size = self.brush_size / maxScale * 1.4
    self.brushCanvas.brushConfig.strokeSize.value = self.real_brush_size
end

function SeekModeScript:fileExist(file_path)
    local file = io.open(file_path, "r")
    if file then
        io.close(file)
        return true
    else
        return false
    end
end

function SeekModeScript:updateMesh(mesh, faceMesh)
    local vertexs = faceMesh.data:get("vertexes")
    local normals = faceMesh.data:get("normals")
    mesh:setVertexArray(vertexs)
    mesh:setNormalArray(normals)
end

function SeekModeScript:updateMatrix(property, faceMesh)
    local mvp = faceMesh.data:get("mvp")
    local model = faceMesh.data:get("modelMatrix")
    property:setMatrix("uMVP", mvp)
end


function SeekModeScript:ReadFromJson(file_path)
    local file = io.input(file_path)
    return io.read("*a")
end



function SeekModeScript:loadManualRetouchCache()
    
    local file_path = self.draft_path .. RETOUCH_CONFIG_JSON
    local content = nil
    self.originalTexturePath = {}
    Amaz.LOGE(self.logTag, "SeekModeScript:loadManualRetouchCache() ".. file_path)
    if self:fileExist(file_path) then
        content = self:ReadFromJson(file_path)
    else
        Amaz.LOGE(self.logTag, "SeekModeScript: retouch_config.json not found.")
        return
    end
    
    self.config_data = cjson.decode(content)
    local currentList = self.config_data[self:getBeautyListType()]
    Amaz.LOGE(self.logTag, "SeekModeScript:loadManualRetouchCache() currentList ".. cjson.encode(currentList))
    if currentList == nil then
        Amaz.LOGE(self.logTag, "SeekModeScript:loadManualRetouchCache() currentList is empty.")
        return
    end
    
    for track_id, imageName in pairs(currentList) do
        Amaz.LOGE(self.logTag, "SeekModeScript:loadManualRetouchCache() track_id ".. track_id.. " imageName ".. imageName)
        self.originalTexturePath[tostring(track_id)] = imageName
    end
end

function SeekModeScript:onTouchEvent(sys, event)
    local isTouchBegin  = false
    local isTouchMove   = false
    local isTouchEnd    = false
    local isTouchCancel = false

    local point = Amaz.Vector2f( 0, 0)
    if event.type == Amaz.EventType.TOUCH_MANIPULATE then
        local eventCode = event.args:get(0)
        if eventCode == 0 then
            isTouchBegin = true
        elseif eventCode == 4 then 
            isTouchMove = true
        elseif eventCode == 2 then
            isTouchEnd = true
        elseif eventCode == 3 then
            isTouchCancel = true
        end
        point = Amaz.Vector2f(event.args:get(1), event.args:get(2))
    end
    if event.type == Amaz.EventType.TOUCH then
        local touch = event.args:get(0)
        if touch.type == Amaz.TouchType.TOUCH_BEGAN then
            isTouchBegin = true
        elseif touch.type == Amaz.TouchType.TOUCH_MOVED then
            isTouchMove = true
        elseif touch.type == Amaz.TouchType.TOUCH_ENDED then
            isTouchEnd = true
        else
            Amaz.LOGD("AE_EFFECT_TAG", "onEvent() no valid touchEvent.")
            return
        end
        point = Amaz.Vector2f(touch.x, touch.y)
    end
    
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        local inputKey = event.args:get(0)
        local inputValue = event.args:get(1)
    
        if inputKey == "touch_begin" then
            isTouchBegin = true
        elseif inputKey == "touch_move" then
            isTouchMove = true
        elseif inputKey == "touch_end" then
            isTouchEnd = true
        end

        pt = cjson.decode(inputValue)
        point = Amaz.Vector2f(pt.x, pt.y)
    end

    if Amaz.Macros.EditorSDK then
        point.y =  (1.0 - point.y)
    end

    Amaz.LOGE(self.logTag, "SeekModeScript: touchEvent:  ".. point.x.. " ".. point.y)

    if isTouchBegin then
        local touchBeginPoint =  Amaz.Vector2f( point.x, 1.0 - point.y)
        self.selectedFaceInfo = self:findTouchBeginFaceInfo(touchBeginPoint)
        if self.selectedFaceInfo ~= nil then
            Amaz.LOGE(self.logTag, "SeekModeScript: selectedFace   ".. cjson.encode(self.selectedFaceInfo))
            self.selectedEntityIndex = 1
        end
    end

    if isTouchEnd or isTouchCancel then
        if self.selectedFaceInfo == nil then
            self.brushCanvas:clear()
            self.selectedEntityIndex = -1
            return
        else
            self.camera1.entity.visible = true
            self.needSave = true
        end

    end
end

function SeekModeScript:updateProperties()
    
    local content = {
        file_path = self.draft_path .. RETOUCH_CONFIG_JSON,
        file_data = cjson.encode(self.config_data)
    }
    local fileMap = Amaz.Map()
    fileMap:set("file_path", self.draft_path .. RETOUCH_CONFIG_JSON)
    fileMap:set("file_data",cjson.encode(self.config_data))

    Amaz.LOGE(self.logTag, "SeekModeScript: updateProperties() config.json ".. cjson.encode(content))
    -- Amaz.LOGE(self.logTag, "SeekModeScript: updateProperties() config_data ".. cjson.encode(self.config_data))
    self.scriptProps:set(CACHE_INFO, fileMap)

    if Amaz.Macros.EditorSDK then
        local file_path = self.draft_path .. "editor_" .. RETOUCH_CONFIG_JSON
        local file = io.open(file_path, "w")
        if file then
            file:write(tostring(cjson.encode(self.config_data)))
            io.close(file)
        end
    end

    local brush_state = {
        redo_count = self.redoStack:size(),
        undo_count = self.undoStack:size(),
        stroke_size = self.brush_size
    }
    local brushMap = Amaz.Map()
    brushMap:set("redo_count", brush_state.redo_count)
    brushMap:set("undo_count", brush_state.undo_count)
    brushMap:set("stroke_size", brush_state.stroke_size)
    Amaz.LOGE(self.logTag, "SeekModeScript: updateProperties() brush_state ".. cjson.encode(brush_state))
    self.scriptProps:set(BRUSH_STATE, brushMap)
end


function SeekModeScript:onEvent(sys, event)

    if event.type == Amaz.EventType.TOUCH_MANIPULATE or event.type == Amaz.EventType.TOUCH then
        self:onTouchEvent(sys, event)
    end

    if event.type == Amaz.AppEventType.SetEffectIntensity then
        self:handleIntensityEvent(sys, event)
    end
end

function SeekModeScript:handleIntensityEvent(sys, event)
    local inputKey = event.args:get(0)
    local inputValue = event.args:get(1)
    local isTouch = (inputKey == "touch_begin" or inputKey == "touch_move" or inputKey == "touch_end")
    Amaz.LOGE(self.logTag, "handleEvent key: " .. tostring(inputKey) .. " value: " .. tostring(inputValue))

    if  isTouch then
        self:onTouchEvent(sys, event)
        return
    end
    if inputKey == "video_flip_x" then
        self.video_flip_x = inputValue
    end
    if inputKey == "draft_path" then
        self.draft_path = inputValue
    elseif inputKey == "load_manual_retouch_cache" then
        self.load_manual_retouch_cache = inputValue
    elseif inputKey == "brush_type" then
        if inputValue == "manual_beauty_smooth" then
            self.brush_type = "smooth"
        elseif inputValue == "manual_acne_removal" then
            self.brush_type = "acne_removal"
        end
    elseif inputKey == "brush_mode" then
        self.brush_mode = inputValue
        -- brushMode ralated with color
        self.brushMaterial:setInt("brushMode", self.brush_mode)
    elseif inputKey == "brush_undo" then
        self:undo()
    elseif inputKey == "brush_redo" then
        self:redo()
    elseif inputKey == "brush_clear" then
        self:clear()
    elseif inputKey == "intensity" then
        self.intensity = inputValue * 0.01
    elseif inputKey == "brush_size" then
        self.brush_size = inputValue
    elseif inputKey == "canvas_size" then
        local size = cjson.decode(inputValue)
        self.canvasSize = {
            width = size.width,
            height = size.height
        }
    end

end

function SeekModeScript:undo()
    if self.undoStack:size() <= 0 then
        Amaz.LOGE(self.logTag, "SeekModeScript:undo() undoStack is empty.")
        return
    end
    local faceInfo = self.undoStack:pop()
    self.redoStack:push(faceInfo)

    local targetImage = self:findLastImageByTrackId(faceInfo.track_id)
    local beautyType = self:getBeautyListType()
    self.config_data[beautyType][tostring(track_id)] = targetImage
    
    local face = self:findFaceByTrackId(faceInfo.track_id)
    local image = self:loadExternalTexture(face)
    self.config_data[beautyType][tostring(track_id)] = image

    self:updateProperties()
end

function SeekModeScript:redo()
    if self.redoStack:size() <= 0 then
        Amaz.LOGE(self.logTag, "SeekModeScript:redo() redoStack is empty.")
        return
    end
    local faceInfo = self.redoStack:pop()
    self.undoStack:push(faceInfo)

    local targetImage = self:findLastImageByTrackId(faceInfo.track_id)
    local beautyType = self:getBeautyListType()
    self.config_data[beautyType][tostring(track_id)] = targetImage

    local face = self:findFaceByTrackId(faceInfo.track_id)
    local image = self:loadExternalTexture(face)
    self.config_data[beautyType][tostring(track_id)] = image

    self:updateProperties()
end

function SeekModeScript:clear()
  
    for i = 1, #self.faceInfoBySize do
        local faceInfo = self.faceInfoBySize[i]
        local targetImage = self:findLastImageByTrackId(faceInfo.track_id)
        if targetImage ~= nil then
            self.originalTexturePath[tostring(faceInfo.track_id)] = targetImage
        end
    end

    self.undoStack:clear()
    self.redoStack:clear()
    self:updateProperties()
end

function SeekModeScript:findLastImageByTrackId(track_id)
    
    local targetImage = nil
    for item in self.undoStack:iterate()() do
        Amaz.LOGE(AE_EFFECT_TAG, "item: " .. item.track_id .. " mask_file: ".. item.mask_file)
        if tostring(item.track_id) == tostring(track_id) then
            targetImage = item.mask_file
        end
    end

    return targetImage
end

function SeekModeScript:loadExternalTexture(face)
    local track_id = face.track_id
    Amaz.LOGE(self.logTag, "SeekModeScript:loadExternalTexture() track_id ".. tostring(track_id))
    local targetImage = self:findLastImageByTrackId(track_id)
    face.externalFaceTexture = nil
    Amaz.LOGE(self.logTag, "SeekModeScript:loadExternalTexture() set externalFaceTexture  nil. ")
    if targetImage ~= nil then
        local mask_path = self.draft_path .. targetImage
        if self:fileExist(mask_path) then
            face.externalFaceTexture = self.comp.entity.scene.assetMgr:SyncLoad(mask_path)
            Amaz.LOGE(self.logTag, "SeekModeScript: loadExternalTexture() load texture: ".. mask_path)
            return targetImage     
        end
    end
    
    if face.externalFaceTexture == nil then
        Amaz.LOGE(self.logTag, "SeekModeScript:loadExternalTexture() try to load origin ." .. cjson.encode(self.originalTexturePath))
        if self.originalTexturePath ~= nil and self.originalTexturePath[tostring(track_id)] ~= nil and self:fileExist(self.draft_path.. self.originalTexturePath[tostring(track_id)]) then
            local fullPath = self.draft_path.. self.originalTexturePath[tostring(track_id)]
            
            local start_time = os.clock()
            face.externalFaceTexture = self.comp.entity.scene.assetMgr:SyncLoad(fullPath)
            local end_time = os.clock()
            local elapsed_time = (end_time - start_time) * 1000 -- convert to milliseconds
            Amaz.LOGE(self.logTag, "SeekModeScript: loadExternalTexture() load origin: ".. fullPath .. " cost: ".. elapsed_time.." ms")
            return self.originalTexturePath[tostring(track_id)]
        else
            face.externalFaceTexture = self.emptyTexture
            Amaz.LOGE(self.logTag, "SeekModeScript: loadExternalTexture() load empty texture.")
        end
    end
    -- end
   return nil
end

function SeekModeScript:generateFileName()
    texture_index = texture_index + 1
    return self.brush_type.. "_mask_" .. texture_index .. "_" .. tostring(os.time()).. ".png"
end

function SeekModeScript:getBeautyListType()
    if self.brush_type == "smooth" then
        return "smooth_mask_list"
    elseif self.brush_type == "acne_removal" then
        return "acne_removeal_mask_list"
    end
end

function SeekModeScript:cmdBufExec1(sys, camera, eventType)
    if self.camera1.entity.visible == false then
        return
    end
    if self.selectedFaceInfo == nil then
        Amaz.LOGE(self.logTag, "SeekModeScript:cmdBufExec1()  not selected skip render camera1.")
        self.camera1.entity.visible = false
        return
    end
    
    Amaz.LOGE(self.logTag, "SeekModeScript:cmdBufExec1() start set  mesh and Texture track_id: ".. tostring(self.selectedFaceInfo.track_id) .. " faces count " .. tostring(#self.faces))
    local face = self:findFaceByTrackId(self.selectedFaceInfo.track_id)
    local externalFaceTexture = face.externalFaceTexture
    local historyFaceTexture = face.historyFaceTexture
    local mr = face.mr
    local material = mr.material

    Amaz.LOGE(self.logTag, "SeekModeScript:cmdBufExec1() face.entity.visible ".. tostring(face.entity.visible).. " material ".. tostring(material))
    if (face.entity.visible and material ~= nil) then
        Amaz.LOGE(self.logTag, "SeekModeScript:cmdBufExec1() start render face 0 ")
        material:setFloat("uPhase",1.0)
        material:setTex("uCurrentStrokeTexture", self.brushlayer.outputTex)
        if self.video_flip_x then
            material:setInt("uFlipX",1)
        else
            material:setInt("uFlipX",0)
        end
        -- try to use external texture
        if externalFaceTexture ~= nil then
                Amaz.LOGE(self.logTag, "SeekModeScript:cmdBufExec1() use external texture")
                material:setInt("uUseRT",0)
            material:setTex("uHistoryStrokeTexure", externalFaceTexture)
        else
            if historyFaceTexture == nil then
                Amaz.LOGE(self.logTag, "SeekModeScript:cmdBufExec1() use empty texture in first frame")
                material:setTex("uHistoryStrokeTexure",self.emptyTexture)
                material:setInt("uUseRT",0)
            else
                Amaz.LOGE(self.logTag, "SeekModeScript:cmdBufExec1() use history texture")
                material:setTex("uHistoryStrokeTexure",historyFaceTexture)
                material:setInt("uUseRT",1)
            end
        end
        material:setInt("brushMode",self.brush_mode) 
        self.camera1RenderFinished = true
    end
end

function SeekModeScript:cmdBufAfterExec1(sys, camera, eventType)
    if self.camera1.entity.visible == false then
        return
    end
    if self.camera1RenderFinished ~= true then
        return
    end

    self.camera1.entity.visible = false
    self.camera1RenderFinished = false
    self.brushCanvas:clear()
    
    local face = self:findFaceByTrackId(self.selectedFaceInfo.track_id)
    Amaz.LOGE(self.logTag, "SeekModeScript:cmdBufAfterExec1() track_id: ".. tostring(face.track_id) .. " faces count " .. tostring(#self.faces))
    local track_id = self.selectedFaceInfo.track_id
    if face.historyFaceTexture == nil then
        face.historyFaceTexture = self:createTexture()
    end

    self.blitMaterial:setTex("_MainTex", self.camera1.renderTexture)

    local identityMatrix = Amaz.Matrix4x4f():SetIdentity()
    self.blitHistoryCommandBuffer:clearAll()
    self.blitHistoryCommandBuffer:setRenderTexture(face.historyFaceTexture)
    self.blitHistoryCommandBuffer:drawMesh(self.blitMesh, identityMatrix, self.blitMaterial, 0, 0, nil)
    self.scene:commitCommandBuffer(self.blitHistoryCommandBuffer)

    face.externalFaceTexture = nil
    self.selectedFaceInfo = nil

    local fileName = self:generateFileName()
    if self.draft_path ~= "" then
        self.nextFrameSaveTexture = face.historyFaceTexture;
        self.nextFrameSavePath = self.draft_path .. fileName;
        Amaz.LOGE(self.logTag, "SeekModeScript:cmdBufAfterExec1() will save texture to ".. self.nextFrameSavePath)
    end

    local beautyType = self:getBeautyListType()
    if self.config_data[beautyType] == nil then
        self.config_data[beautyType] = {}
    end

    local info = {
        track_id = track_id,
        type = self.brush_type,
        mask_file = fileName,
    }
    self.config_data[beautyType][tostring(info.track_id)] = fileName
    self.undoStack:push(info)
    -- clear redo
    table.insert(self.cacheTextureMap, fileName)
    self.redoStack:clear()

    Amaz.LOGE(self.logTag, "SeekModeScript:cmdBufAfterExec1() insert opration to config_data")
    self:updateProperties()

end


function SeekModeScript:cmdBufExec2(sys, camera, eventType)
    if self.camera2.entity.visible == false then
        return
    end

    for i = 0, self.FaceCount - 1 do
        local entity = self.faces[i].entity
        local face = self.faces[i]
        self:updateTexture(face)
    end
end

function SeekModeScript:updateTexture(face)
    if (face.entity.visible == false) then
        return
    end
   
    local externalFaceTexture = face.externalFaceTexture
    local historyFaceTexture = face.historyFaceTexture
    local mr = face.mr
    local material = mr.material
    local faceFactor = face.size

    if material ~= nil then
        if externalFaceTexture ~= nil then
            material:setInt("uUseRT",0)
            material:setTex("uExpendFaceTexture", externalFaceTexture)
        else
            material:setTex("uExpendFaceTexture",historyFaceTexture)
            material:setInt("uUseRT",1)
        end

        local table = self.scene:findEntityBy("Table"):getComponent("TableComponent").table
        local inTex = table:get("RT4")
        local faceMaskRT = table:get("FaceMaskRT")

        
        material:setFloat("uPhase",2.0)
        if self.video_flip_x then
            material:setInt("uFlipX",1)
        else
            material:setInt("uFlipX",0)
        end
        material:setTex("uAcneRemovalTex", inTex)
        material:setTex("uFaceMaskRT", faceMaskRT)
        material:setFloat("u_intensity", self.intensity)
        material:setFloat("u_faceFactor", faceFactor)
    end
end

function SeekModeScript:cmdBufAfterExec2(sys, camera, eventType)
    -- Amaz.LOGE(self.logTag, "SeekModeScript:cmdBufAfterExec2()")
    self.blitWithBlendMaterial:setTex("_MainTex", self.brushlayer.outputTex)
    self.scene:commitCommandBuffer(self.blitCamera2Buffer); 
    if self.first_frame and #self.faceInfoBySize > 0 then 
        self.first_frame = false
    end
end

function SeekModeScript:saveTextureNextFrame()
    if self.nextFrameSaveTexture ~= nil and self.nextFrameSavePath ~= "" then
        if self.nextFrameSaveTexture.saveToFile ~= nil then
            local start_time = os.clock()
            self.nextFrameSaveTexture:saveToFile(self.nextFrameSavePath)
            local end_time = os.clock()
            local elapsed_time = (end_time - start_time) * 1000
            Amaz.LOGE(self.logTag, "SeekModeScript:saveTextureNextFrame()   " .. self.nextFrameSavePath .. " cost: ".. tostring(elapsed_time) .. " ms")
            self.nextFrameSaveTexture = nil
            self.nextFrameSavePath = ""
        else
            Amaz.LOGE(self.logTag, "SeekModeScript: saveToFile is nil")
        end
    end
end


function SeekModeScript:createTexture()
    local inputTex = self.comp.entity.scene:getInputTexture(Amaz.BuiltInTextureType.INPUT0)
    local texture  = Amaz.RenderTexture()
    texture.width  = 256
    texture.height = 256
    return texture;
end

function SeekModeScript:getFaceBBox(info)
    local points_array = info.points_array
    local rect = info.rect

    local min_x = rect.x -- left
    local min_y = 1.0 - rect.y -- bottom
    local max_x = (rect.x + rect.width) -- right
    local max_y = (1.0 - rect.y + rect.height) -- top
    if points_array:size() > 0 then
        self.meshTool:updateMeshWithFaceData106(self.meshType, points_array, 0)
        local indexs = {117, 120, 123, 127, 130, 133, 136, 139, 142}
        local point, x, y
        for i = 1, 9 do
            point = self.meshTemplate:getVertex(indexs[i])
            x = point.x / self.inputWidth
            y = point.y / self.inputHeight
            min_x = math.min(min_x, x)
            min_y = math.min(min_y, y)
            max_x = math.max(max_x, x)
            max_y = math.max(max_y, y)
        end
    end
    return math.max(0, min_x), math.max(0, min_y), math.min(1, max_x), math.min(1, max_y)
end

function SeekModeScript:findTouchBeginFaceInfo(point)
    local result = Amaz.Algorithm.getAEAlgorithmResult()


    -- Amaz.LOGE(self.logTag, "self.faceInfoBySize size".. #self.faceInfoBySize)
    
    -- Amaz.LOGE(self.logTag, "self.faceInfoBySize size".. #self.faceInfoBySize)
    for i = 1, #self.faceInfoBySize do
        local faceInfo = self.faceInfoBySize[i]
        local index = faceInfo.index
        local id = faceInfo.track_id
        if id ~= -1 then
            local baseInfo = result:getFaceBaseInfo(index)
            local min_x, min_y, max_x, max_y = self:getFaceBBox(baseInfo)
            -- Amaz.LOGE(self.logTag, "point.x: ".. point.x.. " point.y: ".. point.y .. "min_x: ".. min_x.. " min_y: ".. min_y.. " max_x: ".. max_x.. " max_y: ".. max_y)
            if point.x >= min_x and point.x <= max_x and point.y >= min_y and point.y <= max_y then
                return faceInfo
            end
        end
    end
    return nil
end

function SeekModeScript:findFaceInfoByTrackId(track_id)
    for i = 1, #self.faceInfoBySize do
        local faceInfo = self.faceInfoBySize[i]
        if faceInfo.track_id == track_id then
            return faceInfo
        end
    end
    return nil
end

function SeekModeScript:updateFaceInfoBySize()
    self.faceInfoBySize = {}

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceCount = result:getFaceCount()
    local freidCount = result:getFreidInfoCount()

    for i = 0, faceCount - 1 do
        local track_id = -1
        local faceSize = 0
        if i < faceCount then
            local baseInfo = result:getFaceBaseInfo(i)
            local faceId = baseInfo.ID
            local faceRect = baseInfo.rect
            for j = 0, freidCount - 1 do
                local freidInfo = result:getFreidInfo(j)
                if faceId == freidInfo.faceid then
                    track_id = freidInfo.trackid
                end
            end
            faceSize = faceRect.width * faceRect.height
            local min_x, min_y, max_x, max_y = self:getFaceBBox(baseInfo)
            table.insert(self.faceInfoBySize, {
                index = i,
                track_id = track_id,
                size = faceSize,
                rect = {
                    min_x = min_x,
                    min_y = min_y,
                    max_x = max_x,
                    max_y = max_y,
                    x = faceRect.x,
                    y = faceRect.y,
                    width = faceRect.width,
                    height = faceRect.height,
                }     -- normalized rect
            })
        end
    end
    table.sort(self.faceInfoBySize, function(a, b)
        return a.size > b.size
    end)

    -- remove extra elements if length is more than 3
    if #self.faceInfoBySize > 3 then
        for i = #self.faceInfoBySize, 4, -1 do
            table.remove(self.faceInfoBySize, i)
        end
    end

    table.sort(self.faceInfoBySize, function(a, b)
        return a.index < b.index
    end)

    -- Amaz.LOGE(self.logTag, "updateFaceInfoBySize faceInfoBySize size "..(#self.faceInfoBySize))
end

function SeekModeScript:initFaceEntities(comp)
    local entity = comp.entity
    local faceEntity_0 = entity:searchEntity("face_" .. 0)
    local mr = faceEntity_0:getComponent("MeshRenderer")
    self.faces[0] = 
    { 
        entity = faceEntity_0, 
        historyFaceTexture = nil,
        externalFaceTexture = nil,
        mr = mr,
        track_id = -1,
        size = 0
    }
    for i = 1, self.FaceCount - 1 do
        local e = comp.entity.scene:cloneEntityFrom(faceEntity_0)
        e.name = string.format("face_" .. i)
        local faceEntityMr = faceEntity_0:getComponent("MeshRenderer")
        mr.mesh = faceEntityMr.mesh
        mr.sharedMaterials = faceEntityMr.sharedMaterials

        e.visible = false
        local trans = e:getComponent("Transform")
        local parent = faceEntity_0:getComponent("Transform").parent
        parent.children:pushBack(trans)
        trans.parent = parent

        self.faces[i] = 
        { 
            entity = e,
            historyFaceTexture = nil,
            externalFaceTexture = nil,
            mr = e:getComponent("MeshRenderer"),
            track_id = -1,
            size = 0,

        }
    end

    for i = 0, self.FaceCount - 1 do
        local face = self.faces[i]
        table.insert(self.materials, face.mr.materials)
    end
end

exports.SeekModeScript = SeekModeScript
return exports
