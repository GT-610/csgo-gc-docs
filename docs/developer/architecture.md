# Architecture

csgo_gc redirects Steam Game Coordinator traffic into local C++ implementations that live inside the CS:GO process.

## High-level flow

```mermaid
flowchart LR
    Game["CS:GO process"] --> Hook["Steam hook"]
    Hook --> Client["ClientGC"]
    Hook --> Server["ServerGC"]
    Client --> Inventory["Inventory and item schema"]
    Client --> RCON["Local Source RCON"]
    Client --> Net["Steam P2P messages"]
    Server --> Net
```

## Steam hook

`steam_hook.cpp` intercepts the Steam API and Game Coordinator message flow. It decides whether a message should be handled locally, passed to the local ClientGC or ServerGC, or proxied to the original Steam interface.

The exported entry point is:

```cpp
InstallGC(bool dedicated)
```

This initializes the platform layer and installs the Steam hook.

## Final-client and upstream compatibility

The primary runtime target is the final September 2023 legacy CS:GO client. The hook preserves the `ISteamGameCoordinator` boundary and the shared CS:GO protobuf message formats. Current compatibility work covers client hello/welcome, SOCache version negotiation and refresh, class-specific loadout changes, default-item swaps, and the in-game store checkout flow.

Interoperability with the original upstream project is scoped to features both implementations support. Shared client/server messages should continue to work in either direction. Fork-only state is additive and should be ignored by an implementation that does not understand it, but this is not a guarantee of complete feature parity.

The store flow has several ordering requirements:

1. Purchase initialization validates all line items and reserves the single active transaction.
2. The Steam authorization callback is delayed until a later callback pass so the client has stored the transaction ID.
3. Finalization creates and publishes inventory SO objects before returning success. A partial creation failure rolls back unpublished items and clears the pending transaction.

## ClientGC

The ClientGC path handles most player-facing GC behavior:

- Client hello and welcome.
- Inventory cache subscription.
- Loadout and equipped item changes.
- Item use and customization flows.
- Store user data and purchase responses.
- RCON command execution.
- Client-side networking messages for lobbies and servers.

## ServerGC

The ServerGC path handles dedicated-server-facing GC behavior:

- Server hello and welcome.
- Client SO cache forwarding.
- SO cache validation and cleanup.
- Music kit MVP state forwarding.
- Selected kill count propagation.

## Inventory and schema

`inventory.cpp` owns local inventory state and persistence. It works together with `item_schema.cpp` to interpret defindexes, paint kits, stickers, rarity, quality, crate contents, trade-up candidates, and attribute encoding.

The inventory file path is:

```text
csgo_gc/inventory.txt
```

## RCON

`rcon_server.cpp` implements a Source RCON-compatible TCP listener. It does not implement raw newline commands. After Source RCON authentication, commands are routed into the active ClientGC instance.

## Networking

`networking_client.cpp`, `networking_server.cpp`, and `networking_shared.h` implement the project-specific Steam P2P message path used by csgo_gc clients and servers.
