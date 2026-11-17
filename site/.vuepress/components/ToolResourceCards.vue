<script setup>
import { RouteLink } from 'vuepress/client'
import { toolResources } from '../portal.js'
import PortalIcon from './PortalIcon.vue'
</script>

<template>
  <section class="tools-directory tools-index entry-grid" aria-label="工具资源">
    <RouteLink v-for="resource in toolResources" :key="resource.to" :to="resource.to">
      <span class="entry-icon" :class="resource.color"><PortalIcon :type="resource.icon"/></span>
      <h2>{{ resource.name }}</h2>
      <p>{{ resource.description }}</p>
      <span aria-hidden="true">→</span>
    </RouteLink>
  </section>
</template>
