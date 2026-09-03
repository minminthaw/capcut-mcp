local exports = exports or {}
local stroke_lua = stroke_lua or {}
stroke_lua.__index = stroke_lua

local AE_EFFECT_TAG = 'AE_EFFECT_TAG manual_retouch'

function stroke_lua.new(construct, ...)
    local self = setmetatable({}, stroke_lua)
    if construct and stroke_lua.constructor then
        stroke_lua.constructor(self, ...)
    end
    return self
end

function stroke_lua:constructor()
end

function stroke_lua:onStrokeStart(comp, stroke, canvas)
    Amaz.LOGS(AE_EFFECT_TAG, 'onStrokeStart()')
    self.config = canvas.brushConfig
    self.blitMaterial = canvas.blitMaterial
    self.stroke = stroke
    self.resolution = stroke.resolution
    self.halfResolution = self.resolution * 0.5
    self.undoTexCache = stroke.undoTexCache
    self.redoTexCache = stroke.redoTexCache
    self.entity = stroke.entity
    self.processor = self.entity:getComponent("Brush2DInputProcessor")
    self.processor:setResolution(self.halfResolution)
    self.processor:setConfig(self.config)
    self.generator = self.entity:getComponent("Brush2DMeshGenerator")
    self.generator:setResolution(self.halfResolution)
    self.generator:setConfig(self.config)
    self.renderMaterial = self.config.brushMaterial
    local baseResolution = self.config.baseResolution
    local strokeSize = self.config.strokeSize
    self.renderMaterial:setFloat("strokeSize", baseResolution * strokeSize.value)

    self.subMeshIndex = -1
    self.cacheFlag = false
    self.targetCache = Amaz.RenderTexture()
    self.targetCache.width = self.resolution.x
    self.targetCache.height = self.resolution.y
    self.outputTex = Amaz.RenderTexture()
    self.outputTex.width = self.resolution.x
    self.outputTex.height = self.resolution.y
    self.renderCmd = Amaz.CommandBuffer()
    self.cacheCmd = Amaz.CommandBuffer()
    self.stModel = Amaz.Matrix4x4f():SetIdentity()
    self.rectMesh = Amaz.Mesh()
    self.cropMesh = Amaz.Mesh()
end

function stroke_lua:onStrokeUpdate(comp, deltaTime)
    local dirty = self.stroke.dirtyFlag
    local finished = self.stroke.finished
    if dirty == Amaz.Brush2DDirtyFlag.Increase then
        self.strokeMesh = self.generator:getMesh()
        local newIndex = self.strokeMesh.submeshes:size() - 1
        if self.subMeshIndex < newIndex then
            local subMesh = self.strokeMesh:getSubMesh(newIndex)
            -- subMesh:releaseIBO()
            self.subMeshIndex = newIndex
            self.dirtyRect = subMesh.boundingBox
            self.stroke.dirtyRect = self.dirtyRect
            self.strokeBBox = self.strokeMesh.boundingBox
            self.stroke.boundingBox = self.strokeBBox
        elseif finished == true and newIndex >= 0 then
            dirty = Amaz.Brush2DDirtyFlag.Cache
        else
            Amaz.LOGW(AE_EFFECT_TAG, "onStrokeUpdate() submesh is not increasing. self.subMeshIndex = " .. self.subMeshIndex)
            dirty = Amaz.Brush2DDirtyFlag.Unchanged
        end
    elseif dirty == Amaz.Brush2DDirtyFlag.Undo or dirty == Amaz.Brush2DDirtyFlag.Redo then
        if finished == true then
            self.stroke.dirtyRect = self.strokeBBox
        else
            Amaz.LOGE(AE_EFFECT_TAG, "onStrokeUpdate() stroke is unfinished.")
            dirty = Amaz.Brush2DDirtyFlag.Unchanged
        end
    end

    self.stroke.dirtyFlag = dirty
    self.renderCmd:clearAll()
    self.cacheCmd:clearAll()
    --self.blitMaterial:setTex("_MainTex", nil)
end

