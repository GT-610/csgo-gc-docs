# Servers and Lobbies

CSGO-GC uses Steam's P2P interface for networking and implements enough GC behavior to support lobbies, server browser visibility, SO cache forwarding, and selected gameplay-related item state.

In Source engine games, local play means the **game automatically starts a local server and connects to it**. Local play therefore behaves like joining a remote server, and the loading process counts as a server connection too.

## Matchmaking

Matchmaking is not done by the GC. It needs an independent central server and its own coordination mechanism. In theory, the GC could redirect matchmaking traffic and return a fixed server, but that is complex and not currently planned.

We may revisit this later. One possible end state is a free, open-source matchmaking center that communities self-host, with players choosing which matchmaking server to connect to.

## Item state on servers

The ServerGC path validates and forwards selected client SO cache messages. The client's own inventory is the authoritative copy of its music kit, so the server tracks the equipped StatTrak music kit counter from those messages and publishes it in the round MVP event. Clients also send their state directly, which keeps both ends agreeing on the count. This is local-project behavior, not official Valve backend behavior.

Music kit StatTrak is gated on a competitive ruleset by default, matching the only scope the official backend ever supported. The gate applies on both sides: the client only advances the counter and only publishes a count in those modes, and the server only injects the count into round MVP events in those modes. See [Configuration](/user/configuration) if you want it in every mode instead.

When you connect to a server and watch the console, you may see logs such as `Sending socache`. That is the GC sending your inventory to the server over Steam P2P.

Inventory sometimes still fails to appear after joining a GC-compatible server. The most common causes are a failed inventory send (no `Sending socache` log at all) or a send that came too late, after the server status logs. These usually point to a network obstacle between you and the target server. If you connect to a friend's server through Steam P2P, or if every player has a poor NAT type such as NAT4, consider a virtual LAN tool or VPN.