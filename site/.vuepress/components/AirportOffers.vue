<script setup>
import { RouteLink } from 'vuepress/client'
import { airportOffers } from '../airport-offers.js'

const offers = [...airportOffers].sort((a, b) => b.addedOn.localeCompare(a.addedOn))
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
          <p>{{ offer.plan }}</p>
        </div>
        <dl class="offer-details">
          <div><dt>套餐价格</dt><dd>{{ offer.price }}</dd></div>
          <div><dt>流量</dt><dd>{{ offer.traffic }}</dd></div>
          <div>
            <dt>优惠码</dt>
            <dd><code>{{ offer.code }}</code></dd>
          </div>
          <div><dt>收录日期</dt><dd><time :datetime="offer.addedOn">{{ offer.addedOn }}</time></dd></div>
        </dl>
      </li>
    </ul>
    <p v-else class="offer-row offer-order">暂未收录机场优惠码。</p>
  </section>
</template>

<style scoped src="../styles/airport-offers.css"></style>
