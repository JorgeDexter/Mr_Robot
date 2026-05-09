'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useWalletStore } from '@/store/wallet-store'
import { pricingConfig } from '@/lib/mock-data'
import { toast } from 'sonner'

export function useWalletSimulation() {
  const { 
    isProtectionActive, 
    activeWalletId, 
    wallets,
    deductBalance,
    openTopUpModal,
  } = useWalletStore()
  
  const lastWarningRef = useRef<number>(0)
  const activeWallet = wallets.find(w => w.id === activeWalletId)
  
  const showLowBalanceWarning = useCallback(() => {
    const now = Date.now()
    // Only show warning every 30 seconds
    if (now - lastWarningRef.current < 30000) return
    lastWarningRef.current = now
    
    toast.warning('Low balance', {
      description: `Your wallet balance is running low ($${activeWallet?.balance.toFixed(4)}). Top up to continue protection.`,
      action: activeWalletId ? {
        label: 'Top up',
        onClick: () => openTopUpModal(activeWalletId),
      } : undefined,
      duration: 5000,
    })
  }, [activeWallet?.balance, activeWalletId, openTopUpModal])
  
  const showEmptyBalanceWarning = useCallback(() => {
    toast.error('Protection paused', {
      description: 'Your wallet is empty. Top up to resume privacy protection.',
      action: activeWalletId ? {
        label: 'Top up now',
        onClick: () => openTopUpModal(activeWalletId),
      } : undefined,
      duration: 10000,
    })
  }, [activeWalletId, openTopUpModal])
  
  useEffect(() => {
    if (!isProtectionActive || !activeWallet) return
    
    // Simulate micropayments every 5 seconds
    const interval = setInterval(() => {
      // Random cost based on simulated activity
      const baseCost = pricingConfig.perMinuteProtection / 12 // Per 5 seconds
      const threatCost = Math.random() > 0.7 ? pricingConfig.perThreatBlocked : 0
      const dnsCost = Math.random() > 0.5 ? pricingConfig.perDnsQuery : 0
      
      const totalCost = baseCost + threatCost + dnsCost
      deductBalance(totalCost)
      
      // Check balance and show warnings
      const newBalance = activeWallet.balance - totalCost
      if (newBalance <= 0) {
        showEmptyBalanceWarning()
      } else if (newBalance < pricingConfig.lowBalanceThreshold) {
        showLowBalanceWarning()
      }
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isProtectionActive, activeWallet, deductBalance, showLowBalanceWarning, showEmptyBalanceWarning])
  
  return {
    isSimulating: isProtectionActive && !!activeWallet,
    currentBalance: activeWallet?.balance ?? 0,
    spendingRate: pricingConfig.perMinuteProtection,
  }
}
