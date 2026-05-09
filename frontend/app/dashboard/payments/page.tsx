'use client'

import { useWalletStore } from '@/store/wallet-store'
import { formatAddress, pricingConfig, type Transaction } from '@/lib/mock-data'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { 
  Wallet, 
  Ghost, 
  Plus, 
  RefreshCw, 
  CircleDollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  Shield,
  Clock,
  Calculator,
  ExternalLink
} from 'lucide-react'

const transactionTypeLabels: Record<Transaction['type'], string> = {
  threat_blocked: 'Threat Blocked',
  dns_query: 'DNS Query',
  fingerprint_mask: 'Fingerprint Mask',
  tracker_block: 'Tracker Block',
  top_up: 'Top Up',
  rotation: 'Wallet Rotation',
}

export default function PaymentsPage() {
  const { 
    wallets, 
    transactions,
    activeWalletId,
    sessionSpent,
    setActiveWallet,
    openCreateGhostModal,
    openTopUpModal,
    openRotateModal,
  } = useWalletStore()

  // Cost estimator state
  const [hoursPerDay, setHoursPerDay] = useState(4)
  const [threatsPerHour, setThreatsPerHour] = useState(50)

  const estimatedDailyCost = 
    (hoursPerDay * 60 * pricingConfig.perMinuteProtection) +
    (hoursPerDay * threatsPerHour * pricingConfig.perThreatBlocked) +
    (hoursPerDay * threatsPerHour * 0.3 * pricingConfig.perDnsQuery)

  const estimatedMonthlyCost = estimatedDailyCost * 30

  const ghostWallets = wallets.filter(w => w.type === 'ghost')
  const phantomWallet = wallets.find(w => w.type === 'phantom')
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0)

  return (
    <div className="space-y-6">
      {/* Session KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">${totalBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across {wallets.length} wallet{wallets.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Session Spent
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">${sessionSpent.toFixed(4)}</div>
            <p className="text-xs text-muted-foreground">
              This browsing session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Cost/Threat
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">${pricingConfig.perThreatBlocked.toFixed(3)}</div>
            <p className="text-xs text-muted-foreground">
              USDC per threat blocked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transactions
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Wallets section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Wallets</CardTitle>
            <CardDescription>Manage your connected and ghost wallets</CardDescription>
          </div>
          <Button onClick={openCreateGhostModal} className="gap-2">
            <Plus className="h-4 w-4" />
            New Ghost Wallet
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Wallet</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Phantom wallet */}
              {phantomWallet && (
                <TableRow className={cn(
                  activeWalletId === phantomWallet.id && "bg-secondary/50"
                )}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                        <Wallet className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{phantomWallet.label}</div>
                        <div className="text-xs text-muted-foreground">Phantom</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm">{formatAddress(phantomWallet.address)}</code>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-semibold">
                      ${phantomWallet.balance.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={phantomWallet.status === 'active' ? 'default' : 'secondary'}>
                      {phantomWallet.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openTopUpModal(phantomWallet.id)}
                      >
                        <CircleDollarSign className="h-4 w-4" />
                      </Button>
                      {activeWalletId !== phantomWallet.id && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setActiveWallet(phantomWallet.id)}
                        >
                          Set active
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Ghost wallets */}
              {ghostWallets.map((wallet) => (
                <TableRow 
                  key={wallet.id}
                  className={cn(
                    activeWalletId === wallet.id && "bg-secondary/50"
                  )}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <Ghost className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">{wallet.label}</div>
                        <div className="text-xs text-muted-foreground">Ghost</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm">{formatAddress(wallet.address)}</code>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "font-mono font-semibold",
                      wallet.balance < pricingConfig.lowBalanceThreshold && wallet.balance > 0 && "text-warning",
                      wallet.balance === 0 && "text-destructive"
                    )}>
                      ${wallet.balance.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        wallet.status === 'active' ? 'default' : 
                        wallet.status === 'low' ? 'outline' : 
                        'secondary'
                      }
                      className={cn(
                        wallet.status === 'low' && "border-warning text-warning",
                        wallet.status === 'empty' && "border-destructive text-destructive"
                      )}
                    >
                      {wallet.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openTopUpModal(wallet.id)}
                      >
                        <CircleDollarSign className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openRotateModal(wallet.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      {activeWalletId !== wallet.id && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setActiveWallet(wallet.id)}
                        >
                          Set active
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transaction history */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Recent micropayments and top-ups</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">TX Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.slice(0, 20).map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {tx.amount > 0 ? (
                        <ArrowDownLeft className="h-4 w-4 text-success" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm">{transactionTypeLabels[tx.type]}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {tx.description}
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "font-mono",
                      tx.amount > 0 ? "text-success" : "text-muted-foreground"
                    )}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(4)}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="gap-1 font-mono text-xs">
                      {tx.txHash.slice(0, 8)}...
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Cost estimator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Cost Estimator
          </CardTitle>
          <CardDescription>
            Estimate your protection costs based on usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <Label>Hours of browsing per day</Label>
                  <span className="font-mono text-sm">{hoursPerDay}h</span>
                </div>
                <Slider
                  value={[hoursPerDay]}
                  onValueChange={([v]) => setHoursPerDay(v)}
                  min={1}
                  max={16}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label>Threats blocked per hour</Label>
                  <span className="font-mono text-sm">{threatsPerHour}</span>
                </div>
                <Slider
                  value={[threatsPerHour]}
                  onValueChange={([v]) => setThreatsPerHour(v)}
                  min={10}
                  max={200}
                  step={10}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-secondary/50 p-4">
                <div className="text-sm text-muted-foreground">Estimated daily cost</div>
                <div className="text-3xl font-bold font-mono text-primary">
                  ${estimatedDailyCost.toFixed(2)}
                </div>
              </div>

              <div className="rounded-lg bg-secondary/50 p-4">
                <div className="text-sm text-muted-foreground">Estimated monthly cost</div>
                <div className="text-3xl font-bold font-mono">
                  ${estimatedMonthlyCost.toFixed(2)}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  vs. $10-15/mo for traditional VPNs
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
