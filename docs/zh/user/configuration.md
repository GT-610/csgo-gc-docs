# 配置

csgo_gc 从以下文件读取配置：

```text
csgo_gc/config.txt
```

该文件会在 GC 加载时解析。配置不支持热重载，修改后请重启游戏。

## 账号展示

`ranks` 块控制可见的段位和胜场数据：

```text
"ranks"
{
    "competitive_rank" "18"
    "competitive_wins" "666"
    "wingman_rank"     "18"
    "wingman_wins"     "777"
    "dangerzone_rank"  "15"
    "dangerzone_wins"  "888"
}
```

其他账号展示选项包括：

| 选项 | 用途 |
| --- | --- |
| `vac_banned` | 控制本地 GC 展示的 VAC 状态标记。 |
| `cmd_friendly` | 友善称赞数量。 |
| `cmd_teaching` | 教导称赞数量。 |
| `cmd_leader` | 指挥称赞数量。 |
| `player_level` | 资料等级。 |
| `player_cur_xp` | 当前资料 XP。 |

## 物品行为

`destroy_used_items` 控制消耗品使用后是否被移除：

```text
"destroy_used_items" "1"
```

`rarity_weights` 块控制开箱类流程中的加权选择。示例配置使用类似 Valve 的权重。

## Steam 和服务器浏览器

`appid_override` 控制游戏使用的 app ID。默认值为 `4465480`，也就是旧版 CS:GO 的 app ID。

```text
"appid_override" "4465480"
```

`show_csgo_gc_servers_only` 控制服务器浏览器过滤：

```text
"show_csgo_gc_servers_only" "1"
```

启用后，服务器浏览器默认只显示带有 csgo_gc 标记的服务器。

## RCON

RCON 默认关闭：

```text
"rcon"
{
    "enabled"      "0"
    "bind_address" "127.0.0.1"
    "port"         "37016"
    "password"     ""
}
```

除非你理解安全影响，否则请保持 `bind_address` 为 `127.0.0.1`。如果配置中的密码为空，任何传入的 Source RCON 密码都会被接受。

## 日志

`log_output` 控制诊断输出：

| 值 | 行为 |
| --- | --- |
| `0` | 不输出日志。 |
| `1` | 输出到游戏内控制台。 |
| `2` | 输出到游戏内控制台和 `gc_log.txt`。 |
