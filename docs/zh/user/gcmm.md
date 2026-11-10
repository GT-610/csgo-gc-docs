# GC Matchmaking（GCMM）

GC Matchmaking（GCMM）通过外部协调器，把真实的旧版 CS:GO 客户端连接到已配置的专用服务器。协议标识为 `gcmm/1`。协调使用已认证 Source RCON，游戏继续负责原生 ACCEPT 确认框、准备检查和自动连接。

::: warning 验证范围
产品化 GCMM API 和 Python 参考协调器已于 2026 年 11 月 10 日在 build 1575 上用一个真实账号重新验证：用户点击 ACCEPT 后，客户端自动进入 `de_dust2`。十个真实客户端和生产环境分布式匹配尚未验收。多客户端模拟验证协调器规则，不能作为十名真实玩家的结果。单账号冒烟验证应显式使用 `--players 1 --once`。
:::

## 所需组件

- 每位真实参与者使用已加载 `csgo_gc` 并启用 GCMM 的旧版 CS:GO 客户端。
- 已加载 `csgo_gc`、启用 GCMM，且地图和模式已经配置好的专用服务器。
- Python 3.10+，用于运行主仓库 `examples/gcmm/coordinator.py` 中的标准库参考协调器。
- 一个服务器 GC RCON 端点，以及每个客户端各自的 GC RCON 端点。这些端口与游戏服务器的 UDP 端口不同。

参考协调器默认等待**十个不同的真实搜索账号**。首版参考实现只支持每个 party 请求恰好包含本地一个账号；多人 party 会收到明确错误。每位参与者在自己的游戏中开始竞技搜索。协调器从原生搜索状态发现账号，不会用占位账号凑齐名单。

原生服务器适配器目前只支持经验证的 Windows x86 build 1575 引擎；不支持的二进制会在原生变更前发现失败。协调器不需要 `mm_probe`、日志解析、Npcap、进程内存读取、Bun 或 PowerShell 辅助脚本。

## 启用 GCMM 和 RCON

在每个客户端及专用服务器的 `csgo_gc/config.txt` 中加入：

```vdf
"gcmm"
{
    "enabled" "1"
}
```

GCMM 默认关闭，与 RCON 独立。还需单独启用并配置 RCON：

```vdf
"rcon"
{
    "enabled"      "1"
    "bind_address" "127.0.0.1"
    "port"         "37016"
    "password"     "replace-with-a-unique-password"
}
```

服务器应使用不同的 RCON 端口，例如 `37015`。修改配置后重启对应进程。端点与协调器在同一台机器时可以使用回环地址；远程参与者需要提供受信网络中可达的端点。Source RCON 认证命令，但不加密传输。

游戏地址（如 `203.0.113.121:27016`）必须对所有玩家可达。设置 GC RCON 地址不会改变原生游戏服务器地址。周边设置见[配置](/zh/user/configuration)、[RCON](/zh/user/rcon)和[服务器安装](/zh/user/server_installation)。

## 运行单账号冒烟验证

从主仓库根目录运行，先通过环境变量提供密码。PowerShell 7 示例：

```powershell
$env:GCMM_SERVER_PASSWORD = Read-Host 'Server RCON password' -MaskInput
$env:GCMM_CLIENT_PASSWORD = Read-Host 'Client RCON password' -MaskInput
python examples/gcmm/coordinator.py `
  --server 127.0.0.1:37015 `
  --client 127.0.0.1:37016 `
  --game-address 203.0.113.121:27016 `
  --map de_dust2 `
  --players 1 `
  --once
```

请替换成实际地址和地图。密码值不出现在命令参数中；默认环境变量名为 `GCMM_SERVER_PASSWORD` 和 `GCMM_CLIENT_PASSWORD`。

1. 启动已配置的专用服务器和客户端。服务器发现应报告 `enabled:true` 和 `initialized:true`。
2. 启动协调器，再在游戏中开始竞技搜索。协调器看到原生搜索状态后才建立预约。
3. 出现原生 ACCEPT 按钮后由玩家点击。协调器等待服务器真实名单达到阶段 2。
4. 等待原生客户端自动连接。使用 `--once` 时，协调器确认 committed 状态后退出；它不会在客户端仍需要连接时释放成功预约。

默认提供的 game type 为 `4104`。原生请求的完整值可以不同：实测 `462552584` 的低四位同样为 `8`，因此属于竞技模式。参考实现检查支持的低位模式，不要求完整请求值等于 `4104`。

## 协调十个真实参与者

