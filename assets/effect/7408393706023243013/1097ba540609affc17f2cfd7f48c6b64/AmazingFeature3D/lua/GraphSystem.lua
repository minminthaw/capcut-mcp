
local exports = exports or {}
local GraphSystem = GraphSystem or {}
GraphSystem.__index = GraphSystem


local default_weight = 0.7

local pre_intensity = 0

local FACE_ADJUST = "face_adjust_fengchun"
local FACE_ID = "id"
local EPSC = 0.001
local FACE_ADJUST_INTENSITY = "intensity"



function GraphSystem.new(construct, ...)
    local self = setmetatable({}, GraphSystem)
    local lua = {}
    self.nodes = {}
    self.maxFaceNum = 5 -- 
    self.maxDisplayNum = 5 -- 
    self.callbackNode ={}
    self.callbackNode["onStart"] = {}
    self.callbackNode["onUpdate"] = {}
    self.callbackNode["onEvent"] = {}
    self.callbackNode["onComponentRemoved"] = {}
    self.callbackNode["onCallBack"] = {}
    self.callbackNode["tempOnStart"] = {}
    self.callbackNode["onDestroy"] = {}
    self.autoResetFlag = true
    self.system = nil
    -- member variable init
    self.defaultValues = {}
    self.propertyNodes = {}
      -- include file 

    self.nodes["EMNodeProperty_0"] = generateEmptyNode()
    -- Property set
    self.nodes["EMNodeProperty_0"].execute = function(__self, __index)
        local localObject = Amaz.AmazingUtil.guidToPointer(Amaz.Guid("667051098349905648", "72256402295762855"))
        -- local inputValue = __self.inputs[1]()

        local inputValue =  localObject:getChannelWeight("fengchun")

        if inputValue == nil or localObject == nil then
            return
        end
        localObject:setChannelWeight("fengchun", inputValue)
        if __self.nexts[0] then
            __self.nexts[0]()
        end
    end

    -- Get property reset value
    self.nodes["EMNodeProperty_0"].initValue = function(__self, __index)
        if Amaz.AmazingUtil.guidToPointer(Amaz.Guid("667051098349905648", "72256402295762855")) ~= nil then
            local localObject = Amaz.AmazingUtil.guidToPointer(Amaz.Guid("667051098349905648", "72256402295762855"))
            self.nodes["EMNodeProperty_0"].default = localObject:getChannelWeight("fengchun")
        end
    end
    table.insert(self.propertyNodes, self.nodes["EMNodeProperty_0"])
    -- reset property
    self.nodes["EMNodeProperty_0"].onReset = function(__self, __index)
        local localObject = Amaz.AmazingUtil.guidToPointer(Amaz.Guid("667051098349905648", "72256402295762855"))
        if not localObject then
            return
        end
        if self.nodes["EMNodeProperty_0"].default == nil then
            return
        end
        localObject:setChannelWeight("fengchun", self.nodes["EMNodeProperty_0"].default)
    end








    self.nodes[""] = {}



    
    
    lua.CGRecordVideo_lua = includeRelativePath("CGRecordVideo.lua")

    self.nodes["Record_Video_2"] = lua.CGRecordVideo_lua.new()






    
    
    lua.CGOnStart_lua = includeRelativePath("CGOnStart.lua")

    self.nodes["OnStart_1"] = lua.CGOnStart_lua.new()






    
    
    lua.CGNumberTransition_lua = includeRelativePath("CGNumberTransition.lua")

    self.nodes["Number_Transition_0"] = lua.CGNumberTransition_lua.new()


    self.nodes["Number_Transition_0"]:setInput(4, function() return 1.000000 end)
    self.nodes["Number_Transition_0"]:setInput(5, function() return 1.000000 end)
    self.nodes["Number_Transition_0"]:setInput(6, function() return 1.000000 end)
    self.nodes["Number_Transition_0"]:setInput(7, function() return "Linear" end)
    self.nodes["Number_Transition_0"]:setInput(8, function() return 1 end)

    self.nodes["Number_Transition_0"].valueType = "Double"


    -- end include file
        -- network connect
    self.nodes["EMNodeProperty_0"]:setInput(1, function()
        local __portValue = self.nodes["Number_Transition_0"]:getOutput(3)
        return __portValue
    end)
    self.nodes["Number_Transition_0"]:setNext(0, function()
        self.nodes["EMNodeProperty_0"]:execute(0)
    end)
    self.nodes["OnStart_1"]:setNext(0, function()
        self.nodes["Number_Transition_0"]:execute(0)
    end)
    self.nodes["Record_Video_2"]:setNext(0, function()
        self.nodes["Number_Transition_0"]:execute(0)
    end)
    --  end network connect
    table.insert(self.callbackNode["onEvent"], self.nodes["Record_Video_2"])
   if string.find("OnStart_1", "OnStart") ~= nil then
        table.insert(self.callbackNode["tempOnStart"], self.nodes["OnStart_1"])
   else
        table.insert(self.callbackNode["tempOnStart"] ,1 , self.nodes["OnStart_1"])
   end
    table.insert(self.callbackNode["onUpdate"], self.nodes["Number_Transition_0"])
if #self.callbackNode["tempOnStart"] > 0 then
    for k, v in pairs(self.callbackNode["tempOnStart"]) do
        table.insert(self.callbackNode["onStart"], v)
    end
