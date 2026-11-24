<script setup>
import { ref } from 'vue'
import { RouteLink } from 'vuepress/client'
import { articles } from '../portal.js'
import TopicArt from './TopicArt.vue'

const slides = [
  {
    title: ['开始翻墙，', '总共分三步'],
    description: ['用本站免费节点，跟着截图操作。', '找节点、装软件、开连接。'],
    action: '开始翻墙',
    art: 'three-steps-workshop',
    articleCover: true,
    to: articles.find(article => article.id === 'three-steps').href,
  },
  {
    title: ['客户端怎么选？', '先看你的设备'],
    description: ['按系统筛选，比较亮点、短板和推荐指数。'],
    action: '查看客户端指南',
    art: 'client-guide-v1-cover',
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
        :class="{ 'is-current': current === index, 'hero-feature--article': slide.articleCover }"
        :inert="current !== index"
        :aria-hidden="current !== index ? 'true' : undefined"
      >
        <div class="hero-copy">
          <h1>{{ slide.title[0] }}<br class="hero-title-break">{{ slide.title[1] }}<span>。</span></h1>
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
  align-self:start;
  min-width:0;
  overflow:hidden;
  border-radius:var(--feature-radius);
  box-shadow:var(--card-shadow);
  background:var(--hero-bg);
}
.hero-slides {
  display:grid;
  grid-template-columns:minmax(0, 1fr);
  touch-action:pan-y pinch-zoom;
}
.hero-feature {
  grid-area:1 / 1;
  display:grid;
  grid-template-columns:minmax(0, 2fr) minmax(0, 3fr);
  align-items:center;
  min-height:0;
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
.hero-feature .hero-copy {
  width:auto;
  padding:24px 20px 52px 28px;
}
.hero-feature .hero-copy h1 { text-wrap:balance; }
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
  .hero-controls button {
    width:44px;
    height:44px;
  }
}
/* Keep every slide in the same grid cell so content changes cannot resize it. */
.hero-feature :deep(.paper-art) {
  position:relative;
  inset:auto;
  width:100%;
  height:auto;
  aspect-ratio:3 / 2;
  opacity:1;
  background:transparent!important;
}
.hero-feature :deep(.paper-art > img) {
  height:auto;
  aspect-ratio:3 / 2;
  object-fit:contain;
}
@media (width > 850px) {
  .hero-carousel {
    display:grid;
    align-self:stretch;
  }
}
@media (min-width:1101px) and (max-width:1280px) {
  .hero-feature .hero-copy h1 { font-size:clamp(25px, 2.25vw, 28px); }
}
@media (min-width:851px) and (max-width:1100px) {
  .hero-feature .hero-copy { padding:18px 14px 52px 20px; }
  .hero-feature .hero-copy h1 { font-size:23px; line-height:1.4; }
  .hero-feature .hero-action { margin-top:12px; gap:12px; }
}
@media (max-width:680px) {
  .hero-feature {
    grid-template-columns:minmax(0, 1fr);
    grid-template-rows:auto 1fr;
  }
  .hero-feature :deep(.paper-art) { grid-row:1; }
  .hero-feature .hero-copy {
    align-self:start;
    padding:12px 16px 52px;
  }
  .hero-feature .hero-copy h1 {
    font-size:18px;
    line-height:1.4;
    margin-bottom:4px;
  }
  .hero-feature--article .hero-copy h1,.hero-title-break { display:none; }
  .hero-feature .hero-copy p { line-height:1.6; }
  .hero-feature .hero-action { margin-top:10px; }
  .hero-controls { bottom:4px; }
}
@media (prefers-reduced-motion:reduce) {
  .hero-feature.is-current {
    transition:none;
  }
}
</style>
