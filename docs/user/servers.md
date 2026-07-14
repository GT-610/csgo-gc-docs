# Servers and Lobbies

CSGO-GC uses Steam's P2P interface for networking and implements enough GC behavior to support lobbies, server browser visibility, SO cache forwarding, and selected gameplay-related item state.

In Source engine games, local play essentially means that the **game automatically starts a local server and connects to it**. As a result, the related behavior is the same as connecting to a remote server. The loading process during local play is also treated as a server connection.

## Matchmaking

Matchmaking is not performed by the GC. It requires an independent central server and coordination mechanism. In theory, the GC could redirect matchmaking traffic and return a specified server by default, but this is complex and is not currently part of the GC implementation plan.

We may consider this in the future. A possible final design would first provide a free and open-source matchmaking center for the community to self-host, allowing players to choose which matchmaking server to use and where to play.

## Item state on servers

The ServerGC path validates and forwards selected client SO cache messages. It also supports StatTrak music kit MVP count propagation by passing music kit MVP state from clients to the server path. This is local-project behavior, not official Valve backend behavior.

When checking the console while connecting to a server, you may see logs such as `Sending socache`. This is the GC sending inventory information to the server through Steam P2P.

Sometimes inventory may still fail to appear after joining a GC-compatible server. The most common causes are a failed inventory send, with no `Sending socache` log, or an inventory send that happened too late, after the server status logs. These issues are usually caused by a network obstacle between you and the target server. If you connect to a friend's server through Steam P2P, or if all players have poor NAT types such as NAT4, consider using a virtual LAN tool or VPN.