<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { RouteLink, withBase } from 'vuepress/client'
import PortalIcon from './PortalIcon.vue'
import FreeNodeList from './FreeNodeList.vue'
import ToolBreadcrumb from './ToolBreadcrumb.vue'
import { matchesNodeFilters } from '../free-node-filters.js'
import { clientImportUrl, detectImportPlatform, importClients, importPlatforms } from '../free-node-import.js'
import { portalApiUrl } from '../portal-api.js'

const props = defineProps({ kind: { type: String, required: true } })
const nodePage = computed(() => props.kind === 'nodes')
const title = computed(() => nodePage.value ? '免费节点' : '免费小火箭 ID')
const subscriptionPath = '/api/free-resources/subscribe'
const nodeRegion = ref('')
const nodeProtocols = ref([])
const snapshot = ref(null)
const directoryRows = computed(() => {
  const nodesByName = new Map()
  for (const rows of Object.values(snapshot.value?.directory ?? {})) {
    for (const node of rows) nodesByName.set(node.name, node)
  }
  return [...nodesByName.values()]
})
const availableProtocols = computed(() => [...new Set(directoryRows.value.map(node => node.protocol))])
const formatCounts = computed(() => Object.fromEntries(Object.entries(snapshot.value?.directory ?? {}).map(([format, nodes]) => [
  format, nodes.filter(node =>
    matchesNodeFilters(node, nodeRegion.value, nodeProtocols.value)).length,
])))
function subscriptionUrl(format) {
  const params = new URLSearchParams()
  if (nodeRegion.value) params.set('region', nodeRegion.value)
  if (nodeProtocols.value.length !== availableProtocols.value.length) {
    for (const protocol of nodeProtocols.value) params.append('protocol', protocol)
  }
  if (format) params.set('format', format)
  const path = subscriptionPath + (params.size ? '?' + params : '')
  return new URL(portalApiUrl(path), window.location.origin).href
}
const hasNodes = computed(() => Object.values(formatCounts.value).some(Boolean))
const importPreferenceKey = 'fanqiang123:node-import'
const importOpen = ref(false)
const importPlatform = ref('')
const importTrigger = ref(null)
const importPanel = ref(null)
const platformClients = computed(() => importClients.filter(client => client.platforms.includes(importPlatform.value)))
const platformLabel = computed(() => importPlatforms.find(({ id }) => id === importPlatform.value)?.label)
const qrDialog = ref(null)
const qrImage = ref('')
const qrFailed = ref(false)

function restoreImportPreference() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(importPreferenceKey))
    if (!saved) return
    importOpen.value = saved.open === true
    importPlatform.value = importPlatforms.some(({ id }) => id === saved.platform)
      ? saved.platform
      : detectImportPlatform(navigator)
  } catch { /* Storage can be unavailable. The panel still works for this visit. */ }
}

function setImportPreference(open, platform = importPlatform.value || detectImportPlatform(navigator)) {
  importOpen.value = open
  importPlatform.value = platform
  try {
    sessionStorage.setItem(importPreferenceKey, JSON.stringify({ open, platform }))
  } catch { /* Keep the panel usable when storage is unavailable. */ }
}

async function toggleImportPanel(open) {
  setImportPreference(open)
  if (!open) {
    importTrigger.value?.focus({ preventScroll: true })
    return
  }
  await nextTick()
  importPanel.value?.scrollIntoView({
    block: 'nearest',
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  })
}

async function showSubscriptionQr() {
  const dialog = qrDialog.value
  const address = subscriptionUrl()
  qrImage.value = ''
  qrFailed.value = false
  dialog.showModal()
  try {
    const { default: QRCode } = await import('qrcode')
    const image = await QRCode.toDataURL(address, { width: 280, margin: 4 })
    if (dialog.open && address === subscriptionUrl()) qrImage.value = image
  } catch {
    if (dialog.open && address === subscriptionUrl()) qrFailed.value = true
  }
}

const status = ref('loading')
const region = ref('')
const shown = ref([])
const copied = ref('')
const manualCopy = ref('')
const copyField = ref(null)
const accounts = computed(() => snapshot.value?.accounts ?? [])
const regions = computed(() => [...new Set(accounts.value.map(account => account.region))])
const visibleAccounts = computed(() => accounts.value.flatMap((account, index) =>
  !region.value || account.region === region.value ? [{ ...account, index }] : [],
))
const batchTime = new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai', year: 'numeric', month: 'long', day: 'numeric',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
})
const updateTime = computed(() => snapshot.value && batchTime.format(new Date(snapshot.value.publishedAt)))

