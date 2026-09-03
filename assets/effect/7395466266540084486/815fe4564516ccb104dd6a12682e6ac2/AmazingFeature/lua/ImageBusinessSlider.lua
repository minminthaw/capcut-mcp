--write by editor  EffectSDK:16.2.0 EngineVersion:16.0.0 EditorBuildTime:Mar_25_2024_17_53_00
--sliderVersion: 20230517  Lua generation date: Sun Apr 28 23:22:18 2024


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
end


function ImageBusinessSlider:onEvent(sys,event)
end


exports.ImageBusinessSlider = ImageBusinessSlider
return exports