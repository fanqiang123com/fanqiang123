import { withBase } from 'vuepress/client'

export function portalApiUrl(path) {
  const origin = import.meta.env.VITE_PORTAL_API_ORIGIN
  return origin ? new URL(path, origin).href : withBase(path)
}
