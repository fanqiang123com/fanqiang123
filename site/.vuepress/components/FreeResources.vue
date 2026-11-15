<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { RouteLink } from 'vuepress/client'
import PortalIcon from './PortalIcon.vue'
import FreeNodeList from './FreeNodeList.vue'
import ToolBreadcrumb from './ToolBreadcrumb.vue'
import { matchesNodeFilters } from '../free-node-filters.js'
import { portalApiUrl } from '../portal-api.js'

const props = defineProps({ kind: { type: String, required: true } })
const nodePage = computed(() => props.kind === 'nodes')
const title = computed(() => nodePage.value ? '免费节点' : '免费小火箭 ID')
const source = computed(() => nodePage.value ? 'https://clashfreenode.com/' : 'https://clashfreenode.com/shadowrocketids')
const subscriptionPath = '/api/free-resources/subscribe'
const downloadFormats = [
  { value: 'clash', label: 'Clash / Mihomo' },
  { value: 'v2ray', label: 'V2Ray / Shadowrocket' },
  { value: 'singbox', label: 'sing-box / Hiddify' },
]
const downloadFormat = ref('clash')
const nodeRegion = ref('')
const nodeProtocols = ref([])
const snapshot = ref(null)
const allNodeOptions = computed(() => Object.values(snapshot.value?.directory ?? {}).flat())
const availableProtocols = computed(() => [...new Set(allNodeOptions.value.map(node => node.protocol))])
const formatCounts = computed(() => Object.fromEntries(downloadFormats.map(({ value }) => [
  value, (snapshot.value?.directory?.[value] ?? []).filter(node =>
    matchesNodeFilters(node, nodeRegion.value, nodeProtocols.value)).length,
])))
function downloadUrl({ format, download } = {}) {
  const params = new URLSearchParams()
  if (nodeRegion.value) params.set('region', nodeRegion.value)
  if (nodeProtocols.value.length !== availableProtocols.value.length) {
    for (const protocol of nodeProtocols.value) params.append('protocol', protocol)
  }
  if (format) params.set('format', format)
  if (download) params.set('download', '1')
  return portalApiUrl(subscriptionPath + (params.size ? '?' + params : ''))
}
const subscriptionUrl = () => new URL(downloadUrl(), window.location.origin).href
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
  downloadFormat.value = 'clash'
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
    <a :href="source">前往 CFN 查看{{ title }} ↗</a>
  </div>
  <template v-else-if="nodePage">
    <FreeNodeList
      v-model:region="nodeRegion"
      v-model:protocols="nodeProtocols"
      :rows="snapshot.directory[downloadFormat]"
      :options="allNodeOptions"
    >
      <template #download>
        <section class="free-subscription-panel" aria-label="订阅操作">
          <div class="free-subscription">
            <button class="free-subscription-primary" type="button" :disabled="!Object.values(formatCounts).some(Boolean)" @click="copy(subscriptionUrl(), '通用订阅')">复制通用订阅</button>
            <a v-if="formatCounts.v2ray" :href="downloadUrl({ download: true })">下载通用订阅</a>
          </div>
          <div class="free-subscription">
            <label for="free-download-format">按客户端下载</label>
            <select id="free-download-format" v-model="downloadFormat">
              <option v-for="format in downloadFormats" :key="format.value" :value="format.value">
                {{ format.label }}（{{ formatCounts[format.value] }}）
              </option>
            </select>
            <a v-if="formatCounts[downloadFormat]" :href="downloadUrl({ format: downloadFormat, download: true })">下载配置</a>
          </div>
        </section>
      </template>
    </FreeNodeList>
    <RouteLink to="/articles/nodes.html" class="free-resource-card free-node-guide">
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
  <textarea v-if="manualCopy" ref="copyField" :value="manualCopy" aria-label="手动复制内容" readonly class="free-copy-field"/>
</template>

