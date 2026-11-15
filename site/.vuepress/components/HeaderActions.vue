<script setup>
import { useDarkMode } from '@vuepress/theme-default/client'

const darkMode = useDarkMode()
</script>

<template>
  <div class="header-actions" role="group" aria-label="站点快捷操作">
    <button type="button" disabled aria-label="Telegram（暂未配置）" title="Telegram">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.7 3.8 2.8 10.7c-1 .4-1 1 .1 1.3l4.6 1.5 1.8 5.5c.2.6.5.7.9.3l2.6-2.6 4.9 3.6c.9.5 1.4.2 1.6-.8l3-14.3c.3-1.1-.4-1.8-1.6-1.4ZM9.4 16.5l-.8-3.7 10.2-6.3c.5-.3.7 0 .3.3l-8.4 7.6-.3 3.1-.9-1Z"/>
      </svg>
    </button>
    <button type="button" disabled aria-label="GitHub（暂未配置）" title="GitHub">
      <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38l-.01-1.49c-2.23.48-2.7-.95-2.7-.95-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.22 1.88.87 2.34.66.07-.52.28-.87.51-1.07-1.78-.2-3.65-.89-3.65-3.96 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.67 7.67 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.08-1.87 3.76-3.66 3.96.29.25.54.74.54 1.49l-.01 2.19c0 .21.15.46.55.38A8 8 0 0 0 8 0Z"/>
      </svg>
    </button>
    <span class="appearance-label">外观</span>
    <button
      type="button"
      :aria-label="darkMode ? '切换到浅色模式' : '切换到深色模式'"
      :title="darkMode ? '切换到浅色模式' : '切换到深色模式'"
      @click="darkMode = !darkMode"
    >
      <svg v-if="darkMode" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true">
        <path d="M20.9 14.1A9 9 0 0 1 9.9 3.1a9 9 0 1 0 11 11Z"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.header-actions {
  display:flex;
  align-items:center;
  flex:none;
  gap:3px;
  margin-inline-start:auto;
  color:var(--ink);
}
.header-actions button {
  display:grid;
  place-items:center;
  width:32px;
  height:44px;
  padding:0;
  border-radius:8px;
}
.header-actions button:disabled {
  color:inherit;
  opacity:.48;
  cursor:default;
}
.header-actions svg {
  width:18px;
  height:18px;
}
.appearance-label { display:none; }
@media (max-width:780px) {
  .appearance-label { display:inline; }
  .header-actions {
    justify-content:space-between;
    margin-top:8px;
    padding-inline:12px 4px;
    border-radius:8px;
    background:var(--surface-subtle);
    color:var(--muted);
    font-size:13px;
  }
  .header-actions button:disabled { display:none; }
}
@media (pointer:coarse) {
  .header-actions button {
    width:44px;
  }
}
</style>
