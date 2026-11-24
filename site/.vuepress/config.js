import { fileURLToPath } from 'node:url'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'

const base = process.env.fanqiang123_SITE_BASE || '/'
const apiOrigin = process.env.VITE_fanqiang123_API_ORIGIN || ''
const analyticsId = process.env.NODE_ENV === 'production'
  ? '78efe88a-e0df-4435-bf4c-5fc1270be407'
  : ''
if (apiOrigin && new URL(apiOrigin).origin !== apiOrigin) {
  throw new Error('VITE_fanqiang123_API_ORIGIN must be an origin without a trailing slash or path')
}

export const siteConfig = {
  base,
  alias: {
    '@theme/VPFadeSlideYTransition.vue': fileURLToPath(new URL('./components/PageTransition.vue', import.meta.url)),
  },
  templateBuild: fileURLToPath(new URL('./build.html', import.meta.url)),
  lang: 'zh-CN',
  title: '翻墙123',
  description: '翻墙教程、工具资讯、免费节点与机场信息，连接更大的世界。',
  head: [
    ['link', { rel: 'icon', href: `${base}logo-plane.svg` }],
    ...(analyticsId ? [['script', {
      defer: true,
      src: 'https://umami.gemcook.net/script.js',
      'data-website-id': analyticsId,
      'data-domains': 'fanqiang123.com,www.fanqiang123.com',
    }]] : []),
  ],
  extendsMarkdown(md) {
    const rules = md.renderer.rules
    const openTable = rules.table_open
    const closeTable = rules.table_close
    rules.table_open = (tokens, index, options, env, renderer) => {
      const table = openTable?.(tokens, index, options, env, renderer)
        ?? renderer.renderToken(tokens, index, options)
      return env.frontmatter?.layout === 'PortalLayout' ? '<div class="article-table">' + table : table
    }
    rules.table_close = (tokens, index, options, env, renderer) => {
      const table = closeTable?.(tokens, index, options, env, renderer)
        ?? renderer.renderToken(tokens, index, options)
      return env.frontmatter?.layout === 'PortalLayout' ? table + '</div>\n' : table
    }
  },
  bundler: viteBundler(),
  theme: defaultTheme({
    themePlugins: { backToTop: false },
    navbar: [{ text: '首页', link: '/' }, { text: '开始阅读', link: '/guide/' }],
    sidebar: { '/guide/': [
      { text: '文档', children: ['/guide/', '/guide/writing', '/guide/structure'] },
    ] },
    editLink: false,
    contributors: false,
    lastUpdated: false,
    colorMode: 'auto',
    colorModeSwitch: true,
    sidebarDepth: 2,
    tip: '提示', warning: '注意', danger: '警告',
    notFound: ['这一页还没有写好，先回首页看看吧。'],
    backToHome: '返回首页',
  }),
}

export default defineUserConfig({
  ...siteConfig,
  pagePatterns: ['**/*.md', '!.vuepress', '!style/**'],
})
