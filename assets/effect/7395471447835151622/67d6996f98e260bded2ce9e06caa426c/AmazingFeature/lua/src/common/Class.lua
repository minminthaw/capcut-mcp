
---@class Class
local Class = {}
Class.__index = function () return nil end
Class.__newindex = function (obj, key, val) rawset(obj, key, val) end


function Class:extend ()

    local cls = setmetatable({
        super = self,
        getters = {},
        setters = {},
    }, {__index = self})

    cls.__index = function (obj, key)
        local ret = rawget(cls, key)
        if ret then return ret end
        local get = cls.getters[key]
        return get and get(obj) or self.__index(obj, key)
    end

    cls.__newindex = function (obj, key, val)
        local set = cls.setters[key]
        if set then
            set(obj, val)
        else
            self.__newindex(obj, key, val)
        end
    end

    return cls
end

function Class:new (...)
    local obj = setmetatable({}, self)
    if self.constructor then
        self.constructor(obj, ...)
    end
    return obj
end

function Class:isBaseOf (cls)
    while cls and cls ~= self do
        cls = cls.super
    end
    return cls == self
end

function Class:isInstance (obj)
    return self:isBaseOf(getmetatable(obj))
end


return Class