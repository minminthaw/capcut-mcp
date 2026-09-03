local Helper = {}

---@param scene Scene
---@param rootName string
---@param order number|nil
---@return number, number
function Helper.initPipeline (scene, rootName, order)
    order = order or 0
    local function setLayerRecursion (node)
        node.entity.layer = order
        for i = 0, node.children:size() - 1 do
            setLayerRecursion(node.children:get(i))
        end
    end
    local root = scene:findEntityBy(rootName)
    if not root then
        return
    end
    local nodes = root:getComponent("Transform").children
    for i = 0, nodes:size() - 1 do
        local node = nodes:get(i)
        local entity = node.entity
        local camera = entity:getComponent("Camera")
        if camera then
            entity.layer = 0
            camera.renderOrder = order
            camera.layerVisibleMask = Amaz.DynamicBitset.new(96, "0x0"):set(order, true)
            setLayerRecursion(node)
            order = order + 1
        else
            setLayerRecursion(node)
        end
    end
    return order
end


---@vararg any[]
function Helper.linkPipeline1 (...)
    local queue = {...}
    local input = table.remove(queue)
    while #queue > 0 do
        local effect = table.remove(queue)
        local output = table.remove(queue)
        if type(input) == "table" then
            for i, tex in ipairs(input) do
                effect["input"..i] = tex
            end
        else
            effect.input = input
        end
        if type(output) == "table" then
            for i, fb in ipairs(output) do
                effect["output"..i] = fb
            end
        else
            effect.output = output
        end
        input = output
    end
end


return Helper