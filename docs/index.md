# csgo_gc

csgo_gc is a local Game Coordinator implementation for legacy CS:GO. It redirects the game's GC traffic to an in-process replacement so features that depended on Valve's CS:GO GC can keep working without relying on a central service.

::: warning Project state
csgo_gc is incomplete and not ready for general use. Back up your game files and inventory data before experimenting with it.
:::

## What it restores

The current project supports a broad set of GC-backed features:

- Editable local inventory through `csgo_gc/inventory.txt`.
- Live inventory updates through an optional local Source RCON interface.
- Item equipping and loadout updates.
- Case, capsule, patch pack, graffiti box, music kit box, and souvenir package opening.
- Souvenir generation, stickers, patches, name tags, graffiti, music kits, StatTrak weapons, and StatTrak music kit MVP propagation.
- Storage Units, StatTrak swaps, trade-up contracts, and in-game store purchases.
- Functional lobbies, dedicated server support, and a server browser path for csgo_gc servers.
- Steam P2P-based networking between clients and servers.

## Where to go

If you want to play or test CS:GO with local GC functionality, start with the [User Guide](/user/).

If you want to build the project, study the protocol work, or contribute patches, start with the [Developer Guide](/developer/).

## What it does not do

csgo_gc does not implement matchmaking. Matchmaking requires a centralized service, which is outside the project's scope.
