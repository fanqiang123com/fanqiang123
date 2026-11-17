<script setup>
import { computed } from 'vue'
import { withBase } from 'vuepress/client'
import { articleArtwork } from '../article-art.js'

const props = defineProps({ type: String, label: String, mode: { type: String, default: 'inline' } })
const art = computed(() => articleArtwork[props.type])
const placeholder = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
const srcset = family => family.map(file => `${withBase(file.src)} ${file.width}w`).join(', ')
const largest = family => family[family.length - 1]
</script>

<template>
  <picture v-if="art" class="topic-art article-art" :class="{ 'article-art--watermarked': art.watermark }"
    :data-watermark-name="art.watermark?.name" :data-watermark-url="art.watermark?.url" :style="{ '--article-header-position': art.headerPosition }">
    <!-- Hidden placements select a local data image, avoiding a second art download. -->
    <template v-if="mode === 'header'">
      <source media="(width > 1919px)" :srcset="placeholder" width="1" height="1">
      <source media="(min-width:781px)" :srcset="srcset(art.header)" sizes="100vw"
        :width="largest(art.header).width" :height="largest(art.header).height">
      <source :srcset="srcset(art.inline)" sizes="100vw"
        :width="largest(art.inline).width" :height="largest(art.inline).height">
    </template>
    <template v-else>
      <source media="(max-width:1919px)" :srcset="placeholder" width="1" height="1">
      <source :srcset="srcset(art.inline)" sizes="820px"
        :width="largest(art.inline).width" :height="largest(art.inline).height">
    </template>
    <img :src="withBase(largest(art.inline).src)" :srcset="srcset(art.inline)"
      :sizes="mode === 'header' ? '100vw' : '820px'" :alt="label || '文章配图'"
      :width="largest(art.inline).width" :height="largest(art.inline).height"
      loading="eager" decoding="async">
  </picture>
</template>
