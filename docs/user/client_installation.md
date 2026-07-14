# Client Installation

::: danger
Because this program redirects the game's GC traffic locally through hooks, some antivirus software may falsely report it as malware such as ShellLoader or Trojan.

This project is fully free and open source. As long as you make sure your download source is [our GitHub Releases page](https://github.com/GT-610/csgo-gc/releases), we guarantee that the program is safe.

If you are unsure, you can inspect the codebase yourself, ask an AI whether the codebase is safe, or build it yourself.

**Do not** download this project from any other source.
:::

## Requirements

- Permission to modify the game installation directory.

## Install legacy CS:GO

Install the legacy CS:GO app from the Steam store. You can search for it directly in the Steam store, or open [this store page](https://store.steampowered.com/app/4465480/CounterStrikeGlobal_Offensive/).

## Install csgo_gc

1. [Download](https://github.com/GT-610/csgo-gc/releases) the latest release package for your platform.
2. Open the CS:GO installation directory: Library - right-click Counter-Strike: Global Offensive - Manage - Browse local files.
3. Back up the original launcher executables, such as `csgo.exe` or `csgo_linux64`.
4. Extract the `csgo_gc` folder and the matching launcher executables from the release package into the game directory.
5. Replace files when prompted.
6. Launch the game normally. If the game shows a "VAC insecure" dialog, add the `-steam` launch option.

![Directory structure](images/dir-tree.png)

If everything is working, the console will show green log output containing `[GC]`. You should be able to enter a lobby and open the inventory page, where you will also see a "Karambit - Fade" item.

## macOS note

macOS may block the program with a permission prompt. Allow it through the system security workflow.

## Next steps

Read [Configuration](/user/configuration) to learn how to add and manage inventory items.