function stroke_lua:onStrokeRender(comp, target)
    local dirty = self.stroke.dirtyFlag
    local finished = self.stroke.finished
    if dirty == Amaz.Brush2DDirtyFlag.Unchanged and self.cacheFlag then
        return
    end

    if dirty == Amaz.Brush2DDirtyFlag.Increase then
        Amaz.Brush2DUtils.generateBBoxMesh(self.dirtyRect, self.rectMesh, true, true)
        if self.subMeshIndex == 0 then
            self.renderCmd:setRenderTexture(self.outputTex)
            self.renderCmd:clearRenderTexture(true, false, Amaz.Color(0, 0, 0, 0))
            self.renderCmd:blit(target, self.targetCache)
        end
        self.renderCmd:setRenderTexture(self.outputTex)
        self.renderCmd:drawMesh(self.strokeMesh, self.stModel, self.renderMaterial, self.subMeshIndex, 0, nil)
        --self.renderCmd:setGlobalTexture("layerTexture", self.targetCache)
        --self.renderCmd:setGlobalTexture("strokeTexture", self.outputTex)
        local block = Amaz.MaterialPropertyBlock()
        block:setTexture("layerTexture", self.targetCache)
        block:setTexture("strokeTexture", self.outputTex)
        self.renderCmd:setRenderTexture(target)
        self.renderCmd:drawMesh(self.rectMesh, self.stModel, self.renderMaterial, 0, 1, block)
        comp.entity.scene:commitCommandBuffer(self.renderCmd)
    elseif dirty == Amaz.Brush2DDirtyFlag.Undo then
        if self.undoTexCache then
            self.cacheTex = self.undoTexCache:getTexture()
        end
    elseif dirty == Amaz.Brush2DDirtyFlag.Redo then
        if self.redoTexCache then
            self.cacheTex = self.redoTexCache:getTexture()
        end
    elseif dirty == Amaz.Brush2DDirtyFlag.Cache then
        self.cacheTex = nil
        collectgarbage("collect")
    end
    dirty = Amaz.Brush2DDirtyFlag.Unchanged

    if finished then
        if not self.cacheFlag then
            Amaz.Brush2DUtils.alignBBoxToResolution(self.halfResolution, self.strokeBBox)
            Amaz.Brush2DUtils.generateBBoxMesh(self.strokeBBox, self.cropMesh, false, true)
            local cacheWidth = (self.strokeBBox.max_x - self.strokeBBox.min_x) * self.halfResolution.x
            local cacheHeight = (self.strokeBBox.max_y - self.strokeBBox.min_y) * self.halfResolution.y
            if self.undoTexCache then
                self.undoTex = Amaz.RenderTexture()
                self.undoTex.width = cacheWidth
                self.undoTex.height = cacheHeight
                self.undoTexCache:setTexture(self.undoTex)
                self.cacheCmd:setRenderTexture(self.undoTex)
                --self.cacheCmd:setGlobalTexture("_MainTex", self.targetCache)
                local block = Amaz.MaterialPropertyBlock()
                block:setTexture("_MainTex", self.targetCache)
                self.cacheCmd:drawMesh(self.cropMesh, self.stModel, self.blitMaterial, 0, 0, block)
            end
            if self.redoTexCache then
                self.redoTex = Amaz.RenderTexture()
                self.redoTex.width = cacheWidth
                self.redoTex.height = cacheHeight
                self.redoTexCache:setTexture(self.redoTex)
                self.cacheCmd:setRenderTexture(self.redoTex)
                self.cacheCmd:setGlobalTexture("_MainTex", target)
                self.cacheCmd:drawMesh(self.cropMesh, self.stModel, self.blitMaterial, 0, 0, nil)
            end
            comp.entity.scene:commitCommandBuffer(self.cacheCmd)
            dirty = Amaz.Brush2DDirtyFlag.Cache
            self.cacheFlag = true
        elseif self.cacheTex then
            local block = Amaz.MaterialPropertyBlock()
            block:setTexture("_MainTex", self.cacheTex)
            self.renderCmd:setRenderTexture(target)
            self.renderCmd:drawMesh(self.cacheMesh, self.stModel, self.blitMaterial, 0, 0, block)
            comp.entity.scene:commitCommandBuffer(self.renderCmd)
            dirty = Amaz.Brush2DDirtyFlag.Cache
        end
    end

    self.stroke.dirtyFlag = dirty
end

function stroke_lua:onStrokeFinish()
    self.entity:removeComponent("Brush2DInputProcessor")
    self.entity:removeComponent("Brush2DMeshGenerator")
    self.cacheMesh = Amaz.Mesh()
    Amaz.Brush2DUtils.generateBBoxMesh(self.strokeBBox, self.cacheMesh, true, false)

    self.resolution = nil
    self.config = nil
    self.entity = nil
    self.processor = nil
    self.generator = nil
    self.targetCache = nil
    self.outputTex = nil
    self.undoTex = nil
    self.redoTex = nil
    self.strokeMesh = nil
    self.rectMesh = nil
    self.cropMesh = nil

    collectgarbage("collect")
end

exports.stroke_lua = stroke_lua
return exports
