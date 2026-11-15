<script setup>
import { RouteLink } from 'vuepress/client'
</script>

<template>
  <nav class="section-breadcrumb tool-breadcrumb" aria-label="面包屑">
    <RouteLink to="/">首页</RouteLink>
    <span aria-hidden="true">/</span>
    <RouteLink to="/tools/">工具资源</RouteLink>
  </nav>
</template>

<style scoped>
.tool-breadcrumb {
  padding-block: 0;
}
#fq-main > .tool-breadcrumb {
  padding-block: var(--section-top-gap) 12px;
}
</style>
