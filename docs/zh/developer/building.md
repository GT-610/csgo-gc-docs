# 构建

## 要求

- Git
- CMake 3.20 或更高版本
- 支持 C++17 的编译器
  - Visual Studio 2017 或更高版本
  - Clang 5 或更高版本
  - GCC 7 或更高版本

顶层 CMake 项目会在 configure 阶段通过 `FetchContent` 下载 protobuf、cryptopp-cmake 和 funchook。

## Windows

Windows 上的 CS:GO 是 32 位程序，因此需要使用 Win32 生成器平台：

```bat
cmake -A Win32 -B build
cmake --build build --config Release --target csgo_gc
```

如需完整启动器包构建：

```bat
cmake --build build --config Release --target csgo srcds csgo_gc
```

## Linux 专用服务器

Linux 专用服务器也是 32 位：

```sh
cmake -DCMAKE_C_FLAGS=-m32 -DCMAKE_CXX_FLAGS=-m32 -DCMAKE_ASM_FLAGS=-m32 -B build
cmake --build build --target csgo_gc
```

## Linux 客户端

Linux 客户端构建不需要专用服务器所用的 32 位 flags。

```sh
cmake -B build
cmake --build build --target csgo_gc
```

## macOS

需要构建为 `x86_64`，而不是 `arm64`：

```sh
cmake -DCMAKE_OSX_ARCHITECTURES=x86_64 -DFUNCHOOK_CPU=x86 -B build
cmake --build build --target csgo_gc
```

## 构建输出

项目有三个顶层 CMake 子目录：

- `csgo_gc`：GC hook 和本地 GC 实现。
- `launcher`：游戏和专用服务器入口点的替换启动器。
- `steamworks`：Steamworks SDK 链接和可再发行文件处理。
