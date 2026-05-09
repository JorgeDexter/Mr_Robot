import { Wallet, Shield, Zap, RotateCcw } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Wallet,
    title: 'Connect or Create',
    description: 'Connect your Phantom wallet or create a disposable ghost wallet. No account needed, no email required.',
  },
  {
    step: '02',
    icon: Shield,
    title: 'Enable Protection',
    description: 'Turn on real-time privacy protection. Watch as trackers and fingerprinting attempts are blocked instantly.',
  },
  {
    step: '03',
    icon: Zap,
    title: 'Pay Per Use',
    description: 'Micropayments are deducted automatically via x402 protocol. Average cost: $0.002 per threat blocked.',
  },
  {
    step: '04',
    icon: RotateCcw,
    title: 'Rotate Anytime',
    description: 'Rotate to a new ghost wallet with one click. Your protection continues, your trail disappears.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border/40 bg-secondary/20 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Privacy protection in four simple steps. No subscriptions, 
            no commitments, no tracking.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-8 top-0 hidden h-full w-px bg-border lg:block" />
            
            <div className="space-y-12 lg:space-y-16">
              {steps.map((step, index) => (
                <div key={step.step} className="relative flex gap-6 lg:gap-10">
                  {/* Step number */}
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border bg-card text-sm font-mono text-muted-foreground">
                    {step.step}
                    {/* Dot on line */}
                    <div className="absolute -bottom-1 left-1/2 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-background bg-primary lg:block" />
                  </div>
                  
                  {/* Content */}
                  <div className={`flex-1 rounded-xl border border-border/60 bg-card p-6 ${index % 2 === 1 ? 'lg:ml-8' : ''}`}>
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
