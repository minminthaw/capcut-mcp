local Utils = require("common/Utils")
local Setting = require("common/Setting")
local AEAdapter = require("common/AEAdapter")
local Helper = require("cc/Helper")
local AE = require("AE")


local CCMain = {}
CCMain.__index = CCMain
function CCMain.new (env, data)
    local self = setmetatable({}, CCMain)
    self.RENDER_RATIO = 1.6
    self.AE = AE

    data.light = 1
    data.speed = 0.333333333
    data.range = 0.5
    data.intensity = 0.285
    return self
end

function CCMain:create (env, data, scene)
    Helper.initPipeline(scene, "@Pipeline")

    self.cfg = Setting:new(scene:findEntityBy("SeekModeScript"):getComponent("TableComponent").table)
    self.rt0 = scene.assetMgr:SyncLoad("rt/rt0.rt")
    self.rt2 = scene.assetMgr:SyncLoad("rt/rt2.rt")
    self.rt3 = scene.assetMgr:SyncLoad("rt/rt3.rt")
    self.rtN1 = scene.assetMgr:SyncLoad("rt/NewScreenRT.rt")
    self.rtN2 = scene.assetMgr:SyncLoad("rt/NewScreenRT_2.rt")
    self.rtN3 = scene.assetMgr:SyncLoad("rt/NewScreenRT_3.rt")
    self.src = scene.assetMgr:SyncLoad("share://input.texture")
    self.dst = scene.assetMgr:SyncLoad("rt/outputTex.rt")

    self.move2 = scene:findEntityBy("move2"):getComponent("MeshRenderer").material
    self.move3 = scene:findEntityBy("move3"):getComponent("MeshRenderer").material
    self.light = scene:findEntityBy("Highlight"):getComponent("MeshRenderer").material
    self.blurL = scene:findEntityBy("radialBlurLight"):getComponent("MeshRenderer").material
    self.blur1 = scene:findEntityBy("blur1"):getComponent("MeshRenderer").material
    self.blur2 = scene:findEntityBy("blur2"):getComponent("MeshRenderer").material
    self.blend1 = scene:findEntityBy("blend1"):getComponent("MeshRenderer").material
    self.blurR = scene:findEntityBy("radialBlur"):getComponent("MeshRenderer").material
    self.blend2 = scene:findEntityBy("blend2"):getComponent("MeshRenderer").material

    self.ae = AEAdapter:new()
    self.ae:addKeyframes("", self.AE)
end

function CCMain:layout (env, data, w, h)
    local ew = w * self.RENDER_RATIO
    local eh = h * self.RENDER_RATIO
    self.rt0.width = ew
    self.rt0.height = eh
    self.rt2.width = ew
    self.rt2.height = eh
    self.rt3.width = ew
    self.rt3.height = eh
    self.rtN1.width = ew * 0.25
    self.rtN1.height = eh * 0.25
    self.rtN2.width = ew * 0.75
    self.rtN2.height = eh * 0.75
    self.rtN3.width = ew * 0.75
    self.rtN3.height = eh * 0.75

    local s = math.min(w, h) / 1080
    local vw = w / s
    local vh = h / s
    local vew = ew / s
    local veh = eh / s

    local screenSize = Amaz.Vector2f(vw, vh)
    local expandedScreenSize = Amaz.Vector2f(vew, veh)
    self.move2:setVec2("u_screen_size", expandedScreenSize)
    self.move2:setVec2("u_size", screenSize)
    self.move3:setVec2("u_screen_size", expandedScreenSize)
    self.move3:setVec2("u_size", screenSize)
    self.blurR:setVec2("u_size", expandedScreenSize)
    self.blend2:setVec2("u_screen_size", screenSize)
    self.blend2:setVec2("u_size", expandedScreenSize)

    self.vw = vw
    self.vh = vh
    self.vew = vew
    self.veh = veh
end

function CCMain:update (env, data, elapsed, duration, progress)
    local elapsed0 = elapsed * Utils.mix(0.5, 2.0, data.speed)

    local face = Amaz.Algorithm.getAEAlgorithmResult():getFaceBaseInfo(0)
    local center, anchor
    if face then
        anchor = face.points_array:get(46)
        local x = self:tr(anchor.x)
        local y = self:tr(anchor.y)
        center = Amaz.Vector2f(x, y)
    else
        anchor = Amaz.Vector2f(0.5, 0.5)
        center = Amaz.Vector2f(0.5, 0.5)
    end

    self.move2:setVec2("u_position", center)
    self.move2:setVec2("u_anchor", anchor)
    self.move3:setVec2("u_position", center)
    self.move3:setVec2("u_anchor", anchor)

    local scale = self.ae:get("/ADBE Scale", elapsed0)[1] * 0.01
    scale = 1 + (scale - 1) * Utils.mix(0.24, 1, data.range)
    self.move2:setFloat("u_scale", scale)
    self.move3:setFloat("u_scale", scale)

    local amount = self.ae:get("/ADBE Radial Blur-0001", elapsed0)[1] * 0.01
    local amount0 = elapsed0 < 18/25 and amount or 0

    self.light:setFloat("u_nowStrength", amount0)

    self.blurL:setFloat("u_nowStrength", amount0 * 3)
    self.blurL:setVec2("u_CenterPoint", center)
    self.blurL:setFloat("u_Strength", Utils.mix(25, 75, amount0))
    self.blurR:setVec2("u_center", Amaz.Vector2f(self.vew * center.x, self.veh * center.y))
    self.blurR:setFloat("u_amount", 1 + amount * 0.2 * Utils.mix(0.5, 4, data.intensity))

    self.blend1:setFloat("u_opacity1", data.light)
end

function CCMain:tr (x)
    return ((self.RENDER_RATIO - 1) * 0.5 + x) / self.RENDER_RATIO
end


return CCMain