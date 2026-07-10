# Building

## Requirements

- Git
- CMake 3.20 or newer
- A C++17 compiler
  - Visual Studio 2017 or newer
  - Clang 5 or newer
  - GCC 7 or newer

The top-level CMake project downloads protobuf, cryptopp-cmake, and funchook through `FetchContent` during configure.

## Windows

CS:GO is 32-bit on Windows, so build with the Win32 generator platform:

```bat
cmake -A Win32 -B build
cmake --build build --config Release --target csgo_gc
```

For a full launcher package build:

```bat
cmake --build build --config Release --target csgo srcds csgo_gc
```

## Linux dedicated server

Linux dedicated servers are 32-bit:

```sh
cmake -DCMAKE_C_FLAGS=-m32 -DCMAKE_CXX_FLAGS=-m32 -DCMAKE_ASM_FLAGS=-m32 -B build
cmake --build build --target csgo_gc
```

## Linux client

Linux client builds do not require the 32-bit flags used for dedicated servers.

```sh
cmake -B build
cmake --build build --target csgo_gc
```

## macOS

Build for `x86_64` instead of `arm64`:

```sh
cmake -DCMAKE_OSX_ARCHITECTURES=x86_64 -DFUNCHOOK_CPU=x86 -B build
cmake --build build --target csgo_gc
```

## Build outputs

The project has three top-level CMake subdirectories:

- `csgo_gc`: the GC hook and local GC implementation.
- `launcher`: replacement launchers for game and server entry points.
- `steamworks`: Steamworks SDK linkage and redistributable handling.
