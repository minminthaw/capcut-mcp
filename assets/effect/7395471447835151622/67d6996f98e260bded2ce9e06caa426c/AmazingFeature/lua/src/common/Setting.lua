
---@class Setting
local Setting = {}


---@param map Map
function Setting:new (map)
    return setmetatable({
        _nativeRef = map,
    }, self)
end


function Setting:__index (var)
    return self._nativeRef:get(var)
end

function Setting:__newindex (var, value)
    self._nativeRef:set(var, value)
end


return Setting