# Developer Guide

This section is for contributors and researchers studying how csgo_gc restores GC-backed behavior for legacy CS:GO.

## What to understand first

csgo_gc is not a standalone web service. It is loaded into the game process and hooks Steam Game Coordinator traffic, redirecting messages to local ClientGC and ServerGC implementations.

The codebase is mostly C++17 with CMake, Steamworks SDK headers and redistributables, generated protobuf sources, and a small launcher layer.

## Recommended reading order

1. [Building](/developer/building)
2. [Architecture](/developer/architecture)
3. [Source Map](/developer/source-map)
4. [Contributing](/developer/contributing)

## Research boundaries

This project is useful for studying legacy CS:GO GC messages, inventory behavior, local SO cache updates, store responses, and Steam P2P-based coordination. It is not a matchmaking backend and should not be treated as one.
