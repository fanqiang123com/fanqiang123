import { downloadClients, platforms } from './client-downloads.js'

export const guidePlatforms = [...platforms, ['router', '路由器']]

// Popularity snapshot, 2026-11-13. Thresholds are separate for the two sources.
const tiers = {
  github: [1_000, 5_000, 10_000, 30_000, 100_000],
  appstore: [100, 500, 1_000, 1_500, 10_000],
}

const details = {
  "clash-verge-rev": {
    "description": "Clash 桌面客户端，可导入订阅、切换策略组并按规则分流。",
    "highlight": "从系统托盘就能开关系统代理和 TUN，日常切换不用打开主窗口。",
    "tradeoff": "系统代理、TUN 和策略组需要分别理解，第一次配置时容易混淆。",
    "tutorial": "/articles/clash-verge-rev-setup.html",
    "source": "github",
    "count": 158091,
    "page": "https://github.com/clash-verge-rev/clash-verge-rev"
  },
  "clash-nyanpasu": {
    "description": "Clash 桌面客户端，支持订阅管理、规则覆写和脚本。",
    "highlight": "可把自定义规则单独存成覆写，更新订阅后也能继续套用。",
    "tradeoff": "覆写和脚本选项较多，新手通常用不到这些高级功能。",
    "tutorial": "https://github.com/libnyanpasu/clash-nyanpasu#get-started",
    "source": "github",
    "count": 13309,
    "page": "https://github.com/libnyanpasu/clash-nyanpasu"
  },
  "flclash": {
    "description": "跨平台 Clash 客户端，支持订阅、节点测速和规则分流。",
    "highlight": "支持用本地文件或 WebDAV 备份和恢复配置，换设备时省去重配。",
    "tradeoff": "要用 Clash 兼容配置，其他客户端的订阅链接不一定能直接导入。",
    "tutorial": "/articles/flclash-setup.html",
    "source": "github",
    "count": 62900,
    "page": "https://github.com/chen08209/FlClash"
  },
  "v2rayn": {
    "description": "桌面代理客户端，支持 Xray、sing-box 等内核及多种协议。",
    "highlight": "节点列表可按实测延迟或速度排序，订阅节点多时更容易挑选。",
    "tradeoff": "内核和路由选项较多，进阶配置需要先了解协议和分流。",
    "tutorial": "/articles/v2rayn-setup.html",
    "source": "github",
    "count": 120505,
    "page": "https://github.com/2dust/v2rayN"
  },
  "v2rayng": {
    "description": "Android 客户端，可导入 V2Ray / Xray 节点和订阅。",
    "highlight": "可扫码导入单个节点，也能只让选中的 Android 应用走代理。",
    "tradeoff": "仅支持 Android，Clash YAML 规则配置不能直接照搬。",
    "tutorial": "/articles/v2rayng-setup.html",
    "source": "github",
    "count": 65794,
    "page": "https://github.com/2dust/v2rayNG"
  },
  "hiddify": {
    "description": "跨平台客户端，可导入订阅，支持多种常见代理协议。",
    "highlight": "能按延迟自动选节点，日常连接可以少一步手动挑选。",
    "tradeoff": "高级分流仍依赖配置文件，想逐条定制规则时需要额外设置。",
    "tutorial": "/articles/hiddify-setup.html",
    "source": "github",
    "count": 33966,
    "page": "https://github.com/hiddify/hiddify-app"
  },
  "clash-meta-android": {
    "description": "Android 上的 Clash 客户端，可导入 YAML 并按规则分流。",
    "highlight": "可以为订阅设置自动更新间隔，服务商更换节点后不用重新导入。",
    "tradeoff": "仅支持 Android，需要准备 Clash 兼容订阅或 YAML 配置。",
    "tutorial": "/clients/setup.html#clash-meta-for-android",
    "source": "github",
    "count": 49400,
    "page": "https://github.com/MetaCubeX/ClashMetaForAndroid"
  },
  "shadowrocket": {
    "description": "支持 iPhone、iPad 和 Mac，可导入节点与订阅并按规则分流。",
    "highlight": "可以直接在手机上查看 DNS 和网页请求记录，排查某个域名连不上的原因。",
    "tradeoff": "App Store 付费下载，能否购买取决于 Apple 账户地区。",
    "tutorial": "/articles/shadowrocket-setup.html",
    "source": "appstore",
    "count": 12349,
    "page": "https://apps.apple.com/us/app/shadowrocket/id932747118"
  },
  "surge": {
    "description": "提供 iOS 与 macOS 版本，可按规则转发流量、抓包和分析请求。",
    "highlight": "调试接口时可以查看请求和响应的头部与正文，还能用本地文件模拟响应。",
    "tradeoff": "部分功能需要内购，规则和脚本的学习成本较高。",
    "tutorial": "https://manual.nssurge.com/",
    "source": "appstore",
    "count": 1030,
    "page": "https://apps.apple.com/us/app/surge-5/id1442620678"
  },
  "quantumult-x": {
    "description": "支持 iPhone、iPad 和 Mac，可自定义分流、请求重写和脚本。",
    "highlight": "节点、分流规则和重写规则可以分别订阅，换节点来源时能继续用原有规则。",
    "tradeoff": "App Store 付费下载，配置语法需要单独学习。",
    "tutorial": "https://github.com/crossutility/Quantumult-X/blob/master/sample.conf",
    "source": "appstore",
    "count": 1656,
    "page": "https://apps.apple.com/us/app/quantumult-x/id1443988620"
  }
}

const routerClients = [
  {
    id: 'openclash',
    name: 'OpenClash',
    systems: ['router'],
    firmware: 'OpenWrt',
    description: '通过 LuCI 导入 Clash 兼容配置，在路由器上为局域网设备做规则分流。',
    highlight: '分流设在路由器上，电视和游戏机也能使用，无需在每台设备上安装客户端。',
    tradeoff: '需要安装运行核心和相应依赖，配置时要留意 DNS 与防火墙规则。',
    tutorial: '/clients/setup.html#openclash',
    source: 'github',
    count: 28164,
    page: 'https://github.com/vernesong/OpenClash',
    install: 'https://github.com/vernesong/OpenClash#快速开始',
  },
  {
    id: 'passwall',
    name: 'PassWall',
    systems: ['router'],
    firmware: 'OpenWrt',
    description: '在 LuCI 管理代理节点和访问控制，可给不同设备设置直连或代理。',
    highlight: '可以按局域网 IP 或 MAC 地址设置访问规则，例如让电视走代理、工作电脑保持直连。',
    tradeoff: '软件包和依赖要匹配固件版本及 CPU 架构，安装前需要先核对。',
    tutorial: '/clients/setup.html#passwall',
    source: 'github',
    count: 10003,
    page: 'https://github.com/Openwrt-Passwall/openwrt-passwall',
    install: 'https://github.com/Openwrt-Passwall/openwrt-passwall#readme',
  },
]

const desktopAndMobileClients = downloadClients.map(({ id, name, downloads }) => ({
  id,
  name,
  systems: Object.keys(downloads),
  ...details[id],
}))

export const guideClients = [...desktopAndMobileClients, ...routerClients]
  .map(client => ({
    ...client,
    rating: tiers[client.source].filter(threshold => client.count >= threshold).length,
  }))
  .sort((a, b) => b.rating - a.rating)
