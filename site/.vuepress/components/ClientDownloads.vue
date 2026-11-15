<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouteLink, useRoute, withBase } from 'vuepress/client'
import ToolBreadcrumb from './ToolBreadcrumb.vue'
import { downloadClients, platforms } from '../client-downloads.js'

const platform = ref('windows')
const clientId = ref(null)
const route = useRoute()
const versions = ref({})
onMounted(() => {
  watch(() => route.query.platform, requested => {
    platform.value = platforms.find(([id]) => id === requested)?.[0] ?? 'windows'
  }, { immediate: true })
  watch(() => route.query.client, requested => {
    clientId.value = typeof requested === 'string' ? requested : null
  }, { immediate: true })
  fetch(withBase('/client-versions.json'), { cache: 'no-cache' })
    .then(response => response.ok ? response.json() : null)
    .then(data => {
      if (data?.schema === 1 && data.clients) versions.value = data.clients
    })
    .catch(() => {
      // Download links remain usable if version information is unavailable.
    })
})

const dateFormat = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' })
const selectedClient = computed(() => downloadClients.find(client =>
  client.id === clientId.value && client.downloads[platform.value],
))
const visibleClients = computed(() => downloadClients.flatMap(client => {
  const entries = client.downloads[platform.value]
  if (!entries || (selectedClient.value && client !== selectedClient.value)) return []

  const release = versions.value[client.id]
  const files = entries.map(item => {
    if (item.catalogVersion) return { ...item, version: release?.version }
    if (!item.mirrored) return item
    const filename = new URL(item.href).pathname.split('/').at(-1)
    return { ...item, ...release?.packages?.[filename] }
  })
  const packageVersions = [...new Set(files.map(file => file.version).filter(Boolean))]
  const version = packageVersions.length === 1 && files.every(file => file.version) ? packageVersions[0] : null
  const publishedAt = version && version === release?.version ? release.publishedAt : null
  return [{ ...client, files, version, publishedAt }]
}))
</script>

<template>
  <section class="tools-directory downloads-directory" aria-labelledby="downloads-title">
    <ToolBreadcrumb/>
    <h1 id="downloads-title">客户端下载</h1>
    <div class="download-platforms" role="group" aria-label="按系统筛选">
      <button
        v-for="[id, label] in platforms"
        :key="id"
        type="button"
        :aria-pressed="platform === id"
        @click="platform = id"
      >{{ label }}</button>
    </div>
    <RouteLink v-if="selectedClient" :to="`/tools/downloads/?platform=${platform}`" class="show-all-downloads">
      查看该系统的全部客户端
    </RouteLink>
    <div class="download-list">
      <article v-for="client in visibleClients" :key="client.name" class="download-card">
        <h2>{{ client.name }}</h2>
        <div v-if="client.version" class="download-version">
          <span>版本 {{ client.version }}</span>
          <time v-if="client.publishedAt" :datetime="client.publishedAt">
            更新于 {{ dateFormat.format(new Date(client.publishedAt)) }}
          </time>
        </div>
        <div class="download-links">
          <a
            v-for="item in client.files"
            :key="item.href"
            :href="item.href"
            :aria-label="[client.name, item.label, client.version ? null : item.version].filter(Boolean).join(' · ')"
          >
            {{ item.label }}
            <template v-if="!client.version && item.version"> · {{ item.version }}</template>
            <time v-if="!client.publishedAt && item.updatedAt" :datetime="item.updatedAt">
              {{ dateFormat.format(new Date(item.updatedAt)) }}
            </time>
            <span aria-hidden="true">{{ item.mirrored ? '↓' : '↗' }}</span>
          </a>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.downloads-directory {
  padding-block-start:var(--section-top-gap);
  gap:12px;
}
.download-platforms,.download-links {
  display:flex;
  flex-wrap:wrap;
  gap:8px;
}
.download-platforms button,.download-links a {
  display:inline-flex;
  align-items:center;
  gap:6px;
  min-height:44px;
  padding:0 12px;
  border:1px solid var(--line);
  border-radius:7px;
  color:var(--blue);
  font-size:13px;
}
.download-platforms button[aria-pressed='true'],.download-links a:hover {
  background:var(--control-hover,#e7eeff);
  border-color:var(--blue);
}
.download-links time {
  color:var(--muted);
}
.fq-site .show-all-downloads {
  justify-self:start;
  color:var(--blue);
  text-decoration:underline;
}
.download-list {
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(min(100%,310px),1fr));
  gap:12px;
}
.download-card {
  padding:16px 18px;
  border:1px solid var(--line);
  border-radius:10px;
  background:var(--surface,#fff);
}
.download-card h2 {
  margin-bottom:10px;
  font-size:16px;
}
.download-version {
  display:flex;
  flex-wrap:wrap;
  gap:4px 14px;
  margin-bottom:10px;
  color:#52647e;
  font-size:13px;
}
[data-theme='dark'] .download-version {
  color:var(--muted);
}
</style>
