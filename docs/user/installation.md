# Installation

::: danger
Because this program redirects the game's GC traffic locally through hooks, some antivirus software may falsely report it as malware such as ShellLoader or Trojan.

This project is fully free and open source. As long as you make sure your download source is [our GitHub Releases page](https://github.com/GT-610/csgo-gc/releases), the program is safe.

If you are unsure, you can inspect the codebase yourself, ask an AI whether the codebase is safe, or build it yourself.

**Do not** download this project from any other source.
:::

## Requirements

- A CS:GO legacy install from Steam.
- A csgo_gc release package for your platform.
- Permission to modify the game installation directory.

## Install CS:GO legacy

Install the legacy CS:GO app from the Steam store:

```text
steam://install/4465480
```

## Install csgo_gc

1. Download the latest csgo_gc release for your platform.
2. Open the CS:GO installation directory.
3. Back up the original launcher executables. Common examples include `csgo.exe`, `srcds.exe`, `csgo_linux64`, and similar platform-specific files.
4. Extract the release archive into the game directory.
5. Replace files when prompted.
6. Launch the game.

If CS:GO shows a VAC warning dialog, launch with:

```text
-steam
```

## macOS note

Release binaries are not notarized. macOS may block them until you explicitly allow them through the system security workflow.

## Files to expect

The installed package should include a `csgo_gc` directory beside the game files. The most important user-editable files are:

- `csgo_gc/config.txt`
- `csgo_gc/inventory.txt`
- `csgo_gc/price_sheet.txt`

Do not edit these files while assuming Valve's original GC will validate or repair them. csgo_gc is the authority for this local setup.
