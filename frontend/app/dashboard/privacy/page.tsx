'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Shield, 
  Fingerprint, 
  Globe, 
  Cookie, 
  Wifi, 
  Eye,
  RefreshCw,
  Clock,
  AlertTriangle,
  Zap,
  Info
} from 'lucide-react'
import { toast } from 'sonner'

const protectionLevels = [
  { value: 1, label: 'Minimal', description: 'Basic tracker blocking only' },
  { value: 2, label: 'Standard', description: 'Trackers + DNS protection' },
  { value: 3, label: 'Enhanced', description: 'All protections, balanced cost' },
  { value: 4, label: 'Maximum', description: 'All protections, maximum privacy' },
]

export default function PrivacyConfigPage() {
  const [protectionLevel, setProtectionLevel] = useState(3)
  const [settings, setSettings] = useState({
    trackerBlocking: true,
    fingerprintMasking: true,
    dnsProtection: true,
    cookieBlocking: true,
    webrtcProtection: true,
    canvasProtection: true,
    autoRotation: false,
    rotationInterval: 24,
    lowBalanceWarnings: true,
    pauseOnEmpty: true,
  })

  const currentLevel = protectionLevels.find(l => l.value === protectionLevel)

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    toast.success('Setting updated')
  }

  const handleSave = () => {
    toast.success('Settings saved', {
      description: 'Your privacy configuration has been updated.',
    })
  }

  const estimatedCostPerDay = 
    (settings.trackerBlocking ? 0.15 : 0) +
    (settings.fingerprintMasking ? 0.10 : 0) +
    (settings.dnsProtection ? 0.05 : 0) +
    (settings.cookieBlocking ? 0.05 : 0) +
    (settings.webrtcProtection ? 0.03 : 0) +
    (settings.canvasProtection ? 0.04 : 0)

  return (
    <div className="space-y-6">
      {/* Protection Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Protection Level
          </CardTitle>
          <CardDescription>
            Choose your overall privacy protection intensity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{currentLevel?.label}</div>
                <div className="text-sm text-muted-foreground">{currentLevel?.description}</div>
              </div>
              <Badge variant="outline" className="font-mono">
                Level {protectionLevel}/4
              </Badge>
            </div>
            <Slider
              value={[protectionLevel]}
              onValueChange={([v]) => setProtectionLevel(v)}
              min={1}
              max={4}
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Minimal</span>
              <span>Standard</span>
              <span>Enhanced</span>
              <span>Maximum</span>
            </div>
          </div>

          <div className="rounded-lg bg-secondary/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                Estimated daily cost
              </div>
              <span className="font-mono font-semibold">${estimatedCostPerDay.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Protections */}
      <Card>
        <CardHeader>
          <CardTitle>Protection Features</CardTitle>
          <CardDescription>
            Enable or disable individual protection features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tracker Blocking */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <Label htmlFor="tracker-blocking" className="text-base">Tracker Blocking</Label>
                <p className="text-sm text-muted-foreground">
                  Block advertising trackers and analytics scripts
                </p>
              </div>
            </div>
            <Switch
              id="tracker-blocking"
              checked={settings.trackerBlocking}
              onCheckedChange={() => handleToggle('trackerBlocking')}
            />
          </div>

          <Separator />

          {/* Fingerprint Masking */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Fingerprint className="h-5 w-5" />
              </div>
              <div>
                <Label htmlFor="fingerprint-masking" className="text-base">Fingerprint Masking</Label>
                <p className="text-sm text-muted-foreground">
                  Randomize browser fingerprint on each request
                </p>
              </div>
            </div>
            <Switch
              id="fingerprint-masking"
              checked={settings.fingerprintMasking}
              onCheckedChange={() => handleToggle('fingerprintMasking')}
            />
          </div>

          <Separator />

          {/* DNS Protection */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Wifi className="h-5 w-5" />
              </div>
              <div>
                <Label htmlFor="dns-protection" className="text-base">DNS Protection</Label>
                <p className="text-sm text-muted-foreground">
                  Encrypt DNS queries and prevent leaks
                </p>
              </div>
            </div>
            <Switch
              id="dns-protection"
              checked={settings.dnsProtection}
              onCheckedChange={() => handleToggle('dnsProtection')}
            />
          </div>

          <Separator />

          {/* Cookie Blocking */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Cookie className="h-5 w-5" />
              </div>
              <div>
                <Label htmlFor="cookie-blocking" className="text-base">Cookie Blocking</Label>
                <p className="text-sm text-muted-foreground">
                  Block third-party tracking cookies
                </p>
              </div>
            </div>
            <Switch
              id="cookie-blocking"
              checked={settings.cookieBlocking}
              onCheckedChange={() => handleToggle('cookieBlocking')}
            />
          </div>

          <Separator />

          {/* WebRTC Protection */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Wifi className="h-5 w-5" />
              </div>
              <div>
                <Label htmlFor="webrtc-protection" className="text-base">WebRTC Protection</Label>
                <p className="text-sm text-muted-foreground">
                  Prevent IP leaks through WebRTC
                </p>
              </div>
            </div>
            <Switch
              id="webrtc-protection"
              checked={settings.webrtcProtection}
              onCheckedChange={() => handleToggle('webrtcProtection')}
            />
          </div>

          <Separator />

          {/* Canvas Protection */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <Label htmlFor="canvas-protection" className="text-base">Canvas Protection</Label>
                <p className="text-sm text-muted-foreground">
                  Block canvas fingerprinting attempts
                </p>
              </div>
            </div>
            <Switch
              id="canvas-protection"
              checked={settings.canvasProtection}
              onCheckedChange={() => handleToggle('canvasProtection')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Ghost Wallet Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Ghost Wallet Settings
          </CardTitle>
          <CardDescription>
            Configure automatic wallet rotation for enhanced privacy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto Rotation */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-rotation" className="text-base">Auto Rotation</Label>
              <p className="text-sm text-muted-foreground">
                Automatically rotate to a new ghost wallet periodically
              </p>
            </div>
            <Switch
              id="auto-rotation"
              checked={settings.autoRotation}
              onCheckedChange={() => handleToggle('autoRotation')}
            />
          </div>

          {settings.autoRotation && (
            <div className="space-y-4 rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Rotation Interval
                </Label>
                <span className="font-mono text-sm">{settings.rotationInterval}h</span>
              </div>
              <Slider
                value={[settings.rotationInterval]}
                onValueChange={([v]) => setSettings(prev => ({ ...prev, rotationInterval: v }))}
                min={1}
                max={72}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 hour</span>
                <span>24 hours</span>
                <span>72 hours</span>
              </div>
            </div>
          )}

          <Separator />

          {/* Balance Warnings */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="low-balance" className="text-base">Low Balance Warnings</Label>
              <p className="text-sm text-muted-foreground">
                Show notifications when wallet balance is low
              </p>
            </div>
            <Switch
              id="low-balance"
              checked={settings.lowBalanceWarnings}
              onCheckedChange={() => handleToggle('lowBalanceWarnings')}
            />
          </div>

          <Separator />

          {/* Pause on Empty */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="pause-empty" className="text-base">Pause on Empty</Label>
              <p className="text-sm text-muted-foreground">
                Automatically pause protection when wallet is empty
              </p>
            </div>
            <Switch
              id="pause-empty"
              checked={settings.pauseOnEmpty}
              onCheckedChange={() => handleToggle('pauseOnEmpty')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <div className="flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
        <div>
          <div className="font-medium text-warning">Privacy Notice</div>
          <p className="mt-1 text-sm text-muted-foreground">
            PHANTOM LAYER does not store any browsing data, logs, or personal information. 
            All protection happens client-side. The only data sent to Solana is your 
            micropayment transactions, which are pseudonymous when using ghost wallets.
          </p>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Shield className="h-4 w-4" />
          Save Configuration
        </Button>
      </div>
    </div>
  )
}
