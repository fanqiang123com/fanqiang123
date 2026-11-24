<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { RouteLink } from 'vuepress/client'
import { portalApiUrl } from '../portal-api.js'

const offers = ref([])
const status = ref('loading')
const request = new AbortController()
const addedAtFormat = new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
})

onMounted(async () => {
  try {
    const response = await fetch(portalApiUrl('/api/airport-offers'), { signal: request.signal })
    if (!response.ok) throw new Error('Airport offers unavailable')
    const data = await response.json()
    if (!Array.isArray(data.offers)) throw new Error('Invalid airport offers response')
    offers.value = data.offers
    status.value = 'ready'
  } catch {
    if (!request.signal.aborted) status.value = 'error'
  }
})

onUnmounted(() => request.abort())
</script>

<template>
  <section class="tools-directory" aria-labelledby="airport-offers-title">
    <nav class="section-breadcrumb" aria-label="面包屑">
      <RouteLink to="/">首页</RouteLink>
    </nav>
    <h1 id="airport-offers-title">机场优惠码</h1>
    <p v-if="offers.length" class="offer-order">最新收录优先</p>
    <ul v-if="offers.length" class="offer-list" aria-label="机场优惠码列表">
      <li v-for="offer in offers" :key="offer.id" class="offer-row">
        <div class="offer-name">
          <h2>{{ offer.airport }}</h2>
          <p v-if="offer.plan">{{ offer.plan }}</p>
        </div>
        <dl class="offer-details">
          <div v-if="offer.price"><dt>套餐价格</dt><dd>{{ offer.price }}</dd></div>
          <div v-if="offer.traffic"><dt>流量</dt><dd>{{ offer.traffic }}</dd></div>
          <div>
            <dt>优惠码</dt>
            <dd><code>{{ offer.code }}</code></dd>
          </div>
          <div><dt>收录时间</dt><dd><time :datetime="offer.addedAt">{{ addedAtFormat.format(new Date(offer.addedAt)) }}</time></dd></div>
        </dl>
      </li>
    </ul>
    <p v-else class="offer-row offer-order" role="status">
      {{ status === 'loading' ? '正在加载机场优惠码…' : status === 'error' ? '暂时无法加载机场优惠码。' : '暂未收录机场优惠码。' }}
    </p>
  </section>
</template>

<style scoped src="../styles/airport-offers.css"></style>
