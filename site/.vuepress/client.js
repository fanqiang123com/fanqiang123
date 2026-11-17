import { defineClientConfig } from 'vuepress/client'
import PortalLayout from './components/PortalLayout.vue'
import BackToTop from './components/BackToTop.vue'
import './styles/portal.css'
import './styles/portal-dark.css'
export default defineClientConfig({
  enhance({ router }) {
    const scrollBehavior = router.options.scrollBehavior
    const tagScrollPositions = new WeakMap()
    const tagsChanged = (to, from) => JSON.stringify(to.query.tag) !== JSON.stringify(from.query.tag)
    const isTagChange = (to, from) => to.path === '/' && from.path === to.path
      && from.query.category === to.query.category && from.query.q === to.query.q
      && from.query.filter === to.query.filter && from.query.subcategory === to.query.subcategory
      && from.hash === to.hash && tagsChanged(to, from)
    router.beforeEach((to, from) => {
      if (typeof window !== 'undefined' && isTagChange(to, from)) {
        tagScrollPositions.set(to, { left: window.scrollX, top: window.scrollY })
      }
    })
    router.options.scrollBehavior = (to, from, savedPosition) => {
      if (!savedPosition && tagScrollPositions.has(to)) return tagScrollPositions.get(to)

      const sameFeed = to.path === '/' && from.path === to.path
        && from.query.category === to.query.category
        && !from.query['airport-article'] && !to.query['airport-article']
        && from.hash === to.hash
      const filterChanged = from.query.q !== to.query.q
        || from.query.filter !== to.query.filter
        || from.query.subcategory !== to.query.subcategory
        || tagsChanged(to, from)
      if (!savedPosition && sameFeed && filterChanged) return false
      if (!savedPosition && to.hash && typeof document !== 'undefined') {
        const heading = document.getElementById(to.hash.slice(1))
        if (heading?.matches('.detail-article .detail-content :is(h2,h3,h4,h5,h6)')) {
          const top = parseFloat(getComputedStyle(heading).scrollMarginTop) || 0
          return { el: heading, top }
        }
      }
      return scrollBehavior?.(to, from, savedPosition)
    }
  },
  layouts: { PortalLayout },
  rootComponents: [BackToTop],
})