end
    return self
end

function GraphSystem:constructor()
    -- print('running: GraphSystem:constructor')
end

function GraphSystem:onComponentAdded(sys, comp)
    -- print('running: GraphSystem:onComponentAdded')
end

function GraphSystem:onComponentRemoved(sys, comp)
    -- print('running: GraphSystem:onComponentRemoved')
    -- print('running: GraphSystem:onStart')
    self.system = sys
    for i=1, #self.callbackNode["onComponentRemoved"] do
        self.callbackNode["onComponentRemoved"][i]:onDestroy(sys)
    end
end

function GraphSystem:onDestroy(sys)
    for i=1, #self.callbackNode["onDestroy"] do
        self.callbackNode["onDestroy"][i]:onDestroy(self.system)
    end
    self.system = nil
end

function GraphSystem:onStart(sys)
    for i = 1, #self.propertyNodes do
        self.propertyNodes[i]:initValue()
    end
    for i=1, #self.callbackNode["onStart"] do
        self.callbackNode["onStart"][i]:execute(sys)
    end
end

function GraphSystem:handleIntensityEvent(sys, event)
    if event.args:get(0) == FACE_ADJUST then
        self.faceAdjustMaps = {}
        local inputVector = event.args:get(1)
        local inputSize = inputVector:size()
        for i = 1, inputSize do
            local inputMap = inputVector:get(i - 1)
            local inputId = inputMap:get(FACE_ID)
            self.faceAdjustMaps[inputId] = inputMap
        end
    end
end
function GraphSystem:onEvent(sys, event)
    if event.type == Amaz.AppEventType.SetEffectIntensity then
        self:handleIntensityEvent(sys, event)
    end
    
    if event.type == Amaz.AppEventType.COMPAT_BEF then
        local event_result = event.args:get(0)
        if event_result == Amaz.BEFEventType.BET_RECORD_VIDEO then
            local event_result = event.args:get(1)
            if event_result == 1 and self.autoResetFlag then
                for k, v in pairs(self.defaultValues) do
                    self[k] = v
                end
                for k, v in pairs(self.nodes) do
                    if v.onReset then
                    	v:onReset()
                    end
                end           
                -- Also trigger CGOnStart node.
                for k, v in pairs(self.nodes) do
                    if string.sub(k, 0, 7) == "OnStart" then
                    	v:execute()
                    end
                    if string.sub(k, 0, 13) == "Timer_Trigger" then
                    	v:execute(sys)
                    end
                end
            end
        end
    end
    for i=1, #self.callbackNode["onEvent"] do
        self.callbackNode["onEvent"][i]:onEvent(sys, event)
    end
end

function GraphSystem:onCallBack(sys, userData, eventType)
    -- print('running: GraphSystem:onCallBack')
    for i=1, #self.callbackNode["onCallBack"] do
        self.callbackNode["onCallBack"][i]:callback(sys, userData, eventType)
    end
end
function GraphSystem:updateFaceInfoBySize()
    self.faceInfoBySize = {}

    local result = Amaz.Algorithm.getAEAlgorithmResult()
    local faceCount = result:getFaceCount()
    local freidCount = result:getFreidInfoCount()
    for i = 0, self.maxFaceNum - 1 do
        local trackId = -1
        local faceSize = 0
        if i < faceCount then
            local baseInfo = result:getFaceBaseInfo(i)
            local faceId = baseInfo.ID
            local faceRect = baseInfo.rect
            for j = 0, freidCount - 1 do
                local freidInfo = result:getFreidInfo(j)
                if faceId == freidInfo.faceid then
                    trackId = freidInfo.trackid -- 
                end
            end
            faceSize = faceRect.width * faceRect.height --
        end
        table.insert(self.faceInfoBySize, {
            index = i, -- 
            id = trackId,
            size = faceSize
        })
    end
    table.sort(self.faceInfoBySize, function(a, b)
        return a.size > b.size -- 
    end)
end
function GraphSystem:onUpdate(sys,deltaTime)
    self:updateFaceInfoBySize()
    -- print('running: GraphSystem:onUpdate')
    for i = 1, #self.callbackNode["onUpdate"] do
        self.callbackNode["onUpdate"][i]:update(sys, deltaTime)
    end
    local faceInfo = self.faceInfoBySize[1]
        local id = faceInfo.id -- 
        local index = faceInfo.index -- 
        local intensity = 0
        if id ~= -1 and 1 <= self.maxDisplayNum then -- 
            local adjustMap = self.faceAdjustMaps[id]
            if adjustMap == nil then
                adjustMap = self.faceAdjustMaps[-1]
            end
            intensity = adjustMap:get(FACE_ADJUST_INTENSITY)*2.0
            if intensity<0 then
                intensity= intensity*0.45
            end
        end
    local inputValue = intensity
    local localObject = Amaz.AmazingUtil.guidToPointer(Amaz.Guid("667051098349905648", "72256402295762855"))
        if localObject ~= nil and inputValue > 0 then
            localObject:setChannelWeight("fengchun", inputValue)
        end
end




function generateEmptyNode()
    local node = {}
    node.nexts = {}
    node.inputs = {}
    node.setNext = function(__self, __index, __next) __self.nexts[__index] = __next end
    node.setInput = function(__self, __index, __func) __self.inputs[__index] = __func end
    return node
end

exports.GraphSystem = GraphSystem
return exports
