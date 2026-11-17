<script setup>
import { computed, nextTick, ref, watch, onMounted, onUnmounted } from 'vue'
import { RouteLink, Content, usePageData, useRoute, useRouter, withBase } from 'vuepress/client'
import { advancedSubcategoryIcons, articleCategories, articleCategoryIcons, articles as allArticles, visibleArticles as articles, legacyArticleCategories } from '../portal.js'
import TopicArt from './TopicArt.vue'
import ArticleArtwork from './ArticleArtwork.vue'
import PortalIcon from './PortalIcon.vue'
import HeaderActions from './HeaderActions.vue'
import HeaderAppearance from './HeaderAppearance.vue'
import HeaderPanelIcon from './HeaderPanelIcon.vue'
import HomeCarousel from './HomeCarousel.vue'
import ClientDownloads from './ClientDownloads.vue'
import ClientGuide from './ClientGuide.vue'
import ToolResourceCards from './ToolResourceCards.vue'
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
  // The imported archive was retired on 2026-11-16. Do not revive a cached snapshot.
  airportNews.value = []
  airportNewsLoaded.value = true
}
const isLocalPreview = import.meta.env.DEV
const recommendationAnchor = ref(null)
const recommendationResult = ref(null)
const articlesById = new Map(articles.map(article => [article.id, article]))
const editorialPicks = ['three-steps'].map(id => articlesById.get(id)).filter(Boolean)
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
const sidebarGroups = computed(() => [
  { title: '按标签查找', className: 'topics-box topics-box--mobile' },
  { title: '本月阅读榜', className: 'monthly-reading', list: 'ol', entries: monthlyRanking.value },
  { title: '猜你想看', className: 'popular-box', list: 'ul', entries: recommendedArticles.value.map(article => ({ article, count: readCount(article.id) })) },
  { title: '按标签查找', className: 'topics-box topics-box--desktop' },
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
  document.addEventListener('pointerdown', dismissOutsideHeader)
  watch(() => page.value.path, () => updateReads(current.value?.sourceUrl ? undefined : current.value?.id), { immediate: true })
})
onUnmounted(() => {
  window.removeEventListener('pageshow', resumeCachedPage)
  document.removeEventListener('pointerdown', dismissOutsideHeader)
})
function resolveCategory(value) {
  const name = String(value || '全部').trim().replace(/。$/, '')
  return Object.hasOwn(legacyArticleCategories, name) ? legacyArticleCategories[name] : name
}
const primaryCategory = computed(() => resolveCategory(route.query.category))
const category = computed(() => primaryCategory.value === '全部'
  ? resolveCategory(route.query.filter)
  : primaryCategory.value)
const isAdvancedCategory = computed(() => category.value === '进阶玩法')
const subcategory = computed(() => isAdvancedCategory.value && typeof route.query.subcategory === 'string' && Object.hasOwn(advancedSubcategoryIcons, route.query.subcategory)
  ? route.query.subcategory
  : '全部')
const showArticleCategory = computed(() => (isAdvancedCategory.value ? subcategory.value : category.value) === '全部')
const advancedTabIcons = { 全部: 'grid', ...advancedSubcategoryIcons }
const activeQ = computed(() => String(route.query.q || '').toLowerCase())
const count = ref(4)
const visibleTopicLimit = 3
const expandedTopicArticles = ref(new Set())
function toggleArticleTopics(articleId) {
  if (!expandedTopicArticles.value.delete(articleId)) {
    expandedTopicArticles.value.add(articleId)
  }
}
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
const activeTags = computed(() => {
  const { tag } = route.query
  const tags = Array.isArray(tag) ? tag : [tag]
  return [...new Set(tags.filter(value => topicCounts.value.has(value)))]
})
const filtered = computed(() => catalog.value.filter(a =>
  (category.value === '全部' || a.category === category.value)
  && (subcategory.value === '全部' || a.subcategory === subcategory.value)
  && activeTags.value.every(tag => a.topics?.includes(tag))
  && (!activeQ.value || [a.title, a.description, a.tag, ...(a.topics ?? [])].join(' ').toLowerCase().includes(activeQ.value)),
).sort((a, b) => Number(b.pinned === true) - Number(a.pinned === true) || b.date.localeCompare(a.date)))
const showHomeIntro = computed(() => !section.value && !current.value && !route.query.category)
const goCategory = c => router.push({path:'/',query:c === '全部' ? {} : {category:c}})
function articleCategoryLink({ category, subcategory }) {
  const query = { category }
  if (category === '进阶玩法' && Object.hasOwn(advancedSubcategoryIcons, subcategory)) {
    query.subcategory = subcategory
  }
  return router.resolve({ path: '/', query }).fullPath
}
const currentSubcategoryLink = computed(() => current.value && Object.hasOwn(advancedSubcategoryIcons, current.value.subcategory)
  ? articleCategoryLink(current.value)
  : null)
