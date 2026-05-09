import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserX, Eye, Zap, ArrowRight } from 'lucide-react'

const points = [
  {
    icon: UserX,
    title: 'No account needed',
    description: 'Just connect a wallet. No email, no password, no personal information. Your wallet is your identity.',
  },
  {
    icon: Eye,
    title: 'Untraceable payments',
    description: 'Ghost wallets are disposable Solana addresses with no connection to your main wallet or identity.',
  },
  {
    icon: Zap,
    title: 'Powered by Solana',
    description: 'Sub-second transactions with near-zero fees via x402 protocol. Payments settle instantly.',
  },
]

export function PrivacyPayments() {
  return (
    <section className="border-t border-border/40 bg-secondary/20 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy-first payments
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We built a payment system that respects your privacy as much as 
            our protection does.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-8 lg:grid-cols-3">
          {points.map((point) => (
            <div
              key={point.title}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <point.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{point.title}</h3>
              <p className="text-muted-foreground">{point.description}</p>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="mx-auto mt-20 max-w-2xl rounded-xl border border-primary/40 bg-card p-8 text-center sm:p-12">
          <h3 className="text-2xl font-bold sm:text-3xl">
            Ready to disappear from trackers?
          </h3>
          <p className="mt-4 text-muted-foreground">
            Start protecting your privacy in under 60 seconds. 
            Connect your wallet and enable protection - that&apos;s it.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Get started now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Average activation time: 47 seconds
          </p>
        </div>
      </div>
    </section>
  )
}
