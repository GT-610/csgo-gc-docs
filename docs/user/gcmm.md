# GC Matchmaking (GCMM)

GC Matchmaking (GCMM) connects real legacy CS:GO clients to an already-configured dedicated server through an external coordinator. The protocol identifier is `gcmm/1`. It uses authenticated Source RCON for coordination and preserves the game's native ACCEPT dialog, readiness checks, and automatic server connection.

::: warning Validation scope
The productized GCMM API and Python reference coordinator were revalidated with one real account on build 1575 on November 10, 2026: the user clicked ACCEPT and the client automatically joined `de_dust2`. Ten real clients and production distributed matchmaking have not been validated. Multi-client simulation verifies coordinator rules, not ten real players. Use `--players 1 --once` explicitly for a single-account smoke run.
:::

## What you need

- A legacy CS:GO client with `csgo_gc` and GCMM enabled for each real participant.
- A dedicated server with `csgo_gc`, GCMM enabled, and its map/mode already configured.
- Python 3.10+ for the standard-library reference coordinator in `examples/gcmm/coordinator.py`.
- One authenticated GC RCON endpoint for the server and one for each client. These ports are separate from the game server's UDP port.

The reference coordinator expects **ten distinct real searching accounts** by default. Its first profile supports one local account per party request; a multi-account party produces a clear error. Each participant starts a competitive search in their own game. The coordinator discovers their account IDs from native search state and never fills a roster with placeholders.

The native server adapter currently supports only the verified Windows x86 build 1575 engine. Unsupported binaries fail discovery before native mutation. The coordinator does not require `mm_probe`, log parsing, Npcap, process-memory access, Bun, or a PowerShell helper.

## Enable GCMM and RCON

Add this block to `csgo_gc/config.txt` on every client and the dedicated server:

```vdf
"gcmm"
{
    "enabled" "1"
}
```

GCMM defaults to off and is independent of RCON. Enable and configure RCON separately:

```vdf
"rcon"
{
    "enabled"      "1"
    "bind_address" "127.0.0.1"
    "port"         "37016"
    "password"     "replace-with-a-unique-password"
}
```

Use a separate server RCON port, for example `37015`. Restart each process after editing its configuration. Loopback is suitable when the endpoint and coordinator share a machine. For remote participants, provide reachable endpoints on your trusted network: Source RCON authenticates commands but does not encrypt the transport.

The game address, such as `203.0.113.121:27016`, must be reachable by all players. Setting the GC RCON address does not change the native game server address. See [configuration](/user/configuration), [RCON](/user/rcon), and [server installation](/user/server_installation) for the surrounding setup.

## Run a single-account smoke test

From the main repository root, set passwords in environment variables. With PowerShell 7:

```powershell
$env:GCMM_SERVER_PASSWORD = Read-Host 'Server RCON password' -MaskInput
$env:GCMM_CLIENT_PASSWORD = Read-Host 'Client RCON password' -MaskInput
python examples/gcmm/coordinator.py `
  --server 127.0.0.1:37015 `
  --client 127.0.0.1:37016 `
  --game-address 203.0.113.121:27016 `
  --map de_dust2 `
  --players 1 `
  --once
```

Replace the addresses and map with your actual setup. Password values are not command-line arguments. The default environment names are `GCMM_SERVER_PASSWORD` and `GCMM_CLIENT_PASSWORD`.

1. Start the configured dedicated server and the client. Server discovery must report `enabled:true` and `initialized:true`.
2. Start the coordinator, then enter a competitive search in the game. The coordinator waits for native search state before reserving anything.
3. Click the native ACCEPT button when it appears. The coordinator waits for the actual server roster to reach stage 2.
4. Let the native client connect automatically. With `--once`, the coordinator verifies the committed state and exits; it does not release the successful reservation while clients still need it to connect.

The default offered game type is `4104`. Native request values can differ: the real value `462552584` is also competitive because its low nibble is `8`. The reference checks this supported mode, rather than requiring the entire request value to equal `4104`.

## Coordinate ten real participants

