<script setup>
import { ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vuepress/client'
import HeaderPanelIcon from './HeaderPanelIcon.vue'

const route = useRoute()
const router = useRouter()

const props = defineProps({ article: Object, inHeader: Boolean, headerOpen: Boolean })
const emit = defineEmits(['toggle', 'close'])
const headings = shallowRef([])
const activeId = ref('')
const expanded = ref(false)

watch(() => props.inHeader, () => { expanded.value = false })

watch(() => props.article, (article, _, onCleanup) => {
  headings.value = []
  activeId.value = ''
  expanded.value = false
  if (!article) return

  let frame = 0
  function updateActive() {
    const entries = headings.value
    let active = entries[0]
    if (!active) return
    const anchorOffset = parseFloat(getComputedStyle(active.element).scrollMarginTop) || 0
    const threshold = Math.max(100, anchorOffset + 1)
    for (const entry of entries) {
      if (entry.element.getBoundingClientRect().top > threshold) break
      active = entry
    }
    activeId.value = active?.id ?? ''
  }

  function scheduleUpdate() {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(updateActive)
  }

  function readHeadings() {
    headings.value = Array.from(article.querySelectorAll('.detail-content :is(h2, h3)[id]'))
      .map(element => ({
        element,
        id: element.id,
        title: element.textContent.trim(),
        nested: element.tagName === 'H3',
      }))
      .filter(entry => entry.title)
    scheduleUpdate()
  }

  readHeadings()
  const initialTarget = headings.value.find(entry => anchor(entry.id) === location.hash
    || '#' + entry.id === location.hash)
  if (initialTarget) initialTarget.element.scrollIntoView()

  const observer = new MutationObserver(readHeadings)
  observer.observe(article, { childList: true, subtree: true })
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', scheduleUpdate)
  article.addEventListener('load', scheduleUpdate, true)
  onCleanup(() => {
    observer.disconnect()
    window.removeEventListener('scroll', scheduleUpdate)
    window.removeEventListener('resize', scheduleUpdate)
    article.removeEventListener('load', scheduleUpdate, true)
    cancelAnimationFrame(frame)
  })
}, { flush: 'post' })

function anchor(id) {
  return '#' + encodeURIComponent(id)
}

function jumpToHeading(event, entry) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  expanded.value = false
  if (props.headerOpen) emit('close')

  router.push({ path: route.path, query: route.query, hash: '#' + entry.id })
}
</script>

<template>
  <Teleport v-if="headings.length && inHeader" to="#site-header-contents-slot">
    <button class="header-icon-action header-contents-toggle"
      type="button" aria-label="此页内容" title="此页内容" :aria-expanded="headerOpen"
      aria-controls="article-contents-panel" @click="emit('toggle')">
      <HeaderPanelIcon type="contents"/>
    </button>
  </Teleport>
  <Teleport v-if="headings.length" to="#mobile-header-contents-slot" :disabled="!inHeader">
    <nav id="article-contents-panel" class="article-contents"
      :class="{ 'article-contents--header': inHeader }" aria-label="此页内容">
      <button v-if="!inHeader" type="button" class="article-contents-toggle" :aria-expanded="expanded"
        aria-controls="article-contents-list" @click="expanded = !expanded">
        此页内容 <span aria-hidden="true">{{ expanded ? '▴' : '▾' }}</span>
      </button>
      <ul id="article-contents-list">
        <li v-for="entry in headings" :key="entry.id" :class="{ nested: entry.nested }">
          <a
            :href="anchor(entry.id)"
            :aria-current="activeId === entry.id ? 'location' : undefined"
            @click="jumpToHeading($event, entry)"
          >{{ entry.title }}</a>
        </li>
      </ul>
    </nav>
  </Teleport>
</template>

<style scoped>
.article-contents {
  min-width: 0;
  color: var(--muted);
}
.article-contents-toggle { display: none; }
ul {
  margin: 0;
  padding: 0;
  list-style: none;
  border-inline-start: 1px solid var(--line);
}
.article-contents a {
  display: block;
  margin-inline-start: -1px;
  border-inline-start: 2px solid transparent;
  padding: 5px 0 5px 12px;
  color: inherit;
  font-size: 13px;
  line-height: 1.55;
  overflow-wrap: anywhere;
}
.nested a { padding-inline-start: 25px; }
.article-contents a:hover,
.article-contents a[aria-current] { color: var(--blue); }
.article-contents a[aria-current] {
  border-inline-start-color: currentColor;
  font-weight: 650;
}

@media (max-width: 850px) {
  .article-contents:not(.article-contents--header) {
    position: sticky;
    top: var(--mobile-header-height, 0px);
    z-index: 4;
    align-self: start;
    background: var(--bg);
    border-bottom: 1px solid var(--line);
  }
  .article-contents-toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    min-height: 44px;
    padding: 10px 0;
    font-size: 13px;
  }
  .article-contents-toggle[aria-expanded='false'] + ul { display: none; }
  .article-contents:not(.article-contents--header) ul {
    position: absolute;
    top: 100%;
    inset-inline: 0;
    max-height: 55dvh;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    background: var(--bg);
    border: 1px solid var(--line);
    border-radius: 0 0 var(--control-radius) var(--control-radius);
    box-shadow: var(--card-shadow);
  }
}
@media (max-width: 780px) {
  .article-contents--header {
    max-height: 55dvh;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    padding: 8px 18px 14px;
  }
}
</style>
