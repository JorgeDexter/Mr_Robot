'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWalletStore } from '@/store/wallet-store'
import { generateMockAddress, formatAddress } from '@/lib/mock-data'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Ghost, Key, Eye, EyeOff, Copy, Check, QrCode, ArrowRight } from 'lucide-react'
import QRCode from 'qrcode'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type Step = 1 | 2 | 3

export function CreateGhostModal() {
  const { 
    isCreateGhostModalOpen, 
    closeCreateGhostModal, 
    createGhostWallet,
    setActiveWallet,
    connect,
  } = useWalletStore()

  const [step, setStep] = useState<Step>(1)
  const [label, setLabel] = useState('')
  const [address, setAddress] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [qrCode, setQrCode] = useState('')

  const generateWallet = useCallback(() => {
    const newAddress = generateMockAddress()
    const newPrivateKey = Array.from({ length: 64 }, () => 
      '0123456789abcdef'.charAt(Math.floor(Math.random() * 16))
    ).join('')
    setAddress(newAddress)
    setPrivateKey(newPrivateKey)
  }, [])

  useEffect(() => {
    if (isCreateGhostModalOpen && step === 1) {
      generateWallet()
    }
  }, [isCreateGhostModalOpen, step, generateWallet])

  useEffect(() => {
    if (address && step === 3) {
      QRCode.toDataURL(address, {
        width: 200,
        margin: 2,
        color: { dark: '#ffffff', light: '#00000000' },
      }).then(setQrCode)
    }
  }, [address, step])

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied to clipboard')
  }

  const handleClose = () => {
    closeCreateGhostModal()
    setStep(1)
    setLabel('')
    setAddress('')
    setPrivateKey('')
    setShowPrivateKey(false)
    setCopied(false)
    setQrCode('')
  }

  const handleComplete = () => {
    const wallet = createGhostWallet(label || undefined)
    connect('ghost')
    setActiveWallet(wallet.id)
    toast.success('Ghost wallet created', {
      description: 'Your new ghost wallet is ready to use.',
    })
    handleClose()
  }

  const progress = (step / 3) * 100

  return (
    <Dialog open={isCreateGhostModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ghost className="h-5 w-5 text-primary" />
            Create Ghost Wallet
          </DialogTitle>
          <DialogDescription>
            {step === 1 && 'Generate a new disposable wallet address'}
            {step === 2 && 'Save your private key - you will need it to recover funds'}
            {step === 3 && 'Fund your wallet to start protecting your privacy'}
          </DialogDescription>
        </DialogHeader>

        <Progress value={progress} className="h-1" />

        <div className="py-4">
          {/* Step 1: Generate */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="label">Wallet Label (optional)</Label>
                <Input
                  id="label"
                  placeholder="e.g., Daily browsing"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>

              <div className="rounded-lg border border-border bg-secondary/30 p-4">
                <div className="mb-2 text-xs text-muted-foreground">Generated Address</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 break-all text-sm">{address}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => handleCopy(address)}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full" 
                onClick={generateWallet}
              >
                Generate new address
              </Button>
            </div>
          )}

          {/* Step 2: Backup */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-lg border border-warning/40 bg-warning/10 p-4">
                <div className="mb-2 flex items-center gap-2 font-medium text-warning">
                  <Key className="h-4 w-4" />
                  Save your private key
                </div>
                <p className="text-sm text-muted-foreground">
                  This is the only way to recover funds from this wallet. 
                  Store it securely and never share it.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-secondary/30 p-4">
                <div className="mb-2 text-xs text-muted-foreground">Private Key</div>
                <div className="flex items-center gap-2">
                  <code className={cn(
                    "flex-1 break-all text-sm transition-all",
                    !showPrivateKey && "blur-sm select-none"
                  )}>
                    {privateKey}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                  >
                    {showPrivateKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => handleCopy(privateKey)}
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
          )}

          {/* Step 3: Fund */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-secondary/30 p-6">
                <QrCode className="mb-2 h-5 w-5 text-muted-foreground" />
                <div className="text-xs text-muted-foreground">Send USDC to</div>
                {qrCode ? (
                  <img 
                    src={qrCode} 
                    alt="Wallet QR Code" 
                    className="my-4 h-40 w-40"
                  />
                ) : (
                  <div className="my-4 h-40 w-40 animate-pulse rounded bg-muted" />
                )}
                <code className="text-center text-sm">{formatAddress(address, 8)}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 gap-2"
                  onClick={() => handleCopy(address)}
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy address
                    </>
                  )}
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                You can fund your wallet later. Minimum recommended: $0.10 USDC
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row gap-2 sm:justify-between">
          {step > 1 && (
            <Button 
              variant="outline" 
              onClick={() => setStep((step - 1) as Step)}
            >
              Back
            </Button>
          )}
          <div className="flex-1" />
          {step < 3 ? (
            <Button onClick={() => setStep((step + 1) as Step)} className="gap-2">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="gap-2">
              <Ghost className="h-4 w-4" />
              Activate wallet
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
