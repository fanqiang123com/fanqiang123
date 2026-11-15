<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useFrontmatter, useRoute } from 'vuepress/client'

const frontmatter = useFrontmatter()
const route = useRoute()
const visible = ref(false)
const progress = ref(0)
const scrolling = ref(false)
let idleTimer

function readPosition() {
  const { scrollHeight, clientHeight } = document.documentElement
  const distance = scrollHeight - clientHeight
  const offset = Math.max(0, window.scrollY)
  visible.value = offset > 100
  progress.value = distance > 0 ? (distance - offset <= 1 ? 100 : 100 * offset / distance) : 0
}

function onScroll() {
  readPosition()
  scrolling.value = true
  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => { scrolling.value = false }, 350)
}

function scrollToTop(event) {
  if (event.detail === 0) {
    const main = document.querySelector('main')
    if (main) {
      if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1')
      main.focus({ preventScroll: true })
    }
  }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' })
}

watch(() => route.fullPath, () => {
  scrolling.value = false
  readPosition()
}, { flush: 'post' })

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', readPosition)
  readPosition()
})

onUnmounted(() => {
  clearTimeout(idleTimer)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', readPosition)
})
</script>

<template>
  <Transition name="back-to-top-fade">
    <button v-if="frontmatter.backToTop !== false && visible" type="button" class="portal-back-to-top"
      :class="{ 'is-scrolling': scrolling }" aria-label="返回顶部" @click="scrollToTop">
      <span class="scroll-percent" aria-hidden="true">{{ Math.floor(progress) }}%</span>
      <svg class="scroll-arrow" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 42V14 M12 26l12-12 12 12 M12 6h24" fill="none" stroke="currentColor"
          stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg class="scroll-ring" aria-hidden="true">
        <circle cx="50%" cy="50%" pathLength="100" :stroke-dasharray="progress < 100 ? `${progress} 100` : null"/>
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.portal-back-to-top {
  --button-bg:#fff;
  --button-ink:rgb(60 60 67 / .56);
  --button-ring:#5086a1;
  position:fixed;
  inset-inline-end:max(24px, env(safe-area-inset-right));
  bottom:calc(49px + env(safe-area-inset-bottom));
  z-index:45;
  display:grid;
  place-items:center;
  width:48px;
  height:48px;
  padding:0;
  background:var(--button-bg);
  color:var(--button-ink);
  box-shadow:0 3px 12px rgb(0 0 0 / .3), 0 1px 4px rgb(0 0 0 / .27);
  border:0;
  border-radius:50%;
  cursor:pointer;
  transition:background-color .25s, box-shadow .25s;
}
html[data-theme='dark'] .portal-back-to-top {
  --button-bg:#1b1b1f;
  --button-ink:rgb(235 235 245 / .38);
  --button-ring:#6aa1b7;
}
.portal-back-to-top:focus-visible {
  outline:2px solid var(--portal-accent);
  outline-offset:2px;
}
.scroll-percent,.scroll-arrow {
  grid-area:1 / 1;
  transition:opacity .5s ease;
}
.scroll-percent { font-size:14px; opacity:0; }
.scroll-arrow { width:24px; height:24px; }
.is-scrolling:not(:hover,:focus-visible) .scroll-percent { opacity:1; }
.is-scrolling:not(:hover,:focus-visible) .scroll-arrow { opacity:0; }
.scroll-ring { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
.scroll-ring circle {
  r:21px;
  fill:none;
  stroke:var(--button-ring);
  stroke-width:2px;
  stroke-linecap:round;
  transform:rotate(-90deg);
  transform-origin:50% 50%;
}
.back-to-top-fade-enter-active,.back-to-top-fade-leave-active { transition:opacity .25s ease; }
.back-to-top-fade-enter-from,.back-to-top-fade-leave-to { opacity:0; }
.back-to-top-fade-leave-active { pointer-events:none; }
@media (max-width:767px) {
  .portal-back-to-top { width:36px; height:36px; }
  .scroll-arrow { width:18px; height:18px; }
  .scroll-percent { font-size:10px; }
  .scroll-ring circle { r:15px; }
}
@media (prefers-reduced-motion:reduce) {
  .back-to-top-fade-enter-active,.back-to-top-fade-leave-active,
  .scroll-percent,.scroll-arrow { transition:none; }
}
@media print {
  .portal-back-to-top { display:none; }
}
</style>
