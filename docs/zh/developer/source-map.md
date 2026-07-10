# 源码地图

在目标项目中导航时，可以把本页作为起点。

## 根目录

| 路径 | 用途 |
| --- | --- |
| `README.md` | 项目概览、功能状态、安装和构建说明。 |
| `CMakeLists.txt` | 顶层 CMake 项目、平台选择和依赖 `FetchContent`。 |
| `examples/` | 示例 `config.txt`、`inventory.txt`、`price_sheet.txt` 和 unusual loot lists。 |
| `docs/rcon.md` | 现有的详细 RCON 参考。 |
| `protobufs/` | CS:GO、Steam、GC system 和 econ protobuf 定义及生成源码。 |
| `steamworks/` | Steamworks SDK 头文件、库和 CMake 集成。 |
| `launcher/` | 游戏和专用服务器入口点的替换启动器目标。 |

## `csgo_gc/`

| 文件 | 用途 |
| --- | --- |
| `main.cpp` | 导出 `InstallGC(bool dedicated)`。 |
| `steam_hook.cpp` | Steam API 和 GC 消息拦截。 |
| `gc_client.cpp` / `gc_client.h` | 本地客户端 GC 行为和 RCON 命令处理。 |
| `gc_server.cpp` / `gc_server.h` | 本地服务器 GC 行为。 |
| `gc_message.cpp` / `gc_message.h` | GC 消息读写辅助。 |
| `gc_shared.cpp` / `gc_shared.h` | 共享 GC 事件处理和消息名称。 |
| `inventory.cpp` / `inventory.h` | 库存状态、物品创建、物品使用流程、仓库、汰换和持久化。 |
| `item_schema.cpp` / `item_schema.h` | 物品 schema 解析和物品元数据辅助。 |
| `case_opening.cpp` / `case_opening.h` | 开箱类物品选择。 |
| `souvenir.cpp` / `souvenir.h` | 纪念包生成。 |
| `graffiti.cpp` / `graffiti.h` | 涂鸦支持。 |
| `rcon_server.cpp` / `rcon_server.h` | Source RCON 兼容的本地控制服务器。 |
| `networking_client.cpp` / `networking_client.h` | 客户端侧项目网络。 |
| `networking_server.cpp` / `networking_server.h` | 服务器侧项目网络。 |
| `config.cpp` / `config.h` | `csgo_gc/config.txt` 解析和运行时配置访问。 |
| `keyvalue.cpp` / `keyvalue.h` | Valve KeyValues 解析和写入。 |
| `appid.cpp` / `appid.h` | App ID 覆盖和 Steam app 元数据处理。 |
| `platform_windows.cpp`、`platform_unix.cpp`、`platform.h` | 平台相关的进程、日志和文件系统行为。 |

## 运行时数据文件

| 文件 | 用途 |
| --- | --- |
| `csgo_gc/config.txt` | 运行时设置。 |
| `csgo_gc/inventory.txt` | 本地库存状态。 |
| `csgo_gc/price_sheet.txt` | 商店元数据和价格。 |
