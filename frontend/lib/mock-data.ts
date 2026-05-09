// Mock data for PHANTOM LAYER

export type WalletType = 'phantom' | 'ghost'
export type WalletStatus = 'active' | 'inactive' | 'low' | 'empty'

export interface Wallet {
  id: string
  type: WalletType
  address: string
  label: string
  balance: number // in USDC
  status: WalletStatus
  createdAt: Date
  lastUsed?: Date
  isActive: boolean
}

export interface Transaction {
  id: string
  walletId: string
  type: 'threat_blocked' | 'dns_query' | 'fingerprint_mask' | 'tracker_block' | 'top_up' | 'rotation'
  amount: number // negative for spend, positive for top-up
  description: string
  timestamp: Date
  txHash: string
}

export interface ThreatEvent {
  id: string
  type: 'tracker' | 'fingerprint' | 'dns_leak' | 'cookie' | 'webrtc' | 'canvas'
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
  blocked: boolean
  cost: number
  timestamp: Date
  details: string
}

export interface Device {
  id: string
  name: string
  type: 'desktop' | 'mobile' | 'tablet' | 'browser_extension'
  status: 'online' | 'offline' | 'paused'
  lastSeen: Date
  threatsBlocked: number
  totalCost: number
}

export interface AnalyticsData {
  threatsBlocked: number
  threatsBlockedChange: number
  uptime: number
  uptimeChange: number
  totalSpent: number
  totalSpentChange: number
  avgCostPerDay: number
  avgCostPerDayChange: number
  dailyData: { date: string; threats: number; cost: number }[]
  threatsByType: { type: string; count: number; percentage: number }[]
}

// Generate realistic mock addresses
export function generateMockAddress(): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  let address = ''
  for (let i = 0; i < 44; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return address
}

