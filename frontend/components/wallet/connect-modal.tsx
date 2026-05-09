'use client'

import { useWalletStore } from '@/store/wallet-store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wallet, Ghost, Zap } from 'lucide-react'

export function ConnectModal() {
  const { 
    isConnectModalOpen, 
    closeConnectModal, 
    connect,
    openCreateGhostModal,
  } = useWalletStore()

  const handlePhantomConnect = () => {
    connect('phantom')
    closeConnectModal()
  }

  const handleGhostConnect = () => {
    closeConnectModal()
    openCreateGhostModal()
  }

  return (
    <Dialog open={isConnectModalOpen} onOpenChange={closeConnectModal}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Choose how you want to pay for privacy protection
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Phantom Wallet */}
          <Card 
            className="cursor-pointer transition-colors hover:border-primary/60 hover:bg-card/80"
            onClick={handlePhantomConnect}
          >
            <CardContent className="flex items-start gap-4 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <Wallet className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Phantom Wallet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Connect your existing Phantom wallet for payments. 
                  Transactions are linked to your wallet address.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Ghost Wallet */}
          <Card 
            className="cursor-pointer border-primary/40 transition-colors hover:border-primary/60 hover:bg-card/80"
            onClick={handleGhostConnect}
          >
            <CardContent className="flex items-start gap-4 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <Ghost className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Ghost Wallet</h3>
                  <Badge variant="secondary" className="text-xs">Recommended</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Generate a disposable wallet with no connection to your identity. 
                  Maximum privacy, zero traceability.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground">
          <Zap className="h-4 w-4 text-primary" />
          <span>
            Powered by Solana x402 protocol. Sub-second transactions with near-zero fees.
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
