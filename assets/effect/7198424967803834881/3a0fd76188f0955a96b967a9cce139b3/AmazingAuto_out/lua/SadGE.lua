local exports = exports or {}
local SadGE = SadGE or {}
local json = cjson.new()
SadGE.__index = SadGE

function SadGE.new(construct, ...)
    local self = setmetatable({}, SadGE)
    self.comps = {}
    self.compsdirty = true
    return self
end

local considerTemplate = false
local curP = 0
local p = 0
local duration = 1
local tmp1 = true

-- buffer
local reTmpRt = nil
local transRt = nil
local passTmpRt = nil
local isEndUp = false
local bufferInit = 0
-- protocol list

--region
local GEProtocolList = {}
GEProtocolList.init = function(sys)
    local width = Amaz.BuiltinObject:getInputTextureWidth()
    local height = Amaz.BuiltinObject:getInputTextureHeight()
    GEProtocolList[200] = math.floor(width)
    GEProtocolList[201] = math.floor(height)
    GEProtocolList[300] = 1 / width
    GEProtocolList[301] = 1 / height
    GEProtocolList[3007] = 0
    GEProtocolList["frame"] = 0
end
GEProtocolList.update = function(deltaTime)
    if isDebug == true then
        curP = (curP + deltaTime) % duration
        p = curP / duration
        GEProtocolList[3007] = p
    else
        curP = 0
        GEProtocolList[3007] = Amaz.Input.frameTimestamp
    end
end
--endregion

---------- src/Utils.lua ----------
local Utils = {}

function Utils.__log_translate(args)
    for i, v in ipairs(args) do
        local type = type(v)
        if type == "table" then
            args[i] = cjson.encode(v)
        elseif type == "boolean" then
            args[i] = v and "true" or "false"
        elseif v == nil then
            args[i] = "nil"
        else
            args[i] = v
        end
    end
    return args
end

function Utils.log(fmt, ...)
    ---#ifdef DEV
    --//    Amaz.LOGW("jorgen", string.format(fmt, (unpack or table.unpack)(Utils.__log_translate({...}))))
    ---#endif
end

function Utils.swap(a, b)
    return b, a
end

function Utils.sineIn(t)
    return 1 - math.cos(math.pi * t * .5)
end
function Utils.sineOut(t)
    return math.sin(math.pi * t * .5)
end
function Utils.sineInOut(t)
    return -(math.cos(math.pi * t) - 1) * .5
end
function Utils.quadIn(t)
    return t * t
end
function Utils.quadOut(t)
    return (2 - t) * t
end
function Utils.quadInOut(t)
    return t < .5 and 2 * t * t or t * (4 - t - t) - 1
end
function Utils.cubicIn(t)
    return t * t * t
end
function Utils.cubicOut(t)
    t = 1 - t
    return 1 - t * t * t
end
function Utils.cubicInOut(t)
    if t < .5 then
        return 4 * t * t * t
    else
        t = 2 - t - t
        return 1 - t * t * t * .5
    end
end
function Utils.quartIn(t)
    t = t * t
    return t * t
end
function Utils.quartOut(t)
    t = 1 - t
    t = t * t
    return 1 - t * t
end
function Utils.quartInOut(t)
    if t < .5 then
        t = t * t
        return 8 * t * t
    else
        t = 2 - t - t
        t = t * t
        return 1 - t * t * .5
    end
end
function Utils.expoIn(t)
    return t ~= 0 and math.pow(2, 10 - t - 10) or 0
end
function Utils.expoOut(t)
    return t ~= 1 and 1 - math.pow(2, -10 * t) or 1
end
function Utils.expoInOut(t)
    if t == 0 then
        return 0
    elseif t == 1 then
        return 1
    elseif t < .5 then
        return math.pow(2, 20 * t - 10) * .5
    else
        return 1 - math.pow(2, -20 * t + 10) * .5
    end
end
function Utils.circIn(t)
    return 1 - math.sqrt(1 - t * t)
