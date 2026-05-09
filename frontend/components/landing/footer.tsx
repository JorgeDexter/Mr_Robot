import Link from 'next/link'
import { Shield } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">PHANTOM LAYER</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="#features" className="transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </Link>
            <Link href="/dashboard" className="transition-colors hover:text-foreground">
              Dashboard
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Documentation
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              GitHub
            </Link>
          </nav>

          <div className="text-sm text-muted-foreground">
            Built on Solana
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PHANTOM LAYER. Privacy is not a privilege.</p>
        </div>
      </div>
    </footer>
  )
}
