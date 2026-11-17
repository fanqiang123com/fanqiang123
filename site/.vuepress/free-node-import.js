export const importPlatforms = [
  { id: 'ios', label: 'iOS' },
  { id: 'android', label: 'Android' },
  { id: 'windows', label: 'Windows' },
  { id: 'macos', label: 'macOS' },
  { id: 'linux', label: 'Linux' },
]

export const importClients = [
  { id: 'shadowrocket', name: 'Shadowrocket', platforms: ['ios', 'macos'], format: 'v2ray' },
  { id: 'clash-verge-rev', name: 'Clash Verge Rev', platforms: ['windows', 'macos', 'linux'], format: 'clash' },
  { id: 'clash-meta-android', name: 'Clash Meta for Android', platforms: ['android'], format: 'clash' },
  { id: 'v2rayng', name: 'v2rayNG', platforms: ['android'], format: 'v2ray' },
  { id: 'flclash', name: 'FlClash', platforms: ['android', 'windows', 'macos', 'linux'], format: 'clash' },
  { id: 'hiddify', name: 'Hiddify', platforms: ['ios', 'android', 'windows', 'macos', 'linux'], format: 'singbox' },
]

export function detectImportPlatform({ userAgent, platform, maxTouchPoints }) {
  if (/iPhone|iPad|iPod/i.test(userAgent) || (platform === 'MacIntel' && maxTouchPoints > 1)) return 'ios'
  if (/Android/i.test(userAgent)) return 'android'
  if (/Windows/i.test(userAgent)) return 'windows'
  if (/Macintosh|Mac OS/i.test(userAgent)) return 'macos'
  return /Linux/i.test(userAgent) ? 'linux' : 'ios'
}

export function clientImportUrl(client, subscriptionUrl) {
  const name = encodeURIComponent('翻墙123 免费节点')
  const url = encodeURIComponent(subscriptionUrl)
  switch (client) {
    case 'shadowrocket': {
      const encoded = btoa(subscriptionUrl).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
      return `shadowrocket://add/sub://${encoded}?remark=${name}`
    }
    case 'clash-verge-rev':
    case 'clash-meta-android':
      return `clash://install-config?url=${url}&name=${name}`
    case 'flclash':
      return `flclash://install-config?url=${url}&name=${name}`
    case 'v2rayng':
      return `v2rayng://install-sub?url=${url}#${name}`
    case 'hiddify':
      return `hiddify://import/${subscriptionUrl}#${name}`
  }
}
