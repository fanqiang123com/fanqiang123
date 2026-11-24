<script setup>
import { onUnmounted, ref } from 'vue'

const props = defineProps({ code: { type: String, required: true } })
const codeText = ref(null)
const feedback = ref('')
let resetFeedback

async function copyCode() {
  clearTimeout(resetFeedback)
  feedback.value = ''
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
      feedback.value = '已选中，请手动复制'
      return
    }
  }
  feedback.value = '已复制'
  resetFeedback = setTimeout(() => { feedback.value = '' }, 2000)
}

onUnmounted(() => clearTimeout(resetFeedback))
</script>

<template>
  <span class="offer-code">
    <button type="button" :aria-label="`复制优惠码 ${code}`" title="点击复制" @click="copyCode">
      <code ref="codeText">{{ code }}</code>
    </button>
    <span class="offer-code-feedback" role="status">{{ feedback }}</span>
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
  padding:2px 5px;
  border-radius:4px;
  background:var(--control-hover,#eef3ff);
  color:var(--blue);
  cursor:pointer;
}
.offer-code button:hover { background:var(--vp-c-accent-soft); }
.offer-code button:focus-visible { outline:2px solid var(--blue); outline-offset:2px; }
.offer-code code { padding:0; background:transparent; color:inherit; }
.offer-code-feedback { color:var(--muted); font-size:0.8em; }
</style>
