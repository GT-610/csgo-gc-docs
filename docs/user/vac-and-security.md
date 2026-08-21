# VAC and server security

This page describes what can currently be verified about CSGO-GC's security boundary. It says nothing about future Valve enforcement or third-party server policies. We also **accept no responsibility for losses caused by improper use**.

## What the project changes

The client launcher loads CSGO-GC into the game process and hooks the Steam and Game Coordinator interfaces to restore missing GC behavior locally. Antivirus software may flag it as a false positive. CSGO-GC is not a read-only data patch.

CSGO-GC servers do not enable VAC. The GC server path clears the Steam server `secure` flag. Not every community server disables VAC, but every CSGO-GC server disables VAC.

## What the project does not change

As `steam_hook.cpp` shows, the project does not take over VAC or Steam identity authentication:

- `bSecure` is passed unchanged to Steam when the client connects to a server.
- `GetAuthSessionTicket` still calls the original `ISteamUser` implementation.
- `BeginAuthSession` still calls the original Steam implementation.
- Server authentication first calls the original `BeginAuthSession`; only after successful authentication is the client passed to the local GC networking layer.

This project replaces only GC and inventory messages. Steam identity authentication, server security state, and VAC detection still go through the official path, so Steam sees a normal session. The replacement launcher skips part of the `trusted-mode` startup check and passes `true` to `LauncherMain`, but server authentication is still a real Steam secure session afterward.

## How are GC hooks different from cheat hooks?

The technical form of CSGO-GC hooks is similar to injected cheats, but their purpose and behavior are different. CSGO-GC does not:

- read or write player entities;
- modify aiming, recoil, field of view, or input;
- intercept game network commands to gain a competitive advantage;
- hide the module;
- bypass auth tickets; or
- fake VAC status.

It primarily replaces GC message interfaces that are already defunct.

Server-side inventory, fake skins, and the local SO cache only affect what players see and use on that server or client. Nothing is written to the Steam economy, so CSGO-GC cannot:

- sell items on the Steam Market;
- initiate real trades;
- change the CS2 backend inventory; or
- affect Valve's item-ownership database.

GC cannot give you an in-game advantage or create profit in the official economy. It hooks the GC messages sent to CS:GO and does not change gameplay.

## Known facts

Mikko created the project in 2023. Since then, no publicly reported VAC ban has been attributed to CSGO-GC. Reverse-engineering checks of the final legacy client did not find any of the VAC/secure-mode strings we searched for in `engine.dll`.

Based on the [standalone CS:GO store version](https://store.steampowered.com/app/4465480/CounterStrikeGlobal_Offensive/), CS:GO:

- no longer runs as CS2's App ID 730;
- has no official server, GC, market, or comparable backend systems; and
- has no public store metadata declaring VAC enabled.

Valve also has little practical reason to keep a VAC policy for this isolated, unsupported game. Maintaining it would cost engineering effort without a corresponding product benefit.

## Unknowns

These observations cannot prove that Valve has no undisclosed detection or enforcement path, and they cannot predict the behavior of VAC-secure servers or third-party anti-cheat systems. "No known VAC bans" does not mean "cheating is safe" or "every community server is safe." Some community servers use third-party anti-cheat such as GameGuard, which may scan memory or files on disk. Using a client with GC on such a server may result in a third-party ban because of the injection.

Valve can always change its rules or act manually. There is currently no technical evidence that using this project triggers VAC. This is a general platform and legal caveat, not evidence of a known code path that would trigger VAC.

## App ID and the 2026 standalone release

The default `appid_override` is `4465480`, the standalone legacy CS:GO application. Changing it to `730` changes how Steam identifies the running game and may affect Workshop or presence behavior. It does not restore Valve's CS:GO backend and is not a security recommendation. Keep the default unless you understand the compatibility trade-off.

## Can I use CSGO-GC with CS2?

**We strongly recommend that you do not.**

CS:GO and CS2 use the same GC format. This is why a client without CSGO-GC can theoretically connect to the CS2 GC by changing its version number. This custom GC could also be adapted to CS2 by changing the launcher and some hook endpoints. However, CS2 is still officially supported by Valve, so doing this is **very likely** to result in an official ban. This is **extremely dangerous**.

## So, will using CSGO-GC result in a VAC ban?

Playing solo with a CSGO-GC client, playing with friends (whether or not they use GC), or playing on a community server that also runs CSGO-GC will not cause a VAC ban based on how the project technically works.

If you play on non-CSGO-GC community servers that do not use third-party anti-cheat software (even if VAC is enabled on the server), you are highly unlikely to be banned by VAC.

Playing on a community server with third-party anti-cheat may result in a third-party ban. Whether that third-party ban is associated with a VAC ban depends on that service's rules. We therefore do not recommend playing on such servers.
