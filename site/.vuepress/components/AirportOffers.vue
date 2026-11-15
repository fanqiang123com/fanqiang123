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

<style scoped>
.tools-directory > .section-breadcrumb { padding-block:0; }
.offer-order {
  color:var(--muted);
  font-size:14px;
}
.offer-list {
  display:grid;
  gap:12px;
  margin:0;
  padding:0;
  list-style:none;
}
.offer-row {
  display:grid;
  grid-template-columns:minmax(0,1fr) minmax(0,3fr);
  gap:18px;
  padding:18px;
  border:1px solid var(--line);
  border-radius:10px;
  background:var(--surface,#fff);
  overflow-wrap:anywhere;
}
.offer-name h2 {
  font-size:17px;
}
.offer-name p,.offer-details dt {
  color:var(--muted);
}
.offer-details {
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:12px;
  margin:0;
}
.offer-details dd {
  margin:3px 0 0;
  font-weight:600;
}
.offer-details code {
  padding:2px 5px;
  border-radius:4px;
  background:var(--control-hover,#eef3ff);
  color:var(--blue);
}
@media(max-width:680px) {
  .offer-row {
    grid-template-columns:1fr;
    gap:12px;
  }
  .offer-details {
    grid-template-columns:repeat(2,minmax(0,1fr));
  }
}
</style>
