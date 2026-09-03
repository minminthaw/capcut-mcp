--write by editor  EffectSDK:10.1.0 EngineVersion:10.62.0 EditorBuildTime:Oct_14_2021_22_00_55
--sliderVersion: 20210901  Lua generation date: Wed Oct 20 17:21:50 2021


local exports = exports or {}
local ImageBusinessSlider = ImageBusinessSlider or {}
ImageBusinessSlider.__index = ImageBusinessSlider


function ImageBusinessSlider.new(construct, ...)
    local self = setmetatable({}, ImageBusinessSlider)
    if construct and ImageBusinessSlider.constructor then
        ImageBusinessSlider.constructor(self, ...)
    end
    return self
end


local function remap(x, a, b)
    return x * (b - a) + a
end


function ImageBusinessSlider:onStart(sys)
    self.seqPassMaterial0 = sys.scene:findEntityBy("seqPass"):getComponent("Renderer").material
end


function ImageBusinessSlider:onEvent(sys,event)
    if event.args:get(0) == "effects_adjust_speed" then
        local intensity = event.args:get(1)
        self.seqPassMaterial0["speed"] = remap(intensity,0.5,2)
    end
    if event.args:get(0) == "effects_adjust_background_animation" then
        local intensity = event.args:get(1)
        self.seqPassMaterial0["alphaFactor"] = remap(intensity,0,1)
    end
end


exports.ImageBusinessSlider = ImageBusinessSlider
return exports