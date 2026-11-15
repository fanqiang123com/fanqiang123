import { defineClientConfig } from 'vuepress/client'
import PortalLayout from './components/PortalLayout.vue'
import BackToTop from './components/BackToTop.vue'
import './styles/portal.css'
import './styles/portal-dark.css'
export default defineClientConfig({
  enhance({ router }) {
    const scrollBehavior = router.options.scrollBehavior
    const tagScrollPositions = new WeakMap()
    const isTagChange = (to, from) => to.path === '/' && from.path === to.path
      && from.query.category === to.query.category && from.query.q === to.query.q
      && from.query.filter === to.query.filter && from.query.subcategory === to.query.subcategory
      && from.hash === to.hash && from.query.tag !== to.query.tag
    router.beforeEach((to, from) => {
      if (typeof window !== 'undefined' && isTagChange(to, from)) {
        tagScrollPositions.set(to, { left: window.scrollX, top: window.scrollY })
      }
    })
    router.options.scrollBehavior = (to, from, savedPosition) => {
      if (!savedPosition && tagScrollPositions.has(to)) return tagScrollPositions.get(to)

      const sameFeed = to.path === '/' && from.path === to.path
        && from.query.category === to.query.category && from.query.q === to.query.q
        && from.hash === to.hash
      const filterChanged = from.query.filter !== to.query.filter
        || from.query.subcategory !== to.query.subcategory
        || from.query.tag !== to.query.tag
      if (!savedPosition && sameFeed && filterChanged) return false
      return scrollBehavior?.(to, from, savedPosition)
    }
  },
  layouts: { PortalLayout },
  rootComponents: [BackToTop],
})
