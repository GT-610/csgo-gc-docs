# csgo_gc

csgo_gc is a local Game Coordinator implementation for legacy CS:GO. It redirects the game's GC traffic to an in-process replacement so features that depended on Valve's CS:GO GC can keep working without relying on a central service.

This documentation targets [GT610's fork](https://github.com/GT-610/csgo-gc). This fork has made substantial improvements over the original project. Since the original has not been updated for a long time and this fork is actively developed while remaining fully compatible with the original, this fork is recommended.

::: warning Project state
csgo_gc is under active development and is not ready for stable general use. Back up your game files before experimenting with it.
:::

## Implemented

The current project supports a broad set of GC-backed features:

- Static local inventory editing through `csgo_gc/inventory.txt`.
- Live inventory updates through an optional local Source RCON interface.
- Buy menu equipment updates.
- Opening cases, sticker capsules, patch packs, graffiti boxes, music kit boxes, and souvenir packages.
- Souvenir generation, stickers, patches, name tags, graffiti, music kits, weapon StatTrak, and music kit StatTrak MVP counts.
- Storage Units, StatTrak swaps, trade-up contracts, and in-game store purchases.
- Complete lobbies, dedicated server support, and a server browser path for csgo_gc servers.
- Steam P2P-based networking between clients and servers.

## Where to go

If you want to play or test CS:GO with local GC functionality, start with the [User Guide](/user/).

If you want to build the project, study the protocol work, or contribute patches, start with the [Developer Guide](/developer/).

## Not implemented

- Matchmaking. Matchmaking requires a centralized service. It may eventually be implemented by redirecting players to a specified server, but it is not a primary goal right now.