end
function Utils.circOut(t)
    t = t - 1
    return math.sqrt(1 - t * t)
end
function Utils.circInOut(t)
    if t < .5 then
        return .5 - math.sqrt(1 - 4 * t * t) * .5
    else
        t = 2 - t - t
        return .5 + math.sqrt(1 - t * t) * 0.5
    end
end
function Utils.backIn(t)
    local tt = t * t
    return 2.70158 * tt * t - 1.70158 * tt
end
function Utils.backOut(t)
    t = t - 1
    local tt = t * t
    return 1 + 2.70158 * tt * t + 1.70158 * tt
end
function Utils.backInOut(t)
    if t < .5 then
        t = t + t
        return (t * t * (3.5949095 * t - 2.5949095)) * .5
    else
        t = t + t - 2
        return (t * t * (3.5949095 * t + 2.5949095) + 2) * .5
    end
end
function Utils.elasticIn(t)
    if t == 0 then
        return 0
    elseif t == 1 then
        return 1
    else
        return -math.pow(2, 10 * t - 10) * math.sin((t * 10 - 10.75) * math.pi * 2 / 3)
    end
end
function Utils.elasticOut(t)
    if t == 0 then
        return 0
    elseif t == 1 then
        return 1
    else
        return math.pow(2, -10 * t) * math.sin((t * 10 - .75) * math.pi * 2 / 3) + 1
    end
end
function Utils.elasticInOut(t)
    if t == 0 then
        return 0
    elseif t == 1 then
        return 1
    elseif t < 0.5 then
        return -(math.pow(2, 20 * t - 10) * math.sin((t * 20 - 11.125) * math.pi * 2 / 4.5)) * .5
    else
        return (math.pow(2, -20 * t + 10) * math.sin((t * 20 - 11.125) * math.pi * 2 / 4.5)) * .5 + 1
    end
end
function Utils.bounceIn(t)
    return 1 - Utils.bounceOut(1 - t)
end
function Utils.bounceOut(t)
    local n1 = 7.5625
    local d1 = 2.75
    if t < 1 / d1 then
        return n1 * t * t
    elseif t < 2 / d1 then
        t = t - 1.5 / d1
        return n1 * t * t + .75
    elseif t < 2.5 / d1 then
        t = t - 2.25 / d1
        return n1 * t * t + .9375
    else
        t = t - 2.625 / d1
        return n1 * t * t + .984375
    end
end
function Utils.bounceInOut(t)
    if t < .5 then
        return (1 - Utils.bounceOut(1 - t + t)) * .5
    else
        return (1 + Utils.bounceOut(t + t - 1)) * .5
    end
end

function Utils.clamp(value, min, max)
    return math.min(math.max(min, value), max)
end
function Utils.mix(x, y, a)
    return x + (y - x) * a
end
function Utils.step(edge0, edge1, value)
    return math.min(math.max(0, (value - edge0) / (edge1 - edge0)), 1)
end
function Utils.smoothstep(edge0, edge1, value)
    local t = math.min(math.max(0, (value - edge0) / (edge1 - edge0)), 1)
    return t * t * (3 - t - t)
end

function Utils.bezier4(q, x1, x2, x3, x4, y1, y2, y3, y4)
    local p = 1 - q
    local p2 = p * p
    local p3 = p2 * p
    local q2 = q * q
    local q3 = q2 * q
    local x = x1 * p3 + 3 * x2 * p2 * q + 3 * x3 * p * q2 + x4 * q3
    local y = y4 and y1 * p3 + 3 * y2 * p2 * q + 3 * y3 * p * q2 + y4 * q3
    return x, y
end

---------- src/AEAdapter.lua ----------

---@class AEAdapter
local AEAdapter = {}
AEAdapter.__index = AEAdapter
AEAdapter.EPSILON = 0.001

function AEAdapter:new()
    local self = setmetatable({}, AEAdapter)
    self._tracks = {}
    return self
end

