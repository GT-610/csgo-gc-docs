# GCMM Protocol for developers

This page is the implementation contract for the `gcmm/1` Source RCON native-control profile. It describes the boundary between an external coordinator, the local ClientGC, and the local ServerGC.

Earlier MM/1 notes describe a separate distributed matchmaking design. They are not the GCMM contract and are not evidence that the earlier distributed design is implemented.

## Scope and invariants

GCMM v1 keeps the shared CS:GO message IDs and protobuf shapes. It adds an authenticated control plane around the native client and server paths:

```text
Coordinator -- Source RCON --> ClientGC -- native GC messages --> legacy client
Coordinator -- Source RCON --> ServerGC -- native engine API --> srcds
legacy client -- connectionless reservation checks --> srcds
```

The profile has these invariants:

- `gcmm.enabled` is independent and defaults to false. Source RCON is enabled separately.
- The coordinator uses real searching account IDs. It never fabricates roster entries.
- The server owns the native reservation cookie, Q payload, roster and readiness stages.
- The client never writes a native readiness stage and never sends a manual `connect` fallback.
- `gcmm_commit` is allowed only after the coordinator has read the authoritative server roster and confirmed every member at stage 2 or later.
- Native engine calls run on the server's callback/engine thread. RCON worker threads only queue work or read bounded snapshots.
- Repeated commands for the same owner are idempotent; stale owners and replacements are rejected.
- The current native server adapter fails closed unless the exact Windows x86 build 1575 engine is discovered and verified.

The current runtime validation is one real account using the productized API and reference coordinator on build 1575. Ten real clients and production distributed matchmaking remain separate acceptance work.

## Transport contract

GCMM uses the existing authenticated Source RCON binary transport. It does not introduce HTTP, WebSocket, TLS session discovery, a new socket, or a new protobuf message.

RCON commands are case-insensitive, while key names are lowercase. The client-side tokenizer is reused for client commands; server command parsing is strict. An authenticated command has one response. The Source RCON length field is limited to 4096 bytes; request ID, packet type and two terminators leave **4086 UTF-8 bytes for the complete response body**, including `OK ` or `ERR `. An oversized GCMM response must fail with a short error such as `ERR response_too_large ...`, rather than truncate an `OK` JSON object.

Success:

```text
OK {"protocol":"gcmm/1","role":"client",...}
```

Error:

```text
ERR <stable_code> <message>
```

The JSON rules are stable across the two roles:

| Value | Representation |
| --- | --- |
| `uint64` identity | JSON decimal string |
| reservation cookie | hexadecimal JSON string |
| match ID | hexadecimal JSON string |
| `search_id` | decimal JSON string |
| `request_id` | decimal JSON string |
| account ID | JSON number in `uint32` range |
| command names | case-insensitive |
| key names | lowercase |

Unknown extra arguments, duplicate keys, overflow, malformed account lists, stale owners and attempts to replace an active reservation must fail without a partial state update.

## Client state and commands

### State source

The client captures native 9101 and 9102 events on the GC worker. A valid native 9101 increments the per-process monotonic `search_id`, enters `searching`, and clears previous explicit GCMM match state. Malformed protobuf bodies or invalid local/party rosters do not start a new search.

A normal native 9102 with absent/zero `abandon` clears a pre-commit search/reservation. After commit, the same normal stop can be part of the native connection handoff and preserves the committed payload. An **explicit native abandon (`9102.abandon != 0`) clears reserved/committed GCMM and diagnostic ongoing state**, enters `idle`, and publishes a complete Hello without ongoing data. New searches, owner-matched cancellation, and successful legacy `mm_abandon` also clear the held match.

These operations are serialized on the GC worker. If a stop is processed before commit, the cleared reservation makes commit fail as stale. If commit is processed first, an ordinary handoff stop retains it; an explicit abandon still clears it. A coordinator must continue checking ownership and cannot assume a prior status read reserves a future command slot.

`gcmm_status` is the coordinator's state API:

```json
{
  "protocol": "gcmm/1",
  "role": "client",
  "enabled": true,
  "steam_id": "76561198265685624",
  "account_id": 305419896,
  "search_id": "12",
  "phase": "searching",
  "request": {
    "account_ids": [305419896],
    "game_type": 462552584,
    "client_version": 13881
  },
  "reservation": null
}
```

`phase` is `idle`, `searching`, `reserved`, or `committed`. While a reservation is held, `reservation` contains `reservationid`, `match_id`, `accounts`, `ip`, `port`, `map`, `game_type`, and `serverid`. The initial idle search ID is the decimal string `"0"`; mutation commands require a nonzero current owner. Search IDs are monotonic within a process, not globally across process restarts.

