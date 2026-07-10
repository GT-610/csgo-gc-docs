# 安装

::: danger
由于本程序通过钩子函数将游戏的 GC 流量重定向到本地，某些杀毒软件（例如火绒）会误报为 ShellLoader 或 Trojan 一类的恶意程序。

本项目完全自由且开源，只要你确保你的下载来源是 [我们的 GitHub Release 页面](https://github.com/GT-610/csgo-gc/releases)，程序是绝对安全的。

如果你不放心，你也可以自行检索代码库，或者向 AI 询问代码库是否安全，或者自行编译。

**一定不要**从其他任何来源下载本项目！

:::

## 要求

- 从 Steam 安装旧版 CS:GO。
- 下载适合你平台的 csgo_gc 发布包。
- 拥有修改游戏安装目录的权限。

## 安装旧版 CS:GO

通过 Steam 商店安装旧版 CS:GO 应用：

```text
steam://install/4465480
```

## 安装 csgo_gc

1. 下载适合你平台的最新 csgo_gc 发布包。
2. 打开 CS:GO 安装目录。
3. 备份原始启动器可执行文件。常见例子包括 `csgo.exe`、`srcds.exe`、`csgo_linux64` 以及类似的平台文件。
4. 将发布包解压到游戏目录。
5. 按提示替换文件。
6. 启动游戏。

如果 CS:GO 显示 VAC 警告对话框，请使用以下启动参数：

```text
-steam
```

## macOS 说明

发布二进制文件没有经过 notarization。macOS 可能会阻止运行，需要你通过系统安全流程手动允许。

## 安装后常见文件

安装后的包应在游戏文件旁包含 `csgo_gc` 目录。最重要的用户可编辑文件是：

- `csgo_gc/config.txt`
- `csgo_gc/inventory.txt`
- `csgo_gc/price_sheet.txt`

不要假设 Valve 原始 GC 会验证或修复这些文件。在本地设置中，csgo_gc 才是这些数据的权威来源。
