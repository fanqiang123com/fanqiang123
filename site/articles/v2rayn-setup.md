---
layout: PortalLayout
title: v2rayN 使用教程：Windows 导入订阅并连接
articleId: v2rayn-setup
author: 翻墙123
description: 在 Windows 解压 v2rayN，添加订阅分组、更新节点并启用系统代理。
---

v2rayN 保存了订阅地址，列表里还是空的？添加链接后，还要更新一次订阅。下面用本站免费节点演示 Windows 上的完整操作。

## 1．解压并打开 v2rayN

打开 [v2rayN 的 Windows 下载页](/tools/downloads/?platform=windows&client=v2rayn)。普通 Intel 或 AMD 电脑选 **x64 · ZIP**，Windows ARM 设备选 **ARM64 · ZIP**。把 ZIP 完整解压到一个文件夹，再运行里面的 `v2rayN.exe`。

[![本站 v2rayN Windows 下载卡片，列出 x64 和 ARM64 的 ZIP 安装包](/tutorials/client-setup-batch-1/v2rayn-download.png)](/tutorials/client-setup-batch-1/v2rayn-download.png)

## 2．添加分组并更新节点

在本站[免费节点](/nodes/)点 **「导入订阅」→「复制订阅地址」**。回到 v2rayN，打开 **「订阅分组」→「订阅分组设置」→「添加」**。别名可填「翻墙123 免费节点」，把链接粘贴到「可选地址 (Url)」，保持「启用更新」勾选，再点「确定」。

回到主窗口，选刚建的分组，然后点 **「订阅分组」→「更新当前订阅 (不通过代理)」**。等日志出现「更新订阅结束」，再看分组里有没有节点。如果列表还是空的，先回分组设置检查「启用更新」是否勾选、地址有没有复制完整。使用自己的订阅时，选服务商提供的 v2rayN 或 V2Ray 兼容地址。

## 3．设为活动并开启系统代理

在列表里右键点一个节点，选 **「设为活动」**。再从系统托盘的 v2rayN 菜单选 **「自动配置系统代理」**，用浏览器打开你要访问的网页。用完可从同一菜单选「清除系统代理」。
