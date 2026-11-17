---
layout: PortalLayout
title: Clash 规则模式和全局模式怎么选？
articleId: clash-rule-global
author: 翻墙123
description: Clash Verge Rev 的规则、全局、直连有什么区别？用一张对照表看懂日常选择，再排查全局能用、规则打不开的问题。
---

已经按[三步教程](/articles/three-steps.html)连上了，看到 Clash Verge Rev 的「规则、全局、直连」又不知道怎么选？日常可以先用<strong>规则模式</strong>。遇到某个网站打不开，再用全局模式对照排查。

## 三种模式有什么区别？

下面说的流量，都是<strong>已经进入 Clash 的连接</strong>。

| 模式 | 连接怎么走 | 适合什么时候用 |
| --- | --- | --- |
| 规则 | 按当前配置里的规则选择直连、代理或拦截 | 日常使用，按网站分流 |
| 全局 | 统一交给 GLOBAL 策略组里选中的节点或策略 | 临时统一出口、排查分流问题 |
| 直连 | 由 Clash 直接访问目标 | 临时恢复直连、比较访问结果 |

规则模式的结果取决于订阅里的配置。比如配置中写了某类网站直连、另一类走代理，客户端才会这样处理。规则按从上到下的顺序匹配，排在前面的优先。[Mihomo 模式说明](https://wiki.metacubex.one/config/general/#运行模式) · [规则说明](https://wiki.metacubex.one/config/rules/#优先级)

## 在 Clash Verge Rev 里怎么切换？

进入<strong>「代理」页</strong>，在上方选择模式。[官方快速入门](https://www.clashverge.dev/guide/quickstart.html)

[![Clash Verge Rev 官方教程截图，代理页右上角提供规则、全局和直连三个选项](/tutorials/clash-modes/official-mode-picker.png)](/tutorials/clash-modes/official-mode-picker.png)

1. 日常使用先选<strong>「规则」</strong>，再在相应代理组里选择能用的节点。
2. 用浏览器访问时，确认<strong>「系统代理」已开启</strong>。
3. 需要对照测试时切到<strong>「全局」</strong>，在 GLOBAL 组里选中要测试的同一个节点，再重新访问目标网页。完成后切回规则。

## 全局能打开，规则打不开怎么办？

先保持<strong>同一个节点、同一个网站</strong>，只切换模式做比较，避免把换节点带来的变化混在一起。

- **先看「连接」页。** 找到目标网站的连接，检查命中的规则和实际使用的代理链。
- **再看对应代理组。** 如果它选了 DIRECT 或另一个节点，按需要调整该组的选择。
- **最后检查订阅规则。** 如果该网站被分到不合适的策略，可更新订阅后重试。涉及自定义规则时，先保存原配置。

这种现象可以把排查重点放到分流规则和代理组选择上，单凭一次切换还无法确定原因。若两种模式都打不开，先换一个节点再试。

## 开全局后，所有软件都会走代理吗？

<strong>模式负责决定进入 Clash 后怎么走，接管方式负责哪些连接进入 Clash。</strong>系统代理主要覆盖遵循系统代理设置的应用。某个软件没有把连接交给 Clash，切成全局也无法替它接管。

浏览器能用、其他软件仍连不上时，应继续检查该软件的代理设置，或按官方说明了解 TUN 虚拟网卡接管方式。[Clash Verge Rev 代理与 TUN 说明](https://www.clashverge.dev/guide/quickstart.html)