watch(() => props.kind, async (kind, _, onCleanup) => {
  if (import.meta.env.SSR) return
  const request = new AbortController()
  onCleanup(() => request.abort())
  status.value = 'loading'
  snapshot.value = null
  region.value = ''
  nodeRegion.value = ''
  nodeProtocols.value = []
  importOpen.value = false
  importPlatform.value = ''
  if (kind === 'nodes') restoreImportPreference()
  shown.value = []
  copied.value = ''
  manualCopy.value = ''
  try {
    const response = await fetch(portalApiUrl(`/api/free-resources/${kind}`), { signal: request.signal })
    if (!response.ok) throw new Error('Resource unavailable')
    const resource = await response.json()
    if (request.signal.aborted) return
    snapshot.value = resource
    nodeProtocols.value = [...availableProtocols.value]
    status.value = 'ready'
  } catch {
    if (!request.signal.aborted) status.value = 'unavailable'
  }
}, { immediate: true })

function togglePassword(index) {
  shown.value = shown.value.includes(index)
    ? shown.value.filter(value => value !== index)
    : [...shown.value, index]
}

async function copy(value, label) {
  manualCopy.value = ''
  copied.value = ''
  try {
    await navigator.clipboard.writeText(value)
    copied.value = `已复制${label}`
  } catch {
    manualCopy.value = value
    copied.value = '请手动复制已选中的内容。'
    await nextTick()
    copyField.value?.select()
    try {
      if (document.execCommand('copy')) {
        manualCopy.value = ''
        copied.value = `已复制${label}`
      }
    } catch { /* Leave the selected value available for manual copy. */ }
  }
}
</script>

