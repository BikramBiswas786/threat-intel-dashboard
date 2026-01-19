// src/data/tools.ts
// ⚠️ DEMO DATA - Replace with real API data from Apify/PostgreSQL

export interface Tool {
  id: number;
  name: string;
  category: string;
  priority: number;
  description?: string;
  price?: number; // Price in USD
  acceptsMonero: boolean;
  moneroAddress?: string;
  website?: string;
  metrics: {
    status: 'working' | 'slow' | 'blocked';
    speed: number;
    confidence: number;
    daysUntilBlock: number;
  };
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  freedom: number;
  priority: number;
  population: number;
}

export const TOOLS: Tool[] = [
  // Privacy Networks (5)
  { 
    id: 1, 
    name: 'Tor Browser', 
    category: 'Anonymity', 
    priority: 1,
    description: 'Free anonymity network',
    price: 0,
    acceptsMonero: false,
    website: 'https://www.torproject.org',
    metrics: {
      status: 'working',
      speed: 3.2,
      confidence: 98,
      daysUntilBlock: 138
    }
  },
  { 
    id: 2, 
    name: 'NYM VPN', 
    category: 'Mixnet', 
    priority: 1,
    description: 'Privacy mixnet with superior anonymity',
    price: 10,
    acceptsMonero: true,
    moneroAddress: '4AdUndXHHZ6cfufTMvppY6JwXNouMBzSkbLYfpAV5Usx3skxNgYeYTRj5UzqtReoS44qo9mtmXCqY45DJ852K5Jv2684Rge',
    website: 'https://nymtech.net',
    metrics: {
      status: 'slow',
      speed: 4.3,
      confidence: 70,
      daysUntilBlock: 203
    }
  },
  { 
    id: 3, 
    name: 'I2P', 
    category: 'Anonymity', 
    priority: 2, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'working',
      speed: 2.1,
      confidence: 69,
      daysUntilBlock: 65
    }
  },
  { 
    id: 4, 
    name: 'Lokinet', 
    category: 'Mixnet', 
    priority: 2, 
    price: 5, 
    acceptsMonero: true, 
    moneroAddress: '4AdUndXHHZ6cfufTMvppY6JwXNouMBzSkbLYfpAV5Usx3skxNgYeYTRj5UzqtReoS44qo9mtmXCqY45DJ852K5Jv2684Rge',
    metrics: {
      status: 'slow',
      speed: 7.9,
      confidence: 84,
      daysUntilBlock: 64
    }
  },
  { 
    id: 5, 
    name: 'Orchid VPN', 
    category: 'Decentralized', 
    priority: 2, 
    price: 8, 
    acceptsMonero: false,
    metrics: {
      status: 'working',
      speed: 7.3,
      confidence: 82,
      daysUntilBlock: 94
    }
  },
  
  // Commercial VPNs (20)
  { 
    id: 6, 
    name: 'Mullvad VPN', 
    category: 'Commercial', 
    priority: 1, 
    price: 5, 
    acceptsMonero: true, 
    moneroAddress: '4AdUndXHHZ6cfufTMvppY6JwXNouMBzSkbLYfpAV5Usx3skxNgYeYTRj5UzqtReoS44qo9mtmXCqY45DJ852K5Jv2684Rge',
    metrics: {
      status: 'blocked',
      speed: 0,
      confidence: 84,
      daysUntilBlock: 152
    }
  },
  { 
    id: 7, 
    name: 'ProtonVPN', 
    category: 'Commercial', 
    priority: 1, 
    price: 10, 
    acceptsMonero: false,
    metrics: {
      status: 'slow',
      speed: 9.3,
      confidence: 94,
      daysUntilBlock: 151
    }
  },
  { 
    id: 8, 
    name: 'ExpressVPN', 
    category: 'Commercial', 
    priority: 1, 
    price: 12, 
    acceptsMonero: false,
    metrics: {
      status: 'working',
      speed: 4.5,
      confidence: 81,
      daysUntilBlock: 164
    }
  },
  { 
    id: 9, 
    name: 'NordVPN', 
    category: 'Commercial', 
    priority: 1, 
    price: 11, 
    acceptsMonero: false,
    metrics: {
      status: 'blocked',
      speed: 0,
      confidence: 75,
      daysUntilBlock: 62
    }
  },
  { 
    id: 10, 
    name: 'Surfshark', 
    category: 'Commercial', 
    priority: 2, 
    price: 9, 
    acceptsMonero: false,
    metrics: {
      status: 'slow',
      speed: 10.3,
      confidence: 82,
      daysUntilBlock: 97
    }
  },
  { 
    id: 11, 
    name: 'IVPN', 
    category: 'Commercial', 
    priority: 2, 
    price: 10, 
    acceptsMonero: true, 
    moneroAddress: '4AdUndXHHZ6cfufTMvppY6JwXNouMBzSkbLYfpAV5Usx3skxNgYeYTRj5UzqtReoS44qo9mtmXCqY45DJ852K5Jv2684Rge',
    metrics: {
      status: 'slow',
      speed: 10.4,
      confidence: 62,
      daysUntilBlock: 21
    }
  },
  { 
    id: 12, 
    name: 'Private Internet Access', 
    category: 'Commercial', 
    priority: 2, 
    price: 7, 
    acceptsMonero: false,
    metrics: {
      status: 'slow',
      speed: 7.1,
      confidence: 76,
      daysUntilBlock: 52
    }
  },
  { 
    id: 13, 
    name: 'Windscribe', 
    category: 'Commercial', 
    priority: 2, 
    price: 9, 
    acceptsMonero: false,
    metrics: {
      status: 'slow',
      speed: 5.3,
      confidence: 73,
      daysUntilBlock: 184
    }
  },
  { 
    id: 14, 
    name: 'CyberGhost', 
    category: 'Commercial', 
    priority: 2, 
    price: 11, 
    acceptsMonero: false,
    metrics: {
      status: 'working',
      speed: 6.4,
      confidence: 73,
      daysUntilBlock: 182
    }
  },
  { 
    id: 15, 
    name: 'Hotspot Shield', 
    category: 'Commercial', 
    priority: 3, 
    price: 8, 
    acceptsMonero: false,
    metrics: {
      status: 'working',
      speed: 9.0,
      confidence: 90,
      daysUntilBlock: 141
    }
  },
  { 
    id: 16, 
    name: 'TunnelBear', 
    category: 'Commercial', 
    priority: 3, 
    price: 10, 
    acceptsMonero: false,
    metrics: {
      status: 'blocked',
      speed: 0,
      confidence: 73,
      daysUntilBlock: 205
    }
  },
  { 
    id: 17, 
    name: 'VPNArea', 
    category: 'Commercial', 
    priority: 3, 
    price: 9, 
    acceptsMonero: false,
    metrics: {
      status: 'working',
      speed: 2.8,
      confidence: 93,
      daysUntilBlock: 71
    }
  },
  { 
    id: 18, 
    name: 'Hide.me', 
    category: 'Commercial', 
    priority: 3, 
    price: 10, 
    acceptsMonero: false,
    metrics: {
      status: 'blocked',
      speed: 0,
      confidence: 82,
      daysUntilBlock: 126
    }
  },
  { 
    id: 19, 
    name: 'PureVPN', 
    category: 'Commercial', 
    priority: 3, 
    price: 11, 
    acceptsMonero: false,
    metrics: {
      status: 'working',
      speed: 9.6,
      confidence: 85,
      daysUntilBlock: 166
    }
  },
  { 
    id: 20, 
    name: 'Astrill VPN', 
    category: 'Commercial', 
    priority: 2, 
    price: 15, 
    acceptsMonero: false,
    metrics: {
      status: 'working',
      speed: 4.9,
      confidence: 94,
      daysUntilBlock: 172
    }
  },
  { 
    id: 21, 
    name: 'VyprVPN', 
    category: 'Commercial', 
    priority: 3, 
    price: 10, 
    acceptsMonero: false,
    metrics: {
      status: 'blocked',
      speed: 0,
      confidence: 82,
      daysUntilBlock: 125
    }
  },
  { 
    id: 22, 
    name: 'IPVanish', 
    category: 'Commercial', 
    priority: 3, 
    price: 10, 
    acceptsMonero: false,
    metrics: {
      status: 'working',
      speed: 4.0,
      confidence: 96,
      daysUntilBlock: 29
    }
  },
  { 
    id: 23, 
    name: 'ZenMate', 
    category: 'Commercial', 
    priority: 3, 
    price: 9, 
    acceptsMonero: false,
    metrics: {
      status: 'working',
      speed: 4.8,
      confidence: 76,
      daysUntilBlock: 33
    }
  },
  { 
    id: 24, 
    name: 'StrongVPN', 
    category: 'Commercial', 
    priority: 3, 
    price: 10, 
    acceptsMonero: false,
    metrics: {
      status: 'working',
      speed: 10.5,
      confidence: 66,
      daysUntilBlock: 85
    }
  },
  { 
    id: 25, 
    name: 'Perfect Privacy', 
    category: 'Commercial', 
    priority: 3, 
    price: 13, 
    acceptsMonero: false,
    metrics: {
      status: 'working',
      speed: 8.5,
      confidence: 80,
      daysUntilBlock: 108
    }
  },
  
  // Circumvention Tools (15)
  { 
    id: 26, 
    name: 'Psiphon', 
    category: 'Circumvention', 
    priority: 1, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'slow',
      speed: 5.9,
      confidence: 77,
      daysUntilBlock: 29
    }
  },
  { 
    id: 27, 
    name: 'Lantern', 
    category: 'Circumvention', 
    priority: 1, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'blocked',
      speed: 0,
      confidence: 79,
      daysUntilBlock: 12
    }
  },
  { 
    id: 28, 
    name: 'Shadowsocks', 
    category: 'Circumvention', 
    priority: 1, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'slow',
      speed: 9.1,
      confidence: 91,
      daysUntilBlock: 123
    }
  },
  { 
    id: 29, 
    name: 'V2Ray', 
    category: 'Circumvention', 
    priority: 1, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'slow',
      speed: 7.3,
      confidence: 91,
      daysUntilBlock: 144
    }
  },
  { 
    id: 30, 
    name: 'Outline VPN', 
    category: 'Circumvention', 
    priority: 1, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'working',
      speed: 2.2,
      confidence: 75,
      daysUntilBlock: 158
    }
  },
  { 
    id: 31, 
    name: 'SoftEther VPN', 
    category: 'Circumvention', 
    priority: 2, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'slow',
      speed: 6.4,
      confidence: 97,
      daysUntilBlock: 42
    }
  },
  { 
    id: 32, 
    name: 'OpenVPN', 
    category: 'Circumvention', 
    priority: 2, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'blocked',
      speed: 0,
      confidence: 71,
      daysUntilBlock: 63
    }
  },
  { 
    id: 33, 
    name: 'WireGuard', 
    category: 'Circumvention', 
    priority: 1, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'working',
      speed: 7.8,
      confidence: 64,
      daysUntilBlock: 110
    }
  },
  { 
    id: 34, 
    name: 'Streisand', 
    category: 'Circumvention', 
    priority: 3, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'working',
      speed: 8.2,
      confidence: 82,
      daysUntilBlock: 37
    }
  },
  { 
    id: 35, 
    name: 'Algo VPN', 
    category: 'Circumvention', 
    priority: 3, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'slow',
      speed: 8.3,
      confidence: 89,
      daysUntilBlock: 145
    }
  },
  { 
    id: 36, 
    name: 'Pritunl', 
    category: 'Circumvention', 
    priority: 3, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'working',
      speed: 2.2,
      confidence: 65,
      daysUntilBlock: 179
    }
  },
  { 
    id: 37, 
    name: 'Tailscale', 
    category: 'Circumvention', 
    priority: 2, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'blocked',
      speed: 0,
      confidence: 86,
      daysUntilBlock: 70
    }
  },
  { 
    id: 38, 
    name: 'ZeroTier', 
    category: 'Circumvention', 
    priority: 3, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'working',
      speed: 8.8,
      confidence: 96,
      daysUntilBlock: 159
    }
  },
  { 
    id: 39, 
    name: 'Nebula', 
    category: 'Circumvention', 
    priority: 3, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'working',
      speed: 8.8,
      confidence: 68,
      daysUntilBlock: 167
    }
  },
  { 
    id: 40, 
    name: 'Twingate', 
    category: 'Circumvention', 
    priority: 3, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'blocked',
      speed: 0,
      confidence: 75,
      daysUntilBlock: 105
    }
  },
  
  // Secure Messaging (10)
  { 
    id: 41, 
    name: 'Signal', 
    category: 'Messaging', 
    priority: 1, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'blocked',
      speed: 0,
      confidence: 67,
      daysUntilBlock: 128
    }
  },
  { 
    id: 42, 
    name: 'Telegram', 
    category: 'Messaging', 
    priority: 1, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'slow',
      speed: 3.1,
      confidence: 81,
      daysUntilBlock: 138
    }
  },
  { 
    id: 43, 
    name: 'WhatsApp', 
    category: 'Messaging', 
    priority: 2, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'slow',
      speed: 3.8,
      confidence: 94,
      daysUntilBlock: 103
    }
  },
  { 
    id: 44, 
    name: 'Wire', 
    category: 'Messaging', 
    priority: 2, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'slow',
      speed: 7.5,
      confidence: 68,
      daysUntilBlock: 206
    }
  },
  { 
    id: 45, 
    name: 'Threema', 
    category: 'Messaging', 
    priority: 2, 
    price: 4, 
    acceptsMonero: false,
    metrics: {
      status: 'working',
      speed: 5.5,
      confidence: 65,
      daysUntilBlock: 127
    }
  },
  { 
    id: 46, 
    name: 'Element (Matrix)', 
    category: 'Messaging', 
    priority: 2, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'blocked',
      speed: 0,
      confidence: 79,
      daysUntilBlock: 160
    }
  },
  { 
    id: 47, 
    name: 'Session', 
    category: 'Messaging', 
    priority: 2, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'blocked',
      speed: 0,
      confidence: 78,
      daysUntilBlock: 105
    }
  },
  { 
    id: 48, 
    name: 'Briar', 
    category: 'Messaging', 
    priority: 3, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'working',
      speed: 5.2,
      confidence: 79,
      daysUntilBlock: 12
    }
  },
  { 
    id: 49, 
    name: 'Jami', 
    category: 'Messaging', 
    priority: 3, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'blocked',
      speed: 0,
      confidence: 91,
      daysUntilBlock: 15
    }
  },
  { 
    id: 50, 
    name: 'Status', 
    category: 'Messaging', 
    priority: 3, 
    price: 0, 
    acceptsMonero: false,
    metrics: {
      status: 'blocked',
      speed: 0,
      confidence: 93,
      daysUntilBlock: 150
    }
  },
];

