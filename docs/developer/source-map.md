# Source Map

Use this map as a starting point when navigating the target project.

## Root

| Path | Purpose |
| --- | --- |
| `README.md` | Main project overview, feature status, installation, and build notes. |
| `CMakeLists.txt` | Top-level CMake project, platform selection, and dependency `FetchContent`. |
| `examples/` | Example `config.txt`, `inventory.txt`, `price_sheet.txt`, and unusual loot lists. |
| `docs/rcon.md` | Existing detailed RCON reference. |
| `protobufs/` | CS:GO, Steam, GC system, and econ protobuf definitions and generated sources. |
| `steamworks/` | Steamworks SDK headers, libraries, and CMake integration. |
| `launcher/` | Replacement launcher targets for game and dedicated server entry points. |

## `csgo_gc/`

| File | Purpose |
| --- | --- |
| `main.cpp` | Exports `InstallGC(bool dedicated)`. |
| `steam_hook.cpp` | Steam API and GC message interception. |
| `gc_client.cpp` / `gc_client.h` | Local client GC behavior and RCON command handlers. |
| `gc_server.cpp` / `gc_server.h` | Local server GC behavior. |
| `gc_message.cpp` / `gc_message.h` | GC message reading and writing helpers. |
| `gc_shared.cpp` / `gc_shared.h` | Shared GC event handling and message names. |
| `inventory.cpp` / `inventory.h` | Inventory state, item creation, item use flows, storage, trade-ups, and persistence. |
| `item_schema.cpp` / `item_schema.h` | Item schema parsing and item metadata helpers. |
| `case_opening.cpp` / `case_opening.h` | Crate-style item selection. |
| `souvenir.cpp` / `souvenir.h` | Souvenir package generation. |
| `graffiti.cpp` / `graffiti.h` | Graffiti support. |
| `rcon_server.cpp` / `rcon_server.h` | Source RCON-compatible local control server. |
| `networking_client.cpp` / `networking_client.h` | Client-side project networking. |
| `networking_server.cpp` / `networking_server.h` | Server-side project networking. |
| `config.cpp` / `config.h` | `csgo_gc/config.txt` parsing and runtime config access. |
| `keyvalue.cpp` / `keyvalue.h` | Valve KeyValues parser and writer. |
| `appid.cpp` / `appid.h` | App ID override and Steam app metadata handling. |
| `platform_windows.cpp`, `platform_unix.cpp`, `platform.h` | Platform-specific process, logging, and filesystem behavior. |

## Runtime data files

| File | Purpose |
| --- | --- |
| `csgo_gc/config.txt` | Runtime settings. |
| `csgo_gc/inventory.txt` | Local inventory state. |
| `csgo_gc/price_sheet.txt` | Store metadata and prices. |
