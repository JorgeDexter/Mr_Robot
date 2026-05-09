import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, ArrowRight } from 'lucide-react'

const pricingItems = [
  { action: 'Per threat blocked', price: '$0.002', unit: 'USDC' },
  { action: 'Per minute of protection', price: '$0.0001', unit: 'USDC' },
  { action: 'Per DNS query protected', price: '$0.00005', unit: 'USDC' },
  { action: 'Per fingerprint mask', price: '$0.001', unit: 'USDC' },
]

const benefits = [
  'No monthly subscription',
  'No minimum commitment',
  'No account required',
  'Full cost transparency',
  'Instant activation',
  'Cancel anytime (just stop)',
]

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-border/40 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Pay for what you use
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No subscriptions. No hidden fees. Just transparent micropayments 
            for each protection action. Most users spend less than $0.50/day.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-2">
          {/* Pricing table */}
          <div className="rounded-xl border border-border/60 bg-card p-8">
            <h3 className="mb-6 text-lg font-semibold">Transparent pricing</h3>
            <div className="space-y-4">
              {pricingItems.map((item) => (
                <div
                  key={item.action}
                  className="flex items-center justify-between border-b border-border/40 pb-4 last:border-0 last:pb-0"
                >
                  <span className="text-muted-foreground">{item.action}</span>
                  <div className="text-right">
                    <span className="font-mono text-lg font-semibold">{item.price}</span>
                    <span className="ml-1 text-xs text-muted-foreground">{item.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-lg bg-primary/10 p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Average daily cost</span>
                <div>
                  <span className="font-mono text-2xl font-bold text-primary">$0.42</span>
                  <span className="ml-1 text-sm text-muted-foreground">/day</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Based on typical browsing with 200 threats blocked per day
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="rounded-xl border border-primary/40 bg-card p-8">
            <h3 className="mb-6 text-lg font-semibold">Why micropayments?</h3>
            <div className="mb-8 space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-border/40 bg-secondary/30 p-4">
              <h4 className="mb-2 font-medium">Compare to subscriptions</h4>
              <p className="text-sm text-muted-foreground">
                Traditional privacy VPNs cost $10-15/month. With PHANTOM LAYER, 
                the average user pays <span className="font-semibold text-primary">$12.60/month</span> - 
                and only when actively using it.
              </p>
            </div>

            <Link href="/dashboard" className="mt-6 block">
              <Button className="w-full gap-2">
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              No credit card. Fund your wallet when ready.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
