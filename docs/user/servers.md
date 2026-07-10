# Servers and Lobbies

csgo_gc includes client and dedicated server support. It uses Steam's P2P interface for networking and implements enough GC behavior for lobbies, server browser visibility, SO cache forwarding, and selected gameplay-related item state.

## Lobbies

The current project reports functional lobbies. This does not mean matchmaking is implemented. Lobbies and matchmaking are separate concerns:

- Lobbies coordinate players.
- Matchmaking would require a centralized service and is not planned.

## Dedicated servers

Dedicated server support is included. Release packages may replace server launcher executables such as `srcds.exe` or platform equivalents, so back them up before installing.

## Server browser

By default, csgo_gc can filter the server browser to show only servers tagged for csgo_gc:

```text
"show_csgo_gc_servers_only" "1"
```

Disable this only if you intentionally want to see the broader legacy CS:GO server list.

## Item state on servers

The server GC path validates and forwards selected client SO cache messages. It also supports StatTrak music kit MVP count propagation by passing music kit MVP state from clients to the server path.

This is local-project behavior, not official Valve backend behavior.
