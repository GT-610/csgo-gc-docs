# Server Installation

::: danger
Because this program redirects the game's GC traffic locally through hooks, some antivirus software may falsely report it as malware such as ShellLoader or Trojan.

This project is fully free and open source. As long as you make sure your download source is [our GitHub Releases page](https://github.com/GT-610/csgo-gc/releases), we guarantee that the program is safe.

If you are unsure, you can inspect the codebase yourself, ask an AI whether the codebase is safe, or build it yourself.

**Do not** download this project from any other source.
:::

## Requirements

- Permission to modify the game server installation directory.

## Deploy a CS:GO Dedicated Server

First deploy a working Dedicated Server. There are many existing tutorials, so this documentation does not cover the initial server deployment in detail.

## Install csgo_gc

1. [Download](https://github.com/GT-610/csgo-gc/releases) the latest release package for your platform.
2. Open the server installation directory.
3. Back up the original launcher executable, such as `srcds.exe` or `srcds_linux64`.
4. Extract the `csgo_gc` folder and the matching launcher executable from the release package into the server directory.
5. Replace files when prompted.
6. Launch the server normally.

If everything is working, the console will show log output containing `[GC]`. Clients with csgo_gc installed will be able to see their inventory when connecting to this server.

## macOS note

macOS may block the program with a permission prompt. Allow it through the system security workflow.