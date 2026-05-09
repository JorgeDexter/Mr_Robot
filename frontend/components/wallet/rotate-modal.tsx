'use client'

import { useState } from 'react'
import { useWalletStore } from '@/store/wallet-store'
import { formatAddress } from '@/lib/mock-data'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { RefreshCw, ArrowRight, Shield, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export function RotateModal() {
  const { 
    isRotateModalOpen, 
    closeRotateModal, 
    selectedWalletId,
    wallets,
    rotateWallet,
    deleteWallet,
  } = useWalletStore()

  const [keepBalance, setKeepBalance] = useState(true)
  const [isRotating, setIsRotating] = useState(false)

  const wallet = wallets.find(w => w.id === selectedWalletId)

  const handleRotate = async () => {
    if (!wallet) return
    
    setIsRotating(true)
    
    // Simulate rotation delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newWallet = rotateWallet(wallet.id)
    
    toast.success('Wallet rotated', {
      description: `New address: ${formatAddress(newWallet.address)}`,
    })
    
    setIsRotating(false)
    closeRotateModal()
  }

  const handleDelete = () => {
    if (!wallet) return
    
    if (wallet.balance > 0) {
      toast.error('Cannot delete wallet', {
        description: 'Wallet still has funds. Transfer them first.',
      })
      return
    }
    
    deleteWallet(wallet.id)
    toast.success('Wallet deleted')
    closeRotateModal()
  }

  if (!wallet) return null

  return (
    <Dialog open={isRotateModalOpen} onOpenChange={closeRotateModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Rotate Wallet
          </DialogTitle>
          <DialogDescription>
            Generate a new address while keeping your funds
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current wallet */}
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <div className="mb-1 text-xs text-muted-foreground">Current address</div>
            <code className="text-sm">{formatAddress(wallet.address, 10)}</code>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Balance:</span>
              <span className="font-mono font-semibold">${wallet.balance.toFixed(2)}</span>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>

          {/* New wallet preview */}
          <div className="rounded-lg border border-primary/40 bg-primary/5 p-4">
            <div className="mb-1 text-xs text-muted-foreground">New address</div>
            <code className="text-sm text-muted-foreground">Will be generated...</code>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Balance:</span>
              <span className="font-mono font-semibold">
                ${keepBalance ? wallet.balance.toFixed(2) : '0.00'}
              </span>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="keep-balance">Transfer funds</Label>
                <p className="text-xs text-muted-foreground">
                  Move balance to new wallet
                </p>
              </div>
              <Switch
                id="keep-balance"
                checked={keepBalance}
                onCheckedChange={setKeepBalance}
              />
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-xs text-muted-foreground">
              Rotating wallets breaks transaction history linking. 
              Your old address will no longer be used for payments.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-row justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={handleDelete}
            disabled={wallet.balance > 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete wallet
          </Button>
          <Button 
            onClick={handleRotate} 
            disabled={isRotating}
            className="gap-2"
          >
            {isRotating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Rotating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Rotate wallet
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
