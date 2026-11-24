<script setup>
import { onUnmounted, ref } from 'vue'
import PortalIcon from './PortalIcon.vue'
import { copyNoticeDuration, useCopyNotice } from '../copy-notice.js'

const props = defineProps({ code: { type: String, required: true } })
const showCopyNotice = useCopyNotice()
const codeText = ref(null)
const copied = ref(false)
const needsManualCopy = ref(false)
let resetFeedback

async function copyCode() {
  clearTimeout(resetFeedback)
  copied.value = false
  needsManualCopy.value = false
  try {
    await navigator.clipboard.writeText(props.code)
  } catch {
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(codeText.value)
    selection.removeAllRanges()
    selection.addRange(range)
    try {
      if (!document.execCommand('copy')) throw new Error('Copy unavailable')
      selection.removeAllRanges()
    } catch {
      needsManualCopy.value = true
      return
    }
  }
  copied.value = true
  showCopyNotice()
  clearTimeout(resetFeedback)
  resetFeedback = setTimeout(() => { copied.value = false }, copyNoticeDuration)
}

onUnmounted(() => clearTimeout(resetFeedback))
</script>

<template>
  <span class="offer-code">
    <button type="button" :aria-label="`复制优惠码 ${code}`" title="点击复制" @click="copyCode">
      <code ref="codeText">{{ code }}</code>
      <PortalIcon class="offer-code-icon" :type="copied ? 'check' : 'copy'"/>
    </button>
    <span class="offer-code-feedback" role="status">{{ needsManualCopy ? '已选中，请手动复制' : '' }}</span>
  </span>
</template>

<style scoped>
.offer-code {
  display:inline-flex;
  flex-wrap:wrap;
  align-items:center;
  gap:0 0.4rem;
}
.offer-code button {
  display:inline-flex;
  align-items:center;
  gap:0.25rem;
  max-width:100%;
  padding:2px 5px;
  border-radius:4px;
  background:var(--control-hover,#eef3ff);
  color:var(--blue);
  cursor:pointer;
}
.offer-code button:hover { background:var(--vp-c-accent-soft); }
.offer-code button:focus-visible { outline:2px solid var(--blue); outline-offset:2px; }
.offer-code code { padding:0; background:transparent; color:inherit; }
.offer-code-icon { width:1rem; height:1rem; }
.offer-code-feedback { color:var(--muted); font-size:0.8em; }
</style>
