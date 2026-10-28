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

## Linux runtime requirements

The prebuilt Linux binaries are expected to run on any distribution the stock
CS:GO dedicated server runs on. The release artifacts are built inside an
`ubuntu:22.04` container, so the shipped `csgo_gc.so` requires:

- `GLIBC_2.34` or newer
- `GLIBCXX_3.4.21` and `CXXABI_1.3.9` or newer, from the system `libstdc++`

That covers Ubuntu 22.04 and later, Debian 12 and later, and current rolling
distributions.

Do not assume that building on a newer distribution is harmless. binutils 2.45
and later add a `GLIBC_ABI_GNU_TLS` version dependency to i386 binaries that
call `___tls_get_addr`, which raises the minimum glibc to 2.42. A binary built
that way fails to load on Ubuntu 24.04 with `version 'GLIBC_ABI_GNU_TLS' not
found`, which is issue #143.

That tag is not merely a version marker: it asserts that the loader's GNU TLS
run-time preserves XMM registers across `___tls_get_addr`. glibc without the fix
for BZ 32996 clobbers them, so dropping the tag turns a clean load failure into
possible silent floating-point corruption. Build against an old glibc rather
than suppressing the tag. `CSGO_GC_SUPPRESS_GNU_TLS_TAG` exists for the rare
case where that assertion is known not to apply, and is off by default.

Note that the tag is not what blocks a native Ubuntu 24.04 build. That image
ships binutils 2.42, which predates the tag, so it is never emitted there. The
real blocker on 24.04 is the C23 `strtol` family: its `stdlib.h` redirects
`strtol` to `__isoc23_strtol`, which requires glibc 2.38. That redirect cannot
be turned off with language or feature-macro flags, which is why the release
build pins the container instead of the runner.

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