Supply ten reachable `--client host:port` options and omit `--players 1`. No account list is needed: identities come from each client's native `gcmm_status`. All ten people must enter their searches, receive the native dialog, and click ACCEPT themselves.

`--client-password-env NAME` can be provided once for a shared environment variable, or repeated once per `--client` in matching order for separate passwords. `--server-password-env NAME` changes the server's password variable.

The coordinator reserves the native server first, verifies its actual owner and complete real roster, and prepares all clients concurrently. It waits for every preparation future before cleaning up an owner after any preparation failure. It checks the same server request ID, cookie, match ID, complete real roster, strict successful result, and active reservation. It revalidates the owner and every client immediately before commit; a partial commit triggers cleanup of committed and uncommitted client reservations before server release.

On cancellation, stale state, timeout, or partial failure, it cancels only the attempted search owners and releases only its own server cookie/match owner. It waits for the asynchronous release result; an unreachable endpoint is reported as `cleanup incomplete`. Ctrl+C also runs cleanup. With `--once`, a successful run leaves the native reservation in place while clients connect. Without `--once`, it waits for server availability and the next cohort after success; it does not manage the full match or end-of-match lifecycle.

## Timing and diagnostics

Run `python examples/gcmm/coordinator.py --help` for all options.

| Option | Default | Purpose |
| --- | --- | --- |
| `--players` | `10` | Required number of distinct real searching accounts. |
| `--rpc-timeout` | `4` seconds | Total deadline for one authenticated RCON operation. |
| `--prepare-timeout` | `12` seconds | Bound native activation and concurrent client preparation. |
| `--accept-timeout` | `90` seconds | Coordinator's upper bound for real clicks; native expiry can occur earlier. |
| `--search-timeout` | `0` | Wait indefinitely for a cohort; set a positive value to bound the wait. |
| `--poll-interval` | `0.25` seconds | Delay between status checks. |

Concurrent preparation avoids serializing ten slow client commands inside the native reservation's approximately 21-second initial window. The coordinator never turns a timeout into acceptance or replays a timed-out mutation automatically.

| Observation | What to check |
| --- | --- |
| `enabled:false` | Enable GCMM independently of RCON, then restart. |
| `initialized:false` | Read the server's discovery error; the adapter must recognize the supported native engine. |
| Waiting for a cohort | Confirm enough distinct real clients are searching; ten is the default. |
| Party or unsupported-mode error | Use solo-party competitive requests for this reference profile. |
| Stale search or reservation | A cancel, new search, or different server owner superseded this transaction. |
| No ACCEPT dialog | Confirm the matching native server reservation and all stage-1 participants; inspect GCMM status. |
| `cleanup incomplete` | Inspect the affected endpoint's state and connectivity before restarting coordination. |

## State and command reference

The authenticated client endpoint exposes `gcmm_status`, `gcmm_reserve`, `gcmm_commit`, and `gcmm_cancel`. The server endpoint exposes `gcmm_status`, `gcmm_reserve`, and `gcmm_release`. Their role-specific arguments are described in the [developer protocol contract](/developer/gcmm-protocol).

Client phases are `idle`, `searching`, `reserved`, and `committed`. Every valid new native 9101 search creates a new per-process `search_id`. A normal native 9102 clears pre-commit state; after commit, a normal connection handoff preserves the held match. **An explicit native abandon (`9102.abandon != 0`) clears it**, as do an owner-matched `gcmm_cancel`, a successful diagnostic `mm_abandon`, and a new search. Ordinary Hello refreshes preserve an existing committed match and do not restore a cleared one.

Successful commands return `OK ` followed by JSON with `protocol:"gcmm/1"` and the endpoint's `role`. Errors use `ERR <stable_code> <message>`. JSON uint64 identities are strings: search/request IDs are decimal, cookies/match IDs are hexadecimal, and account IDs are uint32 numbers. Unknown keys, duplicate keys, overflow, stale owners, and conflicting replacements are rejected.

The diagnostic `mm_*` commands and older MM/1 design notes are outside this stable profile. Restoring the [matchmaking UI](/user/matchmaking-ui) alone does not start a coordinator or establish a native server reservation.
