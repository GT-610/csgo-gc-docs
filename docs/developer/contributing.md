# Contributing

csgo_gc is still incomplete, so contributions are most useful when they improve correctness, diagnostics, reproducibility, or documentation.

## Good contribution areas

- Edge-case validation for inventory operations.
- Safer and clearer diagnostics for broken inventory data.
- Tooling around live inventory editing through RCON.
- Tests or focused repro cases for item use flows.
- Item schema research, especially a recent full CS:GO Item Schema.
- Documentation for platform-specific installation and build behavior.

## Before changing behavior

Identify which path owns the behavior:

- Player inventory and item actions usually live in `inventory.cpp` and `gc_client.cpp`.
- Store behavior usually starts in `gc_client.cpp` and uses `price_sheet.txt`.
- Server interoperability usually involves `gc_server.cpp` and the networking files.
- Steam API interception usually belongs in `steam_hook.cpp`.
- Config changes should update `config.cpp`, `config.h`, the example config, and user documentation.

## Compatibility expectations

Prefer small, well-scoped changes. Many flows emulate specific CS:GO GC message shapes, so a change that looks local can affect inventory cache updates, UI notifications, or dedicated server behavior.

When adding a new user-visible option or RCON parameter, update the docs in the same change.

## Documentation style

Write docs for two audiences:

- Players need safe installation, config, and troubleshooting steps.
- Developers need source entry points, message flow, data formats, and known limits.

Avoid presenting experimental behavior as stable.
