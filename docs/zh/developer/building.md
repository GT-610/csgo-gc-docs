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

## Linux 运行期要求

预编译的 Linux 二进制应当能运行在原版 CS:GO 专用服务器可运行的所有发行版上。
发布产物在 `ubuntu:22.04` 容器内构建，因此随包的 `csgo_gc.so` 要求：

- `GLIBC_2.34` 或更高版本
- 系统 `libstdc++` 提供 `GLIBCXX_3.4.21` 和 `CXXABI_1.3.9` 或更高版本

这覆盖 Ubuntu 22.04 及更高版本、Debian 12 及更高版本，以及当前的滚动发行版。

不要认为在更新的发行版上构建没有副作用。binutils 2.45 及更高版本会给调用
`___tls_get_addr` 的 i386 二进制添加 `GLIBC_ABI_GNU_TLS` 版本依赖，从而把 glibc
下限抬高到 2.42。这样构建出的二进制在 Ubuntu 24.04 上会以
`version 'GLIBC_ABI_GNU_TLS' not found` 无法加载，这就是 issue #143。

该标签不只是版本标记：它断言加载器的 GNU TLS 运行时在
`___tls_get_addr` 调用前后保存了 XMM 寄存器。未包含 BZ 32996 修复的 glibc
会破坏它们，因此去掉该标签会把干净的加载失败变成潜在的浮点数据损坏。
应当对着旧 glibc 构建，而不是在这里抑制标签。
`CSGO_GC_SUPPRESS_GNU_TLS_TAG` 仅用于确知该断言不适用的罕见情况，默认关闭。

需要注意，阻挡在 Ubuntu 24.04 上原生构建的并不是这个标签。该镜像自带的 binutils 2.42
早于该标签的引入版本，因此根本不会生成它。在 24.04 上真正的阻碍是 C23 的 `strtol` 族：
其 `stdlib.h` 把 `strtol` 重定向到 `__isoc23_strtol`，后者需要 glibc 2.38。
该重定向无法用语言标准或特性宏关闭，这就是发布构建选择固定容器而非固定 runner 的原因。

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
