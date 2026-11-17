<script setup>
import { useDarkMode } from '@theme/useDarkMode'

const darkMode = useDarkMode()
</script>

<template>
  <button
    class="appearance-switch"
    type="button"
    role="switch"
    aria-label="深色模式"
    :aria-checked="darkMode"
    :title="darkMode ? '切换到浅色模式' : '切换到深色模式'"
    @click="darkMode = !darkMode"
  >
    <span class="appearance-track" aria-hidden="true">
      <span class="appearance-thumb">
        <svg class="appearance-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>
        </svg>
        <svg class="appearance-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      </span>
    </span>
  </button>
</template>

<style scoped>
.appearance-switch {
  display:grid;
  place-items:center;
  flex:none;
  width:44px;
  height:44px;
  padding:0;
  border-radius:8px;
}
.appearance-track {
  position:relative;
  display:block;
  width:40px;
  height:22px;
  border:1px solid #c2c2c4;
  border-radius:11px;
  background:rgb(142 150 170 / .14);
  transition:border-color .25s ease, background-color .25s ease;
}
.appearance-thumb {
  position:absolute;
  inset:1px auto auto 1px;
  width:18px;
  height:18px;
  border-radius:50%;
  background:#fff;
  color:rgb(60 60 67 / .78);
  box-shadow:0 1px 2px rgb(0 0 0 / .04),0 1px 2px rgb(0 0 0 / .06);
  transition:transform .25s ease;
}
.appearance-thumb svg {
  position:absolute;
  inset:3px;
  width:12px;
  height:12px;
  transition:opacity .25s ease;
}
.appearance-moon,.appearance-switch[aria-checked='true'] .appearance-sun { opacity:0; }
.appearance-switch[aria-checked='true'] .appearance-moon { opacity:1; }
.appearance-switch[aria-checked='true'] .appearance-track {
  border-color:#3c3f44;
  background:rgb(101 117 133 / .16);
}
.appearance-switch[aria-checked='true'] .appearance-thumb {
  transform:translateX(18px);
  background:#000;
  color:rgb(255 255 245 / .86);
  box-shadow:0 1px 2px rgb(0 0 0 / .27),0 1px 2px rgb(0 0 0 / .22);
}
.appearance-switch:is(:hover,:focus-visible) .appearance-track { border-color:var(--blue); }
@media (prefers-reduced-motion:reduce) {
  .appearance-track,.appearance-thumb,.appearance-thumb svg { transition:none; }
}
</style>
