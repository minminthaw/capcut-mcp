---@class SeekModeScript: ScriptComponent
----@field nowTime number
----@field timeRange Vector2f
----@field lightRange Vector2f
----@field lightRange2 Vector2f
----@field jump1Range Vector2f
----@field jump2Range Vector2f
----@field inputTex RenderTexture
----@field blurTex RenderTexture
----@field highLightTex RenderTexture
----@field autoPlay boolean

local exports = exports or {}
local SeekModeScript = SeekModeScript or {}
SeekModeScript.__index = SeekModeScript

local fps = 10.0
local scale = {1.0, 1.07, 1.1, 1.13, 1.17, 1.2, 1.2, 1.0, 1.0, 1.0, 1.0}

function SeekModeScript.new(construct, ...)
    local self = setmetatable({}, SeekModeScript)
    if construct and SeekModeScript.constructor then
        SeekModeScript.constructor(self, ...)
    end
    self.startTime = 0.0
    self.endTime = 3.0
    self.curTime = 0.0
    self.width = 0
    self.height = 0
    self.speedIntensity = 0.33
    self.horzIntensity = 0.5
    self.vertIntensity = 0.5
    return self
end

function SeekModeScript:constructor()
end

function SeekModeScript:onUpdate(comp, detalTime)
    if Amaz.Macros and Amaz.Macros.EditorSDK then
        if self.autoPlay then
            self.nowTime = self.nowTime + detalTime
        end
        self.curTime = self.nowTime
    end
    self:seekToTime(comp, self.curTime - self.startTime)
end

function SeekModeScript:onStart(comp)
    -- self.material = comp.entity:getComponent("MeshRenderer").material
    includeRelativePath("EntityLua")
    ---@type table<string, EntityLua>
    self.entityLuas = getAllEntityLuasInScene(comp.entity.scene, {getMaterial = true})
    -- self.cameraEntity = {"Camera_highLight", "Camera_radialBlur_1", "Camera_blur1", "Camera_blur2", "Camera_radialBlur_2"}
end

function SeekModeScript:seekToTime(comp, time)
    local w = Amaz.BuiltinObject:getInputTextureWidth()
    local h = Amaz.BuiltinObject:getInputTextureHeight()
    if w ~= self.width or h ~= self.height then
        self.width = w
        self.height = h
        --if w < h then
        --    self.highLightTex.pecentX = 180 / w
        --    self.highLightTex.pecentY = (180 / w * h) / h
        --else
        --    self.highLightTex.pecentX = (180 * w / h) / w
        --    self.highLightTex.pecentY = (180) / h
        --end
    end
    local allTime = (self.timeRange.x + self.timeRange.y * self.speedIntensity) --ldr
    local nowTime = math.mod(time, allTime)
    if nowTime > self.lightRange.x * allTime and nowTime < self.lightRange.y * allTime then
        local nowTimePoint =
            (nowTime - self.lightRange.x * allTime) / (self.lightRange.y * allTime - self.lightRange.x * allTime)
        local nowStr = 0
        if (nowTimePoint <= 0.92 and nowTimePoint >= 0.24) then
            local mid = (0.92 + 0.24) * 0.5
            local range = (0.92 - 0.24) * 0.5
            local blurCoeff = 1.0 - math.abs(nowTimePoint - mid) / range
            nowStr = 3.0 * blurCoeff
        end

        local res = Amaz.Algorithm.getAEAlgorithmResult()
        local face = res:getFaceBaseInfo(0)
        local center
        if face then
            center = face.points_array:get(46)
        else
            center = Amaz.Vector2f(0.5, 0.5)
        end
        self.entityLuas["blend"].material["u_Scale"] = 1
        self.entityLuas["blend"].material["u_Scale"] = 1
        self.entityLuas["blend"].material["u_Mode"] = 1
        self.entityLuas["radialBlur_2"].material["u_nowStrength"] = nowStr
        self.entityLuas["radialBlur_2"].material["u_CenterPoint"] = center
        self.entityLuas["Highlight"].material["u_nowStrength"] = nowTimePoint
        self.entityLuas["Camera_Highlight"].entity.visible = true
        self.entityLuas["Camera_radialBlur_2"].entity.visible = true
        self.entityLuas["Camera_blur1"].entity.visible = true
        self.entityLuas["Camera_blur2"].entity.visible = true
        self.entityLuas["blur1"].material["inputTex"] = self.blurTex
        self.entityLuas["heart"].material["timer"] = nowTimePoint
        Amaz.LOGI("yyb", nowTimePoint)
    else
        self.entityLuas["Camera_Highlight"].entity.visible = false
        self.entityLuas["Camera_radialBlur_2"].entity.visible = false
        self.entityLuas["Camera_blur1"].entity.visible = false
        self.entityLuas["Camera_blur2"].entity.visible = false
        self.entityLuas["blend"].material["u_Mode"] = 0
        self.entityLuas["heart"].material["timer"] = 0
    end

    -- self.material:setFloat("scale", scale[id])
end

function SeekModeScript:onEvent(sys, event)
    if "effects_adjust_speed" == event.args:get(0) then
        local intensity = event.args:get(1)
        self.speedIntensity = 1 - intensity
    end
end

exports.SeekModeScript = SeekModeScript
return exports
