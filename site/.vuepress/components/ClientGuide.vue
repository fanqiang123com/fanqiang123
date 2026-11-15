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

    <fieldset class="platform-filter">
      <legend>按设备或系统筛选</legend>
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

<style scoped>
.client-directory {
  --guide-secondary:#52647e;
  --guide-chip:#eef3fb;
  --star:#a25912;
}
[data-theme='dark'] .client-directory {
  --guide-secondary:var(--muted);
  --guide-chip:var(--surface-subtle);
  --star:#ffc574;
}
.client-directory>.section-breadcrumb {
  padding-block:0;
  align-items:center;
  font-size:12px;
}
.guide-results {
  display:grid;
  gap:10px;
}
.platform-filter {
  min-inline-size:0;
  margin:0;
  padding:0;
  border:0;
}
.platform-filter legend {
  padding:0;
  margin-bottom:8px;
  font-size:14px;
  font-weight:650;
}
.platform-options {
  display:flex;
  align-items:center;
  flex-wrap:wrap;
  gap:8px;
}
.platform-option {
  display:inline-flex;
  align-items:center;
  gap:8px;
  min-height:44px;
  padding:0 12px;
  border:1px solid var(--line);
  border-radius:8px;
  background:var(--surface,#fff);
  cursor:pointer;
  font-size:14px;
}
.platform-option:has(input:checked) {
  border-color:var(--blue);
  background:var(--control-hover,#e7eeff);
  color:var(--blue);
}
.platform-option input {
  width:16px;
  height:16px;
  margin:0;
  accent-color:var(--blue);
}
.platform-count,.directory-summary {
  color:var(--guide-secondary);
  font-size:13px;
}
.fq-site .reset-filter {
  min-height:44px;
  color:var(--blue);
  padding-inline:8px;
}
.directory-summary {
  display:flex;
  flex-wrap:wrap;
  justify-content:space-between;
  gap:4px 14px;
}
.guide-grid {
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(min(100%,315px),1fr));
  gap:16px;
}
.guide-card {
  display:flex;
  flex-direction:column;
  gap:12px;
  padding:18px;
  border:1px solid var(--line);
  border-radius:12px;
  background:var(--surface,#fff);
}
.guide-card-heading {
  display:flex;
  align-items:center;
  gap:12px;
}
.guide-card-heading img {
  flex:none;
  object-fit:contain;
  border-radius:11px;
}
.guide-card-heading h2 {
  font-size:19px;
  line-height:1.3;
  overflow-wrap:anywhere;
}
.client-platforms {
  display:flex;
  flex-wrap:wrap;
  gap:5px;
  list-style:none;
  padding:0;
  margin:0;
}
.client-platforms li {
  padding:2px 8px;
  border-radius:5px;
  background:var(--guide-chip);
  color:var(--guide-secondary);
  font-size:12px;
}
.client-description,.client-notes {
  font-size:14px;
  line-height:1.55;
}
.client-notes {
  display:grid;
  grid-template-columns:max-content minmax(0,1fr);
  gap:6px 8px;
  margin:0;
  color:var(--guide-secondary);
}
.client-notes dt {
  color:var(--ink);
  font-weight:650;
}
.client-notes dd {
  margin:0;
}
.guide-card-actions {
  display:grid;
  gap:6px;
  margin-top:auto;
  padding-top:8px;
  border-top:1px solid var(--line);
}
.fq-site .client-rating {
  display:inline-flex;
  align-items:center;
  justify-self:start;
  gap:8px;
  min-height:36px;
  color:var(--guide-secondary);
}
.rating-stars {
  font-size:17px;
  letter-spacing:.09em;
}
.rating-stars span {
  color:var(--star);
}
.rating-number {
  font-size:13px;
}
.guide-links {
  display:flex;
  flex-wrap:wrap;
  gap:6px;
}
.fq-site .guide-links a {
  display:inline-flex;
  align-items:center;
  gap:5px;
  min-height:44px;
  padding:0 8px;
  border-radius:6px;
  background:var(--control-hover,#eaf1ff);
  color:var(--blue);
  font-size:13px;
}
.fq-site :is(.guide-links a,.client-rating):hover {
  text-decoration:underline;
}
</style>
