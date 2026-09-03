
_G.considerTemplate = true
_G.templateDividingTime = 0.500000

_G.frameCnt = 49
_G.startFrame = 1
_G.aNewSeq = function(path, format, width, height)
    local re = {}
    re.path = path
    re.format = format
    re.width = width
    re.height = height
    return re
end
_G.stringK = {}
stringK[1] = aNewSeq("", "")
        
stringK["blendTexture"] = aNewSeq("resource1/texture/clipname_", "%s%03d.png", 500, 500)