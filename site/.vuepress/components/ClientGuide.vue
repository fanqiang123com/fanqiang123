<script setup>
import { computed, ref } from 'vue'
import { RouteLink, withBase } from 'vuepress/client'
import { guideClients, guidePlatforms } from '../client-guide.js'

const selected = ref([])
const visibleClients = computed(() => guideClients.filter(client =>
  !selected.value.length || selected.value.some(id => client.systems.includes(id)),
))
const counts = Object.fromEntries(guidePlatforms.map(([id]) => [
  id,
  guideClients.filter(client => client.systems.includes(id)).length,
]))
const numberFormat = new Intl.NumberFormat('zh-CN')

function downloadLinks(client) {
  const supported = guidePlatforms.filter(([id]) => client.systems.includes(id))
  return selected.value.length ? supported.filter(([id]) => selected.value.includes(id)) : supported
}
</script>

<template>
  <section class="tools-directory client-directory" aria-labelledby="client-guide-title">
    <nav class="section-breadcrumb" aria-label="面包屑">
      <RouteLink to="/">首页</RouteLink>
      <span aria-hidden="true">/</span>
      <RouteLink :to="'/?category=' + encodeURIComponent('新手入门')">新手入门</RouteLink>
    </nav>
    <h1 id="client-guide-title" class="section-heading">客户端指南</h1>

    <fieldset class="platform-filter" aria-label="按设备或系统筛选">
      <div class="platform-options">
        <label v-for="[id, label] in guidePlatforms" :key="id" class="platform-option">
          <input v-model="selected" type="checkbox" :value="id">
          <span>{{ label }}</span>
          <span class="platform-count" aria-hidden="true">{{ counts[id] }}</span>
        </label>
        <button v-if="selected.length" type="button" class="reset-filter" @click="selected = []">清除筛选</button>
      </div>
    </fieldset>

    <div class="guide-results">
      <div class="directory-summary">
        <span role="status">{{ visibleClients.length }} 款客户端</span>
        <span>按推荐指数排序</span>
      </div>

      <div class="guide-grid">
        <article v-for="client in visibleClients" :key="client.id" class="guide-card">
          <div class="guide-card-heading">
            <img :src="withBase('/client-logos/' + client.id + '.png')" alt="" width="48" height="48">
            <h2>{{ client.name }}</h2>
          </div>
          <ul class="client-platforms" aria-label="支持的系统或固件">
            <li v-for="[id, label] in guidePlatforms.filter(([id]) => client.systems.includes(id))" :key="id">{{ label }}</li>
            <li v-if="client.firmware">{{ client.firmware }}</li>
          </ul>
          <p class="client-description">{{ client.description }}</p>
          <dl class="client-notes">
            <dt>亮点</dt>
            <dd>{{ client.highlight }}</dd>
            <dt>短板</dt>
            <dd>{{ client.tradeoff }}</dd>
          </dl>
          <div class="guide-card-actions">
            <a
              :href="client.page"
              class="client-rating"
              :aria-label="`推荐指数 ${client.rating}/5，查看 ${client.name} 的人气来源`"
              :title="`${client.source === 'github' ? 'GitHub 星标' : '美国区 App Store 评分人数'}：${numberFormat.format(client.count)}`"
            >
              <span class="rating-stars" aria-hidden="true"><span>{{ '★'.repeat(client.rating) }}</span>{{ '☆'.repeat(5 - client.rating) }}</span>
              <span class="rating-number">{{ client.rating }}/5</span>
            </a>
            <div class="guide-links">
              <RouteLink v-if="client.tutorial.startsWith('/')" :to="client.tutorial" :aria-label="`${client.name} 使用教程`">
                使用教程 <span aria-hidden="true">→</span>
              </RouteLink>
              <a v-else :href="client.tutorial" :aria-label="`${client.name} 使用教程`">
                使用教程 <span aria-hidden="true">↗</span>
              </a>
              <a v-if="client.install" :href="client.install" :aria-label="`${client.name} 官方安装说明`">
                官方安装说明 <span aria-hidden="true">↗</span>
              </a>
              <template v-else>
                <RouteLink
                  v-for="[id, label] in downloadLinks(client)"
                  :key="id"
                  :to="`/tools/downloads/?platform=${id}&client=${client.id}`"
                  :aria-label="`${client.name} ${id === 'ios' ? 'App Store 入口' : label + ' 下载'}`"
                >{{ id === 'ios' ? 'App Store' : label + ' 下载' }} <span aria-hidden="true">→</span></RouteLink>
              </template>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped src="../styles/client-guide.css"></style>

<style scoped src="../styles/client-guide-card.css"></style>
