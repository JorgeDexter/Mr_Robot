import React from 'react';
import { Shield, ArrowRight, Lock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />

      {/* Radial glow behind shield */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/[0.04] blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full shield-border bg-secondary/50 mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
            Privacy-First AI Module
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
        >
          <span className="text-foreground">Your Face.</span>
          <br />
          <span className="text-gradient">Your Control.</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed mb-10"
        >
          FaceShield is a local-first AI system that lets you register your face,
          generate privacy-preserving embeddings, and prepare for real-time anonymization
          — all without sending a single byte to the cloud.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href="#demo"
            className="group flex items-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_40px_hsl(162_72%_46%/0.25)] hover:-translate-y-0.5"
          >
            Launch Demo
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#architecture"
            className="flex items-center gap-2 px-7 py-3.5 rounded-lg bg-secondary/60 text-secondary-foreground font-semibold text-sm shield-border transition-all duration-300 hover:bg-secondary"
          >
            View Architecture
          </a>
        </motion.div>

        {/* Shield Icon Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 100 }}
          className="relative inline-block"
        >
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/10 animate-pulse-glow" />
            <div className="absolute inset-3 rounded-full border border-primary/20" />

            {/* Center shield */}
            <div className="absolute inset-6 rounded-full bg-secondary/60 flex items-center justify-center shield-border">
              <Shield className="w-16 h-16 sm:w-20 sm:h-20 text-primary drop-shadow-[0_0_20px_hsl(162_72%_46%/0.3)]" />

              {/* Scan line effect */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-scan" />
              </div>
            </div>

            {/* Orbiting icons */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 p-2 rounded-full bg-card shield-border animate-float">
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 p-2 rounded-full bg-card shield-border animate-float animation-delay-400">
              <Eye className="w-4 h-4 text-primary" />
            </div>
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 sm:gap-12"
        >
          {[
            { value: '100%', label: 'Local Processing' },
            { value: '<50ms', label: 'Encoding Speed' },
            { value: '128-d', label: 'Face Vectors' },
            { value: 'REST', label: 'API-First' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gradient">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
