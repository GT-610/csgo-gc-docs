# 库存

csgo_gc 将本地库存存储在 `csgo_gc/inventory.txt`

该文件使用 Valve 风格的 KeyValues。它很强大，但手动编辑时也很容易写坏。编辑前请保留备份。

::: tip
推荐使用 GUI 编辑器编辑库存。可用的 GUI 编辑器请查阅 [mikkokko/csgo_gc Issue #82](https://github.com/mikkokko/csgo_gc/issues/82)。
:::

## 当前库存支持

当前实现支持：

- 武器、刀、饰品、贴纸、补丁、涂鸦、音乐盒和仓库单元。
- 已装备状态和更新。
- 涂装模板、涂装种子、磨损、稀有度、品质、物品等级和自定义名称。
- 武器和音乐盒 StatTrak 计数。
- 库存存储组件存入和取出流程。
- 汰换合同输入和生成结果。

## 离线编辑

离线编辑是指在游戏关闭时修改 `inventory.txt`，然后重启 CS:GO。对于大型手动修改，这仍然是最便捷的方式。

基本结构如下：

```text
"items"
{
    "2"
    {
        "inventory" "1"
        "def_index" "507"
        "level"     "1"
        "quality"   "99"
        "rarity"    "6"
        "attributes"
        {
            "6" "38.000000"
            "7" "41.000000"
            "8" "0.000001"
        }
    }
}
```

`default_equips` 保存按角色和槽位划分的默认负载选择。

## 库存格式检查
![GC 启动时的检查日志示例](../../user/images/item-check.png)

GC 启动时会检查库存格式，并在控制台报告问题。这些问题并不影响您游玩和使用，但仍然建议您根据日志调整。

## 实时编辑

如果需要在游戏运行时修改，请使用本地 RCON 接口。它可以在游戏开启时创建和移除物品，并向游戏发送实时 GC 更新。

工具、脚本和快速测试适合使用 RCON。

目前支持 RCON 编辑的 GUI 编辑器有：
- [GT-610/csgo-gc-inventory-editor](https://github.com/GT-610/csgo-gc-inventory-editor)

## 商店价格和购买控件

游戏内商店读取：

```text
csgo_gc/price_sheet.txt
```

示例价格表包含本地 GC 响应所需的商店布局、商品链接、价格、折扣价格和商店元数据。

游戏内商店读取运行时文件 `csgo_gc/price_sheet.txt`；价格由本地 GC 下发，修改文件后请重启游戏。

如果价目表中缺少某一项钥匙条目，Panorama 可能在发送购买请求前直接隐藏购买栏。这是价目表数据问题，不是库存或开箱协议问题，如遇某一项因为缺少价格数据无法购买，请[报告 Issue](https://github.com/GT-610/csgo-gc/issues/new)。

示例文件来自 2023 年 5 月 5 日的公开多币种快照。其中包含变革武器箱、Anubis 和 Paris 2023 等后期 CS:GO 商店条目，但不是 2023 年 9 月 27 日 CS:GO 下架前的 Valve 的原始转储。