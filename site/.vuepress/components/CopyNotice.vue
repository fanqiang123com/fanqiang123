<script setup>
import PortalIcon from './PortalIcon.vue'

defineProps({ noticeId: Number, inline: Boolean })
</script>

<template>
  <div class="copy-notice" :class="{ 'is-inline': inline, 'is-visible': noticeId }"
    :role="inline ? undefined : 'status'">
    <span v-if="noticeId" :key="noticeId" class="copy-notice-content">
      <PortalIcon type="check"/> 已复制
    </span>
  </div>
</template>

<style scoped>
.copy-notice {
  position:fixed;
  inset-inline-start:50%;
  inset-block-end:calc(24px + env(safe-area-inset-bottom, 0px));
  translate:-50% 0;
  z-index:110;
  width:max-content;
  pointer-events:none;
}
.copy-notice.is-visible {
  padding:8px 14px;
  border:1px solid var(--card-border);
  border-radius:var(--feature-radius);
  background:var(--surface);
  color:var(--ink);
  box-shadow:0 4px 18px rgb(0 0 0 / .16);
  font-size:14px;
  line-height:20px;
}
.copy-notice.is-inline {
  position:static;
  translate:none;
}
.copy-notice-content {
  display:flex;
  align-items:center;
  gap:6px;
}
.copy-notice-content .portal-icon {
  width:16px;
  height:16px;
  color:var(--blue);
}
</style>