A coordinator must poll this API instead of parsing diagnostic logs.

### Client reserve

```text
gcmm_reserve search_id=N reservationid=N match_id=N accounts=id,... ip=a.b.c.d port=N serverid=N map=name game_type=N [server_address=ip:port] [server_version=13881]
```

The command is accepted only for the active searching owner. It requires nonzero identifiers, a valid unicast IPv4 address, a nonzero port, a server ID, and the complete real roster for the local account and every account in its party; the roster has 1–64 unique nonzero `uint32` accounts and must contain the local account. The `map` is ASCII alphanumeric plus `_`, `-`, or `/`, with length 1–128. The optional `server_address` must match `ip:port`. For the v1 native ACCEPT profile, both the requested and offered `game_type` must have low nibble `8` (`game_type & 0xf == 8`); their full values may differ. If `server_version` is supplied, it must exactly match the native client request version; if omitted, use `request.client_version`.

The client sends the native messages in this exact order:

```text
9104 matchmaking=1 (joined/search state)
9104 matchmaking=4 (match confirmed)
9107 GC2ClientReserve (held exact reservation payload)
```

It then records the full payload and enters `reserved`. An identical command for the same search is idempotent. A different payload for that search is a state conflict. The command does not set any server stage.

### Client commit

```text
gcmm_commit search_id=N reservationid=N match_id=N
```

The client requires an exact match for the current `search_id`, cookie and match ID. The command has no caller-supplied stage or roster override. The coordinator must first prove, from the server API, that the matching authoritative roster has every member at stage 2 or later.

Once accepted, the client sends the complete `9110.ongoingmatch`, enters `committed`, and lets the native client session consume its queued connection. Ordinary hello refreshes preserve the explicit GCMM ongoing payload while the transaction is committed. Repeating the same commit is idempotent.

`gcmm_commit` is a local handoff operation. Its success does not prove that any remote client accepted; only the server's authoritative roster stage can provide that proof.

### Client cancel

```text
gcmm_cancel search_id=N
```

An explicit search ID is mandatory. Cancellation clears reserved or committed state, sends matchmaking state 0, and sends a complete hello without GCMM ongoing data. Repeating cancellation for the current cancelled owner is idempotent. A successful legacy `mm_abandon` also clears the held GCMM match. The diagnostic `mm_*` commands are outside this contract.

## Server state and commands

The server route provides:

```text
gcmm_status
gcmm_reserve reservationid=N match_id=N accounts=id,...
gcmm_release reservationid=N match_id=N
```

`gcmm_status` returns a bounded JSON snapshot:

```json
{
  "protocol": "gcmm/1",
  "role": "server",
  "enabled": true,
  "initialized": true,
  "request_id": "1",
  "last_result": true,
  "server_steamid": "76561198265685624",
  "cookie": "0x1122334455667801",
  "match_id": "0x0a0b0d01",
  "queue": "Q1122334455667801,a0b0d01,1:[12345678]",
  "roster_count": 1,
  "expected_humans": 1,
  "minimum_stage": 2,
  "accepted": 1,
  "matches_request": true,
  "active": true,
  "all_accepted": true,
  "roster": [{ "account_id": 305419896, "stage": 2 }]
}
```

When disabled or unsupported, discovery must still clearly report protocol, role, enabled and initialization/error state. Mutation commands must reject.

`gcmm_reserve` parses a strict Q reservation fixture and queues the public native reservation call on the engine thread. Its immediate acknowledgement is the queued response:

```text
OK {"protocol":"gcmm/1","role":"server","request_id":"1","queued":true}
```

The coordinator must poll `gcmm_status` using that same `request_id`. It may continue only when `last_result` is the strict JSON boolean `true`, the cookie and match ID are the exact requested owner, the roster is the complete actual real roster, and `active` is the strict JSON boolean `true`. The server refuses replacement of a different active owner; the same owner and exact request are idempotent. The native state is called a reservation throughout this contract.

`gcmm_release` queues an owner-checked native release for the exact cookie and match ID. After a successful native `Qcookie,match,0`, `active` becomes false immediately, while the engine may clear the cookie and queue later; cleanup must not require those fields to become zero immediately. Cleanup waits for the same release `request_id` with strict `last_result:true` and `active:false`; an owner change also proves that the old owner no longer occupies the reservation. Repeating release for a completed owner and inactive state is idempotent when the old cookie/queue remains or the state is already empty. A coordinator releases only its own reservation after cancellation, timeout or failure.

