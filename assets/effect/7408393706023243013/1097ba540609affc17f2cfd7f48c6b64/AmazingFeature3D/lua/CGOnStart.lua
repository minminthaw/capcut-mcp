local CGOnStart = CGOnStart or {}
CGOnStart.__index = CGOnStart

function CGOnStart.new()
    local self = setmetatable({}, CGOnStart)
    self.outputs = {}
    self.nexts = {}
    return self
end

function CGOnStart:setNext(index, func)
    self.nexts[index] = func
end

function CGOnStart:execute()
    if self.nexts[0] then
        self.nexts[0]()
    end
end

function CGOnStart:onReset()
    -- if excute before onReset, will not trigger next, so do nothing.
    --[[if self.nexts[0] then
        self.nexts[0]()
    end]]--
end

return CGOnStart
