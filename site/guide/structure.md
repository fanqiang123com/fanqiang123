# 组织站点

翻墙123 将公开内容与内部维护文档分开存放。

## 内容目录

```text
site/
├── README.md          首页
├── guide/             文档内容
└── .vuepress/
    ├── config.js      站点配置
    ├── public/        图片与静态文件
    └── styles/        主题样式
```

## 导航与侧栏

顶部导航适合放置主要栏目；侧栏适合组织栏目中的文章。两者都在 `site/.vuepress/config.js` 中配置。

## 图片与静态文件

将图片放入 `site/.vuepress/public/`，然后通过根路径引用。例如 `public/logo.svg` 对应 `/logo.svg`。

## 接下来

将示例文档替换为你的实际内容，也可以按主题添加更多栏目。建议每个栏目保留一个清晰的入口页面。
