# VAC and server security

This page describes CSGO-GC's currently verifiable security boundary. It is not a guarantee about future Valve enforcement or third-party server policies. We also **accept no responsibility for losses caused by improper use**.

## What the project changes

The client launcher loads CSGO-GC into the game process and hooks Steam and Game Coordinator interfaces so that missing GC behavior can be restored locally. Antivirus software may therefore report a false positive; CSGO-GC must not be treated as a read-only data patch.

CSGO-GC servers do not enable VAC. The GC server path clears the Steam server `secure` flag. Not every community server disables VAC, but every CSGO-GC server disables VAC.

## What the project does not change

`steam_hook.cpp` shows that the project does not take over VAC or Steam identity authentication:

- `bSecure` is passed unchanged to Steam when the client connects to a server.
- `GetAuthSessionTicket` still calls the original `ISteamUser` implementation.
- `BeginAuthSession` still calls the original Steam implementation.
- Server authentication first calls the original `BeginAuthSession`; only after successful authentication is the client passed to the local GC networking layer.

Only GC and inventory messages are replaced by this project. Steam identity authentication, server security state, and VAC detection continue through the official path, so Steam sees a normal session. The replacement launcher skips part of the `trusted-mode` startup check and passes `true` to `LauncherMain`, but server authentication is still a real Steam secure session afterward.

## How are GC hooks different from cheat hooks?

The technical form of CSGO-GC hooks is similar to injected cheats, but their purpose and behavior are different. CSGO-GC:

- Do not read or write player entities.
- Do not modify aiming, recoil, field of view, or input.
- Do not intercept game network commands to gain a competitive advantage.
- Do not hide the module.
- Do not bypass auth tickets.
- Do not fake VAC status.
- Primarily replace the already-defunct GC message interfaces.

Server-owned inventory, fake skins, or local SO cache affect what players see and use on that server or client. Do not write items to the Steam economy and cannot:

- sell items on the Steam Market;
- initiate real trades;
- change the CS2 backend inventory; or
- affect Valve's item-ownership database.

GC cannot provide an in-game advantage or create profit from the official economy. It hooks the GC message interfaces sent to CS:GO; it does not change the game's gameplay behavior.

## Known facts

Since Mikko created the project in 2023, no public report is known of a VAC ban caused by CSGO-GC. Reverse-engineering checks of the final legacy client also found none of the searched VAC/secure-mode strings in `engine.dll`.

Based on the [standalone CS:GO store version](https://store.steampowered.com/app/4465480/CounterStrikeGlobal_Offensive/), CS:GO:

- no longer runs as CS2's App ID 730;
- has no official server, GC, market, or comparable backend systems; and
- has no public store metadata declaring VAC enabled.

Valve also has little practical reason to continue maintaining a VAC policy for this isolated, unsupported game: maintaining CS:GO VAC would add cost and engineering effort without a corresponding product benefit.

## Unknowns

These observations cannot prove that Valve has no undisclosed detection or enforcement path, and they cannot predict the behavior of VAC-secure servers or third-party anti-cheat systems. “No known VAC bans” does not mean “cheats are safe” or “all community servers are safe.” Some community servers use third-party anti-cheat such as GameGuard, which may scan memory or files on disk; using a client with GC on such a server may result in a third-party ban because of the injection.

Valve theoretically retains the ability to change its rules or take manual action, but there is currently no technical evidence that using this project causes VAC bans. This is a general platform/legal risk reservation, not evidence of a concrete code path likely to trigger VAC.

## App ID and the 2026 standalone release

The default `appid_override` is `4465480`, the standalone legacy CS:GO application. Changing it to `730` changes how Steam identifies the running game and may affect Workshop or presence behavior; it does not restore Valve's CS:GO backend and is not a security recommendation. Keep the default unless you understand the compatibility trade-off.

## Can I use CSGO-GC with CS2?

**We strongly recommend that you do not.**

CS:GO and CS2 use the same GC format. This is why a client without CSGO-GC can theoretically connect to the CS2 GC by changing its version number. In theory, this custom GC could also be adapted to CS2 by changing the launcher and some hook endpoints. However, CS2 is still officially supported by Valve, so doing this is **very likely** to result in an official ban. This is **extremely dangerous**.

## So, will using CSGO-GC result in a VAC ban?

If you use a CSGO-GC client by yourself, play with friends (whether or not they use GC), play on a community server also using CSGO-GC, using CSGO-GC will not cause a VAC ban based on its technical operation.

If you play on non-CSGO-GC community servers that do not use third-party anti-cheat software (even if VAC is enabled on the server), you are highly unlikely to be banned by VAC.

Playing on a community server with third-party anti-cheat may result in a third-party ban. Whether that third-party ban is associated with a VAC ban depends on that service's rules. We therefore do not recommend playing on such servers.
