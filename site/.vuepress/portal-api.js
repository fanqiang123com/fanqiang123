import { withBase } from 'vuepress/client'

export function portalApiUrl(path) {
  const origin = import.meta.env.VITE_fanqiang123_API_ORIGIN
  return origin ? new URL(path, origin).href : withBase(path)
}
