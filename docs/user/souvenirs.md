# Souvenir Packages

CSGO-GC can open legacy CS:GO souvenir packages and generate the tournament metadata and stickers expected for each Major era. The package definition and the server-side loot list select the weapon pool; tournament attributes on the package select the souvenir stickers.

The package does not need a loot-list attribute. Loot lists are GC-side data, not item-instance attributes.

## Create a package with RCON

Use `give_item` with a souvenir package defindex and, when needed, the two teams:

```powershell
rcon -a 127.0.0.1:37016 -p 1 "give_item 4013 tournament_team0=31 tournament_team1=1"
```

| Parameter | Attribute | Meaning |
| --- | ---: | --- |
| `tournament_event` | 137 | Tournament event ID; normally inherited from the package definition. |
| `tournament_stage` | 138 | Optional stage ID. |
| `tournament_team0` | 139 | First team ID. |
| `tournament_team1` | 140 | Second team ID. |
| `tournament_mvp` | 223 | MVP Steam account ID for the autograph era. |

These are tournament record IDs, not sticker-kit defindexes. CSGO-GC resolves sticker variants from `items_game.txt`.

## Historical formats

| Era | Generated stickers |
| --- | --- |
| DreamHack Winter 2013 | Tournament sticker; no team metadata. |
| Katowice/Cologne 2014 | Event sticker and two team Foil stickers. |
| DreamHack Winter 2014 | Event sticker and two team Gold stickers. |
| Katowice 2015 | Event Gold and two team Gold stickers. |
| Cologne 2015–Berlin 2019 | Event Gold, two team Golds, and an MVP Gold autograph. |
| Stockholm 2021–Paris 2023 | Event Gold, two team Golds, and a Gold map sticker. |

For the 2015–2019 autograph format, supply `tournament_mvp`:

```powershell
rcon -a 127.0.0.1:37016 -p 1 "give_item 4132 tournament_team0=46 tournament_team1=1 tournament_mvp=64640068"
```

For Stockholm 2021 and later, the fourth sticker is derived from the package map. Do not supply `tournament_mvp`:

```powershell
rcon -a 127.0.0.1:37016 -p 1 "give_item 4810 tournament_team0=12 tournament_team1=59"
```

## Manual inventory editing

```text
"attributes"
{
    "137" "7"
    "139" "46"
    "140" "1"
    "223" "64640068"
}
```

Inspect and persist a package with:

```powershell
rcon -a 127.0.0.1:37016 -p 1 "item_info <item-id>"
rcon -a 127.0.0.1:37016 -p 1 save_inventory
```

The GC resolves sticker kits, but does not verify that the selected teams and MVP historically played the same match.
