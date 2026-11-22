---
layout: PortalLayout
title: Tails 7.17.1 紧急更新，暂时移除 uBlock Origin
articleId: tails-7-17-1
author: 翻墙123
description: Tails 7.17.1 暂时移除预装的 uBlock Origin。了解更新影响、适用版本，以及如何升级并保留持久存储。
---

Tails 团队于 **2026 年 11 月 17 日**发布 **Tails 7.17.1**。这次紧急更新暂时移除了系统自带 Tor Browser 里的广告拦截扩展 uBlock Origin，以应对扩展中的安全漏洞。这次变更适用于从 U 盘启动的 Tails 系统。更新后，浏览器里少了这个扩展，原先由它过滤的广告可能重新出现。Tails 团队表示会在条件允许时恢复预装。[官方发布公告](https://blog.torproject.org/new-release-tails-7_17_1/)

已有启动 U 盘的用户，可以从 **Tails 7.0 及之后的旧版本**直接自动升级至 7.17.1。启动 Tails 并连接 Tor 后，按更新提示操作。也可从 **Apps → Tails → About Tails** 查看当前版本并检查更新。自动升级不可用，或升级后无法启动时，可按官方指南手动升级。要保留 U 盘里的持久存储，请走升级流程。直接在原 U 盘上重新安装会删除持久存储。[Tails 官方升级指南](https://tails.net/doc/upgrade/)
