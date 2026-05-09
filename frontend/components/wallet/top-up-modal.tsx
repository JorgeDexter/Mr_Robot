'use client'

import { useState, useEffect } from 'react'
import { useWalletStore } from '@/store/wallet-store'
import { formatAddress, pricingConfig } from '@/lib/mock-data'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { QrCode, Copy, Check, Wallet, Zap } from 'lucide-react'
import QRCode from 'qrcode'
import { toast } from 'sonner'

const presetAmounts = [0.50, 1.00, 2.00, 5.00]

export function TopUpModal() {
  const { 
    isTopUpModalOpen, 
    closeTopUpModal, 
    selectedWalletId,
    wallets,
    topUpWallet,
  } = useWalletStore()

  const [amount, setAmount] = useState(1.00)
  const [qrCode, setQrCode] = useState('')
  const [copied, setCopied] = useState(false)

  const wallet = wallets.find(w => w.id === selectedWalletId)

  useEffect(() => {
    if (wallet) {
      QRCode.toDataURL(wallet.address, {
        width: 160,
        margin: 2,
        color: { dark: '#ffffff', light: '#00000000' },
      }).then(setQrCode)
    }
  }, [wallet])

  const handleCopy = async () => {
    if (!wallet) return
    await navigator.clipboard.writeText(wallet.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Address copied')
  }

  const handleQuickFund = () => {
    if (!wallet) return
    topUpWallet(wallet.id, amount)
    toast.success('Wallet funded', {
      description: `Added $${amount.toFixed(2)} USDC to your wallet.`,
    })
    closeTopUpModal()
  }

  const estimatedDays = amount / pricingConfig.perMinuteProtection / 60 / 24

  if (!wallet) return null

  return (
    <Dialog open={isTopUpModalOpen} onOpenChange={closeTopUpModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Top up wallet</DialogTitle>
          <DialogDescription>
            Add funds to {wallet.label || formatAddress(wallet.address)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Amount slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Amount</Label>
              <span className="font-mono text-2xl font-bold">${amount.toFixed(2)}</span>
            </div>
            <Slider
              value={[amount]}
              onValueChange={([v]) => setAmount(v)}
              min={pricingConfig.minTopUp}
              max={pricingConfig.maxTopUp}
              step={0.10}
              className="py-4"
            />
            <div className="flex gap-2">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset}
                  variant={amount === preset ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setAmount(preset)}
                >
                  ${preset.toFixed(2)}
                </Button>
              ))}
            </div>
          </div>

          {/* Estimate */}
          <div className="rounded-lg bg-secondary/50 p-4">
            <div className="text-sm text-muted-foreground">
              Estimated protection time
            </div>
            <div className="mt-1 text-lg font-semibold">
              ~{estimatedDays.toFixed(1)} days of active browsing
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Based on average usage of 200 threats/day
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center rounded-lg border border-border bg-secondary/30 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <QrCode className="h-4 w-4" />
              Send USDC to this address
            </div>
            {qrCode ? (
              <img src={qrCode} alt="Wallet QR" className="h-32 w-32" />
            ) : (
              <div className="h-32 w-32 animate-pulse rounded bg-muted" />
            )}
            <div className="mt-2 flex items-center gap-2">
              <code className="text-sm">{formatAddress(wallet.address, 8)}</code>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {wallet.type === 'ghost' && (
            <Button 
              variant="outline" 
              className="w-full gap-2 sm:w-auto"
              onClick={handleQuickFund}
            >
              <Zap className="h-4 w-4" />
              Quick fund (demo)
            </Button>
          )}
          {wallet.type === 'phantom' && (
            <Button 
              className="w-full gap-2 sm:w-auto"
              onClick={handleQuickFund}
            >
              <Wallet className="h-4 w-4" />
              Fund from Phantom
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
