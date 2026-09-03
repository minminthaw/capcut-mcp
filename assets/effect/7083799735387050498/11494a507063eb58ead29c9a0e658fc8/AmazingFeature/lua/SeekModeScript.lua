--@input float curTime = 0.0{"widget":"slider","min":0,"max":3.0}z
local function getBezierValue(controls, t)
    local ret = {}
    local xc1 = controls[1]
    local yc1 = controls[2]
    local xc2 = controls[3]
    local yc2 = controls[4]
    ret[1] = 3*xc1*(1-t)*(1-t)*t+3*xc2*(1-t)*t*t+t*t*t
    ret[2] = 3*yc1*(1-t)*(1-t)*t+3*yc2*(1-t)*t*t+t*t*t
    return ret
end

local function getBezierDerivative(controls, t)
    local ret = {}
    local xc1 = controls[1]
    local yc1 = controls[2]
    local xc2 = controls[3]
    local yc2 = controls[4]
    ret[1] = 3*xc1*(1-t)*(1-3*t)+3*xc2*(2-3*t)*t+3*t*t
    ret[2] = 3*yc1*(1-t)*(1-3*t)+3*yc2*(2-3*t)*t+3*t*t
    return ret
end

local function getBezierTfromX(controls, x)
    local ts = 0
    local te = 1
    -- divide and conque
    repeat
        local tm = (ts+te)/2
        local value = getBezierValue(controls, tm)
        if(value[1]>x) then
            te = tm
        else
            ts = tm
        end
    until(te-ts < 0.0001)

    return (te+ts)/2
end
local bazier={0.65, 0.08, 0.48, 0.85}

local exports = exports or {}
local SeekModeScript = SeekModeScript or {}
SeekModeScript.__index = SeekModeScript
function SeekModeScript.new(construct, ...)
    local self = setmetatable({}, SeekModeScript)
    if construct and SeekModeScript.constructor then SeekModeScript.constructor(self, ...) end
    self.startTime = 0.0
    self.endTime = 3.0
    self.curTime = 0.0
    self.width = 0
    self.height = 0
    self.currentflag = 0
    self.ratioNameList = {"11",     "34",      "43",      "916",     "169"   ,  "2351"}
    self.ratioValueList=     {1.000,     0.7500,     1.3333,     0.5625,     1.77777 , 2.35}
    return self
end

function SeekModeScript:constructor()

end


function SeekModeScript:onStart(comp, sys)
    -- self.seqMaterial = comp.entity.scene:findEntityBy("seqPass"):getComponent("MeshRenderer").material
    self.filterMaterial = comp.entity.scene:findEntityBy("filter"):getComponent("MeshRenderer").material
    -- self.pngFitAll_mat = comp.entity.scene:findEntityBy("Pass2d"):getComponent("MeshRenderer").material
    -- self.pass0Material = comp.entity.scene:findEntityBy("Pass0"):getComponent("MeshRenderer").material
    -- self.pass1Material = comp.entity.scene:findEntityBy("Pass1"):getComponent("MeshRenderer").material
    -- self.pass3Material = comp.entity:getComponent("MeshRenderer").material
    -- self.pass4Material = comp.entity.scene:findEntityBy("Pass4"):getComponent("MeshRenderer").material
    -- self.camera0 = comp.entity.scene:findEntityBy("CameraPass0"):getComponent("Camera")
    -- self.camera1 = comp.entity.scene:findEntityBy("CameraPass1"):getComponent("Camera")
    -- self.camera3 = comp.entity.scene:findEntityBy("CameraPass3"):getComponent("Camera")
    -- self.camera4 = comp.entity.scene:findEntityBy("CameraPass4"):getComponent("Camera")