<style scoped>
.free-resource-intro {
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  justify-content:space-between;
  gap:10px 20px;
  padding-bottom:14px;
}
.free-resource-intro h1 {
  font-size:clamp(26px,4vw,34px);
  font-weight:700;
  line-height:1.25;
}
.free-update-time {
  --time-accent: var(--blue);
  display:inline-flex;
  align-items:center;
  flex-wrap:wrap;
  max-width:100%;
  padding:6px 10px;
  border:1px solid #c8dfe0;
  border-radius:8px;
  color:#4a6473;
  background:var(--surface-subtle);
  font-size:13px;
  font-weight:500;
}
html[data-theme='dark'] .free-update-time {
  color:var(--muted);
  border-color:var(--line);
}
.free-update-time .portal-icon {
  width:17px;
  height:17px;
  flex:none;
  margin-inline-end:6px;
  color:var(--time-accent);
}
.free-update-time time {
  color:var(--time-accent);
  font-weight:650;
  font-variant-numeric:tabular-nums;
}
.free-resource-message,
.free-resource-card {
  border:1px solid var(--line);
  border-radius:9px;
  background:var(--surface,#fff);
  padding:16px;
}
.fq-site .free-resource-message { color:var(--ink); margin-bottom:20px }
.fq-site .free-resource-message a { color:var(--blue) }
.fq-site .free-resource-heading { margin-bottom:12px }
.free-subscription-panel {
  display:flex;
  align-items:center;
  justify-content:space-between;
  flex-wrap:wrap;
  gap:12px 20px;
  padding:12px 20px;
  border-top:1px solid var(--line);
  background:var(--surface-subtle,#f4f7fc);
  border-radius:0 0 11px 11px;
}
.fq-site .free-subscription-primary {
  min-height:36px;
  padding:5px 12px;
  border-radius:7px;
  color:#fff;
  background:#285ac9;
  font-weight:650;
}
.fq-site .free-subscription-primary:hover { background:#214eaf }
.fq-site .free-subscription-primary:disabled { opacity:.5; cursor:default }
.fq-site .free-node-guide {
  display:flex;
  align-items:center;
  flex-wrap:wrap;
  gap:8px;
  margin-bottom:24px;
}
.free-node-guide .portal-icon { width:20px; height:20px; color:var(--blue) }
.free-node-guide h2 { font-size:14px }
.free-node-guide span { margin-inline-start:auto; color:var(--blue); font-weight:600 }
.fq-site .free-node-guide:hover { border-color:var(--blue) }
.free-id-grid { display:grid; gap:12px }
.free-id-grid { grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr)) }
.free-subscription { display:flex; align-items:center; flex-wrap:wrap; gap:8px 12px }
.free-subscription select {
  min-height:36px;
  max-width:100%;
  padding:5px 8px;
  border:1px solid var(--line);
  border-radius:6px;
  background:var(--surface,#fff);
  color:var(--ink);
}
.fq-site .free-subscription a { color:var(--blue); font-weight:600 }
.free-id-warning {
  --warning-ink:#713608;
  --warning-bg:#fff4e2;
  --warning-line:#e5bd7f;
  display:flex;
  align-items:flex-start;
  gap:12px;
  color:var(--warning-ink);
  background:var(--warning-bg);
  border:1px solid var(--warning-line);
  border-radius:9px;
  padding:14px 16px;
  margin-bottom:16px;
  font-size:13px;
  line-height:1.55;
}
[data-theme='dark'] .free-id-warning {
  --warning-ink:#ffdaa1;
  --warning-bg:#332819;
  --warning-line:#73552b;
}
.free-id-warning-icon {
  display:grid;
  place-items:center;
  flex:none;
  width:20px;
  height:20px;
  border:1px solid currentColor;
  border-radius:50%;
  font-weight:700;
}
.free-id-warning h2 { font-size:15px; line-height:20px }
.free-id-warning ul { margin:6px 0 0; padding-inline-start:1.2em }
.free-id-warning li + li { margin-top:3px }
.free-id-toolbar {
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  gap:8px 12px;
  margin-bottom:12px;
  font-size:13px;
}
.free-id-toolbar select { color:inherit; background:var(--surface,#fff); border:1px solid var(--line); border-radius:6px; padding:6px 9px; min-height:36px }
.free-id-count { margin-inline-start:auto; color:var(--muted) }
.free-id-card { display:grid; align-content:start; gap:12px; min-width:0 }
.free-id-card h2 { font-size:17px; line-height:1.3 }
.free-id-field { display:grid; gap:5px; min-width:0 }
.free-id-label,
.fq-site .free-id-checked { color:var(--muted); font-size:12px }
.free-id-controls { display:grid; grid-template-columns:minmax(0,1fr) auto; gap:8px }
.free-id-controls>code,
.free-id-secret { min-height:36px; border-radius:6px; background:var(--surface-subtle,#edf2fa) }
.free-id-controls code { min-width:0; padding:7px 9px; align-content:center }
.free-id-secret { display:grid; grid-template-columns:minmax(0,1fr) auto; align-items:center }
.free-id-secret button { display:grid; place-items:center; width:36px }
.free-id-checked { padding-top:9px; border-top:1px solid var(--line) }
.free-resource-card code { display:block; overflow-wrap:anywhere; font-size:12px }
.free-resource-card button { flex:none; min-height:36px; border-radius:6px; color:var(--blue); background:var(--surface-subtle,#edf2fa); padding-inline:8px; font-size:13px; white-space:nowrap }
.free-resource-card button:disabled { opacity:.5; cursor:default }
.free-resource-card button:hover { background:var(--control-hover,#eaf1ff) }
.free-resource-card button .portal-icon { width:18px; height:18px }
.free-id-grid { margin-bottom:24px }
.free-copy-status { position:fixed; inset:auto 16px 24px 16px; width:max-content; max-width:calc(100% - 32px); margin-inline:auto; border:1px solid var(--line); border-radius:8px; background:var(--surface,#fff); padding:8px 12px; z-index:5 }
.free-copy-field { display:block; width:100%; color:inherit; background:var(--surface,#fff); margin-bottom:24px }
@media(max-width:640px) {
  .free-resource-card { padding:12px }
  .free-resource-intro { flex-direction:column; align-items:flex-start }
  .free-subscription-panel { padding:12px 14px }
}
</style>
