<script setup>
import { computed } from 'vue'
import PortalIcon from './PortalIcon.vue'

const props = defineProps({
  count: { type: Number, default: null },
})
const countFormat = new Intl.NumberFormat('zh-CN')
const value = computed(() => props.count === null ? '—' : countFormat.format(props.count))
const label = computed(() => props.count === null ? '本月阅读量暂无数据' : `本月阅读量 ${value.value}`)
</script>

<template>
  <span class="article-read-count" role="img" :aria-label="label" :title="label">
    <PortalIcon type="eye"/>
    <span aria-hidden="true">{{ value }}</span>
  </span>
</template>

<style scoped>
.article-read-count {
  display:inline-flex;
  align-items:center;
  gap:.35em;
  white-space:nowrap;
  font-variant-numeric:tabular-nums;
}
.article-read-count>.portal-icon {
  width:1.05em;
  height:1.05em;
}
.article-read-count>.portal-icon :deep(path) {
  stroke-width:3;
}
</style>
