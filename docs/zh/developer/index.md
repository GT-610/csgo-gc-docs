# 开发者指南

本节面向希望贡献 csgo_gc，或研究它如何为旧版 CS:GO 恢复 GC 相关行为的开发者和研究者。

## 首先需要理解什么

csgo_gc 不是一个独立的 Web 服务。它被加载到游戏进程中，hook Steam Game Coordinator 流量，并把消息重定向到本地 ClientGC 和 ServerGC 实现。

代码库主要由 C++17、CMake、Steamworks SDK 头文件和可再发行库、生成的 protobuf 源码，以及一层小型启动器组成。

## 推荐阅读顺序

1. [构建](/zh/developer/building)
2. [架构](/zh/developer/architecture)
3. [源码地图](/zh/developer/source-map)
4. [贡献](/zh/developer/contributing)

## 研究边界

这个项目适合研究旧版 CS:GO GC 消息、库存行为、本地 SO cache 更新、商店响应，以及基于 Steam P2P 的协作方式。它不是匹配后端，也不应被当作匹配后端。