export const COUNTRIES: Country[] = [
  // Critical (11) - Freedom Index 0-30
  { code: 'KP', name: 'North Korea', flag: '🇰🇵', freedom: 2, priority: 1, population: 26 },
  { code: 'CN', name: 'China', flag: '🇨🇳', freedom: 9, priority: 1, population: 1400 },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲', freedom: 11, priority: 1, population: 6 },
  { code: 'SY', name: 'Syria', flag: '🇸🇾', freedom: 14, priority: 1, population: 22 },
  { code: 'IR', name: 'Iran', flag: '🇮🇷', freedom: 18, priority: 1, population: 89 },
  { code: 'LA', name: 'Laos', flag: '🇱🇦', freedom: 20, priority: 1, population: 7 },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', freedom: 22, priority: 1, population: 34 },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺', freedom: 23, priority: 1, population: 11 },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', freedom: 28, priority: 1, population: 102 },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾', freedom: 28, priority: 1, population: 9 },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', freedom: 29, priority: 1, population: 7 },
  
  // High Risk (9) - Freedom Index 30-50
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', freedom: 32, priority: 2, population: 28 },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', freedom: 31, priority: 2, population: 98 },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', freedom: 35, priority: 2, population: 144 },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭', freedom: 33, priority: 2, population: 17 },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲', freedom: 31, priority: 2, population: 54 },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', freedom: 38, priority: 2, population: 10 },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', freedom: 42, priority: 2, population: 71 },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', freedom: 45, priority: 2, population: 230 },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', freedom: 48, priority: 2, population: 10 },
];