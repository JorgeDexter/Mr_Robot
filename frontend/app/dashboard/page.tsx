'use client'

import { useWalletStore } from '@/store/wallet-store'
import { mockThreatEvents, pricingConfig, type ThreatEvent } from '@/lib/mock-data'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Shield, 
  ShieldOff, 
  Zap, 
  Activity,
  AlertTriangle,
  Globe,
  Fingerprint,
  Cookie,
  Wifi,
  Eye
} from 'lucide-react'

const threatIcons: Record<ThreatEvent['type'], typeof Shield> = {
  tracker: Globe,
  fingerprint: Fingerprint,
  dns_leak: Wifi,
  cookie: Cookie,
  webrtc: Wifi,
  canvas: Eye,
}

const severityColors: Record<ThreatEvent['severity'], string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-warning/20 text-warning',
  high: 'bg-destructive/20 text-destructive',
  critical: 'bg-destructive text-destructive-foreground',
}

export default function LiveFeedPage() {
  const { 
    isProtectionActive, 
    toggleProtection, 
    activeWalletId, 
    wallets,
    sessionSpent,
    openTopUpModal,
  } = useWalletStore()

  const activeWallet = wallets.find(w => w.id === activeWalletId)
  const [threats, setThreats] = useState<ThreatEvent[]>(mockThreatEvents.slice(0, 10))
  const [threatCount, setThreatCount] = useState(0)

  // Simulate new threats coming in
  useEffect(() => {
    if (!isProtectionActive) return

    const interval = setInterval(() => {
      const randomThreat = mockThreatEvents[Math.floor(Math.random() * mockThreatEvents.length)]
      const newThreat: ThreatEvent = {
        ...randomThreat,
        id: `threat-${Date.now()}`,
        timestamp: new Date(),
      }
      
      setThreats(prev => [newThreat, ...prev.slice(0, 49)])
      setThreatCount(prev => prev + 1)
    }, 3000)

    return () => clearInterval(interval)
  }, [isProtectionActive])

  const canActivate = activeWallet && activeWallet.balance > 0

  return (
    <div className="space-y-6">
      {/* Protection status */}
      <Card className={cn(
        "transition-colors",
        isProtectionActive ? "border-primary/40" : "border-destructive/40"
      )}>
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
              isProtectionActive ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
            )}>
              {isProtectionActive ? (
                <Shield className="h-7 w-7" />
              ) : (
                <ShieldOff className="h-7 w-7" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {isProtectionActive ? 'Protection Active' : 'Protection Paused'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isProtectionActive 
                  ? 'Your privacy is being protected in real-time'
                  : activeWallet?.balance === 0 
                    ? 'Wallet empty - top up to continue'
                    : 'Enable protection to start blocking threats'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {!canActivate && !isProtectionActive && (
              <Button 
                variant="outline" 
                onClick={() => activeWalletId && openTopUpModal(activeWalletId)}
              >
                Top up wallet
              </Button>
            )}
            <Switch
              checked={isProtectionActive}
              onCheckedChange={toggleProtection}
              disabled={!canActivate && !isProtectionActive}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Threats Blocked
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{threats.length + threatCount}</div>
            <p className="text-xs text-muted-foreground">
              {isProtectionActive ? '+1 every ~3s' : 'Protection paused'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Session Spent
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">${sessionSpent.toFixed(4)}</div>
            <p className="text-xs text-muted-foreground">
              ${pricingConfig.perThreatBlocked.toFixed(3)}/threat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Wallet
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              ${activeWallet?.balance.toFixed(2) ?? '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeWallet?.label || 'No wallet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Est. Time Left
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeWallet && activeWallet.balance > 0 
                ? `~${Math.floor(activeWallet.balance / (pricingConfig.perThreatBlocked * 200 + pricingConfig.perMinuteProtection * 60 * 24))}d`
                : '0d'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              At current rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Live threat feed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Live Threat Feed
          </CardTitle>
          {isProtectionActive && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Live
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {threats.slice(0, 20).map((threat, index) => {
              const Icon = threatIcons[threat.type]
              return (
                <div
                  key={threat.id}
                  className={cn(
                    "flex items-center justify-between rounded-lg bg-secondary/30 p-3 transition-all",
                    index === 0 && isProtectionActive && "animate-pulse"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {threat.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <Badge variant="outline" className={cn("text-xs", severityColors[threat.severity])}>
                          {threat.severity}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {threat.source}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm text-primary">
                      -${threat.cost.toFixed(4)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(threat.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
