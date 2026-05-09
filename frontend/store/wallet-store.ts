import { create } from 'zustand'
import { 
  mockWallets, 
  mockTransactions, 
  generateMockAddress, 
  generateTxHash,
  pricingConfig,
  type Wallet, 
  type Transaction,
  type WalletStatus 
} from '@/lib/mock-data'

interface WalletState {
  // Connection state
  isConnected: boolean
  connectionType: 'phantom' | 'ghost' | null
  
  // Wallets
  wallets: Wallet[]
  activeWalletId: string | null
  
  // Transactions
  transactions: Transaction[]
  
  // Protection state
  isProtectionActive: boolean
  sessionSpent: number
  sessionStartTime: Date | null
  
  // UI state
  isConnectModalOpen: boolean
  isCreateGhostModalOpen: boolean
  isTopUpModalOpen: boolean
  isRotateModalOpen: boolean
  selectedWalletId: string | null
  
  // Actions
  connect: (type: 'phantom' | 'ghost') => void
  disconnect: () => void
  setActiveWallet: (walletId: string) => void
  createGhostWallet: (label?: string) => Wallet
  topUpWallet: (walletId: string, amount: number) => void
  rotateWallet: (walletId: string) => Wallet
  deleteWallet: (walletId: string) => void
  deductBalance: (amount: number) => void
  toggleProtection: () => void
  addTransaction: (tx: Omit<Transaction, 'id' | 'timestamp' | 'txHash'>) => void
  
  // Modal controls
  openConnectModal: () => void
  closeConnectModal: () => void
  openCreateGhostModal: () => void
  closeCreateGhostModal: () => void
  openTopUpModal: (walletId: string) => void
  closeTopUpModal: () => void
  openRotateModal: (walletId: string) => void
  closeRotateModal: () => void
}

function getWalletStatus(balance: number): WalletStatus {
  if (balance <= 0) return 'empty'
  if (balance < pricingConfig.criticalBalanceThreshold) return 'empty'
  if (balance < pricingConfig.lowBalanceThreshold) return 'low'
  return 'active'
}

