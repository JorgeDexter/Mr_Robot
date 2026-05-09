import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, Zap, Lock } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            Powered by Solana x402 Protocol
          </div>

          {/* Headline */}
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Privacy protection that{' '}
            <span className="text-primary">costs pennies</span>, not your data
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            Zero-knowledge privacy protection powered by Solana micropayments. 
            No subscriptions. No accounts. No tracking. Pay only for what you use 
            with ghost wallets.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Start protecting now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg">
                See how it works
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>5.7M+ threats blocked</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-primary" />
              <span>$0.002 avg cost per threat</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4 text-primary" />
              <span>Zero data retention</span>
            </div>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="mx-auto mt-20 max-w-5xl">
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xl shadow-primary/5">
            <div className="flex items-center gap-2 border-b border-border/60 bg-secondary/30 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-warning/60" />
              <div className="h-3 w-3 rounded-full bg-success/60" />
              <span className="ml-4 text-xs text-muted-foreground">phantom-layer.app/dashboard</span>
            </div>
            <div className="aspect-[16/9] bg-gradient-to-br from-card via-card to-secondary/20 p-8">
              <div className="flex h-full flex-col gap-4">
                {/* Mock dashboard header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/20" />
                    <div className="h-4 w-32 rounded bg-muted" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-24 rounded-lg bg-primary/20" />
                  </div>
                </div>
                
                {/* Mock stats grid */}
                <div className="grid flex-1 grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-lg border border-border/40 bg-secondary/30 p-4">
                      <div className="mb-2 h-3 w-16 rounded bg-muted/60" />
                      <div className="h-6 w-24 rounded bg-muted" />
                    </div>
                  ))}
                </div>
                
                {/* Mock threat list */}
                <div className="flex-1 rounded-lg border border-border/40 bg-secondary/30 p-4">
                  <div className="mb-4 h-4 w-24 rounded bg-muted" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center justify-between rounded bg-background/50 p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full bg-primary/60" />
                          <div className="h-3 w-48 rounded bg-muted/60" />
                        </div>
                        <div className="h-3 w-16 rounded bg-muted/40" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
