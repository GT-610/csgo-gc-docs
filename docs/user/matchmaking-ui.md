# Matchmaking UI

This page explains how to make the official Matchmaking screens appear in the legacy client, and what does and does not work once they are visible.

Restoring the entry restores the matchmaking UI only. With GCMM and an external coordinator, a community setup can run the native ACCEPT flow: real players receive the dialog, click it manually, and the client can autojoin the configured community server. The official Valve matchmaking queue is not restored.

## Why the screens are missing

The Panorama frontend lives in a single package:

```text
csgo/panorama/code.pbin
```

Despite the name it is not a plain ZIP. It starts with a `PAN` magic and a 512-byte RSA-4096 signature, followed by a stored ZIP, and the signature covers everything after it. The client verifies that signature before it loads a single frontend file. Without Valve's private key the signature cannot be reproduced, so a repacked frontend is rejected and the game shows:

```text
Resource panorama/code.pbin has invalid data.
```

The Matchmaking implementation was never removed from the package. Only the entry point was disabled: the "Official Matchmaking" option in the Play menu dropdown was replaced with blank space, while the layouts, styles and scripts behind it are still shipped. That is why restoring one line is enough to bring the screens back.

## Enabling it

Two things are needed: a package with the entry restored, and permission for the client to load a package whose signature does not verify.

### 1. Allow an unsigned package

In `csgo_gc/config.txt`:

```vdf
"allow_unsigned_panorama" "1"
```

This is off by default, and only matters on the client: dedicated servers never load Panorama.

When enabled, CSGO-GC patches the loaded `panorama` module in memory so the integrity check accepts the package. Nothing on disk is modified, and the change lives only as long as the game process. If the module layout is not one this was written against, nothing is patched and a line is written to the log instead:

```text
Panorama: code.pbin check left untouched (unsupported build)
```

### 2. Provide a package with the entry restored

Back up your original first:

```text
csgo/panorama/code.pbin  ->  csgo/panorama/code.pbin.stock.bak
```

Then replace `csgo/panorama/code.pbin` with a repacked copy that restores this line in `panorama/layout/mainmenu_play.xml`:

```xml
<Label text="#play_setting_online" id="Play-official" data-type="official" value="1"/>
```

The repacked file keeps the original header and trailer; only the ZIP payload changes. Because the signature no longer matches, step 1 is what lets the client accept it.

> [!NOTE]
> CSGO-GC does not ship a copy of this package. It contains Valve's frontend assets, so obtaining and repacking it is left to you.

## What you should see

With both steps done, the Play menu dropdown lists **Official Matchmaking** alongside the offline, training, Workshop and community options, and the Matchmaking screens open.

The console and `gc_log.txt` report whether the patch applied:

| Message | Meaning |
| --- | --- |
| `Panorama: relaxed code.pbin signature check` | The patch applied and the package will be accepted. |
| `Panorama: code.pbin check left untouched (unsupported build)` | The module layout was not recognised. Nothing was changed. |

If instead you still get `Resource panorama/code.pbin has invalid data.`, the patch did not apply. Check that `allow_unsigned_panorama` is set, that the client was fully restarted, and that the log shows the first message above.

## What this does and does not do

The UI package alone restores the entry point. It does not create a queue or assign a server. GCMM and an external coordinator add a community matchmaking path: the coordinator prepares real searching clients and a configured native server, players receive the native ACCEPT dialog and click it themselves, and the client can autojoin that community server. See [GC Matchmaking (GCMM)](/user/gcmm) for the supported flow.

The official Valve matchmaking queue is not restored. These official services remain unavailable:

- searching for and joining an official match;
- matchmaking cooldowns, ranks and eligibility checks.

Lobbies, the server browser and playing on a dedicated server are unaffected and do not need this option. Those are covered in [Servers and Lobbies](/user/servers).

## Disabling it

Set `allow_unsigned_panorama` back to `0` and restore the backup:

```text
csgo/panorama/code.pbin.stock.bak  ->  csgo/panorama/code.pbin
```

Leaving the patched package in place with the option disabled is harmless: the client rejects it again, exactly as it did before.
