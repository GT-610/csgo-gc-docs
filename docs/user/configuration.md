# Configuration

csgo_gc reads configuration from:

```text
csgo_gc/config.txt
```

The file is parsed when the GC is loaded. There is no config hot reload, so restart the game after changing it.

## Account display

The `ranks` block controls visible rank and win data:

```vdf
"ranks"
{
    "competitive_rank" "18" // Competitive rank, range [1, 18]
    "competitive_wins" "666" // Competitive wins
    "wingman_rank"     "18" // Wingman rank, range [1, 18]
    "wingman_wins"     "777" // Wingman wins
    "dangerzone_rank"  "15" // Danger Zone rank, range [1, 15]
    "dangerzone_wins"  "888" // Danger Zone wins
}
```

Other account presentation options include:

| Option | Purpose |
| --- | --- |
| `vac_banned` | Controls whether the in-game "VAC banned" banner is shown. It does not reflect or affect your actual VAC status. |
| `cmd_friendly` | Commendations for being friendly. |
| `cmd_teaching` | Commendations for teaching. |
| `cmd_leader` | Commendations for leading the team. |
| `player_level` | Player level. |
| `player_cur_xp` | Current experience points. |

## Item behavior

`destroy_used_items` controls whether consumables are removed after use. `1` means yes and `0` means no; the default is `1`. When disabled, cases and keys are not consumed when opening cases, and trade-up inputs are not consumed.

The `rarity_weights` block controls weighted selection for crate-style openings. The example config uses Valve-like weights.

`music_kit_stattrak` controls when StatTrak music kits count round MVPs and show the count on the MVP panel:

| Value | Behavior |
| --- | --- |
| `competitive` | Only in a competitive ruleset. This is the default. |
| `always` | In every game type and mode. |

The default matches the scope the official backend supported: it only ever counted on official matchmaking servers, which ran competitive rules. A competitive ruleset means the classic game type with competitive, Wingman, or 5v5/2v2 scrimmage mode, so community and local competitive servers count too. Casual, Deathmatch, Arms Race, and the other game types do not.

The game mode is read from the server you are connected to, so this works on any server without that server needing its own configuration. Set it to `always` if you want the counter in casual-style modes as well.

## Steam and server browser

`appid_override` controls the app ID used for the game. The default is `4465480`, the app ID of the standalone CS:GO release.

You can also set it to `730` so CS:GO believes it is running under the original app ID, which now belongs to CS2. This may allow Workshop subscriptions, but other players will see you as playing CS2.

`show_csgo_gc_servers_only` controls the server browser filter. `1` enables it and `0` disables it.

When enabled, the browser shows only servers tagged with `csgo_gc` by default. All CSGO-GC-compatible servers carry this tag. On a server without it, your inventory may not work: it may not show up for you or other players, and the buy menu may display your items while purchases still hand out default equipment instead of what you configured.

## RCON

See the [RCON section](/user/rcon).

## Logging

`log_output` controls diagnostic output:

| Value | Behavior |
| --- | --- |
| `0` | No logging. |
| `1` | Log to the in-game console. |
| `2` | Log to the in-game console and `gc_log.txt`. |

