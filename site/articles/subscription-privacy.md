---
layout: PortalLayout
title: 订阅链接怎么保护？截图、转换和泄露后的处理
articleId: subscription-privacy
author: 翻墙123
description: 截图求助该遮哪里，订阅转换怎么选，链接误发后如何补救？用三个常见场景保护你的私人订阅。
---

私人订阅链接里通常带有访问令牌，拿到完整地址的人可能直接下载你的节点配置、使用套餐流量。**带个人凭据的订阅链接要像密码一样保管**。[Xboard 订阅认证实现](https://github.com/cedar2025/Xboard/blob/master/app/Http/Middleware/Client.php)

## 截图求助，先遮住这三处

| 分享的内容 | 发出前怎么处理 |
| --- | --- |
| 订阅地址 | 遮住整条链接，包括地址栏、输入框和报错里的地址 |
| 订阅或节点二维码 | 裁掉整块二维码，旁边的文字链接也一起处理 |
| 配置文件、日志 | 隐去订阅 URL、token、节点 password / uuid，以及邮箱等个人信息 |

用**不透明色块完全覆盖**敏感区域，导出一张新图片，再放大检查。分享配置时，只复制与问题有关的几行，把凭据替换成「已隐藏」。[Mihomo 密码字段](https://wiki.metacubex.one/config/proxies/ss/#password) · [UUID 字段](https://wiki.metacubex.one/config/proxies/vless/#uuid)

[![分享前完整遮住订阅链接、整个二维码和节点凭据的三栏示意图](/art/subscription-privacy-v1-redaction-1200.webp)](/art/subscription-privacy-v1-redaction-1200.webp)

求助时附上**系统、客户端版本、操作步骤和脱敏后的错误提示**，通常更方便定位。比如「Windows，Clash Verge Rev，更新订阅时出现 403」，再补充何时开始、是否每次都出现。

## 转换订阅，先确认谁能拿到链接

优先使用服务商直接提供的 Clash、sing-box 等对应格式。Windows + Clash Verge Rev 的导入操作可看[三步教程](/articles/three-steps.html)。

确实需要转换时，选择自己控制的本地转换服务，或确认可信的服务商工具。以 subconverter 为例，转换请求的 `url` 参数包含原始订阅地址，据此可知，**接收请求的转换后端会拿到该地址**。使用前核对实际后端归属，转换后的链接也按原订阅同样保管。[subconverter 调用说明](https://github.com/tindy2013/subconverter/blob/master/README-cn.md#调用说明)

## 已经误发，按这个顺序补救

1. **立即撤销旧凭据。** 登录服务商用户中心，找到「重置订阅」或类似入口。没有入口就联系官方客服，请其撤销旧链接，并确认已泄露的节点密码或 UUID 也一并更新。
2. **清理外传内容。** 删除误发消息、图片和共享文件，联系接收者清理副本。
3. **更新自己的设备。** 将新链接逐一导入电脑、手机和路由器，选中新配置并验证连接。完成后移除旧配置。

最后确认两件事——**旧链接已无法重新获取订阅，旧节点凭据也已失效**。可请客服确认撤销结果与生效时间，再观察账户是否还有异常用量。Xboard 的重置实现会同时更换 token 与 UUID，具体服务商的处理范围仍需核实。[Xboard 重置实现](https://github.com/cedar2025/Xboard/blob/master/app/Http/Controllers/V1/User/UserController.php)
