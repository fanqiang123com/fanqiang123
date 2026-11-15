<script setup>
import { computed, nextTick, ref, watch, onMounted, onUnmounted } from 'vue'
import { RouteLink, Content, usePageData, useRoute, useRouter, withBase } from 'vuepress/client'
import { advancedSubcategoryIcons, articleCategories, articleCategoryIcons, articles as allArticles, visibleArticles as articles, legacyArticleCategories, toolResources } from '../portal.js'
import TopicArt from './TopicArt.vue'
import PortalIcon from './PortalIcon.vue'
import HeaderActions from './HeaderActions.vue'
import HomeCarousel from './HomeCarousel.vue'
import ClientDownloads from './ClientDownloads.vue'
import ClientGuide from './ClientGuide.vue'
import FreeResources from './FreeResources.vue'
import AirportOffers from './AirportOffers.vue'
import ArticleReadCount from './ArticleReadCount.vue'
import ArticleContents from './ArticleContents.vue'
import { portalApiUrl } from '../portal-api.js'

const detailArticle = ref(null)
const route = useRoute(), router = useRouter(), page = usePageData()
const section = computed(() => page.value.frontmatter.section || '')
const monthlyCounts = ref(null)
const airportNews = ref([])
const airportNewsLoaded = ref(false)
const requestedNewsId = computed(() => route.path === '/' && typeof route.query['airport-article'] === 'string'
  ? route.query['airport-article'] : '')
const current = computed(() => requestedNewsId.value
  ? airportNews.value.find(article => article.id === requestedNewsId.value)
  : allArticles.find(article => article.id === page.value.frontmatter.articleId))
async function loadAirportNews() {
  try {
    const response = await fetch(withBase('/airport-news.json'), { cache: 'no-cache' })
    if (!response.ok) return
    const snapshot = await response.json()
    if (snapshot?.schema !== 1 || !Array.isArray(snapshot.articles)) return
    airportNews.value = snapshot.articles.filter(article =>
      typeof article?.title === 'string' && typeof article.date === 'string'
      && typeof article.bodyHtml === 'string' && article.bodyHtml.trim()
      && /^\d{4}-\d{2}-\d{2}$/.test(article.date)
      && /^https:\/\/www\.ermao\.net\/(?:blog|article|posts)\/[\w%./-]+$/.test(article.url),
    ).map(article => ({
      id: new URL(article.url).pathname,
      href: '/?airport-article=' + encodeURIComponent(new URL(article.url).pathname),
      sourceUrl: article.url,
      bodyHtml: article.bodyHtml,
      title: article.title,
      date: article.date,
      category: '机场信息',
      topics: ['机场'],
      tag: '机场推荐',
      art: 'review-editorial',
      example: false,
    }))
  } catch { /* The local catalog remains available when the snapshot cannot be loaded. */ }
  finally { airportNewsLoaded.value = true }
}
const isLocalPreview = import.meta.env.DEV
const recommendationAnchor = ref(null)
const recommendationResult = ref(null)
const articlesById = new Map(articles.map(article => [article.id, article]))
const editorialPicks = ['start', 'gemini-4-carbon', 'review'].map(id => articlesById.get(id)).filter(Boolean)
const lastArticleKey = 'fanqiang123:last-article'
const readingSessionDuration = 30 * 60 * 1000
let lastArticle = null
let pendingReads = Promise.resolve()

function updateReads(articleId) {
  const now = Date.now()
  const previousId = lastArticle && now - lastArticle.at < readingSessionDuration ? lastArticle.id : null
  const anchor = articleId ?? previousId
  recommendationAnchor.value = anchor
  if (articleId) {
    lastArticle = { id: articleId, at: now }
    try { sessionStorage.setItem(lastArticleKey, JSON.stringify(lastArticle)) } catch { /* Keep the in-memory session. */ }
  }

  const endpoint = portalApiUrl('/api/article-reads')
  pendingReads = pendingReads.then(async () => {
    const response = articleId
      ? await fetch(`${endpoint}/${articleId}`, {
        method: 'POST',
        keepalive: true,
        headers: {
          'X-fanqiang123-Article-View': '1',
          ...(previousId && previousId !== articleId ? { 'X-fanqiang123-Previous-Article': previousId } : {}),
        },
      })
      : await fetch(anchor ? `${endpoint}?from=${encodeURIComponent(anchor)}` : endpoint)
    if (!response.ok) return
    const data = await response.json()
    monthlyCounts.value = data.counts
    if (anchor === recommendationAnchor.value) {
      recommendationResult.value = { anchor, ids: data.recommendations ?? [] }
    }
  }).catch(() => {
    // Keep the last successful counts when the local service is unavailable.
  })
}

