# RCON

csgo_gc 为本地 ClientGC 暴露了一个可选的 Source RCON 兼容控制端口。它面向脚本、调试、GUI 库存编辑器和快速实时库存测试。

RCON 默认关闭。

## 启用 RCON

在 `csgo_gc/config.txt` 中添加或修改 `rcon` 块：

```text
"rcon"
{
    "enabled"      "1"
    "bind_address" "127.0.0.1"
    "port"         "37016"
    "password"     ""
}
```

修改后请重启游戏。

## 安全

请让 RCON 保持在 `127.0.0.1`，除非你已经添加自己的网络保护。RCON 可以修改本地库存状态。

如果配置中的密码为空，出于 Source RCON 客户端兼容性考虑，任何传入密码都会通过认证。

## 协议

监听器使用 Source RCON 二进制协议：

- 小端、带长度前缀的数据包。
- 使用 `SERVERDATA_AUTH` 认证。
- 使用 `SERVERDATA_EXECCOMMAND` 执行命令。
- 使用 `SERVERDATA_RESPONSE_VALUE` 和 `SERVERDATA_AUTH_RESPONSE` 返回响应。

不支持原始换行文本模式。

## 基本检查

```powershell
Test-NetConnection 127.0.0.1 -Port 37016
```

使用 Source RCON 客户端：

```powershell
rcon -a 127.0.0.1:37016 -p 1 ping
```

预期响应：

```text
OK pong
```

## 响应格式

响应是 Source RCON 响应包中的纯文本：

```text
OK <message>
ERR <message>
```

## 命令

| 命令 | 用途 |
| --- | --- |
| `help` | 列出可用命令。 |
| `ping` | 返回 `OK pong`。 |
| `status` | 显示 RCON 和 ClientGC 状态。 |
| `clients` | 列出可控制的本地 ClientGC。 |
| `give_item` | 创建库存物品并发送实时创建更新。 |
| `remove_item` | 移除物品并发送实时销毁更新。 |
| `refresh_inventory` | 重新发送完整库存缓存订阅。 |

## 创建物品

```text
give_item <defindex> [count] [key=value...]
```

示例：

```text
give_item 7
give_item 7 5
give_item 7 paint=44
give_item 7 paint=44 wear=0.12 seed=123 stattrak=5
give_item 7 paint=44 name="RCON Test"
give_item 1314 music=3 stattrak=10
give_item 7 paint=44 sticker0=12 sticker0_wear=0
```

支持的参数包括：

| 参数 | 说明 |
| --- | --- |
| `level` | 覆盖物品等级。 |
| `quality` | 覆盖物品品质。 |
| `rarity` | 覆盖物品稀有度。 |
| `name` | 自定义物品名称。包含空格时请加引号。 |
| `paint` | 涂装模板 defindex。 |
| `seed` | 涂装种子。 |
| `wear` | `0.0` 到 `1.0` 的磨损值。 |
| `stattrak` | 击杀计数。`stattrak=1` 会创建 0 击杀的 StatTrak。 |
| `music` | 音乐定义 ID。需要音乐盒 defindex `1314`。 |
| `spray_color` | 涂鸦颜色 ID。 |
| `spray_remaining` | 剩余涂鸦使用次数。 |
| `sticker0` 到 `sticker5` | 贴纸 kit defindex。 |
| `stickerN_wear` | `0.0` 到 `1.0` 的贴纸磨损。 |
| `stickerN_scale` | 贴纸缩放。 |
| `stickerN_rotation` | 贴纸旋转。 |

`count` 可选，范围必须是 `1` 到 `100`。

## 移除物品

```text
remove_item <itemid>
```

## 常见错误

```text
ERR no client gc
ERR unknown defindex
ERR unknown paint
ERR unknown music
ERR unknown sticker
ERR item not found
ERR usage: give_item <defindex> [count] [key=value...]
ERR invalid parameter wear
```

`ERR no client gc` 表示监听器正在运行，但本地 ClientGC 尚未注册，或已经关闭。

## GUI 编辑

目前支持 RCON 编辑的 GUI 编辑器有：
- [GT-610/csgo-gc-inventory-editor](https://github.com/GT-610/csgo-gc-inventory-editor)