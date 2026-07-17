# 纪念包

CSGO-GC 可以开启旧版 CS:GO 纪念包，并根据 Major 年代生成相应的赛事元数据和贴纸。物品定义和 GC 侧掉落表决定武器池；纪念包实例上的赛事属性决定纪念贴纸。

纪念包不需要额外的 loot-list 物品属性。掉落表属于 GC 数据，而不是物品实例属性。

## 使用 RCON 创建

使用纪念包 defindex，并在需要时提供对阵双方：

```powershell
rcon -a 127.0.0.1:37016 -p 1 "give_item 4013 tournament_team0=31 tournament_team1=1"
```

| 参数 | 属性编号 | 说明 |
| --- | ---: | --- |
| `tournament_event` | 137 | 赛事 ID，通常从包定义继承。 |
| `tournament_stage` | 138 | 可选的阶段 ID。 |
| `tournament_team0` | 139 | 第一支队伍 ID。 |
| `tournament_team1` | 140 | 第二支队伍 ID。 |
| `tournament_mvp` | 223 | 签名贴纸时代的 MVP Steam 账户 ID。 |

这些是赛事记录 ID，不是贴纸 kit defindex。CSGO-GC 会从 `items_game.txt` 中解析正确的贴纸变体。

## 不同年代的格式

| 年代 | 生成的贴纸 |
| --- | --- |
| DreamHack Winter 2013 | 赛事贴纸，无队伍元数据。 |
| Katowice/Cologne 2014 | 赛事贴纸和两张队伍 Foil 贴纸。 |
| DreamHack Winter 2014 | 赛事贴纸和两张队伍 Gold 贴纸。 |
| Katowice 2015 | 赛事 Gold 和两张队伍 Gold 贴纸。 |
| Cologne 2015–Berlin 2019 | 赛事 Gold、两张队伍 Gold 和 MVP Gold 签名。 |
| Stockholm 2021–Paris 2023 | 赛事 Gold、两张队伍 Gold 和地图 Gold 贴纸。 |

2015–2019 年代需要提供 `tournament_mvp`：

```powershell
rcon -a 127.0.0.1:37016 -p 1 "give_item 4132 tournament_team0=46 tournament_team1=1 tournament_mvp=64640068"
```

Stockholm 2021 及之后，第四张贴纸从包定义中的地图自动推导，不要提供 `tournament_mvp`：

```powershell
rcon -a 127.0.0.1:37016 -p 1 "give_item 4810 tournament_team0=12 tournament_team1=59"
```

## 手动编辑库存

```text
"attributes"
{
    "137" "7"
    "139" "46"
    "140" "1"
    "223" "64640068"
}
```

创建后可以检查并保存：

```powershell
rcon -a 127.0.0.1:37016 -p 1 "item_info <item-id>"
rcon -a 127.0.0.1:37016 -p 1 save_inventory
```

GC 会解析贴纸 kit，但不会验证所选队伍和 MVP 是否真的参加过同一场比赛。