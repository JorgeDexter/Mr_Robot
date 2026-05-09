'use client'

import { usePathname } from 'next/navigation'
import { WalletButton } from '@/components/wallet/wallet-button'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Live Feed',
  '/dashboard/feed': 'Live Feed',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/payments': 'Payments',
  '/dashboard/devices': 'Devices',
  '/dashboard/privacy': 'Privacy Config',
}

export function Topbar() {
  const pathname = usePathname()
  const title = pageTitles[pathname] || 'Dashboard'

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        {/* Spacer for mobile menu button */}
        <div className="h-10 w-10 md:hidden" />
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      
      <WalletButton />
    </header>
  )
}
