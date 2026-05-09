'use client'

import { useWalletStore } from '@/store/wallet-store'
import { formatAddress, pricingConfig } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Wallet, 
  Ghost, 
  ChevronDown, 
  Plus, 
  RefreshCw, 
  LogOut,
  Check,
  CircleDollarSign
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function WalletButton() {
  const { 
    isConnected, 
    wallets, 
    activeWalletId,
    setActiveWallet,
    openConnectModal,
    openCreateGhostModal,
    openTopUpModal,
    openRotateModal,
    disconnect,
  } = useWalletStore()

  const activeWallet = wallets.find(w => w.id === activeWalletId)
  const ghostWallets = wallets.filter(w => w.type === 'ghost')
  const phantomWallet = wallets.find(w => w.type === 'phantom')

  if (!isConnected) {
    return (
      <Button onClick={openConnectModal} className="gap-2">
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  const getStatusColor = (balance: number) => {
    if (balance <= 0) return 'bg-destructive'
    if (balance < pricingConfig.criticalBalanceThreshold) return 'bg-destructive'
    if (balance < pricingConfig.lowBalanceThreshold) return 'bg-warning'
    return 'bg-success'
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {activeWallet?.type === 'ghost' ? (
            <Ghost className="h-4 w-4 text-primary" />
          ) : (
            <Wallet className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {activeWallet ? formatAddress(activeWallet.address) : 'No wallet'}
          </span>
          <div className="flex items-center gap-2">
            <span className={cn(
              "h-2 w-2 rounded-full",
              activeWallet ? getStatusColor(activeWallet.balance) : 'bg-muted'
            )} />
            <span className="font-mono text-sm">
              ${activeWallet?.balance.toFixed(2) ?? '0.00'}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        {/* Phantom Wallet */}
        {phantomWallet && (
          <>
            <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
              <Wallet className="h-3 w-3" />
              Phantom Wallet
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setActiveWallet(phantomWallet.id)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className={cn(
                  "h-2 w-2 rounded-full",
                  getStatusColor(phantomWallet.balance)
                )} />
                <span>{formatAddress(phantomWallet.address)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">${phantomWallet.balance.toFixed(2)}</span>
                {activeWalletId === phantomWallet.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            </DropdownMenuItem>
          </>
        )}

        {/* Ghost Wallets */}
        {ghostWallets.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
              <Ghost className="h-3 w-3" />
              Ghost Wallets
            </DropdownMenuLabel>
            {ghostWallets.map((wallet) => (
              <DropdownMenuItem
                key={wallet.id}
                onClick={() => setActiveWallet(wallet.id)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "h-2 w-2 rounded-full",
                    getStatusColor(wallet.balance)
                  )} />
                  <span>{formatAddress(wallet.address)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">${wallet.balance.toFixed(2)}</span>
                  {activeWalletId === wallet.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </>
        )}

        <DropdownMenuSeparator />

        {/* Actions */}
        {activeWallet && (
          <>
            <DropdownMenuItem onClick={() => openTopUpModal(activeWallet.id)}>
              <CircleDollarSign className="mr-2 h-4 w-4" />
              Top up wallet
            </DropdownMenuItem>
            {activeWallet.type === 'ghost' && (
              <DropdownMenuItem onClick={() => openRotateModal(activeWallet.id)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Rotate wallet
              </DropdownMenuItem>
            )}
          </>
        )}

        <DropdownMenuItem onClick={openCreateGhostModal}>
          <Plus className="mr-2 h-4 w-4" />
          New ghost wallet
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={disconnect} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