重复提供十个可达的 `--client host:port`，并省略 `--players 1`。不需要填写账号列表，身份来自各客户端的原生 `gcmm_status`。十个人都必须开始搜索、收到原生弹窗，并亲自点击 ACCEPT。

`--client-password-env NAME` 只提供一次时，所有客户端使用同一个环境变量；按每个 `--client` 的顺序重复提供时，可以分别使用不同密码。`--server-password-env NAME` 可修改服务器密码变量名。

协调器先预约原生服务器，核对实际所有者和完整真实名单，再并发准备所有客户端。任何准备失败后，必须先等待每个准备 future 完成，再清理所有者。它会检查相同的服务器 request ID、cookie、match ID、完整真实名单、严格成功结果和活动预约；commit 前会立即重新校验所有者及每个客户端。发生部分 commit 时，会在释放服务器前清理已提交和未提交的客户端预约。

取消、过期状态、超时或部分失败时，协调器只取消本次尝试的搜索所有者，只释放自己拥有的服务器 cookie/match。它会等待异步释放结果；端点不可达时报告 `cleanup incomplete`。Ctrl+C 也会执行清理。使用 `--once` 成功完成时，会在客户端连接期间保留原生预约。不使用 `--once` 时，成功后会等待服务器可用及下一组 cohort；参考实现不管理整场比赛或比赛结束生命周期。

## 时序和排查

完整选项见 `python examples/gcmm/coordinator.py --help`。

| 选项 | 默认值 | 用途 |
| --- | --- | --- |
| `--players` | `10` | 所需的不同真实搜索账号数量。 |
| `--rpc-timeout` | `4` 秒 | 一次已认证 RCON 操作的总期限。 |
| `--prepare-timeout` | `12` 秒 | 限制原生预约激活及并发客户端准备的时间。 |
| `--accept-timeout` | `90` 秒 | 等待真实点击的协调器上限；原生预约可能更早到期。 |
| `--search-timeout` | `0` | 无限等待凑齐搜索；正数可限制等待时间。 |
| `--poll-interval` | `0.25` 秒 | 状态轮询间隔。 |

并发准备避免把十条较慢的客户端命令串行塞进原生预约约 21 秒的初始窗口。协调器不会把超时当作接受，也不会自动重放已经超时的变更请求。

| 观测现象 | 检查方向 |
| --- | --- |
| `enabled:false` | 独立启用 GCMM 后重启，不能只打开 RCON。 |
| `initialized:false` | 阅读服务器发现错误；适配器必须识别支持的原生引擎。 |
| 等待参与者 | 确认足够多的不同真实客户端正在搜索，默认数量是十个。 |
| party 或模式错误 | 参考实现需要单账号 party 的竞技请求。 |
| 搜索或预约过期 | 取消、新搜索或其他服务器所有者已取代本次事务。 |
| 没有 ACCEPT 弹窗 | 核对匹配的原生服务器预约及所有阶段 1 参与者，检查 GCMM 状态。 |
| `cleanup incomplete` | 再次协调前检查对应端点的状态和连接。 |

## 状态和命令参考

已认证客户端端点提供 `gcmm_status`、`gcmm_reserve`、`gcmm_commit` 和 `gcmm_cancel`。服务器端点提供 `gcmm_status`、`gcmm_reserve` 和 `gcmm_release`。各角色的参数见[开发者协议](/zh/developer/gcmm-protocol)。

客户端阶段为 `idle`、`searching`、`reserved` 和 `committed`。每次有效的新原生 9101 搜索都会创建新的进程内 `search_id`。普通原生 9102 清理提交前状态；提交后的普通连接交接会保留持有比赛。**明确的原生放弃（`9102.abandon != 0`）会清除它**；所有者匹配的 `gcmm_cancel`、成功的诊断 `mm_abandon` 及新搜索也会清除。普通 Hello 刷新保留已有 committed 比赛，不会恢复已经清除的比赛。

成功命令返回 `OK ` 加 JSON，包含 `protocol:"gcmm/1"` 和端点的 `role`。错误为 `ERR <stable_code> <message>`。JSON 中 uint64 标识使用字符串：搜索/request ID 为十进制，cookie/match ID 为十六进制，账号 ID 为 uint32 数字。未知键、重复键、溢出、过期所有者及冲突替换会被拒绝。

诊断 `mm_*` 命令和旧 MM/1 设计说明不属于稳定 GCMM profile。单独恢复[匹配界面](/zh/user/matchmaking-ui)，不会启动协调器或建立原生服务器预约。
