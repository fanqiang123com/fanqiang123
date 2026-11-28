---
layout: PortalLayout
title: Ubuntu 24.04 上用 3x-ui 配置 VLESS + REALITY
articleId: 3x-ui-vless-reality
author: 翻墙123
description: 在自己的 Ubuntu VPS 安装 3x-ui，用 SSH 打开面板，配置 VLESS + REALITY 入站，再导入客户端检查连接。
---

手上有一台能用 SSH 登录的 Ubuntu 24.04 VPS？可以用 3x-ui 管理 Xray 的节点。先把管理面板留在服务器本机，再为客户端单独开放一个节点端口。下文以 3x-ui v3.11.0、VLESS 和 TCP 为例。

## 1．安装面板，用 SSH 打开

打开 GitHub 的 `MHSanaei/3x-ui` 仓库，切到 `v3.11.0` 标签，在 `install.sh` 页面选择下载原始文件。把文件传到自己的 VPS，在 SSH 终端运行：

```sh
sudo bash install.sh v3.11.0
sudo systemctl status x-ui --no-pager
```

安装时记下**面板端口、入口路径和管理员凭据**。如果通过 SSH 隧道管理，选择跳过面板证书设置，看到「Bind the panel to 127.0.0.1 only?」时选 **y**。在云安全组保留自己的 SSH 管理入口，面板端口保持关闭。

在电脑另开一个终端。下面用 `2053` 演示面板端口，换成安装时显示的值，`ubuntu` 和地址也换成自己的 SSH 登录信息。

```sh
ssh -N -L 127.0.0.1:2222:127.0.0.1:2053 ubuntu@192.0.2.10
```

保持该终端运行，在浏览器用 HTTP 打开本机的 `127.0.0.1:2222`，在端口后接上安装时显示的入口路径。用安装时生成的凭据登录。

## 2．添加 VLESS + REALITY 入站

在 3x-ui 打开 **「入站列表」→「添加入站」**。下面的端口和备注可以按自己的需要调整。

| 设置 | 怎么填 |
| --- | --- |
| 协议与传输 | 协议选 `VLESS`，传输选 `TCP`（有的版本显示为 `RAW`），安全选 `REALITY` |
| 入站端口 | 可用 `443`。先用 `sudo ss -ltnp` 检查有没有别的服务占用，有则选另一个空闲端口 |
| 客户端 | 生成一个 UUID，Flow 选 `xtls-rprx-vision` |
| Target 和 SNI | Target 填 VPS 能直接访问、支持 TLS 1.3 的目标域名及端口。SNI 填该目标证书所含的域名 |
| 密钥和 Short ID | 用面板生成密钥对和 Short ID。私钥留在服务端，客户端使用公钥和对应的 Short ID |

保存并确认入站已启用，再到云安全组放行**入站端口的 TCP 流量**。服务器已启用 UFW 时也要放行同一端口，例如 `sudo ufw allow 443/tcp`。节点端口应和面板端口分开。

## 3．导入客户端，检查连接

展开刚建的入站，在客户端列表复制该用户的分享链接或二维码。在支持 VLESS + REALITY 的客户端导入它。Windows 可用 v2rayN，安装和启动可看[本站 v2rayN 教程](/articles/v2rayn-setup.html)。

打开导入后的节点，确认**服务器地址和端口是自己的 VPS 和入站端口**。目标网站域名填在 SNI，连接地址保留 VPS。选中节点并开启系统代理，打开一个网页，然后回 3x-ui 看该客户端的收发流量是否增加。分享链接和二维码含连接凭据，截图前按[订阅链接保护指南](/articles/subscription-privacy.html)遮住。

## 4．连接失败先查哪一步

| 现象 | 检查顺序 |
| --- | --- |
| 面板打不开 | 确认 SSH 隧道仍开着。核对面板实际端口、入口路径与 `sudo systemctl status x-ui` |
| 节点测试一直超时 | 核对客户端地址和端口，再查云安全组、UFW 和服务器上的端口监听 |
| 能到端口，连不上节点 | 对照两端的 UUID、Flow、SNI、REALITY 公钥与 Short ID。检查 VPS 能否访问 Target，以及服务器与客户端时间是否正确 |
| 网页能打开，面板流量没增加 | 确认客户端已选中这个节点，且该次访问实际走了代理 |

改配置前从面板导出一份备份。默认 SQLite 数据在 `/etc/x-ui/x-ui.db`，包含客户端和入站设置，备份文件和节点链接一样需要妥善保存。
