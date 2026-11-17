---
layout: PortalLayout
title: Clash Verge Rev 2.5.10 更新了什么？
articleId: clash-verge-2-5-10
author: 翻墙123
description: 全局模式选不了出口、DNS 开关状态不对、Windows 覆盖安装失败？看看 Clash Verge Rev 2.5.10 的修复，再从本站下载更新。
---

Clash Verge Rev **2.5.10 于 11 月 3 日发布**。这次重点修复全局出口选择、DNS 状态和覆盖安装问题。遇到这些情况，可以对照下面的更新要点。[官方更新记录](https://github.com/clash-verge-rev/clash-verge-rev/releases/tag/v2.5.10)

## 这次修了什么？

- **全局出口**。补回缺失的 `GLOBAL` 策略组，恢复全局模式单独选出口。
- **DNS 覆写**。订阅 DNS 变化使覆写关闭时，修正开关状态与提示。
- **服务模式**。修复 SSH 私钥文件引发的启动失败，以及 GEO 数据不同步造成的规则校验失败。
- **Windows 安装**。覆盖或重装时提示退出运行中的应用，减少卸载与覆盖失败。

## 从本站下载更新

打开本站的 [Clash Verge Rev 下载页](/tools/downloads/?platform=windows&client=clash-verge-rev)，先看版本号，再选系统和架构。Windows 的 Intel / AMD 电脑通常选 **x64 · EXE**，ARM 电脑选 **ARM64 · EXE**。安装前先退出正在运行的客户端。

[![本站 Windows 下载页，Clash Verge Rev 卡片显示 v2.5.10，并提供 x64 和 ARM64 安装包](/tutorials/clash-verge-2-5-10/downloads-windows.jpg)](/tutorials/clash-verge-2-5-10/downloads-windows.jpg)

macOS、Linux 用户切换到对应系统即可。还在挑选软件，可先看本站[客户端指南](/clients/)。第一次安装、需要导入订阅，跟着[三步入门教程](/articles/three-steps.html)操作。

## 更新后检查全局出口

如果之前遇到全局模式无法选节点，更新后到「代理」页切换为全局，检查 `GLOBAL` 组及其选中出口。日常按网站分流时再切回规则模式。两种模式的用法和排障步骤见本站[规则模式与全局模式说明](/articles/clash-rule-global.html)。

[![本站模式说明文章，列出规则、全局和直连三种模式，并解释 GLOBAL 策略组的作用](/tutorials/clash-verge-2-5-10/site-mode-guide.jpg)](/tutorials/clash-verge-2-5-10/site-mode-guide.jpg)
