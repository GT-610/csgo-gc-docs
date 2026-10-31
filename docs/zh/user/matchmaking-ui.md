# 匹配界面

本页说明如何让旧版客户端显示官方的“匹配”界面，以及界面出现之后哪些能用、哪些不能用。

**匹配本身不可用。** 这些界面用于观察客户端发出的请求，并不能用来找到一局游戏。启用之前请先读[它不能做什么](#它不能做什么)。

## 界面为什么消失了

Panorama 前端打包在同一个文件里：

```text
csgo/panorama/code.pbin
```

它虽然叫 pbin，但不是普通的 ZIP：文件开头是 `PAN` 魔数和 512 字节的 RSA-4096 签名，之后才是存储式 ZIP，签名覆盖其后的全部内容。客户端在加载任何一个前端文件之前都会校验签名。没有 Valve 的私钥就无法重新生成签名，因此重打包的前端会被拒绝，游戏会提示：

```text
Resource panorama/code.pbin has invalid data.
```

匹配功能的实现从未从包中移除，只是入口被停用了：Play 菜单下拉框里的“Official Matchmaking”选项被替换成了空白，而它背后的布局、样式和脚本仍然随包发布。所以恢复一行内容就足以让界面回来。

## 启用方法

需要两件事：一个恢复了入口的包，以及允许客户端加载签名不匹配的包。

### 1. 允许未签名的包

在 `csgo_gc/config.txt` 中：

```vdf
"allow_unsigned_panorama" "1"
```

该选项默认关闭，且只对客户端有影响：专用服务器不会加载 Panorama。

启用后，CSGO-GC 会在内存中修改已加载的 `panorama` 模块，使完整性校验接受该包。磁盘上不会修改任何内容，改动只存在于游戏进程运行期间。如果模块的代码布局不是本功能所依据的那一种，则不会做任何修改，而是向日志写入一行：

```text
Panorama: code.pbin check left untouched (unsupported build)
```

### 2. 提供恢复了入口的包

先备份原文件：

```text
csgo/panorama/code.pbin  ->  csgo/panorama/code.pbin.stock.bak
```

然后替换 `csgo/panorama/code.pbin`，使用一个在 `panorama/layout/mainmenu_play.xml` 中恢复了下述行的重打包副本：

```xml
<Label text="#play_setting_online" id="Play-official" data-type="official" value="1"/>
```

重打包的文件保留原始的文件头和尾部，只有 ZIP 载荷发生变化。由于签名不再匹配，需要第 1 步才能让客户端接受它。

> [!NOTE]
> CSGO-GC 不附带这个包。它包含 Valve 的前端资源，获取和重打包需要由你自行完成。

## 预期效果

两步都完成后，Play 菜单下拉框中会在离线、训练、创意工坊和社区之外列出 **Official Matchmaking**，并且匹配界面可以打开。

控制台和 `gc_log.txt` 会说明补丁是否生效：

| 消息 | 含义 |
| --- | --- |
| `Panorama: relaxed code.pbin signature check` | 补丁已生效，包会被接受。 |
| `Panorama: code.pbin check left untouched (unsupported build)` | 未识别该模块布局，没有做任何修改。 |

如果仍然提示 `Resource panorama/code.pbin has invalid data.`，说明补丁没有生效。请确认 `allow_unsigned_panorama` 已开启、客户端已完全重启，并且日志中出现的是上表中的第一条消息。

## 它不能做什么

排队匹配不可用。寻找对局需要一个把玩家分配到服务器的中央匹配服务，而旧版客户端没有这样的服务。可以预期的情况是：能进入搜索界面，然后停在那里。

具体来说，以下功能不可用：

- 搜索并加入官方对局；
- 匹配冷却、段位与资格检查；
- 接受对局并预留服务器。

大厅、服务器浏览器以及在专用服务器上游玩不受影响，也不需要开启该选项。这些内容见[服务器和大厅](/zh/user/servers)。

## 关闭方法

把 `allow_unsigned_panorama` 改回 `0`，并还原备份：

```text
csgo/panorama/code.pbin.stock.bak  ->  csgo/panorama/code.pbin
```

在关闭该选项的情况下保留经过修改的包不会造成问题：客户端会像以前一样拒绝它。