end
function SeekModeScript:onUpdate(comp, detalTime)
    -- self.curTime = self.curTime + detalTime
    -- local w = Amaz.BuiltinObject:getInputTextureWidth()
    -- local h = Amaz.BuiltinObject:getInputTextureHeight()
    -- if w ~= self.width or h ~= self.height then  
    --     self.width = w
    --     self.height = h
    --     local currentRatio = w/h
    --     local min = 100
    --     for i=1,#self.ratioValueList do
    --         local result = math.abs(currentRatio - self.ratioValueList[i])
    --         if(result < min) then
    --             min = result
    --             self.currentflag = i
    --         end
    --     end
    --     local path = "image/"..self.ratioNameList[self.currentflag]..".png"
    --     local tex = comp.entity.scene.assetMgr:SyncLoad(path)
    --     local aspectRatio = w/h
    --     if aspectRatio>2.3 then
    --     self.pngFitAll_mat:setTex("bk", tex)
    -- elseif aspectRatio>14/9 then
    --     self.pngFitAll_mat:setTex("bk", tex)
    -- elseif aspectRatio>7/6 then  
    --     self.pngFitAll_mat:setTex("bk", tex)
    -- elseif aspectRatio>7/8 then
    --     self.pngFitAll_mat:setTex("bk", tex)
    -- elseif aspectRatio>21/32 then 
    --     self.pngFitAll_mat:setTex("bk", tex)
    -- else
    --     self.pngFitAll_mat:setTex("bk", tex)
    --     end
    -- end
    -- local progress = (self.curTime - self.startTime)/(self.endTime - self.startTime)
    -- --progress=progress/allTime
    -- local temp =getBezierTfromX(bazier,progress)
    -- local v =(getBezierTfromX(bazier,progress+0.01)-temp)/0.01/(self.endTime - self.startTime)
    -- -- self.pass1mat:setFloat("bazierTemp", temp)
    -- -- self.pass1mat:setFloat("bazierV", v)
    -- self.pngFitAll_mat:setFloat("progress", progress)
    
end
function SeekModeScript:seekToTime(comp, time)
    
    -- local w = Amaz.BuiltinObject:getInputTextureWidth()
    -- local h = Amaz.BuiltinObject:getInputTextureHeight()
    -- if w ~= self.width or h ~= self.height then
    --     self.width = w
    --     self.height = h
    --     -- adaptive max side length 
    --     local standard_side = 500
    --     local max_side = math.max(w,h)
    --     if max_side>1000 then
    --         standard_side = max_side*standard_side/1000*1.1
    --     end
        
    --     local zoom_factor = standard_side/max_side
    --     local mW = self.width*zoom_factor
    --     local mH = self.height*zoom_factor
    --     self.pass0Material:setInt("imageWidth", mW)
    --     self.pass0Material:setInt("imageHeight", mH)
    --     self.pass1Material:setInt("imageWidth", mW)
    --     self.pass1Material:setInt("imageHeight", mH)
    --     self.camera0.renderTexture.width = mW
    --     self.camera0.renderTexture.height = mH
    --     self.camera1.renderTexture.width = mW
    --     self.camera1.renderTexture.height = mH
    --     self.pass3Material:setInt("imageWidth", mW)
    --     self.pass3Material:setInt("imageHeight", mH)
    --     self.pass4Material:setInt("imageWidth", mW)
    --     self.pass4Material:setInt("imageHeight", mH)
    --     self.camera3.renderTexture.width = mW
    --     self.camera3.renderTexture.height = mH
       
    -- end

    -- local blurRadius = 0.98
    -- self.pass0Material:setInt("blurRadius",blurRadius)
    -- self.pass1Material:setInt("blurRadius",blurRadius)
    -- local sharpenRadius = 1.0
    -- self.pass3Material:setInt("blurRadius",sharpenRadius)
    -- self.pass4Material:setInt("blurRadius",sharpenRadius)
    -- local sharpness = 1.4
    -- self.pass4Material:setFloat("sharpness",sharpness)

end
function SeekModeScript:onEvent(sys, event)
    if "intensity" == event.args:get(0) then
        local intensity = event.args:get(1)
        self.filterMaterial:setFloat("uniAlpha",intensity)
    end
end
exports.SeekModeScript = SeekModeScript
return exports