---@param layerName string
---@param layerData table<string, table>
function AEAdapter:addKeyframes(layerName, layerData)
    for trackName, trackData in pairs(layerData) do
        local trackPath = layerName .. "/" .. trackName
        trackData.keyframe = true
        self._tracks[trackPath] = trackData
    end
end

---@param layerName string
---@param layerData table
function AEAdapter:addFrames(layerName, layerData)
    layerData = layerData.layer0
    self:_addFramesVec2(layerName, layerData, "position")
    self:_addFramesVec2(layerName, layerData, "anchor")
    self:_addFramesVec2(layerName, layerData, "scale")
    self._tracks[layerName .. ".rotate"] = layerData.rotate
    self._tracks[layerName .. ".opacity"] = layerData.opacity
end

---@param path string
---@param frame number
---@param normalized boolean
---@return number|number[]
function AEAdapter:get(path, frame, normalized)
    local track = self._tracks[path]
    ---#ifdef DEV
    --//    if not track then
    --//        Utils.log("path '%s' is not found.", path)
    --//        return
    --//    end
    ---#endif
    if not track.keyframe then
        frame = Utils.clamp(frame, 0, #track - 1)
        local f0 = math.floor(frame)
        local f1 = math.ceil(frame)
        local t = frame - f0
        return normalized and t or self._interpolateFrame(track[f0 + 1], track[f1 + 1], t)
    end

    if frame <= track[1][3] then
        return track[1][4]
    end
    for i = 2, #track do
        local keyframe1 = track[i]
        if frame < keyframe1[3] then
            local keyframe0 = track[i - 1]
            local progress = Utils.step(keyframe0[3], keyframe1[3], frame)
            return self._interpolateKeyframe(keyframe0, keyframe1, progress, normalized)
        end
    end
    return track[#track][4]
end

function AEAdapter:_addFramesVec2(name, data, attr)
    data = data[attr]
    if not data then
        return
    end
    local path = name .. "." .. attr

    if data[1] then
        self._tracks[path] = data
        return
    end

    if data.x then
        self._tracks[path .. ".x"] = data.x
    end
    if data.y then
        self._tracks[path .. ".y"] = data.y
    end
end

function AEAdapter._interpolateKeyframe(k0, k1, y, normalized)
    local y1 = k0[2][2] * 0.01
    local y2 = 1 - k1[1][2] * 0.01
    local t_ = 0
    local _t = 1
    local bezier4 = Utils.bezier4
    repeat
        local _t_ = (t_ + _t) * 0.5
        local _y_ = bezier4(_t_, 0, y1, y2, 1)
        if _y_ > y then
            _t = _t_
        else
            t_ = _t_
        end
    until _t - t_ < AEAdapter.EPSILON

    local t = (t_ + _t) * 0.5
    local x1 = k0[2][1] * 0.01
    local x2 = 1 - k1[1][1] * 0.01
    local x = bezier4(t, 0, x1, x2, 1)
    return normalized and x or AEAdapter._interpolateFrame(k0[4], k1[4], x)
end

function AEAdapter._interpolateFrame(f0, f1, t)
    local mix = Utils.mix
    if type(f0) == "number" then
        return mix(f0, f1, t)
    end

    local v = {}
    for i = 1, #f0 do
        v[i] = mix(f0[i], f1[i], t)
    end
    return v
end

---------- src/AE.lua ----------

local Src0 = {
    compDuration = 0.8,
    frameRate = 25,
    layer0 = {
        frameCount = 20,
        position = {
            x = {
                363.213191422601,
                363.153823618598,
                362.67914316804,
                361.196101397365,
                357.956302832473,
                352.39863125013,
                345.78041109725,
                348.979328604241,
                387.89694900929,
                453.590738379377,
                446.802983654209,
                355.411005029517,
                265.312092049525,
                306.105087954409,
                349.236575725952,
                373.963191422601,
                360.657929077528,
                356.577941185742,
                360.775277963487,
                363.713191422601
            },
            y = {
                376.080946639853,
                376.159318415763,
                376.791445819725,
                378.83319989871,
                383.710073887443,
                393.687950790519,
                413.100662076998,
                446.986974584789,
                479.816084250392,
                447.471778729371,
                361.1045878044,
                333.281297001702,
                338.411530475457,
                370.1083801249,
                389.862271031809,
                388.580946639853,
                381.129199388151,
                373.543447955266,
                375.780372568,
                376.580946639853
            }
        },
        anchor = {
            x = {
                0.624375,
                0.624375,
                0.624375,
                0.624375,
                0.624375,
                0.624375,
                0.624375,
                0.624375,
                0.624375,
                0.624375,
                0.624375,
                0.624375,
                0.624375,
                0.624375,
                0.624375,
                0.624375,
                0.624375,
                0.624375,
                0.624375,
                0.624375
            },
            y = {
                0.8325,
                0.8325,
                0.8325,
                0.8325,
                0.8325,
                0.8325,
                0.8325,
                0.8325,
                0.8325,
                0.8325,
                0.8325,
                0.8325,
                0.8325,
                0.8325,
                0.8325,
                0.8325,
                0.8325,
                0.8325,
                0.8325,
                0.8325
            }
        },
        scale = {
            x = {
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1
            },
            y = {
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1
            }
        },
        rotate = {
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        },
        opacity = {
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1
        },
        frameTime = {
            0,
            0.04,
            0.08,
            0.12,
            0.16,
            0.2,
            0.24,
            0.28,
            0.32,
            0.36,
            0.4,
            0.44,
            0.48,
            0.52,
            0.56,
            0.6,
            0.64,
            0.68,
            0.72,
            0.76
        }
    }
}

local Src1 = {
    compDuration = 0.8,
    frameRate = 25,
    layer0 = {
        frameCount = 20,
        position = {
            x = {
                363.213191422601,
                363.153823618598,
                362.67914316804,
                361.196101397365,
                357.956302832473,
                352.39863125013,
                345.78041109725,
                348.979328604241,
                387.89694900929,
                453.590738379377,
                446.802983654209,
                355.411005029517,
                265.312092049525,
                306.105087954409,
                349.236575725952,
                373.963191422601,
                360.657929077528,
                356.577941185742,
                360.775277963487,
                363.713191422601
            },
            y = {
                376.080946639853,
                376.159318415763,
                376.791445819725,
                378.83319989871,
                383.710073887443,
                393.687950790519,
                413.100662076998,
                446.986974584789,
                479.816084250391,
                447.471778729371,
                361.1045878044,
                333.281297001702,
                338.411530475457,
                370.1083801249,
                389.862271031809,
                388.580946639853,
                381.129199388151,
                373.543447955266,
                375.780372568,
                376.580946639853
            }
        },
        anchor = {
            x = {
                0.6225,
                0.6225,
                0.6225,
                0.6225,
                0.6225,
                0.6225,
                0.6225,
                0.6225,
                0.6225,
                0.6225,
                0.6225,
                0.6225,
                0.6225,
                0.6225,
                0.6225,
                0.6225,
                0.6225,
                0.6225,
                0.6225,
                0.6225
            },
            y = {
                0.83,
                0.83,
                0.83,
                0.83,
                0.83,
                0.83,
                0.83,
                0.83,
                0.83,
                0.83,
                0.83,
                0.83,
                0.83,
                0.83,
                0.83,
                0.83,
                0.83,
                0.83,
                0.83,
                0.83
            }
        },
        scale = {
            x = {
                -31,
                -31,
                -31,
                -31,
                -31,
                -31,
                -41.5,
                -50.1,
                -57.3,
                -63,
                -66,
                -92.7,
                -129.3,
                -167,
                -167,
                -167,
                -167,
                -167,
                -167,
                -167
            },
            y = {
                0,
                0,
                0,
                0.5,
                2,
                5.1,
                10.6,
                20.3,
                40,
                73.4,
                80,
                72.5,
                50.9,
                27,
                10.7,
                2.4,
                0,
                0,
                0,
                0
            }
        },
        rotate = {
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        },
        opacity = {
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1
        },
        frameTime = {
            0,
            0.04,
            0.08,
            0.12,
            0.16,
            0.2,
            0.24,
            0.28,
            0.32,
            0.36,
            0.4,
            0.44,
            0.48,
            0.52,
            0.56,
            0.6,
            0.64,
            0.68,
            0.72,
            0.76
        }
    }
}

local AE = {
    src0 = Src0,
    src1 = Src1
}
local FRAMES = 19
local DESIGN_W = 800
local DESIGN_H = 800

function SadGE:constructor()
end

function SadGE:onComponentAdded(sys, comp)
    if comp:isInstanceOf("Camera") and self.cameraComp == nil and comp.entity.name == "Camera_entity" then
        self.cameraComp = comp
    end
end

function SadGE:checkOnStart(sys, index, effect, key, uniform)
    local t = uniform.type
    if t == 1 then
        self.filterTex = sys.scene.assetMgr:SyncLoad("xshader/" .. uniform.data[1])
        self.mats[index]:setTex(uniform.name, self.filterTex)
    elseif t == 2 then
        self.mats[index]:setInt(uniform.name, uniform.data[1])
    elseif t == 3 then
        self.mats[index]:setFloat(uniform.name, uniform.data[1])
    elseif t == 4 then
        self.mats[index]:setVec2(uniform.name, Amaz.Vector2f(uniform.data[1], uniform.data[2]))
    elseif t == 5 then
        self.mats[index]:setVec3(uniform.name, Amaz.Vector3f(uniform.data[1], uniform.data[2], uniform.data[3]))
    elseif t >= 200 and t < 300 then
        self.mats[index]:setInt(uniform.name, GEProtocolList[t])
    elseif t == 1000 then
        if effect.passId ~= 1 then
            local rtFromPassName = effect.inputEffect[uniform.inputEffectIndex + 1]
            local prePass = self.geInfo.effect[rtFromPassName]
            local viewport = prePass.viewport
            printAmazing("viewport", viewport)
            if viewport == nil then
                viewport = {0, 0, 1, 1}
            end
            local texWidth = self.outputTex.width * viewport[3]
            local texHeight = self.outputTex.height * viewport[4]

            if prePass.passId ~= effect.passId - 1 then
                prePass.needRt = true
                prePass.rt = renderTexture(rtFromPassName .. "Exclusive", texWidth, texHeight)
            else
                if viewport[3] ~= 1 or viewport[4] ~= 1 then
                    prePass.needRt = true
                    prePass.rt = renderTexture(rtFromPassName .. "Viewport", texWidth, texHeight)
                end
            end
        else
            printAmazing("ERROR! passId == 1, but use tex 1000")
        end
    end
end

function SadGE:onStart(sys)
    self.duration = duration
    self.passCnt = 0

    local output_rt = sys.scene:getOutputRenderTexture()
    output_rt.attachment = Amaz.RenderTextureAttachment.NONE

    self.cmdBuf = Amaz.CommandBuffer()
    sys:addScriptListener(self.cameraComp, Amaz.CameraEvent.BEFORE_RENDER, "cameraCallBack", sys)

    GEProtocolList.init(sys)

    local geTable = file(sys, "generalEffect.json")
    self.geInfo = json.decode(geTable)

    -- local viewport = self.geInfo.effect[1].viewport
    self.outputTex = self.cameraComp.renderTexture
    -- if viewport == nil then
    --     viewport = {0, 0, 1, 1}
    -- end
    self.width = self.outputTex.width
    self.height = self.outputTex.height

    self.tmpTex1 = renderTexture("tmp", self.width, self.height)
    self.tmpTex2 = renderTexture("tmp2", self.width, self.height)

    self.mats = {}
    self.input = {}
    if isDebug == true then
        self.input[0] = sys.scene.assetMgr:SyncLoad("image/1.png")
        self.input[1] = sys.scene.assetMgr:SyncLoad("image/2.png")
    else
        local input1 = Amaz.BuiltinObject.getUserTexture("#TransitionInput0")
        local input2 = Amaz.BuiltinObject.getUserTexture("#TransitionInput1")
        self.input[0] = input1
        self.input[1] = input2
    end

    self.passCnt = #self.geInfo.effect
    for index, effect in ipairs(self.geInfo.effect) do
        self.geInfo.effect[effect.name] = effect
        effect.passId = index
        printAmazing("add", effect.name)
        local vert = file(sys, effect.vertexShader)
        local frag = file(sys, effect.fragmentShader)
        self.mats[index] = material(vert, frag, effect.name)
        self.mats[effect.name] = self.mats[index]

        for key, uniform in pairs(effect.vUniforms) do
            self:checkOnStart(sys, index, effect, key, uniform)
        end
        for key, uniform in pairs(effect.fUniforms) do
            self:checkOnStart(sys, index, effect, key, uniform)
        end
    end

    self.normMesh = createRectMesh2()
    self.model = Amaz.Matrix4x4f()
    self.model:setIdentity()

    self.ae = AEAdapter:new()
    self.ae:addFrames("src0", AE.src0)
    self.ae:addFrames("src1", AE.src1)
    local ax = self.ae:get("src0.position.x", 0) / DESIGN_W
    local ay = self.ae:get("src0.position.y", 0) / DESIGN_H
    self.mats["motion"]:setVec2("u_anchor", Amaz.Vector2f(ax, ay))
end

function SadGE:onUpdate(sys, deltaTime)
    GEProtocolList.update(deltaTime)
    local w = GEProtocolList[200]
    local h = GEProtocolList[201]
    local t = GEProtocolList[3007]
    local f = t * FRAMES

    self.mats["motion"]:setVec2("u_screen_size", Amaz.Vector2f(w, h))
    if f < 8 then
        local x = self.ae:get("src0.position.x", f) / DESIGN_W
        local y = self.ae:get("src0.position.y", f) / DESIGN_H
        Utils.log("x = %f", self.ae:get("src0.position.x", f))
        Utils.log("y = %f", self.ae:get("src0.position.y", f))
        self.mats["motion"]:setVec2("u_position", Amaz.Vector2f(x, y))
        self.mats["motion"]:setFloat("u_select", 0)
    else
        local x = self.ae:get("src1.position.x", f) / DESIGN_W
        local y = self.ae:get("src1.position.y", f) / DESIGN_H
        self.mats["motion"]:setVec2("u_position", Amaz.Vector2f(x, y))
        self.mats["motion"]:setFloat("u_select", 1)
    end

    local s = math.min(w, h) / 800
    self.mats["gs1t"]:setFloat("u_step_x", s / w)
    self.mats["gs1t"]:setFloat("u_step_y", s / h)
    self.mats["gs2t"]:setFloat("u_step_x", s / w)
    self.mats["gs2t"]:setFloat("u_step_y", s / h)
    self.mats["gs3t"]:setFloat("u_step_x", s / w)
    self.mats["gs3t"]:setFloat("u_step_y", s / h)
    self.mats["gs4t"]:setFloat("u_step_x", s / w)
    self.mats["gs4t"]:setFloat("u_step_y", s / h)
    self.mats["gs1n"]:setFloat("u_step_x", s / w)
    self.mats["gs1n"]:setFloat("u_step_y", s / h)

    local r = self.ae:get("src1.scale.x", f)
    r = math.rad(r)
    local a = w / h
    local x = math.cos(r) / a
    local y = math.sin(r)
    r = math.atan2(y, x)
    r = r / math.pi
    self.mats["gs1t"]:setFloat("u_direction", r + 0.5)
    self.mats["gs2t"]:setFloat("u_direction", r + 0.5)
    self.mats["gs3t"]:setFloat("u_direction", r + 0.5)
    self.mats["gs4t"]:setFloat("u_direction", r + 0.5)
    self.mats["gs1n"]:setFloat("u_direction", r)

    local b = self.ae:get("src1.scale.y", f) * 0.15
    self.mats["gs1t"]:setFloat("u_intensity", b)
    self.mats["gs2t"]:setFloat("u_intensity", b * 0.5)
    self.mats["gs3t"]:setFloat("u_intensity", b * 0.25)
    self.mats["gs4t"]:setFloat("u_intensity", b * 0.125)
    self.mats["gs1n"]:setFloat("u_intensity", b / 80 * 1.0)
end

function SadGE:checkOnCallback(sys, index, effect, key, uniform)
    local t = uniform.type

    if t == 2 then
        if GEProtocolList[uniform.name] ~= nil then
            self.mats[index]:setInt(uniform.name, GEProtocolList[uniform.name])
        end
    elseif t == 3 then
        if GEProtocolList[uniform.name] ~= nil then
            self.mats[index]:setFloat(uniform.name, GEProtocolList[uniform.name])
        end
    elseif t == 4 then
        if GEProtocolList[uniform.name] ~= nil then
            self.mats[index]:setVec2(
                uniform.name,
                Amaz.Vector2f(GEProtocolList[uniform.name][1], GEProtocolList[uniform.name][2])
            )
        end
    elseif t == 5 then
        if GEProtocolList[uniform.name] ~= nil then
            self.mats[index]:setVec2(
                uniform.name,
                Amaz.Vector3f(
                    GEProtocolList[uniform.name][1],
                    GEProtocolList[uniform.name][2],
                    GEProtocolList[uniform.name][3]
                )
            )
        end
    elseif t == 100 then
        local useInput = self.input[0]
        if considerTemplate == true and GEProtocolList[3007] > 0.5 then
            useInput = self.input[1]
        end
        self.mats[index]:setTex(uniform.name, useInput)
    elseif t == 103 then
        self.mats[index]:setTex(uniform.name, self.input[uniform.inputTextureIndex])
    elseif t == 1000 then
        local rtFromPassName = effect.inputEffect[uniform.inputEffectIndex + 1]
        local prevRt
        if self.geInfo.effect[rtFromPassName].needRt == nil then
            prevRt = tmp1 == true and self.tmpTex1 or self.tmpTex2
        else
            prevRt = self.geInfo.effect[rtFromPassName].rt
        end
        self.mats[index]:setTex(uniform.name, prevRt)
    elseif t == 3007 then
        self.mats[index]:setFloat(uniform.name, GEProtocolList[t])
    end
end

function SadGE:cameraCallBack(sys, camera, eventType)
    if eventType == Amaz.CameraEvent.BEFORE_RENDER then
        tmp1 = true
        local input1 = Amaz.BuiltinObject.getUserTexture("#TransitionInput0")
        local input2 = Amaz.BuiltinObject.getUserTexture("#TransitionInput1")

        if input1 and input2 then
            self.input[0] = input1
            self.input[1] = input2
        end

        for index, effect in ipairs(self.geInfo.effect) do
            for key, uniform in pairs(effect.vUniforms) do
                self:checkOnCallback(sys, index, effect, key, uniform)
            end
            for key, uniform in pairs(effect.fUniforms) do
                self:checkOnCallback(sys, index, effect, key, uniform)
            end

            if effect.passId == self.passCnt then
                passTmpRt = self.outputTex
            else
                passTmpRt = (effect.needRt == nil and (tmp1 == true and self.tmpTex2 or self.tmpTex1) or effect.rt)
            end

            if bufferInit == 0 then
                self.cmdBuf:setRenderTexture(passTmpRt)
                self.cmdBuf:clearRenderTexture(true, false, Amaz.Vector4f(0, 0, 0, 0), 0)
                self.cmdBuf:drawMesh(self.normMesh, self.model, self.mats[index], 0, 0, nil)
            end
            tmp1 = not tmp1
        end
        if bufferInit == 0 then
            bufferInit = 1
        end
        sys.scene:commitCommandBuffer(self.cmdBuf)
    end
end

exports.SadGE = SadGE
return exports