export function formatAddress(address: string, chars: number = 4): string {
  if (address.length <= chars * 2 + 3) return address
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function generateTxHash(): string {
  const chars = '0123456789abcdef'
  let hash = ''
  for (let i = 0; i < 64; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return hash
}

// Initial wallets
export const mockWallets: Wallet[] = [
  {
    id: 'phantom-1',
    type: 'phantom',
    address: '8xKfQrNwCvPaJzYhD7mB3nE9gR2wS6tU1vX4yZ5aB3mP',
    label: 'Main Wallet',
    balance: 12.50,
    status: 'active',
    createdAt: new Date('2024-01-15'),
    lastUsed: new Date(),
    isActive: false,
  },
  {
    id: 'ghost-1',
    type: 'ghost',
    address: 'Gh0st7kR4nD0mK3yP41rT82bN5cX9wQ6eF3jM2sL7vY',
    label: 'Ghost Wallet #1',
    balance: 2.34,
    status: 'active',
    createdAt: new Date('2024-02-20'),
    lastUsed: new Date(),
    isActive: true,
  },
  {
    id: 'ghost-2',
    type: 'ghost',
    address: 'Sp3cTr4L8dR3sS9vM2kN5xB7cQ1wE6rT4yU0pA3iO9j',
    label: 'Ghost Wallet #2',
    balance: 0.45,
    status: 'low',
    createdAt: new Date('2024-03-10'),
    lastUsed: new Date(Date.now() - 86400000),
    isActive: false,
  },
  {
    id: 'ghost-3',
    type: 'ghost',
    address: 'Ph4nT0m5hD0wK3y2P41rN8cX9wQ6eF3jM2sL7vY1bC',
    label: 'Ghost Wallet #3',
    balance: 0,
    status: 'empty',
    createdAt: new Date('2024-03-15'),
    lastUsed: new Date(Date.now() - 172800000),
    isActive: false,
  },
]

// Generate transactions
const transactionTypes: Transaction['type'][] = ['threat_blocked', 'dns_query', 'fingerprint_mask', 'tracker_block']
const transactionDescriptions: Record<Transaction['type'], string[]> = {
  threat_blocked: ['Blocked tracking pixel', 'Blocked fingerprint attempt', 'Blocked canvas fingerprint', 'Blocked WebRTC leak'],
  dns_query: ['DNS query encrypted', 'DNS resolution protected', 'DNS leak prevented'],
  fingerprint_mask: ['Browser fingerprint masked', 'Canvas fingerprint randomized', 'Audio context masked'],
  tracker_block: ['Google Analytics blocked', 'Facebook Pixel blocked', 'TikTok tracker blocked', 'Criteo tracker blocked'],
  top_up: ['Wallet funded'],
  rotation: ['Wallet rotated'],
}

export const mockTransactions: Transaction[] = Array.from({ length: 50 }, (_, i) => {
  const type = i === 0 ? 'top_up' : transactionTypes[Math.floor(Math.random() * transactionTypes.length)]
  const descriptions = transactionDescriptions[type]
  const walletIds = ['ghost-1', 'ghost-2', 'phantom-1']
  
  return {
    id: `tx-${i + 1}`,
    walletId: walletIds[Math.floor(Math.random() * walletIds.length)],
    type,
    amount: type === 'top_up' ? 5.00 : -(Math.random() * 0.005 + 0.001),
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    timestamp: new Date(Date.now() - i * 120000), // Every 2 minutes
    txHash: generateTxHash(),
  }
})

// Generate threat events
const threatTypes: ThreatEvent['type'][] = ['tracker', 'fingerprint', 'dns_leak', 'cookie', 'webrtc', 'canvas']
const threatSources = [
  'google-analytics.com', 'facebook.com', 'doubleclick.net', 'criteo.com',
  'tiktok.com', 'amazon-adsystem.com', 'adnxs.com', 'pubmatic.com',
  'rubiconproject.com', 'openx.net', 'taboola.com', 'outbrain.com'
]

export const mockThreatEvents: ThreatEvent[] = Array.from({ length: 100 }, (_, i) => {
  const type = threatTypes[Math.floor(Math.random() * threatTypes.length)]
  const severities: ThreatEvent['severity'][] = ['low', 'medium', 'high', 'critical']
  const severity = severities[Math.floor(Math.random() * severities.length)]
  
  return {
    id: `threat-${i + 1}`,
    type,
    severity,
    source: threatSources[Math.floor(Math.random() * threatSources.length)],
    blocked: true,
    cost: Math.random() * 0.003 + 0.0005,
    timestamp: new Date(Date.now() - i * 30000), // Every 30 seconds
    details: `${type.replace('_', ' ')} attempt from ${threatSources[Math.floor(Math.random() * threatSources.length)]}`,
  }
})

// Mock devices
export const mockDevices: Device[] = [
  {
    id: 'device-1',
    name: 'MacBook Pro',
    type: 'desktop',
    status: 'online',
    lastSeen: new Date(),
    threatsBlocked: 1247,
    totalCost: 3.42,
  },
  {
    id: 'device-2',
    name: 'iPhone 15',
    type: 'mobile',
    status: 'online',
    lastSeen: new Date(),
    threatsBlocked: 892,
    totalCost: 2.18,
  },
  {
    id: 'device-3',
    name: 'Chrome Extension',
    type: 'browser_extension',
    status: 'online',
    lastSeen: new Date(),
    threatsBlocked: 3421,
    totalCost: 8.94,
  },
  {
    id: 'device-4',
    name: 'iPad Air',
    type: 'tablet',
    status: 'offline',
    lastSeen: new Date(Date.now() - 86400000),
    threatsBlocked: 234,
    totalCost: 0.67,
  },
]

// Analytics data
export const mockAnalytics: AnalyticsData = {
  threatsBlocked: 5794,
  threatsBlockedChange: 12.4,
  uptime: 99.8,
  uptimeChange: 0.2,
  totalSpent: 15.21,
  totalSpentChange: 8.3,
  avgCostPerDay: 0.42,
  avgCostPerDayChange: -3.1,
  dailyData: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    threats: Math.floor(Math.random() * 300 + 100),
    cost: Math.random() * 0.8 + 0.2,
  })),
  threatsByType: [
    { type: 'Trackers', count: 2341, percentage: 40.4 },
    { type: 'Fingerprinting', count: 1456, percentage: 25.1 },
    { type: 'Cookies', count: 987, percentage: 17.0 },
    { type: 'DNS Leaks', count: 534, percentage: 9.2 },
    { type: 'WebRTC', count: 298, percentage: 5.1 },
    { type: 'Canvas', count: 178, percentage: 3.2 },
  ],
}

// Pricing configuration
export const pricingConfig = {
  perMinuteProtection: 0.0001, // $0.0001 per minute
  perThreatBlocked: 0.002, // $0.002 per threat
  perDnsQuery: 0.00005, // $0.00005 per DNS query
  perFingerprintMask: 0.001, // $0.001 per fingerprint mask
  minTopUp: 0.10,
  maxTopUp: 50.00,
  lowBalanceThreshold: 0.50,
  criticalBalanceThreshold: 0.10,
}