<template>
  <ToolBreadcrumb/>
  <div class="page-intro free-resource-intro">
    <h1>{{ title }}</h1>
    <div v-if="updateTime" class="free-update-time">
      <PortalIcon type="clock"/>
      <span>更新时间：</span><time :datetime="snapshot.publishedAt">{{ updateTime }}</time>
    </div>
  </div>

  <p v-if="status === 'loading'" class="free-resource-message" role="status">正在加载资源…</p>
  <div v-else-if="status === 'unavailable'" class="free-resource-message">
    <p>本站暂时无法提供这批资源。</p>
    <a v-if="!nodePage" href="https://clashfreenode.com/shadowrocketids">前往 CFN 查看免费小火箭 ID ↗</a>
  </div>
  <template v-else-if="nodePage">
    <FreeNodeList
      v-model:region="nodeRegion"
      v-model:protocols="nodeProtocols"
      :rows="directoryRows"
    >
      <template #actions>
        <button ref="importTrigger" class="free-subscription-primary" type="button"
          :disabled="!hasNodes && !importOpen" :aria-expanded="importOpen" aria-controls="free-node-import"
          @click="toggleImportPanel(!importOpen)">
          <PortalIcon type="share"/> 导入订阅
        </button>
      </template>
      <template #after-filters>
        <Transition name="free-import">
          <section id="free-node-import" v-show="importOpen" ref="importPanel" class="free-node-import"
            aria-labelledby="free-node-import-title">
            <div class="free-subscription-heading">
              <h2 id="free-node-import-title">导入订阅</h2>
              <button class="free-import-close" type="button" aria-label="关闭导入订阅" @click="toggleImportPanel(false)">
                <PortalIcon type="close"/>
              </button>
            </div>
            <div class="free-import-actions">
              <button type="button" :disabled="!hasNodes" @click="copy(subscriptionUrl(), '订阅地址')">
                <span class="free-import-action-icon"><PortalIcon type="copy"/></span>
                <span><strong>复制订阅地址</strong><small>复制订阅链接到剪贴板</small></span>
              </button>
              <button type="button" :disabled="!hasNodes" @click="showSubscriptionQr">
                <span class="free-import-action-icon"><PortalIcon type="qr"/></span>
                <span><strong>扫描二维码订阅</strong><small>使用客户端扫描二维码导入</small></span>
              </button>
            </div>
            <textarea v-if="manualCopy" ref="copyField" :value="manualCopy" aria-label="手动复制订阅地址"
              readonly class="free-copy-field"/>
            <div class="free-import-platforms" role="group" aria-label="选择设备系统">
              <button v-for="platform in importPlatforms" :key="platform.id" type="button"
                :aria-pressed="importPlatform === platform.id" @click="setImportPreference(true, platform.id)">{{ platform.label }}</button>
            </div>
            <h3 class="free-import-platform-title">{{ platformLabel }}</h3>
            <ul class="free-import-clients" aria-label="一键导入客户端">
              <li v-for="client in platformClients" :key="client.id">
                <component :is="formatCounts[client.format] ? 'a' : 'span'" class="free-import-client"
                  :href="formatCounts[client.format] ? clientImportUrl(client.id, subscriptionUrl(client.format)) : undefined"
                  :aria-label="'导入到 ' + client.name" :aria-disabled="!formatCounts[client.format] || undefined">
                  <img :src="withBase('/client-logos/' + client.id + '.png')" alt="" width="32" height="32">
                  {{ client.name }}
                </component>
              </li>
            </ul>
            <p v-if="!platformClients.some(client => formatCounts[client.format])" class="free-import-unavailable">当前筛选没有可导入的节点。</p>
          </section>
        </Transition>
      </template>
    </FreeNodeList>
    <dialog ref="qrDialog" class="free-qr-dialog" aria-labelledby="free-qr-title" @click.self="qrDialog.close()">
      <div class="free-qr-content">
        <div class="free-subscription-heading">
          <h2 id="free-qr-title">扫描二维码订阅</h2>
          <button class="free-import-close" type="button" aria-label="关闭二维码" autofocus @click="qrDialog.close()">
            <PortalIcon type="close"/>
          </button>
        </div>
        <img v-if="qrImage" :src="qrImage" alt="当前订阅链接的二维码" width="280" height="280">
        <p v-else role="status">{{ qrFailed ? '二维码生成失败，请复制订阅地址。' : '正在生成二维码…' }}</p>
      </div>
    </dialog>
    <RouteLink to="/articles/three-steps.html" class="free-resource-card free-node-guide">
      <PortalIcon type="beginner"/>
      <h2>第一次使用免费节点？</h2>
      <span>阅读使用指南 →</span>
    </RouteLink>
  </template>
  <template v-else>
    <aside class="free-id-warning" aria-labelledby="free-id-warning-title">
      <span class="free-id-warning-icon" aria-hidden="true">!</span>
      <div>
        <h2 id="free-id-warning-title">使用共享账号前必读</h2>
        <ul>
          <li><strong>只在 App Store 登录共享账号。</strong>打开 App Store 的个人账户页面登录。</li>
          <li><strong>严禁在系统设置或 iCloud 登录共享账号。</strong>共享账号可能导致设备被锁定。</li>
          <li>下载完成后，立即从 App Store 退出共享账号，再登录自己的账号。</li>
        </ul>
      </div>
    </aside>
    <div class="free-id-toolbar">
      <label for="free-id-region">地区</label>
      <select id="free-id-region" v-model="region" @change="shown = []">
        <option value="">全部地区</option>
        <option v-for="item in regions" :key="item">{{ item }}</option>
      </select>
      <span class="free-id-count">{{ visibleAccounts.length }} 个共享 ID</span>
    </div>
    <div class="free-id-grid">
      <article v-for="account in visibleAccounts" :key="account.index" class="free-resource-card free-id-card">
        <h2>{{ account.region }}</h2>
        <div class="free-id-field">
          <span class="free-id-label">账号</span>
          <div class="free-id-controls">
            <code>{{ account.account }}</code>
            <button type="button" @click="copy(account.account, '账号')">复制账号</button>
          </div>
        </div>
        <div class="free-id-field">
          <span class="free-id-label">密码</span>
          <div class="free-id-controls">
            <div class="free-id-secret">
              <code>{{ shown.includes(account.index) ? account.password : '••••••••' }}</code>
              <button type="button" :aria-label="shown.includes(account.index) ? '隐藏密码' : '显示密码'"
                :aria-pressed="shown.includes(account.index)" @click="togglePassword(account.index)">
                <PortalIcon type="eye"/>
              </button>
            </div>
            <button type="button" @click="copy(account.password, '密码')">复制密码</button>
          </div>
        </div>
        <p v-if="account.checked_at" class="free-id-checked">检测时间：{{ account.checked_at }}</p>
      </article>
    </div>
  </template>
  <div v-if="copied" class="free-copy-status" role="status">{{ copied }}</div>
  <textarea v-if="manualCopy && !nodePage" ref="copyField" :value="manualCopy" aria-label="手动复制内容" readonly class="free-copy-field"/>
</template>

<style scoped src="../styles/free-resources.css"></style>
