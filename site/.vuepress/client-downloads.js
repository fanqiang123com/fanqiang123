// Public fixed paths from the Resource software catalog. Versions are managed by Resource.
const downloadOrigin = 'https://downloads.gemcook.net'

export const platforms = [
  ['windows', 'Windows'],
  ['macos', 'macOS'],
  ['android', 'Android'],
  ['ios', 'iOS'],
  ['linux', 'Linux'],
]

const architectureLabels = {
  windows: { x64: 'x64', arm64: 'ARM64' },
  macos: { x64: 'Intel', arm64: 'Apple 芯片', universal: '通用' },
  android: { arm64: 'ARM64', armv7: 'ARMv7', universal: '通用' },
  linux: { x64: 'x64', arm64: 'ARM64' },
}

function mirrorClient(id, name, packages, official = {}) {
  const downloads = Object.fromEntries(Object.entries(packages).map(([platform, files]) => [
    platform,
    files.map(file => {
      const [arch, format] = file.split('.')
      return {
        label: `${architectureLabels[platform][arch]} · ${format === 'appimage' ? 'AppImage' : format.toUpperCase()}`,
        href: `${downloadOrigin}/downloads/software/${id}/${id}-${platform}-${file}`,
        mirrored: true,
      }
    }),
  ]))
  return { id, name, downloads: { ...downloads, ...official } }
}

function appStoreClient(id, name, href, macos) {
  const store = { label: 'App Store', href, catalogVersion: true }
  return { id, name, downloads: { ios: [store], macos: [macos ?? store] } }
}

export const downloadClients = [
  mirrorClient('clash-verge-rev', 'Clash Verge Rev', {
    windows: ['x64.exe', 'arm64.exe'],
    macos: ['arm64.dmg', 'x64.dmg'],
    linux: ['x64.deb', 'x64.rpm', 'arm64.deb', 'arm64.rpm'],
  }),
  mirrorClient('clash-nyanpasu', 'Clash Nyanpasu', {
    windows: ['x64.exe', 'arm64.exe'],
    macos: ['arm64.dmg', 'x64.dmg'],
  }, {
    linux: [{ label: '官方发行页', href: 'https://github.com/libnyanpasu/clash-nyanpasu/releases/latest' }],
  }),
  mirrorClient('flclash', 'FlClash', {
    windows: ['x64.exe', 'arm64.exe'],
    macos: ['arm64.dmg', 'x64.dmg'],
    android: ['arm64.apk', 'armv7.apk'],
    linux: ['x64.appimage', 'arm64.appimage'],
  }),
  mirrorClient('v2rayn', 'v2rayN', {
    windows: ['x64.zip', 'arm64.zip'],
    macos: ['arm64.dmg', 'x64.dmg'],
    linux: ['x64.deb', 'x64.rpm', 'arm64.deb', 'arm64.rpm'],
  }),
  mirrorClient('v2rayng', 'v2rayNG', {
    android: ['universal.apk', 'arm64.apk', 'armv7.apk'],
  }),
  mirrorClient('hiddify', 'Hiddify', {
    windows: ['x64.exe'],
    macos: ['universal.dmg'],
    android: ['universal.apk', 'arm64.apk', 'armv7.apk'],
    linux: ['x64.appimage', 'x64.deb'],
  }, {
    ios: [{ label: 'App Store', href: 'https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532' }],
  }),
  mirrorClient('clash-meta-android', 'Clash Meta for Android', {
    android: ['universal.apk', 'arm64.apk', 'armv7.apk'],
  }),
  appStoreClient('shadowrocket', 'Shadowrocket', 'https://apps.apple.com/us/app/shadowrocket/id932747118'),
  appStoreClient('surge', 'Surge', 'https://apps.apple.com/us/app/surge-5/id1442620678', {
    label: '官网下载', href: 'https://nssurge.com/support/mac/release-notes/',
  }),
  appStoreClient('quantumult-x', 'Quantumult X', 'https://apps.apple.com/us/app/quantumult-x/id1443988620'),
]
