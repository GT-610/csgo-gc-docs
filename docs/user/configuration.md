# Configuration

csgo_gc reads configuration from:

```text
csgo_gc/config.txt
```

The file is parsed when the GC is loaded. There is no config hot reload, so restart the game after changing it.

## Account display

The `ranks` block controls visible rank and win data:

```text
"ranks"
{
    "competitive_rank" "18"
    "competitive_wins" "666"
    "wingman_rank"     "18"
    "wingman_wins"     "777"
    "dangerzone_rank"  "15"
    "dangerzone_wins"  "888"
}
```

Other account presentation options include:

| Option | Purpose |
| --- | --- |
| `vac_banned` | Controls the local VAC status flag shown by the GC. |
| `cmd_friendly` | Friendly commendation count. |
| `cmd_teaching` | Teaching commendation count. |
| `cmd_leader` | Leader commendation count. |
| `player_level` | Profile level. |
| `player_cur_xp` | Current profile XP. |

## Item behavior

`destroy_used_items` controls whether consumables are removed after use:

```text
"destroy_used_items" "1"
```

The `rarity_weights` block controls weighted selection for crate-style openings. The example config uses Valve-like weights.

## Steam and server browser

`appid_override` controls the app ID used for the game. The default is `4465480`, the legacy CS:GO app ID.

```text
"appid_override" "4465480"
```

`show_csgo_gc_servers_only` controls the server browser filter:

```text
"show_csgo_gc_servers_only" "1"
```

When enabled, the server browser only shows servers tagged for csgo_gc by default.

## RCON

RCON is disabled by default:

```text
"rcon"
{
    "enabled"      "0"
    "bind_address" "127.0.0.1"
    "port"         "37016"
    "password"     ""
}
```

Keep `bind_address` on `127.0.0.1` unless you understand the security implications. An empty configured password accepts any supplied Source RCON password.

## Logging

`log_output` controls diagnostic output:

| Value | Behavior |
| --- | --- |
| `0` | No logging. |
| `1` | Log to the in-game console. |
| `2` | Log to the in-game console and `gc_log.txt`. |