function readCount(id) {
  return monthlyCounts.value ? (monthlyCounts.value[id] ?? 0) : null
}

const monthlyRanking = computed(() => articles
  .map(article => ({ article, count: readCount(article.id) }))
  .filter(entry => entry.count > 0)
  .sort((a, b) => b.count - a.count)
  .slice(0, 5))
const recommendedArticles = computed(() => {
  const limit = 6
  const anchor = current.value ?? articlesById.get(recommendationAnchor.value)
  if (!anchor) return editorialPicks.slice(0, limit)

  const result = recommendationResult.value
  const observed = result?.anchor === anchor.id ? result.ids.map(id => articlesById.get(id)).filter(Boolean) : []
  const related = articles.map(article => ({
    article,
    relevance: Number(article.category === anchor.category)
      + Number(Boolean(anchor.subcategory) && article.subcategory === anchor.subcategory)
      + (article.topics ?? []).filter(topic => anchor.topics?.includes(topic)).length * 2,
  })).filter(entry => entry.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .map(entry => entry.article)

  const ranked = [...observed, ...related, ...editorialPicks]
  if (current.value) ranked.push(...articles)

  return [...new Set(ranked)]
    .filter(article => article.id !== anchor.id)
    .slice(0, limit)
})
const sidebarArticleLists = computed(() => [
  { title: '本月阅读榜', className: 'monthly-reading', list: 'ol', entries: monthlyRanking.value },
  { title: '猜你想看', className: 'popular-box', list: 'ul', entries: recommendedArticles.value.map(article => ({ article })) },
])
function restoreLastArticle() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(lastArticleKey))
    if (articlesById.has(saved?.id) && Number.isFinite(saved.at) && saved.at <= Date.now()) lastArticle = saved
  } catch { /* A fresh session starts with the editorial picks. */ }
}

function resumeCachedPage(event) {
  if (!event.persisted) return
  restoreLastArticle()
  updateReads(current.value?.sourceUrl ? undefined : current.value?.id)
}

onMounted(() => {
  loadAirportNews()
  restoreLastArticle()
  window.addEventListener('pageshow', resumeCachedPage)
  watch(() => page.value.path, () => updateReads(current.value?.sourceUrl ? undefined : current.value?.id), { immediate: true })
})
onUnmounted(() => window.removeEventListener('pageshow', resumeCachedPage))
function resolveCategory(value) {
  const name = String(value || '全部').trim().replace(/。$/, '')
  return Object.hasOwn(legacyArticleCategories, name) ? legacyArticleCategories[name] : name
}
const primaryCategory = computed(() => resolveCategory(route.query.category))
const isAdvancedCategory = computed(() => primaryCategory.value === '进阶玩法')
const category = computed(() => primaryCategory.value === '全部'
  ? resolveCategory(route.query.filter)
  : primaryCategory.value)
const subcategory = computed(() => isAdvancedCategory.value && typeof route.query.subcategory === 'string' && Object.hasOwn(advancedSubcategoryIcons, route.query.subcategory)
  ? route.query.subcategory
  : '全部')
