local exports = exports or {}
local RoughEdge = RoughEdge or {}
RoughEdge.__index = RoughEdge
---@class RoughEdge : ScriptComponent
---@field edgeSize number
---@field edgeSmooth number
---@field edgeOffset number
---@field noiseIntensity number
---@field noiseSizeX number
---@field noiseSizeY number
---@field noiseRotate number
---@field complexity number
---@field evolution number
---@field cycle number
---@field offset_x number
---@field offset_y number
---@field picture_scale number
---@field InputTex Texture
---@field OutputTex Texture
---@field blurTex1 Texture
---@field blurTex2 Texture

function RoughEdge.new(construct, ...)
    local self = setmetatable({}, RoughEdge)
    if construct and RoughEdge.constructor then
        RoughEdge.constructor(self, ...)
    end

    self.noiseIntensity = 0
    self.noiseSizeX = 0.5
    self.noiseSizeY = 0.5
    self.noiseRotate = 0.0
    self.complexity = 1
    self.evolution = 0
    self.edgeOffset = 0.5
    self.cycle = 100
    self.offset_x = 0
    self.offset_y = 0
    self.edgeSize = 10
    self.edgeSmooth = 1.0
    self.picture_scale = 1
    self.__lumi_type = "lumi_obj"
    self.InputTex = nil
    self.OutputTex = nil

    return self
end

function RoughEdge:constructor()
end

function RoughEdge:onUpdate(comp, detalTime)
    local w = self.OutputTex.width * 0.1
    local h = self.OutputTex.height * 0.1
    if self.blurTex1.width ~= w or self.blurTex1.height ~= h then
        self.blurTex1.width = w
        self.blurTex1.height = h
        self.blurTex2.width = w
        self.blurTex2.height = h
    end

    if self.first == nil then
        self:onStart(comp)
    end

    self.material:setTex("inputImageTexture", self.InputTex)
    self.blur_x_material:setTex("inputImageTexture", self.InputTex)
    self.cam.renderTexture = self.OutputTex
    self.blur_x_material:setFloat("blurSize", math.floor(self.edgeSize + 0.5));
    self.blur_y_material:setFloat("blurSize", math.floor(self.edgeSize + 0.5));
    self.material:setFloat("blurSize", math.floor(self.edgeSize + 0.5));
    self.material:setFloat("edgeSmooth", self.edgeSmooth);
    self.material:setFloat("edgeOffset", self.edgeOffset);
    self.material:setFloat("u_Contrast", self.noiseIntensity - 1.0);
    self.material:setVec2("u_Scale", Amaz.Vector2f(self.noiseSizeX, self.noiseSizeY));
    self.material:setFloat("u_Rotate", self.noiseRotate);
    self.material:setFloat("u_Complexity", self.complexity);
    self.material:setFloat("u_Evolution", math.abs(self.evolution) / 36.0);
    self.material:setFloat("u_Cycle", math.max(2, math.floor(self.cycle + 0.5)));
    self.material:setVec2("u_Offset", Amaz.Vector2f(self.offset_x, self.offset_y))
    self.material:setFloat("picture_scale", self.picture_scale)
end

function RoughEdge:onStart(comp)
    self.material = comp.entity:searchEntity("displacement"):getComponent("MeshRenderer").material
    self.blur_x_material = comp.entity:searchEntity("blur_x"):getComponent("MeshRenderer").material
    self.blur_y_material = comp.entity:searchEntity("blur_y"):getComponent("MeshRenderer").material
    self.material = comp.entity:searchEntity("displacement"):getComponent("MeshRenderer").material
    self.cam = comp.entity:searchEntity("cam_displacement"):getComponent("Camera")
    self.first = true
end

exports.RoughEdge = RoughEdge
return exports
