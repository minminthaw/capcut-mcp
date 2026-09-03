local exports = exports or {}
local Curves = Curves or {}
Curves.__index = Curves
---@class Curves: ScriptComponent
---@field InputTex Texture
---@field OutputTex Texture

function Curves.new(construct, ...)
    local self = setmetatable({}, Curves)
    if construct and Curves.constructor then
        Curves.constructor(self, ...)
    end

    self.InputTex = nil
    self.OutputTex = nil

    local vec2 = Amaz.Vec2Vector()
    vec2:pushBack(Amaz.Vector2f(0, 0))
    vec2:pushBack(Amaz.Vector2f(0.3, 0.3))
    vec2:pushBack(Amaz.Vector2f(0.6, 0.6))
    vec2:pushBack(Amaz.Vector2f(1, 1))

    self.control_points_count_y = 2
    self.control_points_y = vec2:copy()
    self.control_points_count_r = 2
    self.control_points_r = vec2:copy()
    self.control_points_count_g = 2
    self.control_points_g = vec2:copy()
    self.control_points_count_b = 2
    self.control_points_b = vec2:copy()

    self.intensityY = 0
    self.intensityR = 0
    self.intensityG = 0
    self.intensityG = 0

    return self
end

function Curves:constructor()
end

function Curves:onUpdate(comp, detalTime)
    self:seekToTime(comp, detalTime)
end

function Curves:start(comp)
    -- Amaz.LOGE('zglog: Curves:start'," ")
    self.camera = comp.entity:searchEntity("Camera_entity"):getComponent("Camera")
    self.material = comp.entity:searchEntity("PassEntity"):getComponent("MeshRenderer").material

    self.curveLUTY = comp.entity:searchEntity("curveLUTY"):getComponent("MeshRenderer").material
    self.curveLUTY:setVec2Vector("controlPoints", self.control_points_y)
    self.curveLUTY:setInt("pointsNums", self.control_points_count_y)

    self.curveLUTR = comp.entity:searchEntity("curveLUTR"):getComponent("MeshRenderer").material
    self.curveLUTR:setVec2Vector("controlPoints", self.control_points_r)
    self.curveLUTR:setInt("pointsNums", self.control_points_count_r)

    self.curveLUTG = comp.entity:searchEntity("curveLUTG"):getComponent("MeshRenderer").material
    self.curveLUTG:setVec2Vector("controlPoints", self.control_points_g)
    self.curveLUTG:setInt("pointsNums", self.control_points_count_g)

    self.curveLUTB = comp.entity:searchEntity("curveLUTB"):getComponent("MeshRenderer").material
    self.curveLUTB:setVec2Vector("controlPoints", self.control_points_b)
    self.curveLUTB:setInt("pointsNums", self.control_points_count_b)

end

function Curves:seekToTime(comp, time)
    -- Amaz.LOGE('zglog: seekToTime'," ")
    if self.first == nil then
        self.first = true
        self:start(comp)
    end

    self.camera.renderTexture = self.OutputTex
    self.material:setTex("inputImageTexture", self.InputTex)
    self.material:setFloat("intensityY", self.intensityY)
    self.material:setFloat("intensityR", self.intensityR)
    self.material:setFloat("intensityG", self.intensityG)
    self.material:setFloat("intensityB", self.intensityG)
    self.curveLUTY:setVec2Vector("controlPoints", self.control_points_y)
    self.curveLUTY:setInt("pointsNums", self.control_points_count_y)
    self.curveLUTR:setVec2Vector("controlPoints", self.control_points_r)
    self.curveLUTR:setInt("pointsNums", self.control_points_count_r)
    self.curveLUTG:setVec2Vector("controlPoints", self.control_points_g)
    self.curveLUTG:setInt("pointsNums", self.control_points_count_g)
    self.curveLUTB:setVec2Vector("controlPoints", self.control_points_b)
    self.curveLUTB:setInt("pointsNums", self.control_points_count_b)
end

exports.Curves = Curves
return exports
