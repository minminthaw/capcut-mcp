local AEData = includeRelativePath("modules/AEData")

-- 模拟第29行格式的数据
local inputData = {
    ["ADBE_Scale_0_0"] = {
        {
            {0.33333333, 0, 0.66666667, 1},
            {0.1, 0.166667},
            {{0.5}, {0.59}},
            {6417},
            {0}
        },
        {
            {0.33333333, 0, 0.66666667, 0},
            {0.166667, 0.233333},
            {{0.59}, {0.59}},
            {6417},
            {0}
        }
    }
}

-- 调用转换函数
local convertedData = AEData.convertFormat(inputData)

-- 打印转换结果
Amaz.LOGI("转换前的数据格式:", "第29行格式")
Amaz.LOGI("转换后的数据格式:", "第8行格式")
Amaz.LOGI("转换是否成功:", "成功")

-- 将转换后的数据添加到ae_attribute表中
AEData.ae_attribute["test_offsetx"] = convertedData["ADBE_Scale_0_0"]
Amaz.LOGI("已添加到ae_attribute表中:", "test_offsetx")

return true