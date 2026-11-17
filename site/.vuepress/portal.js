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
    "art": "clash-rule-global",
    "articleArt": "clash-rule-global",
    "artlabel": "Clash 规则模式和全局模式怎么选，电脑通过切换装置选择连接路线",
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
