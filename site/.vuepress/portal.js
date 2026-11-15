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
  AI资讯: 'ai',
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
  { name: '免费节点', to: '/nodes/', icon: 'nodes', color: 'mint', description: '获取 Clash、V2Ray 和 sing-box 的免费订阅。' },
  { name: '免费小火箭 ID', to: '/tools/shadowrocket-id/', icon: 'mobile', color: 'blue', description: '查看供小火箭（Shadowrocket）使用的共享 ID。' },
  { name: '客户端下载', to: '/tools/downloads/', icon: 'download', color: 'purple', description: '按系统查找客户端安装包与 App Store 入口。' },
]

export const articles = [
  {
    "id": "xxyun-budget-guide",
    "topics": [
      "机场",
      "订阅"
    ],
    "category": "机场信息",
    "title": "XXYUN 机场使用指南：套餐介绍、通用订阅与客户端设置",
    "description": "了解 XXYUN 的套餐与服务特点，按设备选择客户端，完成订阅导入与首次连接。",
    "tag": "使用指南 · 对照稿",
    "art": "review-editorial",
    "artlabel": "机场服务使用指南",
    "example": false,
    "href": "/articles/xxyun-budget-guide.html",
    "date": "2026-11-14"
  },
  {
    "id": "start",
    "topics": ["节点", "订阅"],
    "category": "新手入门",
    "title": "从零开始：一篇看懂翻墙工具、节点与订阅",
    "description": "刚接触科学上网？从基本概念到选择客户端，把第一步走明白。",
    "tag": "入门指南",
    "art": "beginner-matte",
    "artlabel": "番土123 从零开始：翻墙工具、节点与订阅，哑光立体场景封面",
    "en": "START HERE",
    "href": "/articles/start.html",
    "date": "2026-10-29"
  },
  {
    "id": "clash",
    "topics": ["Clash", "订阅", "规则"],
    "category": "新手入门",
    "title": "Clash 客户端入门：导入订阅与基础设置",
    "description": "理清订阅导入、策略组选择与规则模式，少走一些弯路。",
    "tag": "Windows / macOS",
    "art": "clash-matte-watermark",
    "artlabel": "番土123 Clash 客户端入门：导入订阅与基础设置，哑光立体工作台封面，番土123与fanqiang123.com文字水印",
    "en": "CLIENT GUIDE",
    "href": "/articles/clash.html",
    "date": "2026-10-29"
  },
  {
    "id": "nodes",
    "topics": ["节点", "订阅"],
    "category": "新手入门",
    "title": "免费节点怎么用？从获取配置到排查连接问题",
    "description": "了解节点格式、导入方法与失效排查，合理看待免费资源。",
    "tag": "节点指南",
    "art": "nodes",
    "artlabel": "免费节点",
    "en": "FREE NODES",
    "href": "/articles/nodes.html",
    "date": "2026-10-29"
  },
  {
    "id": "review",
    "topics": ["机场"],
    "category": "机场信息",
    "title": "机场怎么选？先看懂一份测评的六个维度",
    "description": "速度只是一个指标。线路、稳定性、解锁和售后，同样值得关注。",
    "tag": "选购参考",
    "art": "review-editorial",
    "artlabel": "机场信息",
    "en": "INDEPENDENT REVIEW",
    "href": "/articles/review.html",
    "date": "2026-10-29"
  },
  {
    "id": "singbox",
    "topics": ["sing-box"],
    "category": "新手入门",
    "title": "认识 sing-box：一个配置中的几个关键部分",
    "description": "从入站、出站到路由，建立理解配置文件的基本框架。",
    "tag": "工具入门",
    "art": "singbox",
    "artlabel": "sing-box",
    "en": "TOOLKIT",
    "href": "/articles/singbox.html",
    "date": "2026-10-29"
  },
  {
    "id": "rules",
    "topics": ["规则"],
    "category": "进阶玩法",
    "subcategory": "规则分流",
    "title": "规则分流入门：让合适的流量走合适的线路",
    "description": "弄懂直连、代理和策略组之间的关系，建立自己的分流思路。",
    "tag": "进阶知识",
    "art": "rules",
    "artlabel": "规则分流",
    "en": "ROUTING",
    "href": "/articles/rules.html",
    "date": "2026-10-29"
  },
  {
    "id": "check",
    "topics": [],
    "category": "进阶玩法",
    "subcategory": "版本资讯",
    "title": "关注客户端更新，除了版本号还应该看什么",
    "description": "在升级前检查发行说明、配置兼容与回退方法。",
    "tag": "工具观察",
    "art": "update",
    "artlabel": "工具资讯",
    "en": "UPDATES",
    "href": "/articles/check.html",
    "date": "2026-10-29"
  },
  {
    "id": "speed",
    "topics": ["机场"],
    "category": "机场信息",
    "title": "怎样读懂测速结果？延迟、带宽与晚高峰",
    "description": "不同测试条件下的数据不能直接画等号，先看方法，再看结论。",
    "tag": "测评方法",
    "art": "speed",
    "artlabel": "测速解读",
    "en": "BENCHMARK",
    "href": "/articles/speed.html",
    "date": "2026-10-29"
  },
  {
    "id": "privacy",
    "topics": ["节点"],
    "category": "进阶玩法",
    "subcategory": "隐私安全",
    "title": "使用公共节点时，哪些信息需要格外留意",
    "description": "理解加密连接、服务提供方与账号安全之间的边界。",
    "tag": "使用常识",
    "art": "privacy",
    "artlabel": "隐私与连接",
    "en": "CONNECTION",
    "href": "/articles/privacy.html",
    "date": "2026-10-29"
  },
  {
    "id": "gemini-4-carbon",
    "topics": ["AI"],
    "category": "进阶玩法",
    "subcategory": "AI资讯",
    "title": "Google 开放 Gemini 4 Carbon，哪些用户可以用？",
    "description": "Google 公布了 Gemini 4 Carbon 的开放范围，覆盖 Google AI Ultra 订阅和付费 API。",
    "tag": "AI 模型发布",
    "example": false,
    "art": "gemini-carbon-flat",
    "artlabel": "Gemini 4 Carbon 开放使用：AI Ultra 与付费 API",
    "href": "/articles/gemini-4-carbon.html",
    "date": "2026-11-10"
  }
]

// Temporary editorial selection for comparing category cover styles.
// Keep the full catalog and article URLs for reversible hiding.
export const visibleArticleIds = Object.freeze(['start', 'clash', 'gemini-4-carbon', 'review', 'xxyun-budget-guide'])
export const visibleArticles = articles.filter(article => visibleArticleIds.includes(article.id))
