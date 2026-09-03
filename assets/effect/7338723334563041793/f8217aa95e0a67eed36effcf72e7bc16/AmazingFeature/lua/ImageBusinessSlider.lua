--write by editor  EffectSDK:13.7.0 EngineVersion:13.7.0 EditorBuildTime:Apr__4_2023_13_24_45
--sliderVersion: 20210901  Lua generation date: Fri Feb 23 12:49:48 2024


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