function feedCategoryLocation(value, subcategory = '全部') {
  const query = { ...route.query }
  if (primaryCategory.value === '全部') {
    if (value === '全部') delete query.filter
    else query.filter = value
  }
  if (value === '进阶玩法' && Object.hasOwn(advancedSubcategoryIcons, subcategory)) {
    query.subcategory = subcategory
  } else {
    delete query.subcategory
  }
  return { path: route.path, query, hash: route.hash }
}
function filterCategory(value) {
  return router.push(feedCategoryLocation(value))
}
function filterSubcategory(value) {
  return router.push(feedCategoryLocation(category.value, value))
}
function topicLink(tag) {
  if (current.value) return router.resolve({ path: '/', query: { tag } }).fullPath

  const query = { ...route.query }
  const nextTags = activeTags.value.includes(tag)
    ? activeTags.value.filter(activeTag => activeTag !== tag)
    : [...activeTags.value, tag]
  if (nextTags.length > 0) query.tag = nextTags
  else delete query.tag
  return router.resolve({ path: '/', query, hash: route.hash }).fullPath
}
function clearTag() {
  const query = { ...route.query }
  delete query.tag
  return router.push({ path: '/', query, hash: route.hash })
}
const q = ref(String(route.query.q || ''))
const mobileHeader = ref(false)
const activeHeaderPanel = ref('')
const shownMobilePanel = ref('')
const mobilePanelContent = ref(null)
const mobilePanelHeight = ref(0)
const headerElement = ref(null)
const mobileMenuButton = ref(null)
const headerSearchButton = ref(null)
const headerSearchPanel = ref(null)
const headerSearchInput = ref(null)
const headerKeyword = ref('')
const menuOpen = computed(() => activeHeaderPanel.value === 'menu')
const headerSearchOpen = computed(() => activeHeaderPanel.value === 'search')

let mobileHeaderQuery
let mobilePanelObserver

function updateHeaderPlacement() {
  mobileHeader.value = mobileHeaderQuery.matches
  activeHeaderPanel.value = ''
}

onMounted(() => {
  mobileHeaderQuery = window.matchMedia('(max-width: 780px)')
  updateHeaderPlacement()
  mobileHeaderQuery.addEventListener('change', updateHeaderPlacement)
  mobilePanelObserver = new ResizeObserver(([entry]) => {
    mobilePanelHeight.value = entry.contentRect.height
  })
  mobilePanelObserver.observe(mobilePanelContent.value)
})

onUnmounted(() => {
  mobileHeaderQuery?.removeEventListener('change', updateHeaderPlacement)
  mobilePanelObserver?.disconnect()
})

watch(() => route.fullPath, () => {
  q.value = String(route.query.q || '')
  count.value = 4
  activeHeaderPanel.value = ''
})

function openHeaderPanel(panel) {
  shownMobilePanel.value = panel
  activeHeaderPanel.value = panel
}

function closeHeaderPanel() {
  const panel = activeHeaderPanel.value
  activeHeaderPanel.value = ''
  const toggle = {
    menu: mobileMenuButton.value,
    search: headerSearchButton.value,
    contents: headerElement.value?.querySelector('.header-contents-toggle'),
  }[panel]
  toggle?.focus({ preventScroll: true })
}

