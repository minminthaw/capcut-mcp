local exports = exports or {}
local MyRotate = MyRotate or {}

                                    
---@class MyRotate: ScriptComponent [UI(Display="The asdasR")]
----@field img1W int
----@field img1H int
----@field blendMode string [UI(Option={"blendNormal","blendLinearDodge","blendMultiply","blendOverlay","blendScreen","blendSoftLight", "blendAdd", "blendAverage", "blendColorBurn", "blendColorDodge", "blendDarken", "blendDifference", "blendExclusion", "blendGlow", "blendHardLight","blendHardMix","blendLighten","blendLinearBurn","blendLinearLight","blendNegation","blendPhoenix","blendPinLight","blendReflect","blendSubstract","blendVividLight","blendSnowColor","blendSnowHue"})]
----@field alignMode string [UI(Option={"centerCrop", "fitXY", "centerCropWithRot", "fitXYWithRot","centerCropAtBottom","centerCropAtTop"})]
----@field useFilter Bool

MyRotate.__index = MyRotate

function MyRotate.new(construct, ...)
    local self = setmetatable({}, MyRotate)
    self.ratio = 1.2 
    self.img1W = 0
    self.img1H = 0
    self.blendMode="blendNormal"
    self.blendMap={}
    self.alignMode="centerCrop"
    self.alignMap={}
    self.useFilter=false
    self.firstIn = 1
    self.mytime = 0

    return self
end
function MyRotate:onStart(comp)
    self.entity = comp.entity
    self.animSeqCom = comp.entity.scene:findEntityBy("seqPass"):getComponent("AnimSeqComponent")
    self.material = comp.entity.scene:findEntityBy("seqPass"):getComponent("MeshRenderer").material

    self.alignMap["centerCrop"]=0
    self.alignMap["fitXY"]=1
    self.alignMap["centerCropWithRot"]=2
    self.alignMap["fitXYWithRot"]=3
    self.alignMap["centerCropAtBottom"]=4
    self.alignMap["centerCropAtTop"]=5

    self.blendMap["blendNormal"]=0
    self.blendMap["blendAdd"]=1
    self.blendMap["blendAverage"]=2
    self.blendMap["blendColorBurn"]=3
    self.blendMap["blendColorDodge"]=4
    self.blendMap["blendDarken"]=5
    self.blendMap["blendDifference"]=6
    self.blendMap["blendExclusion"]=7
    self.blendMap["blendGlow"]=8
    self.blendMap["blendHardLight"]=9
    self.blendMap["blendHardMix"]=10
    self.blendMap["blendLighten"]=11
    self.blendMap["blendLinearBurn"]=12
    self.blendMap["blendLinearDodge"]=13
    self.blendMap["blendLinearLight"]=14
    self.blendMap["blendMultiply"]=15
    self.blendMap["blendNegation"]=16
    self.blendMap["blendOverlay"]=17
    self.blendMap["blendPhoenix"]=18
    self.blendMap["blendPinLight"]=19
    self.blendMap["blendReflect"]=20
    self.blendMap["blendScreen"]=21
    self.blendMap["blendSoftLight"]=22
    self.blendMap["blendSubstract"]=23
    self.blendMap["blendVividLight"]=24
    self.blendMap["blendSnowColor"]=25
    self.blendMap["blendSnowHue"]=26

    local w = Amaz.BuiltinObject:getInputTextureWidth()
    local h = Amaz.BuiltinObject:getInputTextureHeight()
    local aspectRatio = w / (h + 0.001)
    self.ratio=aspectRatio
    self.material:setInt("baseTexWidth", w)
    self.material:setInt("baseTexHeight", h)
    self.material:setInt("sucaiW", self.img1W)
    self.material:setInt("sucaiH", self.img1H)
    
    self.material:enableMacro('blendMode',self.blendMap[self.blendMode])
    self.material:enableMacro('alignMode',self.alignMap[self.alignMode])
    if(self.useFilter~=self.lastuseFilter) then
        self.lastuseFilter=self.useFilter
        if(self.useFilter==true) then
        self.material:enableMacro('usefilter',1)
        else
        self.material:disableMacro('usefilter')
        end
    end
    
end
function MyRotate:onUpdate(comp, deltaTime)
    local w = Amaz.BuiltinObject:getInputTextureWidth()
    local h = Amaz.BuiltinObject:getInputTextureHeight()
    local aspectRatio = w / (h + 0.001)
    if math.abs(aspectRatio - self.ratio) > 0.001 then
        self.width = w
        self.height = h
        self.ratio = aspectRatio
        self.material:setInt("baseTexWidth", self.width)
        self.material:setInt("baseTexHeight", self.height)
    end
    if Editor ~= nil then
        self.material:setInt("sucaiW", self.img1W)
        self.material:setInt("sucaiH", self.img1H)
        self.material:enableMacro('blendMode',self.blendMap[self.blendMode])
        if(self.useFilter==true) then
            self.material:enableMacro('usefilter',1)
        else
            self.material:disableMacro('usefilter')
        end
        self.material:enableMacro('alignMode',self.alignMap[self.alignMode])
    end
    
end

exports.MyRotate = MyRotate
return exports
