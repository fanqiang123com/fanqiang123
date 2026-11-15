<script setup>
import { computed, ref, watch } from 'vue'
import { matchesNodeFilters, nodeProtocols as protocols } from '../free-node-filters.js'

const props = defineProps({ rows: { type: Array, required: true }, options: { type: Array, required: true } })
const region = defineModel('region', { type: String, default: '' })
const selectedProtocols = defineModel('protocols', { type: Array, required: true })
const page = ref(1)
const pageSize = 24
const names = new Intl.DisplayNames('zh-CN', { type: 'region' })
const regionName = code => code === 'Other' ? '未标注地区' : names.of(code)
const regionOptions = computed(() => [...new Set(props.options.map(row => row.region))]
  .sort((a, b) => regionName(a).localeCompare(regionName(b), 'zh-CN')))
const protocolOptions = computed(() => [...new Set(props.options.map(row => row.protocol))]
  .sort((a, b) => (protocols[a] ?? a).localeCompare(protocols[b] ?? b)))
const filtered = computed(() => props.rows.filter(row =>
  matchesNodeFilters(row, region.value, selectedProtocols.value)))
const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const visible = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))
watch([region, selectedProtocols, () => props.rows], () => { page.value = 1 })
function resetFilters() {
  region.value = ''
  selectedProtocols.value = [...protocolOptions.value]
}
</script>

<template>
  <section class="node-directory" aria-labelledby="node-directory-title">
    <div class="directory-controls">
      <div class="directory-filters">
        <label class="directory-region">地区
          <select v-model="region" aria-label="地区">
            <option value="">全部地区</option>
            <option v-for="code in regionOptions" :key="code" :value="code">{{ regionName(code) }}</option>
          </select>
        </label>
        <fieldset class="directory-protocols">
          <legend>协议</legend>
          <div class="directory-protocol-options">
            <label v-for="key in protocolOptions" :key="key">
              <input v-model="selectedProtocols" type="checkbox" :value="key">
              {{ protocols[key] ?? key }}
            </label>
          </div>
        </fieldset>
      </div>
      <slot name="download"/>
    </div>
    <div class="directory-heading">
      <h2 id="node-directory-title">节点列表</h2>
      <span class="directory-count" role="status">{{ filtered.length }} 个节点</span>
      <button v-if="region || selectedProtocols.length !== protocolOptions.length" type="button" @click="resetFilters">重置筛选</button>
    </div>
    <p v-if="!visible.length" class="directory-empty">没有符合条件的节点。</p>
    <div v-else class="directory-table">
      <table>
        <thead><tr><th scope="col">节点</th><th scope="col">地区</th><th scope="col">协议</th></tr></thead>
        <tbody>
          <tr v-for="row in visible" :key="row.name">
            <td>{{ row.name }}</td><td>{{ regionName(row.region) }}</td>
            <td><span class="directory-protocol">{{ protocols[row.protocol] ?? row.protocol }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="pages > 1" class="directory-pagination" aria-label="节点列表分页">
      <button type="button" :disabled="page === 1" @click="page--">上一页</button>
      <span>{{ page }} / {{ pages }}</span>
      <button type="button" :disabled="page === pages" @click="page++">下一页</button>
    </div>
  </section>
</template>

<style scoped>
.node-directory { margin-bottom: 24px; }
.directory-controls {
  margin-bottom: 26px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface, #fff);
}
.directory-filters {
  display: grid;
  grid-template-columns: minmax(135px, 180px) minmax(0, 1fr);
  align-items: start;
  gap: 16px 24px;
  padding: 18px 20px;
}
.directory-region, .directory-protocols legend {
  color: var(--ink);
  font-size: 13px;
  font-weight: 650;
}
.directory-region {
  display: grid;
  gap: 7px;
}
.directory-region select {
  width: 100%;
  min-height: 36px;
  padding: 5px 9px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--surface-subtle, #f4f7fc);
  color: var(--ink);
  font: inherit;
  font-weight: 500;
}
.directory-protocols { min-width: 0; margin: 0; padding: 0; border: 0; }
.directory-protocols legend { padding: 0; margin-bottom: 7px; }
.directory-protocol-options { display: flex; flex-wrap: wrap; gap: 7px; }
.directory-protocol-options label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 3px 9px;
  border: 1px solid var(--line);
  border-radius: 7px;
  color: var(--ink);
  font-size: 13px;
  cursor: pointer;
}
.directory-protocol-options label:has(:checked) {
  border-color: color-mix(in srgb, var(--blue) 30%, var(--line));
  background: color-mix(in srgb, var(--blue) 8%, var(--surface, #fff));
}
.directory-protocol-options input { margin: 0; accent-color: var(--blue); }
.directory-heading, .directory-pagination { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }
.directory-heading { margin-bottom: 10px; }
.directory-heading h2 { font-size: 19px; }
.directory-count { color: var(--muted); font-size: 13px; }
.directory-heading button { margin-inline-start: auto; color: var(--blue); }
@media (max-width: 640px) {
  .directory-filters { grid-template-columns: minmax(0, 1fr); padding: 14px; }
}
.directory-table, .directory-empty {
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--surface, white);
}
.directory-table { overflow-x: auto; }
.directory-table table { display: table; width: 100%; margin: 0; border-collapse: collapse; }
.directory-table tr { background: transparent; }
.directory-table th, .directory-table td { border: 0; padding: 9px 14px; text-align: start; }
.directory-table thead { background: var(--surface-subtle, #eef4fc); }
.directory-table tbody tr + tr { border-top: 1px solid var(--line); }
.directory-protocol {
  display: inline-block;
  padding: 3px 7px;
  border-radius: 5px;
  background: var(--surface-subtle, #eef4fc);
  color: var(--blue);
  font-size: 12px;
}
.directory-pagination { justify-content: center; margin-top: 12px; }
.directory-pagination button { color: var(--blue); }
.directory-pagination button:disabled { opacity: 0.5; cursor: default; }
.node-directory .directory-empty { padding: 16px; }
</style>