async function toggleHeaderSearch() {
  if (headerSearchOpen.value) {
    closeHeaderPanel()
    return
  }
  headerKeyword.value = String(route.query.q || '')
  openHeaderPanel('search')
  await nextTick()
  headerSearchInput.value?.focus({ preventScroll: true })
}

function dismissOutsideHeader(event) {
  if (!activeHeaderPanel.value) return
  if (mobileHeader.value) {
    if (headerElement.value?.contains(event.target)) return
  } else if (headerSearchPanel.value?.contains(event.target) || headerSearchButton.value?.contains(event.target)) {
    return
  }
  activeHeaderPanel.value = ''
}

function toggleMobileMenu() {
  if (menuOpen.value) closeHeaderPanel()
  else openHeaderPanel('menu')
}

function toggleHeaderContents() {
  if (activeHeaderPanel.value === 'contents') closeHeaderPanel()
  else openHeaderPanel('contents')
}

function submitHeaderSearch() {
  const keyword = headerKeyword.value.trim()
  if (!keyword) {
    headerSearchInput.value?.focus({ preventScroll: true })
    return
  }
  closeHeaderPanel()
  return router.push({ path: '/', query: { q: keyword } })
}

function search(keyword = q.value.trim()) {
  const query = { ...route.query }
  if (keyword) query.q = keyword
  else delete query.q
  return router.push({ path: route.path, query, hash: route.hash })
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

<header ref="headerElement" class="fq-header" @keydown.esc="closeHeaderPanel">
  <div class="header-bar">
    <div class="fq-wrap header-row">
      <button ref="mobileMenuButton" class="header-icon-action mobile-menu-toggle" type="button" aria-label="主菜单" aria-controls="site-header-menu"
        :aria-expanded="menuOpen" @click="toggleMobileMenu">
        <HeaderPanelIcon type="menu"/>
      </button>
      <RouteLink to="/" class="fq-logo" aria-label="翻墙123 首页" @click="activeHeaderPanel = ''">
        <strong>翻墙<span>123</span></strong>
      </RouteLink>
      <Teleport defer to="#mobile-header-menu-slot" :disabled="!mobileHeader">
        <div id="site-header-menu" class="site-header-menu">
          <nav aria-label="主导航">
            <template v-for="n in nav" :key="n.name">
              <RouteLink v-if="n.to" :to="n.to" :class="{active:inToolResources}" @click="activeHeaderPanel = ''">
                <PortalIcon class="category-icon" :type="n.icon"/>{{ n.name }}
              </RouteLink>
              <button v-else type="button" :class="{active:selectedArticleCategory===n.category}"
                :aria-current="selectedArticleCategory===n.category ? 'true' : undefined"
                @click="activeHeaderPanel = ''; goCategory(n.category)">
                <PortalIcon class="category-icon" :type="n.icon"/>{{ n.name }}
              </button>
            </template>
          </nav>
          <HeaderActions/>
        </div>
      </Teleport>
      <div class="header-controls">
        <div id="site-header-contents-slot"></div>
        <button ref="headerSearchButton" class="header-icon-action header-search-toggle" type="button" :aria-label="headerSearchOpen ? '关闭搜索' : '打开搜索'"
          :aria-expanded="headerSearchOpen" aria-controls="site-header-search" @click="toggleHeaderSearch">
          <HeaderPanelIcon type="search"/>
        </button>
        <HeaderAppearance/>
      </div>
    </div>
  </div>
  <div class="mobile-header-panel" :class="{ 'is-open': activeHeaderPanel }"
    :style="mobileHeader ? { height: activeHeaderPanel ? mobilePanelHeight + 'px' : '0px' } : undefined"
    :inert="mobileHeader && !activeHeaderPanel">
    <div class="mobile-header-panel-clip">
      <div ref="mobilePanelContent" class="mobile-header-panel-content" :data-panel="shownMobilePanel">
        <div id="mobile-header-menu-slot"></div>
        <div id="mobile-header-contents-slot"></div>
        <div id="site-header-search" ref="headerSearchPanel" class="header-search-panel" :class="{ 'is-open': headerSearchOpen }" :inert="!headerSearchOpen">
          <div class="header-search-body">
            <div class="fq-wrap">
              <form class="portal-search header-search-form" role="search" aria-label="全站搜索" @submit.prevent="submitHeaderSearch">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 5 5"/></svg>
                <input ref="headerSearchInput" v-model="headerKeyword" type="search" enterkeyhint="search"
                  aria-label="搜索本站文章" placeholder="搜索教程、客户端或协议">
                <button type="submit">搜索 <span aria-hidden="true">↵</span></button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
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
</template>
<div class="portal-body"><section id="article-feed" class="article-feed">
  <div v-if="activeTags.length" class="block-heading">
    <h2 class="section-heading category-label">
      {{ activeTags.map(tag => '# ' + tag).join(' · ') }}
    </h2>
    <button class="clear-topic" type="button" @click="clearTag">清除标签</button>
  </div>
  <form class="portal-search" role="search" @submit.prevent="search()">
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 5 5"/></svg>
    <input v-model="q" type="search" aria-label="搜索教程与资讯" placeholder="搜索教程、客户端或协议">
    <button type="submit">搜索 <span>↵</span></button>
  </form>
  <div v-if="primaryCategory === '全部'" class="filter-tabs" role="group" aria-label="内容分类"><button v-for="c in categories" :key="c" :class="{selected:category===c}" class="category-label" :aria-pressed="category===c" @click="filterCategory(c)"><PortalIcon class="category-icon" :type="categoryIcons[c]"/>{{ c }}</button></div>
  <div v-if="primaryCategory === '进阶玩法'" class="filter-tabs subcategory-tabs" role="group" aria-label="进阶玩法子分类">
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
  <div v-if="activeQ" class="result-note">「{{ route.query.q }}」的搜索结果<button type="button" @click="search('')">清除 ×</button></div>
  <article v-for="a in filtered.slice(0, count)" :key="a.id" class="resource-story">
    <RouteLink :to="a.href" class="story-art" :aria-label="a.title">
      <TopicArt :type="a.art" :label="a.artlabel" small/>
    </RouteLink>
    <div class="resource-copy">
      <div v-if="showArticleCategory || a.topics?.length" class="resource-tags">
        <RouteLink v-if="showArticleCategory" class="category-label" :to="router.resolve(feedCategoryLocation(a.category, a.subcategory)).fullPath">
          <PortalIcon class="category-icon" :type="advancedSubcategoryIcons[a.subcategory] ?? articleCategoryIcons[a.category]"/>
          {{ a.subcategory || a.category }}
        </RouteLink>
        <RouteLink
          v-for="tag in a.topics?.slice(0, expandedTopicArticles.has(a.id) ? undefined : visibleTopicLimit)"
          :key="tag"
          class="resource-topic"
          :to="topicLink(tag)"
          :class="{ selected: activeTags.includes(tag) }"
          :aria-label="activeTags.includes(tag) ? '# ' + tag + '，已选，取消筛选' : undefined"
        ># {{ tag }}</RouteLink>
        <button v-if="a.topics?.length > visibleTopicLimit" type="button"
          class="resource-topic topic-toggle" :aria-expanded="expandedTopicArticles.has(a.id)"
          :aria-label="expandedTopicArticles.has(a.id) ? '收起标签' : '展开其余 ' + (a.topics.length - visibleTopicLimit) + ' 个标签'"
          @click="toggleArticleTopics(a.id)"
        >{{ expandedTopicArticles.has(a.id) ? '收起' : '+' + (a.topics.length - visibleTopicLimit) }}</button>
      </div>
      <RouteLink :to="a.href"><h3>{{ a.title }}</h3></RouteLink>
      <p v-if="a.description">{{ a.description }}</p>
      <div class="resource-footer">
        <time :datetime="a.date">{{ a.date }}</time>
        <div v-if="a.pinned || !a.sourceUrl" class="resource-footer-meta">
          <span v-if="a.pinned" class="resource-pin" role="img" aria-label="置顶" title="置顶">
            <PortalIcon type="pin"/>
          </span>
          <ArticleReadCount v-if="!a.sourceUrl" :count="readCount(a.id)"/>
        </div>
      </div>
    </div>
  </article>
  <div v-if="!filtered.length" class="empty-state"><strong>还没有找到相关内容</strong><p>试试“Clash”“节点”或“机场”，或者查看全部内容。</p><button @click="router.push('/')">查看全部 →</button></div><button v-if="count<filtered.length" class="more-resources" @click="count+=4">发现更多内容 <span>↓</span></button><div v-else-if="filtered.length" class="feed-finish">你已读完当前列表</div></section>
<aside class="portal-rail">
<section v-for="group in sidebarGroups" :key="group.className" :class="group.className">
  <h2>{{ group.title }}</h2>
  <div v-if="!group.list">
    <RouteLink v-for="tag in topics" :key="tag" :to="topicLink(tag)"
      :class="{ selected: activeTags.includes(tag) }"
      :aria-label="`${tag}，${topicCounts.get(tag)} 篇文章${activeTags.includes(tag) ? '，已选，取消筛选' : ''}`">
      # {{ tag }} <span class="topic-count">{{ topicCounts.get(tag) }}</span>
    </RouteLink>
  </div>
  <component :is="group.list" v-else-if="group.entries.length" class="rail-article-list" role="list">
    <li v-for="({ article, count }, index) in group.entries" :key="article.id">
      <RouteLink :to="article.href" class="rail-article-link">
        <TopicArt :type="article.art" small aria-hidden="true"/>
        <span v-if="group.list === 'ol'" class="reading-rank" aria-hidden="true">{{ index + 1 }}</span>
        <span class="rail-article-copy">
          <span>{{ article.title }}</span>
          <ArticleReadCount :count="count"/>
        </span>
      </RouteLink>
    </li>
  </component>
  <p v-else>暂无本月阅读数据。</p>
</section></aside></div>
</template>

<ToolResourceCards v-else-if="section==='tools'"/>

<ClientDownloads v-else-if="section==='downloads'"/>

<FreeResources v-else-if="section==='nodes' || section==='shadowrocket-id'" :kind="section"/>

<ClientGuide v-else-if="section==='clients'"/>

<AirportOffers v-else-if="section==='airport-offers'"/>

<Content v-else-if="isLocalPreview && section==='style-guide'"/>

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
  <ArticleArtwork v-if="current.articleArt" class="article-banner article-banner--header" mode="header" :type="current.articleArt" :label="current.artlabel || current.title"/>
  <TopicArt v-else-if="current.bannerArt" class="article-banner article-banner--header" :type="current.bannerArt" :label="current.artlabel || current.title"/>
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
      <TopicArt v-if="current.art && !current.bannerArt && !current.articleArt" class="article-cover" :type="current.art" :label="current.artlabel || current.title"/>
    </header>
    <ArticleContents :article="detailArticle" :in-header="mobileHeader" :header-open="activeHeaderPanel === 'contents'"
      @toggle="toggleHeaderContents" @close="closeHeaderPanel"/>
    <article :key="current.id" ref="detailArticle" class="detail-article" aria-labelledby="article-title">
      <ArticleArtwork v-if="current.articleArt" class="article-banner article-banner--inline" mode="inline" :type="current.articleArt" :label="current.artlabel || current.title"/>
      <TopicArt v-else-if="current.bannerArt" class="article-banner article-banner--inline" :type="current.bannerArt" :label="current.artlabel || current.title"/>
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
    <span class="footer-copyright">© 2026 翻墙123</span>
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
.detail-article :deep(.detail-content :is(h2, h3, h4, h5, h6)[id]) { scroll-margin-top: max(4.5rem, calc(var(--mobile-header-height, 0px) + 20px)); }
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
