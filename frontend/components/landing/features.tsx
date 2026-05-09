import { 
  Shield, 
  Fingerprint, 
  Globe, 
  Cookie, 
  Wifi, 
  Eye,
  RefreshCw,
  Wallet
} from 'lucide-react'

const features = [
  {
    icon: Fingerprint,
    title: 'Fingerprint Masking',
    description: 'Randomize your browser fingerprint on every request. Canvas, WebGL, audio context, and more are dynamically masked.',
  },
  {
    icon: Globe,
    title: 'DNS Leak Protection',
    description: 'All DNS queries are encrypted and routed through our privacy-preserving resolvers. No leaks, no logs.',
  },
  {
    icon: Cookie,
    title: 'Tracker Blocking',
    description: 'Block tracking pixels, analytics scripts, and ad networks before they load. Over 100k trackers in our database.',
  },
  {
    icon: Wifi,
    title: 'WebRTC Shield',
    description: 'Prevent WebRTC IP leaks that bypass VPNs. Your real IP stays hidden even during video calls.',
  },
  {
    icon: Eye,
    title: 'Canvas Protection',
    description: 'Block canvas fingerprinting attempts that create unique identifiers based on your graphics rendering.',
  },
  {
    icon: RefreshCw,
    title: 'Wallet Rotation',
    description: 'Automatically rotate to new ghost wallets to prevent transaction-based tracking. One-click rotation.',
  },
  {
    icon: Wallet,
    title: 'Ghost Wallets',
    description: 'Generate disposable Solana wallets for payments. No connection to your main wallet or identity.',
  },
  {
    icon: Shield,
    title: 'Real-time Protection',
    description: 'See threats blocked in real-time with per-request cost transparency. Full visibility, no surprises.',
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-border/40 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Complete privacy protection
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every vector of tracking and fingerprinting, blocked. Every protection 
            paid for with micropayments you control.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border/60 bg-card p-6 transition-all hover:border-primary/40 hover:bg-card/80"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
