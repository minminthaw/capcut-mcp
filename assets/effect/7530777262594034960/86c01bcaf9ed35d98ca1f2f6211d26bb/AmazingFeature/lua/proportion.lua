local exports = exports or {}
local proportion = proportion or {}
proportion.__index = proportion

local PROPORTION_CORRECT_INTENSITY = "proportion_correct_intensity"
local VERTEX_UNIFORM_MVP = "_MVP"
local LOG_TAG = "AE_EFFECT_TAG proportion.lua" 

function proportion.new(construct, ...)
    local self = setmetatable({}, proportion)
    self.intensity = 0.0
    self.logTag = LOG_TAG
    if construct and proportion.constructor then proportion.constructor(self, ...) end
    return self
end

function proportion:constructor()
    Amaz.Matrix4x4f()
    self.modelMatrix = Amaz.Matrix4x4f():SetIdentity()
    self.viewMatrix = Amaz.Matrix4x4f():SetIdentity()
    self.projectionMatrix = Amaz.Matrix4x4f():SetIdentity()
    self.name = "scriptComp"
end

function proportion:onStart(comp)
    self.proportionMaterial = comp.entity.scene:findEntityBy("proportionScript"):getComponent("MeshRenderer").material
end

function proportion:onUpdate(comp, deltaTime)
    -- 传递给shader
    if self.proportionMaterial then
        local myIntensity = self.intensity * 0.1
        if self.intensity > 0 then
            -- 正向的时候系数是 10
            myIntensity = self.intensity * 0.1
        else
            -- 负向时候的系数是 20
            myIntensity = self.intensity * 0.2
        end

        local yintensity = myIntensity
        local wintensity = math.abs(yintensity)
        local modelMat = Amaz.Matrix4x4f()
        modelMat:SetRow(0, Amaz.Vector4f(1.0, 0.0, 0.0, 0.0))
        modelMat:SetRow(1, Amaz.Vector4f(0.0, 1.0, 0.0, 0.0))
        modelMat:SetRow(2, Amaz.Vector4f(0.0, 0.0, 1.0, 0.0))
        modelMat:SetRow(3, Amaz.Vector4f(0.0, yintensity/2, 0.0, 1.0 - wintensity/2))

        -- 正交矩阵, 不需要投影矩阵和 view 矩阵
        self.proportionMaterial:setMat4("_MVP", modelMat)

        --  设置宽高, 来进行采样
        -- local tmpRt = comp.entity.scene:findEntityBy("camera_proportion"):getComponent("Camera").renderTexture
        -- if tmpRt then
        --     tmpRt.filterMag = Amaz.FilterMode.NEAREST
        --     tmpRt.filterMin = Amaz.FilterMode.NEAREST
        -- end
        self.proportionMaterial:setFloat("_inputWidth", Amaz.BuiltinObject:getInputTextureWidth())
        self.proportionMaterial:setFloat("_inputHeight", Amaz.BuiltinObject:getInputTextureHeight())
    end
end

function proportion:onEvent(sys,event)
    local inputKey = event.args:get(0)
    local inputValue = event.args:get(1)

    local inputIntensity = 0
    local inputMap = inputValue:get(0)
    if inputMap then
            inputIntensity = inputMap:get("intensity")
    end

    if inputKey == PROPORTION_CORRECT_INTENSITY then
        self.intensity = inputIntensity
    end
end

exports.proportion = proportion
return exports
