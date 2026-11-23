---
layout: PortalLayout
title: Clash Verge Rev 为什么没命中你想要的规则？
articleId: clash-rule-match-order
author: 翻墙123
description: 同一个域名符合两条规则，Clash 会选哪条？用三行示例读懂规则顺序，再对照「连接」和「规则」找出实际命中的一条。
---

已经开了规则模式，某个域名却走了意料之外的链路？先查这次连接实际命中了哪条，再回规则列表看它排在哪里。下文以 Clash Verge Rev 2.5.10 中文界面和已经进入客户端的 TCP 连接为例。还在选模式的话，可以先看[规则模式和全局模式怎么选](/articles/clash-rule-global.html)。

## 同一个域名符合两条规则，先看谁排在前面

在「规则」页，左边的编号是列表顺序。每条规则会显示条件类型、匹配内容和选中的策略。下面用三条规则演示匹配顺序。

```yaml
rules:
  - DOMAIN-SUFFIX,example.com,DIRECT
  - DOMAIN,docs.example.com,REJECT
  - MATCH,DIRECT
```

对 `docs.example.com` 来说，前两条都符合条件。**第一条已经匹配，结果是 `DIRECT`（直连）**。第二条虽然写的是完整域名，排在后面就轮不到它。把前两行交换位置，结果就会变成 `REJECT`（阻断）。`MATCH` 无条件匹配，放在末尾接住前面没匹配到的连接。这里的域名只用来说明规则逻辑。[Mihomo 路由规则](https://wiki.metacubex.one/en/config/rules/)

## 拿一条新连接，对照规则和链路

1. 在「连接」页，用你要排查的域名筛选。重新发起一次访问，再找连接时间对应的新记录。短连接已经结束时，可以切到「已关闭」找刚才那条记录。
2. 打开记录详情，先看「主机」，确认这条连接的目标域名。有时一个页面会向多个域名发请求，选中的那条要和你想排查的请求对应。再看「规则」和「链路」。前者给出命中的类型和条件，后者显示这次连接经过的策略组或节点。[Clash Verge Rev 连接详情](https://github.com/clash-verge-rev/clash-verge-rev/blob/v2.5.10/src/components/connection/connection-detail.tsx)
3. 回「规则」页，**清空搜索框**，找出命中的那条和原本期待的那条，比较它们的编号。搜索只筛列表里显示的规则内容，直接搜完整域名，可能漏掉更靠前的后缀规则或引用规则集合的条目。[Clash Verge Rev 规则列表](https://github.com/clash-verge-rev/clash-verge-rev/blob/v2.5.10/src/pages/rules.tsx)

如果更靠前的规则接走了请求，你就找到了该查的匹配条件。如果规则已经命中预期，实际链路却不同，再去「代理」页看对应策略组当前选中了什么。两处都符合预期时，这条连接的分流就核对完了。