The native server adapter is intentionally narrow. It verifies the exact installed engine hash and `VEngineServer023` reservation entry before calling the native API. Unsupported builds fail closed. The adapter reads cookie, Q payload and roster stages for status, but never writes a stage value.

## Native message and stage sequence

The tested native path is a two-phase readiness exchange around the 9107 reservation:

```mermaid
sequenceDiagram
    participant C as Coordinator
    participant S as ServerGC / engine
    participant G as ClientGC / client
    participant U as Player

    C->>S: gcmm_reserve(cookie, match_id, real roster)
    S-->>C: request_id; status active
    C->>G: gcmm_reserve(search_id, same reservation)
    G->>G: 9104 joined, 9104 confirmed
    G->>G: 9107 GC2ClientReserve
    G->>S: native ! stage 1
    S-->>G: native % awaiting=0,total=roster_count
    G->>G: ServerReserved / native ACCEPT UI
    U->>G: click ACCEPT
    G->>S: native ! stage 2
    S-->>G: native % awaiting=0,total=roster_count
    C->>S: poll status; every roster stage >= 2
    C->>G: gcmm_commit(search_id, cookie, match_id)
    G->>G: full 9110.ongoingmatch
    G->>G: QueueConnect
    G->>S: actual connection
```

The server's `%` response with `awaiting=127` is the native failure sentinel; it is not a player count. A successful stage response has `awaiting=0` and reports the roster total. The coordinator uses the server's JSON roster stages as the authoritative commit gate.

The client does not infer that all players accepted from `9104 matchmaking=4`. That message is a UI/match state update. The accepted state is established by the native server reservation checks after the user has interacted with the native ACCEPT flow.

## Reference coordinator behavior

The reference coordinator is a Python 3.10+ standard-library implementation. It accepts one server RCON endpoint and repeatable client RCON endpoints; passwords come from environment variables and must not be committed. The reference profile is solo-only: each selected client must represent one local account, and a party request with additional accounts fails clearly.

Its default target is ten players. `--players 1` is an explicit local smoke profile. The default timing values are RPC timeout 4 seconds, preparation timeout 12 seconds, accept timeout 90 seconds, and polling interval 0.25 seconds. The coordinator must:

1. poll client `gcmm_status` and choose exactly the requested number of distinct real searching accounts;
2. generate random nonzero `uint64` cookie and match ID values;
3. reserve the native server first and verify the returned owner and complete actual real roster;
4. send `gcmm_reserve` to all selected clients concurrently, retaining every future and waiting for all futures to finish before cleaning up the owner on any preparation failure;
5. poll the same server owner until every roster member is at stage 2 or fail clearly;
6. revalidate the server owner, complete roster, active reservation, and every client owner immediately before commit;
7. commit all clients, and if a partial commit occurs, clean up the clients already committed and the remaining client reservations before releasing the server owner;
8. on cancellation, stale state, timeout or failure, cancel only the clients and release only the server reservation that it owns; wait for the asynchronous release result and report unreachable endpoints as `cleanup incomplete`;
9. never auto-accept and never fabricate accounts.

With `--once`, a successful run verifies the committed state and leaves the successful native reservation in place for the clients to connect. In continuous mode, the coordinator waits for server availability and the next cohort after success; it does not manage the full match or end-of-match lifecycle. A coordinator's mock or multi-client simulation can test command ordering and failure handling, but it is not a ten-real-client acceptance claim.

## Error and ownership behavior

The coordinator should treat `ERR` as a stable machine-readable code followed by a human-readable message. At minimum, implementations need distinct failures for disabled/unsupported protocol, malformed arguments, stale `search_id`, stale cookie or match ID, reservation owner conflict, duplicate/replacement reservation, and inactive/expired native reservation.

A server error must not be converted into a successful client commit. On any transaction failure, the coordinator cancels only the clients and releases only the server reservation that it owns. It must not clear an unrelated active reservation or send a later `9110` using an old search.

## Testing and validation boundary

The implementation test suite covers command construction, field validation, idempotent state retention, clearing behavior, and RCON routing. Runtime evidence for the native path includes:

- a real build 1575 client receiving a native ACCEPT dialog;
- a real user clicking ACCEPT;
- server stage 1 and stage 2 connectionless checks with `awaiting=0`;
- `9110.ongoingmatch` sent only after server stage 2;
- native queue consumption and automatic entry into `de_dust2`;
- no manual `connect` command.

Those facts establish the single-account path only. Ten real clients, full party behavior, production discovery, result reporting, retries across coordinator failure, and distributed failover are future validation work.

For installation and command examples, see [GCMM Protocol](/user/gcmm).