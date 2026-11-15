<script setup>
import { ref } from 'vue'
import { RouteLink } from 'vuepress/client'
import { articles } from '../portal.js'
import TopicArt from './TopicArt.vue'

const slides = [
  {
    title: ['连接更大的世界，', '从搞懂第一步开始'],
    description: ['工具怎么选？订阅怎么用？节点怎么导入？', '把复杂的事情，讲得简单一点。'],
    action: '从零开始学翻墙',
    art: 'beginner',
    to: articles.find(article => article.id === 'start').href,
  },
  {
    title: ['客户端怎么选？', '先看你的设备'],
    description: ['按系统筛选，比较亮点、短板和推荐指数。'],
    action: '查看客户端指南',
    art: 'clash',
    to: '/clients/',
  },
  {
    title: ['免费节点怎么用？', '先搞懂导入和连接'],
    description: ['了解节点格式、订阅和常见连接问题。'],
    action: '查看免费节点',
    art: 'nodes',
    to: '/nodes/',
  },
]

const current = ref(0)
let touchStart = null

function move(step) {
  current.value = (current.value + step + slides.length) % slides.length
}

function startSwipe(event) {
  touchStart = event.touches.length === 1 ? event.touches[0] : null
}

function endSwipe(event) {
  const start = touchStart
  touchStart = null
  if (!start || event.touches.length) return

  const end = event.changedTouches[0]
  const x = end.clientX - start.clientX
  const y = end.clientY - start.clientY
  if (Math.abs(x) < 48 || Math.abs(x) <= Math.abs(y) * 1.4) return

  if (event.cancelable) event.preventDefault()
  move(x < 0 ? 1 : -1)
}
</script>

<template>
  <section
    class="hero-carousel"
    aria-label="首页精选"
    aria-roledescription="轮播"
  >
    <div
      class="hero-slides"
      @touchstart.passive="startSwipe"
      @touchend="endSwipe"
      @touchcancel="touchStart = null"
    >
      <RouteLink
        v-for="(slide, index) in slides"
        :key="slide.to"
        :to="slide.to"
        class="hero-feature"
        :class="{ 'is-current': current === index }"
        :inert="current !== index"
        :aria-hidden="current !== index ? 'true' : undefined"
      >
        <div class="hero-copy">
          <h1>{{ slide.title[0] }}<br>{{ slide.title[1] }}<span>。</span></h1>
          <p>{{ slide.description[0] }}<template v-if="slide.description[1]"><br>{{ slide.description[1] }}</template></p>
          <span class="hero-action">{{ slide.action }} <i aria-hidden="true">↗</i></span>
        </div>
        <TopicArt :type="slide.art" aria-hidden="true" />
      </RouteLink>
    </div>
    <div
      class="hero-controls"
      role="group"
      aria-label="切换精选内容"
      @keydown.left.prevent="move(-1)"
      @keydown.right.prevent="move(1)"
    >
      <button type="button" aria-label="上一张" @click="move(-1)"><span aria-hidden="true">‹</span></button>
      <button
        v-for="(slide, index) in slides"
        :key="slide.to"
        type="button"
        class="hero-dot"
        :aria-label="`第 ${index + 1} 张：${slide.action}`"
        :aria-current="current === index ? 'true' : undefined"
        @click="current = index"
      />
      <button type="button" aria-label="下一张" @click="move(1)"><span aria-hidden="true">›</span></button>
    </div>
    <span class="hero-status" role="status">第 {{ current + 1 }} 张，共 {{ slides.length }} 张。{{ slides[current].action }}</span>
  </section>
</template>

<style scoped>
.hero-carousel {
  position:relative;
  min-width:0;
  overflow:hidden;
  border-radius:13px;
  background:var(--hero-bg);
}
.hero-slides {
  display:grid;
  height:100%;
  touch-action:pan-y pinch-zoom;
}
.hero-feature {
  grid-area:1 / 1;
  visibility:hidden;
  opacity:0;
}
.hero-feature.is-current {
  visibility:visible;
  opacity:1;
  transition:opacity .22s ease-out;
}
.hero-feature:focus-visible {
  outline:2px solid #c2d5ff;
  outline-offset:-4px;
}
.hero-copy {
  padding-bottom:54px;
}
.hero-controls {
  position:absolute;
  z-index:3;
  bottom:10px;
  left:clamp(16px,3vw,36px);
  display:flex;
  align-items:center;
}
.hero-controls button {
  display:grid;
  place-items:center;
  width:40px;
  height:40px;
  padding:0;
  border-radius:6px;
  color:var(--hero-ink);
  cursor:pointer;
}
.hero-controls button:hover {
  background:#ffffff1f;
}
.hero-controls button:focus-visible {
  outline:2px solid #c2d5ff;
  outline-offset:-2px;
}
.hero-controls button span {
  font-size:24px;
  line-height:1;
}
.hero-dot::before {
  content:'';
  width:7px;
  height:7px;
  border-radius:10px;
  background:var(--hero-muted);
}
.hero-dot[aria-current='true']::before {
  width:17px;
  background:var(--hero-accent);
}
.hero-status {
  position:absolute;
  width:1px;
  height:1px;
  overflow:hidden;
  clip-path:inset(50%);
  white-space:nowrap;
}
@media (max-width:640px) {
  .hero-copy {
    padding-bottom:60px;
  }
  .hero-controls button {
    width:44px;
    height:44px;
  }
}
@media (prefers-reduced-motion:reduce) {
  .hero-feature.is-current {
    transition:none;
  }
}
</style>