const showArticleCategory = computed(() => (isAdvancedCategory.value ? subcategory.value : category.value) === '全部')
const advancedTabIcons = { 全部: 'grid', ...advancedSubcategoryIcons }
const q = ref(String(route.query.q || ''))
const activeQ = computed(() => String(route.query.q || '').toLowerCase())
const count = ref(4)
const categoryIcons = { 全部: 'grid', ...articleCategoryIcons }
const categories = Object.keys(categoryIcons)
const catalog = computed(() => [...articles, ...airportNews.value])
const topicCounts = computed(() => {
  const counts = new Map()
  for (const article of catalog.value) {
    for (const tag of article.topics ?? []) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return counts
})
const topics = computed(() => ['Clash', '节点', '机场', '规则', 'sing-box', '订阅', 'AI']
  .filter(tag => topicCounts.value.has(tag)))
const activeTag = computed(() => topicCounts.value.has(route.query.tag) ? route.query.tag : '')
const filtered = computed(() => catalog.value.filter(a =>
  (category.value === '全部' || a.category === category.value)
  && (subcategory.value === '全部' || a.subcategory === subcategory.value)
  && (!activeTag.value || a.topics?.includes(activeTag.value))
  && (!activeQ.value || [a.title, a.description, a.tag, ...(a.topics ?? [])].join(' ').toLowerCase().includes(activeQ.value)),
).sort((a, b) => b.date.localeCompare(a.date)))
const showHomeIntro = computed(() => !section.value && !current.value && !route.query.category && !activeQ.value)
const goCategory = c => router.push({path:'/',query:c === '全部' ? {} : {category:c}})
const currentSubcategoryLink = computed(() => current.value && Object.hasOwn(advancedSubcategoryIcons, current.value.subcategory)
  ? router.resolve({ path: '/', query: { category: current.value.category, subcategory: current.value.subcategory } }).fullPath
  : null)
function filterCategory(value) {
  const query = { ...route.query }
  if (value === '全部') delete query.filter
  else query.filter = value
  return router.push({ path: '/', query })
}
function filterSubcategory(value) {
  const query = { ...route.query }
  if (value === '全部') delete query.subcategory
  else query.subcategory = value
  return router.push({ path: '/', query })
}
function topicLink(tag) {
  const query = current.value ? { tag } : { ...route.query, tag }
  return router.resolve({ path: '/', query, hash: current.value ? '' : route.hash }).fullPath
}
function clearTag() {
  const query = { ...route.query }
  delete query.tag
  return router.push({ path: '/', query, hash: route.hash })
}
function search() {
  const query = { ...route.query }
  if (q.value.trim()) query.q = q.value.trim()
  else delete query.q
  return router.push({ path: '/', query })
}
const mobilePanel = ref('')
const mobileQuery = ref('')
const mobileSearchInput = ref(null)
const mobileSearchButton = ref(null)
const mobileMenuButton = ref(null)
watch(() => route.fullPath, () => {
  q.value = String(route.query.q || '')
  count.value = 4
  mobilePanel.value = ''
})

async function toggleMobilePanel(panel) {
  mobilePanel.value = mobilePanel.value === panel ? '' : panel
  if (mobilePanel.value !== 'search') return
  mobileQuery.value = q.value
  await nextTick()
  mobileSearchInput.value?.focus()
}

function closeMobilePanel() {
  if (!mobilePanel.value) return
  const trigger = mobilePanel.value === 'search' ? mobileSearchButton : mobileMenuButton
  mobilePanel.value = ''
  trigger.value?.focus()
}

function submitMobileSearch() {
  const query = mobileQuery.value.trim()
  mobilePanel.value = ''
  return router.push({ path: '/', query: query ? { q: query } : {} })
}
const nav = [
  ...articleCategories.map(category => ({ name: category, category, icon: articleCategoryIcons[category] })),
  { name: '工具资源', to: '/tools/', icon: 'toolkit' },
]
const inToolResources = computed(() => ['tools', 'nodes', 'shadowrocket-id', 'downloads'].includes(section.value))
const selectedArticleCategory = computed(() => {
  if (section.value === 'clients') return '新手入门'
  if (section.value) return ''
  return current.value?.category ?? (requestedNewsId.value ? '机场信息' : primaryCategory.value)
})
</script>

<template>
<div class="fq-site" :class="{ 'fq-article-page': current || requestedNewsId || section === 'client-setup' }">
<a href="#fq-main" class="fq-skip">跳到主要内容</a>

<header class="fq-header" @keydown.esc="closeMobilePanel">
  <div class="fq-wrap header-row">
    <RouteLink to="/" class="fq-logo" aria-label="翻墙123 首页" @click="mobilePanel = ''">
      <strong>翻墙<span>123</span></strong>
    </RouteLink>
    <div class="mobile-header-controls">
      <button ref="mobileSearchButton" type="button" aria-label="搜索" aria-controls="mobile-site-search"
        :aria-expanded="mobilePanel === 'search'" @click="toggleMobilePanel('search')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 5 5"/></svg>
      </button>
      <button ref="mobileMenuButton" type="button" aria-label="主菜单" aria-controls="site-header-menu"
        :aria-expanded="mobilePanel === 'menu'" @click="toggleMobilePanel('menu')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
          <path :d="mobilePanel === 'menu' ? 'm6 6 12 12 M18 6 6 18' : 'M3 5h18 M8 12h13 M5 19h16'"/>
        </svg>
      </button>
    </div>
    <div id="site-header-menu" class="site-header-menu" :class="{ 'is-open': mobilePanel === 'menu' }">
      <nav aria-label="主导航">
        <template v-for="n in nav" :key="n.name">
          <RouteLink v-if="n.to" :to="n.to" :class="{active:inToolResources}" @click="mobilePanel = ''">
            <PortalIcon class="category-icon" :type="n.icon"/>{{ n.name }}
          </RouteLink>
          <button v-else type="button" :class="{active:selectedArticleCategory===n.category}"
            :aria-current="selectedArticleCategory===n.category ? 'true' : undefined"
            @click="mobilePanel = ''; goCategory(n.category)">
            <PortalIcon class="category-icon" :type="n.icon"/>{{ n.name }}
          </button>
        </template>
      </nav>
      <HeaderActions/>
    </div>
    <form v-show="mobilePanel === 'search'" id="mobile-site-search" class="mobile-site-search" role="search" @submit.prevent="submitMobileSearch">
      <input ref="mobileSearchInput" v-model="mobileQuery" type="search" aria-label="搜索全站文章" placeholder="搜索教程、客户端或协议">
      <button type="submit">搜索</button>
    </form>
  </div>
</header>
<main id="fq-main" class="fq-wrap">
<div v-if="requestedNewsId && !current" class="empty-state" role="status">
  <p>{{ airportNewsLoaded ? '找不到这篇文章' : '正在加载文章…' }}</p>
  <button v-if="airportNewsLoaded" @click="goCategory('机场信息')">返回机场信息</button>
</div>
<template v-else-if="!current && !section">

<template v-if="showHomeIntro">
<section class="portal-hero" aria-label="精选内容">
<HomeCarousel/>
<nav class="entry-grid" aria-label="快速入口">
  <RouteLink :to="articles[0].href"><span class="entry-icon blue"><PortalIcon type="beginner"/></span><div><h2>我是新手</h2><p>从基础概念到第一次连接</p></div><span aria-hidden="true">→</span></RouteLink>
  <RouteLink to="/clients/">
    <span class="entry-icon purple"><PortalIcon type="clash"/></span>
    <div><h2>客户端选择困难？看看评分。</h2><p>客户端指南</p></div>
    <span aria-hidden="true">→</span>
  </RouteLink>
  <RouteLink to="/airport-offers/"><span class="entry-icon orange"><PortalIcon type="review"/></span><div><h2>获取机场优惠码</h2><p>查看套餐价格、流量和优惠码</p></div><span aria-hidden="true">→</span></RouteLink>
  <RouteLink to="/nodes/"><span class="entry-icon mint"><PortalIcon type="nodes"/></span><div><h2>免费节点</h2><p>节点信息与订阅使用指南</p></div><span aria-hidden="true">→</span></RouteLink>
</nav>
</section>
<aside v-if="isLocalPreview" class="home-ad" aria-label="广告">
  <a class="home-ad-link" href="http://hn.loc/" aria-label="广告：HardNerd 机房网络服务">
    <picture>
      <source media="(max-width: 640px)" :srcset="withBase('/ads/hardnerd-mobile.webp')" width="885" height="144">
      <img :src="withBase('/ads/hardnerd-wide.webp')" alt="HardNerd 机房网络服务" width="2172" height="156">
    </picture>
    <span class="home-ad-label">广告</span>
  </a>
</aside>
</template>
<div class="portal-body"><section id="article-feed" class="article-feed">
  <div v-if="activeQ || activeTag" class="block-heading">
    <h2 class="section-heading category-label">
      {{ activeTag ? '# ' + activeTag : '搜索结果' }}
    </h2>
    <button v-if="activeTag" class="clear-topic" type="button" @click="clearTag">清除标签</button>
  </div>
  <form class="portal-search" role="search" @submit.prevent="search"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 5 5"/></svg><input v-model="q" type="search" aria-label="搜索教程与资讯" placeholder="搜索教程、客户端或协议"><button type="submit">搜索 <span>↵</span></button></form>
  <div v-if="isAdvancedCategory" class="filter-tabs subcategory-tabs" role="group" aria-label="进阶玩法子分类">
    <button
      v-for="(icon, tab) in advancedTabIcons"
      :key="tab"
      type="button"
      class="category-label"
      :class="{ selected: subcategory === tab }"
      :aria-pressed="subcategory === tab"
      @click="filterSubcategory(tab)"
    ><PortalIcon class="category-icon" :type="icon"/>{{ tab }}</button>
  </div>
  <div v-else-if="primaryCategory === '全部'" class="filter-tabs" role="group" aria-label="内容分类"><button v-for="c in categories" :key="c" :class="{selected:category===c}" class="category-label" :aria-pressed="category===c" @click="filterCategory(c)"><PortalIcon class="category-icon" :type="categoryIcons[c]"/>{{ c }}</button></div><div v-if="activeQ" class="result-note">「{{ route.query.q }}」的搜索结果<button @click="router.push('/')">清除 ×</button></div>
  <article v-for="a in filtered.slice(0, count)" :key="a.id" class="resource-story">
    <RouteLink :to="a.href" class="story-art" :aria-label="a.title">
      <TopicArt :type="a.art" :label="a.artlabel" small/>
    </RouteLink>
    <div class="resource-copy">
      <div v-if="showArticleCategory || a.topics?.length" class="resource-tags">
        <span v-if="showArticleCategory" class="category-label">
          <PortalIcon class="category-icon" :type="advancedSubcategoryIcons[a.subcategory] ?? articleCategoryIcons[a.category]"/>
          {{ a.subcategory || a.category }}
        </span>
        <RouteLink
          v-for="tag in a.topics"
          :key="tag"
          class="resource-topic"
          :to="topicLink(tag)"
          :aria-current="activeTag === tag ? 'true' : undefined"
        ># {{ tag }}</RouteLink>
      </div>
      <RouteLink :to="a.href"><h3>{{ a.title }}</h3></RouteLink>
      <p v-if="a.description">{{ a.description }}</p>
      <div class="resource-footer">
        <div class="resource-meta">
          <span>{{ a.sourceUrl ? '来源：二毛' : '翻墙123 编辑部' }}</span><i>·</i><span>{{ a.date }}</span>
        </div>
        <ArticleReadCount v-if="!a.sourceUrl" :count="readCount(a.id)"/>
      </div>
    </div>
  </article>
  <div v-if="!filtered.length" class="empty-state"><strong>还没有找到相关内容</strong><p>试试“Clash”“节点”或“机场”，或者查看全部内容。</p><button @click="router.push('/')">查看全部 →</button></div><button v-if="count<filtered.length" class="more-resources" @click="count+=4">发现更多内容 <span>↓</span></button><div v-else-if="filtered.length" class="feed-finish">你已读完当前列表</div></section>
<aside class="portal-rail">
<section v-for="group in sidebarArticleLists" :key="group.title" :class="group.className">
  <h2>{{ group.title }}</h2>
  <component :is="group.list" v-if="group.entries.length" class="rail-article-list" role="list">
    <li v-for="{ article, count } in group.entries" :key="article.id">
      <div class="rail-article-row">
        <RouteLink :to="article.href" class="rail-article-link">
          <TopicArt :type="article.art" small aria-hidden="true"/>
          <span>{{ article.title }}</span>
        </RouteLink>
        <ArticleReadCount v-if="count !== undefined" :count="count"/>
      </div>
    </li>
  </component>
  <p v-else>暂无本月阅读数据。</p>
</section>
<section class="topics-box">
  <h2>按标签查找</h2>
  <div>
    <RouteLink v-for="tag in topics" :key="tag" :to="topicLink(tag)"
      :aria-label="`${tag}，${topicCounts.get(tag)} 篇文章`" :aria-current="activeTag === tag ? 'true' : undefined">
      # {{ tag }} <span class="topic-count">{{ topicCounts.get(tag) }}</span>
    </RouteLink>
  </div>
</section></aside></div>
</template>

<section v-else-if="section==='tools'" class="tools-directory tools-index client-grid resource-list" aria-label="工具资源">
  <RouteLink v-for="resource in toolResources" :key="resource.to" :to="resource.to">
    <span class="client-monogram" :class="resource.color"><PortalIcon :type="resource.icon"/></span>
    <div><h2>{{ resource.name }}</h2><p>{{ resource.description }}</p></div>
    <i aria-hidden="true">→</i>
  </RouteLink>
</section>

<ClientDownloads v-else-if="section==='downloads'"/>

<FreeResources v-else-if="section==='nodes' || section==='shadowrocket-id'" :kind="section"/>

<ClientGuide v-else-if="section==='clients'"/>

<AirportOffers v-else-if="section==='airport-offers'"/>

<template v-else-if="section==='client-setup'">
  <nav class="section-breadcrumb article-breadcrumb" aria-label="面包屑">
    <RouteLink to="/">首页</RouteLink><span>/</span>
    <RouteLink to="/clients/">客户端指南</RouteLink>
  </nav>
  <article class="detail-article setup-article">
    <header class="article-heading"><h1>{{ page.title }}</h1></header>
    <Content class="detail-content"/>
  </article>
</template>

<template v-else-if="current">
  <nav class="section-breadcrumb article-breadcrumb" aria-label="面包屑">
    <RouteLink to="/">首页</RouteLink>
    <span aria-hidden="true">/</span>
    <RouteLink :to="'/?category=' + encodeURIComponent(current.category)">{{ current.category }}</RouteLink>
    <template v-if="currentSubcategoryLink">
      <span aria-hidden="true">/</span>
      <RouteLink :to="currentSubcategoryLink">{{ current.subcategory }}</RouteLink>
    </template>
  </nav>
  <div class="detail-grid">
    <header class="article-heading">
      <h1 id="article-title">{{ current.title }}</h1>
      <div class="detail-byline">
        <span>{{ current.sourceUrl ? '来源：二毛' : '翻墙123 编辑部' }}</span>
        <div v-if="current.topics?.length" class="resource-tags detail-topics">
          <RouteLink v-for="tag in current.topics" :key="tag" class="resource-topic" :to="topicLink(tag)">
            # {{ tag }}
          </RouteLink>
        </div>
        <a v-if="current.sourceUrl" class="detail-source-link" :href="current.sourceUrl" rel="noreferrer">原文链接</a>
        <ArticleReadCount v-else :count="readCount(current.id)"/>
        <span v-if="current.example !== false" class="demo-badge">示例内容</span>
        <time class="detail-date" :datetime="current.date">{{ current.date }}</time>
      </div>
    </header>
    <ArticleContents :article="detailArticle"/>
    <article :key="current.id" ref="detailArticle" class="detail-article" aria-labelledby="article-title">
      <!-- Imported markup is allowlisted by ermao-article-body.mjs before publication. -->
      <div v-if="current.sourceUrl" :key="current.id" class="detail-content imported-article" v-html="current.bodyHtml"></div>
      <Content v-else :key="current.id" class="detail-content"/>
      <div class="article-back">
        <RouteLink to="/">← 返回首页</RouteLink>
        <button @click="goCategory(current.category)">更多{{ current.category }} →</button>
      </div>
    </article>
    <aside v-if="recommendedArticles.length" class="detail-aside">
      <h2>猜你想看</h2>
      <RouteLink v-for="a in recommendedArticles" :key="a.id" :to="a.href">
        <TopicArt :type="a.art" small aria-hidden="true"/>
        <div class="detail-recommendation-text">
          <span class="category-label"><PortalIcon class="category-icon" :type="articleCategoryIcons[a.category]"/>{{ a.category }}</span>
          <h3>{{ a.title }}</h3>
        </div>
      </RouteLink>
    </aside>
  </div>
</template>
</main>
<footer class="fq-footer">
  <div class="fq-wrap footer-row">
    <div>
      <RouteLink to="/" class="fq-logo">
        <strong>翻墙<span>123</span></strong>
      </RouteLink>
      <p class="footer-about">翻墙123 聚合翻墙教程、客户端指南、工具资讯、免费节点与机场信息，帮助读者从理解工具到作出选择。</p>
    </div>
    <nav class="footer-links" aria-label="页脚导航">
      <template v-for="item in nav" :key="item.name">
        <RouteLink v-if="item.to" :to="item.to" class="category-label" :class="{active:inToolResources}">
          <PortalIcon class="category-icon" :type="item.icon"/>{{ item.name }}
        </RouteLink>
        <button
          v-else
          type="button"
          class="category-label"
          :class="{active:selectedArticleCategory===item.category}"
          :aria-current="selectedArticleCategory===item.category ? 'true' : undefined"
          @click="goCategory(item.category)"
        >
          <PortalIcon class="category-icon" :type="item.icon"/>{{ item.name }}
        </button>
      </template>
    </nav>
  </div>
  <div class="fq-wrap footer-fine">
    <span>© 2026 翻墙123</span>
  </div>
</footer>
</div>
</template>

<style scoped>
.detail-aside .paper-art {
  width: 100%;
  height: auto;
  border-radius: 5px;
}
.detail-aside .paper-art :deep(img) {
  width: 100%;
  height: auto;
  object-fit: contain;
}
.imported-article :deep(:is(h3, h4, h5, h6)) {
  margin: 1.35em 0 0.5em;
  color: var(--navy);
  font-size: 1.06em;
  font-weight: 650;
  line-height: 1.45;
}
.detail-article :deep(.detail-content :is(h2, h3, h4, h5, h6)[id]) { scroll-margin-top: 4.5rem; }
.imported-article :deep(:is(ul, ol)) { margin: 0.85em 0; padding-inline-start: 1.45em; }
.imported-article :deep(li + li) { margin-top: 0.4em; }
.imported-article :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1.25em auto;
  border-radius: 8px;
}
.imported-article :deep(.imported-logo) { max-width: min(100%, 320px); margin-inline: 0; }
.imported-article :deep(.imported-table) {
  margin: 1.2em 0 1.5em;
  overflow-x: auto;
  border: 1px solid var(--line);
}
.imported-article :deep(table) {
  display: table;
  width: 100%;
  margin: 0;
  border-collapse: collapse;
  font-size: 0.88em;
  line-height: 1.8;
}
.imported-article :deep(tr) { background: transparent; }
.imported-article :deep(thead),
.imported-article :deep(tbody tr:nth-child(even)) {
  background: color-mix(in srgb, var(--blue) 6%, transparent);
}
.imported-article :deep(:is(th, td)) {
  border: 0;
  border-block-end: 1px solid var(--line);
  border-inline-end: 1px solid var(--line);
  padding: 0.65em 0.8em;
  text-align: start;
  vertical-align: top;
  overflow-wrap: normal;
}
.imported-article :deep(thead th) { color: var(--navy); font-weight: 650; }
.imported-article :deep(:is(th, td):last-child) { border-inline-end: 0; }
.imported-article :deep(tbody tr:last-child td) { border-bottom: 0; }
.imported-article :deep(.imported-note) {
  margin: 1.4em 0;
  padding: 0.9em 1em;
  border-inline-start: 3px solid var(--blue);
  border-radius: 6px;
  background: var(--article-note-fill, color-mix(in srgb, var(--blue) 6%, transparent));
}
.imported-article :deep(.imported-note p) { margin: 0.35em 0; }
.imported-article :deep(.imported-note-title) { font-weight: 650; }
@media (max-width: 640px) {
  .imported-article :deep(table:has(th:nth-child(4))) { min-width: 34rem; }
}
</style>