export const useWalletStore = create<WalletState>((set, get) => ({
  // Initial state - connected with mock data
  isConnected: true,
  connectionType: 'ghost',
  wallets: mockWallets,
  activeWalletId: 'ghost-1',
  transactions: mockTransactions,
  isProtectionActive: true,
  sessionSpent: 0.0847,
  sessionStartTime: new Date(Date.now() - 3600000), // 1 hour ago
  
  // UI state
  isConnectModalOpen: false,
  isCreateGhostModalOpen: false,
  isTopUpModalOpen: false,
  isRotateModalOpen: false,
  selectedWalletId: null,
  
  // Actions
  connect: (type) => set({
    isConnected: true,
    connectionType: type,
    activeWalletId: type === 'phantom' ? 'phantom-1' : 'ghost-1',
    sessionStartTime: new Date(),
    sessionSpent: 0,
  }),
  
  disconnect: () => set({
    isConnected: false,
    connectionType: null,
    activeWalletId: null,
    isProtectionActive: false,
    sessionSpent: 0,
    sessionStartTime: null,
  }),
  
  setActiveWallet: (walletId) => set((state) => ({
    activeWalletId: walletId,
    wallets: state.wallets.map(w => ({
      ...w,
      isActive: w.id === walletId,
    })),
  })),
  
  createGhostWallet: (label) => {
    const ghostCount = get().wallets.filter(w => w.type === 'ghost').length
    const newWallet: Wallet = {
      id: `ghost-${Date.now()}`,
      type: 'ghost',
      address: generateMockAddress(),
      label: label || `Ghost Wallet #${ghostCount + 1}`,
      balance: 0,
      status: 'empty',
      createdAt: new Date(),
      isActive: false,
    }
    
    set((state) => ({
      wallets: [...state.wallets, newWallet],
    }))
    
    return newWallet
  },
  
  topUpWallet: (walletId, amount) => {
    set((state) => ({
      wallets: state.wallets.map(w => 
        w.id === walletId
          ? { ...w, balance: w.balance + amount, status: getWalletStatus(w.balance + amount), lastUsed: new Date() }
          : w
      ),
    }))
    
    get().addTransaction({
      walletId,
      type: 'top_up',
      amount,
      description: `Wallet funded with $${amount.toFixed(2)} USDC`,
    })
  },
  
  rotateWallet: (walletId) => {
    const oldWallet = get().wallets.find(w => w.id === walletId)
    if (!oldWallet) throw new Error('Wallet not found')
    
    const newWallet: Wallet = {
      id: `ghost-${Date.now()}`,
      type: 'ghost',
      address: generateMockAddress(),
      label: oldWallet.label,
      balance: oldWallet.balance,
      status: oldWallet.status,
      createdAt: new Date(),
      lastUsed: new Date(),
      isActive: oldWallet.isActive,
    }
    
    set((state) => ({
      wallets: state.wallets.map(w => 
        w.id === walletId ? newWallet : w
      ),
      activeWalletId: state.activeWalletId === walletId ? newWallet.id : state.activeWalletId,
    }))
    
    get().addTransaction({
      walletId: newWallet.id,
      type: 'rotation',
      amount: 0,
      description: `Wallet rotated from ${oldWallet.address.slice(0, 8)}...`,
    })
    
    return newWallet
  },
  
  deleteWallet: (walletId) => {
    const wallet = get().wallets.find(w => w.id === walletId)
    if (!wallet || wallet.type === 'phantom') return
    
    set((state) => ({
      wallets: state.wallets.filter(w => w.id !== walletId),
      activeWalletId: state.activeWalletId === walletId 
        ? state.wallets.find(w => w.id !== walletId && w.type === 'ghost')?.id || 'phantom-1'
        : state.activeWalletId,
    }))
  },
  
  deductBalance: (amount) => {
    const { activeWalletId, wallets, isProtectionActive } = get()
    if (!activeWalletId || !isProtectionActive) return
    
    const activeWallet = wallets.find(w => w.id === activeWalletId)
    if (!activeWallet || activeWallet.balance <= 0) {
      set({ isProtectionActive: false })
      return
    }
    
    const newBalance = Math.max(0, activeWallet.balance - amount)
    
    set((state) => ({
      wallets: state.wallets.map(w => 
        w.id === activeWalletId
          ? { ...w, balance: newBalance, status: getWalletStatus(newBalance), lastUsed: new Date() }
          : w
      ),
      sessionSpent: state.sessionSpent + amount,
      isProtectionActive: newBalance > 0,
    }))
  },
  
  toggleProtection: () => {
    const { isProtectionActive, activeWalletId, wallets } = get()
    
    if (!isProtectionActive) {
      const activeWallet = wallets.find(w => w.id === activeWalletId)
      if (!activeWallet || activeWallet.balance <= 0) return
    }
    
    set((state) => ({
      isProtectionActive: !state.isProtectionActive,
      sessionStartTime: !state.isProtectionActive ? new Date() : state.sessionStartTime,
    }))
  },
  
  addTransaction: (tx) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      timestamp: new Date(),
      txHash: generateTxHash(),
    }
    
    set((state) => ({
      transactions: [newTx, ...state.transactions],
    }))
  },
  
  // Modal controls
  openConnectModal: () => set({ isConnectModalOpen: true }),
  closeConnectModal: () => set({ isConnectModalOpen: false }),
  openCreateGhostModal: () => set({ isCreateGhostModalOpen: true }),
  closeCreateGhostModal: () => set({ isCreateGhostModalOpen: false }),
  openTopUpModal: (walletId) => set({ isTopUpModalOpen: true, selectedWalletId: walletId }),
  closeTopUpModal: () => set({ isTopUpModalOpen: false, selectedWalletId: null }),
  openRotateModal: (walletId) => set({ isRotateModalOpen: true, selectedWalletId: walletId }),
  closeRotateModal: () => set({ isRotateModalOpen: false, selectedWalletId: null }),
}))
