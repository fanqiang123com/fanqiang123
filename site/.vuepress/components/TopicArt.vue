<script setup>
import { computed } from 'vue'
import { withBase } from 'vuepress/client'

const props = defineProps({ type: String, label: String, small: Boolean })
const dimensions = computed(() => {
  if (['three-steps-banner', 'three-steps-banner-low'].includes(props.type)) return { width: 2172, height: 724 }
  if (props.type === 'gemini-carbon-official') return { width: 1920, height: 1080 }
  return { width: 1536, height: 1024 }
})
const image = computed(() => {
  const extension = props.type === 'gemini-carbon-official' ? 'webp' : 'jpg'
  return withBase(`/art/${props.type || 'beginner'}.${extension}`)
})
</script>
<template><div class="topic-art paper-art" :class="[type,{small}]"><img :src="image" :alt="label || '纸艺主题插图'" :loading="small?'lazy':'eager'" :width="dimensions.width" :height="dimensions.height"></div></template>

<style scoped>
.topic-art.gemini-carbon-official:not(.small) { aspect-ratio: 16 / 9; height: auto; }
.topic-art.gemini-carbon-official:not(.small) > img { aspect-ratio: auto; height: 100%; object-fit: cover; }
</style>
