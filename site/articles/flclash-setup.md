---
layout: PortalLayout
title: FlClash 使用教程：Android 导入配置并连接
articleId: flclash-setup
author: 翻墙123
description: 在 Android 安装 FlClash，从本站导入 Clash 配置并完成第一次连接。
---

在 Android 上装好 FlClash 后，先导入一份 Clash 配置，再用仪表盘启动连接。下面用本站免费节点演示。

## 1．安装 FlClash

打开 [FlClash 的 Android 下载页](/tools/downloads/?platform=android&client=flclash)。大多数近年的手机选 **ARM64 · APK**，确认设备只支持 32 位 ARM 时才选 ARMv7。下载后打开 APK，按 Android 提示安装，首次打开阅读并确认应用提示。

## 2．导入并选中配置

在本站[免费节点](/nodes/)点 **「导入订阅」→「Android」→「FlClash」**，允许浏览器打开 App。回到 FlClash 的 **「配置」**，确认新配置已出现并选中它。

[![本站 Android 导入面板，列出 FlClash、v2rayNG 和 Hiddify 等入口](/tutorials/client-setup-batch-2/android-import.png)](/tutorials/client-setup-batch-2/android-import.png)

如果网页没有打开 App，复制服务商提供的 Clash 订阅链接，在 FlClash「配置」页点加号，选「通过URL导入」，粘贴地址并导入。导入后回到「配置」页，选中刚出现的配置。

## 3．启动连接

到「代理」页可以查看策略组并选节点。回到 **「仪表盘」**，点启动按钮。第一次连接时按 Android 提示允许 VPN 请求。回到浏览器测试网页，结束时回仪表盘停掉连接。
