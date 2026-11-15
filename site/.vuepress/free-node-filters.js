export const nodeProtocols = {
  vless: 'VLESS',
  ss: 'Shadowsocks',
  socks5: 'SOCKS5',
  vmess: 'VMess',
  http: 'HTTP',
  trojan: 'Trojan',
  hysteria2: 'Hysteria 2',
  hysteria: 'Hysteria',
  tuic: 'TUIC',
  anytls: 'AnyTLS',
}

export function matchesNodeFilters(node, region, protocols) {
  return (!region || node.region === region) && (protocols === null || protocols.includes(node.protocol))
}
