'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { ConnectModal } from '@/components/wallet/connect-modal'
import { CreateGhostModal } from '@/components/wallet/create-ghost-modal'
import { TopUpModal } from '@/components/wallet/top-up-modal'
import { RotateModal } from '@/components/wallet/rotate-modal'
import { useWalletSimulation } from '@/hooks/use-wallet-simulation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize wallet simulation
  useWalletSimulation()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* Global modals */}
      <ConnectModal />
      <CreateGhostModal />
      <TopUpModal />
      <RotateModal />
    </div>
  )
}
