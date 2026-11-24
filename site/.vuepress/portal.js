export const articleCategoryIcons = Object.freeze({
  新手入门: 'beginner',
  进阶玩法: 'rules',
  机场信息: 'review',
})

export const articleCategories = Object.keys(articleCategoryIcons)
export const advancedSubcategoryIcons = Object.freeze({
  规则分流: 'rules',
  隐私安全: 'privacy',
  版本资讯: 'update',
  其他: 'folder',
})

export const legacyArticleCategories = Object.freeze({
  入门教程: '新手入门',
  新手教程: '新手入门',
  客户端: '新手入门',
  免费节点: '新手入门',
  进阶教程: '进阶玩法',
  工具资讯: '进阶玩法',
  机场测评: '机场信息',
})

export const toolResources = [
  { name: '免费节点', to: '/nodes/', icon: 'nodes', color: 'mint', description: 'Clash、V2Ray 和 sing-box 免费订阅' },
  { name: '免费小火箭 ID', to: '/tools/shadowrocket-id/', icon: 'mobile', color: 'blue', description: '查看 Shadowrocket 的共享 Apple ID' },
  { name: '客户端下载', to: '/tools/downloads/', icon: 'download', color: 'purple', description: '按系统查找安装包和 App Store 入口' },
]

export const articles = [
  {
    "id": "shandianshu-offer",
    "topics": [
      "闪电鼠",
      "优惠码"
    ],
    "category": "机场信息",
    "title": "闪电鼠机场：套餐、sd88 优惠与节点测试记录",
    "description": "整理闪电鼠年付和月付套餐、新用户优惠码 sd88、客户端导入条件，以及服务商提交的节点测试结果。",
    "date": "2026-11-24",
    "href": "/articles/shandianshu-offer.html",
    "art": "shandianshu-offer-source-v2-cover",
    "articleArt": "shandianshu-offer",
    "example": false,
    "artlabel": "闪电鼠标志：戴黄色护目镜的白鼠、闪电和闪电鼠字标。"
  },
  {
    "id": "clash-rule-match-order",
    "topics": [
      "Clash Verge Rev",
      "Mihomo",
      "规则分流"
    ],
    "category": "进阶玩法",
    "subcategory": "规则分流",
    "title": "Clash Verge Rev 为什么没命中你想要的规则？",
    "description": "同一个域名符合两条规则，Clash 会选哪条？用三行示例读懂规则顺序，再对照「连接」和「规则」找出实际命中的一条。",
    "author": "翻墙123",
    "tag": "规则分流",
    "example": false,
    "art": "clash-rule-match-order-v1-cover",
    "articleArt": "clash-rule-match-order",
    "artlabel": "一列按先后排列的规则，第一条高亮显示命中。",
    "href": "/articles/clash-rule-match-order.html",
    "date": "2026-11-23"
  },
  {
    "id": "gemini-mac-computer-use",
    "topics": [
      "AI",
      "Gemini",
      "macOS"
    ],
    "category": "进阶玩法",
    "subcategory": "其他",
    "title": "Mac 版 Gemini 能在后台操作应用了，哪些人能用？",
    "description": "Google 开始向美国符合条件的订阅用户推送 Mac 版 Gemini 的 Computer use。它能在独立窗口操作获准访问的应用，用户可以实时查看、中止任务。",
    "author": "翻墙123",
    "tag": "AI",
    "example": false,
    "art": "gemini-mac-computer-use-v1-cover",
    "articleArt": "gemini-mac-computer-use",
    "artlabel": "一张收据和报销表在独立窗口中处理，旁边的主窗口仍可操作。",
    "href": "/articles/gemini-mac-computer-use.html",
    "date": "2026-11-23"
  },
  {
    "id": "tails-7-17-1",
    "topics": [
      "Tails",
      "Tor Browser",
      "uBlock Origin"
    ],
    "category": "进阶玩法",
    "subcategory": "版本资讯",
    "title": "Tails 7.17.1 紧急更新，暂时移除 uBlock Origin",
    "description": "Tails 7.17.1 暂时移除预装的 uBlock Origin。了解更新影响、适用版本，以及如何升级并保留持久存储。",
    "author": "翻墙123",
    "tag": "版本资讯",
    "example": false,
    "art": "tails-7-17-1-v1-cover",
    "articleArt": "tails-7-17-1",
    "artlabel": "Tails 7.17.1 版本文字与启动 U 盘。",
    "href": "/articles/tails-7-17-1.html",
    "date": "2026-11-22"
  },
  {
    "id": "clash-verge-rev-setup",
    "topics": [
      "Clash Verge Rev",
      "Windows",
      "订阅"
    ],
    "category": "新手入门",
    "title": "Clash Verge Rev 使用教程：Windows 第一次连接",
    "description": "在 Windows 安装 Clash Verge Rev，用本站免费节点导入订阅、选节点并打开系统代理。",
    "author": "翻墙123",
    "tag": "新手入门",
    "art": "clash-verge-rev-setup-v1-cover",
    "articleArt": "clash-verge-rev-setup",
    "artlabel": "粉紫猫脸图标与 Clash Verge Rev、Windows 首次连接字样。",
    "example": false,
    "href": "/articles/clash-verge-rev-setup.html",
    "date": "2026-11-22"
  },
  {
    "id": "v2rayn-setup",
    "topics": [
      "v2rayN",
      "Windows",
      "订阅"
    ],
    "category": "新手入门",
    "title": "v2rayN 使用教程：Windows 导入订阅并连接",
    "description": "在 Windows 解压 v2rayN，添加订阅分组、更新节点并启用系统代理。",
    "author": "翻墙123",
    "tag": "新手入门",
    "art": "v2rayn-setup-v1-cover",
    "articleArt": "v2rayn-setup",
    "artlabel": "蓝色圆形 v2rayN 图标与 Windows 订阅分组字样。",
    "example": false,
    "href": "/articles/v2rayn-setup.html",
    "date": "2026-11-22"
  },
  {
    "id": "shadowrocket-setup",
    "topics": [
      "Shadowrocket",
      "iPhone",
      "订阅"
    ],
    "category": "新手入门",
    "title": "Shadowrocket 使用教程：iPhone 导入订阅并连接",
    "description": "在 iPhone 上安装 Shadowrocket，用本站的 iOS 导入入口添加订阅并完成第一次连接。",
    "author": "翻墙123",
    "tag": "新手入门",
    "art": "shadowrocket-setup-v1-cover",
    "articleArt": "shadowrocket-setup",
    "artlabel": "蓝紫火箭图标与 Shadowrocket、iPhone 导入与连接字样。",
    "example": false,
    "href": "/articles/shadowrocket-setup.html",
    "date": "2026-11-22"
  },
  {
    "id": "flclash-setup",
    "topics": [
      "FlClash",
      "Android",
      "订阅"
    ],
    "category": "新手入门",
    "title": "FlClash 使用教程：Android 导入配置并连接",
    "description": "在 Android 安装 FlClash，从本站导入 Clash 配置并完成第一次连接。",
    "author": "翻墙123",
    "tag": "新手入门",
    "art": "flclash-setup-v1-cover",
    "articleArt": "flclash-setup",
    "artlabel": "蓝紫斜线和圆点图标与 FlClash、Android 导入配置字样。",
    "example": false,
    "href": "/articles/flclash-setup.html",
    "date": "2026-11-22"
  },
  {
    "id": "v2rayng-setup",
    "topics": [
      "v2rayNG",
      "Android",
      "订阅"
    ],
    "category": "新手入门",
    "title": "v2rayNG 使用教程：Android 导入订阅并连接",
    "description": "在 Android 安装 v2rayNG，导入订阅、选节点并按系统提示连接。",
    "author": "翻墙123",
    "tag": "新手入门",
    "art": "v2rayng-setup-v1-cover",
    "articleArt": "v2rayng-setup",
    "artlabel": "黑色 V 形图标与 v2rayNG、Android 选中节点字样。",
    "example": false,
    "href": "/articles/v2rayng-setup.html",
    "date": "2026-11-22"
  },
  {
    "id": "hiddify-setup",
    "topics": [
      "Hiddify",
      "Android",
      "订阅"
    ],
    "category": "新手入门",
    "title": "Hiddify 使用教程：Android 导入订阅并试连",
    "description": "在 Android 安装 Hiddify，用本站入口导入订阅，再从首页发起连接。",
    "author": "翻墙123",
    "tag": "新手入门",
    "art": "hiddify-setup-v1-cover",
    "articleArt": "hiddify-setup",
    "artlabel": "蓝色阶梯图标与 Hiddify、Android 导入与连接字样。",
    "example": false,
    "href": "/articles/hiddify-setup.html",
    "date": "2026-11-22"
  },
  {
    "id": "genie-4-project-genie",
    "topics": ["AI", "Genie", "Google"],
    "category": "进阶玩法",
    "subcategory": "其他",
    "title": "Google 推送 Genie 4：在生成的世界里边走边改",
    "description": "Google 将 Genie 4 推向 Project Genie、Google AI Studio 和 Gemini API。了解边探索边改场景的新玩法，以及各入口的开放范围。",
    "author": "翻墙123",
    "tag": "AI",
    "example": false,
    "art": "genie-4-project-genie-v1-cover",
    "articleArt": "genie-4-project-genie",
    "artlabel": "背着背包的行人走在同一条街上，街景从暖色晴天过渡到蓝色雨夜。",
    "href": "/articles/genie-4-project-genie.html",
    "date": "2026-11-21"
  },
  {
    "id": "manual-subscription-import",
    "topics": ["Windows", "Clash Verge Rev", "订阅"],
    "category": "新手入门",
    "title": "一键导入没反应？试试复制订阅链接",
    "description": "网页点了一键导入却没打开客户端？用本站免费节点，在 Windows 上手动把订阅导入 Clash Verge Rev。",
    "author": "翻墙123",
    "tag": "新手入门",
    "art": "manual-subscription-import-v1-cover",
    "articleArt": "manual-subscription-import",
    "artlabel": "网页上的订阅链接复制成一张珊瑚色卡片，沿轨道送入客户端，屏幕显示绿色对勾。",
    "example": false,
    "href": "/articles/manual-subscription-import.html",
    "date": "2026-11-21"
  },
  {
    "id": "subscription-privacy",
    "topics": ["隐私安全", "订阅"],
    "category": "进阶玩法",
    "subcategory": "隐私安全",
    "title": "订阅链接怎么保护？截图、转换和泄露后的处理",
    "description": "截图求助该遮哪里，订阅转换怎么选，链接误发后如何补救？用三个常见场景保护你的私人订阅。",
    "author": "翻墙123",
    "tag": "隐私安全",
    "art": "subscription-privacy-v1-cover",
    "articleArt": "subscription-privacy",
    "artlabel": "妥善保管私人订阅链接、二维码与节点凭据",
    "example": false,
    "href": "/articles/subscription-privacy.html",
    "date": "2026-11-17"
  },
  {
    "id": "gemini-4-hydrogen",
    "topics": ["AI", "Gemini", "Google"],
    "category": "进阶玩法",
    "subcategory": "其他",
    "title": "Gemini 4 Hydrogen 发布：日常任务提速，搜索同步升级",
    "description": "Google 发布 Gemini 4 Hydrogen，重点提升日常任务执行效率，并同步升级搜索。了解模型定位、主要变化、免费账号开放方式及开发者入口。",
    "author": "翻墙123",
    "tag": "AI",
    "art": "gemini-4-hydrogen-v2-cover",
    "articleArt": "gemini-4-hydrogen",
    "artlabel": "Gemini 4 Hydrogen 日常 AI 新升级",
    "example": false,
    "href": "/articles/gemini-4-hydrogen.html",
    "date": "2026-11-17"
  },
  {
    "id": "clash-verge-2-5-10",
    "topics": ["Clash", "Clash Verge Rev", "版本更新"],
    "category": "进阶玩法",
    "subcategory": "版本资讯",
    "title": "Clash Verge Rev 2.5.10 更新了什么？",
    "description": "全局模式选不了出口、DNS 开关状态不对、Windows 覆盖安装失败？看看 Clash Verge Rev 2.5.10 的修复，再从本站下载更新。",
    "author": "翻墙123",
    "tag": "版本资讯",
    "art": "clash-verge-2-5-10-v1-cover",
    "articleArt": "clash-verge-2-5-10",
    "artlabel": "Clash Verge Rev 版本更新",
    "example": false,
    "href": "/articles/clash-verge-2-5-10.html",
    "date": "2026-11-17"
  },
  {
    "id": "three-steps",
    "topics": [
      "节点",
      "订阅"
    ],
    "category": "新手入门",
    "title": "开始翻墙，总共分三步",
    "description": "用本站免费节点，跟着截图完成获取节点、安装客户端、一键导入。以 Windows 和 Clash Verge Rev 为例。",
    "author": "翻墙123",
    "tag": "新手入门",
    "art": "three-steps-workshop",
    "articleArt": "three-steps",
    "artlabel": "开始翻墙，总共分三步：获取订阅、安装客户端、导入并连接",
    "example": false,
    "href": "/articles/three-steps.html",
    "date": "2026-11-16"
  },
  {
    "id": "clash-rule-global",
    "topics": [
      "Clash",
      "规则分流"
    ],
    "category": "进阶玩法",
    "subcategory": "规则分流",
    "title": "Clash 规则模式和全局模式怎么选？",
    "description": "Clash Verge Rev 的规则、全局、直连有什么区别？用一张对照表看懂日常选择，再排查全局能用、规则打不开的问题。",
    "author": "翻墙123",
    "tag": "规则分流",
    "art": "clash-rule-global-v4-cover",
    "articleArt": "clash-rule-global",
    "artlabel": "从列车车窗望出去，铁轨在草地旁分向两条路线",
    "example": false,
    "href": "/articles/clash-rule-global.html",
    "date": "2026-11-16"
  },
  {
    "id": "client-guide",
    "pinned": true,
    "topics": [
      "客户端",
      "Clash",
      "sing-box",
      "Windows",
      "macOS",
      "Android",
      "iOS",
      "Linux",
      "路由器",
      "Shadowrocket"
    ],
    "category": "新手入门",
    "title": "客户端指南",
    "description": "按 Windows、macOS、Android、iOS、Linux 和路由器筛选，比较客户端的亮点、短板和推荐指数，找到适合自己设备的软件。",
    "author": "翻墙123",
    "tag": "新手入门",
    "art": "client-guide-v1-cover",
    "artlabel": "客户端指南：电脑、手机和路由器分别搭配可选的软件卡片，按设备选对客户端",
    "example": false,
    "href": "/clients/",
    "date": "2026-11-17"
  }
]

export const visibleArticleIds = Object.freeze(articles.map(article => article.id))
export const visibleArticles = articles
