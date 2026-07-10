# Project Status

This page summarizes the current state reflected by the target project in `.vscode/references/csgo-gc`.

## Current focus

csgo_gc is currently a practical local GC replacement for legacy CS:GO rather than a complete clone of Valve's backend. The implemented surface is strongest around inventory, item customization, local control, lobbies, and dedicated server interoperability.

## Implemented

- Inventory loading and persistence through `csgo_gc/inventory.txt`.
- Live item creation and removal through Source RCON-compatible commands.
- Loadout and equipped item updates.
- Item use flows for cases, capsules, souvenir packages, graffiti, name tags, stickers, Storage Units, StatTrak swaps, and trade-up contracts.
- In-game store data and purchase finalization using `csgo_gc/price_sheet.txt`.
- Configurable account presentation data such as ranks, commendations, player level, VAC status flag, rarity weights, and logging.
- Client and server GC paths, including server welcome, client SO cache forwarding, server-side SO cache validation, and music kit MVP state propagation.
- Lobby and server browser support, with an option to show only servers tagged for csgo_gc.
- Windows, Linux, and macOS build targets.

## Known limits

- The project is still marked incomplete upstream.
- Edge-case inventory validation still needs polish.
- Live inventory editing tooling is planned, but the core project currently exposes RCON for scripts and external tools.
- Matchmaking is not planned.
- The project still wants a recent full CS:GO Item Schema.

## Safety expectations

Treat csgo_gc as experimental software. Prefer a separate CS:GO install or a restorable backup while testing. Keep RCON bound to localhost unless you have added your own network protections.
