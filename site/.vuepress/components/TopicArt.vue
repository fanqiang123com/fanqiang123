<script setup>
import { computed } from 'vue'
import { withBase } from 'vuepress/client'

const props = defineProps({ type: String, label: String, small: Boolean })
const image = computed(() => {
  const extension = props.type === 'gemini-carbon-official' ? 'webp' : 'jpg'
  return withBase(`/art/${props.type || 'beginner'}.${extension}`)
})
</script>
<template><div class="topic-art paper-art" :class="[type,{small}]"><img :src="image" :alt="label || '纸艺主题插图'" :loading="small?'lazy':'eager'" :width="type === 'gemini-carbon-official' ? 1920 : 1536" :height="type === 'gemini-carbon-official' ? 1080 : 1024"></div></template>

<style scoped>
.topic-art.gemini-carbon-official:not(.small) { aspect-ratio: 16 / 9; height: auto; }
.topic-art.gemini-carbon-official:not(.small) > img { aspect-ratio: auto; height: 100%; object-fit: cover; }
</style>
